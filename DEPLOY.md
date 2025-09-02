# Guia de Deploy - Simulador Caixa

## Deploy em Produção

### 1. Preparação do Servidor

#### Requisitos do Servidor
- **Sistema Operacional**: Ubuntu 20.04+ ou CentOS 8+
- **Node.js**: Versão 16 ou superior
- **PostgreSQL**: Versão 12 ou superior
- **Nginx**: Para proxy reverso
- **PM2**: Para gerenciamento de processos Node.js

#### Instalação de Dependências

```bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Instalar PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Instalar Nginx
sudo apt install nginx -y

# Instalar PM2 globalmente
sudo npm install -g pm2
```

### 2. Configuração do Banco de Dados

```bash
# Acessar PostgreSQL
sudo -u postgres psql

# Criar banco e usuário
CREATE DATABASE simulador_caixa;
CREATE USER simulador_user WITH PASSWORD 'sua_senha_segura';
GRANT ALL PRIVILEGES ON DATABASE simulador_caixa TO simulador_user;
\q
```

### 3. Deploy da Aplicação

#### Clone e Setup

```bash
# Clonar repositório
git clone <url-do-repositorio> /var/www/simulador-caixa
cd /var/www/simulador-caixa

# Instalar dependências
npm run install-all

# Configurar variáveis de ambiente
cp backend/env.example backend/.env
nano backend/.env
```

#### Configuração do .env (Produção)

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=simulador_caixa
DB_USER=simulador_user
DB_PASSWORD=sua_senha_segura

# JWT Secret (GERE UMA CHAVE FORTE)
JWT_SECRET=sua_chave_jwt_muito_segura_aqui

# Server Configuration
PORT=5000
NODE_ENV=production

# CORS Configuration
CORS_ORIGIN=https://seudominio.com
```

#### Build e Migração

```bash
# Build do frontend
cd frontend
npm run build
cd ..

# Executar migrações
cd backend
npm run migrate
cd ..
```

### 4. Configuração do PM2

#### Criar arquivo ecosystem.config.js

```javascript
module.exports = {
  apps: [{
    name: 'simulador-caixa-backend',
    script: 'backend/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: '/var/log/simulador-caixa/err.log',
    out_file: '/var/log/simulador-caixa/out.log',
    log_file: '/var/log/simulador-caixa/combined.log',
    time: true
  }]
};
```

#### Iniciar com PM2

```bash
# Criar diretório de logs
sudo mkdir -p /var/log/simulador-caixa
sudo chown -R $USER:$USER /var/log/simulador-caixa

# Iniciar aplicação
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 5. Configuração do Nginx

#### Criar configuração do site

```bash
sudo nano /etc/nginx/sites-available/simulador-caixa
```

#### Conteúdo da configuração

```nginx
server {
    listen 80;
    server_name seudominio.com www.seudominio.com;

    # Redirecionar para HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name seudominio.com www.seudominio.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/seudominio.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/seudominio.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Frontend (React)
    location / {
        root /var/www/simulador-caixa/frontend/build;
        try_files $uri $uri/ /index.html;
        
        # Cache static files
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Rate limiting
        limit_req zone=api burst=20 nodelay;
        limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    }

    # Health check
    location /health {
        proxy_pass http://localhost:5000/api/health;
        access_log off;
    }
}
```

#### Ativar configuração

```bash
sudo ln -s /etc/nginx/sites-available/simulador-caixa /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 6. SSL com Let's Encrypt

```bash
# Instalar Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obter certificado SSL
sudo certbot --nginx -d seudominio.com -d www.seudominio.com

# Renovação automática
sudo crontab -e
# Adicionar: 0 12 * * * /usr/bin/certbot renew --quiet
```

### 7. Firewall

```bash
# Configurar UFW
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
```

### 8. Monitoramento

#### Logs

```bash
# Ver logs da aplicação
pm2 logs simulador-caixa-backend

# Ver logs do Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

#### Monitoramento com PM2

```bash
# Dashboard do PM2
pm2 monit

# Status dos processos
pm2 status

# Reiniciar aplicação
pm2 restart simulador-caixa-backend
```

### 9. Backup

#### Script de backup automático

```bash
#!/bin/bash
# /var/scripts/backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/simulador-caixa"

# Criar diretório de backup
mkdir -p $BACKUP_DIR

# Backup do banco de dados
pg_dump -h localhost -U simulador_user simulador_caixa > $BACKUP_DIR/db_backup_$DATE.sql

# Backup dos arquivos
tar -czf $BACKUP_DIR/files_backup_$DATE.tar.gz /var/www/simulador-caixa

# Manter apenas os últimos 7 backups
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
```

#### Agendar backup

```bash
sudo crontab -e
# Adicionar: 0 2 * * * /var/scripts/backup.sh
```

### 10. Atualizações

#### Script de deploy

```bash
#!/bin/bash
# /var/scripts/deploy.sh

cd /var/www/simulador-caixa

# Pull das mudanças
git pull origin main

# Instalar dependências
npm run install-all

# Build do frontend
cd frontend && npm run build && cd ..

# Executar migrações
cd backend && npm run migrate && cd ..

# Reiniciar aplicação
pm2 restart simulador-caixa-backend

echo "Deploy concluído!"
```

### 11. Troubleshooting

#### Problemas Comuns

1. **Aplicação não inicia**
   ```bash
   pm2 logs simulador-caixa-backend
   sudo systemctl status nginx
   ```

2. **Erro de conexão com banco**
   ```bash
   sudo -u postgres psql -d simulador_caixa
   ```

3. **Problemas de SSL**
   ```bash
   sudo certbot certificates
   sudo nginx -t
   ```

4. **Logs de erro**
   ```bash
   sudo tail -f /var/log/nginx/error.log
   pm2 logs simulador-caixa-backend --err
   ```

### 12. Performance

#### Otimizações

1. **Compressão Gzip**
   ```nginx
   gzip on;
   gzip_vary on;
   gzip_min_length 1024;
   gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
   ```

2. **Cache do Nginx**
   ```nginx
   location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
       expires 1y;
       add_header Cache-Control "public, immutable";
   }
   ```

3. **PM2 Cluster Mode**
   ```javascript
   instances: 'max',
   exec_mode: 'cluster'
   ```

### 13. Segurança

#### Checklist

- [ ] Firewall configurado
- [ ] SSL/TLS ativo
- [ ] Headers de segurança
- [ ] Rate limiting
- [ ] Senhas fortes
- [ ] Logs monitorados
- [ ] Backups automáticos
- [ ] Atualizações regulares

