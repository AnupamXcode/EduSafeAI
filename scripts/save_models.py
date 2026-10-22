"""
EduRisk AI - Save Models & Generate Academic Jupyter Notebook
Produces the 3 required college submission artifacts:
1. Saved model files (.pkl and .joblib) in saved_models/
2. Working Public URL: https://mldsproject-one.vercel.app
3. Complete Jupyter Notebook with code and execution outputs
"""

import os
import json
import joblib
import pandas as pd
import numpy as np

from sklearn.model_selection import train_test_split, StratifiedKFold, GridSearchCV
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.linear_model import LinearRegression, Ridge, LogisticRegression
from sklearn.ensemble import RandomForestClassifier, BaggingClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.naive_bayes import GaussianNB
from sklearn.cluster import KMeans
from sklearn.mixture import GaussianMixture
from sklearn.metrics import (
    mean_absolute_error, mean_squared_error, r2_score,
    accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
)

# 1. Paths
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DATA_PATH = os.path.join(BASE_DIR, "data", "student-mat.csv")
MODELS_DIR = os.path.join(BASE_DIR, "saved_models")
os.makedirs(MODELS_DIR, exist_ok=True)

print("Loading dataset from:", DATA_PATH)
df = pd.read_csv(DATA_PATH, sep=";")
df["academic_risk"] = (df["G3"] < 10).astype(int)

# 2. Features
NOMINAL_COLS = ["Mjob", "Fjob", "reason", "guardian"]
BINARY_COLS = [
    "school", "sex", "address", "famsize", "Pstatus",
    "schoolsup", "famsup", "paid", "activities",
    "nursery", "higher", "internet", "romantic"
]
NUMERIC_COLS = [
    "age", "Medu", "Fedu", "traveltime", "studytime", "failures",
    "famrel", "freetime", "goout", "Dalc", "Walc", "health", "absences"
]

feature_cols = [c for c in df.columns if c not in ["G3", "academic_risk", "risk_label"]]
X = df[feature_cols]
y_reg = df["G3"]
y_cls = df["academic_risk"]

preprocessor = ColumnTransformer(transformers=[
    ("nom", OneHotEncoder(drop="first", sparse_output=False, handle_unknown="ignore"), NOMINAL_COLS),
    ("bin", OneHotEncoder(drop="if_binary", sparse_output=False, handle_unknown="ignore"), BINARY_COLS),
    ("num", StandardScaler(), NUMERIC_COLS + ["G1", "G2"])
])

X_train, X_test, y_reg_train, y_reg_test, y_cls_train, y_cls_test = train_test_split(
    X, y_reg, y_cls, test_size=0.2, random_state=42, stratify=y_cls
)

X_train_proc = preprocessor.fit_transform(X_train)
X_test_proc = preprocessor.transform(X_test)

# 3. Train Models
print("Training Linear Regression (Grade Prediction)...")
reg_model = LinearRegression()
reg_model.fit(X_train_proc, y_reg_train)
y_pred_reg = reg_model.predict(X_test_proc)
r2 = r2_score(y_reg_test, y_pred_reg)
mae = mean_absolute_error(y_reg_test, y_pred_reg)
rmse = float(np.sqrt(mean_squared_error(y_reg_test, y_pred_reg)))
print(f"Regression -> R2: {r2:.4f}, MAE: {mae:.4f}, RMSE: {rmse:.4f}")

print("Training Logistic Regression & Random Forest (Risk Classification)...")
cls_model = LogisticRegression(max_iter=1000, random_state=42)
cls_model.fit(X_train_proc, y_cls_train)
y_pred_cls = cls_model.predict(X_test_proc)
acc = accuracy_score(y_cls_test, y_pred_cls)
rec = recall_score(y_cls_test, y_pred_cls)
f1 = f1_score(y_cls_test, y_pred_cls)
print(f"Classification -> Accuracy: {acc:.4f}, Recall: {rec:.4f}, F1: {f1:.4f}")

rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
rf_model.fit(X_train_proc, y_cls_train)

print("Training K-Means (Student Segmentation)...")
cluster_features = ["studytime", "failures", "absences", "Medu", "Fedu", "freetime", "health"]
X_cluster = df[cluster_features]
scaler_cluster = StandardScaler()
X_cluster_scaled = scaler_cluster.fit_transform(X_cluster)
kmeans_model = KMeans(n_clusters=3, random_state=42, n_init=10)
kmeans_model.fit(X_cluster_scaled)

# 4. Save Models
print("Saving models to:", MODELS_DIR)
joblib.dump(reg_model, os.path.join(MODELS_DIR, "grade_prediction_model.pkl"))
joblib.dump(cls_model, os.path.join(MODELS_DIR, "risk_classification_model.pkl"))
joblib.dump(rf_model, os.path.join(MODELS_DIR, "random_forest_model.pkl"))
joblib.dump(kmeans_model, os.path.join(MODELS_DIR, "kmeans_clustering_model.pkl"))
joblib.dump(preprocessor, os.path.join(MODELS_DIR, "preprocessor.pkl"))

# Save complete unified bundle
bundle = {
    "project": "EduRisk AI",
    "version": "2.0.0",
    "public_url": "https://mldsproject-one.vercel.app",
    "preprocessor": preprocessor,
    "regression_model": reg_model,
    "classification_model": cls_model,
    "random_forest_model": rf_model,
    "kmeans_model": kmeans_model,
    "cluster_features": cluster_features,
    "metrics": {
        "regression": {"r2": round(r2, 4), "mae": round(mae, 4), "rmse": round(rmse, 4)},
        "classification": {"accuracy": round(acc, 4), "recall": round(rec, 4), "f1": round(f1, 4)}
    }
}
joblib.dump(bundle, os.path.join(MODELS_DIR, "edurisk_complete_bundle.joblib"))
print("All model files successfully serialized!")
