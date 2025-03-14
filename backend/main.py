from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from data_handler import process_csv
from profit_analyzer import analyze_hidden_profit
from price_mentor import suggest_prices
from database import Session, Sale
import pandas as pd

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Dados de preços de concorrentes para teste
competitor_prices = {
    # Roupas e acessórios
    "Camisa": 60,
    "Calça": 85,
    "Cinto": 120,
    "Sapato": 180,
    "Boné": 35,
    "Meia": 18,
    "Jaqueta": 220,
    
    # Cafeteria
    "Café": 9.5,
    "Pão": 6,
    "Bolo": 25,
    "Sanduíche": 18,
    "Suco": 12,
    "Água": 5,
    "Chocolate": 7.5,
    
    # Serviços de beleza
    "Corte de Cabelo": 60,
    "Manicure": 45,
    "Pedicure": 50,
    "Massagem": 120,
    "Limpeza de Pele": 90,
    "Depilação": 70,
    "Maquiagem": 85
}

@app.get("/")
def read_root():
    return {"message": "Preço Lucrativo com IA - MVP"}

@app.post("/upload-csv/")
async def upload_csv(file: UploadFile = File(...)):
    try:
        data = process_csv(file)
        df = pd.DataFrame(data)
        hidden_profit = analyze_hidden_profit(df)
        price_suggestions = suggest_prices(df, competitor_prices)
        return {"hidden_profit": hidden_profit, "price_suggestions": price_suggestions}
    except ValueError as e:
        return {"error": str(e)}

@app.get("/history/")
def get_history():
    session = Session()
    sales = session.query(Sale).all()
    session.close()
    return [{
        "id": s.id,
        "produto": s.produto,
        "preco": s.preco,
        "quantidade": s.quantidade,
        "custo": s.custo,
        "data": s.data,
        "id_produto": s.id_produto,
        "id_compra": s.id_compra,
        "id_cliente": s.id_cliente
    } for s in sales]

@app.get("/metrics/")
def get_metrics():
    session = Session()
    sales = session.query(Sale).all()
    if not sales:
        session.close()
        return {"error": "Nenhum dado disponível"}
    
    df = pd.DataFrame([{
        "produto": s.produto,
        "preco": s.preco,
        "quantidade": s.quantidade,
        "custo": s.custo,
        "data": s.data,
        "id_produto": s.id_produto,
        "id_compra": s.id_compra,
        "id_cliente": s.id_cliente
    } for s in sales])
    session.close()

    df["lucro"] = (df["preco"] - df["custo"]) * df["quantidade"]
    df["margem"] = df["lucro"] / (df["preco"] * df["quantidade"]) * 100
    df["data"] = pd.to_datetime(df["data"], errors="coerce")

    total_revenue = (df["preco"] * df["quantidade"]).sum()
    total_profit = df["lucro"].sum()
    avg_margin = df["margem"].mean()
    top_product = df.loc[df["lucro"].idxmax()]["produto"] if not df.empty else "N/A"
    total_quantity = df["quantidade"].sum()
    num_products = df["produto"].nunique()
    profit_by_product = df.groupby("produto")["lucro"].sum().to_dict()
    top_3_products = df.groupby("produto")["lucro"].sum().nlargest(3).to_dict()
    num_transactions = df["id_compra"].nunique()
    num_clients = df["id_cliente"].nunique()
    avg_ticket= total_revenue / num_clients if num_clients > 0 else 0
    sales_by_month = df.groupby(df["data"].dt.to_period("M"))["lucro"].sum().to_dict()
    top_product_by_quantity = df.groupby("id_produto")["quantidade"].sum().idxmax() if not df.empty else "N/A"

    return {
        "total_revenue": round(total_revenue, 2),
        "total_profit": round(total_profit, 2),
        "average_margin": round(avg_margin, 2),
        "top_product": top_product,
        "average_ticket": round(avg_ticket, 2),
        "total_quantity": int(total_quantity),
        "num_products": int(num_products),
        "profit_by_product": profit_by_product,
        "top_3_products": top_3_products,
        "num_transactions": num_transactions,
        "num_clients": num_clients,
        "sales_by_month": {str(k): round(v, 2) for k, v in sales_by_month.items()},
        "top_product_by_quantity": top_product_by_quantity
    }
@app.get("/ai-summary/")
def get_ai_summary():
    session = Session()
    sales = session.query(Sale).all()
    if not sales:
        session.close()
        return {"summary": "Nenhum dado disponível para análise."}
    df = pd.DataFrame([{"produto": s.produto, "preco": s.preco, "quantidade": s.quantidade, "custo": s.custo} for s in sales])
    df["lucro"] = (df["preco"] - df["custo"]) * df["quantidade"]
    session.close()
    
    total_revenue = (df["preco"] * df["quantidade"]).sum()
    total_profit = df["lucro"].sum()
    top_product = df.loc[df["lucro"].idxmax()]["produto"] if not df.empty else "N/A"
    summary = f"Sua receita total é R${total_revenue:.2f}, com lucro de R${total_profit:.2f}. O produto mais lucrativo é '{top_product}'. "
    if total_profit < total_revenue * 0.2:
        summary += "Sua margem está baixa; considere ajustar preços ou reduzir custos."
    return {"summary": summary}