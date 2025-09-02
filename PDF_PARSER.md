# Parser de PDF - Empreendimentos

## Visão Geral

O sistema inclui um parser de PDF para importar automaticamente dados de empreendimentos de arquivos PDF como o Villa Aurea. O parser está localizado em `backend/src/routes/empreendimentos.js`.

## Como Funciona

### 1. Upload do PDF
- O usuário faz upload de um arquivo PDF através da interface
- O arquivo é processado usando a biblioteca `pdf-parse`
- O texto é extraído do PDF

### 2. Extração de Dados
A função `extractEmpreendimentosFromPDF()` analisa o texto e procura por padrões específicos:

```javascript
function extractEmpreendimentosFromPDF(text) {
  const empreendimentos = [];
  const lines = text.split('\n').filter(line => line.trim());
  
  let currentEmp = null;
  
  for (const line of lines) {
    // Procura por padrões que indicam um novo empreendimento
    if (line.includes('Empreendimento') || line.includes('Residencial') || line.includes('Condomínio')) {
      if (currentEmp) {
        empreendimentos.push(currentEmp);
      }
      currentEmp = {
        nome: line.trim(),
        construtora: '',
        cidade: '',
        valor_imovel: null,
        area_util: null,
        tipologia: '',
        data_entrega: null
      };
    }
    
    // Extrai outras informações baseadas em padrões
    if (currentEmp) {
      // Procura por valores monetários
      if (line.includes('R$') && !currentEmp.valor_imovel) {
        const valorMatch = line.match(/R\$\s*([\d.,]+)/);
        if (valorMatch) {
          currentEmp.valor_imovel = parseFloat(valorMatch[1].replace(/\./g, '').replace(',', '.'));
        }
      }
      
      // Procura por áreas
      if (line.includes('m²') && !currentEmp.area_util) {
        const areaMatch = line.match(/(\d+(?:,\d+)?)\s*m²/);
        if (areaMatch) {
          currentEmp.area_util = parseFloat(areaMatch[1].replace(',', '.'));
        }
      }
    }
  }
  
  return empreendimentos;
}
```

### 3. Padrões Reconhecidos

O parser reconhece os seguintes padrões:

- **Nome do Empreendimento**: Linhas que contêm "Empreendimento", "Residencial", "Condomínio"
- **Valores Monetários**: Padrão `R$ X.XXX,XX`
- **Áreas**: Padrão `XX,XX m²`
- **Datas**: Padrões de data brasileira

## Personalização

Para adaptar o parser para diferentes formatos de PDF, você pode:

### 1. Adicionar Novos Padrões

```javascript
// Exemplo: reconhecer tipologias
if (line.includes('quarto') || line.includes('suíte')) {
  currentEmp.tipologia = line.trim();
}

// Exemplo: reconhecer construtoras
if (line.includes('Construtora') || line.includes('Incorporadora')) {
  currentEmp.construtora = line.replace('Construtora:', '').trim();
}
```

### 2. Melhorar Regex

```javascript
// Regex mais robusto para valores monetários
const valorMatch = line.match(/R\$\s*([\d.,]+(?:\s*[a-zA-Z]+)?)/);

// Regex para datas brasileiras
const dataMatch = line.match(/(\d{2})\/(\d{2})\/(\d{4})/);
```

### 3. Adicionar Validação

```javascript
// Validar dados extraídos
if (currentEmp.valor_imovel && currentEmp.valor_imovel > 0) {
  empreendimentos.push(currentEmp);
} else {
  console.log('Empreendimento ignorado - dados inválidos:', currentEmp);
}
```

## Estrutura do PDF Villa Aurea

Baseado no script VBA fornecido, o PDF Villa Aurea contém:

- **Nome do Empreendimento**: Ex: "Villa Aurea"
- **Construtora**: Ex: "Villa Aurea Incorporação"
- **Cidade**: Localização do empreendimento
- **Valores**: Preços dos imóveis
- **Áreas**: Metragem dos apartamentos
- **Tipologias**: Configurações (2 quartos, 1 suíte, etc.)
- **Datas de Entrega**: Previsão de conclusão
- **Faixas MCMV**: Classificação do programa

## Melhorias Sugeridas

1. **Machine Learning**: Usar IA para melhorar a extração
2. **OCR**: Para PDFs com imagens
3. **Validação Avançada**: Verificar consistência dos dados
4. **Mapeamento de Campos**: Interface para mapear colunas do PDF
5. **Preview**: Mostrar dados extraídos antes de salvar

## Troubleshooting

### Problemas Comuns

1. **PDF não reconhecido**: Verificar se o PDF contém texto (não é imagem)
2. **Dados incorretos**: Ajustar regex para o formato específico
3. **Caracteres especiais**: Tratar encoding UTF-8
4. **Layout complexo**: PDFs com tabelas podem precisar de parser específico

### Debug

```javascript
// Adicionar logs para debug
console.log('Texto extraído:', text.substring(0, 500));
console.log('Empreendimentos encontrados:', empreendimentos);
```

## Exemplo de Uso

```javascript
// Upload via interface
const formData = new FormData();
formData.append('pdf', file);

const response = await axios.post('/api/empreendimentos/upload-pdf', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

console.log('Empreendimentos importados:', response.data.empreendimentos);
```

