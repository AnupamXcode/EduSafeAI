import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { EnsemblesResponse, ValidationResponse } from '../types';
import { api } from '../api/client';
import { Cpu, GitFork, Gauge, CheckCircle2, Clock, Sparkles } from 'lucide-react';

interface ModelLabPageProps {
  course: string;
}

export const ModelLabPage: React.FC<ModelLabPageProps> = ({ course }) => {
  const [ensembles, setEnsembles] = useState<EnsemblesResponse | null>(null);
  const [validation, setValidation] = useState<ValidationResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    Promise.all([api.getEnsembleModels(course, false), api.getValidationTuning(course, false)])
      .then(([ensRes, valRes]) => {
        if (isMounted) {
          setEnsembles(ensRes);
          setValidation(valRes);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [course]);

  return (
    <div className="space-y-8 pb-12">
      {/* Editorial Title */}
      <div className="border-b border-[#D9D2C3] pb-6">
        <h2 className="text-3xl font-normal text-[#244C3A] tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>
          Model Laboratory: Ensembles & Optimization
        </h2>
        <p className="text-sm text-[#332F2A] opacity-80 mt-1 max-w-3xl leading-relaxed">
          Evaluates variance reduction across <strong>Bootstrap Aggregation (Bagging)</strong> and <strong>Random Forest</strong> architectures.
          Tests hyperparameter search spaces using 5-Fold/10-Fold Stratified Cross-Validation, GridSearchCV, and RandomizedSearchCV.
        </p>
      </div>

      {/* Ensemble Architectures Comparison Table */}
      {ensembles && (
        <div className="panel bg-[#FFFFFF]">
          <div className="p-4 border-b border-[#D9D2C3] flex justify-between items-center">
            <div>
              <h3 className="text-base font-semibold text-[#244C3A]" style={{ fontFamily: 'var(--font-serif)' }}>
                Ensemble Architecture Benchmark
              </h3>
              <p className="text-xs text-[#332F2A] opacity-70">
                Comparison of base trees, bootstrap scaling, and class-weight balancing:
              </p>
            </div>
            <span className="badge-nominal">Ensemble Variance Reduction</span>
          </div>

          <div className="overflow-x-auto">
            <table className="academic-table">
              <thead>
                <tr>
                  <th>Model Architecture</th>
                  <th className="text-right">Accuracy</th>
                  <th className="text-right">Precision</th>
                  <th className="text-right text-[#C66B4E]">Recall</th>
                  <th className="text-right font-semibold">F1-Score</th>
                  <th className="text-right">ROC-AUC</th>
                </tr>
              </thead>
              <tbody>
                {ensembles.overall_comparison.map((row, idx) => (
                  <tr key={idx}>
                    <td className="font-semibold text-[#244C3A]">{row['Model Architecture']}</td>
                    <td className="text-right num">{(row.Accuracy * 100).toFixed(1)}%</td>
                    <td className="text-right num">{(row.Precision * 100).toFixed(1)}%</td>
                    <td className="text-right num font-semibold text-[#C66B4E]">
                      {(row.Recall * 100).toFixed(1)}%
                    </td>
                    <td className="text-right num font-semibold">{row['F1-Score'].toFixed(4)}</td>
                    <td className="text-right num">{row['ROC-AUC'].toFixed(4)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Estimator Scaling and Base Learner Charts */}
      {ensembles && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Estimator Scaling (6 cols) */}
          <div className="lg:col-span-6 panel p-6 bg-[#FFFFFF]">
            <div className="border-b border-[#D9D2C3] pb-3 mb-4">
              <h3 className="text-base font-semibold text-[#244C3A]" style={{ fontFamily: 'var(--font-serif)' }}>
                Bagging Estimator Scaling (5, 10, 50, 100 Trees)
              </h3>
              <p className="text-xs text-[#332F2A] opacity-75">
                Demonstrates how aggregating bootstrap replicas dampens variance:
              </p>
            </div>

            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={ensembles.estimator_scaling} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#D9D2C3" />
                  <XAxis dataKey="Estimators" tick={{ fill: '#332F2A', fontSize: 11 }} />
                  <YAxis domain={[0.8, 1.0]} tick={{ fill: '#332F2A', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #244C3A',
                      borderRadius: '0px',
                      fontSize: '11px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Line type="monotone" dataKey="Accuracy" stroke="#244C3A" strokeWidth={2} />
                  <Line type="monotone" dataKey="F1-Score" stroke="#C66B4E" strokeWidth={2} />
                  <Line type="monotone" dataKey="ROC-AUC" stroke="#A9B8A0" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Heterogeneous Base Learners (6 cols) */}
          <div className="lg:col-span-6 panel p-6 bg-[#FFFFFF]">
            <div className="border-b border-[#D9D2C3] pb-3 mb-4">
              <h3 className="text-base font-semibold text-[#244C3A]" style={{ fontFamily: 'var(--font-serif)' }}>
                Base Learner Comparison (20 Estimators)
              </h3>
              <p className="text-xs text-[#332F2A] opacity-75">
                Decision Tree vs KNN vs Logistic Regression as the base bagged estimator:
              </p>
            </div>

            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ensembles.base_learners} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#D9D2C3" vertical={false} />
                  <XAxis dataKey="Base Learner" tick={{ fill: '#332F2A', fontSize: 10 }} />
                  <YAxis domain={[0.5, 1.0]} tick={{ fill: '#332F2A', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #244C3A',
                      borderRadius: '0px',
                      fontSize: '11px',
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="Accuracy" fill="#244C3A" />
                  <Bar dataKey="Recall" fill="#C66B4E" />
                  <Bar dataKey="F1-Score" fill="#A9B8A0" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Hyperparameter Optimization & Feature Importances */}
      {validation && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Top Feature Importances (7 cols) */}
          <div className="lg:col-span-7 panel p-6 bg-[#FFFFFF]">
            <div className="border-b border-[#D9D2C3] pb-3 mb-4">
              <h3 className="text-base font-semibold text-[#244C3A]" style={{ fontFamily: 'var(--font-serif)' }}>
                Top Predictive Features (Optimized Random Forest)
              </h3>
              <p className="text-xs text-[#332F2A] opacity-75">
                Mean Decrease in Impurity (MDI) across all decision trees in the ensemble:
              </p>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={validation.top_features}
                  margin={{ top: 5, right: 20, left: 30, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#D9D2C3" horizontal={false} />
                  <XAxis type="number" tick={{ fill: '#332F2A', fontSize: 10 }} />
                  <YAxis type="category" dataKey="clean_feature" tick={{ fill: '#244C3A', fontSize: 11, fontWeight: 'bold' }} width={80} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #244C3A',
                      borderRadius: '0px',
                      fontSize: '11px',
                    }}
                  />
                  <Bar dataKey="importance" fill="#244C3A" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Hyperparameter Tuning & Cross-Validation Summary (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Tuning Search Summary */}
            <div className="panel p-5 bg-[#FFFFFF]">
              <div className="flex items-center justify-between border-b border-[#D9D2C3] pb-2 mb-3">
                <h3 className="text-sm font-semibold text-[#244C3A] uppercase tracking-wider">
                  Hyperparameter Optimization
                </h3>
                <Clock size={16} className="text-[#244C3A]" />
              </div>

              <div className="space-y-3">
                {validation.tuning_summary.map((t, idx) => (
                  <div key={idx} className="p-3 bg-[#F8F6F0] border border-[#D9D2C3] text-xs">
                    <div className="font-bold text-[#244C3A] mb-1">{t['Search Method']}</div>
                    <div className="text-[11px] text-[#332F2A] opacity-80 mb-1">
                      <strong>Best Params:</strong> <code>{t['Best Parameters']}</code>
                    </div>
                    <div className="flex justify-between font-semibold mt-2 pt-1 border-t border-[#D9D2C3]">
                      <span>Mean CV F1: {t['Best Mean CV F1']}</span>
                      <span className="num text-[#244C3A]">Time: {t['Search Time (s)']}s</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cross-Validation Distribution */}
            <div className="panel p-5 bg-[#FFFFFF]">
              <h3 className="text-sm font-semibold text-[#244C3A] uppercase tracking-wider mb-2 border-b border-[#D9D2C3] pb-2">
                Stratified K-Fold Stability
              </h3>
              <div className="space-y-2 text-xs">
                {validation.cross_validation_summary.map((cv, i) => (
                  <div key={i} className="flex justify-between py-1 border-b border-[#E6DCCB] last:border-none">
                    <span className="font-semibold text-[#332F2A]">{cv['Validation Strategy']}</span>
                    <span className="num font-bold text-[#244C3A]">
                      {cv['Mean F1'].toFixed(4)} &plusmn; {cv['Std Dev'].toFixed(4)}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-[11.5px] text-[#332F2A] opacity-75 mt-3 leading-relaxed">
                Stratified folds guarantee identical risk-class balance across every training slice, completely shielding against data leakage.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
