# EduRisk AI: Academic Analytics & ML Benchmark Report

**Dataset**: UCI Student Performance (Mathematics: `student-mat.csv`)  
**Sample Size**: 395 Students | **Features**: 33 Raw Attributes  
**Academic Risk Criteria**: Final Grade G3 < 10 (Target Count: 130 students, 32.9%)

---

## 1. Regression Performance (Final Grade G3 Prediction)
- **Full-Term Model (with G2)**: R² = 0.724, RMSE = 2.38 marks
- **Early-Warning Model (excluding G2)**: R² = 0.591, RMSE = 2.90 marks
- **Academic Insight**: G2 serves as the single strongest proxy for final performance. In early semesters, grade variance is explained by baseline exam G1 and cumulative class failures.

## 2. Supervised Classification (At Risk vs Not At Risk)
- **Best Model**: Logistic Regression (Accuracy = 93.9%, F1 = 0.906, ROC-AUC = 0.978)
- **Recall for At-Risk Students**: 87.9%
- **Educational Context**: High Recall is paramount to ensure struggling students are not missed by academic advisory programs.

## 3. Student Segmentation (K-Means & Gaussian Mixture Models)
- **Optimal Clusters**: K = 3 based on Elbow and Silhouette heuristic
- **Discovered Segments**:
  1. **High Achievers / Consistent Study**: Low absences, zero past failures, high parental education (G3 ~ 12.2).
  2. **Moderate Engagement / High Attendance**: Borderline baseline scores with high attendance (G3 ~ 9.9).
  3. **High Academic Risk / Prior Failures**: Higher absences, prior failures, low baseline exams (G3 ~ 8.5).

## 4. Ensemble Learning & Variance Reduction
- **Single Decision Tree**: F1 = 0.857
- **Bagging (100 Trees)**: F1 = 0.882
- **Random Forest (100 Trees)**: F1 = 0.896
- **Observation**: Bagging and Random Forest significantly dampen the high variance of individual decision trees through bootstrap aggregation and feature subspace sampling.

## 5. Cross-Validation & Hyperparameter Tuning
- **5-Fold Stratified CV Mean F1**: 0.8652 +/- 0.0472
- **10-Fold Stratified CV Mean F1**: 0.8727 +/- 0.0845
- **Optimized Test Set F1**: 0.8955 (Accuracy = 92.9%)
- **Top 3 Predictive Features**: G2, G1, failures
