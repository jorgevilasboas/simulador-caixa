# Docker Guide - Simulador Caixa

## 🐳 Docker Setup

Este guia irá ajudá-lo a configurar e executar o Simulador Caixa usando Docker, além de resolver problemas comuns do Docker Desktop no macOS.

## 🔧 Fixing Docker Desktop Issues

### Problema: "Cannot resize Docker.raw: permission denied"

Este é um problema comum no macOS. Aqui estão as soluções:

### Solução 1: Reset Docker Desktop

1. **Quit Docker Desktop completamente**
   - Clique com o botão direito no ícone do Docker na barra de menu
   - Selecione "Quit Docker Desktop"

2. **Reset para configurações padrão**
   - Abra o Docker Desktop
   - Vá em Settings (ícone de engrenagem)
   - Clique em "Troubleshoot" na barra lateral
   - Clique em "Reset to factory defaults"
   - Confirme o reset

3. **Aguarde o Docker inicializar**
   - O Docker irá baixar e configurar uma nova VM
   - Isso pode levar alguns minutos

### Solução 2: Reset Manual (se a Solução 1 não funcionar)

```bash
# Parar Docker Desktop
killall Docker

# Remover dados do Docker (isso apagará todos os containers e imagens)
rm -rf ~/Library/Containers/com.docker.docker
rm -rf ~/Library/Application\ Support/Docker\ Desktop
rm -rf ~/.docker

# Reiniciar Docker Desktop
open -a Docker
```

### Solução 3: Limpar Disco

```bash
# Verificar espaço em disco
df -h

# Limpar cache do Docker
docker system prune -a --volumes

# Limpar volumes não utilizados
docker volume prune
```

### Solução 4: Reinstalar Docker Desktop

1. Baixe a versão mais recente do Docker Desktop para macOS
2. Desinstale a versão atual
3. Instale a nova versão
4. Configure as permissões necessárias

## 🚀 Usando Docker com o Projeto

### Opção 1: Setup Automático

```bash
# Executar o script de setup
./docker-setup.sh
```

### Opção 2: Setup Manual

```bash
# 1. Verificar se o Docker está rodando
docker info

# 2. Construir e iniciar todos os serviços
docker-compose up --build -d

# 3. Verificar status dos serviços
docker-compose ps

# 4. Ver logs
docker-compose logs -f
```

## 📋 Comandos Docker Úteis

### Gerenciamento de Containers

```bash
# Ver containers rodando
docker-compose ps

# Ver logs de todos os serviços
docker-compose logs -f

# Ver logs de um serviço específico
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres

# Parar todos os serviços
docker-compose down

# Parar e remover volumes
docker-compose down -v

# Reiniciar serviços
docker-compose restart

# Reconstruir e reiniciar
docker-compose up --build -d
```

### Acesso aos Containers

```bash
# Acessar container do backend
docker-compose exec backend sh

# Acessar container do frontend
docker-compose exec frontend sh

# Acessar banco de dados PostgreSQL
docker-compose exec postgres psql -U postgres -d simulador_caixa
```

### Backup e Restore

```bash
# Backup do banco de dados
docker-compose exec postgres pg_dump -U postgres simulador_caixa > backup.sql

# Restore do banco de dados
docker-compose exec -T postgres psql -U postgres simulador_caixa < backup.sql
```

## 🌐 URLs de Acesso

Após iniciar os containers:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **pgAdmin**: http://localhost:5050
  - Email: admin@admin.com
  - Senha: admin

## 🔍 Troubleshooting

### Problema: Containers não iniciam

```bash
# Verificar logs detalhados
docker-compose logs

# Verificar se as portas estão disponíveis
lsof -i :3000
lsof -i :5000
lsof -i :5432

# Verificar uso de recursos
docker stats
```

### Problema: Banco de dados não conecta

```bash
# Verificar se o PostgreSQL está rodando
docker-compose exec postgres pg_isready -U postgres

# Verificar logs do PostgreSQL
docker-compose logs postgres

# Testar conexão
docker-compose exec postgres psql -U postgres -d simulador_caixa -c "SELECT 1;"
```

### Problema: Frontend não carrega

```bash
# Verificar se o backend está respondendo
curl http://localhost:5000/api/health

# Verificar logs do frontend
docker-compose logs frontend

# Reconstruir frontend
docker-compose up --build frontend
```

### Problema: Permissões no macOS

```bash
# Verificar permissões do Docker
ls -la ~/Library/Containers/com.docker.docker/

# Corrigir permissões
sudo chown -R $USER:$USER ~/Library/Containers/com.docker.docker/
```

## 🔧 Configuração Avançada

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Database
POSTGRES_DB=simulador_caixa
POSTGRES_USER=postgres
POSTGRES_PASSWORD=sua_senha_segura

# Backend
JWT_SECRET=sua_chave_jwt_muito_segura
NODE_ENV=development

# Frontend
REACT_APP_API_URL=http://localhost:5000
```

### Volumes Persistentes

Os dados do PostgreSQL são persistidos no volume `postgres_data`. Para backup:

```bash
# Backup do volume
docker run --rm -v simulador-caixa_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres_backup.tar.gz -C /data .

# Restore do volume
docker run --rm -v simulador-caixa_postgres_data:/data -v $(pwd):/backup alpine tar xzf /backup/postgres_backup.tar.gz -C /data
```

### Otimizações de Performance

```yaml
# Adicionar ao docker-compose.yml
services:
  backend:
    deploy:
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M
    environment:
      - NODE_OPTIONS=--max-old-space-size=512
```

## 🚀 Deploy em Produção

### Docker Compose para Produção

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: simulador_caixa
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - simulador-network
    restart: unless-stopped

  backend:
    build: ./backend
    environment:
      DB_HOST: postgres
      DB_PORT: 5432
      DB_NAME: simulador_caixa
      DB_USER: ${DB_USER}
      DB_PASSWORD: ${DB_PASSWORD}
      JWT_SECRET: ${JWT_SECRET}
      NODE_ENV: production
    depends_on:
      - postgres
    networks:
      - simulador-network
    restart: unless-stopped

  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - simulador-network
    restart: unless-stopped

volumes:
  postgres_data:

networks:
  simulador-network:
    driver: bridge
```

### Script de Deploy

```bash
#!/bin/bash
# deploy.sh

# Pull das mudanças
git pull origin main

# Build das imagens
docker-compose -f docker-compose.prod.yml build

# Deploy
docker-compose -f docker-compose.prod.yml up -d

# Limpar imagens antigas
docker image prune -f

echo "Deploy concluído!"
```

## 📚 Recursos Adicionais

- [Docker Desktop para Mac](https://docs.docker.com/desktop/mac/)
- [Docker Compose](https://docs.docker.com/compose/)
- [PostgreSQL Docker](https://hub.docker.com/_/postgres)
- [Node.js Docker](https://hub.docker.com/_/node)
