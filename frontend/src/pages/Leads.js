import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, Search, User, Phone, Mail } from 'lucide-react';
import LeadModal from '../components/LeadModal';

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingLead, setEditingLead] = useState(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await axios.get('/api/leads');
      setLeads(response.data);
    } catch (error) {
      toast.error('Erro ao carregar leads');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este lead?')) {
      return;
    }

    try {
      await axios.delete(`/api/leads/${id}`);
      toast.success('Lead excluído com sucesso');
      fetchLeads();
    } catch (error) {
      toast.error('Erro ao excluir lead');
    }
  };

  const handleEdit = (lead) => {
    setEditingLead(lead);
    setShowModal(true);
  };

  const handleCreate = () => {
    setEditingLead(null);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingLead(null);
  };

  const handleModalSave = () => {
    fetchLeads();
    handleModalClose();
  };

  const filteredLeads = leads.filter(lead =>
    lead.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.telefone.includes(searchTerm)
  );

  const formatCurrency = (value) => {
    if (!value) return '-';
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date) => {
    if (!date) return '-';
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
      <h1 className="page-title">Gerenciar Leads</h1>

      <div className="actions-bar">
        <div className="search-box">
          <Search size={16} />
          <input
            type="text"
            className="search-input"
            placeholder="Buscar leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn btn-primary" onClick={handleCreate}>
          <Plus size={16} style={{ marginRight: '5px' }} />
          Novo Lead
        </button>
      </div>

      {filteredLeads.length === 0 ? (
        <div className="empty-state">
          <User size={48} className="empty-state-icon" />
          <h3 className="empty-state-title">Nenhum lead encontrado</h3>
          <p className="empty-state-text">
            {searchTerm ? 'Tente ajustar sua busca' : 'Comece criando um novo lead'}
          </p>
          {!searchTerm && (
            <button className="btn btn-primary" onClick={handleCreate}>
              <Plus size={16} style={{ marginRight: '5px' }} />
              Criar Lead
            </button>
          )}
        </div>
      ) : (
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Telefone</th>
                <th>Email</th>
                <th>Renda</th>
                <th>Valor Entrada</th>
                <th>Dependentes</th>
                <th>FGTS</th>
                <th>Data Criação</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => (
                <tr key={lead.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <User size={16} color="#666" />
                      {lead.nome}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Phone size={16} color="#666" />
                      {lead.telefone}
                    </div>
                  </td>
                  <td>
                    {lead.email ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Mail size={16} color="#666" />
                        {lead.email}
                      </div>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td>{formatCurrency(lead.renda)}</td>
                  <td>{formatCurrency(lead.valor_entrada)}</td>
                  <td>
                    <span className={`badge ${lead.tem_dependentes ? 'badge-success' : 'badge-secondary'}`}>
                      {lead.tem_dependentes ? 'Sim' : 'Não'}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${lead.tem_fgts ? 'badge-success' : 'badge-secondary'}`}>
                      {lead.tem_fgts ? 'Sim' : 'Não'}
                    </span>
                  </td>
                  <td>{formatDate(lead.created_at)}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-secondary"
                        onClick={() => handleEdit(lead)}
                        style={{ padding: '5px 10px', fontSize: '12px' }}
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(lead.id)}
                        style={{ padding: '5px 10px', fontSize: '12px' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <LeadModal
          lead={editingLead}
          onClose={handleModalClose}
          onSave={handleModalSave}
        />
      )}
    </div>
  );
};

export default Leads;

