import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { X } from 'lucide-react';

const LeadModal = ({ lead, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    email: '',
    data_nascimento: '',
    renda: '',
    tem_dependentes: false,
    tem_fgts: false,
    valor_entrada: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (lead) {
      setFormData({
        nome: lead.nome || '',
        telefone: lead.telefone || '',
        email: lead.email || '',
        data_nascimento: lead.data_nascimento ? lead.data_nascimento.split('T')[0] : '',
        renda: lead.renda || '',
        tem_dependentes: lead.tem_dependentes || false,
        tem_fgts: lead.tem_fgts || false,
        valor_entrada: lead.valor_entrada || ''
      });
    }
  }, [lead]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        renda: formData.renda ? parseFloat(formData.renda) : null,
        valor_entrada: formData.valor_entrada ? parseFloat(formData.valor_entrada) : null
      };

      if (lead) {
        await axios.put(`/api/leads/${lead.id}`, submitData);
        toast.success('Lead atualizado com sucesso');
      } else {
        await axios.post('/api/leads', submitData);
        toast.success('Lead criado com sucesso');
      }
      onSave();
    } catch (error) {
      const message = error.response?.data?.error || 'Erro ao salvar lead';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">
            {lead ? 'Editar Lead' : 'Novo Lead'}
          </h2>
          <button className="close" onClick={onClose}>
            <X />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nome *</label>
            <input
              type="text"
              name="nome"
              className="form-control"
              value={formData.nome}
              onChange={handleChange}
              required
              placeholder="Digite o nome completo"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Telefone *</label>
            <input
              type="tel"
              name="telefone"
              className="form-control"
              value={formData.telefone}
              onChange={handleChange}
              required
              placeholder="(11) 99999-9999"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              placeholder="email@exemplo.com"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Data de Nascimento</label>
            <input
              type="date"
              name="data_nascimento"
              className="form-control"
              value={formData.data_nascimento}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Renda Mensal</label>
            <input
              type="number"
              name="renda"
              className="form-control"
              value={formData.renda}
              onChange={handleChange}
              placeholder="0,00"
              step="0.01"
              min="0"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Valor da Entrada</label>
            <input
              type="number"
              name="valor_entrada"
              className="form-control"
              value={formData.valor_entrada}
              onChange={handleChange}
              placeholder="0,00"
              step="0.01"
              min="0"
            />
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', gap: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  name="tem_dependentes"
                  checked={formData.tem_dependentes}
                  onChange={handleChange}
                />
                Tem Dependentes
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="checkbox"
                  name="tem_fgts"
                  checked={formData.tem_fgts}
                  onChange={handleChange}
                />
                Tem FGTS
              </label>
            </div>
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
                lead ? 'Atualizar' : 'Criar'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeadModal;

