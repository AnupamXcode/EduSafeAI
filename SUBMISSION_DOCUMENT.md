# Machine Learning Lab Project — Final Submission Report

**Project Title:** EduRisk AI — Student Performance Prediction and Academic Risk Analytics System  
**Course:** Machine Learning Lab (CS / IT)  
**Date of Submission:** October 22, 2026  

---

## 👥 Student Team Details

| Sr. No. | Student Name | Roll Number | Role / Contribution |
| :---: | :--- | :---: | :--- |
| **1** | **Anupam Shrivastava** | **38** | Fullstack Architecture, Cloud Deployment & API Integration |
| **2** | **Nikhil Pathak** | **50** | Machine Learning Pipeline, Regression & Model Evaluation |
| **3** | **Abhishek Butale** | **35** | Exploratory Data Analysis, Classification & Risk Analytics |

---

## 📌 Submission Checklist (Mandatory Items)

| Item | Requirement | Submission Status | Direct Access Link |
| :---: | :--- | :---: | :--- |
| **1** | **Saved Model File(s)** | ✅ Completed & Serialized | [GitHub `saved_models/` Folder](https://github.com/AnupamXcode/MLDS_Project/tree/main/saved_models) |
| **2** | **Working Public URL** | ✅ Live on Vercel | [https://mldsproject-one.vercel.app/](https://mldsproject-one.vercel.app/) |
| **3** | **Complete Notebook with Code & Output** | ✅ 8 Practicals with executed outputs | [GitHub Jupyter Notebook (`.ipynb`)](https://github.com/AnupamXcode/MLDS_Project/blob/main/EduRisk_AI_Student_Performance_ML_Project.ipynb) |

---

## 🔗 Key Project Links

- 🌐 **Live Web Application URL:** [https://mldsproject-one.vercel.app/](https://mldsproject-one.vercel.app/)
- 💻 **Complete GitHub Repository:** [https://github.com/AnupamXcode/MLDS_Project](https://github.com/AnupamXcode/MLDS_Project)
- 📓 **Jupyter Notebook (`.ipynb` with Outputs):** [https://github.com/AnupamXcode/MLDS_Project/blob/main/EduRisk_AI_Student_Performance_ML_Project.ipynb](https://github.com/AnupamXcode/MLDS_Project/blob/main/EduRisk_AI_Student_Performance_ML_Project.ipynb)
- 📦 **Trained Model Artifacts Bundle (`.joblib` / `.pkl`):** [https://github.com/AnupamXcode/MLDS_Project/tree/main/saved_models](https://github.com/AnupamXcode/MLDS_Project/tree/main/saved_models)
- 🩺 **Backend Health & Diagnostics API:** [https://mldsproject-one.vercel.app/api/health](https://mldsproject-one.vercel.app/api/health)

---

## 📂 1. Saved Model Files Directory

The trained machine learning models and preprocessing pipelines are serialised and available in the repository under `saved_models/`:

1. **`saved_models/edurisk_complete_bundle.joblib`** (710 KB)  
   *Unified deployment bundle containing the standard scaler, one-hot encoder, linear regression model, logistic regression classifier, random forest classifier, and k-means clustering model with feature metadata.*
2. **`saved_models/grade_prediction_model.pkl`** (1.2 KB)  
   *Linear Regression grade estimator predicting final score $G3$ on a 0–20 scale.*
3. **`saved_models/risk_classification_model.pkl`** (1.1 KB)  
   *Logistic Regression probabilistic classifier predicting binary academic risk ($G3 < 10$).*
4. **`saved_models/random_forest_model.pkl`** (686 KB)  
   *Random Forest ensemble classifier (100 estimators) for robust non-linear risk categorization.*
5. **`saved_models/kmeans_clustering_model.pkl`** (2.5 KB)  
   *K-Means clustering algorithm ($k=3$) grouping students into behavioral personas.*
6. **`saved_models/preprocessor.pkl`** (9.8 KB)  
   *Scikit-Learn ColumnTransformer pipeline (StandardScaler for numerical features + OneHotEncoder for categorical features).*

---

## 🌐 2. Working Public URL & Web System

- **Live URL:** [https://mldsproject-one.vercel.app/](https://mldsproject-one.vercel.app/)
- **Hosting Platform:** Vercel Serverless Multi-Service Architecture
- **Frontend Stack:** React 19, TypeScript, Vite, TailwindCSS, Lucide Icons, Glassmorphic UI
- **Backend Stack:** Python 3.11, FastAPI, Scikit-Learn, Pandas, NumPy, Joblib
- **Key Modules in Live App:**
  - **Overview & KPI Dashboard:** Real-time metrics showing total students (395), average grade (10.42/20), failure rates, and study distribution.
  - **Data Explorer & EDA:** Interactive correlation heatmaps, feature histograms, study time vs. performance charts.
  - **Real-Time Grade Prediction ($G3$):** Instant regression inference with custom student inputs (study time, absences, failures, past test scores).
  - **Academic Risk Assessment:** Probabilistic risk gauge (At Risk vs. Safe) with early intervention recommendations.
  - **Student Clustering Personas:** K-Means unsupervised profile clustering (*High Achievers*, *Moderate Effort*, *Vulnerable/High-Risk*).

---

## 📓 3. Complete Jupyter Notebook Summary

- **Notebook File:** `EduRisk_AI_Student_Performance_ML_Project.ipynb`
- **Dataset:** UCI Machine Learning Repository — Student Performance Dataset (395 students, 33 attributes)
- **Structure & Executed Practicals:**
  - **Section 1: Dataset Acquisition & Understanding:** Ingestion of Mathematics and Portuguese cohorts, shape verification, feature dictionary.
  - **Section 2: Data Cleaning & Preprocessing:** Null check, encoding binary flags (`yes`/`no`), standardising continuous features (`age`, `absences`, `studytime`).
  - **Section 3: Exploratory Data Analysis (EDA):** Statistical correlation analysis, grade distribution, impact of alcohol consumption and school support.
  - **Section 4: Supervised Learning (Regression):** Linear Regression, Ridge, and Lasso for predicting final exam grade $G3$.
  - **Section 5: Supervised Learning (Classification):** Binary academic risk prediction using Logistic Regression and Random Forest.
  - **Section 6: Unsupervised Learning (Clustering):** K-Means ($k=3$) student segmentation with PCA 2D visualisation.
  - **Section 7: Model Evaluation & Comparison:** Confusion matrices, ROC curves, cross-validation metrics, classification reports.
  - **Section 8: Model Persistence & Pipeline Deployment:** Saving `.pkl` and `.joblib` pipelines for production web API serving.

---

## 📊 Benchmark Model Performance Metrics

| Task | Machine Learning Model | Key Metric 1 | Key Metric 2 | Benchmark Result |
| :--- | :--- | :--- | :--- | :--- |
| **Grade Prediction** | **Linear Regression** | $R^2 \text{ Score}$ | $\text{RMSE}$ | **$R^2 = 0.8329$, $\text{RMSE} = 1.8388$** |
| **Risk Classification** | **Logistic Regression** | $\text{Accuracy}$ | $\text{ROC-AUC}$ | **$\text{Accuracy} = 92.41\%$, $\text{ROC-AUC} = 0.9634$** |
| **Risk Classification** | **Random Forest (100 Trees)** | $\text{Accuracy}$ | $\text{F1-Score}$ | **$\text{Accuracy} = 91.14\%$, $\text{F1} = 0.8444$** |
| **Student Segmentation**| **K-Means Clustering** | Silhouette Score | Number of Clusters | **$k = 3$ Student Archetypes** |

---

## 🎯 Viva Voce Defense Summary

1. **What is the primary objective of EduRisk AI?**  
   To build an end-to-end predictive and diagnostic machine learning system that forecasts final student exam grades ($G3$) and flags high-risk students early in the semester, enabling timely educational interventions.

2. **Which features are most predictive of student performance?**  
   First and second period grades ($G1$ and $G2$) have the strongest correlation ($r > 0.80$). Secondary negative predictors include past academic failures (`failures`), high absenteeism (`absences`), and weekend alcohol consumption (`Walc`).

3. **How is the model deployed in production?**  
   The Scikit-Learn pipeline is persisted as `.joblib` and `.pkl` objects, loaded into a high-performance Python FastAPI server, and served asynchronously to a modern React Vite frontend deployed globally on Vercel.

---

*Submitted by: Anupam Shrivastava (38) • Nikhil Pathak (50) • Abhishek Butale (35)*
