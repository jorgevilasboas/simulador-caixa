#!/bin/bash

echo "🚀 Executando Simulador Caixa sem Docker..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não está instalado. Por favor, instale o Node.js versão 16 ou superior."
    exit 1
fi

echo "✅ Node.js encontrado"

# Install dependencies
echo "📦 Instalando dependências..."
npm run install-all

# Configure environment
echo "⚙️ Configurando variáveis de ambiente..."
if [ ! -f "backend/.env" ]; then
    cp backend/env.example backend/.env
    echo "📝 Arquivo .env criado."
else
    echo "📝 Arquivo .env já existe."
fi

# Run migrations
echo "🔄 Executando migrações do banco de dados..."
cd backend
npm run migrate
cd ..

echo "✅ Setup concluído!"
echo ""
echo "📋 Para iniciar a aplicação:"
echo "1. Terminal 1: cd backend && npm run dev"
echo "2. Terminal 2: cd frontend && npm start"
echo ""
echo "🌐 URLs de acesso:"
echo "   Frontend: http://localhost:3000"
echo "   Backend: http://localhost:5000"
echo ""
echo "🎉 Sistema pronto para uso!"
