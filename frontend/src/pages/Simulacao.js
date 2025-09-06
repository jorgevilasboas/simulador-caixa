import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Calculator, User, Building, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';

const Simulacao = () => {
  const [leads, setLeads] = useState([]);
  const [empreendimentos, setEmpreendimentos] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [selectedEmpreendimento, setSelectedEmpreendimento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [simulando, setSimulando] = useState(false);
  const [resultadoSimulacao, setResultadoSimulacao] = useState(null);

  // Dados do formulário de simulação
  const [formData, setFormData] = useState({
    renda: '',
    fgts: '',
    dataNascimento: '',
    temTresAnos: '',
    temDependente: '',
    comprometimentoRenda: '',
    tabelaFinanciamento: 'PRICE'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [leadsResponse, empreendimentosResponse] = await Promise.all([
        axios.get('/api/leads'),
        axios.get('/api/empreendimentos')
      ]);
      
      setLeads(leadsResponse.data);
      setEmpreendimentos(empreendimentosResponse.data);
    } catch (error) {
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleLeadSelect = (lead) => {
    setSelectedLead(lead);
    setFormData({
      ...formData,
      renda: lead.renda || '',
      dataNascimento: lead.data_nascimento || '',
      temDependente: lead.tem_dependentes ? 'SIM' : 'NÃO',
      fgts: lead.valor_entrada || ''
    });
  };

  const handleEmpreendimentoSelect = (empreendimento) => {
    setSelectedEmpreendimento(empreendimento);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    if (!selectedLead) {
      toast.error('Selecione um lead');
      return false;
    }
    if (!selectedEmpreendimento) {
      toast.error('Selecione um empreendimento');
      return false;
    }
    if (!formData.renda) {
      toast.error('Preencha a renda');
      return false;
    }
    if (!formData.dataNascimento) {
      toast.error('Preencha a data de nascimento');
      return false;
    }
    if (!formData.temTresAnos) {
      toast.error('Informe se tem 3 anos de carteira assinada');
      return false;
    }
    if (!formData.temDependente) {
      toast.error('Informe se tem dependente');
      return false;
    }
    return true;
  };

  const handleSimular = async () => {
    if (!validateForm()) return;

    setSimulando(true);
    try {
      const simulacaoData = {
        leadId: selectedLead.id,
        empreendimentoId: selectedEmpreendimento.id,
        dadosSimulacao: {
          renda: parseFloat(formData.renda) || 0,
          fgts: parseFloat(formData.fgts) || 0,
          dataNascimento: formData.dataNascimento,
          temTresAnos: formData.temTresAnos,
          temDependente: formData.temDependente,
          comprometimentoRenda: parseFloat(formData.comprometimentoRenda) || 30,
          tabelaFinanciamento: formData.tabelaFinanciamento,
          valorImovel: parseFloat(selectedEmpreendimento.valor_imovel) || 0,
          valorAvaliacao: parseFloat(selectedEmpreendimento.valor_avaliacao) || parseFloat(selectedEmpreendimento.valor_imovel) || 0,
          cidade: selectedEmpreendimento.cidade || '',
          construtora: selectedEmpreendimento.construtora || '',
          nomeEmpreendimento: selectedEmpreendimento.nome || '',
          areaUtil: parseFloat(selectedEmpreendimento.area_util) || 0,
          prazoObra: parseFloat(selectedEmpreendimento.prazo_obra) || 0,
          dataEntrega: selectedEmpreendimento.data_entrega || '',
          mensais: selectedEmpreendimento.mensais || '',
          origemRecurso: selectedEmpreendimento.origem_recurso || 'FGTS',
          faixaMcmv: selectedEmpreendimento.faixa_mcmv || 'FAIXA 2'
        }
      };

      console.log('Dados da simulação sendo enviados:', simulacaoData);

      const response = await axios.post('/api/simulacao', simulacaoData);
      console.log('Resposta completa do backend:', response.data);
      setResultadoSimulacao(response.data.resultado);
      toast.success('Simulação realizada com sucesso!');
    } catch (error) {
      console.error('Erro na simulação:', error);
      
      if (error.response) {
        // Erro do servidor
        const errorMessage = error.response.data?.error || error.response.data?.message || 'Erro do servidor';
        toast.error(`Erro: ${errorMessage}`);
        console.error('Detalhes do erro:', error.response.data);
      } else if (error.request) {
        // Erro de rede
        toast.error('Erro de conexão. Verifique se o servidor está rodando.');
        console.error('Erro de rede:', error.request);
      } else {
        // Outro erro
        toast.error('Erro inesperado ao realizar simulação');
        console.error('Erro:', error.message);
      }
    } finally {
      setSimulando(false);
    }
  };

  const formatCurrency = (value) => {
    if (!value) return 'R$ 0,00';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <h1 className="page-title">
        <Calculator size={24} style={{ marginRight: '10px' }} />
        Simulação de Financiamento
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
        {/* Seleção de Lead */}
        <div className="card">
          <h3 className="section-title">
            <User size={20} style={{ marginRight: '8px' }} />
            Selecionar Lead
          </h3>
          
          <div className="form-group">
            <label className="form-label">Escolha um lead:</label>
            <select 
              className="form-control"
              value={selectedLead?.id || ''}
              onChange={(e) => {
                const leadId = parseInt(e.target.value);
                const lead = leads.find(l => l.id === leadId);
                handleLeadSelect(lead);
              }}
            >
              <option value="">Selecione um lead...</option>
              {leads.map(lead => (
                <option key={lead.id} value={lead.id}>
                  {lead.nome} - {lead.telefone}
                </option>
              ))}
            </select>
          </div>

          {selectedLead && (
            <div className="lead-info" style={{ 
              background: '#f8f9fa', 
              padding: '15px', 
              borderRadius: '8px', 
              marginTop: '15px' 
            }}>
              <h4>Dados do Lead:</h4>
              <p><strong>Nome:</strong> {selectedLead.nome}</p>
              <p><strong>Telefone:</strong> {selectedLead.telefone}</p>
              <p><strong>Email:</strong> {selectedLead.email || 'Não informado'}</p>
              <p><strong>Data Nascimento:</strong> {formatDate(selectedLead.data_nascimento)}</p>
              <p><strong>Renda:</strong> {formatCurrency(selectedLead.renda)}</p>
              <p><strong>Dependentes:</strong> {selectedLead.tem_dependentes ? 'Sim' : 'Não'}</p>
              <p><strong>FGTS:</strong> {selectedLead.tem_fgts ? 'Sim' : 'Não'}</p>
            </div>
          )}
        </div>

        {/* Seleção de Empreendimento */}
        <div className="card">
          <h3 className="section-title">
            <Building size={20} style={{ marginRight: '8px' }} />
            Selecionar Empreendimento
          </h3>
          
          <div className="form-group">
            <label className="form-label">Escolha um empreendimento:</label>
            <select 
              className="form-control"
              value={selectedEmpreendimento?.id || ''}
              onChange={(e) => {
                const empreendimentoId = parseInt(e.target.value);
                const empreendimento = empreendimentos.find(emp => emp.id === empreendimentoId);
                handleEmpreendimentoSelect(empreendimento);
              }}
            >
              <option value="">Selecione um empreendimento...</option>
              {empreendimentos.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.nome} - {emp.cidade}
                </option>
              ))}
            </select>
          </div>

          {selectedEmpreendimento && (
            <div className="empreendimento-info" style={{ 
              background: '#f8f9fa', 
              padding: '15px', 
              borderRadius: '8px', 
              marginTop: '15px' 
            }}>
              <h4>Dados do Empreendimento:</h4>
              <p><strong>Nome:</strong> {selectedEmpreendimento.nome}</p>
              <p><strong>Construtora:</strong> {selectedEmpreendimento.construtora}</p>
              <p><strong>Cidade:</strong> {selectedEmpreendimento.cidade}</p>
              <p><strong>Valor do Imóvel:</strong> {formatCurrency(selectedEmpreendimento.valor_imovel)}</p>
              <p><strong>Valor da Avaliação:</strong> {formatCurrency(selectedEmpreendimento.valor_avaliacao)}</p>
              <p><strong>Área Útil:</strong> {selectedEmpreendimento.area_util} m²</p>
              <p><strong>Tipologia:</strong> {selectedEmpreendimento.tipologia}</p>
              <p><strong>Data de Entrega:</strong> {formatDate(selectedEmpreendimento.data_entrega)}</p>
              <p><strong>Faixa MCMV:</strong> {selectedEmpreendimento.faixa_mcmv}</p>
            </div>
          )}
        </div>
      </div>

      {/* Formulário de Simulação */}
      {(selectedLead && selectedEmpreendimento) && (
        <div className="card">
          <h3 className="section-title">Dados para Simulação</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label">Renda Mensal *</label>
              <input
                type="number"
                name="renda"
                className="form-control"
                value={formData.renda}
                onChange={handleInputChange}
                placeholder="0,00"
                step="0.01"
                min="0"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Valor do FGTS</label>
              <input
                type="number"
                name="fgts"
                className="form-control"
                value={formData.fgts}
                onChange={handleInputChange}
                placeholder="0,00"
                step="0.01"
                min="0"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Data de Nascimento *</label>
              <input
                type="date"
                name="dataNascimento"
                className="form-control"
                value={formData.dataNascimento}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Comprometimento da Renda (%)</label>
              <input
                type="number"
                name="comprometimentoRenda"
                className="form-control"
                value={formData.comprometimentoRenda}
                onChange={handleInputChange}
                placeholder="30"
                min="0"
                max="100"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tem 3 anos de carteira assinada? *</label>
              <select
                name="temTresAnos"
                className="form-control"
                value={formData.temTresAnos}
                onChange={handleInputChange}
              >
                <option value="">Selecione</option>
                <option value="SIM">Sim</option>
                <option value="NÃO">Não</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Tem dependente? *</label>
              <select
                name="temDependente"
                className="form-control"
                value={formData.temDependente}
                onChange={handleInputChange}
              >
                <option value="">Selecione</option>
                <option value="SIM">Sim</option>
                <option value="NÃO">Não</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Tabela de Financiamento</label>
              <select
                name="tabelaFinanciamento"
                className="form-control"
                value={formData.tabelaFinanciamento}
                onChange={handleInputChange}
              >
                <option value="PRICE">PRICE</option>
                <option value="SAC">SAC</option>
              </select>
            </div>
          </div>

          <div style={{ marginTop: '30px', textAlign: 'center' }}>
            <button 
              className="btn btn-primary btn-lg"
              onClick={handleSimular}
              disabled={simulando}
              style={{ 
                padding: '15px 30px', 
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                margin: '0 auto'
              }}
            >
              {simulando ? (
                <>
                  <div className="spinner" style={{ width: '20px', height: '20px' }}></div>
                  Simulando...
                </>
              ) : (
                <>
                  <Calculator size={20} />
                  Realizar Simulação
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Resultado da Simulação */}
      {resultadoSimulacao && (
        <div className="card" style={{ marginTop: '30px' }}>
          <h3 className="section-title">
            <CheckCircle size={20} style={{ marginRight: '8px', color: '#28a745' }} />
            Resultado da Simulação
          </h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="simulation-result">
              <h4>Dados do Financiamento</h4>
              <p><strong>Valor do Imóvel:</strong> {formatCurrency(resultadoSimulacao.valorImovel)}</p>
              <p><strong>Valor da Avaliação:</strong> {formatCurrency(resultadoSimulacao.valorAvaliacao)}</p>
              <p><strong>Valor do Financiamento:</strong> {formatCurrency(resultadoSimulacao.valorFinanciamento)}</p>
              <p><strong>Valor da Entrada:</strong> {formatCurrency(resultadoSimulacao.valorEntrada)}</p>
              <p><strong>Subsídio:</strong> {formatCurrency(resultadoSimulacao.subsidio)}</p>
            </div>
            
            <div className="simulation-result">
              <h4>Condições do Financiamento</h4>
              <p><strong>Prestação:</strong> {formatCurrency(resultadoSimulacao.prestacao)}</p>
              <p><strong>Prazo:</strong> {resultadoSimulacao.prazo} meses</p>
              <p><strong>Tabela:</strong> {resultadoSimulacao.tabela}</p>
              <p><strong>Origem do Recurso:</strong> {resultadoSimulacao.origemRecurso}</p>
              <p><strong>Faixa MCMV:</strong> {resultadoSimulacao.faixaMcmv}</p>
            </div>
          </div>

          <div style={{ marginTop: '20px', padding: '15px', background: '#e7f3ff', borderRadius: '8px' }}>
            <h4 style={{ color: '#0066cc', marginBottom: '10px' }}>
              <AlertCircle size={16} style={{ marginRight: '5px' }} />
              Informações Importantes
            </h4>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li>Esta simulação é baseada nos dados fornecidos e pode variar conforme as condições do momento</li>
              <li>Consulte sempre as condições atualizadas no site da Caixa</li>
              <li>Valores sujeitos a alteração sem aviso prévio</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Simulacao;
