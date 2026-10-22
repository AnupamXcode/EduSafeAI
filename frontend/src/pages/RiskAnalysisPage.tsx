import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { ClassificationResponse, StudentInput, RiskPredictionResult } from '../types';
import { api } from '../api/client';
import { ShieldAlert, CheckCircle2, AlertTriangle, ArrowRight, Activity, Info } from 'lucide-react';

interface RiskAnalysisPageProps {
  course: string;
}

export const RiskAnalysisPage: React.FC<RiskAnalysisPageProps> = ({ course }) => {
  const [earlyMode, setEarlyMode] = useState(false);
  const [data, setData] = useState<ClassificationResponse | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>('Logistic Regression');
  const [loading, setLoading] = useState(true);

  // Student risk form state
  const [student, setStudent] = useState<StudentInput>({
    school: 'GP',
    sex: 'F',
    age: 17,
    address: 'U',
    famsize: 'GT3',
    Pstatus: 'T',
    Medu: 2,
    Fedu: 2,
    Mjob: 'other',
    Fjob: 'other',
    reason: 'course',
    guardian: 'mother',
    traveltime: 1,
    studytime: 2,
    failures: 1,
    schoolsup: 'no',
    famsup: 'yes',
    paid: 'no',
    activities: 'no',
    nursery: 'yes',
    higher: 'yes',
    internet: 'yes',
    romantic: 'no',
    famrel: 3,
    freetime: 3,
    goout: 3,
    Dalc: 1,
    Walc: 2,
    health: 3,
    absences: 8,
    G1: 9,
    G2: 9,
  });

  const [riskResult, setRiskResult] = useState<RiskPredictionResult | null>(null);
  const [evaluating, setEvaluating] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    api
      .getClassificationModels(course, earlyMode)
      .then((res) => {
        if (isMounted) {
          setData(res);
          if (res.comparison_table.length > 0) {
            setSelectedModel(res.comparison_table[0].Model);
          }
        }
      })
      .catch((err) => console.error(err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [course, earlyMode]);

  const handleRiskAssess = async (e: React.FormEvent) => {
    e.preventDefault();
    setEvaluating(true);
    try {
      const res = await api.predictRisk(student, earlyMode);
      setRiskResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setEvaluating(false);
    }
  };

  const activeModelData = data?.models[selectedModel];

  return (
    <div className="space-y-8 pb-12">
      {/* Editorial Title & Mode Toggle */}
      <div className="flex flex-wrap justify-between items-end border-b border-[#D9D2C3] pb-6 gap-4">
        <div>
          <h2 className="text-3xl font-normal text-[#244C3A] tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>
            Supervised Academic Risk Classification
          </h2>
          <p className="text-sm text-[#332F2A] opacity-80 mt-1 max-w-2xl leading-relaxed">
            Identifies students requiring academic intervention based on project-defined target threshold (<strong>G3 &lt; 10: At Risk</strong>).
            Evaluated on a 75:25 stratified split using Logistic Regression, KNN, Naive Bayes, and Ensembles.
          </p>
        </div>

        {/* Early vs Late Mode Toggle */}
        <div className="flex items-center gap-2 bg-[#FFFFFF] border border-[#D9D2C3] p-1">
          <button
            onClick={() => setEarlyMode(false)}
            className={`px-3 py-1.5 text-xs font-semibold ${
              !earlyMode ? 'bg-[#244C3A] text-[#FFFFFF]' : 'text-[#332F2A] hover:bg-[#F8F6F0]'
            }`}
          >
            Full-Term (With G2)
          </button>
          <button
            onClick={() => setEarlyMode(true)}
            className={`px-3 py-1.5 text-xs font-semibold ${
              earlyMode ? 'bg-[#244C3A] text-[#FFFFFF]' : 'text-[#332F2A] hover:bg-[#F8F6F0]'
            }`}
          >
            Early-Warning (No G2)
          </button>
        </div>
      </div>

      {/* Primary Algorithm Benchmark Table */}
      {data && (
        <div className="panel bg-[#FFFFFF]">
          <div className="p-4 border-b border-[#D9D2C3] flex flex-wrap justify-between items-center gap-2">
            <div>
              <h3 className="text-base font-semibold text-[#244C3A]" style={{ fontFamily: 'var(--font-serif)' }}>
                Classification Model Evaluation Matrix (Stratified 75:25 Split)
              </h3>
              <p className="text-xs text-[#332F2A] opacity-70">
                Click any model row to inspect its exact Confusion Matrix and ROC Curve below:
              </p>
            </div>
            <span className="badge-risk">Primary Target: Recall (At Risk)</span>
          </div>

          <div className="overflow-x-auto">
            <table className="academic-table">
              <thead>
                <tr>
                  <th>Classifier Algorithm</th>
                  <th className="text-right">Accuracy</th>
                  <th className="text-right">Precision (At Risk)</th>
                  <th className="text-right text-[#C66B4E]">Recall (At Risk)</th>
                  <th className="text-right">F1-Score</th>
                  <th className="text-right">ROC-AUC</th>
                </tr>
              </thead>
              <tbody>
                {data.comparison_table.map((row, idx) => {
                  const isSelected = selectedModel === row.Model;
                  return (
                    <tr
                      key={idx}
                      onClick={() => setSelectedModel(row.Model)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? '!bg-[#F5ECE5] font-semibold' : ''
                      }`}
                    >
                      <td className="flex items-center gap-2">
                        {isSelected && <span className="w-1.5 h-1.5 bg-[#C66B4E]"></span>}
                        <span className={isSelected ? 'text-[#244C3A] font-bold' : ''}>
                          {row.Model}
                        </span>
                      </td>
                      <td className="text-right num">{(row.Accuracy * 100).toFixed(1)}%</td>
                      <td className="text-right num">{(row['Precision (At Risk)'] * 100).toFixed(1)}%</td>
                      <td className="text-right num font-semibold text-[#C66B4E]">
                        {(row['Recall (At Risk)'] * 100).toFixed(1)}%
                      </td>
                      <td className="text-right num">{row['F1-Score'].toFixed(4)}</td>
                      <td className="text-right num">{row['ROC-AUC']}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Confusion Matrix & ROC Curves Inspector */}
      {data && activeModelData && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Confusion Matrix (5 cols) */}
          <div className="lg:col-span-5 panel p-6 bg-[#FFFFFF]">
            <div className="border-b border-[#D9D2C3] pb-3 mb-4">
              <h3 className="text-base font-semibold text-[#244C3A]" style={{ fontFamily: 'var(--font-serif)' }}>
                Confusion Matrix: {selectedModel}
              </h3>
              <p className="text-xs text-[#332F2A] opacity-75">
                Evaluation on 99 held-out test students (66 Passing, 33 At-Risk):
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4">
              {/* True Negative */}
              <div className="p-4 border border-[#244C3A] bg-[#FFFFFF]">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#244C3A] block">
                  True Negatives (TN)
                </span>
                <span className="text-2xl font-bold num text-[#244C3A] mt-1 block">
                  {activeModelData.confusion_matrix.tn}
                </span>
                <span className="text-[11px] text-[#332F2A] opacity-70">
                  Passing correctly identified
                </span>
              </div>

              {/* False Positive */}
              <div className="p-4 border border-[#D9D2C3] bg-[#FAF8F4]">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#332F2A] opacity-70 block">
                  False Positives (FP)
                </span>
                <span className="text-2xl font-bold num text-[#332F2A] mt-1 block">
                  {activeModelData.confusion_matrix.fp}
                </span>
                <span className="text-[11px] text-[#332F2A] opacity-70">
                  Type I: Passing flagged as at-risk
                </span>
              </div>

              {/* False Negative (Critical!) */}
              <div className="p-4 border border-[#C66B4E] bg-[#FAEEEB]">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#C66B4E] block">
                  False Negatives (FN)
                </span>
                <span className="text-2xl font-bold num text-[#C66B4E] mt-1 block">
                  {activeModelData.confusion_matrix.fn}
                </span>
                <span className="text-[11px] text-[#C66B4E] font-medium">
                  Type II: At-risk students missed!
                </span>
              </div>

              {/* True Positive */}
              <div className="p-4 border border-[#244C3A] bg-[#EEF3E6]">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#244C3A] block">
                  True Positives (TP)
                </span>
                <span className="text-2xl font-bold num text-[#244C3A] mt-1 block">
                  {activeModelData.confusion_matrix.tp}
                </span>
                <span className="text-[11px] text-[#244C3A] font-medium">
                  At-risk successfully detected
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#D9D2C3] text-xs text-[#332F2A] opacity-80 leading-relaxed">
              <strong>Recall Rate:</strong>{' '}
              <code className="text-[#C66B4E] font-semibold">
                {activeModelData.confusion_matrix.tp} /{' '}
                {activeModelData.confusion_matrix.tp + activeModelData.confusion_matrix.fn} ={' '}
                {(activeModelData.metrics.recall * 100).toFixed(1)}%
              </code>
            </div>
          </div>

          {/* ROC Curves (7 cols) */}
          <div className="lg:col-span-7 panel p-6 bg-[#FFFFFF]">
            <div className="border-b border-[#D9D2C3] pb-3 mb-4 flex justify-between items-baseline">
              <div>
                <h3 className="text-base font-semibold text-[#244C3A]" style={{ fontFamily: 'var(--font-serif)' }}>
                  Receiver Operating Characteristic (ROC Curve)
                </h3>
                <p className="text-xs text-[#332F2A] opacity-75">
                  Plots True Positive Rate against False Positive Rate across classification thresholds:
                </p>
              </div>
              <span className="text-xs num font-semibold text-[#244C3A]">
                AUC = {activeModelData.metrics.roc_auc.toFixed(3)}
              </span>
            </div>

            <div className="h-[270px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activeModelData.roc_curve} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#D9D2C3" />
                  <XAxis
                    dataKey="fpr"
                    domain={[0, 1]}
                    tick={{ fill: '#332F2A', fontSize: 10 }}
                    label={{ value: 'False Positive Rate (1 - Specificity)', position: 'insideBottom', offset: -5, fontSize: 11, fill: '#332F2A' }}
                  />
                  <YAxis
                    dataKey="tpr"
                    domain={[0, 1]}
                    tick={{ fill: '#332F2A', fontSize: 10 }}
                    label={{ value: 'True Positive Rate (Recall)', angle: -90, position: 'insideLeft', offset: 20, fontSize: 11, fill: '#332F2A' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #244C3A',
                      borderRadius: '0px',
                      fontSize: '11px',
                    }}
                  />
                  <Line type="monotone" dataKey="tpr" stroke="#244C3A" strokeWidth={2.5} dot={{ fill: '#C66B4E', r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Asymmetric Error Cost Analysis & Real-time Risk Assessment Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Pedagogical Callout: Asymmetric Error Cost (5 cols) */}
        <div className="lg:col-span-5 panel p-6 bg-[#FFFFFF] border-l-4 border-l-[#C66B4E]">
          <h3 className="text-base font-semibold text-[#244C3A] mb-2" style={{ fontFamily: 'var(--font-serif)' }}>
            Why Recall is the Critical Academic Metric
          </h3>
          <p className="text-xs text-[#332F2A] opacity-80 leading-relaxed">
            In standard machine learning, overall accuracy is often celebrated. However, in student risk systems:
          </p>

          <div className="mt-3 space-y-2.5 text-xs text-[#332F2A]">
            <div className="p-3 bg-[#FAEEEB] border border-[#C66B4E]">
              <strong className="text-[#C66B4E] block">High Cost: False Negative (Type II error)</strong>
              The algorithm classifies a student as passing, but they fail. The university offers zero support, leading to course failure or dropout.
            </div>

            <div className="p-3 bg-[#FFFFFF] border border-[#D9D2C3]">
              <strong className="text-[#244C3A] block">Low Cost: False Positive (Type I error)</strong>
              The algorithm flags a passing student as potentially vulnerable. The student merely receives an advisory check-in or optional tutoring.
            </div>
          </div>

          <p className="text-xs text-[#332F2A] opacity-75 mt-3">
            Therefore, <strong>Recall for the At-Risk class</strong> ($\frac{'{'}TP{'}'}{'{'}TP+FN{'}'}$) must be maximized to prevent students falling through the cracks.
          </p>
        </div>

        {/* Real-time Risk Assessment Form (7 cols) */}
        <div className="lg:col-span-7 panel p-6 bg-[#FFFFFF]">
          <div className="border-b border-[#D9D2C3] pb-3 mb-4">
            <h3 className="text-base font-semibold text-[#244C3A]" style={{ fontFamily: 'var(--font-serif)' }}>
              Student Academic Risk Profiler
            </h3>
            <p className="text-xs text-[#332F2A] opacity-75">
              Evaluate probability of academic vulnerability and generate supportive interventions:
            </p>
          </div>

          {/* Quick viva testing presets */}
          <div className="mb-4 p-2.5 bg-[#FAF8F4] border border-[#D9D2C3] flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-[#244C3A] uppercase tracking-wider">Viva Presets:</span>
            <button
              type="button"
              onClick={() =>
                setStudent({
                  ...student,
                  G1: 16,
                  G2: 17,
                  failures: 0,
                  studytime: 4,
                  absences: 2,
                  Medu: 4,
                  higher: 'yes',
                  internet: 'yes',
                })
              }
              className="px-2.5 py-1 text-xs bg-[#FFFFFF] border border-[#244C3A] text-[#244C3A] hover:bg-[#244C3A] hover:text-white font-medium transition-colors"
            >
              High Achiever (Safe)
            </button>
            <button
              type="button"
              onClick={() =>
                setStudent({
                  ...student,
                  G1: 9,
                  G2: 10,
                  failures: 1,
                  studytime: 2,
                  absences: 8,
                  Medu: 2,
                  higher: 'yes',
                  internet: 'yes',
                })
              }
              className="px-2.5 py-1 text-xs bg-[#FFFFFF] border border-[#D9D2C3] text-[#332F2A] hover:border-[#332F2A] font-medium transition-colors"
            >
              Borderline Case
            </button>
            <button
              type="button"
              onClick={() =>
                setStudent({
                  ...student,
                  G1: 6,
                  G2: 6,
                  failures: 3,
                  studytime: 1,
                  absences: 20,
                  Medu: 1,
                  higher: 'no',
                  internet: 'no',
                })
              }
              className="px-2.5 py-1 text-xs bg-[#FAEEEB] border border-[#C66B4E] text-[#C66B4E] hover:bg-[#C66B4E] hover:text-white font-medium transition-colors"
            >
              At-Risk Student
            </button>
          </div>

          <form onSubmit={handleRiskAssess} className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className="label-title">G1 Exam (0-20)</label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={student.G1}
                  onChange={(e) => setStudent({ ...student, G1: Number(e.target.value) })}
                  className="input-field"
                />
              </div>

              {!earlyMode && (
                <div>
                  <label className="label-title">G2 Exam (0-20)</label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={student.G2}
                    onChange={(e) => setStudent({ ...student, G2: Number(e.target.value) })}
                    className="input-field"
                  />
                </div>
              )}

              <div>
                <label className="label-title">Class Failures</label>
                <select
                  value={student.failures}
                  onChange={(e) => setStudent({ ...student, failures: Number(e.target.value) })}
                  className="input-field"
                >
                  <option value={0}>0 Failures</option>
                  <option value={1}>1 Failure</option>
                  <option value={2}>2 Failures</option>
                  <option value={3}>3 Failures</option>
                </select>
              </div>

              <div>
                <label className="label-title">Weekly Study</label>
                <select
                  value={student.studytime}
                  onChange={(e) => setStudent({ ...student, studytime: Number(e.target.value) })}
                  className="input-field"
                >
                  <option value={1}>&lt; 2 hrs</option>
                  <option value={2}>2 - 5 hrs</option>
                  <option value={3}>5 - 10 hrs</option>
                  <option value={4}>&gt; 10 hrs</option>
                </select>
              </div>

              <div>
                <label className="label-title">Absences</label>
                <input
                  type="number"
                  min="0"
                  max="93"
                  value={student.absences}
                  onChange={(e) => setStudent({ ...student, absences: Number(e.target.value) })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="label-title">Higher Education</label>
                <select
                  value={student.higher}
                  onChange={(e) => setStudent({ ...student, higher: e.target.value })}
                  className="input-field"
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
            </div>

            <button type="submit" disabled={evaluating} className="btn-primary w-full justify-center">
              {evaluating ? 'Assessing Risk Probability...' : 'Compute Academic Risk Classification'}
            </button>
          </form>

          {/* Risk Prediction Output */}
          {riskResult && (
            <div className={`mt-5 p-4 border ${riskResult.risk_status === 'At Risk' ? 'border-[#C66B4E] bg-[#FAEEEB]' : 'border-[#244C3A] bg-[#EEF3E6]'}`}>
              <div className="flex justify-between items-baseline">
                <span className="text-xs uppercase font-bold tracking-wider text-[#332F2A]">
                  Risk Assessment: {riskResult.risk_level}
                </span>
                <span className="text-xl font-bold num text-[#332F2A]">
                  {riskResult.risk_probability}% Risk Probability
                </span>
              </div>

              <div className="mt-2 text-xs leading-relaxed text-[#332F2A]">
                <strong>Suggested Action:</strong> {riskResult.recommendation}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
