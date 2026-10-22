"""
EduRisk AI - Regression Module (Practical 2)
Implements Simple Linear Regression and Multiple Linear Regression to predict final grade G3.
Supports both Early Prediction (excluding G2) and Later Prediction (including G2).
"""

import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
try:
    from .data_processing import (
        build_preprocessor,
        get_train_test_data,
        TARGET_COL
    )
except ImportError:
    from data_processing import (
        build_preprocessor,
        get_train_test_data,
        TARGET_COL
    )


def train_simple_linear_regression(clean_df, early_prediction=False, random_state=42):
    """
    Trains Simple Linear Regression using the single strongest predictor.
    - Later mode (with G2): uses G2 as the sole predictor.
    - Early mode (without G2): uses G1 as the sole predictor (or studytime if G1 is also excluded).
    """
    predictor_col = "G1" if early_prediction else "G2"
    
    X_train, X_test, y_train, y_test, _ = get_train_test_data(
        clean_df, task="regression", early_prediction=early_prediction, random_state=random_state
    )
    
    # Extract only the single predictor
    X_train_single = X_train[[predictor_col]]
    X_test_single = X_test[[predictor_col]]
    
    model = LinearRegression()
    model.fit(X_train_single, y_train)
    
    y_pred_train = model.predict(X_train_single)
    y_pred_test = model.predict(X_test_single)
    
    metrics = {
        "model_name": f"Simple Linear Regression ({predictor_col})",
        "predictor": predictor_col,
        "slope": float(model.coef_[0]),
        "intercept": float(model.intercept_),
        "equation": f"G3 = {model.intercept_:.2f} + ({model.coef_[0]:.2f} × {predictor_col})",
        "test_mae": float(mean_absolute_error(y_test, y_pred_test)),
        "test_mse": float(mean_squared_error(y_test, y_pred_test)),
        "test_rmse": float(np.sqrt(mean_squared_error(y_test, y_pred_test))),
        "test_r2": float(r2_score(y_test, y_pred_test)),
        "train_r2": float(r2_score(y_train, y_pred_train)),
    }
    
    results = {
        "model": model,
        "metrics": metrics,
        "predictor": predictor_col,
        "y_test": y_test.values,
        "y_pred": y_pred_test,
        "X_test_raw": X_test_single[predictor_col].values,
    }
    return results


def train_multiple_linear_regression(clean_df, early_prediction=False, random_state=42):
    """
    Trains Multiple Linear Regression using all available student predictors.
    Uses ColumnTransformer inside a Scikit-Learn Pipeline to prevent data leakage.
    """
    X_train, X_test, y_train, y_test, feature_cols = get_train_test_data(
        clean_df, task="regression", early_prediction=early_prediction, random_state=random_state
    )
    
    preprocessor = build_preprocessor(feature_cols, scale_numeric=True)
    pipeline = Pipeline([
        ("preprocessor", preprocessor),
        ("regressor", LinearRegression())
    ])
    
    pipeline.fit(X_train, y_train)
    
    y_pred_train = pipeline.predict(X_train)
    y_pred_test = pipeline.predict(X_test)
    
    # Extract feature names and regression coefficients
    try:
        encoded_feature_names = pipeline.named_steps["preprocessor"].get_feature_names_out()
    except Exception:
        encoded_feature_names = [f"feat_{i}" for i in range(len(pipeline.named_steps["regressor"].coef_))]
        
    coefficients = pd.DataFrame({
        "feature": encoded_feature_names,
        "coefficient": pipeline.named_steps["regressor"].coef_
    }).sort_values(by="coefficient", key=abs, ascending=False)
    
    metrics = {
        "model_name": "Multiple Linear Regression",
        "mode": "Early Warning (No G2)" if early_prediction else "Full Term (With G2)",
        "features_count": len(feature_cols),
        "test_mae": float(mean_absolute_error(y_test, y_pred_test)),
        "test_mse": float(mean_squared_error(y_test, y_pred_test)),
        "test_rmse": float(np.sqrt(mean_squared_error(y_test, y_pred_test))),
        "test_r2": float(r2_score(y_test, y_pred_test)),
        "train_r2": float(r2_score(y_train, y_pred_train)),
    }
    
    results = {
        "pipeline": pipeline,
        "metrics": metrics,
        "coefficients": coefficients,
        "y_test": y_test.values,
        "y_pred": y_pred_test,
        "feature_cols": feature_cols,
    }
    return results


def compare_regression_models(clean_df, early_prediction=False):
    """
    Runs both Simple and Multiple Linear Regression and returns comparison DataFrame.
    """
    simple_res = train_simple_linear_regression(clean_df, early_prediction=early_prediction)
    multiple_res = train_multiple_linear_regression(clean_df, early_prediction=early_prediction)
    
    comparison = pd.DataFrame([
        {
            "Model": simple_res["metrics"]["model_name"],
            "MAE": round(simple_res["metrics"]["test_mae"], 3),
            "MSE": round(simple_res["metrics"]["test_mse"], 3),
            "RMSE": round(simple_res["metrics"]["test_rmse"], 3),
            "R² Score": round(simple_res["metrics"]["test_r2"], 3),
            "Train R²": round(simple_res["metrics"]["train_r2"], 3),
        },
        {
            "Model": multiple_res["metrics"]["model_name"],
            "MAE": round(multiple_res["metrics"]["test_mae"], 3),
            "MSE": round(multiple_res["metrics"]["test_mse"], 3),
            "RMSE": round(multiple_res["metrics"]["test_rmse"], 3),
            "R² Score": round(multiple_res["metrics"]["test_r2"], 3),
            "Train R²": round(multiple_res["metrics"]["train_r2"], 3),
        }
    ])
    return comparison, simple_res, multiple_res
