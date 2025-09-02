# Simulador Caixa - Sistema de Gerenciamento

Sistema completo para gerenciamento de usuários, leads e empreendimentos para o simulador da Caixa, desenvolvido com React (frontend) e Node.js (backend) com SQLite.

## 🏗️ Arquitetura

- **Frontend**: React 18 com React Router, Axios, React Hook Form
- **Backend**: Node.js com Express, JWT, bcrypt
- **Banco de Dados**: SQLite
- **Autenticação**: JWT (JSON Web Tokens)

## 🚀 Instalação

### Opção 1: Docker (Recomendado)

Se você tem Docker instalado, esta é a forma mais fácil:

```bash
# Executar setup automático
./docker-setup.sh
```

**Pré-requisitos:**
- Docker Desktop
- Docker Compose

**URLs de acesso:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

### Opção 2: Instalação Local

### Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd simulador-caixa
```

### 2. Configure as variáveis de ambiente do backend:
```bash
cd backend
cp env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
JWT_SECRET=sua_chave_secreta_jwt
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### 3. Instale as dependências

```bash
# Instalar dependências do projeto principal
npm install

# Instalar dependências do backend
cd backend
npm install

# Instalar dependências do frontend
cd ../frontend
npm install
```

### 4. Execute as migrações

```bash
cd backend
npm run migrate
```

### 5. Inicie a aplicação

```bash
# Na raiz do projeto
npm run dev
```

Isso iniciará:
- Backend na porta 5000
- Frontend na porta 3000

## 📋 Funcionalidades

### 🔐 Autenticação
- Registro de usuários
- Login com JWT
- Proteção de rotas

### 👥 Usuários
- CRUD completo de usuários
- Gerenciamento de perfis
- Alteração de senhas

### 📞 Leads
- Cadastro de leads com dados completos
- Informações de renda, dependentes, FGTS
- Valor de entrada
- Histórico de criação

### 🏢 Empreendimentos
- Cadastro manual de empreendimentos
- Importação via PDF
- Dados completos (valor, área, tipologia, etc.)
- Categorização por faixa MCMV

## 🗄️ Estrutura do Banco de Dados

### Tabela: usuarios
- `id` (SERIAL PRIMARY KEY)
- `nome` (VARCHAR)
- `email` (VARCHAR UNIQUE)
- `senha` (VARCHAR - hash bcrypt)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Tabela: leads
- `id` (SERIAL PRIMARY KEY)
- `nome` (VARCHAR)
- `telefone` (VARCHAR)
- `email` (VARCHAR - opcional)
- `data_nascimento` (DATE)
- `renda` (DECIMAL)
- `tem_dependentes` (BOOLEAN)
- `tem_fgts` (BOOLEAN)
- `valor_entrada` (DECIMAL)
- `usuario_id` (INTEGER - FK)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Tabela: empreendimentos
- `id` (SERIAL PRIMARY KEY)
- `nome` (VARCHAR)
- `construtora` (VARCHAR)
- `cidade` (VARCHAR)
- `endereco` (TEXT)
- `categoria` (VARCHAR)
- `faixa_mcmv` (VARCHAR)
- `valor_imovel` (DECIMAL)
- `valor_avaliacao` (DECIMAL)
- `area_util` (DECIMAL)
- `tipologia` (VARCHAR)
- `prazo_obra` (INTEGER)
- `data_entrega` (DATE)
- `mensais` (INTEGER)
- `origem_recurso` (VARCHAR)
- `dados_adicional` (JSONB)
- `usuario_id` (INTEGER - FK)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## 🔧 Scripts Disponíveis

### Projeto Principal
- `npm run dev` - Inicia frontend e backend em desenvolvimento
- `npm run server` - Inicia apenas o backend
- `npm run client` - Inicia apenas o frontend
- `npm run install-all` - Instala todas as dependências
- `npm run build` - Build do frontend para produção

### Backend
- `npm start` - Inicia o servidor em produção
- `npm run dev` - Inicia o servidor em desenvolvimento
- `npm run migrate` - Executa as migrações do banco

### Database
- `npm run db:view` - Visualiza o conteúdo do banco SQLite
- `npm run db:migrate` - Executa as migrações do banco

### Frontend
- `npm start` - Inicia o servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm test` - Executa os testes

## 🌐 Endpoints da API

### Autenticação
- `POST /api/auth/register` - Registro de usuário
- `POST /api/auth/login` - Login de usuário

### Usuários
- `GET /api/users` - Lista todos os usuários
- `GET /api/users/:id` - Busca usuário por ID
- `PUT /api/users/:id` - Atualiza usuário
- `DELETE /api/users/:id` - Remove usuário

### Leads
- `GET /api/leads` - Lista leads do usuário
- `GET /api/leads/:id` - Busca lead por ID
- `POST /api/leads` - Cria novo lead
- `PUT /api/leads/:id` - Atualiza lead
- `DELETE /api/leads/:id` - Remove lead

### Empreendimentos
- `GET /api/empreendimentos` - Lista empreendimentos do usuário
- `GET /api/empreendimentos/:id` - Busca empreendimento por ID
- `POST /api/empreendimentos` - Cria novo empreendimento
- `POST /api/empreendimentos/upload-pdf` - Importa empreendimentos via PDF
- `PUT /api/empreendimentos/:id` - Atualiza empreendimento
- `DELETE /api/empreendimentos/:id` - Remove empreendimento

## 🔒 Segurança

- Autenticação JWT
- Senhas criptografadas com bcrypt
- Validação de dados com express-validator
- Rate limiting
- Headers de segurança com helmet
- CORS configurado

## 📱 Interface

- Design responsivo
- Componentes reutilizáveis
- Feedback visual com toasts
- Loading states
- Formulários com validação

## 🚀 Deploy

### Backend (Produção)
1. Configure as variáveis de ambiente para produção
2. Execute `npm run build` no frontend
3. Configure um servidor Node.js ou use serviços como Heroku, Railway, etc.

### Frontend (Produção)
1. Execute `npm run build`
2. Sirva os arquivos da pasta `build` com um servidor web

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🐳 Docker

Para instruções detalhadas sobre Docker, incluindo troubleshooting de problemas comuns, consulte o [Docker Guide](DOCKER_GUIDE.md).

### Comandos Docker Rápidos

```bash
# Iniciar todos os serviços
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar serviços
docker-compose down

# Reconstruir e reiniciar
docker-compose up --build -d
```

## 📞 Suporte

Para suporte, envie um email para [seu-email@exemplo.com] ou abra uma issue no repositório.

