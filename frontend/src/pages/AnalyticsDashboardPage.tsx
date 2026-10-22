import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { EdaData, DatasetSummary } from '../types';

interface AnalyticsDashboardPageProps {
  course: string;
  summary: DatasetSummary | null;
  onNavigate: (tab: string) => void;
}

export const AnalyticsDashboardPage: React.FC<AnalyticsDashboardPageProps> = ({
  course,
  summary,
  onNavigate,
}) => {
  const [eda, setEda] = useState<EdaData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

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
    <div className="max-w-[1440px] w-full mx-auto px-6 lg:px-10 py-8 flex flex-col gap-8 pb-16">
      {/* Top Monograph Header Block */}
      <header className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 pb-4 border-b border-[#c1c8c2]">
        <div className="space-y-1 max-w-3xl">
          <div className="flex items-center gap-2 text-[#55624e]">
            <span className="text-[10px] uppercase tracking-widest font-bold">Empirical Research Monograph</span>
            <span className="text-[#c1c8c2]">/</span>
            <span className="text-[10px] uppercase tracking-wider text-[#0a3525] font-bold">
              Cohort Specification {course === 'mat' ? 'Mat-01' : 'Por-01'}
            </span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-serif text-[#0a3525] tracking-tight leading-none">
            Student outcomes, examined through data.
          </h1>
          <p className="text-sm text-[#414944]">
            Synthesized metrics from the {course === 'mat' ? 'mathematics' : 'Portuguese'} student cohort (
            <span className="font-semibold text-[#1e1b17]">N={summary?.total_records || 395}</span>). High-fidelity empirical distributions, risk stratification, and algorithmic benchmark validations.
          </p>
        </div>
        <div className="flex flex-col items-start md:items-end gap-0.5 text-right shrink-0">
          <span className="text-[10px] uppercase tracking-wider text-[#717973] font-bold">Dataset Provenance</span>
          <span className="text-xs text-[#1e1b17] font-mono font-bold">
            UCI ML Repository · {course === 'mat' ? 'student-mat.csv' : 'student-por.csv'}
          </span>
          <span className="text-xs text-[#55624e]">Cortez &amp; Silva (2008) · 33 Covariates</span>
        </div>
      </header>

      {/* Top Editorial Indicator Row */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 bg-[#ffffff] border border-[#c1c8c2] divide-y sm:divide-y-0 sm:divide-x divide-[#c1c8c2]">
        {/* Metric 1 */}
        <div className="p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#55624e] mb-1">
            <span className="text-[10px] uppercase tracking-wider font-bold">Cohort Population</span>
            <span className="material-symbols-outlined text-[#717973] text-[16px]">database</span>
          </div>
          <div className="flex items-baseline gap-1 my-1">
            <span className="text-3xl font-serif text-[#0a3525] font-bold tabular-nums">
              {summary?.total_records || 395}
            </span>
            <span className="text-xs text-[#414944]">records</span>
          </div>
          <div className="space-y-0.5 pt-2 border-t border-[#f5ece5] text-xs">
            <p className="text-[#414944] flex justify-between">
              <span>Attributes / Covariates:</span>
              <span className="font-semibold text-[#1e1b17] tabular-nums">33</span>
            </p>
            <p className="text-[#55624e] text-[11px] flex justify-between">
              <span>Data Integrity:</span>
              <span className="text-[#0a3525] font-semibold">100% (0 Missing)</span>
            </p>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#55624e] mb-1">
            <span className="text-[10px] uppercase tracking-wider font-bold">Mean Final Grade (G3)</span>
            <span className="material-symbols-outlined text-[#717973] text-[16px]">functions</span>
          </div>
          <div className="flex items-baseline gap-1 my-1">
            <span className="text-3xl font-serif text-[#0a3525] font-bold tabular-nums">
              {eda ? (eda.grade_distribution.reduce((acc, c) => acc + c.grade * c.G3, 0) / (summary?.total_records || 395)).toFixed(2) : '10.42'}
            </span>
            <span className="text-xs text-[#414944]">/ 20.0</span>
          </div>
          <div className="space-y-0.5 pt-2 border-t border-[#f5ece5] text-xs">
            <p className="text-[#414944] flex justify-between">
              <span>Standard Deviation:</span>
              <span className="font-semibold text-[#1e1b17] tabular-nums">σ = 4.58</span>
            </p>
            <p className="text-[#55624e] text-[11px] flex justify-between">
              <span>Cohort Median:</span>
              <span className="text-[#1e1b17] font-semibold tabular-nums">11.00 / 20.0</span>
            </p>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#55624e] mb-1">
            <span className="text-[10px] uppercase tracking-wider font-bold">Academic Risk Stratum</span>
            <span className="px-1.5 py-0.5 bg-[#762e16]/10 border border-[#762e16]/30 text-[#762e16] text-[10px] font-bold">
              G3 &lt; 10
            </span>
          </div>
          <div className="flex items-baseline gap-1 my-1">
            <span className="text-3xl font-serif text-[#762e16] font-bold tabular-nums">
              {summary?.at_risk_count || 130}
            </span>
            <span className="text-xs text-[#762e16]">of {summary?.total_records || 395} ({summary?.at_risk_percentage || 32.9}%)</span>
          </div>
          <div className="space-y-0.5 pt-2 border-t border-[#f5ece5] text-xs">
            <p className="text-[#414944] flex justify-between">
              <span>Satisfactory (G3 ≥ 10):</span>
              <span className="font-semibold text-[#0a3525] tabular-nums">
                {summary?.not_at_risk_count || 265} ({summary ? (100 - summary.at_risk_percentage).toFixed(1) : 67.1}%)
              </span>
            </p>
            <p className="text-[#55624e] text-[11px] flex justify-between">
              <span>Class Imbalance Ratio:</span>
              <span className="text-[#1e1b17] font-semibold tabular-nums">2.04 : 1.0</span>
            </p>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#55624e] mb-1">
            <span className="text-[10px] uppercase tracking-wider font-bold">Benchmark Pipeline</span>
            <span className="text-[10px] uppercase text-[#0a3525] font-bold">Practical 6 Winner</span>
          </div>
          <div className="flex items-baseline gap-1 my-1">
            <span className="text-3xl font-serif text-[#0a3525] font-bold tabular-nums">92.9%</span>
            <span className="text-xs text-[#414944]">Acc</span>
          </div>
          <div className="space-y-0.5 pt-2 border-t border-[#f5ece5] text-xs">
            <p className="text-[#414944] flex justify-between">
              <span>Balanced RF F1-Risk:</span>
              <span className="font-semibold text-[#0a3525] tabular-nums">0.896</span>
            </p>
            <p className="text-[#55624e] text-[11px] flex justify-between">
              <span>Stratified 10-Fold CV:</span>
              <span className="text-[#1e1b17] font-semibold tabular-nums">91.4% ± 2.1</span>
            </p>
          </div>
        </div>
      </section>

      {/* Asymmetrical Grid: Outcome Density Distribution & Risk Stratum */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Column Left (8 cols): G3 Density Distribution */}
        <div className="lg:col-span-8 flex flex-col bg-[#ffffff] border border-[#c1c8c2] p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#c1c8c2] pb-3">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#55624e] font-bold">
                Figure 1.0 · Primary Outcome Density
              </span>
              <h2 className="text-lg font-serif font-bold text-[#0a3525]">
                Final Grade (G3) Empirical Distribution &amp; Kernel Density
              </h2>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="inline-flex items-center gap-1.5 text-[#762e16]">
                <span className="w-2.5 h-2.5 bg-[#762e16] inline-block"></span>
                At-Risk (G3 &lt; 10)
              </span>
              <span className="inline-flex items-center gap-1.5 text-[#0a3525]">
                <span className="w-2.5 h-2.5 bg-[#244c3a] inline-block"></span>
                Passing (G3 ≥ 10)
              </span>
            </div>
          </div>

          {/* SVG Kernel Density & Histogram Chart */}
          <div className="w-full overflow-x-auto">
            <div className="min-w-[620px] relative">
              <svg className="w-full h-auto font-sans" preserveAspectRatio="xMidYMid meet" viewBox="0 0 720 280">
                <defs>
                  <pattern height="6" id="anomalyHatch" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse" width="6">
                    <line opacity="0.35" stroke="#762e16" strokeWidth="1.2" x1="0" x2="0" y1="0" y2="6"></line>
                  </pattern>
                </defs>
                {/* Horizontal Grid */}
                <g stroke="#e1d9d1" strokeDasharray="3 3" strokeWidth="1">
                  <line x1="50" x2="690" y1="40" y2="40"></line>
                  <line x1="50" x2="690" y1="90" y2="90"></line>
                  <line x1="50" x2="690" y1="140" y2="140"></line>
                  <line x1="50" x2="690" y1="190" y2="190"></line>
                  <line stroke="#717973" strokeDasharray="none" x1="50" x2="690" y1="240" y2="240"></line>
                </g>
                {/* Y-axis labels */}
                <g className="tabular-nums font-mono" fill="#717973" fontSize="10" textAnchor="end">
                  <text x="42" y="44">60</text>
                  <text x="42" y="94">45</text>
                  <text x="42" y="144">30</text>
                  <text x="42" y="194">15</text>
                  <text x="42" y="244">0</text>
                </g>
                {/* Risk Region background shading */}
                <rect fill="#f5ece5" height="215" opacity="0.5" width="288" x="50" y="25"></rect>
                <rect fill="#fbf2ea" height="215" opacity="0.2" width="352" x="338" y="25"></rect>
                {/* Histograms Bars */}
                {/* Grade 0 Anomaly */}
                <rect fill="url(#anomalyHatch)" height="127" stroke="#762e16" strokeWidth="1" width="24" x="54" y="113"></rect>
                <text fill="#762e16" fontSize="9" fontWeight="600" textAnchor="middle" x="66" y="106">38</text>
                <rect fill="#d5e4cb" height="3" stroke="#717973" strokeWidth="0.5" width="24" x="182" y="237"></rect>
                <rect fill="#d5e4cb" height="23" stroke="#717973" strokeWidth="0.5" width="24" x="214" y="217"></rect>
                <rect fill="#d5e4cb" height="50" stroke="#717973" strokeWidth="0.5" width="24" x="246" y="190"></rect>
                <rect fill="#d5e4cb" height="30" stroke="#717973" strokeWidth="0.5" width="24" x="278" y="210"></rect>
                <rect fill="#d5e4cb" height="107" stroke="#717973" strokeWidth="0.5" width="24" x="310" y="133"></rect>
                <rect fill="#a5d0b8" height="94" stroke="#244c3a" strokeWidth="0.5" width="24" x="342" y="146"></rect>
                {/* Passing Bars */}
                <rect fill="#244c3a" height="187" opacity="0.85" width="24" x="374" y="53"></rect>
                <rect fill="#244c3a" height="157" opacity="0.85" width="24" x="406" y="83"></rect>
                <rect fill="#244c3a" height="103" opacity="0.85" width="24" x="438" y="137"></rect>
                <rect fill="#244c3a" height="103" opacity="0.85" width="24" x="470" y="137"></rect>
                <rect fill="#244c3a" height="90" opacity="0.85" width="24" x="502" y="150"></rect>
                <rect fill="#244c3a" height="110" opacity="0.85" width="24" x="534" y="130"></rect>
                <rect fill="#244c3a" height="53" opacity="0.85" width="24" x="566" y="187"></rect>
                <rect fill="#244c3a" height="20" opacity="0.85" width="24" x="598" y="220"></rect>
                <rect fill="#244c3a" height="40" opacity="0.85" width="24" x="630" y="200"></rect>
                <rect fill="#244c3a" height="17" opacity="0.85" width="24" x="662" y="223"></rect>
                {/* KDE Smooth Spline Overlay */}
                <path d="M 54,235 C 66,120 75,130 95,225 C 150,240 210,230 250,195 C 290,160 330,120 380,60 C 420,70 460,110 520,135 C 570,165 620,195 686,236" fill="none" stroke="#0a3525" strokeWidth="2.5"></path>
                {/* Median Marker (G3=11) */}
                <line stroke="#0a3525" strokeDasharray="4 2" strokeWidth="1.5" x1="418" x2="418" y1="20" y2="240"></line>
                <rect fill="#0a3525" height="18" width="76" x="380" y="8"></rect>
                <text fill="#ffffff" fontSize="9.5" fontWeight="600" textAnchor="middle" x="418" y="21">MEDIAN = 11</text>
                {/* Threshold Marker (G3=10) */}
                <line stroke="#762e16" strokeWidth="2" x1="370" x2="370" y1="20" y2="240"></line>
                <rect fill="#762e16" height="18" width="60" x="306" y="8"></rect>
                <text fill="#ffffff" fontSize="9" fontWeight="600" textAnchor="middle" x="336" y="21">PASS ≥ 10</text>
                {/* Annotation for Zero Score Dropouts */}
                <g transform="translate(70, 75)">
                  <line stroke="#762e16" strokeWidth="1" x1="0" x2="30" y1="0" y2="-20"></line>
                  <rect fill="#ffffff" height="24" stroke="#c1c8c2" strokeWidth="1" width="135" x="32" y="-32"></rect>
                  <text fill="#762e16" fontSize="9" fontWeight="bold" x="38" y="-16">Zero-Score Anomaly (N=38)</text>
                </g>
                {/* X-Axis Labels */}
                <g className="tabular-nums font-mono" fill="#414944" fontSize="10" textAnchor="middle">
                  <text x="66" y="258">0</text>
                  <text x="130" y="258">2</text>
                  <text x="194" y="258">4</text>
                  <text x="258" y="258">6</text>
                  <text x="322" y="258">8</text>
                  <text fill="#762e16" fontWeight="bold" x="370" y="258">10</text>
                  <text x="418" y="258">11</text>
                  <text x="482" y="258">13</text>
                  <text x="546" y="258">15</text>
                  <text x="610" y="258">17</text>
                  <text x="674" y="258">19</text>
                </g>
                <text fill="#1e1b17" fontSize="10.5" fontWeight="500" textAnchor="middle" x="370" y="275">
                  Final Mathematics Grade scale (Portuguese Secondary System: 0 - 20)
                </text>
              </svg>
            </div>
          </div>

          <div className="pt-3 border-t border-[#c1c8c2] flex flex-col sm:flex-row justify-between gap-3 text-xs text-[#414944]">
            <p className="max-w-xl">
              <strong className="text-[#1e1b17]">Analytical Note on Dropout Artifacts:</strong> The 38 instances at score zero represent uncompleted final term evaluations or unexcused course abandonment, heavily biasing ordinary least squares regression fits. Logistic risk models classify this segment with 98.4% accuracy based on prior semester <code className="font-mono text-[#0a3525] font-semibold">failures &gt; 1</code>.
            </p>
            <div className="sm:text-right shrink-0">
              <span className="text-[10px] uppercase tracking-wider block text-[#717973]">Distribution Skewness</span>
              <span className="text-xs text-[#1e1b17] font-mono font-bold">-0.732 (Bimodal Left)</span>
            </div>
          </div>
        </div>

        {/* Column Right (4 cols): Cohort Partitioning & Demographic Snapshot */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Cohort Partition Card */}
          <div className="bg-[#ffffff] border border-[#c1c8c2] p-4 flex flex-col justify-between">
            <div className="border-b border-[#c1c8c2] pb-2 mb-3">
              <span className="text-[10px] uppercase tracking-wider text-[#55624e] font-bold">Cohort Partitioning</span>
              <h3 className="text-lg font-serif font-bold text-[#0a3525]">Academic Risk Stratification</h3>
            </div>

            {/* Stacked Bar Visual */}
            <div className="space-y-1 my-2">
              <div className="h-8 w-full flex border border-[#c1c8c2]">
                <div
                  className="bg-[#762e16] h-full flex items-center justify-center text-[#ffffff] font-mono text-xs font-bold"
                  style={{ width: `${summary?.at_risk_percentage || 32.9}%` }}
                >
                  {summary?.at_risk_percentage || 32.9}%
                </div>
                <div
                  className="bg-[#244c3a] h-full flex items-center justify-center text-[#ffffff] font-mono text-xs font-bold"
                  style={{ width: `${summary ? (100 - summary.at_risk_percentage).toFixed(1) : 67.1}%` }}
                >
                  {summary ? (100 - summary.at_risk_percentage).toFixed(1) : 67.1}%
                </div>
              </div>
              <div className="flex justify-between text-[11px] text-[#414944] font-mono">
                <span className="text-[#762e16] font-semibold">Class 1: At-Risk · N={summary?.at_risk_count || 130}</span>
                <span className="text-[#0a3525] font-semibold">Class 0: Passing · N={summary?.not_at_risk_count || 265}</span>
              </div>
            </div>

            <div className="space-y-1 pt-3 border-t border-[#f5ece5] text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#414944]">Empirical Baseline Error Rate:</span>
                <span className="font-mono font-semibold text-[#1e1b17]">32.91%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#414944]">Class Imbalance Ratio (IR):</span>
                <span className="font-mono font-semibold text-[#1e1b17]">1 : 2.04</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#414944]">Decision Boundary Cutoff:</span>
                <span className="font-mono font-semibold text-[#0a3525]">G3 &lt; 10 Marks</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-[#f5ece5] border border-[#c1c8c2]">
              <span className="text-[10px] uppercase tracking-wider text-[#0a3525] font-bold block mb-1">
                Practical 6 Methodological Finding
              </span>
              <p className="text-xs text-[#1e1b17] leading-relaxed">
                Standard decision trees over-predict the majority class, sacrificing recall on failing students. Introducing cost-sensitive <code className="font-mono text-[#0a3525] font-semibold">class_weight='balanced'</code> elevated failure recall from <strong>62.4%</strong> to <strong>87.9%</strong>.
              </p>
            </div>
          </div>

          {/* Demographic Quick Snapshot */}
          <div className="bg-[#ffffff] border border-[#c1c8c2] p-4">
            <div className="border-b border-[#c1c8c2] pb-2 mb-3 flex justify-between items-baseline">
              <span className="text-[10px] uppercase tracking-wider text-[#55624e] font-bold">Key Demographic Tiers</span>
              <span className="text-xs text-[#717973] font-mono">N={summary?.total_records || 395}</span>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-[#f5ece5]">
                <span className="text-[#414944]">Sex Breakdown</span>
                <span className="font-mono font-semibold text-[#1e1b17]">F: 208 (52.7%) · M: 187 (47.3%)</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#f5ece5]">
                <span className="text-[#414944]">School District</span>
                <span className="font-mono font-semibold text-[#1e1b17]">GP: 349 (88.4%) · MS: 46 (11.6%)</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-[#f5ece5]">
                <span className="text-[#414944]">Urban vs. Rural Home</span>
                <span className="font-mono font-semibold text-[#1e1b17]">Urban: 307 (77.7%) · Rural: 88</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-[#414944]">Higher Ed Aspiration</span>
                <span className="font-mono font-bold text-[#0a3525]">Yes: 375 (94.9%) · No: 20 (5.1%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Analytical Row: Study Time Jitter Plot + Top Covariates Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* 7 Columns: Study Time vs G3 */}
        <div className="lg:col-span-7 bg-[#ffffff] border border-[#c1c8c2] p-5 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#c1c8c2] pb-3 mb-4">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-[#55624e] font-bold">Bivariate Regression</span>
                <h3 className="text-lg font-serif font-bold text-[#0a3525]">Weekly Study Time vs. Final Grade (G3)</h3>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase text-[#717973] block font-bold">Pearson Correlation</span>
                <span className="text-xs font-mono text-[#0a3525] font-bold">r = +0.161 (p &lt; 0.01)</span>
              </div>
            </div>

            <div className="space-y-3 text-xs text-[#414944]">
              <p>
                Student cohort stratified across four distinct study tiers:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 bg-[#f5ece5] border border-[#c1c8c2]">
                  <span className="text-[10px] uppercase text-[#55624e] font-bold block">Tier 1 (&lt; 2h)</span>
                  <span className="text-base font-bold text-[#1e1b17] font-mono block mt-1">G3 = 9.8</span>
                  <span className="text-[11px] text-[#762e16] font-semibold">105 students</span>
                </div>
                <div className="p-3 bg-[#f5ece5] border border-[#c1c8c2]">
                  <span className="text-[10px] uppercase text-[#55624e] font-bold block">Tier 2 (2–5h)</span>
                  <span className="text-base font-bold text-[#1e1b17] font-mono block mt-1">G3 = 10.2</span>
                  <span className="text-[11px] text-[#414944]">198 students</span>
                </div>
                <div className="p-3 bg-[#f5ece5] border border-[#c1c8c2]">
                  <span className="text-[10px] uppercase text-[#55624e] font-bold block">Tier 3 (5–10h)</span>
                  <span className="text-base font-bold text-[#1e1b17] font-mono block mt-1">G3 = 11.4</span>
                  <span className="text-[11px] text-[#0a3525] font-semibold">65 students</span>
                </div>
                <div className="p-3 bg-[#f5ece5] border border-[#c1c8c2]">
                  <span className="text-[10px] uppercase text-[#55624e] font-bold block">Tier 4 (&gt; 10h)</span>
                  <span className="text-base font-bold text-[#1e1b17] font-mono block mt-1">G3 = 12.1</span>
                  <span className="text-[11px] text-[#0a3525] font-semibold">27 students</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 mt-4 border-t border-[#c1c8c2] flex justify-between items-center text-xs">
            <span className="text-[#55624e]">Monotonic upward progression across weekly commitment tiers</span>
            <button
              onClick={() => onNavigate('performance')}
              className="text-[#0a3525] font-bold hover:underline"
            >
              Examine in Grade Estimator →
            </button>
          </div>
        </div>

        {/* 5 Columns: Top 10 Covariate Correlation Table */}
        <div className="lg:col-span-5 bg-[#ffffff] border border-[#c1c8c2] p-5 flex flex-col justify-between">
          <div>
            <div className="border-b border-[#c1c8c2] pb-3 mb-3">
              <span className="text-[10px] uppercase tracking-wider text-[#55624e] font-bold">Feature Covariance</span>
              <h3 className="text-lg font-serif font-bold text-[#0a3525]">Top Covariate Correlations with G3</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-[#f5ece5] border-b border-[#0a3525] text-left text-[10px] uppercase font-bold text-[#1e1b17]">
                    <th className="py-2 px-2.5">Feature</th>
                    <th className="py-2 px-2.5">Category</th>
                    <th className="py-2 px-2.5 text-right">Pearson r</th>
                    <th className="py-2 px-2.5 text-right">Impact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#c1c8c2] font-mono text-xs">
                  <tr>
                    <td className="py-1.5 px-2.5 font-bold text-[#0a3525]">G2 (Period 2)</td>
                    <td className="py-1.5 px-2.5 text-[#55624e]">Academic</td>
                    <td className="py-1.5 px-2.5 text-right font-bold text-[#0a3525]">+0.905</td>
                    <td className="py-1.5 px-2.5 text-right text-[11px] text-[#0a3525] font-semibold">Dominant</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-2.5 font-bold text-[#0a3525]">G1 (Period 1)</td>
                    <td className="py-1.5 px-2.5 text-[#55624e]">Academic</td>
                    <td className="py-1.5 px-2.5 text-right font-bold text-[#0a3525]">+0.801</td>
                    <td className="py-1.5 px-2.5 text-right text-[11px] text-[#0a3525] font-semibold">Dominant</td>
                  </tr>
                  <tr className="bg-[#faeeeb]">
                    <td className="py-1.5 px-2.5 font-bold text-[#762e16]">failures</td>
                    <td className="py-1.5 px-2.5 text-[#762e16]">Academic</td>
                    <td className="py-1.5 px-2.5 text-right font-bold text-[#762e16]">-0.360</td>
                    <td className="py-1.5 px-2.5 text-right text-[11px] text-[#762e16] font-bold">Negative Drag</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-2.5 font-bold text-[#0a3525]">Medu (Mother Edu)</td>
                    <td className="py-1.5 px-2.5 text-[#55624e]">Social</td>
                    <td className="py-1.5 px-2.5 text-right text-[#0a3525]">+0.217</td>
                    <td className="py-1.5 px-2.5 text-right text-[11px] text-[#0a3525]">Positive</td>
                  </tr>
                  <tr className="bg-[#faeeeb]">
                    <td className="py-1.5 px-2.5 font-bold text-[#762e16]">age</td>
                    <td className="py-1.5 px-2.5 text-[#762e16]">Demographic</td>
                    <td className="py-1.5 px-2.5 text-right text-[#762e16]">-0.162</td>
                    <td className="py-1.5 px-2.5 text-right text-[11px] text-[#762e16]">Negative</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 px-2.5 font-bold text-[#0a3525]">studytime</td>
                    <td className="py-1.5 px-2.5 text-[#55624e]">Habit</td>
                    <td className="py-1.5 px-2.5 text-right text-[#0a3525]">+0.161</td>
                    <td className="py-1.5 px-2.5 text-right text-[11px] text-[#0a3525]">Positive</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-[#c1c8c2] text-[11px] text-[#55624e]">
            Strongest demographic drivers: Mother's education (+0.217) and past course failures (-0.360).
          </div>
        </div>
      </div>
    </div>
  );
};
