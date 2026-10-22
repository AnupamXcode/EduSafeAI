import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  LineChart,
  Line,
  Cell,
  Legend,
} from 'recharts';
import { DatasetSummary, EdaData } from '../types';
import { api } from '../api/client';
import { ArrowUpRight, CheckCircle2, AlertTriangle, Activity, Database, GitBranch } from 'lucide-react';

interface OverviewPageProps {
  summary: DatasetSummary | null;
  course: string;
  onNavigate: (tab: string) => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({ summary, course, onNavigate }) => {
  const [eda, setEda] = useState<EdaData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    api
      .getEdaData(course)
      .then((data) => {
        if (isMounted) setEda(data);
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
      {/* Editorial Title Section */}
      <div className="border-b border-[#D9D2C3] pb-6">
        <h2 className="text-3xl lg:text-4xl font-normal text-[#244C3A] tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>
          Student performance, explained through data.
        </h2>
        <p className="text-sm text-[#332F2A] opacity-80 mt-2 max-w-3xl leading-relaxed">
          Explore academic outcomes, estimate final grades, identify potential risk, and compare machine learning models using real student records.
        </p>

        {/* Quick jump navigation toolbar */}
        <div className="flex flex-wrap items-center gap-2.5 mt-4">
          <button
            onClick={() => onNavigate('explorer')}
            className="px-3 py-1.5 text-xs font-semibold bg-[#FFFFFF] border border-[#D9D2C3] text-[#244C3A] hover:border-[#244C3A] transition-colors"
          >
            Data Explorer & Dictionary →
          </button>
          <button
            onClick={() => onNavigate('performance')}
            className="px-3 py-1.5 text-xs font-semibold bg-[#FFFFFF] border border-[#D9D2C3] text-[#244C3A] hover:border-[#244C3A] transition-colors"
          >
            Grade Estimation (Regression) →
          </button>
          <button
            onClick={() => onNavigate('risk')}
            className="px-3 py-1.5 text-xs font-semibold bg-[#FFFFFF] border border-[#D9D2C3] text-[#244C3A] hover:border-[#244C3A] transition-colors"
          >
            Risk Analysis (Classification) →
          </button>
          <button
            onClick={() => onNavigate('segments')}
            className="px-3 py-1.5 text-xs font-semibold bg-[#FFFFFF] border border-[#D9D2C3] text-[#244C3A] hover:border-[#244C3A] transition-colors"
          >
            Student Segments (Clustering) →
          </button>
          <button
            onClick={() => onNavigate('lab')}
            className="px-3 py-1.5 text-xs font-semibold bg-[#FFFFFF] border border-[#D9D2C3] text-[#244C3A] hover:border-[#244C3A] transition-colors"
          >
            Model Lab & Cross-Validation →
          </button>
        </div>
      </div>

      {/* 4 Important Indicators Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="panel p-5 bg-[#FFFFFF]">
          <span className="label-title text-[#244C3A]">Total Student Records</span>
          <div className="text-3xl font-bold text-[#332F2A] num mt-1">
            {summary ? summary.total_records : '—'}
          </div>
          <p className="text-xs text-[#332F2A] opacity-70 mt-1">
            Verified UCI benchmark cohort records
          </p>
        </div>

        {/* Metric 2 */}
        <div className="panel p-5 bg-[#FFFFFF]">
          <span className="label-title text-[#244C3A]">Average Final Grade (G3)</span>
          <div className="text-3xl font-bold text-[#332F2A] num mt-1">
            {summary ? summary.g3_mean.toFixed(2) : '—'}{' '}
            <span className="text-sm font-normal text-[#332F2A] opacity-60">/ 20</span>
          </div>
          <p className="text-xs text-[#332F2A] opacity-70 mt-1">
            Cohort std deviation: {summary ? summary.g3_std.toFixed(2) : '—'}
          </p>
        </div>

        {/* Metric 3 */}
        <div className="panel p-5 bg-[#FFFFFF]">
          <span className="label-title text-[#C66B4E]">Students In Risk Class (G3 &lt; 10)</span>
          <div className="text-3xl font-bold text-[#C66B4E] num mt-1">
            {summary ? summary.at_risk_count : '—'}{' '}
            <span className="text-sm font-normal text-[#C66B4E] opacity-75">
              ({summary ? summary.at_risk_percentage : '—'}%)
            </span>
          </div>
          <p className="text-xs text-[#332F2A] opacity-70 mt-1">
            {summary ? summary.not_at_risk_count : '—'} passing students (&ge; 10/20)
          </p>
        </div>

        {/* Metric 4 */}
        <div className="panel p-5 bg-[#FFFFFF]">
          <span className="label-title text-[#244C3A]">Best Validated Classifier</span>
          <div className="text-2xl font-bold text-[#244C3A] mt-1 truncate">
            Logistic Regression
          </div>
          <p className="text-xs text-[#332F2A] opacity-70 mt-1 num">
            Accuracy: 93.9% | Recall: 87.9% | F1: 0.906
          </p>
        </div>
      </div>

      {/* Asymmetrical Main Analysis Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 cols): Primary Visualization - Grade Distribution */}
        <div className="lg:col-span-8 panel p-6 bg-[#FFFFFF]">
          <div className="flex flex-wrap justify-between items-baseline border-b border-[#D9D2C3] pb-3 mb-4 gap-2">
            <div>
              <h3 className="text-lg font-semibold text-[#244C3A]" style={{ fontFamily: 'var(--font-serif)' }}>
                Final Grade (G3) Cohort Distribution
              </h3>
              <p className="text-xs text-[#332F2A] opacity-75">
                Bimodal academic distribution: passing distribution curve vs examination non-attendance cluster (score 0).
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="badge-risk">Threshold: G3 &lt; 10 (At Risk)</span>
            </div>
          </div>

          <div className="h-[320px] w-full">
            {eda ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={eda.grade_distribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#D9D2C3" vertical={false} />
                  <XAxis dataKey="grade" tick={{ fill: '#332F2A', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#332F2A', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #244C3A',
                      borderRadius: '0px',
                      fontSize: '12px',
                    }}
                  />
                  <ReferenceLine
                    x={10}
                    stroke="#C66B4E"
                    strokeDasharray="4 4"
                    label={{ value: 'Risk Boundary (10)', fill: '#C66B4E', fontSize: 11, position: 'top' }}
                  />
                  <Bar dataKey="G3" fill="#244C3A">
                    {eda.grade_distribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.grade < 10 ? '#C66B4E' : '#244C3A'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-[#332F2A] opacity-60">
                Computing grade distribution metrics...
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-[#D9D2C3] flex flex-wrap justify-between items-center text-xs text-[#332F2A] opacity-80 gap-4">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-[#C66B4E]"></span> Terracotta: Academic Risk Zone (&lt; 10)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 bg-[#244C3A]"></span> Olive: Passing Grades (&ge; 10)
              </span>
            </div>
            <button
              onClick={() => onNavigate('performance')}
              className="text-[#244C3A] font-semibold flex items-center gap-1 hover:underline"
            >
              Analyze in Performance Engine <ArrowUpRight size={13} />
            </button>
          </div>
        </div>

        {/* Right Column (4 cols): Risk Distribution & Study Time Analysis */}
        <div className="lg:col-span-4 space-y-6">
          {/* Risk Ratio Panel */}
          <div className="panel p-5 bg-[#FFFFFF]">
            <h3 className="text-sm font-semibold text-[#244C3A] uppercase tracking-wider mb-2 border-b border-[#D9D2C3] pb-2">
              Academic Risk Proportion
            </h3>
            <div className="space-y-3 mt-3">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-[#244C3A]">Passing Cohort (G3 &ge; 10)</span>
                  <span className="num">{summary ? summary.not_at_risk_count : 0} ({summary ? (100 - summary.at_risk_percentage).toFixed(1) : 0}%)</span>
                </div>
                <div className="w-full h-2.5 bg-[#E6DCCB]">
                  <div
                    className="h-full bg-[#244C3A]"
                    style={{ width: `${summary ? 100 - summary.at_risk_percentage : 0}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="text-[#C66B4E]">At Risk Population (G3 &lt; 10)</span>
                  <span className="num">{summary ? summary.at_risk_count : 0} ({summary ? summary.at_risk_percentage : 0}%)</span>
                </div>
                <div className="w-full h-2.5 bg-[#E6DCCB]">
                  <div
                    className="h-full bg-[#C66B4E]"
                    style={{ width: `${summary ? summary.at_risk_percentage : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <p className="text-[11.5px] text-[#332F2A] opacity-75 mt-3 leading-relaxed">
              Target defined specifically for university intervention: enables early detection before end-of-term examinations.
            </p>
          </div>

          {/* Study Time vs Mean Grade */}
          <div className="panel p-5 bg-[#FFFFFF]">
            <h3 className="text-sm font-semibold text-[#244C3A] uppercase tracking-wider mb-2 border-b border-[#D9D2C3] pb-2">
              Weekly Study Time Impact
            </h3>
            <div className="h-[140px] w-full">
              {eda ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={eda.study_comparison} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#D9D2C3" vertical={false} />
                    <XAxis dataKey="studytime" tick={{ fill: '#332F2A', fontSize: 10 }} />
                    <YAxis domain={[8, 14]} tick={{ fill: '#332F2A', fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #244C3A',
                        borderRadius: '0px',
                        fontSize: '11px',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="mean_g3"
                      stroke="#244C3A"
                      strokeWidth={2}
                      dot={{ fill: '#C66B4E', r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs opacity-60">
                  Loading study time...
                </div>
              )}
            </div>
            <div className="mt-2 text-[11.5px] text-[#332F2A] opacity-75">
              Empirical mean rises monotonically from 8.8 marks (&lt;2 hrs) to 11.6 marks (&gt;10 hrs/week).
            </div>
          </div>
        </div>
      </div>

      {/* Model Benchmark Summary & ML Architecture Flow */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Model Comparison Table */}
        <div className="lg:col-span-7 panel bg-[#FFFFFF]">
          <div className="p-4 border-b border-[#D9D2C3] flex justify-between items-center">
            <div>
              <h3 className="text-base font-semibold text-[#244C3A]" style={{ fontFamily: 'var(--font-serif)' }}>
                Empirical Algorithm Benchmark Summary
              </h3>
              <p className="text-xs text-[#332F2A] opacity-70">
                Verified performance metrics calculated across 80:20 regression and 75:25 stratified classification splits.
              </p>
            </div>
            <button
              onClick={() => onNavigate('lab')}
              className="text-xs text-[#244C3A] font-semibold hover:underline flex items-center gap-1"
            >
              Model Lab <ArrowUpRight size={13} />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="academic-table">
              <thead>
                <tr>
                  <th>Model Architecture</th>
                  <th>Task</th>
                  <th className="text-right">Primary Metric</th>
                  <th className="text-right">Secondary Metric</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-semibold text-[#244C3A]">Multiple Linear Regression</td>
                  <td>Grade Prediction</td>
                  <td className="text-right num">R² = 0.724</td>
                  <td className="text-right num">RMSE = 2.38 pts</td>
                </tr>
                <tr>
                  <td className="font-semibold text-[#244C3A]">Logistic Regression</td>
                  <td>Risk Classification</td>
                  <td className="text-right num font-semibold">Acc = 93.9%</td>
                  <td className="text-right num font-semibold text-[#C66B4E]">Recall = 87.9%</td>
                </tr>
                <tr>
                  <td className="font-semibold text-[#244C3A]">Random Forest (100 Trees)</td>
                  <td>Ensemble Risk</td>
                  <td className="text-right num">Acc = 92.9%</td>
                  <td className="text-right num">F1 = 0.896</td>
                </tr>
                <tr>
                  <td className="font-semibold text-[#244C3A]">K-Means Clustering (K=3)</td>
                  <td>Unsupervised Segments</td>
                  <td className="text-right num">Silhouette = 0.112</td>
                  <td className="text-right num">3 Archetypes</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Machine Learning Pipeline Diagram */}
        <div className="lg:col-span-5 panel p-5 bg-[#FFFFFF]">
          <h3 className="text-base font-semibold text-[#244C3A] mb-3 pb-2 border-b border-[#D9D2C3]" style={{ fontFamily: 'var(--font-serif)' }}>
            Integrated Analytical Methodology
          </h3>

          <div className="space-y-3 text-xs leading-relaxed">
            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 bg-[#E6DCCB] text-[#244C3A] font-bold flex items-center justify-center text-[10px] flex-shrink-0">
                1
              </span>
              <div>
                <strong className="text-[#244C3A]">Data Quality Audit:</strong> 395 UCI math records inspected. Zero nulls, zero duplicates.
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 bg-[#E6DCCB] text-[#244C3A] font-bold flex items-center justify-center text-[10px] flex-shrink-0">
                2
              </span>
              <div>
                <strong className="text-[#244C3A]">Target Separation:</strong> G3 and risk target strictly isolated to eliminate data leakage.
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 bg-[#E6DCCB] text-[#244C3A] font-bold flex items-center justify-center text-[10px] flex-shrink-0">
                3
              </span>
              <div>
                <strong className="text-[#244C3A]">Dual Supervised Formulation:</strong> Continuous grade prediction (Regression) + binary early warning (Classification).
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 bg-[#E6DCCB] text-[#244C3A] font-bold flex items-center justify-center text-[10px] flex-shrink-0">
                4
              </span>
              <div>
                <strong className="text-[#244C3A]">Unbiased Clustering:</strong> K-Means & GMM segment students on academic habits independently of outcomes.
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="w-5 h-5 bg-[#E6DCCB] text-[#244C3A] font-bold flex items-center justify-center text-[10px] flex-shrink-0">
                5
              </span>
              <div>
                <strong className="text-[#244C3A]">Ensemble & Tuning:</strong> Bagging variance dampening, 5/10-fold Stratified CV, and GridSearchCV.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
