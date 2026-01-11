from fastapi import FastAPI
from pydantic import BaseModel
import joblib
from pathlib import Path
import numpy as np

MODEL_PATH = Path(__file__).parent / "model.joblib"
app = FastAPI(title="Housing Estimate API")

class Features(BaseModel):
    area: float
    bedrooms: int
    bathrooms: int
    stories: int
    mainroad: int = 0
    guestroom: int = 0
    basement: int = 0
    hotwaterheating: int = 0
    airconditioning: int = 0
    parking: int = 0
    prefarea: int = 0
    furnishingstatus: str = "unfurnished"

@app.on_event("startup")
def load_model():
    global model
    if not MODEL_PATH.exists():
        raise RuntimeError("Model not found. Run ml/train.py first to create model.joblib")
    model = joblib.load(MODEL_PATH)

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/predict")
def predict(features: Features):
    # Build single-row DataFrame-like array in same order the pipeline expects
    data = [{
        "area": features.area,
        "bedrooms": features.bedrooms,
        "bathrooms": features.bathrooms,
        "stories": features.stories,
        "parking": features.parking,
        "mainroad": features.mainroad,
        "guestroom": features.guestroom,
        "basement": features.basement,
        "hotwaterheating": features.hotwaterheating,
        "airconditioning": features.airconditioning,
        "prefarea": features.prefarea,
        "furnishingstatus": features.furnishingstatus,
    }]
    import pandas as pd
    df = pd.DataFrame(data)
    pred = model.predict(df)[0]
    # Return predicted price
    return {"predicted_price": float(pred)}
