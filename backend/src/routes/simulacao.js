const express = require('express');
const { body, validationResult } = require('express-validator');
const { get } = require('../database/connection');
const auth = require('../middleware/auth');

const router = express.Router();

// Realizar simulação
router.post('/', auth, [
  body('leadId').isInt().withMessage('ID do lead deve ser um número inteiro'),
  body('empreendimentoId').isInt().withMessage('ID do empreendimento deve ser um número inteiro'),
  body('dadosSimulacao.renda').isNumeric().withMessage('Renda deve ser um número'),
  body('dadosSimulacao.dataNascimento').notEmpty().withMessage('Data de nascimento é obrigatória'),
  body('dadosSimulacao.temTresAnos').isIn(['SIM', 'NÃO']).withMessage('Campo temTresAnos deve ser SIM ou NÃO'),
  body('dadosSimulacao.temDependente').isIn(['SIM', 'NÃO']).withMessage('Campo temDependente deve ser SIM ou NÃO')
], async (req, res) => {
  try {
    console.log('Dados recebidos na simulação:', JSON.stringify(req.body, null, 2));
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Erros de validação:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { leadId, empreendimentoId, dadosSimulacao } = req.body;

    // Buscar lead
    const lead = await get('SELECT * FROM leads WHERE id = ? AND usuario_id = ?', [leadId, req.user.id]);
    if (!lead) {
      return res.status(404).json({ error: 'Lead não encontrado' });
    }

    // Buscar empreendimento
    const empreendimento = await get('SELECT * FROM empreendimentos WHERE id = ? AND usuario_id = ?', [empreendimentoId, req.user.id]);
    if (!empreendimento) {
      return res.status(404).json({ error: 'Empreendimento não encontrado' });
    }

    // Realizar cálculos da simulação
    console.log('Chamando calcularSimulacao com:', { dadosSimulacao, empreendimento });
    const resultadoSimulacao = await calcularSimulacao(dadosSimulacao, empreendimento);
    console.log('Resultado da simulação:', resultadoSimulacao);

    res.json({
      message: 'Simulação realizada com sucesso',
      lead: {
        id: lead.id,
        nome: lead.nome,
        telefone: lead.telefone,
        email: lead.email
      },
      empreendimento: {
        id: empreendimento.id,
        nome: empreendimento.nome,
        construtora: empreendimento.construtora,
        cidade: empreendimento.cidade
      },
      resultado: resultadoSimulacao
    });

  } catch (error) {
    console.error('Simulação error:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Função para calcular a simulação
async function calcularSimulacao(dados, empreendimento) {
  try {
    console.log('Iniciando cálculo da simulação com dados:', dados);
    
    const {
      renda,
      fgts,
      dataNascimento,
      temTresAnos,
      temDependente,
      comprometimentoRenda,
      tabelaFinanciamento,
      valorImovel,
      valorAvaliacao,
      origemRecurso,
      faixaMcmv
    } = dados;

  // Cálculos básicos baseados no script VBA
  console.log('Valores recebidos:', { valorImovel, valorAvaliacao, renda, fgts });
  
  const valorImovelNum = parseFloat(valorImovel) || 0;
  const valorAvaliacaoNum = parseFloat(valorAvaliacao) || valorImovelNum;
  const rendaNum = parseFloat(renda) || 0;
  const fgtsNum = parseFloat(fgts) || 0;
  
  console.log('Valores convertidos:', { valorImovelNum, valorAvaliacaoNum, rendaNum, fgtsNum });
  
  // Comprometimento da renda (padrão 30% se não informado)
  const comprometimento = parseFloat(comprometimentoRenda) || 30;
  const prestacaoMaxima = (rendaNum * comprometimento) / 100;
  
  // Taxa de juros (definida uma vez para usar em todos os cálculos)
  const taxaJuros = 0.004; // 0.4% ao mês (aproximado)

  // Determinar origem do recurso e faixa
  let origemRecursoFinal = origemRecurso;
  let faixaMcmvFinal = faixaMcmv;

  if (origemRecurso === 'FGTS' || origemRecurso === 'FAIXA 3') {
    if (origemRecurso === 'FGTS') {
      faixaMcmvFinal = 'FAIXA 2';
    } else if (origemRecurso === 'FAIXA 3') {
      faixaMcmvFinal = 'FAIXA 3';
    }
    origemRecursoFinal = 'FGTS - FUNDO DE GARANTIA POR TEMPO DE SERVICO';
  }

  // Cálculo do valor da entrada (baseado no script VBA)
  let valorEntrada = valorImovelNum * 0.1; // 10% como entrada padrão
  
  // Se tem FGTS e é maior que a entrada, usar FGTS como entrada
  if (fgtsNum > valorEntrada) {
    valorEntrada = fgtsNum;
  }

  // Valor do financiamento
  const valorFinanciamento = valorImovelNum - valorEntrada;

  // Cálculo da prestação (simplificado)
  let prestacao = 0;
  let prazo = 360; // 30 anos padrão

  console.log('Iniciando cálculos de prestação:', { valorFinanciamento, tabelaFinanciamento });

  if (valorFinanciamento <= 0) {
    throw new Error('Valor do financiamento deve ser maior que zero');
  }

  if (tabelaFinanciamento === 'PRICE') {
    // Cálculo PRICE simplificado
    const fator = Math.pow(1 + taxaJuros, prazo);
    if (fator <= 1) {
      throw new Error('Erro no cálculo PRICE: fator inválido');
    }
    prestacao = valorFinanciamento * (taxaJuros * fator) / (fator - 1);
    console.log('Cálculo PRICE:', { taxaJuros, fator, prestacao });
  } else {
    // Cálculo SAC simplificado
    const amortizacao = valorFinanciamento / prazo;
    prestacao = amortizacao + (valorFinanciamento * taxaJuros);
    console.log('Cálculo SAC:', { taxaJuros, amortizacao, prestacao });
  }

  // Subsídio (apenas para FGTS)
  let subsidio = 0;
  if (origemRecursoFinal.includes('FGTS')) {
    // Subsídio baseado na faixa MCMV
    if (faixaMcmvFinal === 'FAIXA 2') {
      subsidio = valorImovelNum * 0.15; // 15% de subsídio para faixa 2
    } else if (faixaMcmvFinal === 'FAIXA 3') {
      subsidio = valorImovelNum * 0.10; // 10% de subsídio para faixa 3
    }
  }

  // Ajustar prestação considerando subsídio
  if (subsidio > 0) {
    const valorFinanciamentoComSubsidio = valorFinanciamento - subsidio;
    console.log('Ajustando prestação com subsídio:', { subsidio, valorFinanciamentoComSubsidio });
    
    if (valorFinanciamentoComSubsidio <= 0) {
      throw new Error('Valor do financiamento com subsídio deve ser maior que zero');
    }
    
    if (tabelaFinanciamento === 'PRICE') {
      const fator = Math.pow(1 + taxaJuros, prazo);
      if (fator <= 1) {
        throw new Error('Erro no cálculo PRICE com subsídio: fator inválido');
      }
      prestacao = valorFinanciamentoComSubsidio * (taxaJuros * fator) / (fator - 1);
    } else {
      const amortizacao = valorFinanciamentoComSubsidio / prazo;
      prestacao = amortizacao + (valorFinanciamentoComSubsidio * taxaJuros);
    }
  }

  // Verificar se a prestação não excede o comprometimento da renda
  if (prestacao > prestacaoMaxima) {
    console.log('Ajustando prazo - prestação excede limite:', { prestacao, prestacaoMaxima });
    
    // Ajustar prazo para caber no orçamento
    const prestacaoMaximaAjustada = prestacaoMaxima * 0.8; // 80% da prestação máxima
    if (prestacaoMaximaAjustada <= 0) {
      throw new Error('Prestação máxima ajustada deve ser maior que zero');
    }
    
    prazo = Math.ceil(valorFinanciamento / prestacaoMaximaAjustada);
    if (prazo > 360) prazo = 360; // Máximo 30 anos
    if (prazo < 1) prazo = 1; // Mínimo 1 mês
    
    console.log('Novo prazo calculado:', prazo);
    
    // Recalcular prestação com novo prazo
    if (tabelaFinanciamento === 'PRICE') {
      const fator = Math.pow(1 + taxaJuros, prazo);
      if (fator <= 1) {
        throw new Error('Erro no recálculo PRICE: fator inválido');
      }
      prestacao = valorFinanciamento * (taxaJuros * fator) / (fator - 1);
    } else {
      const amortizacao = valorFinanciamento / prazo;
      prestacao = amortizacao + (valorFinanciamento * taxaJuros);
    }
  }

  return {
    valorImovel: valorImovelNum,
    valorAvaliacao: valorAvaliacaoNum,
    valorFinanciamento: valorFinanciamento,
    valorEntrada: valorEntrada,
    subsidio: subsidio,
    prestacao: Math.round(prestacao * 100) / 100,
    prazo: prazo,
    tabela: tabelaFinanciamento,
    origemRecurso: origemRecursoFinal,
    faixaMcmv: faixaMcmvFinal,
    prestacaoMaxima: Math.round(prestacaoMaxima * 100) / 100,
    comprometimentoRenda: comprometimento,
    observacoes: [
      'Simulação baseada em cálculos aproximados',
      'Valores podem variar conforme condições do momento',
      'Consulte sempre as condições atualizadas no site da Caixa',
      'Taxa de juros utilizada: 0,4% ao mês (aproximada)'
    ]
  };
  
  } catch (error) {
    console.error('Erro no cálculo da simulação:', error);
    throw new Error(`Erro no cálculo: ${error.message}`);
  }
}

module.exports = router;
