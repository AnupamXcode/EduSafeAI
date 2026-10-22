import React, { useEffect, useState } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
  LineChart,
} from 'recharts';
import { RegressionResponse, StudentInput, GradePredictionResult } from '../types';
import { api } from '../api/client';
import { Calculator, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';

interface PerformancePageProps {
  course: string;
}

export const PerformancePage: React.FC<PerformancePageProps> = ({ course }) => {
  const [earlyMode, setEarlyMode] = useState(false);
  const [data, setData] = useState<RegressionResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Interactive prediction form state
  const [student, setStudent] = useState<StudentInput>({
    school: 'GP',
    sex: 'F',
    age: 17,
    address: 'U',
    famsize: 'GT3',
    Pstatus: 'T',
    Medu: 3,
    Fedu: 2,
    Mjob: 'other',
    Fjob: 'other',
    reason: 'course',
    guardian: 'mother',
    traveltime: 1,
    studytime: 2,
    failures: 0,
    schoolsup: 'no',
    famsup: 'yes',
    paid: 'no',
    activities: 'yes',
    nursery: 'yes',
    higher: 'yes',
    internet: 'yes',
    romantic: 'no',
    famrel: 4,
    freetime: 3,
    goout: 3,
    Dalc: 1,
    Walc: 2,
    health: 4,
    absences: 4,
    G1: 12,
    G2: 12,
  });

  const [prediction, setPrediction] = useState<GradePredictionResult | null>(null);
  const [predicting, setPredicting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    api
      .getRegressionModels(course, earlyMode)
      .then((res) => {
        if (isMounted) setData(res);
      })
      .catch((err) => console.error(err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [course, earlyMode]);

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setPredicting(true);
    try {
      const res = await api.predictGrade(student, earlyMode);
      setPrediction(res);
    } catch (err) {
      console.error(err);
    } finally {
      setPredicting(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Editorial Title & Mode Toggle */}
      <div className="flex flex-wrap justify-between items-end border-b border-[#D9D2C3] pb-6 gap-4">
        <div>
          <h2 className="text-3xl font-normal text-[#244C3A] tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>
            Academic Performance & Grade Regression
          </h2>
          <p className="text-sm text-[#332F2A] opacity-80 mt-1 max-w-2xl leading-relaxed">
            Estimates continuous final examination grade <strong>G3 (0–20 scale)</strong> using Simple and Multiple Linear Regression.
            Evaluated on an 80:20 train/test partition with strict data leakage prevention.
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

      {/* Regression Metrics Cards */}
      {data && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="panel p-5 bg-[#FFFFFF]">
            <span className="label-title text-[#244C3A]">Mean Absolute Error (MAE)</span>
            <div className="text-3xl font-bold text-[#332F2A] num mt-1">
              {data.multiple_metrics.test_mae.toFixed(3)}
            </div>
            <p className="text-xs text-[#332F2A] opacity-70 mt-1">
              Average error: &plusmn;{data.multiple_metrics.test_mae.toFixed(2)} marks on 20-pt scale
            </p>
          </div>

          <div className="panel p-5 bg-[#FFFFFF]">
            <span className="label-title text-[#244C3A]">Root Mean Squared Error (RMSE)</span>
            <div className="text-3xl font-bold text-[#332F2A] num mt-1">
              {data.multiple_metrics.test_rmse.toFixed(3)}
            </div>
            <p className="text-xs text-[#332F2A] opacity-70 mt-1">
              Penalizes large outlier forecast errors
            </p>
          </div>

          <div className="panel p-5 bg-[#FFFFFF]">
            <span className="label-title text-[#244C3A]">Test R² Score</span>
            <div className="text-3xl font-bold text-[#244C3A] num mt-1">
              {data.multiple_metrics.test_r2.toFixed(3)}
            </div>
            <p className="text-xs text-[#332F2A] opacity-70 mt-1">
              {(data.multiple_metrics.test_r2 * 100).toFixed(1)}% of total grade variance explained
            </p>
          </div>

          <div className="panel p-5 bg-[#FFFFFF]">
            <span className="label-title text-[#244C3A]">Simple vs Multiple Gain</span>
            <div className="text-xl font-bold text-[#332F2A] num mt-2">
              Simple R²: {data.simple_metrics.test_r2.toFixed(3)}
            </div>
            <p className="text-xs text-[#332F2A] opacity-70 mt-1">
              Predictor: {data.simple_metrics.predictor} (Slope: {data.simple_metrics.slope?.toFixed(2)})
            </p>
          </div>
        </div>
      )}

      {/* Actual vs Predicted and Regression Line Charts */}
      {data && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Actual vs Predicted Scatter (8 cols) */}
          <div className="lg:col-span-7 panel p-6 bg-[#FFFFFF]">
            <div className="border-b border-[#D9D2C3] pb-3 mb-4 flex justify-between items-baseline">
              <div>
                <h3 className="text-base font-semibold text-[#244C3A]" style={{ fontFamily: 'var(--font-serif)' }}>
                  Actual vs Predicted Grade (Multiple Linear Regression)
                </h3>
                <p className="text-xs text-[#332F2A] opacity-75">
                  Points clustering along the diagonal line y = x indicate superior prediction accuracy.
                </p>
              </div>
              <span className="badge-nominal">Test Set (80:20)</span>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#D9D2C3" />
                  <XAxis
                    type="number"
                    dataKey="actual"
                    name="Actual G3"
                    domain={[0, 20]}
                    tick={{ fill: '#332F2A', fontSize: 11 }}
                    label={{ value: 'Actual Grade G3', position: 'insideBottom', offset: -5, fontSize: 11, fill: '#332F2A' }}
                  />
                  <YAxis
                    type="number"
                    dataKey="predicted"
                    name="Predicted G3"
                    domain={[0, 20]}
                    tick={{ fill: '#332F2A', fontSize: 11 }}
                    label={{ value: 'Predicted Grade G3', angle: -90, position: 'insideLeft', offset: 15, fontSize: 11, fill: '#332F2A' }}
                  />
                  <Tooltip
                    cursor={{ strokeDasharray: '3 3' }}
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #244C3A',
                      borderRadius: '0px',
                      fontSize: '11px',
                    }}
                  />
                  <Scatter data={data.actual_vs_predicted} fill="#244C3A" opacity={0.7} />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Simple Linear Regression Fit (5 cols) */}
          <div className="lg:col-span-5 panel p-6 bg-[#FFFFFF]">
            <div className="border-b border-[#D9D2C3] pb-3 mb-4">
              <h3 className="text-base font-semibold text-[#244C3A]" style={{ fontFamily: 'var(--font-serif)' }}>
                Simple Linear Regression Fit
              </h3>
              <p className="text-xs text-[#332F2A] opacity-75">
                Equation: <code className="text-[#244C3A] font-semibold">{data.simple_metrics.equation}</code>
              </p>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.simple_regression_line} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#D9D2C3" />
                  <XAxis
                    dataKey="x"
                    domain={[0, 20]}
                    tick={{ fill: '#332F2A', fontSize: 11 }}
                    label={{ value: `${data.simple_metrics.predictor} Grade`, position: 'insideBottom', offset: -5, fontSize: 11, fill: '#332F2A' }}
                  />
                  <YAxis
                    domain={[0, 20]}
                    tick={{ fill: '#332F2A', fontSize: 11 }}
                    label={{ value: 'Predicted G3', angle: -90, position: 'insideLeft', offset: 20, fontSize: 11, fill: '#332F2A' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #244C3A',
                      borderRadius: '0px',
                      fontSize: '11px',
                    }}
                  />
                  <Line type="linear" dataKey="y" stroke="#C66B4E" strokeWidth={2.5} dot={{ fill: '#244C3A', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Feature Coefficients Table and Live Interactive Prediction Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Top Regression Coefficients (6 cols) */}
        <div className="lg:col-span-6 panel bg-[#FFFFFF]">
          <div className="p-4 border-b border-[#D9D2C3]">
            <h3 className="text-base font-semibold text-[#244C3A]" style={{ fontFamily: 'var(--font-serif)' }}>
              Top Regression Coefficients (Feature Weights)
            </h3>
            <p className="text-xs text-[#332F2A] opacity-75">
              Magnitude and direction of impact on final grade G3:
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="academic-table">
              <thead>
                <tr>
                  <th>Feature Variable</th>
                  <th className="text-right">Coefficient Weight</th>
                  <th className="text-right">Impact Type</th>
                </tr>
              </thead>
              <tbody>
                {data?.coefficients.map((row, idx) => (
                  <tr key={idx}>
                    <td className="font-mono text-xs">{row.feature}</td>
                    <td className={`text-right num font-semibold ${row.coefficient >= 0 ? 'text-[#244C3A]' : 'text-[#C66B4E]'}`}>
                      {row.coefficient > 0 ? `+${row.coefficient.toFixed(3)}` : row.coefficient.toFixed(3)}
                    </td>
                    <td className="text-right text-xs">
                      {row.coefficient >= 0 ? (
                        <span className="text-[#244C3A]">Positive Driver</span>
                      ) : (
                        <span className="text-[#C66B4E]">Negative Drag</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Interactive Grade Prediction Form (6 cols) */}
        <div className="lg:col-span-6 panel p-6 bg-[#FFFFFF]">
          <div className="border-b border-[#D9D2C3] pb-3 mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-[#244C3A]" style={{ fontFamily: 'var(--font-serif)' }}>
                Individual Student Grade Estimator
              </h3>
              <p className="text-xs text-[#332F2A] opacity-75">
                Input student record attributes to forecast final examination score in real time.
              </p>
            </div>
            <Calculator size={18} className="text-[#244C3A]" />
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
              High Achiever
            </button>
            <button
              type="button"
              onClick={() =>
                setStudent({
                  ...student,
                  G1: 10,
                  G2: 10,
                  failures: 0,
                  studytime: 2,
                  absences: 6,
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
                  G2: 7,
                  failures: 2,
                  studytime: 1,
                  absences: 18,
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

          <form onSubmit={handlePredict} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label-title">Unit Test 1 (UT 1: 0-20)</label>
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
                  <label className="label-title">Unit Test 2 (UT 2: 0-20)</label>
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
                <label className="label-title">Past Failures (0-4)</label>
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
                <label className="label-title">Weekly Study Time</label>
                <select
                  value={student.studytime}
                  onChange={(e) => setStudent({ ...student, studytime: Number(e.target.value) })}
                  className="input-field"
                >
                  <option value={1}>&lt; 2 hours</option>
                  <option value={2}>2 - 5 hours</option>
                  <option value={3}>5 - 10 hours</option>
                  <option value={4}>&gt; 10 hours</option>
                </select>
              </div>

              <div>
                <label className="label-title">Absences (0-93)</label>
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
                <label className="label-title">Mother Education (Medu)</label>
                <select
                  value={student.Medu}
                  onChange={(e) => setStudent({ ...student, Medu: Number(e.target.value) })}
                  className="input-field"
                >
                  <option value={0}>None</option>
                  <option value={1}>Primary (4th grade)</option>
                  <option value={2}>5th - 9th grade</option>
                  <option value={3}>Secondary</option>
                  <option value={4}>Higher Education</option>
                </select>
              </div>
            </div>

            <button type="submit" disabled={predicting} className="btn-primary w-full justify-center">
              {predicting ? 'Computing Linear Model...' : 'Calculate Predicted Final Grade'}
            </button>
          </form>

          {/* Prediction Output Box */}
          {prediction && (
            <div className="mt-5 p-4 border border-[#244C3A] bg-[#F8F6F0]">
              <div className="flex justify-between items-baseline">
                <span className="text-xs uppercase tracking-wider font-semibold text-[#244C3A]">
                  Forecasted Final Grade:
                </span>
                <span className="text-2xl font-bold text-[#244C3A] num">
                  {prediction.predicted_g3} / 20
                </span>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <span className={prediction.risk_status === 'At Risk' ? 'badge-risk' : 'badge-nominal'}>
                  {prediction.risk_status}
                </span>
                <span className="text-xs text-[#332F2A] opacity-75">
                  Expected error margin: &plusmn;{prediction.expected_error_margin} marks
                </span>
              </div>

              <div className="mt-3 pt-3 border-t border-[#D9D2C3]">
                <span className="text-xs font-semibold text-[#332F2A] block mb-1">
                  Key Contributing Factors:
                </span>
                <ul className="text-xs text-[#332F2A] opacity-80 space-y-1 list-disc list-inside">
                  {prediction.drivers.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
