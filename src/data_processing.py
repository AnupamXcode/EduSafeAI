"""
EduRisk AI - Data Processing Module
Handles raw data loading, inspection, cleaning, transformation, and train-test splitting.
Adheres to strict leakage prevention guidelines.
"""

import os
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline


PRIMARY_DATA_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "student-mat.csv")
SECONDARY_DATA_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "student-por.csv")
PROCESSED_DATA_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "processed", "student_clean.csv")

NOMINAL_COLS = ["Mjob", "Fjob", "reason", "guardian"]
BINARY_COLS = [
    "school", "sex", "address", "famsize", "Pstatus",
    "schoolsup", "famsup", "paid", "activities",
    "nursery", "higher", "internet", "romantic"
]
ORDINAL_NUMERIC_COLS = [
    "age", "Medu", "Fedu", "traveltime", "studytime", "failures",
    "famrel", "freetime", "goout", "Dalc", "Walc", "health", "absences"
]
GRADE_COLS = ["G1", "G2"]
TARGET_COL = "G3"
RISK_COL = "academic_risk"


def load_raw_data(dataset_type="mat"):
    """
    Loads raw CSV data safely without altering the original files.
    dataset_type: 'mat' (Math course) or 'por' (Portuguese course).
    """
    path = PRIMARY_DATA_PATH if dataset_type == "mat" else SECONDARY_DATA_PATH
    if not os.path.exists(path):
        raise FileNotFoundError(f"Dataset not found at: {path}")
    
    df = pd.read_csv(path, sep=";")
    return df


def inspect_data_quality(df):
    """
    Analyzes dataset dimensions, missing values, duplicates, and column types.
    Returns a dictionary of quality metrics.
    """
    metrics = {
        "num_rows": int(df.shape[0]),
        "num_cols": int(df.shape[1]),
        "missing_values_total": int(df.isnull().sum().sum()),
        "missing_per_col": df.isnull().sum().to_dict(),
        "duplicate_rows": int(df.duplicated().sum()),
        "numeric_cols": [c for c in df.select_dtypes(include=[np.number]).columns],
        "categorical_cols": [c for c in df.select_dtypes(exclude=[np.number]).columns],
        "g3_mean": float(df[TARGET_COL].mean()) if TARGET_COL in df.columns else 0.0,
        "g3_std": float(df[TARGET_COL].std()) if TARGET_COL in df.columns else 0.0,
        "g3_min": int(df[TARGET_COL].min()) if TARGET_COL in df.columns else 0,
        "g3_max": int(df[TARGET_COL].max()) if TARGET_COL in df.columns else 0,
    }
    return metrics


def prepare_dataset(df):
    """
    Creates cleaned copy with defined academic_risk column (G3 < 10 -> At Risk: 1, else 0).
    Saves clean copy to data/processed/ without modifying original raw data.
    """
    clean_df = df.copy()
    
    # Define binary academic risk target (G3 < 10 threshold)
    clean_df[RISK_COL] = (clean_df[TARGET_COL] < 10).astype(int)
    clean_df["risk_label"] = clean_df[RISK_COL].map({1: "At Risk", 0: "Not At Risk"})
    
    # Save processed copy
    os.makedirs(os.path.dirname(PROCESSED_DATA_PATH), exist_ok=True)
    clean_df.to_csv(PROCESSED_DATA_PATH, index=False)
    
    return clean_df


def get_feature_sets(df, early_prediction=False):
    """
    Separates predictor features from target variables.
    Crucial Rule: Target G3 and derived risk labels are ALWAYS excluded.
    If early_prediction is True, G2 is also excluded.
    """
    excluded = [TARGET_COL, RISK_COL, "risk_label"]
    if early_prediction:
        excluded.append("G2")
    
    feature_cols = [c for c in df.columns if c not in excluded]
    return feature_cols


def build_preprocessor(feature_cols, scale_numeric=True):
    """
    Builds a Scikit-learn ColumnTransformer for preprocessing.
    Categorical nominals: One-Hot Encoded (drop='first' to avoid collinearity).
    Binary string flags: One-Hot Encoded (drop='if_binary').
    Numeric features: StandardScaler if scale_numeric is True.
    """
    current_nominals = [c for c in NOMINAL_COLS if c in feature_cols]
    current_binaries = [c for c in BINARY_COLS if c in feature_cols]
    current_numerics = [c for c in (ORDINAL_NUMERIC_COLS + GRADE_COLS) if c in feature_cols]

    transformers = []
    
    if current_nominals:
        transformers.append((
            "nom",
            OneHotEncoder(drop="first", sparse_output=False, handle_unknown="ignore"),
            current_nominals
        ))
        
    if current_binaries:
        transformers.append((
            "bin",
            OneHotEncoder(drop="if_binary", sparse_output=False, handle_unknown="ignore"),
            current_binaries
        ))
        
    if current_numerics:
        if scale_numeric:
            transformers.append(("num", StandardScaler(), current_numerics))
        else:
            transformers.append(("num", "passthrough", current_numerics))
            
    preprocessor = ColumnTransformer(transformers=transformers, remainder="drop")
    return preprocessor


def get_train_test_data(df, task="classification", early_prediction=False, random_state=42):
    """
    Generates train and test splits.
    - task='regression': 80:20 split, target is G3.
    - task='classification': 75:25 stratified split, target is academic_risk.
    """
    feature_cols = get_feature_sets(df, early_prediction=early_prediction)
    X = df[feature_cols].copy()
    
    if task == "regression":
        y = df[TARGET_COL].copy()
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.20, random_state=random_state
        )
    elif task == "classification":
        y = df[RISK_COL].copy()
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.25, random_state=random_state, stratify=y
        )
    else:
        raise ValueError("task must be either 'regression' or 'classification'")
        
    return X_train, X_test, y_train, y_test, feature_cols
