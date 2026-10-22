import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#FFFFFF] border-t border-[#E9E4F5] py-8 mt-16 text-xs text-[#555866]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-base text-[#17243B]">
              EduRisk <span className="text-[#F28C45]">AI</span>
            </span>
            <span className="text-[#828696]">|</span>
            <span className="font-medium text-[#17243B]">Student Academic Risk Analytics System</span>
          </div>
          <p className="text-[11px] text-[#828696] mt-1">
            University Machine Learning Laboratory Project · 10 Marks Evaluation &amp; Viva Defense Guide
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#828696]">
          <span className="px-2 py-0.5 rounded bg-[#FAF7F0] border border-[#E9E4F5] text-[#17243B] font-medium">Python 3.11 + FastAPI</span>
          <span>•</span>
          <span className="px-2 py-0.5 rounded bg-[#FAF7F0] border border-[#E9E4F5] text-[#17243B] font-medium">Scikit-Learn ML Models</span>
          <span>•</span>
          <span className="px-2 py-0.5 rounded bg-[#FAF7F0] border border-[#E9E4F5] text-[#17243B] font-medium">React 19 + TypeScript</span>
          <span>•</span>
          <span className="px-2 py-0.5 rounded bg-[#FAF7F0] border border-[#E9E4F5] text-[#17243B] font-medium">UCI Student Dataset</span>
        </div>
      </div>
    </footer>
  );
};
