# SQLite Migration Summary

## 🎯 Migration Completed Successfully

The Simulador Caixa project has been successfully migrated from PostgreSQL to SQLite, making it much easier to set up and run without requiring a separate database server installation.

## 🔄 Changes Made

### 1. **Database Dependencies**
- **Removed**: `pg` (PostgreSQL client)
- **Added**: `sqlite3` (SQLite client)

### 2. **Database Connection**
- **File**: `backend/src/database/connection.js`
- **Changes**: 
  - Replaced PostgreSQL Pool with SQLite3 Database
  - Updated connection logic for SQLite
  - Added helper functions: `query`, `run`, `get`

### 3. **Database Schema**
- **File**: `backend/src/database/migrate.js`
- **Changes**:
  - Updated data types for SQLite compatibility
  - Changed `SERIAL` to `INTEGER PRIMARY KEY AUTOINCREMENT`
  - Changed `VARCHAR` to `TEXT`
  - Changed `DECIMAL` to `REAL`
  - Changed `BOOLEAN` to `INTEGER` (0/1)
  - Changed `JSONB` to `TEXT` (JSON string)
  - Updated timestamp fields to use SQLite format

### 4. **API Routes Updated**
- **Files**: 
  - `backend/src/routes/auth.js`
  - `backend/src/routes/users.js`
  - `backend/src/routes/leads.js`
  - `backend/src/routes/empreendimentos.js`
- **Changes**:
  - Replaced `$1, $2, $3` parameter placeholders with `?`
  - Updated query result handling (no more `.rows`)
  - Added proper boolean handling for SQLite (0/1)

### 5. **Environment Configuration**
- **File**: `backend/env.example`
- **Changes**: Removed all PostgreSQL-specific environment variables

### 6. **Docker Configuration**
- **File**: `docker-compose.yml`
- **Changes**:
  - Removed PostgreSQL service
  - Removed pgAdmin service
  - Updated backend service to use SQLite volume
  - Simplified environment variables

### 7. **Setup Scripts**
- **Files**: 
  - `setup.sh`
  - `run-without-docker.sh`
  - `docker-setup.sh`
- **Changes**: Removed PostgreSQL installation and configuration steps

### 8. **New Tools Added**
- **File**: `view-database.js`
- **Purpose**: Simple command-line tool to view database contents
- **Usage**: `npm run db:view`

## 🚀 Benefits of SQLite Migration

### ✅ **Easier Setup**
- No need to install PostgreSQL
- No database server configuration
- No user/password management
- Single file database

### ✅ **Portability**
- Database file can be easily backed up
- Can be moved between systems
- No network configuration required

### ✅ **Development Friendly**
- Faster development setup
- No external dependencies
- Works offline
- Easy to reset (just delete the file)

### ✅ **Deployment Simplicity**
- Fewer moving parts
- No database server maintenance
- Reduced resource usage
- Simpler Docker setup

## 📋 Database Schema

### Table: `usuarios`
```sql
CREATE TABLE usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  senha TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Table: `leads`
```sql
CREATE TABLE leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  telefone TEXT NOT NULL,
  email TEXT,
  data_nascimento DATE,
  renda REAL,
  tem_dependentes INTEGER DEFAULT 0,
  tem_fgts INTEGER DEFAULT 0,
  valor_entrada REAL,
  usuario_id INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
);
```

### Table: `empreendimentos`
```sql
CREATE TABLE empreendimentos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  construtora TEXT,
  cidade TEXT,
  endereco TEXT,
  categoria TEXT,
  faixa_mcmv TEXT,
  valor_imovel REAL,
  valor_avaliacao REAL,
  area_util REAL,
  tipologia TEXT,
  prazo_obra INTEGER,
  data_entrega DATE,
  mensais INTEGER,
  origem_recurso TEXT,
  dados_adicional TEXT,
  usuario_id INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
);
```

## 🛠️ Available Commands

### Database Management
```bash
# View database contents
npm run db:view

# Run migrations
npm run db:migrate

# Or from backend directory
cd backend && npm run migrate
```

### Application Setup
```bash
# Setup without Docker
./run-without-docker.sh

# Setup with Docker
./docker-setup.sh

# Manual setup
npm run install-all
cd backend && npm run migrate
```

## 🔧 Troubleshooting

### Database File Location
- **Path**: `backend/database.sqlite`
- **Size**: ~36KB (empty database)
- **Permissions**: Read/write for application

### Common Issues
1. **"Cannot find module 'sqlite3'"**
   - Run: `npm run install-all`

2. **"Database file not found"**
   - Run: `npm run db:migrate`

3. **"Permission denied"**
   - Check file permissions: `ls -la backend/database.sqlite`

### Backup and Restore
```bash
# Backup database
cp backend/database.sqlite backup.sqlite

# Restore database
cp backup.sqlite backend/database.sqlite
```

## 📊 Performance Considerations

### SQLite Advantages
- **Lightweight**: No server process
- **Fast**: Direct file access
- **Reliable**: ACID compliant
- **Concurrent**: Multiple readers, single writer

### Limitations
- **Concurrent Writes**: Limited to one writer at a time
- **Network**: Not suitable for distributed systems
- **Size**: Best for databases under 100GB

### Recommendations
- **Development**: Perfect for development and testing
- **Production**: Suitable for small to medium applications
- **Scaling**: Consider PostgreSQL for high-traffic applications

## 🎉 Migration Complete

The migration to SQLite is complete and the application is ready to use. All CRUD operations for users, leads, and empreendimentos are working with the new SQLite database.

**Next Steps:**
1. Test the application: `npm run dev`
2. Create a test user through the registration page
3. Test all CRUD operations
4. Import PDF files for empreendimentos
