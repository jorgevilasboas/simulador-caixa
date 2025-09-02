import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, User, Building, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    leads: 0,
    empreendimentos: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [usersRes, leadsRes, empreendimentosRes] = await Promise.all([
        axios.get('/api/users'),
        axios.get('/api/leads'),
        axios.get('/api/empreendimentos')
      ]);

      setStats({
        users: usersRes.data.length,
        leads: leadsRes.data.length,
        empreendimentos: empreendimentosRes.data.length
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    } finally {
      setLoading(false);
    }
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
      <h1 className="page-title">Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <Users size={32} color="#007bff" style={{ marginBottom: '10px' }} />
          <div className="stat-number">{stats.users}</div>
          <div className="stat-label">Usuários</div>
        </div>
        
        <div className="stat-card">
          <User size={32} color="#28a745" style={{ marginBottom: '10px' }} />
          <div className="stat-number">{stats.leads}</div>
          <div className="stat-label">Leads</div>
        </div>
        
        <div className="stat-card">
          <Building size={32} color="#ffc107" style={{ marginBottom: '10px' }} />
          <div className="stat-number">{stats.empreendimentos}</div>
          <div className="stat-label">Empreendimentos</div>
        </div>
      </div>

      <div className="card">
        <h2 className="section-title">Bem-vindo ao Simulador Caixa</h2>
        <p style={{ color: '#666', lineHeight: '1.6' }}>
          Este sistema permite gerenciar usuários, leads e empreendimentos para o simulador da Caixa.
          Use o menu de navegação acima para acessar as diferentes funcionalidades.
        </p>
        
        <div style={{ marginTop: '20px' }}>
          <h3 style={{ color: '#333', marginBottom: '10px' }}>Funcionalidades disponíveis:</h3>
          <ul style={{ color: '#666', lineHeight: '1.8' }}>
            <li><strong>Usuários:</strong> Gerenciar contas de usuários do sistema</li>
            <li><strong>Leads:</strong> Cadastrar e gerenciar leads de clientes</li>
            <li><strong>Empreendimentos:</strong> Importar e gerenciar empreendimentos via PDF</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

