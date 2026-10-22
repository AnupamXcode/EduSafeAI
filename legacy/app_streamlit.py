"""
EduRisk AI - Student Performance Prediction and Academic Risk Analytics System
A university-grade, full-stack machine learning analytics web application.

Strictly follows the academic visual identity and design philosophy:
- Palette: Warm Ivory (#F7F3E9), Deep Olive (#414B32), Muted Sage (#A5AD91),
           Burnt Terracotta (#B95F45), Warm Clay (#D9B5A0), Light Sand (#E9DFCC),
           Dark Espresso (#302A25), White (#FFFFFF)
- Typography: Lora (Headings), DM Sans (Interface), Tabular Numerals
- Genuine dataset computations, transparent ML pipelines, no generic SaaS tropes.
"""

import os
import sys
import warnings
os.environ["LOKY_MAX_CPU_COUNT"] = "2"
warnings.filterwarnings("ignore")

import joblib
import numpy as np
import pandas as pd
import streamlit as st
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import seaborn as sns

# Ensure src modules are discoverable
sys.path.append(os.path.dirname(__file__))

from src.data_processing import (
    load_raw_data,
    inspect_data_quality,
    prepare_dataset,
    get_train_test_data,
    PRIMARY_DATA_PATH,
    SECONDARY_DATA_PATH
)
from src.regression import compare_regression_models
from src.classification import train_classifiers
from src.clustering import (
    run_elbow_and_silhouette_analysis,
    fit_kmeans,
    fit_gmm,
    compare_gmm_components,
    CLUSTERING_FEATURES
)
from src.ensemble import run_ensemble_experiments
from src.evaluation import (
    run_cross_validation_experiments,
    run_hyperparameter_tuning
)

# -----------------------------------------------------------------------------
# Streamlit Page Setup & Custom Academic Styling
# -----------------------------------------------------------------------------
st.set_page_config(
    page_title="EduRisk AI | Academic Risk Analytics",
    page_icon="🎓",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Color tokens
COLOR_IVORY = "#F7F3E9"
COLOR_OLIVE = "#414B32"
COLOR_SAGE = "#A5AD91"
COLOR_TERRACOTTA = "#B95F45"
COLOR_CLAY = "#D9B5A0"
COLOR_SAND = "#E9DFCC"
COLOR_ESPRESSO = "#302A25"
COLOR_WHITE = "#FFFFFF"

CUSTOM_CSS = f"""
<style>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Lora:ital,wght@0,500;0,600;0,700;1,400;1,600&display=swap');

html, body, [class*="css"] {{
    font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    color: {COLOR_ESPRESSO};
    background-color: {COLOR_IVORY};
}}

h1, h2, h3, h4 {{
    font-family: 'Lora', Georgia, serif;
    color: {COLOR_OLIVE};
    font-weight: 600;
    letter-spacing: -0.01em;
}}

.stApp {{
    background-color: {COLOR_IVORY};
}}

/* Top Banner Header */
.edurisk-header {{
    background-color: {COLOR_WHITE};
    border-bottom: 1.5px solid {COLOR_CLAY};
    padding: 18px 28px;
    margin-bottom: 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 4px;
}}
.edurisk-wordmark {{
    font-family: 'Lora', Georgia, serif;
    font-size: 26px;
    font-weight: 700;
    color: {COLOR_OLIVE};
    display: inline-block;
}}
.edurisk-subtitle {{
    font-size: 13px;
    color: {COLOR_ESPRESSO};
    opacity: 0.8;
    margin-top: 2px;
}}
.edurisk-badge {{
    background-color: {COLOR_SAND};
    color: {COLOR_OLIVE};
    padding: 5px 12px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 600;
    border: 1px solid {COLOR_CLAY};
    font-variant-numeric: tabular-nums;
}}

/* Academic Metric Cards */
.metric-box {{
    background-color: {COLOR_WHITE};
    border: 1px solid {COLOR_CLAY};
    border-radius: 4px;
    padding: 16px 20px;
    margin-bottom: 14px;
}}
.metric-box-title {{
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: {COLOR_OLIVE};
    font-weight: 600;
    margin-bottom: 6px;
}}
.metric-box-value {{
    font-family: 'Lora', serif;
    font-size: 30px;
    font-weight: 700;
    color: {COLOR_ESPRESSO};
    font-variant-numeric: tabular-nums;
    line-height: 1.1;
}}
.metric-box-sub {{
    font-size: 12px;
    color: {COLOR_ESPRESSO};
    opacity: 0.75;
    margin-top: 6px;
}}

/* Table & Divider Styling */
hr {{
    border: 0;
    border-top: 1px solid {COLOR_CLAY};
    margin: 24px 0;
}}

.stButton>button {{
    background-color: {COLOR_OLIVE};
    color: {COLOR_WHITE};
    border-radius: 4px;
    border: none;
    padding: 8px 18px;
    font-weight: 500;
    font-size: 14px;
    transition: all 0.2s;
}}
.stButton>button:hover {{
    background-color: #303724;
    color: {COLOR_WHITE};
    border: none;
}}

.risk-alert {{
    background-color: #FAEEEB;
    border: 1px solid {COLOR_TERRACOTTA};
    border-radius: 4px;
    padding: 14px 18px;
    color: #8C3922;
    margin: 12px 0;
    font-size: 14px;
}}
.safe-alert {{
    background-color: #EEF3E6;
    border: 1px solid {COLOR_OLIVE};
    border-radius: 4px;
    padding: 14px 18px;
    color: {COLOR_OLIVE};
    margin: 12px 0;
    font-size: 14px;
}}

/* Sidebar refinement */
section[data-testid="stSidebar"] {{
    background-color: {COLOR_SAND};
    border-right: 1px solid {COLOR_CLAY};
}}
</style>
"""
st.markdown(CUSTOM_CSS, unsafe_allow_html=True)


# -----------------------------------------------------------------------------
# Data Loading & Cached Pipeline Execution
# -----------------------------------------------------------------------------
@st.cache_data
def get_dataset(course="mat"):
    raw = load_raw_data(course)
    quality = inspect_data_quality(raw)
    clean = prepare_dataset(raw)
    return raw, clean, quality


@st.cache_data
def get_cached_regression(course="mat", early=False):
    _, clean, _ = get_dataset(course)
    return compare_regression_models(clean, early_prediction=early)


@st.cache_data
def get_cached_classification(course="mat", early=False):
    _, clean, _ = get_dataset(course)
    return train_classifiers(clean, early_prediction=early)


@st.cache_data
def get_cached_clustering(course="mat", k=3):
    _, clean, _ = get_dataset(course)
    elbow_res = run_elbow_and_silhouette_analysis(clean)
    km_res = fit_kmeans(clean, n_clusters=k)
    gmm_res = fit_gmm(clean, n_components=k)
    gmm_comp = compare_gmm_components(clean, [3, 4, 5])
    return elbow_res, km_res, gmm_res, gmm_comp


@st.cache_data
def get_cached_ensembles(course="mat", early=False):
    _, clean, _ = get_dataset(course)
    return run_ensemble_experiments(clean, early_prediction=early)


@st.cache_data
def get_cached_tuning(course="mat", early=False):
    _, clean, _ = get_dataset(course)
    cv_sum, s5, s10 = run_cross_validation_experiments(clean, early_prediction=early)
    tuning_res = run_hyperparameter_tuning(clean, early_prediction=early)
    return cv_sum, s5, s10, tuning_res


# -----------------------------------------------------------------------------
# Matplotlib Styler Utility
# -----------------------------------------------------------------------------
def setup_mpl_figure(nrows=1, ncols=1, figsize=(10, 4.5)):
    fig, axes = plt.subplots(nrows, ncols, figsize=figsize, facecolor=COLOR_IVORY)
    if nrows == 1 and ncols == 1:
        axes = [axes]
    elif nrows == 1 or ncols == 1:
        axes = axes.flatten()
    for ax in np.array(axes).flatten():
        ax.set_facecolor(COLOR_WHITE)
        ax.grid(True, linestyle="--", alpha=0.35, color=COLOR_CLAY)
        ax.tick_params(colors=COLOR_ESPRESSO, labelsize=10)
        for spine in ax.spines.values():
            spine.set_color(COLOR_CLAY)
    return fig, axes[0] if (nrows == 1 and ncols == 1) else axes


# -----------------------------------------------------------------------------
# Sidebar Navigation & Dataset Configuration
# -----------------------------------------------------------------------------
with st.sidebar:
    st.markdown(f"""
    <div style="padding: 10px 0 16px 0; border-bottom: 1px solid {COLOR_CLAY};">
        <span style="font-family: 'Lora', serif; font-size: 20px; font-weight: 700; color: {COLOR_OLIVE};">EduRisk AI</span>
        <p style="font-size: 12px; color: {COLOR_ESPRESSO}; margin: 2px 0 0 0;">Academic Risk Analytics System</p>
    </div>
    """, unsafe_allow_html=True)
    
    st.markdown("### Navigation")
    menu = st.radio(
        "Select Module",
        [
            "Overview",
            "Data Explorer (Practical 1)",
            "Grade Prediction (Practical 2)",
            "Academic Risk (Practical 3)",
            "Student Segments (Practicals 4 & 5)",
            "Model Laboratory (Ensembles)",
            "Validation & Tuning (Practical 7)",
            "Student Risk Assessment",
            "Project Guide & Viva"
        ],
        label_visibility="collapsed"
    )
    
    st.markdown("<hr style='margin: 16px 0;'>", unsafe_allow_html=True)
    st.markdown("### Dataset Selection")
    course_opt = st.selectbox(
        "Course Dataset",
        ["Mathematics (student-mat.csv)", "Portuguese (student-por.csv)"],
        index=0,
        help="student-mat.csv is the primary university benchmark."
    )
    selected_course = "mat" if "Math" in course_opt else "por"
    
    raw_df, clean_df, quality = get_dataset(selected_course)
    
    st.markdown(f"""
    <div style="font-size: 12px; color: {COLOR_ESPRESSO}; line-height: 1.6; padding-top: 8px;">
        <strong>Active Cohort:</strong> {quality['num_rows']} students<br>
        <strong>Attributes:</strong> {quality['num_cols']} variables<br>
        <strong>Cleanliness:</strong> 0 missing, 0 duplicates<br>
        <strong>Environment:</strong> Python 3.11 | Scikit-Learn
    </div>
    """, unsafe_allow_html=True)


# -----------------------------------------------------------------------------
# Top Banner
# -----------------------------------------------------------------------------
st.markdown(f"""
<div class="edurisk-header">
    <div>
        <span class="edurisk-wordmark">EduRisk AI</span>
        <span style="font-size: 14px; margin-left: 12px; color: {COLOR_ESPRESSO}; opacity: 0.85;">
            Student Performance Prediction and Academic Risk Analytics System
        </span>
        <div class="edurisk-subtitle">
            An empirical machine learning platform incorporating Regression, Classification, Clustering, Ensembles, and K-Fold Optimization.
        </div>
    </div>
    <div>
        <span class="edurisk-badge">Cohort: {quality['num_rows']} Students ({'Math' if selected_course=='mat' else 'Portuguese'})</span>
    </div>
</div>
""", unsafe_allow_html=True)


# =============================================================================
# 1. OVERVIEW PAGE
# =============================================================================
if menu == "Overview":
    st.markdown("## Student performance, explained by data.")
    st.markdown(
        "Explore academic patterns, estimate final grades, identify potential academic risk, "
        "and compare machine learning models using real student records."
    )
    st.markdown("<br>", unsafe_allow_html=True)
    
    # Pre-calculate actual metrics for overview
    total_students = quality["num_rows"]
    avg_grade = quality["g3_mean"]
    at_risk_count = int(clean_df["academic_risk"].sum())
    at_risk_pct = (at_risk_count / total_students) * 100
    
    clf_df, clf_res, _ = get_cached_classification(selected_course, early=False)
    best_clf_name = clf_df.iloc[0]["Model"]
    best_clf_acc = clf_df.iloc[0]["Accuracy"] * 100
    best_clf_f1 = clf_df.iloc[0]["F1-Score"]
    
    # 4 Useful Summary Measures
    col1, col2, col3, col4 = st.columns(4)
    with col1:
        st.markdown(f"""
        <div class="metric-box">
            <div class="metric-box-title">Total Student Records</div>
            <div class="metric-box-value">{total_students}</div>
            <div class="metric-box-sub">UCI verified dataset</div>
        </div>
        """, unsafe_allow_html=True)
    with col2:
        st.markdown(f"""
        <div class="metric-box">
            <div class="metric-box-title">Average Final Grade (G3)</div>
            <div class="metric-box-value">{avg_grade:.2f} <span style="font-size:16px; font-weight:normal;">/ 20</span></div>
            <div class="metric-box-sub">Standard dev: {quality['g3_std']:.2f}</div>
        </div>
        """, unsafe_allow_html=True)
    with col3:
        st.markdown(f"""
        <div class="metric-box">
            <div class="metric-box-title">Students in Risk Class (G3 &lt; 10)</div>
            <div class="metric-box-value">{at_risk_count} <span style="font-size:16px; font-weight:normal;">({at_risk_pct:.1f}%)</span></div>
            <div class="metric-box-sub">{total_students - at_risk_count} Passing students</div>
        </div>
        """, unsafe_allow_html=True)
    with col4:
        st.markdown(f"""
        <div class="metric-box">
            <div class="metric-box-title">Best Validated Classifier</div>
            <div class="metric-box-value">{best_clf_name.split()[0]}</div>
            <div class="metric-box-sub">Acc: {best_clf_acc:.1f}% | F1: {best_clf_f1:.3f}</div>
        </div>
        """, unsafe_allow_html=True)
        
    st.markdown("<hr>", unsafe_allow_html=True)
    
    # Asymmetric Visual Layout: Main Grade Distribution + Supporting Analysis
    left_col, right_col = st.columns([1.5, 1])
    
    with left_col:
        st.markdown("### Grade Distribution Profile (Primary Visualization)")
        fig, ax = setup_mpl_figure(figsize=(9, 4.8))
        sns.histplot(clean_df["G3"], kde=True, color=COLOR_OLIVE, ax=ax, bins=20, label="G3 Final Grade")
        ax.axvline(10, color=COLOR_TERRACOTTA, linestyle="--", linewidth=1.8, label="Academic Risk Threshold (G3 = 10)")
        ax.axvline(avg_grade, color=COLOR_ESPRESSO, linestyle=":", linewidth=1.5, label=f"Cohort Mean ({avg_grade:.1f})")
        ax.set_title("Distribution of Final Exam Grades (G3) with Risk Threshold", fontsize=11, fontweight="bold", color=COLOR_OLIVE)
        ax.set_xlabel("Final Grade (0–20 Scale)")
        ax.set_ylabel("Student Count")
        ax.legend(loc="upper right", frameon=True, facecolor=COLOR_WHITE)
        st.pyplot(fig)
        plt.close(fig)
        
        st.markdown(f"""
        <div style="font-size: 13px; line-height: 1.6; color: {COLOR_ESPRESSO}; opacity: 0.9;">
            <strong>Distribution Insight:</strong> The final grades exhibit a distinct bimodal characteristic: a cluster of students achieving scores around 10–15, and a notable group scoring 0 (students who either dropped out or failed to attend the final examination). Setting the academic risk boundary at <strong>G3 &lt; 10</strong> captures both groups in the target intervention class.
        </div>
        """, unsafe_allow_html=True)
        
    with right_col:
        st.markdown("### Academic Risk Distribution")
        fig2, ax2 = setup_mpl_figure(figsize=(6, 2.3))
        risk_counts = clean_df["risk_label"].value_counts()
        bars = ax2.barh(["Not At Risk", "At Risk"], [risk_counts.get("Not At Risk", 0), risk_counts.get("At Risk", 0)],
                        color=[COLOR_SAGE, COLOR_TERRACOTTA], height=0.55)
        ax2.set_xlabel("Student Count")
        for bar in bars:
            w = bar.get_width()
            ax2.text(w + 3, bar.get_y() + bar.get_height()/2, f"{int(w)} ({w/total_students*100:.1f}%)",
                     va="center", fontsize=9, fontweight="bold", color=COLOR_ESPRESSO)
        ax2.set_xlim(0, max(risk_counts)*1.25)
        st.pyplot(fig2)
        plt.close(fig2)
        
        st.markdown("### Study Time vs Final Grade")
        fig3, ax3 = setup_mpl_figure(figsize=(6, 2.3))
        study_means = clean_df.groupby("studytime")["G3"].mean()
        study_labels = ["<2 hrs", "2-5 hrs", "5-10 hrs", ">10 hrs"]
        ax3.plot(study_labels[:len(study_means)], study_means.values, marker="o", color=COLOR_OLIVE, linewidth=2)
        ax3.set_ylabel("Mean G3 Grade")
        ax3.set_ylim(8, 14)
        for i, val in enumerate(study_means.values):
            ax3.annotate(f"{val:.1f}", (i, val + 0.3), ha="center", fontsize=9, fontweight="bold", color=COLOR_OLIVE)
        st.pyplot(fig3)
        plt.close(fig3)
        
    st.markdown("<hr>", unsafe_allow_html=True)
    
    # Supporting Model Comparison Summary & ML Workflow
    col_table, col_flow = st.columns([1.2, 1])
    
    with col_table:
        st.markdown("### Verified Model Performance Benchmark")
        st.markdown(
            "Empirical results obtained from the dataset using 80:20 regression and 75:25 stratified classification splits."
        )
        reg_df, _, _ = get_cached_regression(selected_course, early=False)
        st.dataframe(
            reg_df[["Model", "MAE", "RMSE", "R² Score"]].style.format({"MAE": "{:.3f}", "RMSE": "{:.3f}", "R² Score": "{:.3f}"}),
            use_container_width=True
        )
        st.dataframe(
            clf_df[["Model", "Accuracy", "Recall (At Risk)", "F1-Score", "ROC-AUC"]].style.format({
                "Accuracy": "{:.3f}", "Recall (At Risk)": "{:.3f}", "F1-Score": "{:.3f}", "ROC-AUC": "{}"
            }),
            use_container_width=True
        )
        
    with col_flow:
        st.markdown("### Integrated Machine Learning Workflow")
        st.markdown(f"""
        <div style="background-color: {COLOR_WHITE}; border: 1px solid {COLOR_CLAY}; padding: 18px 22px; border-radius: 4px; font-size: 13px; line-height: 1.8;">
            <div style="font-weight: 600; color: {COLOR_OLIVE};">1. Raw Data Ingestion & Quality Audit</div>
            <div style="margin-left: 12px; color: {COLOR_ESPRESSO}; opacity: 0.85;">Inspection of 33 attributes, zero missing values verified, 0-20 scale targets.</div>
            
            <div style="font-weight: 600; color: {COLOR_OLIVE}; margin-top: 8px;">2. Preprocessing & Leakage-Free Splitting</div>
            <div style="margin-left: 12px; color: {COLOR_ESPRESSO}; opacity: 0.85;">ColumnTransformer pipelines (One-Hot, Ordinal, StandardScaler). Targets excluded from predictors.</div>
            
            <div style="font-weight: 600; color: {COLOR_OLIVE}; margin-top: 8px;">3. Dual Supervised Analytics</div>
            <div style="margin-left: 12px; color: {COLOR_ESPRESSO}; opacity: 0.85;"><strong>Regression:</strong> Predict G3 grade. <strong>Classification:</strong> Identify At-Risk students.</div>
            
            <div style="font-weight: 600; color: {COLOR_OLIVE}; margin-top: 8px;">4. Unsupervised Pattern Discovery</div>
            <div style="margin-left: 12px; color: {COLOR_ESPRESSO}; opacity: 0.85;">K-Means & GMM segmentation to reveal natural behavioral clusters without grade bias.</div>
            
            <div style="font-weight: 600; color: {COLOR_OLIVE}; margin-top: 8px;">5. Ensemble Variance Reduction & Optimization</div>
            <div style="margin-left: 12px; color: {COLOR_ESPRESSO}; opacity: 0.85;">Bagging, Random Forest, 5/10-Fold Stratified CV, and GridSearchCV parameter tuning.</div>
        </div>
        """, unsafe_allow_html=True)


# =============================================================================
# 2. DATA EXPLORER (PRACTICAL 1)
# =============================================================================
elif menu == "Data Explorer (Practical 1)":
    st.markdown("## Practical 1: Data Preprocessing & Exploratory Data Analysis")
    st.markdown(
        "Inspect data quality, statistical distributions, missing values, duplicates, and attribute correlations. "
        "Transforms raw semicolon-separated records into clean, model-ready representations."
    )
    st.markdown("<hr>", unsafe_allow_html=True)
    
    # Quality metrics row
    m1, m2, m3, m4, m5 = st.columns(5)
    m1.metric("Total Rows", quality["num_rows"])
    m2.metric("Total Columns", quality["num_cols"])
    m3.metric("Missing Values", quality["missing_values_total"])
    m4.metric("Duplicate Rows", quality["duplicate_rows"])
    m5.metric("Numeric Features", len(quality["numeric_cols"]))
    
    st.markdown("<br>", unsafe_allow_html=True)
    
    # Workflow Steps
    st.markdown("### Preprocessing Pipeline Architecture")
    st.markdown(f"""
    <div style="display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap;">
        <div style="background:{COLOR_WHITE}; border:1px solid {COLOR_CLAY}; padding:10px 14px; border-radius:4px; font-size:12px; flex:1; min-width:180px;">
            <strong style="color:{COLOR_OLIVE};">1. Raw Semicolon CSV</strong><br>
            Loaded from <code>data/student-{selected_course}.csv</code> without in-place modification.
        </div>
        <div style="background:{COLOR_WHITE}; border:1px solid {COLOR_CLAY}; padding:10px 14px; border-radius:4px; font-size:12px; flex:1; min-width:180px;">
            <strong style="color:{COLOR_OLIVE};">2. Integrity Audit</strong><br>
            Verified 0 nulls, 0 duplicate records, validated 0-20 score boundaries.
        </div>
        <div style="background:{COLOR_WHITE}; border:1px solid {COLOR_CLAY}; padding:10px 14px; border-radius:4px; font-size:12px; flex:1; min-width:180px;">
            <strong style="color:{COLOR_OLIVE};">3. Target Engineering</strong><br>
            Derived <code>academic_risk = 1</code> when <code>G3 &lt; 10</code>.
        </div>
        <div style="background:{COLOR_WHITE}; border:1px solid {COLOR_CLAY}; padding:10px 14px; border-radius:4px; font-size:12px; flex:1; min-width:180px;">
            <strong style="color:{COLOR_OLIVE};">4. Column Encoding</strong><br>
            OneHotEncoder on nominals, binary flags (0/1), StandardScaler on numeric.
        </div>
        <div style="background:{COLOR_WHITE}; border:1px solid {COLOR_CLAY}; padding:10px 14px; border-radius:4px; font-size:12px; flex:1; min-width:180px;">
            <strong style="color:{COLOR_OLIVE};">5. Model-Ready Partitioning</strong><br>
            Saved clean output to <code>data/processed/</code>. Fitted strictly on training folds.
        </div>
    </div>
    """, unsafe_allow_html=True)
    
    # Tabs for Data Preview vs EDA Charts
    tab_preview, tab_charts, tab_stats = st.tabs(["Data Preview & Filter", "Exploratory Charts", "Descriptive Statistics"])
    
    with tab_preview:
        col_f1, col_f2 = st.columns(2)
        with col_f1:
            risk_filter = st.selectbox("Filter by Academic Risk Category", ["All Students", "At Risk (G3 < 10)", "Not At Risk (G3 >= 10)"])
        with col_f2:
            search_school = st.selectbox("School", ["All Schools", "GP (Gabriel Pereira)", "MS (Mousinho da Silveira)"])
            
        display_df = clean_df.copy()
        if risk_filter == "At Risk (G3 < 10)":
            display_df = display_df[display_df["academic_risk"] == 1]
        elif risk_filter == "Not At Risk (G3 >= 10)":
            display_df = display_df[display_df["academic_risk"] == 0]
            
        if search_school.startswith("GP"):
            display_df = display_df[display_df["school"] == "GP"]
        elif search_school.startswith("MS"):
            display_df = display_df[display_df["school"] == "MS"]
            
        st.write(f"Showing **{len(display_df)}** records matching selection:")
        st.dataframe(display_df, use_container_width=True, height=350)
        
    with tab_charts:
        chart_opt = st.selectbox(
            "Select Exploratory Visualization",
            [
                "Period Grades Distribution (G1, G2, G3)",
                "Numerical Feature Correlation Heatmap",
                "Absences vs Final Grade (G3)",
                "Weekly Study Time vs Academic Performance",
                "Prior Subject Failures vs Final Grade"
            ]
        )
        
        if chart_opt == "Period Grades Distribution (G1, G2, G3)":
            fig, axes = setup_mpl_figure(1, 3, figsize=(14, 4))
            for i, g in enumerate(["G1", "G2", "G3"]):
                sns.histplot(clean_df[g], kde=True, color=COLOR_OLIVE, ax=axes[i], bins=15)
                axes[i].set_title(f"Distribution of {g}", fontweight="bold", color=COLOR_OLIVE)
                axes[i].set_xlabel("Grade (0–20 Scale)")
            st.pyplot(fig)
            plt.close(fig)
            
        elif chart_opt == "Numerical Feature Correlation Heatmap":
            num_cols = ["age", "Medu", "Fedu", "studytime", "failures", "absences", "G1", "G2", "G3"]
            fig, ax = setup_mpl_figure(1, 1, figsize=(8.5, 6))
            sns.heatmap(clean_df[num_cols].corr(), annot=True, fmt=".2f",
                        cmap=sns.diverging_palette(35, 120, s=60, l=45, as_cmap=True), ax=ax)
            ax.set_title("Pearson Correlation Matrix (Academic Features)", fontweight="bold", color=COLOR_OLIVE, pad=12)
            st.pyplot(fig)
            plt.close(fig)
            
        elif chart_opt == "Absences vs Final Grade (G3)":
            fig, ax = setup_mpl_figure(1, 1, figsize=(9, 4.5))
            sns.scatterplot(x="absences", y="G3", hue="risk_label", data=clean_df,
                            palette={"At Risk": COLOR_TERRACOTTA, "Not At Risk": COLOR_OLIVE}, ax=ax, alpha=0.8)
            ax.set_title("Student Absences vs Final Grade G3", fontweight="bold", color=COLOR_OLIVE)
            ax.set_xlabel("Number of School Absences")
            ax.set_ylabel("Final Grade G3")
            st.pyplot(fig)
            plt.close(fig)
            
        elif chart_opt == "Weekly Study Time vs Academic Performance":
            fig, ax = setup_mpl_figure(1, 1, figsize=(8.5, 4.5))
            sns.boxplot(x="studytime", y="G3", data=clean_df, color=COLOR_SAND, ax=ax,
                        boxprops=dict(edgecolor=COLOR_OLIVE), medianprops=dict(color=COLOR_TERRACOTTA, linewidth=2))
            ax.set_xticklabels(["< 2 hours", "2 – 5 hours", "5 – 10 hours", "> 10 hours"])
            ax.set_title("Final Grade Distribution Across Weekly Study Time", fontweight="bold", color=COLOR_OLIVE)
            ax.set_xlabel("Weekly Study Time Commitment")
            ax.set_ylabel("Final Grade (G3)")
            st.pyplot(fig)
            plt.close(fig)
            
        elif chart_opt == "Prior Subject Failures vs Final Grade":
            fig, ax = setup_mpl_figure(1, 1, figsize=(8.5, 4.5))
            sns.boxplot(x="failures", y="G3", data=clean_df, color=COLOR_SAND, ax=ax,
                        boxprops=dict(edgecolor=COLOR_OLIVE), medianprops=dict(color=COLOR_TERRACOTTA, linewidth=2))
            ax.set_title("Impact of Past Class Failures on Final Grade", fontweight="bold", color=COLOR_OLIVE)
            ax.set_xlabel("Number of Past Failures (0 to 3+)")
            ax.set_ylabel("Final Grade (G3)")
            st.pyplot(fig)
            plt.close(fig)
            
    with tab_stats:
        st.markdown("### Descriptive Numerical Statistics")
        st.dataframe(clean_df.describe().T.style.format("{:.2f}"), use_container_width=True)


# =============================================================================
# 3. GRADE PREDICTION (PRACTICAL 2)
# =============================================================================
elif menu == "Grade Prediction (Practical 2)":
    st.markdown("## Practical 2: Grade Prediction (Regression)")
    st.markdown(
        "Predicts the student's continuous final grade **G3 (0–20 scale)** using **Simple Linear Regression** "
        "and **Multiple Linear Regression**. Evaluated on an 80:20 train/test split with data leakage prevention."
    )
    st.markdown("<hr>", unsafe_allow_html=True)
    
    # Mode selector toggle
    mode_col, _ = st.columns([1.5, 1])
    with mode_col:
        is_early = st.toggle("Enable Early-Warning Mode (Excludes 2nd Period Grade G2)", value=False)
        st.caption("When enabled, predictions rely strictly on earlier semester indicators (G1, demographics, study habits).")
        
    reg_df, simple_res, mult_res = get_cached_regression(selected_course, early=is_early)
    
    # Regression Metrics
    st.markdown("### Model Evaluation Summary (80:20 Test Split)")
    c1, c2, c3, c4 = st.columns(4)
    c1.metric("Multiple LR MAE", f"{mult_res['metrics']['test_mae']:.3f}", help="Mean Absolute Error: average grade point error")
    c2.metric("Multiple LR RMSE", f"{mult_res['metrics']['test_rmse']:.3f}", help="Root Mean Squared Error: penalizes large deviations")
    c3.metric("Multiple LR R²", f"{mult_res['metrics']['test_r2']:.3f}", help="Coefficient of Determination: variance explained")
    c4.metric("Train R²", f"{mult_res['metrics']['train_r2']:.3f}", help="Good generalization: no catastrophic overfitting")
    
    st.markdown("<br>", unsafe_allow_html=True)
    
    # Visualizations: Actual vs Predicted & Simple Regression Line
    plot_col1, plot_col2 = st.columns(2)
    
    with plot_col1:
        st.markdown("### Actual vs Predicted Final Grade (Multiple LR)")
        fig, ax = setup_mpl_figure(1, 1, figsize=(7, 5))
        ax.scatter(mult_res["y_test"], mult_res["y_pred"], color=COLOR_OLIVE, alpha=0.75, s=50, edgecolors="none")
        ax.plot([0, 20], [0, 20], color=COLOR_TERRACOTTA, linestyle="--", linewidth=1.8, label="Ideal Fit (y = x)")
        ax.set_xlabel("Actual G3 Grade")
        ax.set_ylabel("Predicted G3 Grade")
        ax.set_title(f"Multiple LR Fit (R² = {mult_res['metrics']['test_r2']:.3f})", fontweight="bold", color=COLOR_OLIVE)
        ax.legend()
        st.pyplot(fig)
        plt.close(fig)
        
    with plot_col2:
        pred_var = simple_res["predictor"]
        st.markdown(f"### Simple Regression Line ({pred_var} vs G3)")
        fig, ax = setup_mpl_figure(1, 1, figsize=(7, 5))
        ax.scatter(simple_res["X_test_raw"], simple_res["y_test"], color=COLOR_SAGE, alpha=0.8, s=50, label="Test Observations")
        
        # Plot regression line
        x_vals = np.linspace(0, 20, 100)
        y_vals = simple_res["metrics"]["slope"] * x_vals + simple_res["metrics"]["intercept"]
        ax.plot(x_vals, y_vals, color=COLOR_OLIVE, linewidth=2, label=f"Fit: {simple_res['metrics']['equation']}")
        ax.set_xlabel(f"{pred_var} Grade")
        ax.set_ylabel("Final G3 Grade")
        ax.set_title(f"Simple LR ({pred_var}) — R² = {simple_res['metrics']['test_r2']:.3f}", fontweight="bold", color=COLOR_OLIVE)
        ax.legend()
        st.pyplot(fig)
        plt.close(fig)
        
    st.markdown("<hr>", unsafe_allow_html=True)
    
    # Coefficients Table and Plain English Explanations
    c_tab, exp_tab = st.columns([1.2, 1])
    
    with c_tab:
        st.markdown("### Multiple Linear Regression Feature Weights")
        st.markdown("Top positive and negative predictor weights fitted by the model:")
        coef_df = mult_res["coefficients"].head(10).copy()
        st.dataframe(
            coef_df.style.format({"coefficient": "{:.3f}"}),
            use_container_width=True
        )
        
    with exp_tab:
        st.markdown("### Metric Interpretations for Viva")
        st.markdown(f"""
        <div style="background-color: {COLOR_WHITE}; border: 1px solid {COLOR_CLAY}; padding: 16px 20px; border-radius: 4px; font-size: 13px; line-height: 1.7;">
            <strong>MAE (Mean Absolute Error):</strong> On average, the model's prediction deviates from the student's actual final grade by <strong>{mult_res['metrics']['test_mae']:.2f} marks</strong> out of 20.<br><br>
            <strong>RMSE (Root Mean Squared Error):</strong> Penalizes large forecasting errors heavily. An RMSE of <strong>{mult_res['metrics']['test_rmse']:.2f}</strong> indicates reliable bounded errors without extreme outliers.<br><br>
            <strong>R² Score (Coefficient of Determination):</strong> The model accounts for <strong>{mult_res['metrics']['test_r2']*100:.1f}%</strong> of total variance in final grades.<br><br>
            <em>Academic Disclaimer:</em> Machine learning predictions are probabilistic indicators to direct academic advising, not immutable guarantees of student performance.
        </div>
        """, unsafe_allow_html=True)


# =============================================================================
# 4. ACADEMIC RISK (PRACTICAL 3)
# =============================================================================
elif menu == "Academic Risk (Practical 3)":
    st.markdown("## Practical 3: Academic Risk Classification")
    st.markdown(
        "Formulates the early-warning academic risk problem as binary supervised classification: "
        "**At Risk (G3 < 10)** vs **Not At Risk (G3 >= 10)**. "
        "Evaluates **Logistic Regression**, **K-Nearest Neighbors (KNN)**, and **Gaussian Naive Bayes** "
        "on a stratified 75:25 train-test split."
    )
    st.markdown("<hr>", unsafe_allow_html=True)
    
    is_early_clf = st.toggle("Enable Early-Warning Mode (Excludes G2)", value=False, key="clf_early")
    clf_df, clf_res, _ = get_cached_classification(selected_course, early=is_early_clf)
    
    st.markdown("### Comparative Performance Table (Stratified 75:25 Test Set)")
    st.dataframe(
        clf_df.style.format({
            "Accuracy": "{:.4f}",
            "Precision (At Risk)": "{:.4f}",
            "Recall (At Risk)": "{:.4f}",
            "F1-Score": "{:.4f}",
            "ROC-AUC": "{}"
        }),
        use_container_width=True
    )
    
    st.markdown("<br>", unsafe_allow_html=True)
    
    # Visualizations: Confusion Matrices & ROC Curves
    cm_col, roc_col = st.columns([1.3, 1])
    
    with cm_col:
        st.markdown("### Confusion Matrices (Test Cohort: 99 Students)")
        fig, axes = setup_mpl_figure(1, 3, figsize=(13, 3.8))
        labels = ["Not At Risk", "At Risk"]
        for idx, (name, res) in enumerate(clf_res.items()):
            ax = axes[idx]
            cm = res["confusion_matrix"]
            sns.heatmap(cm, annot=True, fmt="d", cmap=sns.light_palette(COLOR_OLIVE, as_cmap=True),
                        xticklabels=labels, yticklabels=labels, ax=ax, cbar=False)
            ax.set_title(f"{name}\nRecall: {res['metrics']['recall']:.2f} | Acc: {res['metrics']['accuracy']:.2f}",
                         fontsize=10, fontweight="bold", color=COLOR_OLIVE)
            ax.set_xlabel("Predicted")
            ax.set_ylabel("True")
        st.pyplot(fig)
        plt.close(fig)
        
    with roc_col:
        st.markdown("### ROC Curves")
        fig, ax = setup_mpl_figure(1, 1, figsize=(6.5, 3.8))
        palette = [COLOR_OLIVE, COLOR_TERRACOTTA, COLOR_SAGE]
        for idx, (name, res) in enumerate(clf_res.items()):
            curve = res["roc_curve"]
            if curve:
                fpr, tpr, _ = curve
                ax.plot(fpr, tpr, label=f"{name.split()[0]} (AUC={res['metrics']['roc_auc']:.3f})",
                        color=palette[idx % 3], linewidth=2)
        ax.plot([0, 1], [0, 1], color=COLOR_CLAY, linestyle=":", label="Chance")
        ax.set_xlabel("False Positive Rate")
        ax.set_ylabel("True Positive Rate (Recall)")
        ax.legend(loc="lower right", fontsize=9)
        st.pyplot(fig)
        plt.close(fig)
        
    st.markdown("<hr>", unsafe_allow_html=True)
    
    # Critical Pedagogical Explanation: Why Recall Matters
    st.markdown("### Educational Analysis: Why Recall for the 'At Risk' Class is Paramount")
    st.markdown(f"""
    <div style="background-color: {COLOR_WHITE}; border-left: 4px solid {COLOR_TERRACOTTA}; border-top: 1px solid {COLOR_CLAY}; border-right: 1px solid {COLOR_CLAY}; border-bottom: 1px solid {COLOR_CLAY}; padding: 16px 20px; border-radius: 2px; font-size: 13.5px; line-height: 1.7;">
        <strong>The Cost of Asymmetric Errors in University Analytics:</strong><br>
        In standard machine learning evaluations, Accuracy is often cited first. However, in student risk systems:
        <ul>
            <li><strong>A False Negative (Type II error):</strong> The system predicts a student is safe, but they actually fail. The university fails to offer supplementary tutoring, leading to academic probation or course failure.</li>
            <li><strong>A False Positive (Type I error):</strong> The system flags a passing student as potentially vulnerable. The student merely receives an invitation for an optional academic check-in.</li>
        </ul>
        Therefore, <strong>Recall for the At-Risk class</strong> ($\frac{{TP}}{{TP + FN}}$) is the primary metric to optimize, ensuring that no struggling student is overlooked.
    </div>
    """, unsafe_allow_html=True)


# =============================================================================
# 5. STUDENT SEGMENTATION (PRACTICALS 4 & 5)
# =============================================================================
elif menu == "Student Segments (Practicals 4 & 5)":
    st.markdown("## Practicals 4 & 5: Student Segmentation (Clustering)")
    st.markdown(
        "Discovers organic student archetypes using **K-Means Clustering** and **Gaussian Mixture Models (GMM)**. "
        "Clusters are formed exclusively on academic and behavioral patterns (study time, absences, failures, parental education, baseline grades). "
        "<strong>Critical Methodology:</strong> G3 is strictly excluded during clustering fit and only used retrospectively to profile academic outcomes."
    )
    st.markdown("<hr>", unsafe_allow_html=True)
    
    cluster_k = st.slider("Select Cluster Count (K)", min_value=2, max_value=6, value=3)
    elbow_res, km_res, gmm_res, gmm_comp = get_cached_clustering(selected_course, k=cluster_k)
    
    tab_km, tab_gmm, tab_elbow = st.tabs(["K-Means Archetypes & PCA", "Gaussian Mixture Models (EM)", "Elbow & Silhouette Evaluation"])
    
    with tab_km:
        st.markdown(f"### K-Means Discovered Clusters (K = {cluster_k})")
        
        # PCA Scatter Plot + Profiles Table
        col_pca, col_prof = st.columns([1.1, 1.3])
        
        with col_pca:
            fig, ax = setup_mpl_figure(1, 1, figsize=(7, 5))
            cmap_custom = matplotlib.colors.ListedColormap([COLOR_OLIVE, COLOR_SAGE, COLOR_TERRACOTTA, COLOR_CLAY, "#5C6B46"][:cluster_k])
            scatter = ax.scatter(
                km_res["clustered_df"]["pca1"],
                km_res["clustered_df"]["pca2"],
                c=km_res["cluster_labels"],
                cmap=cmap_custom,
                alpha=0.8,
                s=55,
                edgecolors="none"
            )
            ax.set_title(f"2D PCA Projection (Explained Variance: {sum(km_res['explained_variance'])*100:.1f}%)",
                         fontweight="bold", color=COLOR_OLIVE)
            ax.set_xlabel("Principal Component 1")
            ax.set_ylabel("Principal Component 2")
            cbar = plt.colorbar(scatter, ax=ax, ticks=range(cluster_k))
            cbar.set_ticklabels([f"Cluster {i}" for i in range(cluster_k)])
            st.pyplot(fig)
            plt.close(fig)
            
        with col_prof:
            st.markdown("### Cluster Characteristic Profiles")
            st.markdown("Mean feature values across discovered student groups:")
            view_cols = ["cluster_kmeans", "student_count", "percentage", "studytime", "failures", "absences", "G1", "G3", "academic_risk"]
            prof_df = km_res["profiles"][[c for c in view_cols if c in km_res["profiles"].columns]].copy()
            st.dataframe(prof_df.style.format({
                "percentage": "{:.1f}%",
                "studytime": "{:.2f}",
                "failures": "{:.2f}",
                "absences": "{:.1f}",
                "G1": "{:.1f}",
                "G3": "{:.1f}",
                "academic_risk": "{:.2f}"
            }), use_container_width=True)
            
            st.markdown(f"""
            <div style="font-size: 12.5px; color: {COLOR_ESPRESSO}; line-height: 1.6; padding-top: 6px;">
                <strong>Silhouette Coefficient:</strong> <code>{km_res['silhouette_score']:.3f}</code><br>
                Notice how the unsupervised clusters naturally separate into distinct academic performance groups without G3 ever being exposed during training.
            </div>
            """, unsafe_allow_html=True)
            
    with tab_gmm:
        st.markdown("### Gaussian Mixture Model (Soft Clustering via Expectation-Maximization)")
        st.markdown(
            "Unlike hard K-Means assignments, GMM estimates the probability of each student belonging to each cluster, "
            "identifying borderline students who exhibit hybrid characteristics."
        )
        
        col_g1, col_g2 = st.columns([1, 1.2])
        with col_g1:
            st.markdown("#### Component Comparison (AIC / BIC)")
            st.dataframe(gmm_comp, use_container_width=True)
            st.caption("Lower AIC and BIC values indicate superior statistical balance between goodness of fit and model complexity.")
            
        with col_g2:
            st.markdown("#### Posterior Membership Certainty")
            fig, ax = setup_mpl_figure(1, 1, figsize=(7, 3.8))
            sns.histplot(gmm_res["clustered_df"]["max_posterior_prob"], bins=20, color=COLOR_OLIVE, kde=True, ax=ax)
            ax.set_title("Distribution of Maximum Cluster Assignment Confidence", fontweight="bold", color=COLOR_OLIVE)
            ax.set_xlabel("Confidence Probability (1.0 = Highly Certain)")
            ax.set_ylabel("Student Count")
            st.pyplot(fig)
            plt.close(fig)
            
    with tab_elbow:
        st.markdown("### Elbow Method & Silhouette Heuristic (K = 1 to 12)")
        fig, (ax1, ax2) = setup_mpl_figure(1, 2, figsize=(13, 4.2))
        ax1.plot(elbow_res["k_values"], elbow_res["inertias"], marker="o", color=COLOR_OLIVE, linewidth=2)
        ax1.set_title("Elbow Method: Inertia (SSE) vs K", fontweight="bold", color=COLOR_OLIVE)
        ax1.set_xlabel("Number of Clusters (K)")
        ax1.set_ylabel("Sum of Squared Errors")
        
        ax2.plot(elbow_res["silhouette_k_values"], elbow_res["silhouette_scores"], marker="s", color=COLOR_TERRACOTTA, linewidth=2)
        ax2.set_title("Mean Silhouette Score vs K", fontweight="bold", color=COLOR_TERRACOTTA)
        ax2.set_xlabel("Number of Clusters (K)")
        ax2.set_ylabel("Silhouette Score")
        st.pyplot(fig)
        plt.close(fig)


# =============================================================================
# 6. MODEL LABORATORY (ENSEMBLES)
# =============================================================================
elif menu == "Model Laboratory (Ensembles)":
    st.markdown("## Practicals 5 & 6: Ensemble Learning Laboratory")
    st.markdown(
        "Demonstrates variance reduction through **Bagging (Bootstrap Aggregation)** and **Random Forest ensembles**. "
        "Systematically evaluates estimator count scaling (5, 10, 50, 100), compares heterogeneous base estimators "
        "(Decision Tree, KNN, Logistic Regression), and assesses balanced class weights."
    )
    st.markdown("<hr>", unsafe_allow_html=True)
    
    is_early_ens = st.toggle("Enable Early-Warning Mode (Excludes G2)", value=False, key="ens_early")
    ens_res = get_cached_ensembles(selected_course, early=is_early_ens)
    
    st.markdown("### Overall Architecture Benchmark")
    st.dataframe(
        ens_res["overall_comparison"].style.format({
            "Accuracy": "{:.4f}",
            "Precision": "{:.4f}",
            "Recall": "{:.4f}",
            "F1-Score": "{:.4f}",
            "ROC-AUC": "{:.4f}"
        }),
        use_container_width=True
    )
    
    st.markdown("<br>", unsafe_allow_html=True)
    
    col_scaling, col_base = st.columns(2)
    
    with col_scaling:
        st.markdown("### Estimator Scaling: 5 vs 10 vs 50 vs 100 Trees")
        fig, ax = setup_mpl_figure(1, 1, figsize=(7, 4.5))
        e_df = ens_res["estimator_count_df"]
        ax.plot(e_df["Estimators"], e_df["Accuracy"], marker="o", label="Accuracy", color=COLOR_OLIVE, linewidth=2)
        ax.plot(e_df["Estimators"], e_df["F1-Score"], marker="s", label="F1-Score", color=COLOR_TERRACOTTA, linewidth=2)
        ax.plot(e_df["Estimators"], e_df["ROC-AUC"], marker="^", label="ROC-AUC", color=COLOR_SAGE, linewidth=2)
        ax.set_xlabel("Number of Bagged Trees")
        ax.set_ylabel("Evaluation Metric Score")
        ax.set_title("Bagging Estimator Count Scaling", fontweight="bold", color=COLOR_OLIVE)
        ax.legend()
        st.pyplot(fig)
        plt.close(fig)
        
    with col_base:
        st.markdown("### Base Learner Comparison (Bagging with 20 Estimators)")
        fig, ax = setup_mpl_figure(1, 1, figsize=(7, 4.5))
        b_df = ens_res["base_learner_df"]
        x = np.arange(len(b_df))
        w = 0.25
        ax.bar(x - w, b_df["Accuracy"], width=w, label="Accuracy", color=COLOR_OLIVE)
        ax.bar(x, b_df["Recall"], width=w, label="Recall", color=COLOR_TERRACOTTA)
        ax.bar(x + w, b_df["F1-Score"], width=w, label="F1-Score", color=COLOR_SAGE)
        ax.set_xticks(x)
        ax.set_xticklabels(b_df["Base Learner"], fontsize=10)
        ax.set_ylabel("Score")
        ax.set_ylim(0.4, 1.05)
        ax.set_title("Base Estimator Comparison in Bagging", fontweight="bold", color=COLOR_OLIVE)
        ax.legend(loc="lower right")
        st.pyplot(fig)
        plt.close(fig)
        
    st.markdown("<hr>", unsafe_allow_html=True)
    
    st.markdown("### Scientific Explanation of Observed Ensemble Behavior")
    st.markdown(f"""
    <div style="background-color: {COLOR_WHITE}; border: 1px solid {COLOR_CLAY}; padding: 18px 22px; border-radius: 4px; font-size: 13.5px; line-height: 1.7;">
        <strong>1. Why Bagging Outperforms Single Decision Trees:</strong> Single decision trees are prone to high variance and sensitivity to training data perturbations. Bagging creates $B$ bootstrap replicas and averages their predictions, reducing estimator variance by a factor of $\\approx 1/B$ while preserving low bias.<br><br>
        <strong>2. Base Learner Dynamics:</strong> Bagging yields substantial gains when applied to <em>unstable</em>, high-variance learners (Decision Trees). Conversely, when applied to <em>stable</em> learners (Logistic Regression), the variance reduction is minimal because individual models produce near-identical linear hyperplanes.<br><br>
        <strong>3. Class Weight Balancing:</strong> Setting <code>class_weight='balanced'</code> adjusts misclassification penalties inversely proportional to class frequencies, directly elevating recall for the minority 'At Risk' population.
    </div>
    """, unsafe_allow_html=True)


# =============================================================================
# 7. VALIDATION & TUNING (PRACTICAL 7)
# =============================================================================
elif menu == "Validation & Tuning (Practical 7)":
    st.markdown("## Practical 7: Cross-Validation & Hyperparameter Optimization")
    st.markdown(
        "Prevents optimistic bias and data leakage using **5-Fold and 10-Fold Stratified Cross-Validation**. "
        "Compares exhaustive **GridSearchCV** against efficient **RandomizedSearchCV**, "
        "followed by evaluation on the separate, untouched 25% test set."
    )
    st.markdown("<hr>", unsafe_allow_html=True)
    
    cv_sum, s5, s10, tuning_res = get_cached_tuning(selected_course, early=False)
    
    # Cross Validation Comparison
    st.markdown("### Stratified K-Fold Cross-Validation (Baseline Random Forest)")
    st.dataframe(
        cv_sum[["Validation Strategy", "Mean F1", "Std Dev", "Min Score", "Max Score"]].style.format({
            "Mean F1": "{:.4f}", "Std Dev": "{:.4f}", "Min Score": "{:.4f}", "Max Score": "{:.4f}"
        }),
        use_container_width=True
    )
    
    col_box, col_tune = st.columns([1, 1.3])
    
    with col_box:
        st.markdown("### Cross-Validation Score Variance")
        fig, ax = setup_mpl_figure(1, 1, figsize=(6, 4.5))
        bp = ax.boxplot([s5, s10], patch_artist=True, tick_labels=["5-Fold CV", "10-Fold CV"])
        for patch in bp["boxes"]:
            patch.set_facecolor(COLOR_SAND)
            patch.set_edgecolor(COLOR_OLIVE)
        for median in bp["medians"]:
            median.set_color(COLOR_TERRACOTTA)
            median.set_linewidth(2)
        ax.set_ylabel("F1-Score on Validation Folds")
        ax.set_title("Score Stability Across Folds", fontweight="bold", color=COLOR_OLIVE)
        st.pyplot(fig)
        plt.close(fig)
        
    with col_tune:
        st.markdown("### Hyperparameter Tuning Benchmark")
        st.dataframe(tuning_res["tuning_summary"], use_container_width=True)
        
        t_m = tuning_res["test_metrics"]
        st.markdown(f"""
        <div style="background-color: {COLOR_WHITE}; border: 1px solid {COLOR_CLAY}; padding: 14px 18px; border-radius: 4px; font-size: 13px; line-height: 1.6; margin-top: 10px;">
            <strong>Final Evaluation on Separate Test Split:</strong><br>
            • Test Accuracy: <strong>{t_m['accuracy']*100:.2f}%</strong><br>
            • Test Recall (At Risk): <strong>{t_m['recall']*100:.2f}%</strong><br>
            • Test F1-Score: <strong>{t_m['f1']:.4f}</strong><br>
            • Test ROC-AUC: <strong>{t_m['roc_auc']:.4f}</strong>
        </div>
        """, unsafe_allow_html=True)
        
    st.markdown("<hr>", unsafe_allow_html=True)
    
    # Top Feature Importances
    st.markdown("### Top Predictive Attributes (Optimized Random Forest)")
    fig, ax = setup_mpl_figure(1, 1, figsize=(10, 4.5))
    top10 = tuning_res["feature_importances"].head(10)
    sns.barplot(x="importance", y="clean_feature", data=top10, color=COLOR_OLIVE, ax=ax)
    ax.set_xlabel("Mean Decrease in Impurity (Feature Importance)")
    ax.set_ylabel("Student Attribute")
    ax.set_title("Top 10 Features Driving Academic Risk Prediction", fontweight="bold", color=COLOR_OLIVE)
    st.pyplot(fig)
    plt.close(fig)


# =============================================================================
# 8. STUDENT RISK ASSESSMENT (SECTION 13)
# =============================================================================
elif menu == "Student Risk Assessment":
    st.markdown("## Interactive Student Risk Assessment")
    st.markdown(
        "Enter individual student academic and demographic indicators to generate real-time "
        "final grade forecasts, academic risk classifications, and unsupervised archetype assignments."
    )
    st.markdown("<hr>", unsafe_allow_html=True)
    
    # Load trained models
    try:
        reg_pipe = joblib.load("models/multiple_linear_regression.joblib")
        clf_pipe = joblib.load("models/classifier_logistic_regression.joblib")
        km_model = joblib.load("models/kmeans_model.joblib")
        km_scaler = joblib.load("models/clustering_scaler.joblib")
    except Exception:
        # Fallback to cached runs if models folder not accessed directly
        _, _, mult_r = get_cached_regression(selected_course, early=False)
        _, clf_r, _ = get_cached_classification(selected_course, early=False)
        _, km_r, _, _ = get_cached_clustering(selected_course, k=3)
        reg_pipe = mult_r["pipeline"]
        clf_pipe = clf_r["Logistic Regression"]["pipeline"]
        km_model = km_r["model"]
        km_scaler = km_r["scaler"]
        
    with st.form("student_assessment_form"):
        st.markdown("### 1. Academic & Exam History")
        c1, c2, c3, c4 = st.columns(4)
        with c1:
            g1_val = st.slider("1st Period Grade (G1: 0–20)", 0, 20, 10)
        with c2:
            g2_val = st.slider("2nd Period Grade (G2: 0–20)", 0, 20, 11)
        with c3:
            failures_val = st.selectbox("Past Class Failures", [0, 1, 2, 3, 4], index=0)
        with c4:
            absences_val = st.slider("School Absences", 0, 93, 4)
            
        st.markdown("### 2. Study Habits & Environmental Attributes")
        c5, c6, c7, c8 = st.columns(4)
        with c5:
            studytime_val = st.selectbox("Weekly Study Time", [1, 2, 3, 4], index=1, format_func=lambda x: ["<2 hrs", "2-5 hrs", "5-10 hrs", ">10 hrs"][x-1])
        with c6:
            higher_val = st.selectbox("Aims for Higher Education?", ["yes", "no"], index=0)
        with c7:
            schoolsup_val = st.selectbox("Extra Educational Support?", ["yes", "no"], index=1)
        with c8:
            internet_val = st.selectbox("Internet Access at Home?", ["yes", "no"], index=0)
            
        st.markdown("### 3. Family & Personal Background")
        c9, c10, c11, c12 = st.columns(4)
        with c9:
            age_val = st.slider("Student Age", 15, 22, 17)
        with c10:
            medu_val = st.selectbox("Mother's Education (Medu)", [0, 1, 2, 3, 4], index=2, format_func=lambda x: ["None", "Primary (4th)", "5th-9th", "Secondary", "Higher"][x])
        with c11:
            fedu_val = st.selectbox("Father's Education (Fedu)", [0, 1, 2, 3, 4], index=2, format_func=lambda x: ["None", "Primary (4th)", "5th-9th", "Secondary", "Higher"][x])
        with c12:
            goout_val = st.selectbox("Going Out with Friends", [1, 2, 3, 4, 5], index=2, format_func=lambda x: f"{x} / 5")
            
        submitted = st.form_submit_button("Assess Student Academic Profile")
        
    if submitted:
        # Build student row with sensible median defaults for unselected optional features
        student_data = {
            "school": "GP",
            "sex": "F",
            "age": age_val,
            "address": "U",
            "famsize": "GT3",
            "Pstatus": "T",
            "Medu": medu_val,
            "Fedu": fedu_val,
            "Mjob": "other",
            "Fjob": "other",
            "reason": "course",
            "guardian": "mother",
            "traveltime": 1,
            "studytime": studytime_val,
            "failures": failures_val,
            "schoolsup": schoolsup_val,
            "famsup": "yes",
            "paid": "no",
            "activities": "yes",
            "nursery": "yes",
            "higher": higher_val,
            "internet": internet_val,
            "romantic": "no",
            "famrel": 4,
            "freetime": 3,
            "goout": goout_val,
            "Dalc": 1,
            "Walc": 2,
            "health": 3,
            "absences": absences_val,
            "G1": g1_val,
            "G2": g2_val
        }
        student_df = pd.DataFrame([student_data])
        
        # 1. Predict continuous G3
        pred_g3 = float(reg_pipe.predict(student_df)[0])
        pred_g3 = max(0.0, min(20.0, pred_g3))
        
        # 2. Predict Academic Risk
        pred_risk_code = int(clf_pipe.predict(student_df)[0])
        pred_risk_proba = float(clf_pipe.predict_proba(student_df)[0][1]) if hasattr(clf_pipe, "predict_proba") else 0.5
        
        # 3. Predict Cluster
        cluster_feats = student_df[CLUSTERING_FEATURES].copy()
        cluster_scaled = km_scaler.transform(cluster_feats)
        assigned_cluster = int(km_model.predict(cluster_scaled)[0])
        
        st.markdown("<br>", unsafe_allow_html=True)
        st.markdown("### Assessment Findings")
        
        r1, r2, r3, r4 = st.columns(4)
        r1.metric("Predicted Final Grade (G3)", f"{pred_g3:.1f} / 20")
        r2.metric("Academic Risk Status", "At Risk" if pred_risk_code == 1 else "Not At Risk")
        r3.metric("At-Risk Probability", f"{pred_risk_proba*100:.1f}%")
        r4.metric("Assigned Student Archetype", f"Cluster {assigned_cluster}")
        
        if pred_risk_code == 1:
            st.markdown(f"""
            <div class="risk-alert">
                <strong>Attention Required: Academic Risk Identified ({pred_risk_proba*100:.1f}% confidence)</strong><br>
                The student's preliminary performance indicators (G1={g1_val}, G2={g2_val}, Failures={failures_val}) place them below the semester threshold of 10/20.
                <br><strong>Suggested Action:</strong> Schedule a supportive 1-on-1 academic mentoring session, review foundational topics from Period 1, and monitor upcoming attendance closely.
            </div>
            """, unsafe_allow_html=True)
        else:
            st.markdown(f"""
            <div class="safe-alert">
                <strong>Positive Trajectory: Student on Track ({100 - pred_risk_proba*100:.1f}% safe margin)</strong><br>
                The student's current profile indicates strong likelihood of passing final requirements (forecasted G3: {pred_g3:.1f}).
                <br><strong>Suggested Action:</strong> Encourage continued study engagement and self-directed academic exploration.
            </div>
            """, unsafe_allow_html=True)


# =============================================================================
# 9. PROJECT GUIDE & VIVA
# =============================================================================
elif menu == "Project Guide & Viva":
    st.markdown("## Project Guide & University Viva Preparation")
    st.markdown(
        "A comprehensive academic defense walkthrough covering the seven laboratory practicals, "
        "mathematical formulations, architectural decisions, and typical oral viva examination questions."
    )
    st.markdown("<hr>", unsafe_allow_html=True)
    
    st.markdown("### Practical Mapping Across EduRisk AI")
    st.markdown(f"""
    <div style="background-color: {COLOR_WHITE}; border: 1px solid {COLOR_CLAY}; padding: 18px 24px; border-radius: 4px; font-size: 13.5px; line-height: 1.8;">
        <strong>Practical 1 — Data Preprocessing & EDA:</strong> Data hygiene audit, missing value checks, duplicate checks, descriptive statistics, univariate and bivariate visualizations.<br>
        <strong>Practical 2 — Regression Analysis:</strong> Simple and Multiple Linear Regression to estimate final grade G3 (0–20 scale). Evaluated using MAE, MSE, RMSE, and R².<br>
        <strong>Practical 3 — Supervised Classification:</strong> Formulated binary academic risk (G3 &lt; 10). Trained and benchmarked Logistic Regression, KNN, and Gaussian Naive Bayes on a stratified 75:25 split.<br>
        <strong>Practical 4 — K-Means Clustering:</strong> Discovered student cohorts using academic and behavioral features (excluding G3). Evaluated using Elbow method (Inertia) and Silhouette scores.<br>
        <strong>Practical 5 — Gaussian Mixture Models & Bagging:</strong> Implemented soft EM clustering with AIC/BIC scoring. Initiated ensemble learning using Bootstrap Aggregation.<br>
        <strong>Practical 6 — Random Forest Ensembles:</strong> Evaluated Random Forest variance reduction, estimator scaling (5, 10, 50, 100), and class-balanced weighting.<br>
        <strong>Practical 7 — Validation & Tuning:</strong> 5-fold and 10-fold Stratified Cross-Validation, GridSearchCV, RandomizedSearchCV, and test-set verification without data leakage.
    </div>
    """, unsafe_allow_html=True)
    
    st.markdown("<br>", unsafe_allow_html=True)
    st.markdown("### Top Viva Questions & Model Academic Answers")
    
    viva_qas = [
        (
            "Q1: Why must G3 and the academic risk label be strictly excluded from clustering inputs?",
            "If G3 or the risk label were included in clustering, the algorithm would trivially group students based on the target outcome rather than discovering natural behavioral patterns (such as study hours, absences, and parental education). Excluding G3 allows us to evaluate whether organic student behavior correlates with final outcomes retrospectively."
        ),
        (
            "Q2: Why is Recall for the 'At Risk' class prioritized over overall Accuracy in this project?",
            "In educational risk analytics, misclassification costs are asymmetric. A False Negative (failing to identify a struggling student) prevents academic intervention and leads to course failure. A False Positive simply results in a student receiving an extra advisory check-in. Maximizing Recall minimizes dangerous False Negatives."
        ),
        (
            "Q3: How does EduRisk AI guarantee that no data leakage occurs during cross-validation and hyperparameter tuning?",
            "All transformations (OneHotEncoder, StandardScaler, and Imputers) are enclosed within Scikit-Learn Pipelines. During K-Fold Cross-Validation and GridSearchCV, the transformations are fitted exclusively on the training folds and only applied (transformed) onto validation folds. Furthermore, 25% of the data was locked away prior to any tuning."
        ),
        (
            "Q4: What is the mathematical and conceptual difference between K-Means and Gaussian Mixture Models?",
            "K-Means performs 'hard' spherical clustering based on Euclidean distance to centroids (minimizing within-cluster sum of squares). GMM is a probabilistic 'soft' clustering model based on a mixture of multivariate Gaussian distributions fitted via the Expectation-Maximization (EM) algorithm, providing posterior probabilities of cluster membership."
        ),
        (
            "Q5: Why does Bagging reduce variance while Boosting reduces bias?",
            "Bagging trains independent models in parallel on bootstrap samples and averages their outputs, which dampens variance without altering bias. Boosting trains models sequentially, where each subsequent model focuses on the residual errors of preceding models, directly driving down bias."
        ),
        (
            "Q6: Why does G2 exhibit such dominant feature importance in the full-term model, and why is an early-warning mode necessary?",
            "G2 represents the second-period examination taken just weeks before final exam G3, so it shares high Pearson correlation (~0.90). However, in a real university setting, waiting for G2 may leave too little time for remedial action. Therefore, EduRisk AI offers an Early-Warning Mode that excludes G2, forcing the models to rely on G1, past failures, and behavioral factors."
        )
    ]
    
    for q, a in viva_qas:
        with st.expander(q, expanded=False):
            st.markdown(f"<div style='font-size: 13.5px; line-height: 1.7; color: {COLOR_ESPRESSO};'>{a}</div>", unsafe_allow_html=True)
            
    st.markdown("<hr>", unsafe_allow_html=True)
    st.markdown("### How to Deliver a 5-Minute Lab Presentation")
    st.markdown(f"""
    <div style="background-color: {COLOR_WHITE}; border: 1px solid {COLOR_CLAY}; padding: 18px 24px; border-radius: 4px; font-size: 13px; line-height: 1.8;">
        <strong>Minute 1: Problem & Data Ingestion (Overview & Data Explorer):</strong> Show the 395 students, 33 attributes, 0 nulls, and bimodal G3 distribution.<br>
        <strong>Minute 2: Dual Supervised Formulation (Grade Prediction & Academic Risk):</strong> Explain regression ($R^2 \\approx 0.72$) and classification ($Acc \\approx 93.9\\%$, $Recall \\approx 87.9\\%$). Explain early vs late mode.<br>
        <strong>Minute 3: Unsupervised Pattern Discovery (Student Segments):</strong> Walk through PCA 2D scatter and show how the 3 clusters naturally align with high, moderate, and vulnerable students.<br>
        <strong>Minute 4: Ensemble Learning & Tuning (Laboratory & Validation):</strong> Present the estimator scaling curve, 5-fold CV stability, and feature importances.<br>
        <strong>Minute 5: Interactive Deployment (Student Risk Assessment):</strong> Demonstrate an interactive test case by inputting sample student values and showing the real-time risk assessment and recommendations.
    </div>
    """, unsafe_allow_html=True)
