import pandas as pd

def analyze_hidden_profit(df):
    df["lucro"] = (df["preco"] * df["quantidade"]) - (df["custo"] * df["quantidade"])
    df["margem"] = df["lucro"] / (df["preco"] * df["quantidade"]) * 100
    total_vendas = (df["preco"] * df["quantidade"]).sum()
    hidden_profit = df[(df["margem"] > 30) & ((df["preco"] * df["quantidade"]) / total_vendas < 0.1)]
    return hidden_profit.to_dict(orient="records") 