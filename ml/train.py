"""
PyTorch training script for housing price regression.
- Loads `Housing.csv` from repo root
- Preprocesses yes/no -> 0/1 and one-hot furnishingstatus
- Standardizes numeric features using dataset mean/std
- Trains a simple MLP regressor in PyTorch
- Saves `model.pt` and `preprocessing.json` for inference
"""

from pathlib import Path
import json
import pandas as pd
import numpy as np
import torch
from torch import nn
from torch.utils.data import TensorDataset, DataLoader

ROOT = Path(__file__).parents[1]
DATA_PATH = ROOT / "Housing.csv"
ARTIFACT_DIR = Path(__file__).parent
MODEL_PATH = ARTIFACT_DIR / "model.pt"
PREPROC_PATH = ARTIFACT_DIR / "preprocessing.json"

if not DATA_PATH.exists():
    raise FileNotFoundError(f"Dataset not found at {DATA_PATH}")

df = pd.read_csv(DATA_PATH)

# Columns
yesno_cols = ["mainroad", "guestroom", "basement", "hotwaterheating", "airconditioning", "prefarea"]
num_cols = ["area", "bedrooms", "bathrooms", "stories", "parking"] + yesno_cols
cat_cols = ["furnishingstatus"]

# Map yes/no
for col in yesno_cols:
    df[col] = df[col].map({"yes": 1, "no": 0})

# Target
y = df["price"].astype(float).to_numpy()

# Compute one-hot categories for furnishingstatus
furnish_categories = sorted(df["furnishingstatus"].fillna("missing").unique().tolist())
cat_index = {c: i for i, c in enumerate(furnish_categories)}

# Numeric preprocessing: fill median and standardize
df[num_cols] = df[num_cols].fillna(df[num_cols].median())
num_means = df[num_cols].mean().to_dict()
num_stds = df[num_cols].std(ddof=0).replace(0, 1e-6).to_dict()

def row_to_features(row):
    # Numeric standardized
    num_feats = [ (float(row[c]) - float(num_means[c])) / float(num_stds[c]) for c in num_cols ]
    # One-hot for furnishingstatus
    cat_val = str(row["furnishingstatus"]) if pd.notna(row["furnishingstatus"]) else "missing"
    onehot = [0.0] * len(furnish_categories)
    onehot[cat_index.get(cat_val, 0)] = 1.0
    return np.array(num_feats + onehot, dtype=np.float32)

# Build full feature matrix
features = np.vstack([row_to_features(r) for _, r in df.iterrows()])

# Train/val split
from sklearn.model_selection import train_test_split
X_train, X_val, y_train, y_val = train_test_split(features, y, test_size=0.2, random_state=42)

train_ds = TensorDataset(torch.from_numpy(X_train), torch.from_numpy(y_train.astype(np.float32)).unsqueeze(1))
val_ds = TensorDataset(torch.from_numpy(X_val), torch.from_numpy(y_val.astype(np.float32)).unsqueeze(1))

train_loader = DataLoader(train_ds, batch_size=32, shuffle=True)
val_loader = DataLoader(val_ds, batch_size=64)

input_dim = features.shape[1]

class MLPRegressor(nn.Module):
    def __init__(self, in_dim):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(in_dim, 64),
            nn.ReLU(),
            nn.Linear(64, 32),
            nn.ReLU(),
            nn.Linear(32, 1),
        )

    def forward(self, x):
        return self.net(x)

device = torch.device("cpu")
model = MLPRegressor(input_dim).to(device)
criterion = nn.MSELoss()
optimizer = torch.optim.Adam(model.parameters(), lr=1e-3)

def rmse(t):
    return torch.sqrt(t)

epochs = 300
for epoch in range(1, epochs + 1):
    model.train()
    train_loss = 0.0
    for xb, yb in train_loader:
        xb, yb = xb.to(device), yb.to(device)
        optimizer.zero_grad()
        pred = model(xb)
        loss = criterion(pred, yb)
        loss.backward()
        optimizer.step()
        train_loss += loss.item() * xb.size(0)
    train_loss /= len(train_loader.dataset)

    if epoch % 50 == 0 or epoch == 1:
        model.eval()
        val_loss = 0.0
        with torch.no_grad():
            for xb, yb in val_loader:
                xb, yb = xb.to(device), yb.to(device)
                pred = model(xb)
                loss = criterion(pred, yb)
                val_loss += loss.item() * xb.size(0)
        val_loss /= len(val_loader.dataset)
        print(f"Epoch {epoch}: train RMSE={np.sqrt(train_loss):.2f}, val RMSE={np.sqrt(val_loss):.2f}")

# Save model and preprocessing
torch.save(model.state_dict(), MODEL_PATH)

preproc = {
    "num_cols": num_cols,
    "num_means": num_means,
    "num_stds": num_stds,
    "furnish_categories": furnish_categories,
}

with open(PREPROC_PATH, "w") as f:
    json.dump(preproc, f)

print(f"Saved model to {MODEL_PATH}")
print(f"Saved preprocessing to {PREPROC_PATH}")
