"""
EduRisk AI - Automated Verification & Smoke Test Suite
Executes end-to-end checks across all 7 practicals, saved models, and prediction pipelines.
"""

import os
import sys
import joblib
import pandas as pd
import numpy as np

sys.path.append(os.path.dirname(__file__))

from src.data_processing import (
    load_raw_data,
    inspect_data_quality,
    prepare_dataset,
    get_train_test_data
)
from src.regression import compare_regression_models
from src.classification import train_classifiers
from src.clustering import fit_kmeans, fit_gmm, run_elbow_and_silhouette_analysis, CLUSTERING_FEATURES
from src.ensemble import run_ensemble_experiments
from src.evaluation import run_cross_validation_experiments, run_hyperparameter_tuning


def run_tests():
    print("=" * 65)
    print("RUNNING EDURISK AI VERIFICATION SUITE")
    print("=" * 65)
    
    # Test 1: Raw data inspection
    print("\n[Test 1] Inspecting UCI Student Performance raw data...")
    raw = load_raw_data("mat")
    assert raw.shape == (395, 33), f"Unexpected shape: {raw.shape}"
    quality = inspect_data_quality(raw)
    assert quality["missing_values_total"] == 0, "Missing values found!"
    assert quality["duplicate_rows"] == 0, "Duplicates found!"
    print(f" PASS: Raw dataset verified ({raw.shape[0]} rows, {raw.shape[1]} columns, 0 nulls)")
    
    # Test 2: Processed dataset & target derivation
    print("\n[Test 2] Verifying target derivation and preprocessing...")
    clean = prepare_dataset(raw)
    assert "academic_risk" in clean.columns
    at_risk_count = int(clean["academic_risk"].sum())
    assert at_risk_count == 130, f"Expected 130 at-risk students, found {at_risk_count}"
    print(f" PASS: Academic risk target derived (At Risk: {at_risk_count}, Not At Risk: {395 - at_risk_count})")
    
    # Test 3: Regression training
    print("\n[Test 3] Verifying Regression (Practical 2)...")
    comp_reg, simple, mult = compare_regression_models(clean, early_prediction=False)
    assert mult["metrics"]["test_r2"] > 0.65, f"Low R2: {mult['metrics']['test_r2']}"
    assert mult["metrics"]["test_rmse"] < 3.0, f"High RMSE: {mult['metrics']['test_rmse']}"
    print(f" PASS: Multiple LR R2={mult['metrics']['test_r2']:.3f}, RMSE={mult['metrics']['test_rmse']:.2f}")
    
    # Test 4: Classification training
    print("\n[Test 4] Verifying Supervised Classification (Practical 3)...")
    comp_clf, clf_res, _ = train_classifiers(clean, early_prediction=False)
    lr_metrics = clf_res["Logistic Regression"]["metrics"]
    assert lr_metrics["accuracy"] > 0.85, f"Low accuracy: {lr_metrics['accuracy']}"
    assert lr_metrics["recall"] > 0.80, f"Low recall: {lr_metrics['recall']}"
    print(f" PASS: Logistic Regression Acc={lr_metrics['accuracy']*100:.1f}%, Recall={lr_metrics['recall']*100:.1f}%")
    
    # Test 5: Clustering
    print("\n[Test 5] Verifying K-Means & GMM Clustering (Practicals 4 & 5)...")
    km_res = fit_kmeans(clean, n_clusters=3)
    gmm_res = fit_gmm(clean, n_components=3)
    assert len(km_res["profiles"]) == 3
    assert len(gmm_res["profiles"]) == 3
    print(f" PASS: K-Means (K=3) Silhouette={km_res['silhouette_score']:.3f}, GMM BIC={gmm_res['bic']:.1f}")
    
    # Test 6: Ensembles
    print("\n[Test 6] Verifying Ensemble Learning (Practicals 5 & 6)...")
    ens_res = run_ensemble_experiments(clean, early_prediction=False)
    assert len(ens_res["estimator_count_df"]) == 4
    assert len(ens_res["base_learner_df"]) == 3
    print(" PASS: Ensembles verified across estimator counts and heterogeneous base learners")
    
    # Test 7: Saved Models Integrity
    print("\n[Test 7] Checking Serialized Joblib Models...")
    model_files = [
        "models/simple_linear_regression.joblib",
        "models/multiple_linear_regression.joblib",
        "models/classifier_logistic_regression.joblib",
        "models/kmeans_model.joblib",
        "models/clustering_scaler.joblib",
        "models/random_forest_tuned.joblib"
    ]
    for mf in model_files:
        assert os.path.exists(mf), f"Missing model file: {mf}"
        loaded = joblib.load(mf)
        assert loaded is not None
    print(f" PASS: All {len(model_files)} key model pipelines loaded cleanly from disk")
    
    # Test 8: End-to-end Student Prediction Inference
    print("\n[Test 8] Testing Individual Student Prediction Inference...")
    sample_student = pd.DataFrame([{
        "school": "GP", "sex": "M", "age": 16, "address": "U", "famsize": "LE3",
        "Pstatus": "T", "Medu": 3, "Fedu": 3, "Mjob": "services", "Fjob": "other",
        "reason": "home", "guardian": "mother", "traveltime": 1, "studytime": 2,
        "failures": 0, "schoolsup": "no", "famsup": "yes", "paid": "no",
        "activities": "yes", "nursery": "yes", "higher": "yes", "internet": "yes",
        "romantic": "no", "famrel": 4, "freetime": 3, "goout": 2, "Dalc": 1,
        "Walc": 1, "health": 4, "absences": 2, "G1": 14, "G2": 15
    }])
    reg_model = joblib.load("models/multiple_linear_regression.joblib")
    clf_model = joblib.load("models/classifier_logistic_regression.joblib")
    km_mod = joblib.load("models/kmeans_model.joblib")
    km_sc = joblib.load("models/clustering_scaler.joblib")
    
    pred_g3 = float(reg_model.predict(sample_student)[0])
    pred_risk = int(clf_model.predict(sample_student)[0])
    pred_prob = float(clf_model.predict_proba(sample_student)[0][1])
    sc_feats = km_sc.transform(sample_student[CLUSTERING_FEATURES])
    pred_cluster = int(km_mod.predict(sc_feats)[0])
    
    assert 0 <= pred_g3 <= 20, f"Predicted grade out of bounds: {pred_g3}"
    assert pred_risk in [0, 1]
    assert 0.0 <= pred_prob <= 1.0
    print(f" PASS: Sample Inference => Predicted G3: {pred_g3:.1f}, Risk Code: {pred_risk} (Prob: {pred_prob*100:.1f}%), Cluster: {pred_cluster}")
    
    # Test 9: Output Figures Verification
    print("\n[Test 9] Verifying Generated Publication Figures...")
    fig_dir = "outputs/figures"
    figures = os.listdir(fig_dir)
    assert len(figures) >= 10, f"Expected at least 10 figures, found {len(figures)}"
    for f in figures:
        size = os.path.getsize(os.path.join(fig_dir, f))
        assert size > 5000, f"Figure {f} seems corrupted or empty (size: {size} bytes)"
    print(f" PASS: All {len(figures)} figures verified with non-zero file sizes")
    
    print("\n" + "=" * 65)
    print("ALL TESTS PASSED SUCCESSFULLY! (9/9 CHECKS OK)")
    print("=" * 65)


if __name__ == "__main__":
    run_tests()
