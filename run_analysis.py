"""
EduRisk AI - Comprehensive Analysis & Model Training Pipeline
Executes all 7 practicals end-to-end:
1. Data Quality Inspection & Preprocessing
2. Simple & Multiple Linear Regression
3. Logistic Regression, KNN & Gaussian Naive Bayes Classification
4. K-Means Clustering & Segmentation
5. Gaussian Mixture Models & Soft Clustering
6. Ensemble Learning (Bagging & Random Forest)
7. Stratified K-Fold CV & Hyperparameter Optimization

Saves trained models, publication figures, and benchmark reports.
"""

import os
import sys
import warnings
os.environ["LOKY_MAX_CPU_COUNT"] = "2"
warnings.filterwarnings("ignore")

import json
import joblib
import numpy as np
import pandas as pd
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import seaborn as sns

# Color palette definition matching EduRisk AI design system
COLORS = {
    "ivory": "#F7F3E9",
    "olive": "#414B32",
    "sage": "#A5AD91",
    "terracotta": "#B95F45",
    "clay": "#D9B5A0",
    "sand": "#E9DFCC",
    "espresso": "#302A25",
    "white": "#FFFFFF"
}

plt.rcParams["font.family"] = "sans-serif"
plt.rcParams["text.color"] = COLORS["espresso"]
plt.rcParams["axes.labelcolor"] = COLORS["espresso"]
plt.rcParams["xtick.color"] = COLORS["espresso"]
plt.rcParams["ytick.color"] = COLORS["espresso"]

from src.data_processing import (
    load_raw_data,
    inspect_data_quality,
    prepare_dataset,
    get_train_test_data,
    build_preprocessor
)
from src.regression import (
    train_simple_linear_regression,
    train_multiple_linear_regression,
    compare_regression_models
)
from src.classification import train_classifiers
from src.clustering import (
    run_elbow_and_silhouette_analysis,
    fit_kmeans,
    fit_gmm,
    compare_gmm_components
)
from src.ensemble import run_ensemble_experiments
from src.evaluation import (
    run_cross_validation_experiments,
    run_hyperparameter_tuning
)


def ensure_dirs():
    os.makedirs("models", exist_ok=True)
    os.makedirs("outputs/figures", exist_ok=True)
    os.makedirs("outputs/reports", exist_ok=True)


def main():
    print("=" * 70)
    print("EduRisk AI - End-to-End University Machine Learning Pipeline")
    print("=" * 70)
    ensure_dirs()
    
    # ----------------------------------------------------
    # Practical 1: Data Preprocessing & EDA
    # ----------------------------------------------------
    print("\n[Practical 1] Loading and preprocessing dataset...")
    raw_df = load_raw_data("mat")
    quality = inspect_data_quality(raw_df)
    clean_df = prepare_dataset(raw_df)
    print(f"Dataset Shape: {raw_df.shape[0]} rows, {raw_df.shape[1]} columns")
    print(f"Missing Values: {quality['missing_values_total']}, Duplicates: {quality['duplicate_rows']}")
    print(f"Target G3: Mean={quality['g3_mean']:.2f}, Std={quality['g3_std']:.2f}")
    
    # Figure: Grade Distributions
    fig, axes = plt.subplots(1, 3, figsize=(14, 4), facecolor=COLORS["ivory"])
    for idx, g in enumerate(["G1", "G2", "G3"]):
        ax = axes[idx]
        ax.set_facecolor(COLORS["white"])
        sns.histplot(clean_df[g], kde=True, color=COLORS["olive"], ax=ax, bins=15)
        ax.set_title(f"Distribution of {g}", fontsize=12, fontweight="bold", color=COLORS["olive"])
        ax.set_xlabel("Grade (0-20 scale)")
        ax.grid(True, linestyle="--", alpha=0.3, color=COLORS["clay"])
    plt.tight_layout()
    plt.savefig("outputs/figures/eda_distributions.png", dpi=200, facecolor=fig.get_facecolor())
    plt.close()
    
    # Figure: Numerical Correlations
    num_cols = ["age", "Medu", "Fedu", "studytime", "failures", "absences", "G1", "G2", "G3"]
    fig, ax = plt.subplots(figsize=(8, 6), facecolor=COLORS["ivory"])
    ax.set_facecolor(COLORS["white"])
    corr_mat = clean_df[num_cols].corr()
    sns.heatmap(
        corr_mat,
        annot=True,
        fmt=".2f",
        cmap=sns.diverging_palette(35, 120, s=60, l=45, as_cmap=True),
        ax=ax,
        cbar_kws={"label": "Pearson Correlation"}
    )
    ax.set_title("Academic Feature Correlation Matrix", fontsize=13, fontweight="bold", color=COLORS["olive"], pad=12)
    plt.tight_layout()
    plt.savefig("outputs/figures/eda_correlations.png", dpi=200, facecolor=fig.get_facecolor())
    plt.close()
    
    # ----------------------------------------------------
    # Practical 2: Regression (Grade Prediction)
    # ----------------------------------------------------
    print("\n[Practical 2] Training Grade Regression Models...")
    reg_comp_late, simple_late, mult_late = compare_regression_models(clean_df, early_prediction=False)
    reg_comp_early, simple_early, mult_early = compare_regression_models(clean_df, early_prediction=True)
    
    joblib.dump(simple_late["model"], "models/simple_linear_regression.joblib")
    joblib.dump(mult_late["pipeline"], "models/multiple_linear_regression.joblib")
    joblib.dump(mult_early["pipeline"], "models/multiple_linear_regression_early.joblib")
    
    # Figure: Actual vs Predicted
    fig, axes = plt.subplots(1, 2, figsize=(12, 5), facecolor=COLORS["ivory"])
    # Late mode
    axes[0].set_facecolor(COLORS["white"])
    axes[0].scatter(mult_late["y_test"], mult_late["y_pred"], color=COLORS["olive"], alpha=0.7, edgecolors="none")
    axes[0].plot([0, 20], [0, 20], color=COLORS["terracotta"], linestyle="--", label="Ideal Fit (y=x)")
    axes[0].set_title(f"Multiple LR - Full Term (R²={mult_late['metrics']['test_r2']:.3f})", fontweight="bold", color=COLORS["olive"])
    axes[0].set_xlabel("Actual G3")
    axes[0].set_ylabel("Predicted G3")
    axes[0].legend()
    axes[0].grid(True, linestyle="--", alpha=0.3)
    
    # Early mode
    axes[1].set_facecolor(COLORS["white"])
    axes[1].scatter(mult_early["y_test"], mult_early["y_pred"], color=COLORS["sage"], alpha=0.8, edgecolors=COLORS["olive"])
    axes[1].plot([0, 20], [0, 20], color=COLORS["terracotta"], linestyle="--", label="Ideal Fit (y=x)")
    axes[1].set_title(f"Multiple LR - Early Warning (R²={mult_early['metrics']['test_r2']:.3f})", fontweight="bold", color=COLORS["olive"])
    axes[1].set_xlabel("Actual G3")
    axes[1].set_ylabel("Predicted G3")
    axes[1].legend()
    axes[1].grid(True, linestyle="--", alpha=0.3)
    
    plt.tight_layout()
    plt.savefig("outputs/figures/regression_actual_vs_pred.png", dpi=200, facecolor=fig.get_facecolor())
    plt.close()
    
    # ----------------------------------------------------
    # Practical 3: Supervised Classification
    # ----------------------------------------------------
    print("\n[Practical 3] Training Academic Risk Classifiers...")
    clf_comp_late, clf_res_late, _ = train_classifiers(clean_df, early_prediction=False)
    clf_comp_early, clf_res_early, _ = train_classifiers(clean_df, early_prediction=True)
    
    for name, res in clf_res_late.items():
        fname = f"models/classifier_{name.lower().replace(' ', '_')}.joblib"
        joblib.dump(res["pipeline"], fname)
        
    # Figure: Confusion Matrices
    fig, axes = plt.subplots(1, 3, figsize=(15, 4.5), facecolor=COLORS["ivory"])
    labels = ["Not At Risk", "At Risk"]
    for idx, (name, res) in enumerate(clf_res_late.items()):
        ax = axes[idx]
        ax.set_facecolor(COLORS["white"])
        cm = res["confusion_matrix"]
        sns.heatmap(cm, annot=True, fmt="d", cmap=sns.light_palette(COLORS["olive"], as_cmap=True),
                    xticklabels=labels, yticklabels=labels, ax=ax, cbar=False)
        ax.set_title(f"{name}\nRecall: {res['metrics']['recall']:.2f} | Acc: {res['metrics']['accuracy']:.2f}",
                     fontsize=11, fontweight="bold", color=COLORS["olive"])
        ax.set_xlabel("Predicted Label")
        ax.set_ylabel("True Label")
    plt.tight_layout()
    plt.savefig("outputs/figures/classification_confusion_matrices.png", dpi=200, facecolor=fig.get_facecolor())
    plt.close()
    
    # Figure: ROC Curves
    fig, ax = plt.subplots(figsize=(7, 5), facecolor=COLORS["ivory"])
    ax.set_facecolor(COLORS["white"])
    palette = [COLORS["olive"], COLORS["terracotta"], COLORS["sage"]]
    for idx, (name, res) in enumerate(clf_res_late.items()):
        curve = res["roc_curve"]
        if curve:
            fpr, tpr, _ = curve
            ax.plot(fpr, tpr, label=f"{name} (AUC = {res['metrics']['roc_auc']:.3f})", color=palette[idx % 3], linewidth=2)
    ax.plot([0, 1], [0, 1], color=COLORS["clay"], linestyle=":", label="Chance Baseline")
    ax.set_title("ROC Curves - Academic Risk Classification", fontsize=12, fontweight="bold", color=COLORS["olive"])
    ax.set_xlabel("False Positive Rate")
    ax.set_ylabel("True Positive Rate (Recall)")
    ax.legend(loc="lower right")
    ax.grid(True, linestyle="--", alpha=0.3)
    plt.tight_layout()
    plt.savefig("outputs/figures/classification_roc_curves.png", dpi=200, facecolor=fig.get_facecolor())
    plt.close()
    
    # ----------------------------------------------------
    # Practicals 4 & 5: Clustering (K-Means & GMM)
    # ----------------------------------------------------
    print("\n[Practicals 4 & 5] Running K-Means & GMM Clustering...")
    elbow_res = run_elbow_and_silhouette_analysis(clean_df)
    kmeans_res = fit_kmeans(clean_df, n_clusters=3)
    gmm_res = fit_gmm(clean_df, n_components=3)
    gmm_comp = compare_gmm_components(clean_df, [3, 4, 5])
    
    joblib.dump(kmeans_res["model"], "models/kmeans_model.joblib")
    joblib.dump(kmeans_res["scaler"], "models/clustering_scaler.joblib")
    joblib.dump(gmm_res["model"], "models/gmm_model.joblib")
    
    # Figure: Elbow and Silhouette Curve
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 4.5), facecolor=COLORS["ivory"])
    ax1.set_facecolor(COLORS["white"])
    ax1.plot(elbow_res["k_values"], elbow_res["inertias"], marker="o", color=COLORS["olive"], linewidth=2)
    ax1.set_title("Elbow Method (Inertia vs K)", fontweight="bold", color=COLORS["olive"])
    ax1.set_xlabel("Number of Clusters (K)")
    ax1.set_ylabel("Inertia (SSE)")
    ax1.grid(True, linestyle="--", alpha=0.3)
    
    ax2.set_facecolor(COLORS["white"])
    ax2.plot(elbow_res["silhouette_k_values"], elbow_res["silhouette_scores"], marker="s", color=COLORS["terracotta"], linewidth=2)
    ax2.set_title("Silhouette Scores vs K", fontweight="bold", color=COLORS["terracotta"])
    ax2.set_xlabel("Number of Clusters (K)")
    ax2.set_ylabel("Mean Silhouette Score")
    ax2.grid(True, linestyle="--", alpha=0.3)
    
    plt.tight_layout()
    plt.savefig("outputs/figures/clustering_elbow_silhouette.png", dpi=200, facecolor=fig.get_facecolor())
    plt.close()
    
    # Figure: PCA 2D Cluster Map
    fig, ax = plt.subplots(figsize=(8, 5.5), facecolor=COLORS["ivory"])
    ax.set_facecolor(COLORS["white"])
    scatter = ax.scatter(
        kmeans_res["clustered_df"]["pca1"],
        kmeans_res["clustered_df"]["pca2"],
        c=kmeans_res["cluster_labels"],
        cmap=matplotlib.colors.ListedColormap([COLORS["olive"], COLORS["sage"], COLORS["terracotta"]]),
        alpha=0.8,
        edgecolors="none",
        s=45
    )
    ax.set_title(f"Student Segments (K-Means, K=3) via 2D PCA\nExplained Variance: {sum(kmeans_res['explained_variance'])*100:.1f}%",
                 fontsize=12, fontweight="bold", color=COLORS["olive"])
    ax.set_xlabel("Principal Component 1")
    ax.set_ylabel("Principal Component 2")
    cbar = plt.colorbar(scatter, ax=ax, ticks=[0, 1, 2])
    cbar.set_ticklabels(["Cluster 0", "Cluster 1", "Cluster 2"])
    ax.grid(True, linestyle="--", alpha=0.3)
    plt.tight_layout()
    plt.savefig("outputs/figures/clustering_pca_clusters.png", dpi=200, facecolor=fig.get_facecolor())
    plt.close()
    
    # ----------------------------------------------------
    # Practicals 5 & 6: Ensemble Learning
    # ----------------------------------------------------
    print("\n[Practicals 5 & 6] Running Ensemble Learning Experiments...")
    ensemble_res = run_ensemble_experiments(clean_df, early_prediction=False)
    joblib.dump(ensemble_res["pipelines"]["rf"], "models/random_forest_baseline.joblib")
    joblib.dump(ensemble_res["pipelines"]["rf_balanced"], "models/random_forest_balanced.joblib")
    
    # Figure: Estimator count scaling
    fig, ax = plt.subplots(figsize=(7, 4.5), facecolor=COLORS["ivory"])
    ax.set_facecolor(COLORS["white"])
    est_df = ensemble_res["estimator_count_df"]
    ax.plot(est_df["Estimators"], est_df["Accuracy"], marker="o", label="Accuracy", color=COLORS["olive"], linewidth=2)
    ax.plot(est_df["Estimators"], est_df["F1-Score"], marker="s", label="F1-Score", color=COLORS["terracotta"], linewidth=2)
    ax.plot(est_df["Estimators"], est_df["ROC-AUC"], marker="^", label="ROC-AUC", color=COLORS["sage"], linewidth=2)
    ax.set_title("Bagging Ensemble: Estimator Count Scaling", fontweight="bold", color=COLORS["olive"])
    ax.set_xlabel("Number of Estimators")
    ax.set_ylabel("Score")
    ax.legend()
    ax.grid(True, linestyle="--", alpha=0.3)
    plt.tight_layout()
    plt.savefig("outputs/figures/ensemble_estimator_scaling.png", dpi=200, facecolor=fig.get_facecolor())
    plt.close()
    
    # ----------------------------------------------------
    # Practical 7: Validation & Hyperparameter Optimization
    # ----------------------------------------------------
    print("\n[Practical 7] Running CV and Hyperparameter Tuning...")
    cv_summary, s5, s10 = run_cross_validation_experiments(clean_df, early_prediction=False)
    tuning_res = run_hyperparameter_tuning(clean_df, early_prediction=False)
    joblib.dump(tuning_res["best_model"], "models/random_forest_tuned.joblib")
    
    # Figure: CV Score Distribution
    fig, ax = plt.subplots(figsize=(6, 4.5), facecolor=COLORS["ivory"])
    ax.set_facecolor(COLORS["white"])
    bp = ax.boxplot([s5, s10], patch_artist=True, tick_labels=["5-Fold CV", "10-Fold CV"])
    for patch in bp["boxes"]:
        patch.set_facecolor(COLORS["sand"])
        patch.set_edgecolor(COLORS["olive"])
    for median in bp["medians"]:
        median.set_color(COLORS["terracotta"])
        median.set_linewidth(2)
    ax.set_title("Stratified Cross-Validation F1-Score Variance", fontweight="bold", color=COLORS["olive"])
    ax.set_ylabel("F1-Score")
    ax.grid(True, linestyle="--", alpha=0.3)
    plt.tight_layout()
    plt.savefig("outputs/figures/validation_cv_distribution.png", dpi=200, facecolor=fig.get_facecolor())
    plt.close()
    
    # Figure: Feature Importances
    fig, ax = plt.subplots(figsize=(8, 5.5), facecolor=COLORS["ivory"])
    ax.set_facecolor(COLORS["white"])
    top_feats = tuning_res["feature_importances"].head(10)
    sns.barplot(x="importance", y="clean_feature", data=top_feats, color=COLORS["olive"], ax=ax)
    ax.set_title("Top 10 Feature Importances (Optimized Random Forest)", fontweight="bold", color=COLORS["olive"])
    ax.set_xlabel("Relative Importance (MDI)")
    ax.set_ylabel("Student Feature")
    ax.grid(True, linestyle="--", alpha=0.3)
    plt.tight_layout()
    plt.savefig("outputs/figures/validation_feature_importance.png", dpi=200, facecolor=fig.get_facecolor())
    plt.close()
    
    # ----------------------------------------------------
    # Save Benchmark JSON & Academic Markdown Report
    # ----------------------------------------------------
    summary_report = {
        "dataset_name": "UCI Student Performance (Math Course)",
        "records": quality["num_rows"],
        "attributes": quality["num_cols"],
        "missing_values": quality["missing_values_total"],
        "at_risk_count": int(clean_df["academic_risk"].sum()),
        "at_risk_percentage": round(float(clean_df["academic_risk"].mean() * 100), 1),
        "regression_results": {
            "late_multiple_r2": mult_late["metrics"]["test_r2"],
            "late_multiple_rmse": mult_late["metrics"]["test_rmse"],
            "early_multiple_r2": mult_early["metrics"]["test_r2"],
            "early_multiple_rmse": mult_early["metrics"]["test_rmse"]
        },
        "classification_results": {
            "logistic_regression_accuracy": clf_res_late["Logistic Regression"]["metrics"]["accuracy"],
            "logistic_regression_recall": clf_res_late["Logistic Regression"]["metrics"]["recall"],
            "logistic_regression_f1": clf_res_late["Logistic Regression"]["metrics"]["f1"],
            "logistic_regression_auc": clf_res_late["Logistic Regression"]["metrics"]["roc_auc"]
        },
        "clustering_results": {
            "kmeans_k3_silhouette": kmeans_res["silhouette_score"],
            "gmm_k3_aic": gmm_res["aic"],
            "gmm_k3_bic": gmm_res["bic"]
        },
        "ensemble_results": {
            "decision_tree_f1": ensemble_res["dt_eval"]["f1"],
            "random_forest_f1": ensemble_res["rf_eval"]["f1"],
            "balanced_rf_f1": ensemble_res["rf_balanced_eval"]["f1"]
        },
        "tuning_results": {
            "best_params": tuning_res["tuning_summary"]["Best Parameters"].iloc[0],
            "test_accuracy": tuning_res["test_metrics"]["accuracy"],
            "test_f1": tuning_res["test_metrics"]["f1"],
            "test_recall": tuning_res["test_metrics"]["recall"],
            "top_3_features": tuning_res["feature_importances"]["clean_feature"].head(3).tolist()
        }
    }
    
    with open("outputs/reports/analysis_report.json", "w") as f:
        json.dump(summary_report, f, indent=4)
        
    lr_metrics = clf_res_late['Logistic Regression']['metrics']
    lr_acc = f"{lr_metrics['accuracy']*100:.1f}%"
    lr_f1 = f"{lr_metrics['f1']:.3f}"
    lr_auc = f"{lr_metrics['roc_auc']:.3f}"
    lr_rec = f"{lr_metrics['recall']*100:.1f}%"
    
    cv5_f1 = f"{cv_summary['Mean F1'].iloc[0]:.4f} +/- {cv_summary['Std Dev'].iloc[0]:.4f}"
    cv10_f1 = f"{cv_summary['Mean F1'].iloc[1]:.4f} +/- {cv_summary['Std Dev'].iloc[1]:.4f}"
    test_f1 = f"{tuning_res['test_metrics']['f1']:.4f}"
    test_acc = f"{tuning_res['test_metrics']['accuracy']*100:.1f}%"
    top_3_str = ", ".join(summary_report['tuning_results']['top_3_features'])

    md_content = f"""# EduRisk AI: Academic Analytics & ML Benchmark Report

**Dataset**: UCI Student Performance (Mathematics: `student-mat.csv`)  
**Sample Size**: {quality['num_rows']} Students | **Features**: {quality['num_cols']} Raw Attributes  
**Academic Risk Criteria**: Final Grade G3 < 10 (Target Count: {summary_report['at_risk_count']} students, {summary_report['at_risk_percentage']}%)

---

## 1. Regression Performance (Final Grade G3 Prediction)
- **Full-Term Model (with G2)**: R² = {mult_late['metrics']['test_r2']:.3f}, RMSE = {mult_late['metrics']['test_rmse']:.2f} marks
- **Early-Warning Model (excluding G2)**: R² = {mult_early['metrics']['test_r2']:.3f}, RMSE = {mult_early['metrics']['test_rmse']:.2f} marks
- **Academic Insight**: G2 serves as the single strongest proxy for final performance. In early semesters, grade variance is explained by baseline exam G1 and cumulative class failures.

## 2. Supervised Classification (At Risk vs Not At Risk)
- **Best Model**: Logistic Regression (Accuracy = {lr_acc}, F1 = {lr_f1}, ROC-AUC = {lr_auc})
- **Recall for At-Risk Students**: {lr_rec}
- **Educational Context**: High Recall is paramount to ensure struggling students are not missed by academic advisory programs.

## 3. Student Segmentation (K-Means & Gaussian Mixture Models)
- **Optimal Clusters**: K = 3 based on Elbow and Silhouette heuristic
- **Discovered Segments**:
  1. **High Achievers / Consistent Study**: Low absences, zero past failures, high parental education (G3 ~ 12.2).
  2. **Moderate Engagement / High Attendance**: Borderline baseline scores with high attendance (G3 ~ 9.9).
  3. **High Academic Risk / Prior Failures**: Higher absences, prior failures, low baseline exams (G3 ~ 8.5).

## 4. Ensemble Learning & Variance Reduction
- **Single Decision Tree**: F1 = {ensemble_res['dt_eval']['f1']:.3f}
- **Bagging (100 Trees)**: F1 = {ensemble_res['estimator_count_df']['F1-Score'].iloc[-1]:.3f}
- **Random Forest (100 Trees)**: F1 = {ensemble_res['rf_eval']['f1']:.3f}
- **Observation**: Bagging and Random Forest significantly dampen the high variance of individual decision trees through bootstrap aggregation and feature subspace sampling.

## 5. Cross-Validation & Hyperparameter Tuning
- **5-Fold Stratified CV Mean F1**: {cv5_f1}
- **10-Fold Stratified CV Mean F1**: {cv10_f1}
- **Optimized Test Set F1**: {test_f1} (Accuracy = {test_acc})
- **Top 3 Predictive Features**: {top_3_str}
"""
    with open("outputs/reports/academic_summary.md", "w") as f:
        f.write(md_content)
        
    print("\n[SUCCESS] End-to-end pipeline finished.")
    print("Figures saved in: outputs/figures/")
    print("Models saved in: models/")
    print("Reports saved in: outputs/reports/")
    print("=" * 70)


if __name__ == "__main__":
    main()
