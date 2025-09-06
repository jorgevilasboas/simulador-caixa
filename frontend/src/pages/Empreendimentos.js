import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, Search, Building, Upload, FileText } from 'lucide-react';
import EmpreendimentoModal from '../components/EmpreendimentoModal';

const Empreendimentos = () => {
  const [empreendimentos, setEmpreendimentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingEmpreendimento, setEditingEmpreendimento] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchEmpreendimentos();
  }, []);

  const fetchEmpreendimentos = async () => {
    try {
      const response = await axios.get('/api/empreendimentos');
      setEmpreendimentos(response.data);
    } catch (error) {
      toast.error('Erro ao carregar empreendimentos');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este empreendimento?')) {
      return;
    }

    try {
      await axios.delete(`/api/empreendimentos/${id}`);
      toast.success('Empreendimento excluído com sucesso');
      fetchEmpreendimentos();
    } catch (error) {
      toast.error('Erro ao excluir empreendimento');
    }
  };

  const handleEdit = (empreendimento) => {
    setEditingEmpreendimento(empreendimento);
    setShowModal(true);
  };

  const handleCreate = () => {
    setEditingEmpreendimento(null);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingEmpreendimento(null);
  };

  const handleModalSave = () => {
    fetchEmpreendimentos();
    handleModalClose();
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Apenas arquivos PDF são permitidos');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const response = await axios.post('/api/empreendimentos/upload-pdf', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      toast.success(response.data.message);
      fetchEmpreendimentos();
    } catch (error) {
      const message = error.response?.data?.error || 'Erro ao fazer upload do PDF';
      toast.error(message);
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const filteredEmpreendimentos = empreendimentos.filter(emp =>
    emp.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.construtora?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.cidade?.toLowerCase().includes(searchTerm.toLowerCase())
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
      <h1 className="page-title">Gerenciar Empreendimentos</h1>

      <div className="actions-bar">
        <div className="search-box">
          <Search size={16} />
          <input
            type="text"
            className="search-input"
            placeholder="Buscar empreendimentos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="d-flex gap-2">
          <label className="btn btn-secondary" style={{ cursor: 'pointer', margin: 0 }}>
            <Upload size={16} style={{ marginRight: '5px' }} />
            Importar PDF
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
              disabled={uploading}
            />
          </label>
          <button className="btn btn-primary" onClick={handleCreate}>
            <Plus size={16} style={{ marginRight: '5px' }} />
            Novo Empreendimento
          </button>
        </div>
      </div>

      {uploading && (
        <div className="card" style={{ marginBottom: '20px' }}>
          <div className="d-flex align-items-center gap-2">
            <div className="spinner" style={{ width: '20px', height: '20px' }}></div>
            <span>Processando PDF...</span>
          </div>
        </div>
      )}

      {filteredEmpreendimentos.length === 0 ? (
        <div className="empty-state">
          <Building size={48} className="empty-state-icon" />
          <h3 className="empty-state-title">Nenhum empreendimento encontrado</h3>
          <p className="empty-state-text">
            {searchTerm ? 'Tente ajustar sua busca' : 'Comece criando um novo empreendimento ou importando um PDF'}
          </p>
          {!searchTerm && (
            <div className="d-flex gap-2" style={{ justifyContent: 'center' }}>
              <label className="btn btn-secondary" style={{ cursor: 'pointer' }}>
                <FileText size={16} style={{ marginRight: '5px' }} />
                Importar PDF
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
              </label>
              <button className="btn btn-primary" onClick={handleCreate}>
                <Plus size={16} style={{ marginRight: '5px' }} />
                Criar Empreendimento
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Construtora</th>
                <th>Cidade</th>
                <th>Valor do Imóvel</th>
                <th>Valor da Avaliação</th>
                <th>Área Útil</th>
                <th>Tipologia</th>
                <th>Data Entrega</th>
                <th>Faixa MCMV</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmpreendimentos.map((emp) => (
                <tr key={emp.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Building size={16} color="#666" />
                      {emp.nome}
                    </div>
                  </td>
                  <td>{emp.construtora || '-'}</td>
                  <td>{emp.cidade || '-'}</td>
                  <td>{formatCurrency(emp.valor_imovel)}</td>
                  <td>{formatCurrency(emp.valor_avaliacao)}</td>
                  <td>{emp.area_util ? `${emp.area_util} m²` : '-'}</td>
                  <td>{emp.tipologia || '-'}</td>
                  <td>{formatDate(emp.data_entrega)}</td>
                  <td>
                    <span className="badge badge-info">
                      {emp.faixa_mcmv || '-'}
                    </span>
                  </td>
                  <td>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-secondary"
                        onClick={() => handleEdit(emp)}
                        style={{ padding: '5px 10px', fontSize: '12px' }}
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(emp.id)}
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
        <EmpreendimentoModal
          empreendimento={editingEmpreendimento}
          onClose={handleModalClose}
          onSave={handleModalSave}
        />
      )}
    </div>
  );
};

export default Empreendimentos;

