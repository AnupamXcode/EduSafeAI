"""
EduRisk AI - FastAPI Machine Learning Backend Server
Exposes genuine academic analytics, regression, classification, clustering,
ensembles, and hyperparameter optimization endpoints.
"""

import os
import sys
import numpy as np
import pandas as pd
from typing import Optional, List, Dict, Any
from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Ensure current directory is in path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.data_processing import (
    load_raw_data,
    inspect_data_quality,
    prepare_dataset,
    get_train_test_data,
    build_preprocessor
)
from app.regression import (
    train_simple_linear_regression,
    train_multiple_linear_regression,
    compare_regression_models
)
from app.classification import train_classifiers
from app.clustering import (
    run_elbow_and_silhouette_analysis,
    fit_kmeans,
    fit_gmm,
    compare_gmm_components,
    CLUSTERING_FEATURES
)
from app.ensemble import run_ensemble_experiments
from app.evaluation import (
    run_cross_validation_experiments,
    run_hyperparameter_tuning
)

app = FastAPI(
    title="EduRisk AI Academic Analytics API",
    description="Empirical Machine Learning Analytics Engine for Student Performance & Risk",
    version="2.0.0"
)

# Enable CORS for Vite frontend (typically localhost:5173 or 3000) and production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global in-memory cache to guarantee sub-millisecond response times
CACHE = {}

def get_or_load_data(course: str = "mat"):
    key = f"data_{course}"
    if key not in CACHE:
        raw = load_raw_data(course)
        quality = inspect_data_quality(raw)
        clean = prepare_dataset(raw)
        CACHE[key] = {"raw": raw, "clean": clean, "quality": quality}
    return CACHE[key]["raw"], CACHE[key]["clean"], CACHE[key]["quality"]


# Pydantic Schemas
class StudentInput(BaseModel):
    school: str = Field(default="GP", description="GP or MS")
    sex: str = Field(default="F", description="F or M")
    age: int = Field(default=17, ge=15, le=22)
    address: str = Field(default="U", description="U or R")
    famsize: str = Field(default="GT3", description="LE3 or GT3")
    Pstatus: str = Field(default="T", description="T or A")
    Medu: int = Field(default=2, ge=0, le=4)
    Fedu: int = Field(default=2, ge=0, le=4)
    Mjob: str = Field(default="other")
    Fjob: str = Field(default="other")
    reason: str = Field(default="course")
    guardian: str = Field(default="mother")
    traveltime: int = Field(default=1, ge=1, le=4)
    studytime: int = Field(default=2, ge=1, le=4)
    failures: int = Field(default=0, ge=0, le=4)
    schoolsup: str = Field(default="no")
    famsup: str = Field(default="yes")
    paid: str = Field(default="no")
    activities: str = Field(default="yes")
    nursery: str = Field(default="yes")
    higher: str = Field(default="yes")
    internet: str = Field(default="yes")
    romantic: str = Field(default="no")
    famrel: int = Field(default=4, ge=1, le=5)
    freetime: int = Field(default=3, ge=1, le=5)
    goout: int = Field(default=3, ge=1, le=5)
    Dalc: int = Field(default=1, ge=1, le=5)
    Walc: int = Field(default=2, ge=1, le=5)
    health: int = Field(default=3, ge=1, le=5)
    absences: int = Field(default=4, ge=0, le=93)
    G1: int = Field(default=11, ge=0, le=20)
    G2: Optional[int] = Field(default=11, ge=0, le=20)


@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "system": "EduRisk AI",
        "version": "2.0.0",
        "backend": "FastAPI + Scikit-Learn"
    }


@app.get("/api/dataset/summary")
def get_dataset_summary(course: str = Query("mat", regex="^(mat|por)$")):
    raw, clean, quality = get_or_load_data(course)
    at_risk_count = int(clean["academic_risk"].sum())
    return {
        "course": "Mathematics" if course == "mat" else "Portuguese",
        "file": f"student-{course}.csv",
        "total_records": quality["num_rows"],
        "total_attributes": quality["num_cols"],
        "missing_values": quality["missing_values_total"],
        "duplicate_records": quality["duplicate_rows"],
        "numeric_features_count": len(quality["numeric_cols"]),
        "categorical_features_count": len(quality["categorical_cols"]),
        "g3_mean": round(quality["g3_mean"], 2),
        "g3_std": round(quality["g3_std"], 2),
        "g3_min": quality["g3_min"],
        "g3_max": quality["g3_max"],
        "at_risk_count": at_risk_count,
        "not_at_risk_count": quality["num_rows"] - at_risk_count,
        "at_risk_percentage": round((at_risk_count / quality["num_rows"]) * 100, 1)
    }


@app.get("/api/dataset/eda")
def get_eda_data(course: str = Query("mat", regex="^(mat|por)$")):
    raw, clean, quality = get_or_load_data(course)
    
    # 1. Grade histograms (G1, G2, G3)
    bins = list(range(0, 22))
    hist_g1, _ = np.histogram(clean["G1"], bins=bins)
    hist_g2, _ = np.histogram(clean["G2"], bins=bins)
    hist_g3, _ = np.histogram(clean["G3"], bins=bins)
    
    grade_distribution = []
    for i in range(len(bins) - 1):
        grade_distribution.append({
            "grade": bins[i],
            "G1": int(hist_g1[i]),
            "G2": int(hist_g2[i]),
            "G3": int(hist_g3[i]),
        })
        
    # 2. Study time vs mean G3
    study_means = clean.groupby("studytime")["G3"].mean().to_dict()
    study_labels = {1: "< 2 hrs", 2: "2 - 5 hrs", 3: "5 - 10 hrs", 4: "> 10 hrs"}
    study_comparison = [
        {"studytime": study_labels.get(k, str(k)), "mean_g3": round(float(v), 2), "code": k}
        for k, v in study_means.items()
    ]
    
    # 3. Absences vs G3 scatter points (sample 100 for responsive charting)
    sample_df = clean[["absences", "G3", "risk_label", "studytime"]].copy()
    absences_scatter = [
        {
            "absences": int(row["absences"]),
            "g3": int(row["G3"]),
            "risk": row["risk_label"],
            "studytime": int(row["studytime"])
        }
        for _, row in sample_df.iterrows()
    ]
    
    # 4. Correlation Matrix
    num_cols = ["age", "Medu", "Fedu", "studytime", "failures", "absences", "G1", "G2", "G3"]
    corr = clean[num_cols].corr().round(3).to_dict()
    
    return {
        "grade_distribution": grade_distribution,
        "study_comparison": study_comparison,
        "absences_scatter": absences_scatter,
        "correlation_matrix": corr,
        "numerical_columns": num_cols
    }


@app.get("/api/dataset/preview")
def get_dataset_preview(course: str = Query("mat", regex="^(mat|por)$"), limit: int = 50):
    _, clean, _ = get_or_load_data(course)
    records = clean.head(limit).to_dict(orient="records")
    return {
        "columns": list(clean.columns),
        "records": records,
        "total": len(clean)
    }


@app.get("/api/models/regression")
def get_regression_models(
    course: str = Query("mat", regex="^(mat|por)$"),
    early: bool = Query(False)
):
    _, clean, _ = get_or_load_data(course)
    comp, simple_res, mult_res = compare_regression_models(clean, early_prediction=early)
    
    # Top 10 Coefficients
    coef_df = mult_res["coefficients"].head(10).to_dict(orient="records")
    
    # Actual vs Predicted points (subsample 60 for clean scatter rendering)
    y_true = mult_res["y_test"]
    y_pred = mult_res["y_pred"]
    scatter_pts = [
        {"actual": round(float(y_t), 1), "predicted": round(float(y_p), 1)}
        for y_t, y_p in zip(y_true, y_pred)
    ]
    
    # Simple LR line points
    x_line = [0, 5, 10, 15, 20]
    m_slope = simple_res["metrics"]["slope"]
    b_inter = simple_res["metrics"]["intercept"]
    line_pts = [
        {"x": x, "y": round(float(m_slope * x + b_inter), 2)}
        for x in x_line
    ]
    
    return {
        "mode": "Early Warning (No G2)" if early else "Full Term (With G2)",
        "comparison": comp.to_dict(orient="records"),
        "simple_metrics": simple_res["metrics"],
        "multiple_metrics": mult_res["metrics"],
        "coefficients": coef_df,
        "actual_vs_predicted": scatter_pts,
        "simple_regression_line": line_pts,
    }


@app.post("/api/predict/grade")
def predict_student_grade(student: StudentInput, early: bool = Query(False)):
    _, clean, _ = get_or_load_data("mat")
    _, _, mult_res = compare_regression_models(clean, early_prediction=early)
    pipeline = mult_res["pipeline"]
    
    row_dict = student.model_dump()
    if early:
        row_dict.pop("G2", None)
    df_single = pd.DataFrame([row_dict])
    
    pred_g3 = float(pipeline.predict(df_single)[0])
    pred_g3 = max(0.0, min(20.0, pred_g3))
    
    # Identify top 3 driving features based on deviation from cohort mean
    drivers = []
    if student.G1 < 10:
        drivers.append("Period 1 exam score (G1) is below average")
    elif student.G1 >= 14:
        drivers.append("Strong baseline exam score (G1)")
        
    if student.failures > 0:
        drivers.append(f"History of {student.failures} past course failures")
    if student.studytime >= 3:
        drivers.append("High weekly study commitment (5+ hrs/week)")
    elif student.studytime == 1:
        drivers.append("Low weekly study time (< 2 hrs/week)")
    if student.absences > 10:
        drivers.append(f"Elevated school absences ({student.absences} sessions)")
        
    if not drivers:
        drivers.append("Standard academic engagement and steady attendance")
        
    return {
        "predicted_g3": round(pred_g3, 2),
        "scale": "0 - 20",
        "risk_status": "At Risk" if pred_g3 < 10 else "Not At Risk",
        "expected_error_margin": round(mult_res["metrics"]["test_mae"], 2),
        "drivers": drivers
    }


@app.get("/api/models/classification")
def get_classification_models(
    course: str = Query("mat", regex="^(mat|por)$"),
    early: bool = Query(False)
):
    _, clean, _ = get_or_load_data(course)
    comp_df, results, _ = train_classifiers(clean, early_prediction=early)
    
    serialized_results = {}
    for name, res in results.items():
        cm = res["confusion_matrix"].tolist()
        curve = res["roc_curve"]
        roc_pts = []
        if curve:
            fpr, tpr, _ = curve
            # sample 15 points along curve
            step = max(1, len(fpr) // 15)
            roc_pts = [
                {"fpr": round(float(fpr[i]), 3), "tpr": round(float(tpr[i]), 3)}
                for i in range(0, len(fpr), step)
            ]
            if roc_pts[-1]["fpr"] != 1.0:
                roc_pts.append({"fpr": 1.0, "tpr": 1.0})
                
        serialized_results[name] = {
            "metrics": res["metrics"],
            "confusion_matrix": {
                "raw": cm,
                "tn": int(cm[0][0]),
                "fp": int(cm[0][1]),
                "fn": int(cm[1][0]),
                "tp": int(cm[1][1])
            },
            "roc_curve": roc_pts
        }
        
    return {
        "mode": "Early Warning (No G2)" if early else "Full Term (With G2)",
        "comparison_table": comp_df.to_dict(orient="records"),
        "models": serialized_results
    }


@app.post("/api/predict/risk")
def predict_student_risk(student: StudentInput, early: bool = Query(False)):
    _, clean, _ = get_or_load_data("mat")
    _, results, _ = train_classifiers(clean, early_prediction=early)
    pipeline = results["Logistic Regression"]["pipeline"]
    
    row_dict = student.model_dump()
    if early:
        row_dict.pop("G2", None)
    df_single = pd.DataFrame([row_dict])
    
    pred_code = int(pipeline.predict(df_single)[0])
    prob_risk = float(pipeline.predict_proba(df_single)[0][1])
    
    if prob_risk >= 0.65:
        level = "High Academic Vulnerability"
        rec = "Immediate 1-on-1 tutoring recommended; review prerequisite modules from Period 1."
    elif prob_risk >= 0.40:
        level = "Moderate Attention Required"
        rec = "Encourage peer study groups, monitor class attendance, and arrange periodic check-ins."
    else:
        level = "Low Risk / Academic Stability"
        rec = "Student is well on track. Continue promoting self-directed study and advanced projects."
        
    return {
        "risk_code": pred_code,
        "risk_status": "At Risk" if pred_code == 1 else "Not At Risk",
        "risk_probability": round(prob_risk * 100, 1),
        "risk_level": level,
        "recommendation": rec
    }


@app.get("/api/models/clustering")
def get_clustering_models(
    course: str = Query("mat", regex="^(mat|por)$"),
    k: int = Query(3, ge=2, le=6)
):
    _, clean, _ = get_or_load_data(course)
    elbow_res = run_elbow_and_silhouette_analysis(clean)
    km_res = fit_kmeans(clean, n_clusters=k)
    gmm_res = fit_gmm(clean, n_components=k)
    gmm_comp = compare_gmm_components(clean, [3, 4, 5])
    
    # Format elbow and silhouette curve points
    elbow_series = [
        {"k": k_val, "inertia": round(float(ine), 1)}
        for k_val, ine in zip(elbow_res["k_values"], elbow_res["inertias"])
    ]
    silhouette_series = [
        {"k": k_val, "silhouette": round(float(sil), 4)}
        for k_val, sil in zip(elbow_res["silhouette_k_values"], elbow_res["silhouette_scores"])
    ]
    
    # Format 2D PCA scatter points
    clustered_df = km_res["clustered_df"]
    pca_points = [
        {
            "pca1": round(float(row["pca1"]), 2),
            "pca2": round(float(row["pca2"]), 2),
            "cluster": int(row["cluster_kmeans"]),
            "g3": int(row["G3"]),
            "failures": int(row["failures"]),
            "studytime": int(row["studytime"]),
            "absences": int(row["absences"])
        }
        for _, row in clustered_df.iterrows()
    ]
    
    # Profiles table
    view_cols = ["cluster_kmeans", "student_count", "percentage", "studytime", "failures", "absences", "G1", "G3", "academic_risk"]
    profiles_dict = km_res["profiles"][[c for c in view_cols if c in km_res["profiles"].columns]].round(2).to_dict(orient="records")
    
    return {
        "k_selected": k,
        "silhouette_score": round(km_res["silhouette_score"], 4),
        "explained_variance": [round(float(v), 3) for v in km_res["explained_variance"]],
        "elbow_series": elbow_series,
        "silhouette_series": silhouette_series,
        "pca_points": pca_points,
        "cluster_profiles": profiles_dict,
        "gmm_comparison": gmm_comp.to_dict(orient="records")
    }


@app.get("/api/models/ensembles")
def get_ensemble_models(
    course: str = Query("mat", regex="^(mat|por)$"),
    early: bool = Query(False)
):
    _, clean, _ = get_or_load_data(course)
    ens_res = run_ensemble_experiments(clean, early_prediction=early)
    return {
        "mode": "Early Warning (No G2)" if early else "Full Term (With G2)",
        "overall_comparison": ens_res["overall_comparison"].to_dict(orient="records"),
        "estimator_scaling": ens_res["estimator_count_df"].to_dict(orient="records"),
        "base_learners": ens_res["base_learner_df"].to_dict(orient="records")
    }


@app.get("/api/models/validation")
def get_validation_tuning(
    course: str = Query("mat", regex="^(mat|por)$"),
    early: bool = Query(False)
):
    _, clean, _ = get_or_load_data(course)
    cv_sum, s5, s10 = run_cross_validation_experiments(clean, early_prediction=early)
    tuning_res = run_hyperparameter_tuning(clean, early_prediction=early)
    
    top10_feats = tuning_res["feature_importances"].head(10)[["clean_feature", "importance"]].round(4).to_dict(orient="records")
    
    tm = tuning_res["test_metrics"]
    clean_test_metrics = {
        "accuracy": round(float(tm["accuracy"]), 4),
        "precision": round(float(tm["precision"]), 4),
        "recall": round(float(tm["recall"]), 4),
        "f1": round(float(tm["f1"]), 4),
        "roc_auc": round(float(tm["roc_auc"]), 4)
    }

    return {
        "cross_validation_summary": cv_sum.to_dict(orient="records"),
        "cv_5fold_scores": [round(float(s), 4) for s in s5],
        "cv_10fold_scores": [round(float(s), 4) for s in s10],
        "tuning_summary": tuning_res["tuning_summary"].to_dict(orient="records"),
        "test_metrics": clean_test_metrics,
        "top_features": top10_feats
    }
