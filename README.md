# EduRisk AI: Student Performance Prediction and Academic Risk Analytics System

A production-ready, full-stack university machine learning system engineered with a **React 19 + TypeScript + Vite + Tailwind CSS** frontend and a **Python 3.11 + FastAPI + Scikit-Learn** analytical backend.

Adheres strictly to the **Academic Monograph & Statistical Laboratory** visual identity:
- **Palette**: Warm Ivory (`#F8F6F0`), Deep Forest Olive (`#244C3A`), Muted Sage (`#A9B8A0`), Burnt Terracotta (`#C66B4E`), Warm Sand Linen (`#E6DCCB`), Architectural Hairline Divider (`#D9D2C3`), Charcoal Brown (`#332F2A`), and Paper White (`#FFFFFF`).
- **Typography**: Editorial Serif (*Lora* & *Newsreader*) for titles, *DM Sans* for interface, and tabular numerals for numbers.
- **Architectural Style**: Sharp edges (`0px` border-radius), structured 12-column broadsheet layout, and high statistical density without generic SaaS clichés.

---

## 1. System Architecture

```text
ML Project/
├── data/
│   ├── student-mat.csv              # Primary UCI Math Course dataset (395 records)
│   ├── student-por.csv              # Optional Portuguese Course dataset (649 records)
│   ├── student.txt                  # Dataset documentation
│   └── processed/
│       └── student_clean.csv        # Preprocessed clean dataset with derived risk label
├── backend/
│   ├── app/
│   │   ├── main.py                  # FastAPI server with 11 analytical & prediction endpoints
│   │   ├── data_processing.py       # Preprocessing pipelines, data quality audit
│   │   ├── regression.py            # Simple & Multiple Linear Regression
│   │   ├── classification.py        # Logistic Regression, KNN, Gaussian Naive Bayes
│   │   ├── clustering.py            # K-Means (Elbow, Silhouette) & GMM (EM algorithm)
│   │   ├── ensemble.py              # Bagging (5, 10, 50, 100), Heterogeneous Base Learners, RF
│   │   └── evaluation.py            # 5/10-Fold Stratified CV, GridSearchCV, RandomizedSearchCV
│   ├── models/                      # Serialized joblib pipelines
│   └── requirements.txt             # Backend dependencies
├── frontend/
│   ├── index.html                   # HTML entry point with Google Fonts
│   ├── package.json                 # React, TypeScript, Vite, Recharts, Lucide-React
│   ├── src/
│   │   ├── api/
│   │   │   └── client.ts            # Typed API client connecting to FastAPI
│   │   ├── components/
│   │   │   └── Header.tsx           # Academic header, cohort switcher, navigation
│   │   ├── pages/
│   │   │   ├── OverviewPage.tsx     # Executive dashboard, bimodal G3 chart, indicators
│   │   │   ├── PerformancePage.tsx  # Regression, actual vs predicted, grade predictor
│   │   │   ├── RiskAnalysisPage.tsx # Classification, confusion matrix, ROC, risk profiler
│   │   │   ├── StudentSegmentsPage.tsx # K-Means (K=2..6), 2D PCA scatter, GMM, profiles
│   │   │   ├── ModelLabPage.tsx     # Ensembles, scaling, 5/10-fold CV, GridSearchCV
│   │   │   └── ProjectGuidePage.tsx # 7 Practicals synthesis, methodology, viva Q&A
│   │   ├── types/
│   │   │   └── index.ts             # Domain models & TypeScript interfaces
│   │   ├── App.tsx                  # Main router & state manager
│   │   └── index.css                # Academic CSS tokens & typography
├── design/                          # Design reference assets (Google Stitch)
├── outputs/
│   ├── figures/                     # 10 standalone publication charts
│   └── reports/                     # Machine-readable benchmarks & summary
├── test_api.py                      # Automated API integration test suite
├── test_app.py                      # Offline ML module smoke test suite
├── run_app.bat                      # One-click Windows dual full-stack launcher
├── VIVA_PREPARATION.md              # 10/10 University Viva Defense Manual
└── README.md
```

---

## 2. Information Architecture (Workflow-Driven)

The platform is organized strictly around the analytical workflow (not isolated practical numbers):

1. **Overview**: Executive summary, 4 critical indicators (395 records, 10.42 mean grade, 130 at-risk students, Logistic Regression top model), primary final-grade distribution chart, study time impact, risk proportion, and concise benchmark table.
2. **Performance**: Regression engine predicting continuous grade $G3 \in [0, 20]$. Toggle between Full-Term (with G2) and Early-Warning (without G2). Interactive actual-vs-predicted scatter, Simple Linear Regression line, feature weights table, and live student grade forecasting form.
3. **Risk Analysis**: Binary classification for academic vulnerability ($G3 < 10$). Benchmarks Logistic Regression, KNN, Naive Bayes, Decision Tree, and Random Forest. Interactive Confusion Matrix inspector, multi-model ROC curves, and a pedagogical analysis on why Recall is paramount for student intervention.
4. **Student Segments**: Unsupervised student discovery via K-Means ($K=2 \dots 6$) and Gaussian Mixture Models (EM soft clustering). G3 is strictly excluded from clustering inputs. Features a large 2D PCA projection scatter plot with point inspection and empirical characteristic profiles.
5. **Model Lab**: Demonstrates ensemble variance reduction. Bagging estimator scaling (5, 10, 50, 100 trees), heterogeneous base learners (DT vs KNN vs Logistic Regression), 5-Fold/10-Fold Stratified Cross-Validation stability, GridSearchCV vs RandomizedSearchCV timing, and Top 10 Feature Importances.
6. **Project Guide**: Curriculum mapping synthesizing the 7 university practicals into one pipeline, clear methodology diagram, viva defense questions, and a 5-minute timed presentation roadmap for scoring 10/10 marks.

---

## 3. Verified Benchmark Results

Computed from live Scikit-Learn pipelines on the dataset:

| Task | Top Model | Primary Metric | Secondary Metric |
| :--- | :--- | :---: | :---: |
| **Grade Regression (Full-Term)** | Multiple Linear Regression | $R^2 = \mathbf{0.724}$ | $\text{RMSE} = \mathbf{2.38}$ marks |
| **Grade Regression (Early)** | Multiple Linear Regression | $R^2 = \mathbf{0.591}$ | $\text{RMSE} = \mathbf{2.90}$ marks |
| **Risk Classification** | Logistic Regression | $\text{Accuracy} = \mathbf{93.94\%}$ | $\text{Recall (At Risk)} = \mathbf{87.88\%}$ |
| **Ensemble Classification** | Random Forest (100 Trees) | $\text{Accuracy} = \mathbf{92.93\%}$ | $F_1 = \mathbf{0.8955}$ (ROC: 0.977) |
| **Unsupervised Archetypes** | K-Means ($K=3$) | $\text{Silhouette} = \mathbf{0.1120}$ | 3 Distinct Cohorts |
| **Cross-Validation** | 5-Fold Stratified CV | $\text{Mean } F_1 = \mathbf{0.8652}$ | $\text{Std Dev} = \mathbf{0.0472}$ |
| **Hyperparameter Tuning** | GridSearchCV (RF) | $\text{Mean CV } F_1 = \mathbf{0.8741}$ | Search Time: **7.86s** |

---

## 4. Local Execution & Setup Instructions

### Option 1: One-Click Windows Launcher (Easiest)
Simply double-click:
```text
run_app.bat
```
This automatically starts the FastAPI backend on port `8000`, the React Vite frontend on port `5173`, and opens your default browser to `http://localhost:5173`.

### Option 2: Manual Terminal Execution

#### Terminal 1 — Start FastAPI Backend:
```powershell
cd "ML Project"
py -3.11 -m uvicorn app.main:app --app-dir backend --port 8000 --host 127.0.0.1
```
- API Base: `http://127.0.0.1:8000`
- Interactive Swagger Documentation: `http://127.0.0.1:8000/docs`

#### Terminal 2 — Start React Vite Frontend:
```powershell
cd "ML Project/frontend"
npm run dev -- --host 127.0.0.1 --port 5173
```
- Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 5. Automated Verification & Testing

To verify all 11 backend API endpoints:
```powershell
py -3.11 test_api.py
```
*(Result: 11/11 endpoints passing with HTTP 200 OK)*

To verify the standalone Scikit-learn pipelines and model serializations:
```powershell
py -3.11 test_app.py
```
*(Result: 9/9 unit & smoke tests passing)*

To verify the React frontend production bundle compilation:
```powershell
cd frontend
npm run build
```
*(Result: Zero TypeScript errors, production bundle compiled)*

---

## 6. Deployment Guide

### Frontend Deployment (Vercel)
1. Set the Root Directory to `frontend`.
2. Configure Environment Variable:
   - `VITE_API_URL`: URL of your deployed FastAPI backend (e.g., `https://edurisk-api.onrender.com`).
3. Deploy command: `npm run build`, Output directory: `dist`.

### Backend Deployment (Render / Railway / Fly.io)
1. Set Root Directory to `backend`.
2. Build Command: `pip install -r requirements.txt`.
3. Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.

---

## 7. Viva Defense & Lab Evaluation Preparation

For university lab examinations, refer to [VIVA_PREPARATION.md](file:///D:/Projects/College%20Project/ML%20Project/VIVA_PREPARATION.md) for:
- 2-minute oral elevator pitch.
- Mathematical formulations for OLS, Logistic Sigmoid, K-Means Inertia, and GMM Expectation-Maximization.
- Examiner question bank covering data leakage, class imbalance, and why Recall is prioritized over Accuracy.
- 5-minute timed presentation strategy to secure 10/10 marks.
#   M L D S _ P r o j e c t  
 