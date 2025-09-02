const { run } = require('./connection');

const createTables = async () => {
  try {
    console.log('🔄 Creating database tables...');

    // Users table
    await run(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        senha TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Leads table
    await run(`
      CREATE TABLE IF NOT EXISTS leads (
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
      )
    `);

    // Empreendimentos table
    await run(`
      CREATE TABLE IF NOT EXISTS empreendimentos (
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
      )
    `);

    // Create indexes for better performance
    await run('CREATE INDEX IF NOT EXISTS idx_leads_usuario_id ON leads(usuario_id)');
    await run('CREATE INDEX IF NOT EXISTS idx_empreendimentos_usuario_id ON empreendimentos(usuario_id)');
    await run('CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email)');

    console.log('✅ Database tables created successfully');
  } catch (error) {
    console.error('❌ Error creating tables:', error);
    throw error;
  }
};

// Run migrations if this file is executed directly
if (require.main === module) {
  createTables()
    .then(() => {
      console.log('🎉 Database migration completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Migration failed:', error);
      process.exit(1);
    });
}

module.exports = { createTables };
