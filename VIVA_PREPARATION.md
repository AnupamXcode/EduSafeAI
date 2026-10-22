# EduRisk AI: University Lab Examination & Viva Defense Manual

**Course**: Machine Learning Laboratory (10 Marks Evaluation)  
**Project Title**: EduRisk AI — Student Performance Prediction and Academic Risk Analytics System  
**Dataset**: UCI Student Performance (Mathematics: `student-mat.csv`, 395 samples, 33 attributes)

---

## 1. Quick 2-Minute Project Elevator Pitch

> "EduRisk AI is an integrated machine learning system designed to solve academic dropout and failure risks in higher education. Using real records from the UCI Student Performance benchmark, the project implements a complete pipeline across 7 university practicals.
>
> We formulate the student success problem in two ways:
> 1. **Regression**: Forecasting continuous final grade $G3 \in [0, 20]$ using Simple and Multiple Linear Regression ($R^2 \approx 0.724$, $RMSE \approx 2.38$).
> 2. **Classification**: Identifying students in academic risk ($G3 < 10$) using Logistic Regression, KNN, and Naive Bayes ($93.9\%$ accuracy, $87.9\%$ recall).
>
> To support intervention without grade bias, we implement **K-Means and GMM clustering** on behavioral features alone. We then demonstrate **Ensemble Learning** with Bagging and Random Forest, and perform **5-fold and 10-fold Stratified Cross-Validation with GridSearchCV** to prevent data leakage and optimize performance. Everything is deployable through an interactive Streamlit analytics dashboard."

---

## 2. Practical-by-Practical Breakdown

### Practical 1: Data Preprocessing & Exploratory Data Analysis
- **Goal**: Clean raw data, audit missing values, detect duplicates, and extract preliminary statistical relationships.
- **Key Findings in `student-mat.csv`**:
  - Sample Size: 395 rows, 33 columns.
  - Zero missing values, zero duplicates.
  - Bimodal target: Final grades cluster between 10–15, with a distinct spike at 0 (students who dropped out or missed final exams).
  - Risk definition: $G3 < 10$ yields 130 At-Risk students (32.9%) and 265 Passing students (67.1%).
- **Transformation Pipeline**: `ColumnTransformer` with `OneHotEncoder(drop='first')` for nominals, binary flags (0/1), and `StandardScaler` for numeric features. Fitted exclusively on training folds.

### Practical 2: Simple & Multiple Linear Regression
- **Goal**: Predict continuous final grade $G3$.
- **Hypothesis**: Can baseline exams and study habits predict the exact final marks?
- **Formulation**:
  $$\hat{y} = \beta_0 + \sum_{j=1}^{p} \beta_j X_j$$
- **Metrics**:
  - **MAE**: Average absolute point error ($\approx 1.65$ marks).
  - **RMSE**: Penalizes large deviations heavily ($\approx 2.38$ marks).
  - **$R^2$**: Proportion of variance explained ($\approx 0.724$).
- **Early vs. Late Mode**:
  - Late mode includes $G2$ ($R^2 = 0.724$).
  - Early mode excludes $G2$ and relies on $G1$, absences, and failures ($R^2 = 0.591$).

### Practical 3: Supervised Classification for Academic Risk
- **Goal**: Classify students into **At Risk (1)** vs **Not At Risk (0)** based on threshold $G3 < 10$.
- **Algorithms**:
  - **Logistic Regression**: Best performer ($Acc = 93.9\%$, $Recall = 87.9\%$, $ROC\text{-}AUC = 0.978$).
  - **K-Nearest Neighbors ($k=5$)**: Distance-based voting ($Acc = 82.8\%$, $Recall = 63.6\%$).
  - **Gaussian Naive Bayes**: Probabilistic Bayes' theorem with Gaussian likelihood ($Acc = 81.8\%$, $Recall = 72.7\%$).
- **Why Recall is Paramount**: A false negative means a struggling student receives no help and fails. A false positive merely invites a passing student to optional tutoring. Therefore, Recall ($\frac{TP}{TP + FN}$) is the chief evaluation criterion.

### Practical 4 & 5: Student Segmentation (Unsupervised Clustering)
- **Goal**: Group students by academic habits without knowing their final grades.
- **Algorithms**:
  - **K-Means**: Minimizes within-cluster sum of squares (Inertia) using Euclidean distance.
    - Evaluated with Elbow Method ($K=1..12$) and Silhouette Analysis. Optimal $K=3$.
  - **Gaussian Mixture Models (GMM)**: Soft probabilistic clustering via Expectation-Maximization (EM). Evaluated with AIC and BIC.
- **Critical Rule**: $G3$ and the risk label are **never passed to clustering algorithms**. They are only used retrospectively to evaluate cluster profiles.
- **Discovered Archetypes**:
  - *Cluster 0 (High Achievers)*: High study time, 0 failures, low absences ($G3 \approx 12.2$).
  - *Cluster 1 (Moderate Engagement)*: Average attendance, borderline baseline exam ($G3 \approx 9.9$).
  - *Cluster 2 (High Academic Vulnerability)*: Multiple past failures, higher absences ($G3 \approx 8.5$).

### Practical 5 & 6: Ensemble Learning
- **Goal**: Mitigate variance and improve stability using bootstrap aggregation and random forests.
- **Models Implemented**:
  1. Single Decision Tree (High variance baseline: $Acc = 89.9\%$, $F_1 = 0.857$).
  2. Bagging with varying trees ($n = 5, 10, 50, 100$): Demonstrates variance reduction ($F_1$ rises from $0.865$ to $0.882$).
  3. Bagging with heterogeneous base estimators (Decision Tree vs KNN vs Logistic Regression).
  4. Random Forest (100 trees, random feature sub-spacing: $Acc = 92.9\%$, $F_1 = 0.896$, $AUC = 0.977$).
  5. Balanced Random Forest (`class_weight='balanced'`): Adjusts penalties inversely proportional to class frequencies.

### Practical 7: Cross-Validation & Hyperparameter Optimization
- **Goal**: Prevent optimistic test bias and find optimal hyperparameters.
- **Cross-Validation**:
  - 5-Fold Stratified CV Mean $F_1 = 0.8652 \pm 0.0472$
  - 10-Fold Stratified CV Mean $F_1 = 0.8727 \pm 0.0845$
- **Hyperparameter Search Space**:
  - `n_estimators`: [50, 100, 200]
  - `max_depth`: [None, 5, 10, 15]
  - `min_samples_split`: [2, 5, 10]
- **GridSearchCV vs RandomizedSearchCV**:
  - GridSearchCV evaluated all 36 combinations in $\approx 7.8$ seconds.
  - RandomizedSearchCV evaluated 20 random samples in $\approx 3.0$ seconds with equivalent validation score ($F_1 \approx 0.86$).
- **Top 3 Features**: $G2$ (45.0%), $G1$ (26.3%), Past Failures (4.6%).

---

## 3. High-Probability Viva Questions & Model Answers

### Question 1: What is data leakage and how did you prevent it in your code?
> **Answer**: Data leakage occurs when information from outside the training dataset (such as test fold statistics) is inadvertently used to build or scale the model. We prevented leakage by wrapping all encoders (`OneHotEncoder`) and scalers (`StandardScaler`) within `sklearn.pipeline.Pipeline`. During K-fold CV and hyperparameter tuning, scaling parameters ($\mu, \sigma$) were calculated strictly on the training folds and only applied to validation folds. In addition, an untouched 25% test set was held out before tuning began.

### Question 2: Why does Simple Linear Regression with G2 yield a higher R² than Multiple Linear Regression with all features?
> **Answer**: $G2$ (the second period grade) has an extremely strong linear correlation ($\approx 0.90$) with $G3$. When fitting Multiple Linear Regression with 30+ encoded features on a small dataset (316 training samples), the model incurs slight variance and collinearity penalties among redundant features. In Simple Linear Regression, the single degree of freedom on $G2$ minimizes variance and achieves high test $R^2$ ($0.794$). However, Multiple Regression is necessary for early prediction when $G2$ is unavailable.

### Question 3: Why did you use Stratified K-Fold instead of standard K-Fold?
> **Answer**: The academic risk target is moderately imbalanced (130 At-Risk students vs 265 Passing students, approx 33% minority class). Standard random K-Fold can produce folds with varying class ratios, causing high variance in fold scores. Stratified K-Fold preserves the exact 33:67 class distribution across all $K$ folds, yielding statistically consistent evaluation.

### Question 4: What is the difference between Bagging and Random Forest?
> **Answer**: Both use bootstrap aggregation. However, in standard Bagging with Decision Trees, individual trees consider all $p$ features at every split. If one feature (like $G2$ or $G1$) is dominant, all trees will split on it first, making the trees correlated. Random Forest introduces **random feature subspace sampling** ($m \approx \sqrt{p}$ features evaluated per split), which decorrelates the trees, resulting in greater variance reduction when averaged.

### Question 5: How does the Expectation-Maximization (EM) algorithm in GMM differ from K-Means?
> **Answer**: K-Means uses hard assignment: each student belongs to exactly one cluster based on Euclidean distance to the nearest centroid. GMM assumes data is generated from a mixture of $K$ multivariate Gaussian distributions with unknown means and covariance matrices. In the **E-step**, it computes the posterior probability (responsibility) that each Gaussian generated student $i$. In the **M-step**, it updates the means, covariances, and mixing coefficients. This yields soft clustering probabilities.

### Question 6: What happens if a student has high absences but good exam grades? How does the model treat them?
> **Answer**: Our correlation analysis shows that absences have a weak correlation with final grade ($\approx 0.03$). Absences alone do not cause the model to predict academic failure. Past class failures and internal exam scores ($G1, G2$) have far higher feature importance. Absences primarily provide nuance in unsupervised clustering and borderline classification cases.

---

## 4. Marking Scheme Checklist (10/10 Defense Strategy)

| Component | Weight | Where Demonstrated in EduRisk AI | Status |
| :--- | :---: | :--- | :---: |
| **Data Preprocessing & EDA** | 1.5 Marks | `Data Explorer` tab: dimensions, null audit, correlation heatmap, distributions | Verified |
| **Regression Modeling** | 1.5 Marks | `Grade Prediction` tab: Simple vs Multiple LR, actual vs predicted, MAE/RMSE/R² | Verified |
| **Classification Modeling** | 1.5 Marks | `Academic Risk` tab: Logistic Regression, KNN, Naive Bayes, Confusion Matrices, ROC | Verified |
| **Clustering & Unsupervised** | 1.5 Marks | `Student Segments` tab: K-Means (Elbow & Silhouette), GMM, 2D PCA mapping | Verified |
| **Ensemble Learning** | 1.5 Marks | `Model Laboratory` tab: Bagging (5, 10, 50, 100), Base learners, Balanced RF | Verified |
| **Validation & Optimization** | 1.5 Marks | `Validation & Tuning` tab: 5/10-fold CV boxplots, GridSearchCV vs RandomizedSearch | Verified |
| **Interactive Application & Viva** | 1.0 Marks | `Student Risk Assessment` form & `Project Guide & Viva` tab with live demo | Verified |
