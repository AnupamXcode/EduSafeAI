import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import { StudentInput, GradePredictionResult, RiskPredictionResult } from '../types';
import {
  Calculator,
  AlertTriangle,
  Sparkles,
  ShieldAlert,
  CheckCircle2,
  RefreshCw,
  ArrowRight,
  Sliders,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  Clock,
  BookOpen,
  Minus,
  Plus,
  Award,
  TrendingUp,
  Check
} from 'lucide-react';

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
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  // Form student state with realistic defaults
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
      name: 'High Achiever (Top Student)',
      badge: 'Safe • Expected Grade A',
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
      name: 'Average Student (Borderline)',
      badge: 'Borderline Pass • Grade C',
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
      name: 'At-Risk Student (Low Marks)',
      badge: 'High Risk • Needs Intervention',
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

  const executePrediction = async (currentStudent: StudentInput, isEarly: boolean) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const [gRes, rRes] = await Promise.all([
        api.predictGrade(currentStudent, isEarly),
        api.predictRisk(currentStudent, isEarly),
      ]);
      setGradeResult(gRes);
      setRiskResult(rRes);
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Unable to connect to ML backend. Please ensure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  // Run initial prediction on load so the result column is immediately filled
  useEffect(() => {
    executePrediction(student, earlyMode);
  }, [earlyMode]);

  const handleApplyPreset = (key: 'good' | 'average' | 'at_risk') => {
    const preset = presets[key];
    setSelectedPreset(preset);
    const updated = {
      ...student,
      ...preset.data,
    };
    setStudent(updated);
    executePrediction(updated as StudentInput, earlyMode);
  };

  const handlePredict = (e: React.FormEvent) => {
    e.preventDefault();
    executePrediction(student, earlyMode);
  };

  // Helper to adjust marks via stepper
  const adjustUT1 = (delta: number) => {
    setStudent((prev) => ({
      ...prev,
      G1: Math.max(0, Math.min(20, prev.G1 + delta)),
    }));
  };

  const adjustUT2 = (delta: number) => {
    setStudent((prev) => ({
      ...prev,
      G2: Math.max(0, Math.min(20, (prev.G2 ?? 0) + delta)),
    }));
  };

  // Helper for letter grade
  const getLetterGrade = (score: number) => {
    if (score >= 16) return { grade: 'Grade A+', label: 'Outstanding (Distinction)', color: 'text-[#5146A5] bg-[#E9E4F5]' };
    if (score >= 14) return { grade: 'Grade A', label: 'Very Good', color: 'text-[#5146A5] bg-[#E9E4F5]' };
    if (score >= 12) return { grade: 'Grade B', label: 'Good (First Class)', color: 'text-[#17243B] bg-[#FAF7F0]' };
    if (score >= 10) return { grade: 'Grade C', label: 'Pass (Average)', color: 'text-[#17243B] bg-[#FAF7F0]' };
    return { grade: 'Grade F', label: 'Fail (Academic Risk)', color: 'text-[#D6732E] bg-[#FBE6D5]' };
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-12 space-y-8">
      {/* Page Header */}
      <section className="space-y-3 animate-slide-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E9E4F5] text-[#5146A5] rounded-full text-xs font-semibold">
          <Calculator size={14} className="text-[#F28C45]" />
          <span>Interactive Model Lab: Real-Time Grade &amp; Academic Risk Estimator</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#17243B] tracking-tight">
          Student Semester Exam Predictor
        </h1>
        <p className="text-base text-[#555866] max-w-3xl leading-relaxed">
          Input the student's <strong>Unit Test 1 (UT 1)</strong> and <strong>Unit Test 2 (UT 2)</strong> marks, study habits, and past record to instantly predict the expected <strong>Final Semester Score</strong> and academic risk status.
        </p>
      </section>

      {/* 1-Click Quick Student Presets */}
      <section className="p-4 bg-[#FFFFFF] border border-[#E9E4F5] rounded-2xl shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-[#F28C45]" />
          <div>
            <span className="text-xs font-bold text-[#17243B] block">1-Click Quick Test Profiles:</span>
            <span className="text-[11px] text-[#555866]">Click any persona to auto-fill marks and calculate live prediction</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            type="button"
            onClick={() => handleApplyPreset('good')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center gap-1.5 shadow-2xs ${
              selectedPreset?.actualG3 === 16
                ? 'bg-[#5146A5] text-[#FFFFFF] border-[#5146A5]'
                : 'bg-[#E9E4F5] text-[#5146A5] hover:bg-[#5146A5] hover:text-[#FFFFFF] border-[#E9E4F5]'
            }`}
          >
            <span>🌟 Top Achiever (UT: 16)</span>
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset('average')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center gap-1.5 shadow-2xs ${
              selectedPreset?.actualG3 === 11
                ? 'bg-[#17243B] text-[#FFFFFF] border-[#17243B]'
                : 'bg-[#FAF7F0] text-[#17243B] hover:bg-[#17243B] hover:text-[#FFFFFF] border-[#E9E4F5]'
            }`}
          >
            <span>⚖️ Average Student (UT: 11)</span>
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset('at_risk')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center gap-1.5 shadow-2xs ${
              selectedPreset?.actualG3 === 7
                ? 'bg-[#F28C45] text-[#FFFFFF] border-[#F28C45]'
                : 'bg-[#FBE6D5] text-[#D6732E] hover:bg-[#F28C45] hover:text-[#FFFFFF] border-[#FBE6D5]'
            }`}
          >
            <span>⚠️ At-Risk Student (UT: 7)</span>
          </button>
        </div>
      </section>

      {/* Main Grid: Simplified Form (7 cols) + Live Result (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Student Information Form */}
        <div className="lg:col-span-7 bg-[#FFFFFF] border border-[#E9E4F5] rounded-2xl p-6 sm:p-7 shadow-2xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#FAF7F0] pb-4">
            <div>
              <h2 className="font-serif text-xl font-bold text-[#17243B]">Student Performance Input</h2>
              <p className="text-xs text-[#555866]">Adjust Unit Test marks to estimate final semester outcomes</p>
            </div>

            {/* Evaluation Mode Toggle */}
            <div className="flex items-center gap-1 bg-[#FAF7F0] p-1 rounded-xl border border-[#E9E4F5]">
              <button
                type="button"
                onClick={() => setEarlyMode(false)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  !earlyMode ? 'bg-[#5146A5] text-[#FFFFFF] shadow-2xs' : 'text-[#555866] hover:text-[#17243B]'
                }`}
              >
                Standard (UT 1 + UT 2)
              </button>
              <button
                type="button"
                onClick={() => setEarlyMode(true)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  earlyMode ? 'bg-[#5146A5] text-[#FFFFFF] shadow-2xs' : 'text-[#555866] hover:text-[#17243B]'
                }`}
              >
                Early Warning (UT 1 Only)
              </button>
            </div>
          </div>

          <form onSubmit={handlePredict} className="space-y-6">
            {/* Core Parameter 1: Unit Test 1 (UT 1) */}
            <div className="p-4 bg-[#FAF7F0] rounded-xl border border-[#E9E4F5] space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-bold text-[#17243B] flex items-center gap-2">
                    <BookOpen size={16} className="text-[#5146A5]" />
                    <span>Unit Test 1 (UT 1) Marks</span>
                  </label>
                  <span className="text-[11px] text-[#555866]">First term assessment (0 to 20 marks)</span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      student.G1 >= 10 ? 'bg-[#E9E4F5] text-[#5146A5]' : 'bg-[#FBE6D5] text-[#D6732E]'
                    }`}
                  >
                    {student.G1 >= 10 ? 'Passed UT 1' : 'Failed UT 1'}
                  </span>

                  {/* Stepper Buttons + Score Display */}
                  <div className="flex items-center bg-[#FFFFFF] border border-[#E9E4F5] rounded-lg overflow-hidden shadow-2xs">
                    <button
                      type="button"
                      onClick={() => adjustUT1(-1)}
                      className="px-2 py-1 text-[#555866] hover:bg-[#FAF7F0] hover:text-[#17243B] transition-colors cursor-pointer"
                      title="Decrease by 1"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="font-mono text-sm font-bold text-[#17243B] px-2.5 min-w-[3rem] text-center">
                      {student.G1} / 20
                    </span>
                    <button
                      type="button"
                      onClick={() => adjustUT1(1)}
                      className="px-2 py-1 text-[#555866] hover:bg-[#FAF7F0] hover:text-[#17243B] transition-colors cursor-pointer"
                      title="Increase by 1"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Slider */}
              <input
                type="range"
                min="0"
                max="20"
                step="1"
                value={student.G1}
                onChange={(e) => setStudent({ ...student, G1: Number(e.target.value) })}
                className="w-full accent-[#5146A5] cursor-pointer h-2 bg-[#E9E4F5] rounded-lg"
              />
              <div className="flex justify-between text-[11px] text-[#828696]">
                <span>0 (Min)</span>
                <span className="text-[#5146A5] font-semibold">10 (Passing Mark)</span>
                <span>20 (Full Marks)</span>
              </div>
            </div>

            {/* Core Parameter 2: Unit Test 2 (UT 2) */}
            <div
              className={`p-4 rounded-xl border space-y-3 transition-all ${
                earlyMode ? 'bg-[#FAF7F0]/50 border-dashed border-[#E9E4F5] opacity-65' : 'bg-[#FAF7F0] border-[#E9E4F5]'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-bold text-[#17243B] flex items-center gap-2">
                    <BookOpen size={16} className="text-[#5146A5]" />
                    <span>Unit Test 2 (UT 2) Marks</span>
                  </label>
                  <span className="text-[11px] text-[#555866]">
                    {earlyMode ? 'Excluded (Simulating early prediction before UT 2)' : 'Midterm assessment (0 to 20 marks)'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {earlyMode ? (
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-[#E9E4F5] text-[#555866]">
                      Not Conducted Yet
                    </span>
                  ) : (
                    <>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          (student.G2 ?? 0) >= 10 ? 'bg-[#E9E4F5] text-[#5146A5]' : 'bg-[#FBE6D5] text-[#D6732E]'
                        }`}
                      >
                        {(student.G2 ?? 0) >= 10 ? 'Passed UT 2' : 'Failed UT 2'}
                      </span>

                      {/* Stepper Buttons + Score Display */}
                      <div className="flex items-center bg-[#FFFFFF] border border-[#E9E4F5] rounded-lg overflow-hidden shadow-2xs">
                        <button
                          type="button"
                          onClick={() => adjustUT2(-1)}
                          className="px-2 py-1 text-[#555866] hover:bg-[#FAF7F0] hover:text-[#17243B] transition-colors cursor-pointer"
                          title="Decrease by 1"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="font-mono text-sm font-bold text-[#17243B] px-2.5 min-w-[3rem] text-center">
                          {student.G2} / 20
                        </span>
                        <button
                          type="button"
                          onClick={() => adjustUT2(1)}
                          className="px-2 py-1 text-[#555866] hover:bg-[#FAF7F0] hover:text-[#17243B] transition-colors cursor-pointer"
                          title="Increase by 1"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Slider */}
              <input
                type="range"
                min="0"
                max="20"
                step="1"
                disabled={earlyMode}
                value={earlyMode ? 0 : (student.G2 ?? 0)}
                onChange={(e) => setStudent({ ...student, G2: Number(e.target.value) })}
                className={`w-full accent-[#5146A5] h-2 rounded-lg ${
                  earlyMode ? 'cursor-not-allowed bg-[#E9E4F5]/50' : 'cursor-pointer bg-[#E9E4F5]'
                }`}
              />
              <div className="flex justify-between text-[11px] text-[#828696]">
                <span>0 (Min)</span>
                <span className="text-[#5146A5] font-semibold">10 (Passing Mark)</span>
                <span>20 (Full Marks)</span>
              </div>
            </div>

            {/* Core Parameter 3: Weekly Study Time */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#17243B] flex items-center gap-1.5">
                <Clock size={15} className="text-[#5146A5]" />
                <span>Weekly Study Hours</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { value: 1, label: '< 2 hrs / wk', desc: 'Minimal effort' },
                  { value: 2, label: '2 – 5 hrs / wk', desc: 'Standard study' },
                  { value: 3, label: '5 – 10 hrs / wk', desc: 'Dedicated focus' },
                  { value: 4, label: '> 10 hrs / wk', desc: 'Intensive prep' },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setStudent({ ...student, studytime: item.value })}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      student.studytime === item.value
                        ? 'bg-[#5146A5] text-[#FFFFFF] border-[#5146A5] shadow-2xs scale-[1.02]'
                        : 'bg-[#FAF7F0] text-[#17243B] border-[#E9E4F5] hover:border-[#5146A5]'
                    }`}
                  >
                    <div className="text-xs font-bold">{item.label}</div>
                    <div
                      className={`text-[10px] ${
                        student.studytime === item.value ? 'text-[#FAF7F0]/80' : 'text-[#828696]'
                      }`}
                    >
                      {item.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Core Parameter 4: Past Class Failures (Backlogs) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#17243B] flex items-center gap-1.5">
                <GraduationCap size={15} className="text-[#5146A5]" />
                <span>Previous Academic Backlogs (Past Failures)</span>
              </label>
              <div className="grid grid-cols-4 gap-2.5">
                {[
                  { value: 0, label: '0 Backlogs', tag: 'Clear record' },
                  { value: 1, label: '1 Backlog', tag: 'Minor risk' },
                  { value: 2, label: '2 Backlogs', tag: 'Moderate' },
                  { value: 3, label: '3+ Backlogs', tag: 'Critical' },
                ].map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setStudent({ ...student, failures: item.value })}
                    className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      student.failures === item.value
                        ? 'bg-[#5146A5] text-[#FFFFFF] border-[#5146A5] shadow-2xs scale-[1.02]'
                        : 'bg-[#FAF7F0] text-[#17243B] border-[#E9E4F5] hover:border-[#5146A5]'
                    }`}
                  >
                    <div className="text-xs font-bold">{item.label}</div>
                    <div
                      className={`text-[10px] truncate ${
                        student.failures === item.value ? 'text-[#FAF7F0]/80' : 'text-[#828696]'
                      }`}
                    >
                      {item.tag}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Collapsible Additional Factors */}
            <div className="border border-[#E9E4F5] rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full px-4 py-3 bg-[#FAF7F0] flex items-center justify-between text-xs font-bold text-[#17243B] hover:bg-[#E9E4F5]/50 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Sliders size={14} className="text-[#5146A5]" />
                  <span>Optional Factors (Attendance, Internet, Aspirations)</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-[#555866]">
                  <span>{showAdvanced ? 'Hide' : 'Expand'}</span>
                  {showAdvanced ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                </div>
              </button>

              {showAdvanced && (
                <div className="p-4 bg-[#FFFFFF] grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[#E9E4F5] text-xs animate-scale-in">
                  {/* Absences */}
                  <div>
                    <label className="font-semibold text-[#17243B] block mb-1">
                      Days Absent ({student.absences} days)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="40"
                      value={student.absences}
                      onChange={(e) => setStudent({ ...student, absences: Number(e.target.value) })}
                      className="w-full accent-[#5146A5] cursor-pointer h-2 bg-[#FAF7F0] rounded-lg"
                    />
                    <div className="flex justify-between text-[10px] text-[#828696] mt-1">
                      <span>0 days (100% Attendance)</span>
                      <span>40 days</span>
                    </div>
                  </div>

                  {/* Mother's Education */}
                  <div>
                    <label className="font-semibold text-[#17243B] block mb-1">
                      Parent's Education Level
                    </label>
                    <select
                      value={student.Medu}
                      onChange={(e) => setStudent({ ...student, Medu: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-[#FAF7F0] border border-[#E9E4F5] rounded-lg text-[#17243B] text-xs outline-none focus:border-[#5146A5] cursor-pointer"
                    >
                      <option value={1}>Primary School</option>
                      <option value={2}>Middle School</option>
                      <option value={3}>Secondary / High School</option>
                      <option value={4}>University Graduate</option>
                    </select>
                  </div>

                  {/* Plans for University */}
                  <div>
                    <label className="font-semibold text-[#17243B] block mb-1">
                      Aspires for Higher Education?
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {['yes', 'no'].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setStudent({ ...student, higher: val })}
                          className={`py-1.5 rounded-lg font-bold border transition-all cursor-pointer ${
                            student.higher === val
                              ? 'bg-[#5146A5] text-[#FFFFFF] border-[#5146A5]'
                              : 'bg-[#FAF7F0] text-[#555866] border-[#E9E4F5]'
                          }`}
                        >
                          {val === 'yes' ? 'Yes (Aspires)' : 'No'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Internet Access */}
                  <div>
                    <label className="font-semibold text-[#17243B] block mb-1">
                      Home Internet Connection?
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {['yes', 'no'].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setStudent({ ...student, internet: val })}
                          className={`py-1.5 rounded-lg font-bold border transition-all cursor-pointer ${
                            student.internet === val
                              ? 'bg-[#5146A5] text-[#FFFFFF] border-[#5146A5]'
                              : 'bg-[#FAF7F0] text-[#555866] border-[#E9E4F5]'
                          }`}
                        >
                          {val === 'yes' ? 'Yes (Connected)' : 'No'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {errorMsg && (
              <div className="p-3 bg-[#FBE6D5] border border-[#F28C45] text-[#D6732E] rounded-xl text-xs flex items-center gap-2">
                <AlertTriangle size={16} />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Calculate Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-[#F28C45] to-[#F2C14E] text-[#FFFFFF] font-bold rounded-xl text-sm sm:text-base hover:brightness-105 active:scale-98 transition-all cursor-pointer shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw size={18} className="animate-spin" />
                  <span>Computing Prediction on ML Model...</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>Calculate Final Semester Prediction</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Prediction Results */}
        <div className="lg:col-span-5 bg-[#FFFFFF] border border-[#E9E4F5] rounded-2xl p-6 sm:p-7 space-y-6 shadow-2xs sticky top-24">
          <div className="border-b border-[#FAF7F0] pb-3 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#5146A5]">
                Machine Learning Forecast
              </span>
              <h2 className="font-serif text-xl font-bold text-[#17243B]">Final Semester Result</h2>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-[#E9E4F5] text-[#5146A5] text-xs font-semibold">
              Live Python Model
            </span>
          </div>

          {gradeResult ? (
            <div className="space-y-6 animate-scale-in">
              {/* Predicted Final Grade Large Display */}
              {(() => {
                const score = gradeResult.predicted_g3;
                const letterInfo = getLetterGrade(score);
                const percent = Math.min(100, Math.max(0, (score / 20) * 100)).toFixed(0);

                return (
                  <div className="p-6 bg-gradient-to-br from-[#FAF7F0] to-[#E9E4F5]/50 rounded-2xl border border-[#E9E4F5] text-center space-y-3">
                    <span className="text-xs text-[#555866] font-bold uppercase tracking-wider block">
                      Estimated Final Semester Score
                    </span>

                    <div className="flex items-baseline justify-center gap-2">
                      <span className="text-5xl font-serif font-bold text-[#17243B]">
                        {score.toFixed(1)}
                      </span>
                      <span className="text-xl text-[#828696] font-sans font-normal">/ 20</span>
                      <span className="text-sm font-bold text-[#5146A5] bg-[#FFFFFF] px-2 py-0.5 rounded-md border border-[#E9E4F5]">
                        ({percent}%)
                      </span>
                    </div>

                    {/* Letter Grade Pill */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border border-[#E9E4F5] bg-[#FFFFFF]">
                      <Award size={14} className="text-[#F28C45]" />
                      <span className="text-[#17243B]">{letterInfo.grade}</span>
                      <span className="text-[#828696]">({letterInfo.label})</span>
                    </div>

                    <p className="text-[11px] text-[#555866]">
                      Model Confidence Margin: &plusmn;{gradeResult.expected_error_margin.toFixed(2)} marks
                    </p>

                    {/* Horizontal Visual Grade Scale */}
                    <div className="pt-2 space-y-1.5">
                      <div className="h-4 w-full bg-[#FFFFFF] border border-[#E9E4F5] rounded-full relative overflow-hidden p-0.5 shadow-inner">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${
                            score < 10
                              ? 'bg-gradient-to-r from-[#D6732E] to-[#F28C45]'
                              : 'bg-gradient-to-r from-[#5146A5] to-[#789579]'
                          }`}
                          style={{ width: `${percent}%` }}
                        ></div>
                        {/* 10 mark cutoff line */}
                        <div
                          className="absolute top-0 bottom-0 left-[50%] w-0.5 bg-[#F28C45] z-10"
                          title="10 Marks Pass Cutoff"
                        ></div>
                      </div>
                      <div className="flex justify-between text-[11px] text-[#828696] font-mono px-1">
                        <span>0 (Fail)</span>
                        <span className="text-[#F28C45] font-bold">10 (Pass Threshold)</span>
                        <span>20 (Distinction)</span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Academic Risk Banner */}
              <div
                className={`p-5 rounded-2xl border ${
                  gradeResult.predicted_g3 < 10
                    ? 'bg-[#FBE6D5] border-[#F28C45] text-[#D6732E]'
                    : 'bg-[#E9E4F5] border-[#5146A5] text-[#5146A5]'
                } flex items-start gap-3.5`}
              >
                {gradeResult.predicted_g3 < 10 ? (
                  <ShieldAlert size={28} className="shrink-0 mt-0.5 text-[#F28C45]" />
                ) : (
                  <CheckCircle2 size={28} className="shrink-0 mt-0.5 text-[#5146A5]" />
                )}
                <div className="space-y-1">
                  <h4 className="font-serif font-bold text-base">
                    {gradeResult.predicted_g3 < 10
                      ? 'Academic Status: At Risk of Failing'
                      : 'Academic Status: Safe (On Track to Pass)'}
                  </h4>
                  <p className="text-xs text-[#292B33] leading-relaxed">
                    {gradeResult.predicted_g3 < 10
                      ? 'Based on current Unit Test scores and study habits, student is projected to fall below the 10-mark threshold. Immediate remedial sessions, teacher mentoring, and UT paper re-checks are advised.'
                      : 'Student exhibits solid performance across Unit Tests. Predicted to comfortably clear the semester exam.'}
                  </p>
                </div>
              </div>

              {/* Preset Retrospective Verification */}
              {selectedPreset && (
                <div className="p-4 bg-[#FAF7F0] border border-[#E9E4F5] rounded-xl text-xs space-y-1.5">
                  <span className="text-[11px] font-bold text-[#5146A5] uppercase block flex items-center gap-1">
                    <Check size={13} className="text-[#789579]" />
                    <span>Benchmark Verification ({selectedPreset.name})</span>
                  </span>
                  <div className="flex justify-between">
                    <span className="text-[#555866]">Actual Exam Score on Record:</span>
                    <strong className="text-[#17243B] font-mono">{selectedPreset.actualG3} / 20</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#555866]">Model Predicted Score:</span>
                    <strong className="text-[#5146A5] font-mono">{gradeResult.predicted_g3.toFixed(1)} / 20</strong>
                  </div>
                  <div className="flex justify-between border-t border-[#E9E4F5] pt-1">
                    <span className="text-[#555866]">Prediction Accuracy:</span>
                    <strong className="text-[#789579] font-mono">
                      &plusmn;{Math.abs(gradeResult.predicted_g3 - selectedPreset.actualG3).toFixed(1)} marks variance
                    </strong>
                  </div>
                </div>
              )}

              {/* Model Diagnostics Card */}
              <div className="space-y-2 text-xs border-t border-[#FAF7F0] pt-4 text-[#555866]">
                <div className="flex justify-between py-1 border-b border-[#FAF7F0]">
                  <span className="font-medium">Algorithm:</span>
                  <span className="font-semibold text-[#17243B]">
                    {earlyMode ? 'Ridge Regression (Early Mode)' : 'Multiple Linear Regression Pipeline'}
                  </span>
                </div>
                {riskResult && (
                  <div className="flex justify-between py-1 border-b border-[#FAF7F0]">
                    <span className="font-medium">Calculated Failure Risk:</span>
                    <span
                      className={`font-mono font-bold ${
                        riskResult.risk_probability > 0.5 ? 'text-[#D6732E]' : 'text-[#789579]'
                      }`}
                    >
                      {(riskResult.risk_probability * 100).toFixed(1)}%
                    </span>
                  </div>
                )}
                <div className="flex justify-between py-1">
                  <span className="font-medium">Pass Mark Required:</span>
                  <span className="font-semibold text-[#17243B]">10 out of 20 Marks</span>
                </div>
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
                  Pick a preset profile or adjust the sliders on the left, then click <strong>"Calculate Final Semester Prediction"</strong>.
                </p>
              </div>
              <div className="pt-2 text-[11px] text-[#828696] max-w-xs mx-auto">
                Powered by Scikit-Learn trained pipeline running live on FastAPI.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
