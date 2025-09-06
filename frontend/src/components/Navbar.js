import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, User, Users, Building, Home, Calculator } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <div className="navbar-brand">
          Simulador Caixa
        </div>
        
        <ul className="navbar-nav">
          <li>
            <Link 
              to="/" 
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
            >
              <Home size={16} style={{ marginRight: '5px' }} />
              Dashboard
            </Link>
          </li>
          <li>
            <Link 
              to="/users" 
              className={`nav-link ${isActive('/users') ? 'active' : ''}`}
            >
              <Users size={16} style={{ marginRight: '5px' }} />
              Usuários
            </Link>
          </li>
          <li>
            <Link 
              to="/leads" 
              className={`nav-link ${isActive('/leads') ? 'active' : ''}`}
            >
              <User size={16} style={{ marginRight: '5px' }} />
              Leads
            </Link>
          </li>
          <li>
            <Link 
              to="/empreendimentos" 
              className={`nav-link ${isActive('/empreendimentos') ? 'active' : ''}`}
            >
              <Building size={16} style={{ marginRight: '5px' }} />
              Empreendimentos
            </Link>
          </li>
          <li>
            <Link 
              to="/simulacao" 
              className={`nav-link ${isActive('/simulacao') ? 'active' : ''}`}
            >
              <Calculator size={16} style={{ marginRight: '5px' }} />
              Simulação
            </Link>
          </li>
        </ul>

        <div className="d-flex align-items-center gap-2">
          <span>Olá, {user?.nome}</span>
          <button 
            onClick={logout} 
            className="btn btn-secondary"
            style={{ padding: '8px 12px', fontSize: '12px' }}
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

