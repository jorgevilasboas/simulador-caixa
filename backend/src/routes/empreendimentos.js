const express = require('express');
const multer = require('multer');
const pdf = require('pdf-parse');
const { body, validationResult } = require('express-validator');
const { query, run, get } = require('../database/connection');
const auth = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Apenas arquivos PDF são permitidos'), false);
    }
  },
});

// Get all empreendimentos for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const empreendimentos = await query(
      'SELECT * FROM empreendimentos WHERE usuario_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(empreendimentos);
  } catch (error) {
    console.error('Get empreendimentos error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Get empreendimento by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const empreendimento = await get(
      'SELECT * FROM empreendimentos WHERE id = ? AND usuario_id = ?',
      [id, req.user.id]
    );

    if (!empreendimento) {
      return res.status(404).json({ error: 'Empreendimento não encontrado' });
    }

    res.json(empreendimento);
  } catch (error) {
    console.error('Get empreendimento error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Create new empreendimento manually
router.post('/', auth, [
  body('nome').notEmpty().withMessage('Nome é obrigatório'),
  body('construtora').optional(),
  body('cidade').optional(),
  body('endereco').optional(),
  body('categoria').optional(),
  body('faixa_mcmv').optional(),
  body('valor_imovel').optional().isNumeric().withMessage('Valor do imóvel deve ser um número'),
  body('valor_avaliacao').optional().isNumeric().withMessage('Valor da avaliação deve ser um número'),
  body('area_util').optional().isNumeric().withMessage('Área útil deve ser um número'),
  body('tipologia').optional(),
  body('prazo_obra').optional().isInt().withMessage('Prazo da obra deve ser um número inteiro'),
  body('data_entrega').optional().isISO8601().withMessage('Data de entrega inválida'),
  body('mensais').optional().isInt().withMessage('Mensais deve ser um número inteiro'),
  body('origem_recurso').optional(),
  body('dados_adicional').optional().isObject().withMessage('Dados adicionais devem ser um objeto')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      nome,
      construtora,
      cidade,
      endereco,
      categoria,
      faixa_mcmv,
      valor_imovel,
      valor_avaliacao,
      area_util,
      tipologia,
      prazo_obra,
      data_entrega,
      mensais,
      origem_recurso,
      dados_adicional
    } = req.body;

    const result = await run(
      `INSERT INTO empreendimentos (
        nome, construtora, cidade, endereco, categoria, faixa_mcmv,
        valor_imovel, valor_avaliacao, area_util, tipologia, prazo_obra,
        data_entrega, mensais, origem_recurso, dados_adicional, usuario_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nome, construtora, cidade, endereco, categoria, faixa_mcmv,
        valor_imovel, valor_avaliacao, area_util, tipologia, prazo_obra,
        data_entrega, mensais, origem_recurso, 
        dados_adicional ? JSON.stringify(dados_adicional) : null,
        req.user.id
      ]
    );

    // Get the created empreendimento
    const empreendimento = await get('SELECT * FROM empreendimentos WHERE id = ?', [result.id]);

    res.status(201).json({
      message: 'Empreendimento criado com sucesso',
      empreendimento: empreendimento
    });
  } catch (error) {
    console.error('Create empreendimento error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Upload PDF and extract empreendimentos
router.post('/upload-pdf', auth, upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo PDF foi enviado' });
    }

    // Parse PDF content
    const pdfData = await pdf(req.file.buffer);
    const text = pdfData.text;

    // Extract empreendimentos from PDF text
    const empreendimentos = extractEmpreendimentosFromPDF(text);

    if (empreendimentos.length === 0) {
      return res.status(400).json({ error: 'Nenhum empreendimento encontrado no PDF' });
    }

    // Insert empreendimentos into database
    const insertedEmpreendimentos = [];
    for (const emp of empreendimentos) {
      const result = await run(
        `INSERT INTO empreendimentos (
          nome, construtora, cidade, endereco, categoria, faixa_mcmv,
          valor_imovel, valor_avaliacao, area_util, tipologia, prazo_obra,
          data_entrega, mensais, origem_recurso, dados_adicional, usuario_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          emp.nome || 'Empreendimento Importado',
          emp.construtora || null,
          emp.cidade || null,
          emp.endereco || null,
          emp.categoria || null,
          emp.faixa_mcmv || null,
          emp.valor_imovel || null,
          emp.valor_avaliacao || null,
          emp.area_util || null,
          emp.tipologia || null,
          emp.prazo_obra || null,
          emp.data_entrega || null,
          emp.mensais || null,
          emp.origem_recurso || null,
          emp.dados_adicional ? JSON.stringify(emp.dados_adicional) : null,
          req.user.id
        ]
      );

      const insertedEmp = await get('SELECT * FROM empreendimentos WHERE id = ?', [result.id]);
      insertedEmpreendimentos.push(insertedEmp);
    }

    res.status(201).json({
      message: `${insertedEmpreendimentos.length} empreendimentos importados com sucesso`,
      empreendimentos: insertedEmpreendimentos
    });
  } catch (error) {
    console.error('Upload PDF error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Update empreendimento
router.put('/:id', auth, [
  body('nome').optional().notEmpty().withMessage('Nome não pode estar vazio'),
  body('construtora').optional(),
  body('cidade').optional(),
  body('endereco').optional(),
  body('categoria').optional(),
  body('faixa_mcmv').optional(),
  body('valor_imovel').optional().isNumeric().withMessage('Valor do imóvel deve ser um número'),
  body('valor_avaliacao').optional().isNumeric().withMessage('Valor da avaliação deve ser um número'),
  body('area_util').optional().isNumeric().withMessage('Área útil deve ser um número'),
  body('tipologia').optional(),
  body('prazo_obra').optional().isInt().withMessage('Prazo da obra deve ser um número inteiro'),
  body('data_entrega').optional().isISO8601().withMessage('Data de entrega inválida'),
  body('mensais').optional().isInt().withMessage('Mensais deve ser um número inteiro'),
  body('origem_recurso').optional(),
  body('dados_adicional').optional().isObject().withMessage('Dados adicionais devem ser um objeto')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const {
      nome,
      construtora,
      cidade,
      endereco,
      categoria,
      faixa_mcmv,
      valor_imovel,
      valor_avaliacao,
      area_util,
      tipologia,
      prazo_obra,
      data_entrega,
      mensais,
      origem_recurso,
      dados_adicional
    } = req.body;

    // Check if empreendimento exists and belongs to user
    const existingEmp = await get('SELECT id FROM empreendimentos WHERE id = ? AND usuario_id = ?', [id, req.user.id]);
    if (!existingEmp) {
      return res.status(404).json({ error: 'Empreendimento não encontrado' });
    }

    // Build update query
    let updateQuery = 'UPDATE empreendimentos SET updated_at = CURRENT_TIMESTAMP';
    const params = [];

    if (nome !== undefined) {
      updateQuery += ', nome = ?';
      params.push(nome);
    }

    if (construtora !== undefined) {
      updateQuery += ', construtora = ?';
      params.push(construtora);
    }

    if (cidade !== undefined) {
      updateQuery += ', cidade = ?';
      params.push(cidade);
    }

    if (endereco !== undefined) {
      updateQuery += ', endereco = ?';
      params.push(endereco);
    }

    if (categoria !== undefined) {
      updateQuery += ', categoria = ?';
      params.push(categoria);
    }

    if (faixa_mcmv !== undefined) {
      updateQuery += ', faixa_mcmv = ?';
      params.push(faixa_mcmv);
    }

    if (valor_imovel !== undefined) {
      updateQuery += ', valor_imovel = ?';
      params.push(valor_imovel);
    }

    if (valor_avaliacao !== undefined) {
      updateQuery += ', valor_avaliacao = ?';
      params.push(valor_avaliacao);
    }

    if (area_util !== undefined) {
      updateQuery += ', area_util = ?';
      params.push(area_util);
    }

    if (tipologia !== undefined) {
      updateQuery += ', tipologia = ?';
      params.push(tipologia);
    }

    if (prazo_obra !== undefined) {
      updateQuery += ', prazo_obra = ?';
      params.push(prazo_obra);
    }

    if (data_entrega !== undefined) {
      updateQuery += ', data_entrega = ?';
      params.push(data_entrega);
    }

    if (mensais !== undefined) {
      updateQuery += ', mensais = ?';
      params.push(mensais);
    }

    if (origem_recurso !== undefined) {
      updateQuery += ', origem_recurso = ?';
      params.push(origem_recurso);
    }

    if (dados_adicional !== undefined) {
      updateQuery += ', dados_adicional = ?';
      params.push(JSON.stringify(dados_adicional));
    }

    updateQuery += ' WHERE id = ?';
    params.push(id);

    await run(updateQuery, params);

    // Get updated empreendimento
    const updatedEmp = await get('SELECT * FROM empreendimentos WHERE id = ?', [id]);

    res.json({
      message: 'Empreendimento atualizado com sucesso',
      empreendimento: updatedEmp
    });
  } catch (error) {
    console.error('Update empreendimento error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Delete empreendimento
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if empreendimento exists and belongs to user
    const existingEmp = await get('SELECT id FROM empreendimentos WHERE id = ? AND usuario_id = ?', [id, req.user.id]);
    if (!existingEmp) {
      return res.status(404).json({ error: 'Empreendimento não encontrado' });
    }

    // Delete empreendimento
    await run('DELETE FROM empreendimentos WHERE id = ?', [id]);

    res.json({ message: 'Empreendimento deletado com sucesso' });
  } catch (error) {
    console.error('Delete empreendimento error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Helper function to extract empreendimentos from PDF text
function extractEmpreendimentosFromPDF(text) {
  const empreendimentos = [];
  
  // Split text into lines
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  let currentEmpreendimento = null;
  
  for (const line of lines) {
    // Look for keywords that indicate a new empreendimento
    if (line.toLowerCase().includes('empreendimento') || 
        line.toLowerCase().includes('residencial') || 
        line.toLowerCase().includes('condomínio')) {
      
      if (currentEmpreendimento) {
        empreendimentos.push(currentEmpreendimento);
      }
      
      currentEmpreendimento = {
        nome: line,
        construtora: null,
        cidade: null,
        endereco: null,
        categoria: null,
        faixa_mcmv: null,
        valor_imovel: null,
        valor_avaliacao: null,
        area_util: null,
        tipologia: null,
        prazo_obra: null,
        data_entrega: null,
        mensais: null,
        origem_recurso: null,
        dados_adicional: {}
      };
    }
    
    if (currentEmpreendimento) {
      // Extract valor_imovel (R$ X.XXX,XX format)
      const valorMatch = line.match(/R\$\s*([\d.,]+)/);
      if (valorMatch && !currentEmpreendimento.valor_imovel) {
        currentEmpreendimento.valor_imovel = parseFloat(valorMatch[1].replace(/\./g, '').replace(',', '.'));
      }
      
      // Extract area_util (XX,XX m² format)
      const areaMatch = line.match(/(\d+[.,]\d+)\s*m²/);
      if (areaMatch && !currentEmpreendimento.area_util) {
        currentEmpreendimento.area_util = parseFloat(areaMatch[1].replace(',', '.'));
      }
      
      // Extract cidade
      if (line.toLowerCase().includes('cidade') || line.toLowerCase().includes('localização')) {
        currentEmpreendimento.cidade = line.split(':')[1]?.trim() || line;
      }
      
      // Extract construtora
      if (line.toLowerCase().includes('construtora') || line.toLowerCase().includes('incorporadora')) {
        currentEmpreendimento.construtora = line.split(':')[1]?.trim() || line;
      }
    }
  }
  
  // Add the last empreendimento
  if (currentEmpreendimento) {
    empreendimentos.push(currentEmpreendimento);
  }
  
  return empreendimentos;
}

module.exports = router;
