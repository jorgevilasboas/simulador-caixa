#!/bin/bash

echo "🚀 Configurando o Simulador Caixa..."

# Verificar se o Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não está instalado. Por favor, instale o Node.js versão 16 ou superior."
    exit 1
fi

echo "✅ Node.js encontrado"

# Instalar dependências
echo "📦 Instalando dependências..."
npm run install-all

# Configurar variáveis de ambiente
echo "⚙️ Configurando variáveis de ambiente..."
if [ ! -f "backend/.env" ]; then
    cp backend/env.example backend/.env
    echo "📝 Arquivo .env criado."
else
    echo "📝 Arquivo .env já existe."
fi

# Executar migrações
echo "🔄 Executando migrações do banco de dados..."
cd backend
npm run migrate
cd ..

echo "✅ Setup concluído!"
echo ""
echo "📋 Próximos passos:"
echo "1. Execute 'npm run dev' para iniciar a aplicação"
echo "2. Acesse http://localhost:3000 no seu navegador"
echo ""
echo "🎉 Sistema pronto para uso!"
