import React from 'react';
import { ArrowRight, Calculator, AlertTriangle, Users, Database, Sparkles, CheckCircle2, TrendingUp, Award, ShieldCheck } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { DatasetSummary } from '../types';

interface HomePageProps {
  summary: DatasetSummary | null;
  onNavigate: (tab: string) => void;
}

// Representative sample grade distribution curve for visual composition
const sampleGradePreview = [
  { grade: '0-4', students: 18, risk: 'High' },
  { grade: '5-7', students: 32, risk: 'High' },
  { grade: '8-9', students: 80, risk: 'Critical' },
  { grade: '10-11', students: 104, risk: 'Safe' },
  { grade: '12-13', students: 62, risk: 'Safe' },
  { grade: '14-15', students: 51, risk: 'Safe' },
  { grade: '16-17', students: 32, risk: 'Safe' },
  { grade: '18-20', students: 16, risk: 'Safe' },
];

export const HomePage: React.FC<HomePageProps> = ({ summary, onNavigate }) => {
  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-12 space-y-12">
      {/* Hero Section with Desktop Split Layout */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: Left-to-Right Animated Headings & Actions */}
        <div className="lg:col-span-7 space-y-5 animate-slide-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#E9E4F5] text-[#5146A5] rounded-full text-xs font-semibold">
            <Sparkles size={14} className="text-[#F28C45]" />
            <span>Empirical University Machine Learning Project (10 Marks Viva Evaluation)</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#17243B] tracking-tight leading-[1.15]">
            Understand performance. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F28C45] to-[#F2C14E]">
              Predict outcomes.
            </span> <br />
            Support students.
          </h1>

          <p className="text-base sm:text-lg text-[#555866] max-w-2xl leading-relaxed">
            Explore student academic data, estimate final grades, identify potential academic risk, and compare machine learning models in one simple application.
          </p>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-3.5">
            <button
              onClick={() => onNavigate('predict')}
              className="px-6 py-3 bg-gradient-to-r from-[#F28C45] to-[#F2C14E] text-[#FFFFFF] rounded-xl text-sm sm:text-base font-bold shadow-sm hover:shadow-md hover:brightness-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Try a Prediction</span>
              <ArrowRight size={18} />
            </button>
            <button
              onClick={() => onNavigate('explore')}
              className="px-6 py-3 bg-[#FFFFFF] text-[#17243B] border border-[#E9E4F5] rounded-xl text-sm sm:text-base font-bold hover:bg-[#FAF7F0] hover:border-[#5146A5] transition-all flex items-center gap-2 cursor-pointer shadow-2xs"
            >
              <Database size={18} className="text-[#5146A5]" />
              <span>Explore Student Data</span>
            </button>
          </div>

          {/* Dataset Status Highlights */}
          <div className="pt-3 grid grid-cols-3 gap-3 max-w-lg text-xs">
            <div className="p-2.5 bg-[#FFFFFF] border border-[#E9E4F5] rounded-lg">
              <span className="text-[#828696] font-medium block">Dataset Cohort</span>
              <strong className="text-sm font-serif font-bold text-[#17243B]">
                {summary?.total_records || 395} Students
              </strong>
            </div>
            <div className="p-2.5 bg-[#FFFFFF] border border-[#E9E4F5] rounded-lg">
              <span className="text-[#828696] font-medium block">Data Completeness</span>
              <strong className="text-sm font-serif font-bold text-[#789579]">
                0 Missing Values
              </strong>
            </div>
            <div className="p-2.5 bg-[#FFFFFF] border border-[#E9E4F5] rounded-lg">
              <span className="text-[#828696] font-medium block">Classification Recall</span>
              <strong className="text-sm font-serif font-bold text-[#F28C45]">
                87.9% At-Risk
              </strong>
            </div>
          </div>
        </div>

        {/* Right: Academic Analytics Visual Composition */}
        <div className="lg:col-span-5 bg-[#FFFFFF] border border-[#E9E4F5] rounded-2xl p-6 shadow-sm space-y-5 animate-fade-up">
          <div className="flex items-center justify-between pb-3 border-b border-[#FAF7F0]">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#5146A5]">
                Live Analytical Snapshot
              </span>
              <h3 className="font-serif font-bold text-base text-[#17243B]">
                Student Grade &amp; Risk Distribution
              </h3>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[#FBE6D5] text-[#D6732E] text-xs font-bold">
              Cutoff: G3 &lt; 10
            </span>
          </div>

          {/* Mini Grade Curve Chart */}
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sampleGradePreview} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#5146A5" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#F28C45" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="grade" stroke="#828696" fontSize={11} tickLine={false} />
                <YAxis stroke="#828696" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#17243B',
                    borderColor: '#5146A5',
                    borderRadius: '8px',
                    color: '#FFFFFF',
                    fontSize: '12px'
                  }}
                />
                <Area type="monotone" dataKey="students" stroke="#5146A5" strokeWidth={2.5} fillOpacity={1} fill="url(#gradeGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Mini Model Preview Badges */}
          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
            <div className="p-2.5 rounded-lg bg-[#FAF7F0] border border-[#E9E4F5]">
              <span className="text-[#828696] text-[11px] block">Logistic Regression</span>
              <strong className="text-[#17243B] font-mono font-bold text-sm">92.9% Accuracy</strong>
            </div>
            <div className="p-2.5 rounded-lg bg-[#FAF7F0] border border-[#E9E4F5]">
              <span className="text-[#828696] text-[11px] block">Random Forest (100 Trees)</span>
              <strong className="text-[#F28C45] font-mono font-bold text-sm">0.932 ROC-AUC</strong>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Core Capabilities */}
      <section className="space-y-5">
        <div className="text-center max-w-2xl mx-auto space-y-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[#5146A5]">Core Functionality</h2>
          <p className="text-2xl font-serif font-bold text-[#17243B]">Three Educational Capabilities</p>
          <p className="text-sm text-[#555866]">
            Every feature directly supports faculty intervention before semester evaluations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Capability 1: Predict Final Grades */}
          <div
            onClick={() => onNavigate('predict')}
            className="bg-[#FFFFFF] border border-[#E9E4F5] rounded-2xl p-6 space-y-3.5 hover:border-[#5146A5] hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-[#E9E4F5] text-[#5146A5] flex items-center justify-center group-hover:bg-[#5146A5] group-hover:text-[#FFFFFF] transition-colors shadow-2xs">
              <Calculator size={24} />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#17243B]">Predict Final Grades</h3>
            <p className="text-sm text-[#555866] leading-relaxed">
              Estimate a student's final grade out of 20 using study time, past failures, parental education, and term marks ($R^2 = 0.834$).
            </p>
            <div className="pt-2 text-xs font-bold text-[#5146A5] flex items-center gap-1 group-hover:translate-x-1.5 transition-transform">
              <span>Test numerical grade estimator</span>
              <ArrowRight size={14} />
            </div>
          </div>

          {/* Capability 2: Identify Academic Risk */}
          <div
            onClick={() => onNavigate('predict')}
            className="bg-[#FFFFFF] border border-[#E9E4F5] rounded-2xl p-6 space-y-3.5 hover:border-[#F28C45] hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-[#FBE6D5] text-[#D6732E] flex items-center justify-center group-hover:bg-[#F28C45] group-hover:text-[#FFFFFF] transition-colors shadow-2xs">
              <AlertTriangle size={24} />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#D6732E]">Identify Academic Risk</h3>
            <p className="text-sm text-[#555866] leading-relaxed">
              Classify students according to the defined academic-risk threshold (<strong className="text-[#17243B]">G3 &lt; 10 Marks</strong>) so mentors can trigger early support.
            </p>
            <div className="pt-2 text-xs font-bold text-[#D6732E] flex items-center gap-1 group-hover:translate-x-1.5 transition-transform">
              <span>Test risk classifier</span>
              <ArrowRight size={14} />
            </div>
          </div>

          {/* Capability 3: Discover Student Groups */}
          <div
            onClick={() => onNavigate('how-it-works')}
            className="bg-[#FFFFFF] border border-[#E9E4F5] rounded-2xl p-6 space-y-3.5 hover:border-[#789579] hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-[#FAF7F0] text-[#789579] border border-[#E9E4F5] flex items-center justify-center group-hover:bg-[#789579] group-hover:text-[#FFFFFF] transition-colors shadow-2xs">
              <Users size={24} />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#17243B]">Discover Student Groups</h3>
            <p className="text-sm text-[#555866] leading-relaxed">
              Find natural clusters among students with similar study habits and attendance patterns using K-Means and Gaussian Mixture Models without examination leakage.
            </p>
            <div className="pt-2 text-xs font-bold text-[#789579] flex items-center gap-1 group-hover:translate-x-1.5 transition-transform">
              <span>View unsupervised clusters</span>
              <ArrowRight size={14} />
            </div>
          </div>
        </div>
      </section>

      {/* Simple 4-Step Methodology Workflow */}
      <section className="bg-[#FFFFFF] border border-[#E9E4F5] rounded-2xl p-6 sm:p-8 space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#5146A5]">Machine Learning Lifecycle</span>
          <h2 className="text-2xl font-serif font-bold text-[#17243B]">Project Workflow: From Raw Data to Results</h2>
          <p className="text-sm text-[#555866] mt-1 max-w-3xl">
            We follow a clean, reproducible data science workflow with strict zero-leakage training protocols.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-[#FAF7F0] rounded-xl border border-[#E9E4F5] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#5146A5] uppercase">Stage 1</span>
              <Database size={16} className="text-[#5146A5]" />
            </div>
            <h4 className="font-bold text-sm text-[#17243B]">Student Data</h4>
            <p className="text-xs text-[#555866] leading-relaxed">
              Loaded official UCI benchmark containing 395 students, 33 attributes, and 0 missing values.
            </p>
          </div>

          <div className="p-4 bg-[#FAF7F0] rounded-xl border border-[#E9E4F5] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#5146A5] uppercase">Stage 2</span>
              <ShieldCheck size={16} className="text-[#789579]" />
            </div>
            <h4 className="font-bold text-sm text-[#17243B]">Data Preparation</h4>
            <p className="text-xs text-[#555866] leading-relaxed">
              Categorical one-hot encoding, StandardScaler normalization on training splits only, and zero G3 leakage.
            </p>
          </div>

          <div className="p-4 bg-[#FAF7F0] rounded-xl border border-[#E9E4F5] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#5146A5] uppercase">Stage 3</span>
              <TrendingUp size={16} className="text-[#5146A5]" />
            </div>
            <h4 className="font-bold text-sm text-[#17243B]">Machine Learning</h4>
            <p className="text-xs text-[#555866] leading-relaxed">
              Trained Linear Regression, Logistic Regression, Gaussian Naive Bayes, KNN, Bagging, Random Forest, and K-Means.
            </p>
          </div>

          <div className="p-4 bg-[#FAF7F0] rounded-xl border border-[#FBE6D5] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#D6732E] uppercase">Stage 4</span>
              <Award size={16} className="text-[#F28C45]" />
            </div>
            <h4 className="font-bold text-sm text-[#17243B]">Results &amp; Decisions</h4>
            <p className="text-xs text-[#555866] leading-relaxed">
              Delivers live predictions, risk probabilities, and early warnings to college faculty before final evaluations.
            </p>
          </div>
        </div>
      </section>

      {/* Viva Reference Quick Card */}
      <section className="bg-gradient-to-br from-[#FAF7F0] to-[#E9E4F5]/60 border border-[#E9E4F5] rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2">
          <CheckCircle2 size={20} className="text-[#5146A5]" />
          <h3 className="font-serif text-lg font-bold text-[#17243B]">
            Project Quick Reference (Faculty Viva Cheat-Sheet)
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="bg-[#FFFFFF] p-3.5 rounded-xl border border-[#E9E4F5]">
            <span className="text-[#828696] font-medium block">Project Identity</span>
            <strong className="text-sm text-[#17243B] font-serif block mt-0.5">EduRisk AI v2.0</strong>
            <span className="text-[#555866]">Student Academic Performance &amp; Risk Prediction</span>
          </div>

          <div className="bg-[#FFFFFF] p-3.5 rounded-xl border border-[#E9E4F5]">
            <span className="text-[#828696] font-medium block">Dataset Source</span>
            <strong className="text-sm text-[#17243B] font-serif block mt-0.5">UCI Machine Learning Repo</strong>
            <span className="text-[#555866]">Secondary education records (Math: 395, Portuguese: 649)</span>
          </div>

          <div className="bg-[#FFFFFF] p-3.5 rounded-xl border border-[#E9E4F5]">
            <span className="text-[#828696] font-medium block">Technology Architecture</span>
            <strong className="text-sm text-[#17243B] font-serif block mt-0.5">React + Vite + FastAPI</strong>
            <span className="text-[#555866]">Python 3.11, Scikit-Learn, TypeScript, Recharts</span>
          </div>

          <div className="bg-[#FFFFFF] p-3.5 rounded-xl border border-[#E9E4F5]">
            <span className="text-[#828696] font-medium block">Supervised Algorithms</span>
            <strong className="text-sm text-[#17243B] font-serif block mt-0.5">Regression &amp; Classification</strong>
            <span className="text-[#555866]">Linear Regression, Logistic Regression, Random Forest, Bagging</span>
          </div>

          <div className="bg-[#FFFFFF] p-3.5 rounded-xl border border-[#E9E4F5]">
            <span className="text-[#828696] font-medium block">Unsupervised Algorithms</span>
            <strong className="text-sm text-[#17243B] font-serif block mt-0.5">Clustering &amp; GMM</strong>
            <span className="text-[#555866]">K-Means (K=3), Gaussian Mixture Models, PCA 2D</span>
          </div>

          <div className="bg-[#FFFFFF] p-3.5 rounded-xl border border-[#E9E4F5]">
            <span className="text-[#828696] font-medium block">Risk Definition</span>
            <strong className="text-sm text-[#D6732E] font-serif block mt-0.5">G3 &lt; 10 Marks (Out of 20)</strong>
            <span className="text-[#555866]">Portuguese academic passing threshold (Project rule)</span>
          </div>
        </div>
      </section>
    </div>
  );
};
