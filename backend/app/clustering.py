"""
EduRisk AI - Clustering Module (Practicals 4 & 5)
Implements Unsupervised Learning for Student Segmentation:
- K-Means Clustering (Elbow Method K=1..12, Silhouette Scores, PCA 2D visualization)
- Gaussian Mixture Models (EM algorithm, 3/4/5 components, soft posterior probabilities)

CRITICAL RULE: G3 and academic_risk are NEVER used during clustering fit.
They are only used retrospectively to profile and interpret the discovered segments.
"""

import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.mixture import GaussianMixture
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn.metrics import silhouette_score


CLUSTERING_FEATURES = [
    "studytime", "failures", "absences", "G1",
    "freetime", "goout", "Dalc", "Walc",
    "Medu", "Fedu", "age", "famrel", "health"
]


def run_elbow_and_silhouette_analysis(df, k_range=range(1, 13)):
    """
    Computes Inertia (Sum of Squared Errors) for Elbow Method (K=1..12)
    and Silhouette Scores for K=2..12.
    """
    X_raw = df[CLUSTERING_FEATURES].copy()
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X_raw)
    
    inertias = []
    silhouette_scores_dict = {}
    
    for k in k_range:
        km = KMeans(n_clusters=k, random_state=42, n_init=10)
        km.fit(X_scaled)
        inertias.append(float(km.inertia_))
        
        if k >= 2:
            score = float(silhouette_score(X_scaled, km.labels_))
            silhouette_scores_dict[k] = score
            
    return {
        "k_values": list(k_range),
        "inertias": inertias,
        "silhouette_k_values": list(silhouette_scores_dict.keys()),
        "silhouette_scores": list(silhouette_scores_dict.values()),
        "scaler": scaler,
        "X_scaled": X_scaled
    }


def fit_kmeans(df, n_clusters=3, random_state=42):
    """
    Fits K-Means with specified cluster count.
    Generates PCA 2D projection and detailed cluster profiles.
    """
    X_raw = df[CLUSTERING_FEATURES].copy()
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X_raw)
    
    km = KMeans(n_clusters=n_clusters, random_state=random_state, n_init=10)
    cluster_labels = km.fit_predict(X_scaled)
    
    # 2D PCA for visual representation
    pca = PCA(n_components=2, random_state=random_state)
    pca_coords = pca.fit_transform(X_scaled)
    explained_var = pca.explained_variance_ratio_
    
    # Create enriched DataFrame with cluster assignment
    clustered_df = df.copy()
    clustered_df["cluster_kmeans"] = cluster_labels
    clustered_df["pca1"] = pca_coords[:, 0]
    clustered_df["pca2"] = pca_coords[:, 1]
    
    # Compute cluster profiles
    profile_cols = CLUSTERING_FEATURES.copy()
    if "G3" in df.columns:
        profile_cols.append("G3")
    if "academic_risk" in df.columns:
        profile_cols.append("academic_risk")
        
    profiles = clustered_df.groupby("cluster_kmeans")[profile_cols].mean().reset_index()
    counts = clustered_df["cluster_kmeans"].value_counts().sort_index()
    profiles.insert(1, "student_count", counts.values)
    profiles.insert(2, "percentage", (counts.values / len(df) * 100).round(1))
    
    silhouette = float(silhouette_score(X_scaled, cluster_labels)) if n_clusters >= 2 else 0.0
    
    return {
        "model": km,
        "scaler": scaler,
        "pca": pca,
        "explained_variance": explained_var,
        "cluster_labels": cluster_labels,
        "clustered_df": clustered_df,
        "profiles": profiles,
        "silhouette_score": silhouette,
        "n_clusters": n_clusters,
    }


def fit_gmm(df, n_components=3, random_state=42):
    """
    Fits Gaussian Mixture Model with Expectation-Maximization.
    Yields soft posterior membership probabilities and comparison metrics.
    """
    X_raw = df[CLUSTERING_FEATURES].copy()
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X_raw)
    
    gmm = GaussianMixture(n_components=n_components, covariance_type="full", random_state=random_state)
    gmm.fit(X_scaled)
    
    cluster_labels = gmm.predict(X_scaled)
    cluster_probs = gmm.predict_proba(X_scaled)
    
    pca = PCA(n_components=2, random_state=random_state)
    pca_coords = pca.fit_transform(X_scaled)
    
    clustered_df = df.copy()
    clustered_df["cluster_gmm"] = cluster_labels
    clustered_df["pca1"] = pca_coords[:, 0]
    clustered_df["pca2"] = pca_coords[:, 1]
    clustered_df["max_posterior_prob"] = cluster_probs.max(axis=1)
    
    profile_cols = CLUSTERING_FEATURES.copy()
    if "G3" in df.columns:
        profile_cols.append("G3")
    if "academic_risk" in df.columns:
        profile_cols.append("academic_risk")
        
    profiles = clustered_df.groupby("cluster_gmm")[profile_cols].mean().reset_index()
    counts = clustered_df["cluster_gmm"].value_counts().sort_index()
    profiles.insert(1, "student_count", counts.values)
    profiles.insert(2, "percentage", (counts.values / len(df) * 100).round(1))
    
    bic_val = float(gmm.bic(X_scaled))
    aic_val = float(gmm.aic(X_scaled))
    
    return {
        "model": gmm,
        "scaler": scaler,
        "pca": pca,
        "cluster_labels": cluster_labels,
        "cluster_probabilities": cluster_probs,
        "clustered_df": clustered_df,
        "profiles": profiles,
        "bic": bic_val,
        "aic": aic_val,
        "n_components": n_components,
    }


def compare_gmm_components(df, components_list=[3, 4, 5]):
    """
    Evaluates GMM across 3, 4, and 5 components reporting AIC and BIC.
    """
    X_raw = df[CLUSTERING_FEATURES].copy()
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X_raw)
    
    records = []
    for comp in components_list:
        gmm = GaussianMixture(n_components=comp, covariance_type="full", random_state=42)
        gmm.fit(X_scaled)
        labels = gmm.predict(X_scaled)
        sil = float(silhouette_score(X_scaled, labels)) if comp >= 2 else 0.0
        records.append({
            "Components (K)": comp,
            "AIC": round(float(gmm.aic(X_scaled)), 2),
            "BIC": round(float(gmm.bic(X_scaled)), 2),
            "Silhouette Score": round(sil, 4)
        })
        
    return pd.DataFrame(records)


if __name__ == "__main__":
    import os
    import sys
    sys.path.append(os.path.dirname(os.path.dirname(__file__)))
    from src.data_processing import load_raw_data, prepare_dataset

    print("=" * 60)
    print("EduRisk AI - Student Segmentation Engine (Practicals 4 & 5)")
    print("=" * 60)

    raw_data = load_raw_data("mat")
    clean_data = prepare_dataset(raw_data)
    print(f"Loaded {len(clean_data)} student records for unsupervised clustering.")

    print("\n1. Running K-Means (K=3)...")
    km_results = fit_kmeans(clean_data, n_clusters=3)
    print(f"Silhouette Score: {km_results['silhouette_score']:.4f}")
    print("Cluster Profiles (Mean Attribute Values):")
    cols = ["cluster_kmeans", "student_count", "percentage", "studytime", "failures", "absences", "G1", "G3"]
    print(km_results["profiles"][cols].to_string(index=False))

    print("\n2. Evaluating Gaussian Mixture Models across K = [3, 4, 5]...")
    gmm_table = compare_gmm_components(clean_data, [3, 4, 5])
    print(gmm_table.to_string(index=False))
    print("=" * 60)

