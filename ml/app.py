from fastapi import FastAPI
from pydantic import BaseModel
from pathlib import Path
import numpy as np
import torch
import json

ARTIFACT_DIR = Path(__file__).parent
MODEL_PATH = ARTIFACT_DIR / "model.pt"
PREPROC_PATH = ARTIFACT_DIR / "preprocessing.json"
app = FastAPI(title="Housing Estimate API (PyTorch)")

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

class MLPRegressor(torch.nn.Module):
    def __init__(self, in_dim):
        super().__init__()
        self.net = torch.nn.Sequential(
            torch.nn.Linear(in_dim, 64),
            torch.nn.ReLU(),
            torch.nn.Linear(64, 32),
            torch.nn.ReLU(),
            torch.nn.Linear(32, 1),
        )

    def forward(self, x):
        return self.net(x)

@app.on_event("startup")
def load_model():
    global torch_model, preproc
    if not MODEL_PATH.exists() or not PREPROC_PATH.exists():
        raise RuntimeError("Model or preprocessing not found. Run ml/train.py to create artifacts.")
    with open(PREPROC_PATH, "r") as f:
        preproc = json.load(f)
    input_dim = len(preproc["num_cols"]) + len(preproc["furnish_categories"])
    torch_model = MLPRegressor(input_dim)
    torch_model.load_state_dict(torch.load(MODEL_PATH, map_location="cpu", weights_only=True))
    torch_model.eval()

@app.get("/health")
def health():
    return {"status": "ok"}

def _vectorize(f: Features):
    num_cols = preproc["num_cols"]
    means = preproc["num_means"]
    stds = preproc["num_stds"]
    furn_cats = preproc["furnish_categories"]
    # Numeric standardized
    row = {
        "area": f.area,
        "bedrooms": f.bedrooms,
        "bathrooms": f.bathrooms,
        "stories": f.stories,
        "parking": f.parking,
        "mainroad": f.mainroad,
        "guestroom": f.guestroom,
        "basement": f.basement,
        "hotwaterheating": f.hotwaterheating,
        "airconditioning": f.airconditioning,
        "prefarea": f.prefarea,
    }
    num_feats = [ (float(row[c]) - float(means[c])) / float(stds[c]) for c in num_cols ]
    # One-hot furnishingstatus
    cat_val = (f.furnishingstatus or "missing")
    onehot = [0.0] * len(furn_cats)
    try:
        idx = furn_cats.index(cat_val)
    except ValueError:
        idx = 0
    onehot[idx] = 1.0
    vec = np.array(num_feats + onehot, dtype=np.float32)
    return torch.from_numpy(vec).unsqueeze(0)

@app.post("/predict")
def predict(features: Features):
    xb = _vectorize(features)
    with torch.no_grad():
        yb = torch_model(xb)
    pred = float(yb.squeeze().item())
    
    return {"predicted_price": pred}
