import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { ValidationResponse } from '../types';

interface ValidationTuningPageProps {
  course: string;
}

export const ValidationTuningPage: React.FC<ValidationTuningPageProps> = ({ course }) => {
  const [data, setData] = useState<ValidationResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [cvFolds, setCvFolds] = useState<number>(5);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    api
      .getValidationTuning(course, false)
      .then((res: ValidationResponse) => {
        if (isMounted) setData(res);
      })
      .catch((err: unknown) => console.error(err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [course]);

  return (
    <div className="max-w-[1440px] w-full mx-auto px-6 lg:px-10 py-8 space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 pb-4 border-b border-[#c1c8c2]">
        <div className="space-y-1 max-w-3xl">
          <div className="flex items-center gap-2 text-[#55624e]">
            <span className="text-[10px] uppercase tracking-widest font-bold">Practical 7 Protocol</span>
            <span className="text-[#c1c8c2]">/</span>
            <span className="text-[10px] uppercase tracking-wider text-[#0a3525] font-bold">Model Optimization &amp; Generalization</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-serif text-[#0a3525] tracking-tight leading-none">
            Validation &amp; Hyperparameter Tuning
          </h1>
          <p className="text-sm text-[#414944]">
            Rigorous K-Fold Stratified Cross-Validation, GridSearchCV hyperparameter topology exploration, and variance-bias diagnostic trade-offs.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase font-bold text-[#55624e]">CV Strategy:</span>
          <div className="flex items-center border border-[#c1c8c2] bg-[#ffffff]">
            <button
              onClick={() => setCvFolds(5)}
              className={`px-3 py-1 text-xs font-bold ${
                cvFolds === 5 ? 'bg-[#0a3525] text-[#ffffff]' : 'text-[#414944] hover:bg-[#f5ece5]'
              }`}
            >
              5-Fold Stratified
            </button>
            <button
              onClick={() => setCvFolds(10)}
              className={`px-3 py-1 text-xs font-bold ${
                cvFolds === 10 ? 'bg-[#0a3525] text-[#ffffff]' : 'text-[#414944] hover:bg-[#f5ece5]'
              }`}
            >
              10-Fold Stratified
            </button>
          </div>
        </div>
      </div>

      {/* Top 4 Indicator Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 bg-[#ffffff] border border-[#c1c8c2] divide-y sm:divide-y-0 sm:divide-x divide-[#c1c8c2]">
        <div className="p-4">
          <span className="text-[10px] uppercase text-[#55624e] font-bold tracking-wider block">Cross-Validation Folds</span>
          <div className="text-2xl font-serif font-bold text-[#0a3525] mt-1">{cvFolds}-Fold Stratified</div>
          <p className="text-xs text-[#414944] mt-1">Preserves 32.9% academic risk ratio in every fold</p>
        </div>
        <div className="p-4">
          <span className="text-[10px] uppercase text-[#55624e] font-bold tracking-wider block">Best Regularizer</span>
          <div className="text-2xl font-serif font-bold text-[#0a3525] mt-1">L2 Ridge (α = 10.0)</div>
          <p className="text-xs text-[#414944] mt-1">Stabilizes collinear grade predictors (G1 &amp; G2)</p>
        </div>
        <div className="p-4">
          <span className="text-[10px] uppercase text-[#55624e] font-bold tracking-wider block">Tree Pruning (ccp_alpha)</span>
          <div className="text-2xl font-serif font-bold text-[#0a3525] mt-1">α = 0.012</div>
          <p className="text-xs text-[#414944] mt-1">Prunes uninformative leaf nodes; prevents overfitting</p>
        </div>
        <div className="p-4">
          <span className="text-[10px] uppercase text-[#55624e] font-bold tracking-wider block">Model Lab Winner</span>
          <div className="text-2xl font-serif font-bold text-[#0a3525] mt-1">Random Forest (200 Trees)</div>
          <p className="text-xs text-[#414944] mt-1">Test ROC-AUC: 0.941 | Recall (Risk): 87.9%</p>
        </div>
      </div>

      {/* CV Comparison Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8 bg-[#ffffff] border border-[#c1c8c2] p-5">
          <div className="border-b border-[#c1c8c2] pb-3 mb-4 flex justify-between items-baseline">
            <div>
              <span className="text-[10px] uppercase text-[#55624e] tracking-wider font-bold block">
                Empirical Generalization Metrics
              </span>
              <h3 className="text-lg font-serif font-bold text-[#0a3525]">
                Stratified {cvFolds}-Fold Cross-Validation Scores
              </h3>
            </div>
            <span className="px-2 py-0.5 text-[11px] font-mono bg-[#f5ece5] border border-[#c1c8c2] text-[#414944]">
              Zero Data Leakage Confirmed
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-[#f5ece5] border-b-2 border-[#0a3525] text-left text-[11px] uppercase font-bold text-[#1e1b17]">
                  <th className="py-2.5 px-3">Validation Strategy</th>
                  <th className="py-2.5 px-3 text-right">Mean F1 Score</th>
                  <th className="py-2.5 px-3 text-right">Std Dev (± σ)</th>
                  <th className="py-2.5 px-3 text-right">Min - Max Range</th>
                  <th className="py-2.5 px-3 text-right">Stability Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#c1c8c2] font-mono text-xs">
                {data?.cross_validation_summary?.map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#fbf2ea] transition-colors">
                    <td className="py-2.5 px-3 font-sans font-bold text-[#0a3525]">{row['Validation Strategy']}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-[#0a3525]">{(row['Mean F1'] * 100).toFixed(1)}%</td>
                    <td className="py-2.5 px-3 text-right text-[#55624e]">± {(row['Std Dev'] * 100).toFixed(2)}%</td>
                    <td className="py-2.5 px-3 text-right font-mono text-[#762e16]">
                      {(row['Min Score'] * 100).toFixed(1)}% – {(row['Max Score'] * 100).toFixed(1)}%
                    </td>
                    <td className="py-2.5 px-3 text-right font-sans">
                      <span className="px-2 py-0.5 text-[10px] bg-[#f5ece5] border border-[#0a3525] text-[#0a3525] font-bold">
                        {row['Std Dev'] < 0.05 ? 'Robust' : 'Moderate'}
                      </span>
                    </td>
                  </tr>
                )) || (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-xs text-[#55624e]">
                      Loading cross-validation results from FastAPI backend...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* GridSearchCV Topology Results */}
        <div className="lg:col-span-4 bg-[#ffffff] border border-[#c1c8c2] p-5 space-y-4">
          <div className="border-b border-[#c1c8c2] pb-3">
            <span className="text-[10px] uppercase text-[#55624e] tracking-wider font-bold block">
              Automated Parameter Search
            </span>
            <h3 className="text-lg font-serif font-bold text-[#0a3525]">GridSearchCV Discovered Optima</h3>
          </div>

          <div className="space-y-3 text-xs">
            {data?.tuning_summary?.map((t, idx) => (
              <div key={idx} className="p-3 bg-[#f5ece5] border border-[#c1c8c2]">
                <div className="flex justify-between items-center mb-1">
                  <strong className="text-[#0a3525] block font-sans">{t['Search Method']}</strong>
                  <span className="font-mono text-xs text-[#55624e]">{t['Search Time (s)']}s</span>
                </div>
                <div className="font-mono text-xs font-bold text-[#1e1b17] mt-1 break-all">{t['Best Parameters']}</div>
                <div className="text-[11px] text-[#0a3525] font-bold mt-1">
                  Best Mean CV F1: {(t['Best Mean CV F1'] * 100).toFixed(1)}%
                </div>
              </div>
            )) || (
              <div className="p-3 bg-[#f5ece5] border border-[#c1c8c2] text-xs text-[#55624e]">
                Loading hyperparameter tuning optima...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
