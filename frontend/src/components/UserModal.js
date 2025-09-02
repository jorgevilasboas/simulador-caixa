import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { X, Eye, EyeOff } from 'lucide-react';

const UserModal = ({ user, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        nome: user.nome,
        email: user.email,
        senha: ''
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (user) {
        // Update user
        const updateData = { ...formData };
        if (!updateData.senha) {
          delete updateData.senha;
        }
        await axios.put(`/api/users/${user.id}`, updateData);
        toast.success('Usuário atualizado com sucesso');
      } else {
        // Create user
        await axios.post('/api/users', formData);
        toast.success('Usuário criado com sucesso');
      }
      onSave();
    } catch (error) {
      const message = error.response?.data?.error || 'Erro ao salvar usuário';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">
            {user ? 'Editar Usuário' : 'Novo Usuário'}
          </h2>
          <button className="close" onClick={onClose}>
            <X />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nome</label>
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
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Digite o email"
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              {user ? 'Nova Senha (deixe em branco para manter)' : 'Senha'}
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="senha"
                className="form-control"
                value={formData.senha}
                onChange={handleChange}
                required={!user}
                minLength={user ? undefined : 6}
                placeholder={user ? 'Digite a nova senha' : 'Digite a senha (mín. 6 caracteres)'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#666'
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
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
                user ? 'Atualizar' : 'Criar'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;

