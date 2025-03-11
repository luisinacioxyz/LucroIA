# Preço Lucrativo com IA - MVP

Sistema de análise de preços e lucros para pequenos varejistas e prestadores de serviços com faturamento entre R$ 100 mil e R$ 1 milhão/ano.

## Visão Geral

O Preço Lucrativo com IA é uma ferramenta que ajuda pequenos negócios a otimizar seus preços e identificar oportunidades de lucro. O sistema possui dois módulos principais:

1. **Lucro Escondido**: Analisa dados internos (vendas, custos) para encontrar oportunidades de lucro subaproveitadas, como produtos de alta margem com baixa venda.

2. **Mentor de Preços**: Sugere preços otimizados com base em dados internos e benchmarks externos (preços de concorrentes).

## Tecnologias Utilizadas

- **Backend**: Python, FastAPI, Pandas
- **Frontend**: HTML, CSS, JavaScript, Chart.js
- **Análise de Dados**: Algoritmos de análise de margem e volume

## Estrutura do Projeto

```
preco-lucrativo-mvp/
├── backend/
│   ├── main.py              # Servidor FastAPI
│   ├── data_handler.py      # Processamento de dados CSV
│   ├── profit_analyzer.py   # Análise de lucro escondido
│   └── price_mentor.py      # Sugestões de preços
├── frontend/
│   ├── index.html           # Interface do usuário
│   └── script.js            # Lógica do frontend
├── docs/
│   ├── README.md            # Documentação do projeto
│   └── USO.md               # Instruções de uso
├── test_data/               # Dados de exemplo
│   ├── test1.csv            # Vestuário e acessórios
│   ├── test2.csv            # Cafeteria
│   └── test3.csv            # Serviços de beleza
├── requirements.txt         # Dependências Python
└── open_frontend.py         # Script para abrir o frontend
```

## Como Começar

Consulte o arquivo [docs/USO.md](docs/USO.md) para instruções detalhadas sobre como instalar e usar o sistema.

## Funcionalidades

- Upload de dados de vendas e custos via CSV
- Identificação automática de produtos com lucro escondido
- Sugestões de preços baseadas em dados de concorrentes
- Visualização gráfica dos resultados
- Interface simples e intuitiva

## Limitações do MVP

- Dados de concorrentes são inseridos manualmente
- Não há persistência de dados (banco de dados)
- Análises limitadas aos algoritmos básicos implementados

## Próximos Passos

- Implementar banco de dados para armazenar histórico
- Adicionar scraping automático de preços de concorrentes
- Desenvolver algoritmos mais sofisticados de precificação
- Criar dashboard com métricas de desempenho
- Implementar autenticação de usuários 