/**
 * EduRisk AI - Central API Client
 * Interfaces with FastAPI backend with environment-based configuration.
 */

import {
  DatasetSummary,
  EdaData,
  RegressionResponse,
  ClassificationResponse,
  ClusteringResponse,
  EnsemblesResponse,
  ValidationResponse,
  StudentInput,
  GradePredictionResult,
  RiskPredictionResult
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '' : 'http://127.0.0.1:8000');

async function fetchJson<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`API Error [${res.status}]: ${errorText || res.statusText}`);
    }
    return (await res.json()) as T;
  } catch (err: any) {
    console.error(`Failed request to ${url}:`, err);
    throw err;
  }
}

export const api = {
  checkHealth: () => fetchJson<{ status: string; system: string; version: string }>('/api/health'),

  getDatasetSummary: (course = 'mat') =>
    fetchJson<DatasetSummary>(`/api/dataset/summary?course=${course}`),

  getEdaData: (course = 'mat') =>
    fetchJson<EdaData>(`/api/dataset/eda?course=${course}`),

  getDatasetPreview: (course = 'mat', limit = 50) =>
    fetchJson<{ columns: string[]; records: any[]; total: number }>(
      `/api/dataset/preview?course=${course}&limit=${limit}`
    ),

  getRegressionModels: (course = 'mat', early = false) =>
    fetchJson<RegressionResponse>(`/api/models/regression?course=${course}&early=${early}`),

  predictGrade: (student: StudentInput, early = false) =>
    fetchJson<GradePredictionResult>(`/api/predict/grade?early=${early}`, {
      method: 'POST',
      body: JSON.stringify(student),
    }),

  getClassificationModels: (course = 'mat', early = false) =>
    fetchJson<ClassificationResponse>(`/api/models/classification?course=${course}&early=${early}`),

  predictRisk: (student: StudentInput, early = false) =>
    fetchJson<RiskPredictionResult>(`/api/predict/risk?early=${early}`, {
      method: 'POST',
      body: JSON.stringify(student),
    }),

  getClusteringModels: (course = 'mat', k = 3) =>
    fetchJson<ClusteringResponse>(`/api/models/clustering?course=${course}&k=${k}`),

  getEnsembleModels: (course = 'mat', early = false) =>
    fetchJson<EnsemblesResponse>(`/api/models/ensembles?course=${course}&early=${early}`),

  getValidationTuning: (course = 'mat', early = false) =>
    fetchJson<ValidationResponse>(`/api/models/validation?course=${course}&early=${early}`),
};
