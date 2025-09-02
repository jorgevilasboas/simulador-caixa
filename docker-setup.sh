#!/bin/bash

echo "🐳 Configurando Simulador Caixa com Docker..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker não está rodando. Por favor, inicie o Docker Desktop primeiro."
    echo "💡 Dica: Abra o Docker Desktop e aguarde até que o ícone fique verde."
    exit 1
fi

echo "✅ Docker está rodando"

# Check if Docker Compose is available
if ! docker-compose --version > /dev/null 2>&1; then
    echo "❌ Docker Compose não está disponível."
    exit 1
fi

echo "✅ Docker Compose está disponível"

# Create .env file for backend if it doesn't exist
if [ ! -f "backend/.env" ]; then
    echo "📝 Criando arquivo .env para o backend..."
    cp backend/env.example backend/.env
    echo "✅ Arquivo .env criado"
fi

# Build and start containers
echo "🔨 Construindo e iniciando containers..."
docker-compose up --build -d

# Wait for services to be ready
echo "⏳ Aguardando serviços ficarem prontos..."
sleep 30

# Check if services are running
echo "🔍 Verificando status dos serviços..."

if docker-compose ps | grep -q "Up"; then
    echo "✅ Todos os serviços estão rodando!"
    echo ""
    echo "🌐 URLs de acesso:"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend API: http://localhost:5000"
    echo ""
    echo "📋 Comandos úteis:"
    echo "   Ver logs: docker-compose logs -f"
    echo "   Parar serviços: docker-compose down"
    echo "   Reiniciar: docker-compose restart"
    echo ""
    echo "🎉 Sistema pronto para uso!"
else
    echo "❌ Alguns serviços não estão rodando. Verifique os logs:"
    docker-compose logs
fi
