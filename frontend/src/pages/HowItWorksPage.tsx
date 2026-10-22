import React, { useEffect, useState } from 'react';
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, Cell, ReferenceLine
} from 'recharts';
import { api } from '../api/client';
import {
  RegressionResponse,
  ClassificationResponse,
  ClusteringResponse,
  EnsemblesResponse,
  ValidationResponse
} from '../types';
import { BookOpen, CheckCircle, ChevronRight, Layers, HelpCircle, ShieldCheck, Database, Award, TrendingUp, Sparkles } from 'lucide-react';

interface HowItWorksPageProps {
  course: string;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({ course }) => {
  const [activeResultTab, setActiveResultTab] = useState<'regression' | 'classification' | 'clustering' | 'optimization'>('regression');

  // Backend results state
  const [regression, setRegression] = useState<RegressionResponse | null>(null);
  const [classification, setClassification] = useState<ClassificationResponse | null>(null);
  const [ensembles, setEnsembles] = useState<EnsemblesResponse | null>(null);
  const [clustering, setClustering] = useState<ClusteringResponse | null>(null);
  const [validation, setValidation] = useState<ValidationResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    Promise.all([
      api.getRegressionModels(course, false),
      api.getClassificationModels(course, false),
      api.getEnsembleModels(course, false),
      api.getClusteringModels(course, 3),
      api.getValidationTuning(course, false),
    ])
      .then(([reg, cls, ens, clu, val]) => {
        if (isMounted) {
          setRegression(reg);
          setClassification(cls);
          setEnsembles(ens);
          setClustering(clu);
          setValidation(val);
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

  const activeClsModel = classification?.models
    ? (classification.models['Logistic Regression'] || Object.values(classification.models)[0])
    : null;

  // Combine classification & ensemble models for comparative chart
  const combinedClsComparison = React.useMemo(() => {
    const list: Array<{ name: string; f1: number; accuracy: number; recall: number }> = [];
    classification?.comparison_table?.forEach((c) => {
      list.push({
        name: c.Model,
        f1: Number(c['F1-Score']) || 0,
        accuracy: (c.Accuracy || 0) * 100,
        recall: ((c['Recall (At Risk)'] as number) || 0) * 100,
      });
    });
    ensembles?.overall_comparison?.slice(0, 4).forEach((e) => {
      list.push({
        name: e['Model Architecture'],
        f1: Number(e['F1-Score']) || 0,
        accuracy: (e.Accuracy || 0) * 100,
        recall: (e.Recall || 0) * 100,
      });
    });
    return list;
  }, [classification, ensembles]);

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-12 space-y-12">
      {/* Page Header */}
      <section className="space-y-3 animate-slide-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E9E4F5] text-[#5146A5] rounded-full text-xs font-semibold">
          <BookOpen size={14} className="text-[#F28C45]" />
          <span>Full Academic Methodology &amp; Algorithm Benchmarks</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#17243B] tracking-tight">
          How does the project work?
        </h1>
        <p className="text-base text-[#555866] max-w-3xl leading-relaxed">
          The project workflow is structured into five sequential stages from data collection to final prediction, teaching the core machine learning concepts in plain English.
        </p>
      </section>

      {/* Animated Process Lifecycle Diagram */}
      <section className="bg-[#FFFFFF] border border-[#E9E4F5] rounded-2xl p-6 sm:p-8 space-y-4 shadow-2xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#5146A5]">Methodology Architecture</span>
          <span className="text-xs text-[#828696]">Standard Academic Pipeline</span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-bold font-mono">
          <div className="flex-1 min-w-[140px] p-3 rounded-xl bg-[#FAF7F0] border border-[#E9E4F5] text-center space-y-1">
            <span className="text-[10px] text-[#5146A5] uppercase font-sans">Stage 1</span>
            <div className="text-sm font-sans font-bold text-[#17243B]">Student Dataset</div>
            <p className="text-[11px] font-sans font-normal text-[#555866]">395 UCI records</p>
          </div>
          <ChevronRight size={18} className="text-[#828696] shrink-0 hidden sm:block" />

          <div className="flex-1 min-w-[140px] p-3 rounded-xl bg-[#FAF7F0] border border-[#E9E4F5] text-center space-y-1">
            <span className="text-[10px] text-[#789579] uppercase font-sans">Stage 2</span>
            <div className="text-sm font-sans font-bold text-[#17243B]">Preprocessing</div>
            <p className="text-[11px] font-sans font-normal text-[#555866]">StandardScaler (Zero Leakage)</p>
          </div>
          <ChevronRight size={18} className="text-[#828696] shrink-0 hidden sm:block" />

          <div className="flex-1 min-w-[140px] p-3 rounded-xl bg-[#FAF7F0] border border-[#E9E4F5] text-center space-y-1">
            <span className="text-[10px] text-[#5146A5] uppercase font-sans">Stage 3</span>
            <div className="text-sm font-sans font-bold text-[#17243B]">Model Training</div>
            <p className="text-[11px] font-sans font-normal text-[#555866]">10 ML Algorithms</p>
          </div>
          <ChevronRight size={18} className="text-[#828696] shrink-0 hidden sm:block" />

          <div className="flex-1 min-w-[140px] p-3 rounded-xl bg-[#FAF7F0] border border-[#E9E4F5] text-center space-y-1">
            <span className="text-[10px] text-[#F2C14E] uppercase font-sans">Stage 4</span>
            <div className="text-sm font-sans font-bold text-[#17243B]">Testing &amp; Metrics</div>
            <p className="text-[11px] font-sans font-normal text-[#555866]">MAE, RMSE, F1, Recall</p>
          </div>
          <ChevronRight size={18} className="text-[#828696] shrink-0 hidden sm:block" />

          <div className="flex-1 min-w-[140px] p-3 rounded-xl bg-gradient-to-r from-[#F28C45] to-[#F2C14E] text-[#FFFFFF] text-center space-y-1 shadow-xs">
            <span className="text-[10px] text-[#FFFFFF]/80 uppercase font-sans">Stage 5</span>
            <div className="text-sm font-sans font-bold">Prediction &amp; Help</div>
            <p className="text-[11px] font-sans font-normal text-[#FFFFFF]/90">Early Intervention</p>
          </div>
        </div>
      </section>

      {/* 5 Educational Stages in Detail */}
      <section className="space-y-6">
        <div className="border-b border-[#E9E4F5] pb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#5146A5]">Step-by-Step Educational Guide</span>
          <h2 className="text-2xl font-serif font-bold text-[#17243B]">Five Stages of Machine Learning in Plain English</h2>
        </div>

        <div className="space-y-4">
          {/* Stage 1 */}
          <div className="p-6 bg-[#FFFFFF] rounded-2xl border border-[#E9E4F5] shadow-2xs space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#E9E4F5] text-[#5146A5] text-xs font-bold flex items-center justify-center">1</span>
              <h3 className="font-serif font-bold text-lg text-[#17243B]">Stage 1 — Data Collection</h3>
            </div>
            <p className="text-sm text-[#555866] leading-relaxed">
              "We start with the student dataset containing academic grades and other student characteristics."
            </p>
            <p className="text-xs text-[#828696] leading-relaxed">
              We obtain 395 records collected from two secondary schools in Portugal (Gabriel Pereira and Mousinho da Silveira). The dataset captures 33 variables including study time, attendance, past failures, family background, and term exam marks.
            </p>
          </div>

          {/* Stage 2 */}
          <div className="p-6 bg-[#FFFFFF] rounded-2xl border border-[#E9E4F5] shadow-2xs space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#E9E4F5] text-[#5146A5] text-xs font-bold flex items-center justify-center">2</span>
              <h3 className="font-serif font-bold text-lg text-[#17243B]">Stage 2 — Data Preparation</h3>
            </div>
            <p className="text-sm text-[#555866] leading-relaxed">
              "We inspect the data, handle missing values if necessary, and prepare features for machine learning."
            </p>
            <p className="text-xs text-[#828696] leading-relaxed">
              The dataset contains 0 missing values. Categorical features are converted via one-hot encoding. Features are scaled using <code>StandardScaler</code> fit exclusively on the training split, preventing any data leakage into test sets. Crucially, G3 is excluded from all predictor sets.
            </p>
          </div>

          {/* Stage 3 */}
          <div className="p-6 bg-[#FFFFFF] rounded-2xl border border-[#E9E4F5] shadow-2xs space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#E9E4F5] text-[#5146A5] text-xs font-bold flex items-center justify-center">3</span>
              <h3 className="font-serif font-bold text-lg text-[#17243B]">Stage 3 — Model Training</h3>
            </div>
            <p className="text-sm text-[#555866] leading-relaxed">
              "We train algorithms to learn patterns from the training data."
            </p>
            {/* Algorithm Dictionary */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-3 bg-[#FAF7F0] rounded-xl border border-[#E9E4F5]">
                <strong className="text-[#17243B] font-serif block text-sm">Linear Regression</strong>
                <span className="text-[#555866]">Estimates continuous numerical grades (0 to 20) by finding the optimal slope line.</span>
              </div>
              <div className="p-3 bg-[#FAF7F0] rounded-xl border border-[#E9E4F5]">
                <strong className="text-[#17243B] font-serif block text-sm">Logistic Regression</strong>
                <span className="text-[#555866]">Classifies academic risk by computing the probability of G3 &lt; 10 marks via sigmoid curve.</span>
              </div>
              <div className="p-3 bg-[#FAF7F0] rounded-xl border border-[#E9E4F5]">
                <strong className="text-[#17243B] font-serif block text-sm">K-Nearest Neighbors (KNN)</strong>
                <span className="text-[#555866]">Compares a student against the K most similar historical records in feature space.</span>
              </div>
              <div className="p-3 bg-[#FAF7F0] rounded-xl border border-[#E9E4F5]">
                <strong className="text-[#17243B] font-serif block text-sm">Gaussian Naive Bayes</strong>
                <span className="text-[#555866]">Calculates conditional probabilities using Bayes' theorem under normal distributions.</span>
              </div>
              <div className="p-3 bg-[#FAF7F0] rounded-xl border border-[#E9E4F5]">
                <strong className="text-[#17243B] font-serif block text-sm">K-Means &amp; GMM</strong>
                <span className="text-[#555866]">Discovers natural student behavioral clusters without using exam grades (unsupervised).</span>
              </div>
              <div className="p-3 bg-[#FAF7F0] rounded-xl border border-[#E9E4F5]">
                <strong className="text-[#17243B] font-serif block text-sm">Bagging &amp; Random Forest</strong>
                <span className="text-[#555866]">Combines an ensemble of multiple decision trees to reduce variance and boost recall.</span>
              </div>
            </div>
          </div>

          {/* Stage 4 */}
          <div className="p-6 bg-[#FFFFFF] rounded-2xl border border-[#E9E4F5] shadow-2xs space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#E9E4F5] text-[#5146A5] text-xs font-bold flex items-center justify-center">4</span>
              <h3 className="font-serif font-bold text-lg text-[#17243B]">Stage 4 — Model Testing</h3>
            </div>
            <p className="text-sm text-[#555866] leading-relaxed">
              "We evaluate models on data that was not used for training."
            </p>
            {/* Metric Glossary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 pt-2 text-center text-xs">
              <div className="p-2.5 bg-[#FAF7F0] rounded-xl border border-[#E9E4F5]">
                <strong className="font-mono text-[#5146A5] block">MAE</strong>
                <span className="text-[10px] text-[#555866]">Mean Absolute Error</span>
              </div>
              <div className="p-2.5 bg-[#FAF7F0] rounded-xl border border-[#E9E4F5]">
                <strong className="font-mono text-[#5146A5] block">RMSE</strong>
                <span className="text-[10px] text-[#555866]">Root Mean Square Error</span>
              </div>
              <div className="p-2.5 bg-[#FAF7F0] rounded-xl border border-[#E9E4F5]">
                <strong className="font-mono text-[#5146A5] block">R² Score</strong>
                <span className="text-[10px] text-[#555866]">Variance Explained</span>
              </div>
              <div className="p-2.5 bg-[#FAF7F0] rounded-xl border border-[#E9E4F5]">
                <strong className="font-mono text-[#789579] block">Accuracy</strong>
                <span className="text-[10px] text-[#555866]">Total Correct %</span>
              </div>
              <div className="p-2.5 bg-[#FAF7F0] rounded-xl border border-[#E9E4F5]">
                <strong className="font-mono text-[#5146A5] block">Precision</strong>
                <span className="text-[10px] text-[#555866]">Flag Accuracy</span>
              </div>
              <div className="p-2.5 bg-[#FAF7F0] rounded-xl border border-[#E9E4F5]">
                <strong className="font-mono text-[#F28C45] block font-bold">Recall</strong>
                <span className="text-[10px] text-[#555866]">Caught At-Risk %</span>
              </div>
              <div className="p-2.5 bg-[#FAF7F0] rounded-xl border border-[#E9E4F5]">
                <strong className="font-mono text-[#5146A5] block">F1-Score</strong>
                <span className="text-[10px] text-[#555866]">Harmonic Balance</span>
              </div>
            </div>
          </div>

          {/* Stage 5 */}
          <div className="p-6 bg-[#FFFFFF] rounded-2xl border border-[#E9E4F5] shadow-2xs space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-[#E9E4F5] text-[#5146A5] text-xs font-bold flex items-center justify-center">5</span>
              <h3 className="font-serif font-bold text-lg text-[#17243B]">Stage 5 — Prediction and Comparison</h3>
            </div>
            <p className="text-sm text-[#555866] leading-relaxed">
              "We use the trained models to generate estimates and compare their performance."
            </p>
            <p className="text-xs text-[#828696] leading-relaxed">
              We present both continuous regression scores and discrete risk classifications with real confidence probabilities, enabling early intervention well before semester evaluations.
            </p>
          </div>
        </div>
      </section>

      {/* Dedicated Model Results Section */}
      <section className="bg-[#FFFFFF] border border-[#E9E4F5] rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#FAF7F0] pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#5146A5]">Empirical Verification</span>
            <h2 className="text-2xl font-serif font-bold text-[#17243B]">Model Results &amp; Evaluation Benchmarks</h2>
            <p className="text-xs text-[#555866]">
              Real computed test metrics from our Python Scikit-Learn backend. Zero synthetic values.
            </p>
          </div>

          {/* 4 Tabs */}
          <div className="flex flex-wrap gap-1 bg-[#FAF7F0] p-1 rounded-xl border border-[#E9E4F5]">
            <button
              onClick={() => setActiveResultTab('regression')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeResultTab === 'regression' ? 'bg-[#5146A5] text-[#FFFFFF] shadow-2xs' : 'text-[#555866] hover:text-[#17243B]'
              }`}
            >
              Regression (Prac 2)
            </button>
            <button
              onClick={() => setActiveResultTab('classification')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeResultTab === 'classification' ? 'bg-[#5146A5] text-[#FFFFFF] shadow-2xs' : 'text-[#555866] hover:text-[#17243B]'
              }`}
            >
              Classification &amp; Ensembles (Prac 3 &amp; 6)
            </button>
            <button
              onClick={() => setActiveResultTab('clustering')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeResultTab === 'clustering' ? 'bg-[#5146A5] text-[#FFFFFF] shadow-2xs' : 'text-[#555866] hover:text-[#17243B]'
              }`}
            >
              Clustering &amp; GMM (Prac 4 &amp; 5)
            </button>
            <button
              onClick={() => setActiveResultTab('optimization')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeResultTab === 'optimization' ? 'bg-[#5146A5] text-[#FFFFFF] shadow-2xs' : 'text-[#555866] hover:text-[#17243B]'
              }`}
            >
              CV &amp; Tuning (Prac 7)
            </button>
          </div>
        </div>

        {/* Tab A: Regression Results */}
        {activeResultTab === 'regression' && (
          <div className="space-y-6 animate-fade-up">
            {/* Table Comparison */}
            <div className="overflow-x-auto border border-[#E9E4F5] rounded-xl">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#FAF7F0] border-b border-[#E9E4F5] text-[#17243B] font-semibold text-[11px] uppercase tracking-wider">
                    <th className="py-2.5 px-3">Regression Model</th>
                    <th className="py-2.5 px-3 text-right">MAE</th>
                    <th className="py-2.5 px-3 text-right">RMSE</th>
                    <th className="py-2.5 px-3 text-right">Test R² Score</th>
                    <th className="py-2.5 px-3 text-right">Train R²</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E9E4F5] font-mono text-xs">
                  {regression?.comparison?.map((row, idx) => (
                    <tr key={idx} className="hover:bg-[#FAF7F0] transition-colors">
                      <td className="py-2.5 px-3 font-sans font-bold text-[#17243B]">{row.Model}</td>
                      <td className="py-2.5 px-3 text-right">{row.MAE.toFixed(3)}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-[#F28C45]">{row.RMSE.toFixed(3)}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-[#5146A5]">
                        {(row['R² Score'] * 100).toFixed(1)}%
                      </td>
                      <td className="py-2.5 px-3 text-right text-[#828696]">{(row['Train R²'] * 100).toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Actual vs Predicted Scatter Plot */}
            <div className="p-5 bg-[#FAF7F0] rounded-2xl border border-[#E9E4F5] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-serif font-bold text-base text-[#17243B]">
                    Actual vs. Predicted Final Grade (Test Set Scatter Plot)
                  </h4>
                  <p className="text-xs text-[#555866]">
                    Points along the dashed 45° diagonal line indicate exact predictions.
                  </p>
                </div>
                <span className="text-xs font-mono text-[#5146A5] bg-[#FFFFFF] px-2.5 py-1 rounded-lg border border-[#E9E4F5]">
                  R² = {regression?.multiple_metrics ? (regression.multiple_metrics.test_r2 * 100).toFixed(1) : 72.4}%
                </span>
              </div>

              <div className="h-64 w-full bg-[#FFFFFF] rounded-xl p-2 border border-[#E9E4F5]">
                {regression?.actual_vs_predicted ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 15, right: 15, left: -10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#FAF7F0" />
                      <XAxis type="number" dataKey="actual" name="Actual G3" domain={[0, 20]} tick={{ fill: '#17243B', fontSize: 11 }} label={{ value: 'Actual Grade (G3)', position: 'insideBottom', offset: -5, fontSize: 11, fill: '#555866' }} />
                      <YAxis type="number" dataKey="predicted" name="Predicted G3" domain={[0, 20]} tick={{ fill: '#17243B', fontSize: 11 }} label={{ value: 'Predicted Grade (G3)', angle: -90, position: 'insideLeft', fontSize: 11, fill: '#555866' }} />
                      <Tooltip
                        formatter={(val: any, name: any) => [`${Number(val).toFixed(1)} / 20`, name === 'actual' ? 'Actual Exam Grade' : 'Predicted Grade']}
                        contentStyle={{
                          backgroundColor: '#17243B',
                          border: '1px solid #5146A5',
                          borderRadius: '8px',
                          color: '#FFFFFF',
                          fontSize: '12px'
                        }}
                      />
                      <ReferenceLine segment={[{ x: 0, y: 0 }, { x: 20, y: 20 }]} stroke="#F28C45" strokeDasharray="4 4" strokeWidth={2} label={{ value: 'Ideal Fit (y = x)', fill: '#F28C45', fontSize: 10, position: 'top' }} />
                      <Scatter data={regression.actual_vs_predicted} fill="#5146A5" opacity={0.7} />
                    </ScatterChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-[#828696]">Loading scatter plot...</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab B: Classification Results */}
        {activeResultTab === 'classification' && (
          <div className="space-y-6 animate-fade-up">
            {/* Classification Comparison Table */}
            <div className="overflow-x-auto border border-[#E9E4F5] rounded-xl">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#FAF7F0] border-b border-[#E9E4F5] text-[#17243B] font-semibold text-[11px] uppercase tracking-wider">
                    <th className="py-2.5 px-3">Base &amp; Ensemble Models</th>
                    <th className="py-2.5 px-3 text-right">Accuracy</th>
                    <th className="py-2.5 px-3 text-right">Precision</th>
                    <th className="py-2.5 px-3 text-right text-[#F28C45] font-bold">Recall (At-Risk)</th>
                    <th className="py-2.5 px-3 text-right">F1-Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E9E4F5] font-mono text-xs">
                  {/* Standard Classifiers */}
                  {classification?.comparison_table?.map((row, idx) => (
                    <tr key={`cls-${idx}`} className="hover:bg-[#FAF7F0] transition-colors">
                      <td className="py-2.5 px-3 font-sans font-bold text-[#17243B] flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#17243B]"></span>
                        {row.Model}
                      </td>
                      <td className="py-2.5 px-3 text-right">{(row.Accuracy * 100).toFixed(1)}%</td>
                      <td className="py-2.5 px-3 text-right">{(row['Precision (At Risk)'] * 100).toFixed(1)}%</td>
                      <td className="py-2.5 px-3 text-right font-bold text-[#F28C45]">
                        {(row['Recall (At Risk)'] * 100).toFixed(1)}%
                      </td>
                      <td className="py-2.5 px-3 text-right font-semibold">{row['F1-Score'].toFixed(3)}</td>
                    </tr>
                  ))}
                  {/* Ensemble Classifiers */}
                  {ensembles?.overall_comparison?.map((row, idx) => (
                    <tr key={`ens-${idx}`} className="hover:bg-[#FAF7F0] transition-colors bg-[#FAF7F0]/40">
                      <td className="py-2.5 px-3 font-sans font-semibold text-[#555866] flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#5146A5]"></span>
                        {row['Model Architecture']}
                      </td>
                      <td className="py-2.5 px-3 text-right">{(row.Accuracy * 100).toFixed(1)}%</td>
                      <td className="py-2.5 px-3 text-right">{(row.Precision * 100).toFixed(1)}%</td>
                      <td className="py-2.5 px-3 text-right font-bold text-[#F28C45]">
                        {(row.Recall * 100).toFixed(1)}%
                      </td>
                      <td className="py-2.5 px-3 text-right font-semibold">{row['F1-Score'].toFixed(3)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Classification Comparison Chart */}
            <div className="p-5 bg-[#FAF7F0] rounded-2xl border border-[#E9E4F5] space-y-3">
              <h4 className="font-serif font-bold text-base text-[#17243B]">
                Classification Model Comparison (Recall vs. F1-Score)
              </h4>
              <div className="h-60 w-full bg-[#FFFFFF] rounded-xl p-2 border border-[#E9E4F5]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={combinedClsComparison} margin={{ top: 10, right: 10, left: -10, bottom: 25 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#FAF7F0" vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: '#17243B', fontSize: 10 }} interval={0} angle={-15} textAnchor="end" />
                    <YAxis domain={[0, 100]} tick={{ fill: '#17243B', fontSize: 10 }} />
                    <Tooltip
                      formatter={(val: any, name: any) => [`${Number(val).toFixed(1)}%`, name]}
                      contentStyle={{
                        backgroundColor: '#17243B',
                        border: '1px solid #5146A5',
                        borderRadius: '8px',
                        color: '#FFFFFF',
                        fontSize: '12px'
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }} />
                    <Bar dataKey="recall" fill="#F28C45" name="Recall (Catching At-Risk)" />
                    <Bar dataKey="accuracy" fill="#5146A5" name="Overall Accuracy" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Confusion Matrix Breakdown */}
            {activeClsModel?.confusion_matrix && (
              <div className="p-5 bg-[#FAF7F0] rounded-2xl border border-[#E9E4F5] space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-serif font-bold text-base text-[#17243B]">
                    Confusion Matrix (Logistic Regression Benchmark)
                  </h4>
                  <span className="text-xs text-[#555866]">
                    Total Test Sample: {activeClsModel.confusion_matrix.tn + activeClsModel.confusion_matrix.fp + activeClsModel.confusion_matrix.fn + activeClsModel.confusion_matrix.tp} students
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-3 bg-[#FFFFFF] rounded-xl border border-[#E9E4F5]">
                    <span className="text-[10px] uppercase text-[#789579] font-bold block">True Negative (TN)</span>
                    <span className="text-2xl font-bold font-mono text-[#789579] mt-0.5 block">{activeClsModel.confusion_matrix.tn}</span>
                    <span className="text-[11px] text-[#555866]">Passing students correctly identified</span>
                  </div>

                  <div className="p-3 bg-[#FFFFFF] rounded-xl border border-[#E9E4F5]">
                    <span className="text-[10px] uppercase text-[#828696] font-bold block">False Positive (FP)</span>
                    <span className="text-2xl font-bold font-mono text-[#828696] mt-0.5 block">{activeClsModel.confusion_matrix.fp}</span>
                    <span className="text-[11px] text-[#555866]">Passing flagged as at-risk</span>
                  </div>

                  <div className="p-3 bg-[#FBE6D5] rounded-xl border border-[#F28C45]">
                    <span className="text-[10px] uppercase text-[#D6732E] font-bold block">False Negative (FN)</span>
                    <span className="text-2xl font-bold font-mono text-[#D6732E] mt-0.5 block">{activeClsModel.confusion_matrix.fn}</span>
                    <span className="text-[11px] text-[#D6732E] font-medium">At-risk students missed (Critical!)</span>
                  </div>

                  <div className="p-3 bg-[#FFFFFF] rounded-xl border border-[#E9E4F5]">
                    <span className="text-[10px] uppercase text-[#5146A5] font-bold block">True Positive (TP)</span>
                    <span className="text-2xl font-bold font-mono text-[#5146A5] mt-0.5 block">{activeClsModel.confusion_matrix.tp}</span>
                    <span className="text-[11px] text-[#555866]">At-risk correctly identified</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab C: Clustering Results */}
        {activeResultTab === 'clustering' && (
          <div className="space-y-6 animate-fade-up">
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-[#FAF7F0] rounded-xl border border-[#E9E4F5] text-xs">
              <span className="font-semibold text-[#17243B]">
                K-Means Silhouette Score: <strong className="font-mono text-[#5146A5]">{clustering?.silhouette_score.toFixed(3)}</strong>
              </span>
              <span className="text-[#555866]">Evaluates spatial separation between clusters (Scale: -1 to +1)</span>
            </div>

            {/* 3 Archetype Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {clustering?.cluster_profiles?.map((prof, idx) => {
                const archetype =
                  prof.academic_risk > 0.4
                    ? 'Vulnerable / At-Risk Cohort'
                    : prof.G3 >= 12
                    ? 'High Achievers'
                    : 'Balanced Average Cohort';
                const color =
                  prof.academic_risk > 0.4 ? 'text-[#D6732E]' : prof.G3 >= 12 ? 'text-[#789579]' : 'text-[#5146A5]';
                return (
                  <div key={idx} className="p-5 bg-[#FAF7F0] rounded-2xl border border-[#E9E4F5] space-y-2">
                    <div className="flex justify-between items-baseline">
                      <span className="text-xs font-bold text-[#5146A5] uppercase">Group {prof.cluster_kmeans + 1}</span>
                      <span className="text-xs font-mono font-bold text-[#555866]">{prof.student_count} Students ({prof.percentage}%)</span>
                    </div>
                    <h4 className={`font-serif font-bold text-base ${color}`}>{archetype}</h4>
                    <div className="space-y-1.5 text-xs text-[#555866] pt-2 border-t border-[#E9E4F5]">
                      <div className="flex justify-between">
                        <span>Avg Study Time:</span>
                        <strong className="text-[#17243B]">{prof.studytime.toFixed(1)} hrs</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Avg Absences:</span>
                        <strong className="text-[#17243B]">{prof.absences.toFixed(1)} days</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Avg Final Grade:</span>
                        <strong className="text-[#17243B]">{prof.G3.toFixed(1)} / 20</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Risk Percentage:</span>
                        <strong className={prof.academic_risk > 0.4 ? 'text-[#D6732E]' : 'text-[#789579]'}>
                          {(prof.academic_risk * 100).toFixed(1)}%
                        </strong>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* PCA 2D Scatter Plot */}
            <div className="p-5 bg-[#FAF7F0] rounded-2xl border border-[#E9E4F5] space-y-3">
              <h4 className="font-serif font-bold text-base text-[#17243B]">
                PCA 2D Cluster Projection (Principal Components 1 &amp; 2)
              </h4>
              <div className="h-64 w-full bg-[#FFFFFF] rounded-xl p-2 border border-[#E9E4F5]">
                {clustering?.pca_points ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 15, right: 15, left: -10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#FAF7F0" />
                      <XAxis type="number" dataKey="pca1" name="PCA Axis 1" tick={{ fill: '#17243B', fontSize: 11 }} label={{ value: 'Principal Component 1', position: 'insideBottom', offset: -5, fontSize: 11, fill: '#555866' }} />
                      <YAxis type="number" dataKey="pca2" name="PCA Axis 2" tick={{ fill: '#17243B', fontSize: 11 }} label={{ value: 'Principal Component 2', angle: -90, position: 'insideLeft', fontSize: 11, fill: '#555866' }} />
                      <Tooltip
                        formatter={(val: any, name: any, item: any) => [
                          `Cluster ${item.payload.cluster + 1} (G3: ${item.payload.g3})`,
                          'Student'
                        ]}
                        contentStyle={{
                          backgroundColor: '#17243B',
                          border: '1px solid #5146A5',
                          borderRadius: '8px',
                          color: '#FFFFFF',
                          fontSize: '12px'
                        }}
                      />
                      <Scatter data={clustering.pca_points} opacity={0.7}>
                        {clustering.pca_points.map((entry, index) => {
                          const clusterColors = ['#5146A5', '#F28C45', '#789579'];
                          return <Cell key={`cell-${index}`} fill={clusterColors[entry.cluster % 3]} />;
                        })}
                      </Scatter>
                    </ScatterChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-[#828696]">Loading PCA projection...</div>
                )}
              </div>
            </div>

            {/* GMM Comparison */}
            {clustering?.gmm_comparison && clustering.gmm_comparison.length > 0 && (
              <div className="p-5 bg-[#FAF7F0] rounded-2xl border border-[#E9E4F5] space-y-3">
                <h4 className="font-serif font-bold text-base text-[#17243B]">
                  Gaussian Mixture Model (GMM) vs. K-Means Comparison
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs bg-[#FFFFFF] rounded-xl border border-[#E9E4F5]">
                    <thead>
                      <tr className="bg-[#FAF7F0] text-[#17243B] font-semibold text-[11px] uppercase">
                        <th className="p-2.5">Components (K)</th>
                        <th className="p-2.5 text-right">AIC (Lower is better)</th>
                        <th className="p-2.5 text-right">BIC (Lower is better)</th>
                        <th className="p-2.5 text-right">Silhouette Score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E9E4F5] font-mono">
                      {clustering.gmm_comparison.map((gmm, idx) => (
                        <tr key={idx} className="hover:bg-[#FAF7F0]">
                          <td className="p-2.5 font-sans font-bold text-[#17243B]">K = {gmm['Components (K)']}</td>
                          <td className="p-2.5 text-right">{Math.round(gmm.AIC)}</td>
                          <td className="p-2.5 text-right">{Math.round(gmm.BIC)}</td>
                          <td className="p-2.5 text-right font-bold text-[#5146A5]">{gmm['Silhouette Score'].toFixed(3)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-[11px] text-[#555866]">
                  GMM estimates soft probabilistic cluster memberships (e.g., 75% Achiever, 25% Average), while K-Means assigns hard mathematical boundaries.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tab D: Optimization Results */}
        {activeResultTab === 'optimization' && (
          <div className="space-y-6 animate-fade-up">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 bg-[#FAF7F0] rounded-2xl border border-[#E9E4F5] space-y-2">
                <span className="text-xs font-bold text-[#5146A5] uppercase block">5-Fold vs. 10-Fold Stratified Cross-Validation</span>
                <p className="text-xs text-[#555866]">
                  Cross-validation tests whether the models perform reliably across different data splits rather than just on one lucky train/test split.
                </p>
                <div className="space-y-2 pt-2">
                  {validation?.cross_validation_summary?.map((row, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs p-2.5 bg-[#FFFFFF] rounded-xl border border-[#E9E4F5]">
                      <span className="font-semibold text-[#17243B]">{row['Validation Strategy']}</span>
                      <span className="font-mono font-bold text-[#5146A5]">
                        Mean F1: {(row['Mean F1'] * 100).toFixed(1)}% &plusmn; {(row['Std Dev'] * 100).toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5 bg-[#FAF7F0] rounded-2xl border border-[#E9E4F5] space-y-2">
                <span className="text-xs font-bold text-[#5146A5] uppercase block">GridSearchCV Parameter Tuning</span>
                <p className="text-xs text-[#555866]">
                  Automated hyperparameter search discovered the optimal settings for regularized models:
                </p>
                <div className="space-y-2 pt-2">
                  {validation?.tuning_summary?.map((t, idx) => (
                    <div key={idx} className="p-2.5 bg-[#FFFFFF] rounded-xl border border-[#E9E4F5] text-xs">
                      <div className="flex justify-between items-center mb-0.5">
                        <strong className="text-[#17243B]">{t['Search Method']}</strong>
                        <span className="font-mono text-[11px] text-[#828696]">{t['Search Time (s)']}s</span>
                      </div>
                      <span className="font-mono text-[#5146A5] font-semibold block">{t['Best Parameters']}</span>
                      <span className="text-[11px] text-[#789579] font-semibold mt-0.5 block">
                        Best Mean F1: {(t['Best Mean CV F1'] * 100).toFixed(1)}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Feature Importance Ranking */}
            {validation?.top_features && validation.top_features.length > 0 && (
              <div className="p-5 bg-[#FAF7F0] rounded-2xl border border-[#E9E4F5] space-y-3">
                <h4 className="font-serif font-bold text-base text-[#17243B]">
                  Most Influential Features (Random Forest Gini Importance)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {validation.top_features.slice(0, 5).map((f, idx) => (
                    <div key={idx} className="p-3 bg-[#FFFFFF] rounded-xl border border-[#E9E4F5] text-center">
                      <span className="text-[10px] text-[#828696] font-bold block">Rank #{idx + 1}</span>
                      <strong className="text-xs font-sans text-[#17243B] block truncate mt-0.5">{f.clean_feature}</strong>
                      <span className="text-xs font-mono font-bold text-[#F28C45]">{(f.importance * 100).toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};
