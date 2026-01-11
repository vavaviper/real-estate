"""
Simple training script for housing price regression.
- Loads `Housing.csv` from repo root
- Performs basic preprocessing (yes/no -> 0/1, one-hot furnish/prefarea)
- Trains a GradientBoostingRegressor inside a scikit-learn Pipeline
- Evaluates with cross-validation and saves pipeline to `model.joblib`
"""

import os
from pathlib import Path
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.impute import SimpleImputer
import joblib

ROOT = Path(__file__).parents[1]
DATA_PATH = ROOT / "Housing.csv"
MODEL_PATH = Path(__file__).parent / "model.joblib"

if not DATA_PATH.exists():
    raise FileNotFoundError(f"Dataset not found at {DATA_PATH}")

# Load data
df = pd.read_csv(DATA_PATH)

# Basic cleaning and feature engineering
# Convert yes/no to boolean (0/1)
yesno_cols = ["mainroad", "guestroom", "basement", "hotwaterheating", "airconditioning", "prefarea"]
for col in yesno_cols:
    df[col] = df[col].map({"yes": 1, "no": 0})

# Furnishing status: one-hot
cat_cols = ["furnishingstatus"]
num_cols = ["area", "bedrooms", "bathrooms", "stories", "parking"] + yesno_cols

X = df[num_cols + cat_cols].copy()
y = df["price"].copy()

# Build preprocessing
num_pipeline = Pipeline([
    ("imputer", SimpleImputer(strategy="median")),
    ("scaler", StandardScaler()),
])
cat_pipeline = Pipeline([
    ("imputer", SimpleImputer(strategy="constant", fill_value="missing")),
    ("ohe", OneHotEncoder(handle_unknown="ignore")),
])

preprocessor = ColumnTransformer([
    ("num", num_pipeline, num_cols),
    ("cat", cat_pipeline, cat_cols),
])

model = GradientBoostingRegressor(n_estimators=200, learning_rate=0.1, random_state=42)

pipeline = Pipeline([
    ("preprocessor", preprocessor),
    ("model", model),
])

# Cross-validate
print("Training and cross-validating...")
scores = cross_val_score(pipeline, X, y, cv=5, scoring="neg_root_mean_squared_error")
rmse_scores = -scores
print(f"CV RMSE: {rmse_scores.mean():.2f} (+/- {rmse_scores.std():.2f})")

# Fit on full data
pipeline.fit(X, y)

# Save artifact
joblib.dump(pipeline, MODEL_PATH)
print(f"Model saved to {MODEL_PATH}")
