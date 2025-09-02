# 🚀 Quick Start - Simulador Caixa

## Opção 1: Docker (Recomendado)

### Se Docker Desktop estiver funcionando:

```bash
# Setup automático com Docker
./docker-setup.sh
```

### Se Docker Desktop tiver problemas:

1. **Fix Docker Desktop:**
   ```bash
   # Quit Docker Desktop
   killall Docker
   
   # Remove Docker data
   rm -rf ~/Library/Containers/com.docker.docker
   rm -rf ~/Library/Application\ Support/Docker\ Desktop
   rm -rf ~/.docker
   
   # Restart Docker Desktop
   open -a Docker
   ```

2. **Aguarde Docker inicializar e execute:**
   ```bash
   ./docker-setup.sh
   ```

## Opção 2: Sem Docker (Alternativa)

### Se você não conseguir usar Docker:

```bash
# Setup sem Docker
./run-without-docker.sh
```

### Depois execute em terminais separados:

```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend  
cd frontend && npm start
```

## 🌐 URLs de Acesso

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000


## 🔧 Troubleshooting

### Docker não funciona:
- Consulte [Docker Guide](DOCKER_GUIDE.md)
- Use a opção sem Docker

### Banco de dados não funciona:
- Verifique se o arquivo `database.sqlite` foi criado na pasta `backend/`
- Execute as migrações: `cd backend && npm run migrate`

### Portas ocupadas:
- Verifique: `lsof -i :3000` e `lsof -i :5000`
- Mate processos se necessário

## 📞 Suporte

Para mais ajuda, consulte:
- [README.md](README.md) - Documentação completa
- [DOCKER_GUIDE.md](DOCKER_GUIDE.md) - Guia Docker detalhado
- [PDF_PARSER.md](PDF_PARSER.md) - Documentação do parser de PDF
