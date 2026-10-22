"""
EduRisk AI - Automated FastAPI Backend Test Suite
Tests all endpoints against genuine Scikit-Learn pipelines.
"""

import urllib.request
import json

BASE_URL = "http://127.0.0.1:8000"

def test_endpoint(name, path, method="GET", payload=None):
    url = f"{BASE_URL}{path}"
    req = urllib.request.Request(url, method=method)
    if payload:
        req.add_header('Content-Type', 'application/json')
        data = json.dumps(payload).encode('utf-8')
    else:
        data = None
        
    try:
        resp = urllib.request.urlopen(req, data=data)
        assert resp.status == 200, f"Status code {resp.status}"
        body = json.loads(resp.read().decode('utf-8'))
        print(f" PASS: {name} ({path})")
        return body
    except Exception as e:
        print(f" FAIL: {name} ({path}) - Error: {e}")
        raise e

def main():
    print("=" * 65)
    print("TESTING EDURISK AI FASTAPI BACKEND SUITE")
    print("=" * 65)
    
    # 1. Health
    test_endpoint("Health Check", "/api/health")
    
    # 2. Dataset Summary
    summary = test_endpoint("Dataset Summary", "/api/dataset/summary?course=mat")
    assert summary["total_records"] == 395
    assert summary["at_risk_count"] == 130
    
    # 3. EDA
    eda = test_endpoint("Exploratory Data Analysis", "/api/dataset/eda?course=mat")
    assert len(eda["grade_distribution"]) > 0
    assert len(eda["study_comparison"]) > 0
    
    # 4. Preview
    prev = test_endpoint("Dataset Preview", "/api/dataset/preview?course=mat&limit=10")
    assert len(prev["records"]) == 10
    
    # 5. Regression
    reg = test_endpoint("Regression Models", "/api/models/regression?course=mat&early=false")
    assert reg["multiple_metrics"]["test_r2"] > 0.65
    
    # 6. Predict Grade
    sample_student = {
        "school": "GP", "sex": "M", "age": 16, "address": "U", "famsize": "LE3",
        "Pstatus": "T", "Medu": 3, "Fedu": 3, "Mjob": "services", "Fjob": "other",
        "reason": "home", "guardian": "mother", "traveltime": 1, "studytime": 2,
        "failures": 0, "schoolsup": "no", "famsup": "yes", "paid": "no",
        "activities": "yes", "nursery": "yes", "higher": "yes", "internet": "yes",
        "romantic": "no", "famrel": 4, "freetime": 3, "goout": 2, "Dalc": 1,
        "Walc": 1, "health": 4, "absences": 2, "G1": 14, "G2": 15
    }
    pred_g = test_endpoint("Predict Student Grade", "/api/predict/grade?early=false", method="POST", payload=sample_student)
    assert 0 <= pred_g["predicted_g3"] <= 20
    
    # 7. Classification
    clf = test_endpoint("Classification Models", "/api/models/classification?course=mat&early=false")
    assert clf["models"]["Logistic Regression"]["metrics"]["accuracy"] > 0.85
    
    # 8. Predict Risk
    pred_r = test_endpoint("Predict Student Risk", "/api/predict/risk?early=false", method="POST", payload=sample_student)
    assert pred_r["risk_status"] in ["At Risk", "Not At Risk"]
    
    # 9. Clustering
    clust = test_endpoint("Clustering Models", "/api/models/clustering?course=mat&k=3")
    assert len(clust["cluster_profiles"]) == 3
    assert len(clust["pca_points"]) == 395
    
    # 10. Ensembles
    ens = test_endpoint("Ensemble Models", "/api/models/ensembles?course=mat&early=false")
    assert len(ens["overall_comparison"]) >= 6
    
    # 11. Validation & Tuning
    val = test_endpoint("Validation & Tuning", "/api/models/validation?course=mat&early=false")
    assert len(val["top_features"]) == 10
    
    print("\n" + "=" * 65)
    print("ALL 11 BACKEND API ENDPOINTS VERIFIED & PASSING!")
    print("=" * 65)

if __name__ == "__main__":
    main()
