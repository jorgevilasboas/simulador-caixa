const express = require('express');
const { body, validationResult } = require('express-validator');
const { query, run, get } = require('../database/connection');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all leads for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const leads = await query(
      'SELECT * FROM leads WHERE usuario_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(leads);
  } catch (error) {
    console.error('Get leads error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Get lead by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const lead = await get(
      'SELECT * FROM leads WHERE id = ? AND usuario_id = ?',
      [id, req.user.id]
    );

    if (!lead) {
      return res.status(404).json({ error: 'Lead não encontrado' });
    }

    res.json(lead);
  } catch (error) {
    console.error('Get lead error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Create new lead
router.post('/', auth, [
  body('nome').notEmpty().withMessage('Nome é obrigatório'),
  body('telefone').notEmpty().withMessage('Telefone é obrigatório'),
  body('email').optional().isEmail().withMessage('Email inválido'),
  body('data_nascimento').optional().isISO8601().withMessage('Data de nascimento inválida'),
  body('renda').optional().isNumeric().withMessage('Renda deve ser um número'),
  body('tem_dependentes').optional().isBoolean().withMessage('Tem dependentes deve ser true ou false'),
  body('tem_fgts').optional().isBoolean().withMessage('Tem FGTS deve ser true ou false'),
  body('valor_entrada').optional().isNumeric().withMessage('Valor da entrada deve ser um número')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      nome,
      telefone,
      email,
      data_nascimento,
      renda,
      tem_dependentes,
      tem_fgts,
      valor_entrada
    } = req.body;

    const result = await run(
      `INSERT INTO leads (
        nome, telefone, email, data_nascimento, renda, 
        tem_dependentes, tem_fgts, valor_entrada, usuario_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [nome, telefone, email, data_nascimento, renda, tem_dependentes, tem_fgts, valor_entrada, req.user.id]
    );

    // Get the created lead
    const lead = await get('SELECT * FROM leads WHERE id = ?', [result.id]);

    res.status(201).json({
      message: 'Lead criado com sucesso',
      lead: lead
    });
  } catch (error) {
    console.error('Create lead error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Update lead
router.put('/:id', auth, [
  body('nome').optional().notEmpty().withMessage('Nome não pode estar vazio'),
  body('telefone').optional().notEmpty().withMessage('Telefone não pode estar vazio'),
  body('email').optional().isEmail().withMessage('Email inválido'),
  body('data_nascimento').optional().isISO8601().withMessage('Data de nascimento inválida'),
  body('renda').optional().isNumeric().withMessage('Renda deve ser um número'),
  body('tem_dependentes').optional().isBoolean().withMessage('Tem dependentes deve ser true ou false'),
  body('tem_fgts').optional().isBoolean().withMessage('Tem FGTS deve ser true ou false'),
  body('valor_entrada').optional().isNumeric().withMessage('Valor da entrada deve ser um número')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const {
      nome,
      telefone,
      email,
      data_nascimento,
      renda,
      tem_dependentes,
      tem_fgts,
      valor_entrada
    } = req.body;

    // Check if lead exists and belongs to user
    const existingLead = await get('SELECT id FROM leads WHERE id = ? AND usuario_id = ?', [id, req.user.id]);
    if (!existingLead) {
      return res.status(404).json({ error: 'Lead não encontrado' });
    }

    // Build update query
    let updateQuery = 'UPDATE leads SET updated_at = CURRENT_TIMESTAMP';
    const params = [];

    if (nome !== undefined) {
      updateQuery += ', nome = ?';
      params.push(nome);
    }

    if (telefone !== undefined) {
      updateQuery += ', telefone = ?';
      params.push(telefone);
    }

    if (email !== undefined) {
      updateQuery += ', email = ?';
      params.push(email);
    }

    if (data_nascimento !== undefined) {
      updateQuery += ', data_nascimento = ?';
      params.push(data_nascimento);
    }

    if (renda !== undefined) {
      updateQuery += ', renda = ?';
      params.push(renda);
    }

    if (tem_dependentes !== undefined) {
      updateQuery += ', tem_dependentes = ?';
      params.push(tem_dependentes ? 1 : 0);
    }

    if (tem_fgts !== undefined) {
      updateQuery += ', tem_fgts = ?';
      params.push(tem_fgts ? 1 : 0);
    }

    if (valor_entrada !== undefined) {
      updateQuery += ', valor_entrada = ?';
      params.push(valor_entrada);
    }

    updateQuery += ' WHERE id = ?';
    params.push(id);

    await run(updateQuery, params);

    // Get updated lead
    const updatedLead = await get('SELECT * FROM leads WHERE id = ?', [id]);

    res.json({
      message: 'Lead atualizado com sucesso',
      lead: updatedLead
    });
  } catch (error) {
    console.error('Update lead error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Delete lead
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if lead exists and belongs to user
    const existingLead = await get('SELECT id FROM leads WHERE id = ? AND usuario_id = ?', [id, req.user.id]);
    if (!existingLead) {
      return res.status(404).json({ error: 'Lead não encontrado' });
    }

    // Delete lead
    await run('DELETE FROM leads WHERE id = ?', [id]);

    res.json({ message: 'Lead deletado com sucesso' });
  } catch (error) {
    console.error('Delete lead error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;
