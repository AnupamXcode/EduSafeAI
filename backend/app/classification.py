"""
EduRisk AI - Classification Module (Practical 3)
Implements Supervised Classification for Academic Risk:
- Logistic Regression
- K-Nearest Neighbors (KNN)
- Gaussian Naive Bayes

Uses Stratified 75:25 train-test split and clean preprocessing pipelines.
"""

import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import KNeighborsClassifier
from sklearn.naive_bayes import GaussianNB
from sklearn.pipeline import Pipeline
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    confusion_matrix,
    roc_curve
)
try:
    from .data_processing import (
        build_preprocessor,
        get_train_test_data
    )
except ImportError:
    from data_processing import (
        build_preprocessor,
        get_train_test_data
    )


def train_classifiers(clean_df, early_prediction=False, random_state=42):
    """
    Trains Logistic Regression, KNN, and Gaussian Naive Bayes.
    Evaluates on 75:25 stratified test set.
    """
    X_train, X_test, y_train, y_test, feature_cols = get_train_test_data(
        clean_df, task="classification", early_prediction=early_prediction, random_state=random_state
    )
    
    models = {
        "Logistic Regression": LogisticRegression(max_iter=1000, random_state=random_state),
        "K-Nearest Neighbors": KNeighborsClassifier(n_neighbors=5),
        "Gaussian Naive Bayes": GaussianNB(),
    }
    
    results = {}
    comparison_rows = []
    
    for name, clf in models.items():
        preprocessor = build_preprocessor(feature_cols, scale_numeric=True)
        pipe = Pipeline([
            ("preprocessor", preprocessor),
            ("classifier", clf)
        ])
        
        pipe.fit(X_train, y_train)
        
        y_pred = pipe.predict(X_test)
        if hasattr(pipe, "predict_proba"):
            y_proba = pipe.predict_proba(X_test)[:, 1]
            auc_val = float(roc_auc_score(y_test, y_proba))
            fpr, tpr, thresholds = roc_curve(y_test, y_proba)
        else:
            y_proba = None
            auc_val = 0.0
            fpr, tpr, thresholds = None, None, None
            
        acc = float(accuracy_score(y_test, y_pred))
        prec = float(precision_score(y_test, y_pred, zero_division=0))
        rec = float(recall_score(y_test, y_pred, zero_division=0))
        f1 = float(f1_score(y_test, y_pred, zero_division=0))
        cm = confusion_matrix(y_test, y_pred)
        
        results[name] = {
            "pipeline": pipe,
            "y_test": y_test.values,
            "y_pred": y_pred,
            "y_proba": y_proba,
            "metrics": {
                "accuracy": acc,
                "precision": prec,
                "recall": rec,
                "f1": f1,
                "roc_auc": auc_val,
            },
            "confusion_matrix": cm,
            "roc_curve": (fpr, tpr, thresholds) if fpr is not None else None
        }
        
        comparison_rows.append({
            "Model": name,
            "Accuracy": round(acc, 4),
            "Precision (At Risk)": round(prec, 4),
            "Recall (At Risk)": round(rec, 4),
            "F1-Score": round(f1, 4),
            "ROC-AUC": round(auc_val, 4) if auc_val > 0 else "N/A",
        })
        
    comparison_df = pd.DataFrame(comparison_rows).sort_values(by="F1-Score", ascending=False)
    
    return comparison_df, results, (X_train, X_test, y_train, y_test, feature_cols)
