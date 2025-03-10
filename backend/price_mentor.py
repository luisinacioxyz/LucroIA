import pandas as pd

def suggest_prices(df, competitor_prices):
    df["lucro_atual"] = (df["preco"] * df["quantidade"]) - (df["custo"] * df["quantidade"])
    suggestions = []
    for _, row in df.iterrows():
        comp_price = competitor_prices.get(row["produto"], row["preco"] * 1.2)  # 20% acima se sem concorrente
        new_price = min(comp_price, row["preco"] * 1.15) if row["lucro_atual"] < 0.1 * row["preco"] else row["preco"]
        suggestions.append({"produto": row["produto"], "preco_atual": row["preco"], "preco_sugerido": new_price})
    return suggestions 