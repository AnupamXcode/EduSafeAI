/**
 * EduRisk AI - TypeScript Domain & API Definitions
 */

export interface DatasetSummary {
  course: string;
  file: string;
  total_records: number;
  total_attributes: number;
  missing_values: number;
  duplicate_records: number;
  numeric_features_count: number;
  categorical_features_count: number;
  g3_mean: number;
  g3_std: number;
  g3_min: number;
  g3_max: number;
  at_risk_count: number;
  not_at_risk_count: number;
  at_risk_percentage: number;
}

export interface EdaData {
  grade_distribution: Array<{
    grade: number;
    G1: number;
    G2: number;
    G3: number;
  }>;
  study_comparison: Array<{
    studytime: string;
    mean_g3: number;
    code: number;
  }>;
  absences_scatter: Array<{
    absences: number;
    g3: number;
    risk: string;
    studytime: number;
  }>;
  correlation_matrix: Record<string, Record<string, number>>;
  numerical_columns: string[];
}

export interface RegressionMetrics {
  model_name: string;
  predictor?: string;
  slope?: number;
  intercept?: number;
  equation?: string;
  test_mae: number;
  test_mse: number;
  test_rmse: number;
  test_r2: number;
  train_r2: number;
}

export interface RegressionResponse {
  mode: string;
  comparison: Array<{
    Model: string;
    MAE: number;
    MSE: number;
    RMSE: number;
    "R² Score": number;
    "Train R²": number;
  }>;
  simple_metrics: RegressionMetrics;
  multiple_metrics: RegressionMetrics;
  coefficients: Array<{
    feature: string;
    coefficient: number;
  }>;
  actual_vs_predicted: Array<{
    actual: number;
    predicted: number;
  }>;
  simple_regression_line: Array<{
    x: number;
    y: number;
  }>;
}

export interface ClassificationModelData {
  metrics: {
    accuracy: number;
    precision: number;
    recall: number;
    f1: number;
    roc_auc: number;
  };
  confusion_matrix: {
    raw: number[][];
    tn: number;
    fp: number;
    fn: number;
    tp: number;
  };
  roc_curve: Array<{
    fpr: number;
    tpr: number;
  }>;
}

export interface ClassificationResponse {
  mode: string;
  comparison_table: Array<{
    Model: string;
    Accuracy: number;
    "Precision (At Risk)": number;
    "Recall (At Risk)": number;
    "F1-Score": number;
    "ROC-AUC": number | string;
  }>;
  models: Record<string, ClassificationModelData>;
}

export interface ClusterProfile {
  cluster_kmeans: number;
  student_count: number;
  percentage: number;
  studytime: number;
  failures: number;
  absences: number;
  G1: number;
  G3: number;
  academic_risk: number;
}

export interface ClusteringResponse {
  k_selected: number;
  silhouette_score: number;
  explained_variance: number[];
  elbow_series: Array<{
    k: number;
    inertia: number;
  }>;
  silhouette_series: Array<{
    k: number;
    silhouette: number;
  }>;
  pca_points: Array<{
    pca1: number;
    pca2: number;
    cluster: number;
    g3: number;
    failures: number;
    studytime: number;
    absences: number;
  }>;
  cluster_profiles: ClusterProfile[];
  gmm_comparison: Array<{
    "Components (K)": number;
    AIC: number;
    BIC: number;
    "Silhouette Score": number;
  }>;
}

export interface EnsemblesResponse {
  mode: string;
  overall_comparison: Array<{
    "Model Architecture": string;
    Accuracy: number;
    Precision: number;
    Recall: number;
    "F1-Score": number;
    "ROC-AUC": number;
  }>;
  estimator_scaling: Array<{
    Estimators: number;
    Accuracy: number;
    Precision: number;
    Recall: number;
    "F1-Score": number;
    "ROC-AUC": number;
  }>;
  base_learners: Array<{
    "Base Learner": string;
    Accuracy: number;
    Precision: number;
    Recall: number;
    "F1-Score": number;
    "ROC-AUC": number;
  }>;
}

export interface ValidationResponse {
  cross_validation_summary: Array<{
    "Validation Strategy": string;
    "Mean F1": number;
    "Std Dev": number;
    "Min Score": number;
    "Max Score": number;
    Scores?: number[];
  }>;
  cv_5fold_scores: number[];
  cv_10fold_scores: number[];
  tuning_summary: Array<{
    "Search Method": string;
    "Best Parameters": string;
    "Best Mean CV F1": number;
    "Search Time (s)": number;
  }>;
  test_metrics: {
    accuracy: number;
    precision: number;
    recall: number;
    f1: number;
    roc_auc: number;
  };
  top_features: Array<{
    clean_feature: string;
    importance: number;
  }>;
}

export interface StudentInput {
  school: string;
  sex: string;
  age: number;
  address: string;
  famsize: string;
  Pstatus: string;
  Medu: number;
  Fedu: number;
  Mjob: string;
  Fjob: string;
  reason: string;
  guardian: string;
  traveltime: number;
  studytime: number;
  failures: number;
  schoolsup: string;
  famsup: string;
  paid: string;
  activities: string;
  nursery: string;
  higher: string;
  internet: string;
  romantic: string;
  famrel: number;
  freetime: number;
  goout: number;
  Dalc: number;
  Walc: number;
  health: number;
  absences: number;
  G1: number;
  G2?: number;
}

export interface GradePredictionResult {
  predicted_g3: number;
  scale: string;
  risk_status: string;
  expected_error_margin: number;
  drivers: string[];
}

export interface RiskPredictionResult {
  risk_code: number;
  risk_status: string;
  risk_probability: number;
  risk_level: string;
  recommendation: string;
}
