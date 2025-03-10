# Como Usar o Preço Lucrativo com IA

## Requisitos
- Python 3.11 ou superior
- Navegador web moderno (Chrome, Firefox, Edge)

## Instalação
1. Clone o repositório ou baixe os arquivos
2. Crie um ambiente virtual Python:
   ```
   python -m venv venv
   ```
3. Ative o ambiente virtual:
   - Windows: `venv\Scripts\activate`
   - Linux/Mac: `source venv/bin/activate`
4. Instale as dependências:
   ```
   pip install -r requirements.txt
   ```

## Execução
1. Inicie o back-end:
   ```
   cd backend
   uvicorn main:app --reload
   ```
2. Abra o arquivo `frontend/index.html` no seu navegador
   - Você pode usar o script Python fornecido: `python open_frontend.py`

## Uso do Sistema
1. Na interface web, clique em "Escolher arquivo" e selecione um arquivo CSV
2. O arquivo CSV deve conter as seguintes colunas:
   - `produto`: Nome do produto ou serviço
   - `preco`: Preço de venda atual
   - `quantidade`: Quantidade vendida no período
   - `custo`: Custo unitário do produto ou serviço
3. Clique em "Analisar Dados" para processar o arquivo
4. Visualize os resultados:
   - **Lucro Escondido**: Produtos com alta margem mas baixo volume de vendas
   - **Sugestões de Preços**: Recomendações de novos preços baseadas em dados internos e de concorrentes

## Arquivos de Exemplo
Na pasta `test_data` você encontrará arquivos CSV de exemplo para testar o sistema:
- `test1.csv`: Produtos de vestuário e acessórios
- `test2.csv`: Produtos de cafeteria
- `test3.csv`: Serviços de beleza

## Interpretação dos Resultados
- **Lucro Escondido**: Identifica produtos com margem superior a 30% mas que representam menos de 10% do faturamento total. Estes produtos têm potencial para aumentar o lucro se tiverem suas vendas incrementadas.
- **Sugestões de Preços**: Recomenda ajustes de preços com base em:
  - Preços de concorrentes
  - Margem de lucro atual
  - Volume de vendas

## Solução de Problemas
- Se o servidor não iniciar, verifique se a porta 8000 está disponível
- Se o upload falhar, verifique se o CSV está no formato correto
- Para mais detalhes técnicos, consulte a documentação da API em `http://127.0.0.1:8000/docs` 