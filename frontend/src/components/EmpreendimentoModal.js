import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';

const EmpreendimentoModal = ({ empreendimento, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nome: '',
    construtora: '',
    cidade: '',
    endereco: '',
    categoria: '',
    faixa_mcmv: '',
    valor_imovel: '',
    valor_avaliacao: '',
    area_util: '',
    tipologia: '',
    prazo_obra: '',
    data_entrega: '',
    mensais: '',
    origem_recurso: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (empreendimento) {
      setFormData({
        nome: empreendimento.nome || '',
        construtora: empreendimento.construtora || '',
        cidade: empreendimento.cidade || '',
        endereco: empreendimento.endereco || '',
        categoria: empreendimento.categoria || '',
        faixa_mcmv: empreendimento.faixa_mcmv || '',
        valor_imovel: empreendimento.valor_imovel || '',
        valor_avaliacao: empreendimento.valor_avaliacao || '',
        area_util: empreendimento.area_util || '',
        tipologia: empreendimento.tipologia || '',
        prazo_obra: empreendimento.prazo_obra || '',
        data_entrega: empreendimento.data_entrega ? empreendimento.data_entrega.split('T')[0] : '',
        mensais: empreendimento.mensais || '',
        origem_recurso: empreendimento.origem_recurso || ''
      });
    }
  }, [empreendimento]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        valor_imovel: formData.valor_imovel ? parseFloat(formData.valor_imovel) : null,
        valor_avaliacao: formData.valor_avaliacao ? parseFloat(formData.valor_avaliacao) : null,
        area_util: formData.area_util ? parseFloat(formData.area_util) : null,
        prazo_obra: formData.prazo_obra ? parseInt(formData.prazo_obra) : null,
        mensais: formData.mensais ? parseInt(formData.mensais) : null
      };

      if (empreendimento) {
        await axios.put(`/api/empreendimentos/${empreendimento.id}`, submitData);
        toast.success('Empreendimento atualizado com sucesso');
      } else {
        await axios.post('/api/empreendimentos', submitData);
        toast.success('Empreendimento criado com sucesso');
      }
      onSave();
    } catch (error) {
      const message = error.response?.data?.error || 'Erro ao salvar empreendimento';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  return (
    <div className="modal">
      <div className="modal-content" style={{ maxWidth: '600px' }}>
        <div className="modal-header">
          <h2 className="modal-title">
            {empreendimento ? 'Editar Empreendimento' : 'Novo Empreendimento'}
          </h2>
          <button className="close" onClick={onClose}>
            <X />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label">Nome *</label>
              <input
                type="text"
                name="nome"
                className="form-control"
                value={formData.nome}
                onChange={handleChange}
                required
                placeholder="Nome do empreendimento"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Construtora</label>
              <input
                type="text"
                name="construtora"
                className="form-control"
                value={formData.construtora}
                onChange={handleChange}
                placeholder="Nome da construtora"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Cidade</label>
              <input
                type="text"
                name="cidade"
                className="form-control"
                value={formData.cidade}
                onChange={handleChange}
                placeholder="Cidade"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Faixa MCMV</label>
              <select
                name="faixa_mcmv"
                className="form-control"
                value={formData.faixa_mcmv}
                onChange={handleChange}
              >
                <option value="">Selecione</option>
                <option value="FAIXA 1">Faixa 1</option>
                <option value="FAIXA 2">Faixa 2</option>
                <option value="FAIXA 3">Faixa 3</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Valor do Imóvel</label>
              <input
                type="number"
                name="valor_imovel"
                className="form-control"
                value={formData.valor_imovel}
                onChange={handleChange}
                placeholder="0,00"
                step="0.01"
                min="0"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Valor da Avaliação</label>
              <input
                type="number"
                name="valor_avaliacao"
                className="form-control"
                value={formData.valor_avaliacao}
                onChange={handleChange}
                placeholder="0,00"
                step="0.01"
                min="0"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Área Útil (m²)</label>
              <input
                type="number"
                name="area_util"
                className="form-control"
                value={formData.area_util}
                onChange={handleChange}
                placeholder="0"
                step="0.01"
                min="0"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Tipologia</label>
              <input
                type="text"
                name="tipologia"
                className="form-control"
                value={formData.tipologia}
                onChange={handleChange}
                placeholder="Ex: 2 quartos, 1 suíte"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Prazo da Obra (meses)</label>
              <input
                type="number"
                name="prazo_obra"
                className="form-control"
                value={formData.prazo_obra}
                onChange={handleChange}
                placeholder="0"
                min="0"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Data de Entrega</label>
              <input
                type="date"
                name="data_entrega"
                className="form-control"
                value={formData.data_entrega}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Mensais</label>
              <input
                type="number"
                name="mensais"
                className="form-control"
                value={formData.mensais}
                onChange={handleChange}
                placeholder="0"
                min="0"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Origem do Recurso</label>
              <select
                name="origem_recurso"
                className="form-control"
                value={formData.origem_recurso}
                onChange={handleChange}
              >
                <option value="">Selecione</option>
                <option value="FGTS">FGTS</option>
                <option value="SBPE">SBPE</option>
                <option value="FAIXA 3">Faixa 3</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Endereço</label>
            <textarea
              name="endereco"
              className="form-control"
              value={formData.endereco}
              onChange={handleChange}
              placeholder="Endereço completo"
              rows="3"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Categoria</label>
            <input
              type="text"
              name="categoria"
              className="form-control"
              value={formData.categoria}
              onChange={handleChange}
              placeholder="Categoria do imóvel"
            />
          </div>

          <div className="d-flex gap-2" style={{ marginTop: '20px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              style={{ flex: 1 }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ flex: 1 }}
            >
              {loading ? (
                <div className="spinner" style={{ width: '16px', height: '16px', margin: '0 auto' }}></div>
              ) : (
                empreendimento ? 'Atualizar' : 'Criar'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmpreendimentoModal;

