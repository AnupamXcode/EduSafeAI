import React, { useState } from 'react';
import { api } from '../api/client';
import { StudentInput, GradePredictionResult, RiskPredictionResult } from '../types';
import { Calculator, AlertTriangle, CheckCircle, Sparkles, HelpCircle, ShieldAlert, CheckCircle2, RefreshCw, ArrowRight } from 'lucide-react';

interface PredictionPageProps {
  course: string;
}

interface PresetStudentRecord {
  name: string;
  badge: string;
  actualG3: number;
  data: Partial<StudentInput>;
}

export const PredictionPage: React.FC<PredictionPageProps> = ({ course }) => {
  const [earlyMode, setEarlyMode] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [gradeResult, setGradeResult] = useState<GradePredictionResult | null>(null);
  const [riskResult, setRiskResult] = useState<RiskPredictionResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<PresetStudentRecord | null>(null);

  // Form student state
  const [student, setStudent] = useState<StudentInput>({
    school: 'GP',
    sex: 'F',
    age: 16,
    address: 'U',
    famsize: 'GT3',
    Pstatus: 'T',
    Medu: 3,
    Fedu: 3,
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
    Walc: 1,
    health: 4,
    absences: 4,
    G1: 12,
    G2: 13,
  });

  const presets: Record<'good' | 'average' | 'at_risk', PresetStudentRecord> = {
    good: {
      name: 'High Achiever (Exemplar Record)',
      badge: 'Expected Passing (Safe)',
      actualG3: 16,
      data: {
        G1: 16,
        G2: 16,
        failures: 0,
        studytime: 3,
        absences: 2,
        Medu: 4,
        Fedu: 4,
        higher: 'yes',
        internet: 'yes',
        health: 5,
        freetime: 2,
      },
    },
    average: {
      name: 'Average Student (Balanced Record)',
      badge: 'Borderline Passing',
      actualG3: 11,
      data: {
        G1: 11,
        G2: 11,
        failures: 0,
        studytime: 2,
        absences: 6,
        Medu: 2,
        Fedu: 2,
        higher: 'yes',
        internet: 'yes',
        health: 3,
        freetime: 3,
      },
    },
    at_risk: {
      name: 'At-Risk Student (Vulnerable Record)',
      badge: 'Critical Intervention Needed',
      actualG3: 7,
      data: {
        G1: 7,
        G2: 6,
        failures: 2,
        studytime: 1,
        absences: 16,
        Medu: 1,
        Fedu: 1,
        higher: 'no',
        internet: 'no',
        health: 2,
        freetime: 4,
      },
    },
  };

  const handleApplyPreset = (key: 'good' | 'average' | 'at_risk') => {
    const preset = presets[key];
    setSelectedPreset(preset);
    setStudent((prev) => ({
      ...prev,
      ...preset.data,
    }));
  };

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      // Call genuine Python ML backend for regression grade and classification risk
      const [gRes, rRes] = await Promise.all([
        api.predictGrade(student, earlyMode),
        api.predictRisk(student, earlyMode),
      ]);
      setGradeResult(gRes);
      setRiskResult(rRes);
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Unable to connect to ML backend. Please confirm FastAPI is running at http://127.0.0.1:8000.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-12 space-y-8">
      {/* Page Header */}
      <section className="space-y-3 animate-slide-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E9E4F5] text-[#5146A5] rounded-full text-xs font-semibold">
          <Calculator size={14} className="text-[#F28C45]" />
          <span>Interactive Model Lab: Live Regression &amp; Risk Classification</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#17243B] tracking-tight">
          Try predicting a student's final grade.
        </h1>
        <p className="text-base text-[#555866] max-w-3xl leading-relaxed">
          Enter the available student information and see what the trained model estimates. Form and predictions sit side-by-side on desktop for rapid testing during faculty demonstrations.
        </p>
      </section>

      {/* Preset Quick-Load Ribbon */}
      <section className="p-4 bg-[#FFFFFF] border border-[#E9E4F5] rounded-2xl shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Sparkles size={16} className="text-[#F28C45]" />
          <span className="text-xs font-bold text-[#17243B]">1-Click Test Student Presets:</span>
          <span className="text-xs text-[#555866] hidden sm:inline">(Populate form instantly for viva defense)</span>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleApplyPreset('good')}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#E9E4F5] text-[#5146A5] hover:bg-[#5146A5] hover:text-[#FFFFFF] transition-all cursor-pointer border border-[#E9E4F5]"
          >
            Good Student (Passing)
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset('average')}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#FAF7F0] text-[#17243B] hover:bg-[#17243B] hover:text-[#FFFFFF] transition-all cursor-pointer border border-[#E9E4F5]"
          >
            Average Student (Borderline)
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset('at_risk')}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#FBE6D5] text-[#D6732E] hover:bg-[#F28C45] hover:text-[#FFFFFF] transition-all cursor-pointer border border-[#FBE6D5]"
          >
            At-Risk Student (Intervention)
          </button>
        </div>
      </section>

      {/* Desktop Two-Column Layout (Side-by-Side: 7 cols form, 5 cols result) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Student Input Form (7 cols) */}
        <div className="lg:col-span-7 bg-[#FFFFFF] border border-[#E9E4F5] rounded-2xl p-6 sm:p-7 shadow-2xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#FAF7F0] pb-4">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#17243B]">Student Attributes Form</h2>
              <p className="text-xs text-[#555866]">Configure demographic and academic indicators</p>
            </div>

            {/* Early vs Later Mode Toggle */}
            <div className="flex items-center gap-2 bg-[#FAF7F0] p-1 rounded-xl border border-[#E9E4F5]">
              <button
                type="button"
                onClick={() => setEarlyMode(false)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  !earlyMode ? 'bg-[#5146A5] text-[#FFFFFF] shadow-2xs' : 'text-[#555866] hover:text-[#17243B]'
                }`}
              >
                Later Mode (G1 + G2)
              </button>
              <button
                type="button"
                onClick={() => setEarlyMode(true)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  earlyMode ? 'bg-[#5146A5] text-[#FFFFFF] shadow-2xs' : 'text-[#555866] hover:text-[#17243B]'
                }`}
              >
                Early Mode (No G2)
              </button>
            </div>
          </div>

          <form onSubmit={handlePredict} className="space-y-5">
            {/* Academic Grades Row */}
            <div className="p-4 bg-[#FAF7F0] rounded-xl border border-[#E9E4F5] space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#5146A5] block">
                Academic Performance Indicators
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* G1 */}
                <div>
                  <label className="font-semibold text-[#17243B] block mb-1">
                    First Period Grade (G1: 0 to 20)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={student.G1}
                    onChange={(e) => setStudent({ ...student, G1: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#E9E4F5] rounded-lg text-[#17243B] text-sm font-semibold outline-none focus:border-[#5146A5]"
                    required
                  />
                  <span className="text-[10px] text-[#828696] mt-0.5 block">High longitudinal correlation with final grade</span>
                </div>

                {/* G2 */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-[#17243B]">
                      Second Period Grade (G2: 0 to 20)
                    </label>
                    {earlyMode && (
                      <span className="text-[10px] font-bold text-[#F28C45] bg-[#FBE6D5] px-1.5 rounded">
                        Excluded (Early Mode)
                      </span>
                    )}
                  </div>
                  <input
                    type="number"
                    min="0"
                    max="20"
                    disabled={earlyMode}
                    value={earlyMode ? '' : student.G2}
                    placeholder={earlyMode ? 'Not available in Early Warning mode' : '0 to 20'}
                    onChange={(e) => setStudent({ ...student, G2: Number(e.target.value) })}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-semibold outline-none border ${
                      earlyMode
                        ? 'bg-[#E9E4F5]/40 border-[#E9E4F5] text-[#828696] cursor-not-allowed'
                        : 'bg-[#FFFFFF] border-[#E9E4F5] text-[#17243B] focus:border-[#5146A5]'
                    }`}
                    required={!earlyMode}
                  />
                  <span className="text-[10px] text-[#828696] mt-0.5 block">
                    {earlyMode ? 'Simulates early warning before midterm exam' : 'Midterm exam milestone score'}
                  </span>
                </div>
              </div>
            </div>

            {/* Core Study & Behavioral Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Study Time */}
              <div>
                <label className="font-semibold text-[#17243B] block mb-1">
                  Weekly Study Time
                </label>
                <select
                  value={student.studytime}
                  onChange={(e) => setStudent({ ...student, studytime: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-[#FAF7F0] border border-[#E9E4F5] rounded-lg text-[#17243B] text-sm outline-none focus:border-[#5146A5] cursor-pointer"
                >
                  <option value={1}>1: &lt; 2 hours per week</option>
                  <option value={2}>2: 2 – 5 hours per week</option>
                  <option value={3}>3: 5 – 10 hours per week</option>
                  <option value={4}>4: &gt; 10 hours per week</option>
                </select>
              </div>

              {/* Past Failures */}
              <div>
                <label className="font-semibold text-[#17243B] block mb-1">
                  Previous Class Failures (0 to 3)
                </label>
                <select
                  value={student.failures}
                  onChange={(e) => setStudent({ ...student, failures: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-[#FAF7F0] border border-[#E9E4F5] rounded-lg text-[#17243B] text-sm outline-none focus:border-[#5146A5] cursor-pointer"
                >
                  <option value={0}>0 failures (Clean track record)</option>
                  <option value={1}>1 previous failure</option>
                  <option value={2}>2 previous failures</option>
                  <option value={3}>3 or more failures</option>
                </select>
              </div>

              {/* Absences */}
              <div>
                <label className="font-semibold text-[#17243B] block mb-1">
                  School Absences (0 to 93 days)
                </label>
                <input
                  type="number"
                  min="0"
                  max="93"
                  value={student.absences}
                  onChange={(e) => setStudent({ ...student, absences: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-[#FAF7F0] border border-[#E9E4F5] rounded-lg text-[#17243B] text-sm outline-none focus:border-[#5146A5]"
                  required
                />
              </div>

              {/* Mother's Education */}
              <div>
                <label className="font-semibold text-[#17243B] block mb-1">
                  Mother's Education (Medu)
                </label>
                <select
                  value={student.Medu}
                  onChange={(e) => setStudent({ ...student, Medu: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-[#FAF7F0] border border-[#E9E4F5] rounded-lg text-[#17243B] text-sm outline-none focus:border-[#5146A5] cursor-pointer"
                >
                  <option value={1}>1: Primary (4th grade)</option>
                  <option value={2}>2: 5th to 9th grade</option>
                  <option value={3}>3: Secondary Education</option>
                  <option value={4}>4: Higher Education (University)</option>
                </select>
              </div>

              {/* Higher Education Aspiration */}
              <div>
                <label className="font-semibold text-[#17243B] block mb-1">
                  Wants Higher Education?
                </label>
                <select
                  value={student.higher}
                  onChange={(e) => setStudent({ ...student, higher: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAF7F0] border border-[#E9E4F5] rounded-lg text-[#17243B] text-sm outline-none focus:border-[#5146A5] cursor-pointer"
                >
                  <option value="yes">Yes (Aspires for university)</option>
                  <option value="no">No</option>
                </select>
              </div>

              {/* Internet Access */}
              <div>
                <label className="font-semibold text-[#17243B] block mb-1">
                  Home Internet Access?
                </label>
                <select
                  value={student.internet}
                  onChange={(e) => setStudent({ ...student, internet: e.target.value })}
                  className="w-full px-3 py-2 bg-[#FAF7F0] border border-[#E9E4F5] rounded-lg text-[#17243B] text-sm outline-none focus:border-[#5146A5] cursor-pointer"
                >
                  <option value="yes">Yes (Has internet at home)</option>
                  <option value="no">No</option>
                </select>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-[#FBE6D5] border border-[#F28C45] text-[#D6732E] rounded-xl text-xs flex items-center gap-2">
                <AlertTriangle size={16} />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-[#F28C45] to-[#F2C14E] text-[#FFFFFF] font-bold rounded-xl text-sm sm:text-base hover:brightness-105 active:scale-98 transition-all cursor-pointer shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw size={18} className="animate-spin" />
                  <span>Computing Prediction on Backend...</span>
                </>
              ) : (
                <>
                  <span>Predict Student Performance</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Prediction Results (5 cols) */}
        <div className="lg:col-span-5 bg-[#FFFFFF] border border-[#E9E4F5] rounded-2xl p-6 sm:p-7 space-y-6 shadow-2xs sticky top-24">
          <div className="border-b border-[#FAF7F0] pb-3 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#5146A5]">
                Model Output
              </span>
              <h2 className="font-serif text-xl font-bold text-[#17243B]">Estimated Prediction</h2>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-[#E9E4F5] text-[#5146A5] text-xs font-semibold">
              FastAPI Real-Time
            </span>
          </div>

          {gradeResult ? (
            <div className="space-y-6 animate-scale-in">
              {/* Predicted Final Grade Large Display */}
              <div className="p-6 bg-gradient-to-br from-[#FAF7F0] to-[#E9E4F5]/50 rounded-2xl border border-[#E9E4F5] text-center space-y-2">
                <span className="text-xs text-[#555866] font-bold uppercase tracking-wider block">
                  Predicted Final Grade (G3)
                </span>
                <div className="text-5xl font-serif font-bold text-[#17243B]">
                  {gradeResult.predicted_g3.toFixed(1)}{' '}
                  <span className="text-lg text-[#828696] font-sans font-normal">/ 20</span>
                </div>
                <p className="text-xs text-[#555866]">
                  Expected Margin: &plusmn;{gradeResult.expected_error_margin.toFixed(2)} marks (on 20-point scale)
                </p>

                {/* Horizontal Grade Scale */}
                <div className="pt-4 space-y-1.5">
                  <div className="h-4 w-full bg-[#FAF7F0] border border-[#E9E4F5] rounded-full relative overflow-hidden p-0.5">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        gradeResult.predicted_g3 < 10
                          ? 'bg-gradient-to-r from-[#D6732E] to-[#F28C45]'
                          : 'bg-gradient-to-r from-[#5146A5] to-[#789579]'
                      }`}
                      style={{ width: `${Math.min(100, Math.max(0, (gradeResult.predicted_g3 / 20) * 100))}%` }}
                    ></div>
                    {/* 10 mark indicator */}
                    <div className="absolute top-0 bottom-0 left-[50%] w-0.5 bg-[#F28C45] z-10"></div>
                  </div>
                  <div className="flex justify-between text-[11px] text-[#828696] font-mono px-1">
                    <span>0 (Fail)</span>
                    <span className="text-[#F28C45] font-bold">10 (Project Pass Cutoff)</span>
                    <span>20 (Max)</span>
                  </div>
                </div>
              </div>

              {/* Academic Risk Classification Card */}
              <div
                className={`p-5 rounded-2xl border ${
                  gradeResult.predicted_g3 < 10
                    ? 'bg-[#FBE6D5] border-[#F28C45] text-[#D6732E]'
                    : 'bg-[#E9E4F5] border-[#5146A5] text-[#5146A5]'
                } flex items-start gap-3.5`}
              >
                {gradeResult.predicted_g3 < 10 ? (
                  <ShieldAlert size={26} className="shrink-0 mt-0.5 text-[#F28C45]" />
                ) : (
                  <CheckCircle2 size={26} className="shrink-0 mt-0.5 text-[#5146A5]" />
                )}
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-serif font-bold text-base">
                      {gradeResult.predicted_g3 < 10 ? 'Academic Risk Status: At Risk' : 'Academic Risk Status: Not At Risk'}
                    </h4>
                  </div>
                  <p className="text-xs text-[#292B33] leading-relaxed">
                    {gradeResult.predicted_g3 < 10
                      ? 'Student is projected to score below 10 marks. Remedial coursework, mentor check-ins, and parental consultation are recommended.'
                      : 'Student is projected to meet academic standards. Recommend continued self-directed study and advanced projects.'}
                  </p>
                </div>
              </div>

              {/* Retrospective Comparison with Actual Grade if Preset loaded */}
              {selectedPreset && (
                <div className="p-4 bg-[#FAF7F0] border border-[#E9E4F5] rounded-xl text-xs space-y-1.5">
                  <span className="text-[11px] font-bold text-[#5146A5] uppercase block">
                    Retrospective Verification ({selectedPreset.name})
                  </span>
                  <div className="flex justify-between">
                    <span className="text-[#555866]">Actual Exam Grade in Record:</span>
                    <strong className="text-[#17243B] font-mono">{selectedPreset.actualG3} / 20</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#555866]">Predicted by Model:</span>
                    <strong className="text-[#5146A5] font-mono">{gradeResult.predicted_g3.toFixed(1)} / 20</strong>
                  </div>
                  <div className="flex justify-between border-t border-[#E9E4F5] pt-1">
                    <span className="text-[#555866]">Prediction Variance:</span>
                    <strong className="text-[#789579] font-mono">
                      {Math.abs(gradeResult.predicted_g3 - selectedPreset.actualG3).toFixed(1)} marks error
                    </strong>
                  </div>
                </div>
              )}

              {/* Model & Probability Details */}
              <div className="space-y-2 text-xs border-t border-[#FAF7F0] pt-4 text-[#555866]">
                <div className="flex justify-between py-1 border-b border-[#FAF7F0]">
                  <span className="font-medium">Regression Estimator:</span>
                  <span className="font-semibold text-[#17243B]">
                    {earlyMode ? 'Ridge Regression (Early Warning Mode)' : 'Multiple Linear Regression'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#FAF7F0]">
                  <span className="font-medium">Risk Classifier:</span>
                  <span className="font-semibold text-[#17243B]">
                    Logistic Regression &amp; Random Forest Ensemble
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#FAF7F0]">
                  <span className="font-medium">Risk Definition:</span>
                  <span className="font-semibold text-[#17243B]">Project Rule: G3 &lt; 10 Marks</span>
                </div>
                {riskResult && (
                  <div className="flex justify-between py-1">
                    <span className="font-medium">Model Risk Probability:</span>
                    <span className="font-mono font-bold text-[#F28C45]">
                      {(riskResult.risk_probability * 100).toFixed(1)}%
                    </span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="py-14 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FAF7F0] to-[#E9E4F5] text-[#5146A5] flex items-center justify-center mx-auto shadow-2xs">
                <Calculator size={32} />
              </div>
              <div className="space-y-1">
                <p className="font-serif text-lg font-bold text-[#17243B]">Ready for Prediction</p>
                <p className="text-xs text-[#555866] max-w-xs mx-auto leading-relaxed">
                  Select a preset student or adjust the form attributes on the left, then click <strong>"Predict Student Performance"</strong>.
                </p>
              </div>
              <div className="pt-2 text-[11px] text-[#828696] max-w-xs mx-auto">
                All calculations execute against the local Scikit-Learn pipeline. Zero mocked statistics.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
