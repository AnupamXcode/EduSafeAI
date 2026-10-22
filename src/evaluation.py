"""
EduRisk AI - Validation and Optimization Module (Practical 7)
Implements:
1. 5-Fold Stratified Cross-Validation (Baseline Random Forest)
2. 10-Fold Stratified Cross-Validation
3. GridSearchCV Hyperparameter Tuning (n_estimators, max_depth, min_samples_split)
4. RandomizedSearchCV Hyperparameter Tuning (20 iterations)
5. Test-set evaluation of tuned model vs baseline
6. Feature Importances extraction
7. Strict leakage prevention using Scikit-Learn Pipelines
"""

import os
import sys
import time
import warnings
os.environ["LOKY_MAX_CPU_COUNT"] = "2"
warnings.filterwarnings("ignore")

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import (
    StratifiedKFold,
    cross_val_score,
    GridSearchCV,
    RandomizedSearchCV
)
from sklearn.pipeline import Pipeline
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    classification_report,
    confusion_matrix
)
from src.data_processing import (
    build_preprocessor,
    get_train_test_data
)


PARAM_GRID = {
    "clf__n_estimators": [50, 100, 200],
    "clf__max_depth": [None, 5, 10, 15],
    "clf__min_samples_split": [2, 5, 10]
}


def run_cross_validation_experiments(clean_df, early_prediction=False, random_state=42):
    """
    Executes 5-fold and 10-fold Stratified Cross-Validation on the training portion only.
    Prevents data leakage into the test set.
    """
    X_train, X_test, y_train, y_test, feature_cols = get_train_test_data(
        clean_df, task="classification", early_prediction=early_prediction, random_state=random_state
    )
    preprocessor = build_preprocessor(feature_cols, scale_numeric=True)
    
    baseline_pipe = Pipeline([
        ("preprocessor", preprocessor),
        ("clf", RandomForestClassifier(n_estimators=100, random_state=random_state))
    ])
    
    # 5-Fold Stratified CV
    cv5 = StratifiedKFold(n_splits=5, shuffle=True, random_state=random_state)
    scores_5fold = cross_val_score(baseline_pipe, X_train, y_train, cv=cv5, scoring="f1")
    
    # 10-Fold Stratified CV
    cv10 = StratifiedKFold(n_splits=10, shuffle=True, random_state=random_state)
    scores_10fold = cross_val_score(baseline_pipe, X_train, y_train, cv=cv10, scoring="f1")
    
    cv_summary = pd.DataFrame([
        {
            "Validation Strategy": "5-Fold Stratified CV",
            "Mean F1": round(float(np.mean(scores_5fold)), 4),
            "Std Dev": round(float(np.std(scores_5fold)), 4),
            "Min Score": round(float(np.min(scores_5fold)), 4),
            "Max Score": round(float(np.max(scores_5fold)), 4),
            "Scores": [round(float(s), 4) for s in scores_5fold]
        },
        {
            "Validation Strategy": "10-Fold Stratified CV",
            "Mean F1": round(float(np.mean(scores_10fold)), 4),
            "Std Dev": round(float(np.std(scores_10fold)), 4),
            "Min Score": round(float(np.min(scores_10fold)), 4),
            "Max Score": round(float(np.max(scores_10fold)), 4),
            "Scores": [round(float(s), 4) for s in scores_10fold]
        }
    ])
    
    return cv_summary, scores_5fold, scores_10fold


def run_hyperparameter_tuning(clean_df, early_prediction=False, random_state=42):
    """
    Runs both GridSearchCV and RandomizedSearchCV on the training split using 5-fold CV.
    Evaluates final selected model on untouched test set.
    """
    X_train, X_test, y_train, y_test, feature_cols = get_train_test_data(
        clean_df, task="classification", early_prediction=early_prediction, random_state=random_state
    )
    preprocessor = build_preprocessor(feature_cols, scale_numeric=True)
    
    base_pipe = Pipeline([
        ("preprocessor", preprocessor),
        ("clf", RandomForestClassifier(random_state=random_state))
    ])
    
    cv5 = StratifiedKFold(n_splits=5, shuffle=True, random_state=random_state)
    
    # 1. GridSearchCV
    t0_grid = time.time()
    grid_search = GridSearchCV(
        base_pipe,
        PARAM_GRID,
        cv=cv5,
        scoring="f1",
        n_jobs=-1
    )
    grid_search.fit(X_train, y_train)
    grid_time = time.time() - t0_grid
    
    # 2. RandomizedSearchCV (20 iterations)
    t0_rand = time.time()
    random_search = RandomizedSearchCV(
        base_pipe,
        PARAM_GRID,
        n_iter=20,
        cv=cv5,
        scoring="f1",
        random_state=random_state,
        n_jobs=-1
    )
    random_search.fit(X_train, y_train)
    rand_time = time.time() - t0_rand
    
    # Evaluate best model on test set
    best_model = grid_search.best_estimator_
    y_pred_test = best_model.predict(X_test)
    y_proba_test = best_model.predict_proba(X_test)[:, 1] if hasattr(best_model, "predict_proba") else None
    
    test_metrics = {
        "accuracy": float(accuracy_score(y_test, y_pred_test)),
        "precision": float(precision_score(y_test, y_pred_test, zero_division=0)),
        "recall": float(recall_score(y_test, y_pred_test, zero_division=0)),
        "f1": float(f1_score(y_test, y_pred_test, zero_division=0)),
        "roc_auc": float(roc_auc_score(y_test, y_proba_test)) if y_proba_test is not None else 0.0,
        "confusion_matrix": confusion_matrix(y_test, y_pred_test),
        "classification_report": classification_report(y_test, y_pred_test, output_dict=True)
    }
    
    # Extract Feature Importances from the best Random Forest model
    rf_clf = best_model.named_steps["clf"]
    try:
        feat_names = best_model.named_steps["preprocessor"].get_feature_names_out()
    except Exception:
        feat_names = [f"feat_{i}" for i in range(len(rf_clf.feature_importances_))]
        
    feat_importances = pd.DataFrame({
        "feature": feat_names,
        "importance": rf_clf.feature_importances_
    }).sort_values(by="importance", ascending=False)
    
    clean_feat_names = []
    for f in feat_importances["feature"]:
        clean_name = f.replace("num__", "").replace("nom__", "").replace("bin__", "")
        clean_feat_names.append(clean_name)
    feat_importances["clean_feature"] = clean_feat_names
    
    tuning_summary = pd.DataFrame([
        {
            "Search Method": "GridSearchCV (Full Grid: 36 combos)",
            "Best Parameters": str(grid_search.best_params_),
            "Best Mean CV F1": round(float(grid_search.best_score_), 4),
            "Search Time (s)": round(grid_time, 2)
        },
        {
            "Search Method": "RandomizedSearchCV (20 iterations)",
            "Best Parameters": str(random_search.best_params_),
            "Best Mean CV F1": round(float(random_search.best_score_), 4),
            "Search Time (s)": round(rand_time, 2)
        }
    ])
    
    return {
        "grid_search": grid_search,
        "random_search": random_search,
        "best_model": best_model,
        "tuning_summary": tuning_summary,
        "test_metrics": test_metrics,
        "feature_importances": feat_importances,
        "y_test": y_test.values,
        "y_pred": y_pred_test,
        "y_proba": y_proba_test
    }


if __name__ == "__main__":
    import os
    import sys
    sys.path.append(os.path.dirname(os.path.dirname(__file__)))
    from src.data_processing import load_raw_data, prepare_dataset

    print("=" * 65)
    print("EduRisk AI - Validation & Optimization Engine (Practical 7)")
    print("=" * 65)

    raw_data = load_raw_data("mat")
    clean_data = prepare_dataset(raw_data)
    print(f"Loaded {len(clean_data)} student records.")

    print("\n1. Running 5-Fold and 10-Fold Stratified Cross-Validation...")
    cv_sum, s5, s10 = run_cross_validation_experiments(clean_data, early_prediction=False)
    print(cv_sum[["Validation Strategy", "Mean F1", "Std Dev", "Min Score", "Max Score"]].to_string(index=False))

    print("\n2. Running GridSearchCV & RandomizedSearchCV...")
    tuning = run_hyperparameter_tuning(clean_data, early_prediction=False)
    print(tuning["tuning_summary"].to_string(index=False))

    print("\n3. Top 5 Predictive Features (Optimized Random Forest):")
    print(tuning["feature_importances"][["clean_feature", "importance"]].head(5).to_string(index=False))
    print("=" * 65)

