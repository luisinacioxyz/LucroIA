import pandas as pd
from fastapi import UploadFile
from database import Session, Sale

def process_csv(file: UploadFile):
    df = pd.read_csv(file.file)
    # Garanta que as colunas esperadas existam
    required_columns = ["produto", "preco", "quantidade", "custo"]
    if not all(col in df.columns for col in required_columns):
        raise ValueError("CSV deve conter: produto, preco, quantidade, custo")
    
    session = Session()
    for _, row in df.iterrows():
        sale = Sale(
            produto=row["produto"],
            preco=row["preco"],
            quantidade=row["quantidade"],
            custo=row["custo"],
            data=row.get("data", "N/A"),  # Opcional, default "N/A"
            id_produto=row.get("id_produto", "N/A"),  # Opcional
            id_compra=row.get("id_compra", "N/A"),  # Opcional
            id_cliente=row.get("id_cliente", "N/A")  # Opcional
        )
        session.add(sale)
    session.commit()
    session.close()
    return df.to_dict(orient="records") 