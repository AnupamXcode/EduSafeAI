"""
EduRisk AI - Ensemble Learning Module (Practicals 5 & 6)
Implements and compares:
1. Single Decision Tree (baseline)
2. Bagging with varying estimator counts (5, 10, 50, 100)
3. Bagging (20 estimators) across distinct base learners (Decision Tree, KNN, Logistic Regression)
4. Random Forest (100 estimators)
5. Balanced Random Forest (class_weight='balanced')

Uses modern Scikit-Learn API (estimator=... rather than deprecated base_estimator).
"""

import numpy as np
import pandas as pd
from sklearn.tree import DecisionTreeClassifier
from sklearn.ensemble import BaggingClassifier, RandomForestClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    confusion_matrix
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


def evaluate_clf_pipeline(pipe, X_train, y_train, X_test, y_test):
    """
    Fits pipeline, predicts, and returns comprehensive evaluation metrics.
    """
    pipe.fit(X_train, y_train)
    y_pred = pipe.predict(X_test)
    
    if hasattr(pipe, "predict_proba"):
        y_proba = pipe.predict_proba(X_test)[:, 1]
        auc_val = float(roc_auc_score(y_test, y_proba))
    else:
        y_proba = None
        auc_val = 0.0
        
    return {
        "accuracy": float(accuracy_score(y_test, y_pred)),
        "precision": float(precision_score(y_test, y_pred, zero_division=0)),
        "recall": float(recall_score(y_test, y_pred, zero_division=0)),
        "f1": float(f1_score(y_test, y_pred, zero_division=0)),
        "roc_auc": auc_val,
        "y_pred": y_pred,
        "y_proba": y_proba,
        "confusion_matrix": confusion_matrix(y_test, y_pred)
    }


def run_ensemble_experiments(clean_df, early_prediction=False, random_state=42):
    """
    Executes full ensemble suite on 75:25 stratified split.
    """
    X_train, X_test, y_train, y_test, feature_cols = get_train_test_data(
        clean_df, task="classification", early_prediction=early_prediction, random_state=random_state
    )
    preprocessor = build_preprocessor(feature_cols, scale_numeric=True)
    
    # 1. Single Decision Tree Baseline
    dt_pipe = Pipeline([
        ("preprocessor", preprocessor),
        ("clf", DecisionTreeClassifier(random_state=random_state))
    ])
    dt_eval = evaluate_clf_pipeline(dt_pipe, X_train, y_train, X_test, y_test)
    
    # 2. Bagging with varying estimator counts [5, 10, 50, 100]
    n_estimators_list = [5, 10, 50, 100]
    estimator_count_results = []
    
    for n in n_estimators_list:
        bag_pipe = Pipeline([
            ("preprocessor", preprocessor),
            ("clf", BaggingClassifier(
                estimator=DecisionTreeClassifier(random_state=random_state),
                n_estimators=n,
                random_state=random_state
            ))
        ])
        eval_res = evaluate_clf_pipeline(bag_pipe, X_train, y_train, X_test, y_test)
        estimator_count_results.append({
            "Estimators": n,
            "Accuracy": round(eval_res["accuracy"], 4),
            "Precision": round(eval_res["precision"], 4),
            "Recall": round(eval_res["recall"], 4),
            "F1-Score": round(eval_res["f1"], 4),
            "ROC-AUC": round(eval_res["roc_auc"], 4)
        })
        
    estimator_count_df = pd.DataFrame(estimator_count_results)
    
    # 3. Bagging (20 estimators) across diverse base learners
    base_learners = {
        "Decision Tree": DecisionTreeClassifier(random_state=random_state),
        "K-Nearest Neighbors": KNeighborsClassifier(n_neighbors=5),
        "Logistic Regression": LogisticRegression(max_iter=1000, random_state=random_state)
    }
    base_learner_results = []
    
    for name, base_clf in base_learners.items():
        bag_pipe = Pipeline([
            ("preprocessor", preprocessor),
            ("clf", BaggingClassifier(
                estimator=base_clf,
                n_estimators=20,
                random_state=random_state
            ))
        ])
        eval_res = evaluate_clf_pipeline(bag_pipe, X_train, y_train, X_test, y_test)
        base_learner_results.append({
            "Base Learner": name,
            "Accuracy": round(eval_res["accuracy"], 4),
            "Precision": round(eval_res["precision"], 4),
            "Recall": round(eval_res["recall"], 4),
            "F1-Score": round(eval_res["f1"], 4),
            "ROC-AUC": round(eval_res["roc_auc"], 4)
        })
        
    base_learner_df = pd.DataFrame(base_learner_results)
    
    # 4. Standard Random Forest (100 trees)
    rf_pipe = Pipeline([
        ("preprocessor", preprocessor),
        ("clf", RandomForestClassifier(n_estimators=100, random_state=random_state))
    ])
    rf_eval = evaluate_clf_pipeline(rf_pipe, X_train, y_train, X_test, y_test)
    
    # 5. Balanced Random Forest (100 trees, class_weight='balanced')
    rf_balanced_pipe = Pipeline([
        ("preprocessor", preprocessor),
        ("clf", RandomForestClassifier(n_estimators=100, class_weight="balanced", random_state=random_state))
    ])
    rf_balanced_eval = evaluate_clf_pipeline(rf_balanced_pipe, X_train, y_train, X_test, y_test)
    
    # Overall comparison table
    overall_comparison = pd.DataFrame([
        {
            "Model Architecture": "Single Decision Tree (Baseline)",
            "Accuracy": round(dt_eval["accuracy"], 4),
            "Precision": round(dt_eval["precision"], 4),
            "Recall": round(dt_eval["recall"], 4),
            "F1-Score": round(dt_eval["f1"], 4),
            "ROC-AUC": round(dt_eval["roc_auc"], 4)
        },
        {
            "Model Architecture": "Bagging (DT, 100 Trees)",
            "Accuracy": round(estimator_count_results[-1]["Accuracy"], 4),
            "Precision": round(estimator_count_results[-1]["Precision"], 4),
            "Recall": round(estimator_count_results[-1]["Recall"], 4),
            "F1-Score": round(estimator_count_results[-1]["F1-Score"], 4),
            "ROC-AUC": round(estimator_count_results[-1]["ROC-AUC"], 4)
        },
        {
            "Model Architecture": "Bagging (KNN, 20 Estimators)",
            "Accuracy": round(base_learner_results[1]["Accuracy"], 4),
            "Precision": round(base_learner_results[1]["Precision"], 4),
            "Recall": round(base_learner_results[1]["Recall"], 4),
            "F1-Score": round(base_learner_results[1]["F1-Score"], 4),
            "ROC-AUC": round(base_learner_results[1]["ROC-AUC"], 4)
        },
        {
            "Model Architecture": "Bagging (Logistic Regression, 20 Estimators)",
            "Accuracy": round(base_learner_results[2]["Accuracy"], 4),
            "Precision": round(base_learner_results[2]["Precision"], 4),
            "Recall": round(base_learner_results[2]["Recall"], 4),
            "F1-Score": round(base_learner_results[2]["F1-Score"], 4),
            "ROC-AUC": round(base_learner_results[2]["ROC-AUC"], 4)
        },
        {
            "Model Architecture": "Random Forest (100 Trees)",
            "Accuracy": round(rf_eval["accuracy"], 4),
            "Precision": round(rf_eval["precision"], 4),
            "Recall": round(rf_eval["recall"], 4),
            "F1-Score": round(rf_eval["f1"], 4),
            "ROC-AUC": round(rf_eval["roc_auc"], 4)
        },
        {
            "Model Architecture": "Random Forest (Balanced Weights)",
            "Accuracy": round(rf_balanced_eval["accuracy"], 4),
            "Precision": round(rf_balanced_eval["precision"], 4),
            "Recall": round(rf_balanced_eval["recall"], 4),
            "F1-Score": round(rf_balanced_eval["f1"], 4),
            "ROC-AUC": round(rf_balanced_eval["roc_auc"], 4)
        }
    ]).sort_values(by="F1-Score", ascending=False)
    
    return {
        "dt_eval": dt_eval,
        "rf_eval": rf_eval,
        "rf_balanced_eval": rf_balanced_eval,
        "estimator_count_df": estimator_count_df,
        "base_learner_df": base_learner_df,
        "overall_comparison": overall_comparison,
        "pipelines": {
            "dt": dt_pipe,
            "rf": rf_pipe,
            "rf_balanced": rf_balanced_pipe
        }
    }


if __name__ == "__main__":
    import os
    import sys
    sys.path.append(os.path.dirname(os.path.dirname(__file__)))
    from src.data_processing import load_raw_data, prepare_dataset

    print("=" * 65)
    print("EduRisk AI - Ensemble Learning Laboratory (Practicals 5 & 6)")
    print("=" * 65)

    raw_data = load_raw_data("mat")
    clean_data = prepare_dataset(raw_data)
    print(f"Loaded {len(clean_data)} student records.")

    print("\nRunning Ensemble Suite...")
    res = run_ensemble_experiments(clean_data, early_prediction=False)
    print("\nOverall Ensemble Comparison:")
    print(res["overall_comparison"].to_string(index=False))

    print("\nEstimator Scaling (5, 10, 50, 100 Trees):")
    print(res["estimator_count_df"].to_string(index=False))

    print("\nHeterogeneous Base Learners (20 Estimators):")
    print(res["base_learner_df"].to_string(index=False))
    print("=" * 65)

