import React from 'react';
import { DatasetSummary } from '../types';
import { Sparkles, Database, CheckCircle2, ChevronRight } from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  course: string;
  onCourseChange: (course: string) => void;
  summary: DatasetSummary | null;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  course,
  onCourseChange,
  summary,
}) => {
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'explore', label: 'Explore Data' },
    { id: 'predict', label: 'Predictions' },
    { id: 'how-it-works', label: 'How It Works' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#FFFFFF] border-b border-[#E9E4F5] shadow-xs">
      {/* Top Utility Bar for Academic Metadata */}
      <div className="w-full border-b border-[#FAF7F0] bg-[#FAF7F0]/80 backdrop-blur-xs">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-1.5 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#E9E4F5] text-[#5146A5] font-semibold text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#5146A5] animate-pulse"></span>
              UCI Machine Learning Benchmark
            </span>
            <span className="text-[#828696] hidden md:inline">|</span>
            <span className="text-[#555866] hidden md:inline">
              Student Performance Prediction &amp; Risk Analytics
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Dataset status indicator */}
            <div className="inline-flex items-center gap-1.5 text-[11px] text-[#292B33] bg-[#FFFFFF] border border-[#E9E4F5] px-2.5 py-0.5 rounded-md">
              <Database size={12} className="text-[#5146A5]" />
              <span className="font-medium">
                {course === 'mat' ? 'student-mat.csv' : 'student-por.csv'}
              </span>
              <span className="inline-flex items-center gap-1 text-[#789579] font-bold">
                <CheckCircle2 size={11} />
                {summary ? `${summary.total_records} records` : 'Active'}
              </span>
            </div>

            {/* Course Selector */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-[#828696] text-[11px]">Cohort:</span>
              <select
                value={course}
                onChange={(e) => onCourseChange(e.target.value)}
                className="bg-[#FFFFFF] border border-[#E9E4F5] text-[#17243B] font-semibold px-2 py-0.5 rounded text-xs outline-none cursor-pointer hover:border-[#5146A5] transition-colors"
                aria-label="Select cohort"
              >
                <option value="mat">Mathematics (395 records)</option>
                <option value="por">Portuguese (649 records)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-3 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer group shrink-0"
          onClick={() => onTabChange('home')}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#17243B] to-[#5146A5] text-[#FFFFFF] flex items-center justify-center font-serif font-bold text-xl shadow-sm group-hover:scale-105 transition-transform">
            E
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#17243B] leading-tight tracking-tight">
                EduRisk <span className="text-[#F28C45]">AI</span>
              </h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#FBE6D5] text-[#D6732E]">
                v2.0
              </span>
            </div>
            <p className="text-xs text-[#555866] hidden sm:block">
              Academic Risk &amp; Grade Prediction System
            </p>
          </div>
        </div>

        {/* 4 Main Navigation Items */}
        <nav className="flex items-center gap-1 sm:gap-2 bg-[#FAF7F0] p-1 rounded-xl border border-[#E9E4F5]">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`px-3.5 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#17243B] text-[#FFFFFF] shadow-sm'
                    : 'text-[#292B33] hover:text-[#5146A5] hover:bg-[#FFFFFF]'
                }`}
              >
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F2C14E]"></span>
                )}
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Prominent Action Button: Try Prediction */}
        <div className="shrink-0 hidden md:block">
          <button
            onClick={() => onTabChange('predict')}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-[#FFFFFF] bg-gradient-to-r from-[#F28C45] to-[#F2C14E] shadow-sm hover:shadow-md hover:brightness-105 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles size={15} />
            <span>Try Prediction</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </header>
  );
};
