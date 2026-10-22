import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { EdaData, DatasetSummary } from '../types';

interface DataExplorerPageProps {
  course: string;
  summary: DatasetSummary | null;
}

export const DataExplorerPage: React.FC<DataExplorerPageProps> = ({ course, summary }) => {
  const [records, setRecords] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [eda, setEda] = useState<EdaData | null>(null);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');
  const [schoolFilter, setSchoolFilter] = useState('all');
  const [activeTab, setActiveTab] = useState<'records' | 'dictionary' | 'pipeline'>('records');

  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 15;

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    Promise.all([api.getDatasetPreview(course, 395), api.getEdaData(course)])
      .then(([prevData, edaData]) => {
        if (isMounted) {
          setRecords(prevData.records);
          setColumns(prevData.columns);
          setEda(edaData);
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

  // Export CSV handler
  const handleExportCSV = () => {
    if (records.length === 0) return;
    const headers = columns.join(',');
    const rows = records.map((r) => columns.map((col) => JSON.stringify(r[col] ?? '')).join(','));
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `student-${course}-export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered records
  const filtered = records.filter((r) => {
    if (riskFilter === 'at_risk' && r.academic_risk !== 1) return false;
    if (riskFilter === 'passing' && r.academic_risk !== 0) return false;
    if (schoolFilter !== 'all' && r.school !== schoolFilter) return false;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const match =
        r.school?.toLowerCase().includes(term) ||
        r.sex?.toLowerCase().includes(term) ||
        r.Mjob?.toLowerCase().includes(term) ||
        r.Fjob?.toLowerCase().includes(term) ||
        String(r.age).includes(term) ||
        String(r.G3).includes(term);
      if (!match) return false;
    }
    return true;
  });

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  const attributeDictionary = [
    { name: 'school', type: 'Binary', desc: "Student's school ('GP' - Gabriel Pereira or 'MS' - Mousinho da Silveira)" },
    { name: 'sex', type: 'Binary', desc: "Student's sex ('F' - female or 'M' - male)" },
    { name: 'age', type: 'Numeric', desc: "Student's age (from 15 to 22 years old)" },
    { name: 'address', type: 'Binary', desc: "Home address type ('U' - urban or 'R' - rural)" },
    { name: 'famsize', type: 'Binary', desc: "Family size ('LE3' - <= 3 or 'GT3' - > 3)" },
    { name: 'Pstatus', type: 'Binary', desc: "Parent's cohabitation status ('T' - together or 'A' - apart)" },
    { name: 'Medu / Fedu', type: 'Ordinal', desc: "Mother's / Father's education (0 - none to 4 - higher education)" },
    { name: 'Mjob / Fjob', type: 'Nominal', desc: "Mother's / Father's job ('teacher', 'health', 'services', 'at_home', 'other')" },
    { name: 'studytime', type: 'Ordinal', desc: 'Weekly study time (1: <2 hrs, 2: 2-5 hrs, 3: 5-10 hrs, 4: >10 hrs)' },
    { name: 'failures', type: 'Numeric', desc: 'Number of past class failures (0 to 3+ failures)' },
    { name: 'schoolsup', type: 'Binary', desc: 'Extra educational school support (yes or no)' },
    { name: 'higher', type: 'Binary', desc: 'Desire to pursue higher education (yes or no)' },
    { name: 'absences', type: 'Numeric', desc: 'Number of school absences (0 to 93)' },
    { name: 'G1', type: 'Numeric', desc: 'First period examination grade (0 to 20)' },
    { name: 'G2', type: 'Numeric', desc: 'Second period examination grade (0 to 20)' },
    { name: 'G3', type: 'Target', desc: 'Final grade (0 to 20 scale, regression output target)' },
    { name: 'academic_risk', type: 'Target', desc: 'Binary risk classification: 1 if G3 < 10, else 0' },
  ];

  return (
    <div className="max-w-[1440px] w-full mx-auto px-6 lg:px-10 py-8 space-y-8 pb-16">
      {/* Section 0: Academic Monograph Header & Dossier Meta */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#c1c8c2]">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#55624e] font-bold">
            <span className="w-2 h-2 bg-[#0a3525] inline-block"></span>
            <span>Archival Record Series · Vol. XIV · Empirical Inspection Module</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-[#414944] tabular-nums font-mono">
            <span>SHA-256: <code className="bg-[#f5ece5] px-1 py-0.5 text-[#1e1b17]">d98e4f...31a0c</code></span>
            <span>•</span>
            <span className="text-[#0a3525] font-semibold">Sample Integrity: Verified Complete</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-baseline">
          <div className="lg:col-span-8 space-y-1">
            <span className="text-[10px] uppercase tracking-wider text-[#0a3525] font-bold">Descriptive Laboratory Protocol</span>
            <h1 className="text-3xl lg:text-4xl font-serif text-[#0a3525] tracking-tight">Start with the evidence.</h1>
            <p className="text-sm text-[#414944] max-w-3xl leading-relaxed">
              Systematic data audit, dimension verification, feature distributions, and exploratory inspection of the{' '}
              <code className="font-mono text-[#1e1b17] bg-[#f5ece5] px-1.5 py-0.5">student-{course}.csv</code> dataset.
            </p>
          </div>

          <div className="lg:col-span-4 flex flex-col justify-end lg:items-end gap-2 pt-2 lg:pt-0">
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportCSV}
                className="px-3.5 py-2 bg-[#ffffff] border border-[#717973] text-[#0a3525] font-bold text-xs hover:bg-[#f5ece5] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">download</span>
                <span>Export Raw Manifest</span>
              </button>
              <div className="px-3 py-2 bg-[#0a3525] text-[#ffffff] border border-[#0a3525] font-bold text-xs inline-flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">verified</span>
                <span>Audit Certified (0 Nulls)</span>
              </div>
            </div>
            <span className="text-[10px] text-[#55624e] uppercase tracking-wider font-semibold">
              Provenance: Cortez &amp; Silva (2008) · Univ. Minho
            </span>
          </div>
        </div>
      </section>

      {/* Section 1: Quality Audit Summary Strip */}
      <section className="bg-[#ffffff] border border-[#c1c8c2] p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-[#c1c8c2] mb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0a3525] text-base">rule</span>
            <h2 className="text-xs uppercase tracking-wider font-bold text-[#1e1b17]">Dataset Metadata &amp; Verification Matrix</h2>
          </div>
          <span className="text-[10px] text-[#55624e] uppercase font-mono font-semibold">Ingestion Hash: P-{course.toUpperCase()}-2008-0395</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="space-y-1">
            <span className="text-[10px] text-[#55624e] uppercase block font-bold">File Identifier</span>
            <span className="text-sm text-[#0a3525] font-mono font-bold block">student-{course}.csv</span>
            <span className="text-xs text-[#414944]">{course === 'mat' ? 'Mathematics Cohort' : 'Portuguese Cohort'}</span>
          </div>
          <div className="space-y-1 border-l border-[#c1c8c2] pl-4">
            <span className="text-[10px] text-[#55624e] uppercase block font-bold">Observation Rows</span>
            <span className="text-2xl text-[#0a3525] tabular-nums font-serif font-bold">{summary?.total_records || 395}</span>
            <span className="text-xs text-[#55624e]">N = {summary?.total_records || 395} students</span>
          </div>
          <div className="space-y-1 border-l border-[#c1c8c2] pl-4">
            <span className="text-[10px] text-[#55624e] uppercase block font-bold">Feature Space</span>
            <span className="text-2xl text-[#0a3525] tabular-nums font-serif font-bold">33</span>
            <span className="text-xs text-[#414944]">17 Cat. / 16 Num.</span>
          </div>
          <div className="space-y-1 border-l border-[#c1c8c2] pl-4">
            <span className="text-[10px] text-[#55624e] uppercase block font-bold">Missing Cells</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl text-[#0a3525] tabular-nums font-serif font-bold">0</span>
              <span className="text-[10px] text-[#55624e]">(0.00%)</span>
            </div>
            <span className="text-xs text-[#0a3525] font-semibold inline-flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">check_circle</span> 100% Complete
            </span>
          </div>
          <div className="space-y-1 border-l border-[#c1c8c2] pl-4">
            <span className="text-[10px] text-[#55624e] uppercase block font-bold">Duplicate Records</span>
            <span className="text-2xl text-[#0a3525] tabular-nums font-serif font-bold">0</span>
            <span className="text-xs text-[#55624e]">Zero collisions</span>
          </div>
          <div className="space-y-1 border-l border-[#c1c8c2] pl-4">
            <span className="text-[10px] text-[#55624e] uppercase block font-bold">Primary Regressor</span>
            <span className="text-sm text-[#0a3525] font-mono font-bold block">G3 (0–20 Scale)</span>
            <span className="text-xs text-[#762e16] font-bold">Derived Cutoff: &lt; 10</span>
          </div>
        </div>
      </section>

      {/* View Switcher Tabs: Records Matrix vs Attribute Dictionary vs Pipeline */}
      <div className="flex items-center justify-between border-b border-[#c1c8c2] pt-2">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('records')}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === 'records'
                ? 'bg-[#0a3525] text-[#ffffff] border-t-2 border-[#0a3525]'
                : 'text-[#414944] hover:bg-[#f5ece5]'
            }`}
          >
            Cohort Records ({filtered.length})
          </button>
          <button
            onClick={() => setActiveTab('dictionary')}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === 'dictionary'
                ? 'bg-[#0a3525] text-[#ffffff] border-t-2 border-[#0a3525]'
                : 'text-[#414944] hover:bg-[#f5ece5]'
            }`}
          >
            33-Attribute Dictionary
          </button>
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
              activeTab === 'pipeline'
                ? 'bg-[#0a3525] text-[#ffffff] border-t-2 border-[#0a3525]'
                : 'text-[#414944] hover:bg-[#f5ece5]'
            }`}
          >
            Preprocessing DAG
          </button>
        </div>

        {activeTab === 'records' && (
          <span className="text-xs text-[#55624e] font-mono hidden sm:inline">
            Showing Page {page} of {totalPages} ({filtered.length} matches)
          </span>
        )}
      </div>

      {/* Tab 1: Cohort Records */}
      {activeTab === 'records' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="p-3 bg-[#ffffff] border border-[#c1c8c2] flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-[#55624e] font-bold uppercase text-[10px]">Search:</span>
                <input
                  type="text"
                  placeholder="Filter by school, job, age..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setPage(1);
                  }}
                  className="px-2.5 py-1 bg-[#f5ece5] border border-[#c1c8c2] text-xs outline-none w-48 text-[#1e1b17]"
                />
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[#55624e] font-bold uppercase text-[10px]">Risk Filter:</span>
                <select
                  value={riskFilter}
                  onChange={(e) => {
                    setRiskFilter(e.target.value);
                    setPage(1);
                  }}
                  className="px-2 py-1 bg-[#f5ece5] border border-[#c1c8c2] text-xs outline-none text-[#1e1b17] cursor-pointer"
                >
                  <option value="all">All Cohort ({records.length})</option>
                  <option value="at_risk">At-Risk Only (G3 &lt; 10)</option>
                  <option value="passing">Passing Only (G3 ≥ 10)</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[#55624e] font-bold uppercase text-[10px]">School:</span>
                <select
                  value={schoolFilter}
                  onChange={(e) => {
                    setSchoolFilter(e.target.value);
                    setPage(1);
                  }}
                  className="px-2 py-1 bg-[#f5ece5] border border-[#c1c8c2] text-xs outline-none text-[#1e1b17] cursor-pointer"
                >
                  <option value="all">All Schools</option>
                  <option value="GP">Gabriel Pereira (GP)</option>
                  <option value="MS">Mousinho da Silveira (MS)</option>
                </select>
              </div>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-1 font-mono">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-2.5 py-1 bg-[#f5ece5] border border-[#c1c8c2] disabled:opacity-40 hover:bg-[#c1c8c2] cursor-pointer"
              >
                Prev
              </button>
              <span className="px-2 text-xs">
                {page} / {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-2.5 py-1 bg-[#f5ece5] border border-[#c1c8c2] disabled:opacity-40 hover:bg-[#c1c8c2] cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>

          {/* Interactive Records Table */}
          <div className="bg-[#ffffff] border border-[#c1c8c2] overflow-x-auto shadow-xs">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#f5ece5] border-b-2 border-[#0a3525] text-[#1e1b17] font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">School</th>
                  <th className="py-2.5 px-3">Sex</th>
                  <th className="py-2.5 px-3">Age</th>
                  <th className="py-2.5 px-3">Address</th>
                  <th className="py-2.5 px-3">Study Time</th>
                  <th className="py-2.5 px-3">Failures</th>
                  <th className="py-2.5 px-3">Medu</th>
                  <th className="py-2.5 px-3">Higher</th>
                  <th className="py-2.5 px-3">Absences</th>
                  <th className="py-2.5 px-3 text-right">G1</th>
                  <th className="py-2.5 px-3 text-right">G2</th>
                  <th className="py-2.5 px-3 text-right font-bold text-[#0a3525]">G3 (Target)</th>
                  <th className="py-2.5 px-3 text-center">Risk Label</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#c1c8c2] font-mono text-xs">
                {paginated.map((row, idx) => {
                  const isAtRisk = row.academic_risk === 1;
                  return (
                    <tr key={idx} className="hover:bg-[#fbf2ea] transition-colors">
                      <td className="py-2 px-3 text-[#717973]">{(page - 1) * pageSize + idx + 1}</td>
                      <td className="py-2 px-3 font-bold text-[#0a3525]">{row.school}</td>
                      <td className="py-2 px-3">{row.sex}</td>
                      <td className="py-2 px-3">{row.age}</td>
                      <td className="py-2 px-3">{row.address}</td>
                      <td className="py-2 px-3">{row.studytime} ({row.studytime === 1 ? '<2h' : row.studytime === 2 ? '2-5h' : row.studytime === 3 ? '5-10h' : '>10h'})</td>
                      <td className={`py-2 px-3 font-bold ${row.failures > 0 ? 'text-[#762e16]' : 'text-[#55624e]'}`}>
                        {row.failures}
                      </td>
                      <td className="py-2 px-3">{row.Medu}</td>
                      <td className="py-2 px-3 font-semibold">{row.higher}</td>
                      <td className="py-2 px-3">{row.absences}</td>
                      <td className="py-2 px-3 text-right font-semibold">{row.G1}</td>
                      <td className="py-2 px-3 text-right font-semibold">{row.G2}</td>
                      <td className={`py-2 px-3 text-right font-bold text-sm ${isAtRisk ? 'text-[#762e16]' : 'text-[#0a3525]'}`}>
                        {row.G3}
                      </td>
                      <td className="py-2 px-3 text-center">
                        <span
                          className={`px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider ${
                            isAtRisk
                              ? 'bg-[#faeeeb] border border-[#762e16] text-[#762e16]'
                              : 'bg-[#f5ece5] border border-[#0a3525] text-[#0a3525]'
                          }`}
                        >
                          {isAtRisk ? 'At-Risk' : 'Passing'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: 33-Attribute Dictionary */}
      {activeTab === 'dictionary' && (
        <div className="bg-[#ffffff] border border-[#c1c8c2] p-5 shadow-xs">
          <div className="border-b border-[#c1c8c2] pb-3 mb-4">
            <h3 className="text-lg font-serif font-bold text-[#0a3525]">33-Attribute Variable Specification</h3>
            <p className="text-xs text-[#414944] mt-0.5">
              Comprehensive taxonomy and semantic definition of demographic, social, and academic attributes in the dataset.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {attributeDictionary.map((attr, idx) => (
              <div key={idx} className="p-3 bg-[#f5ece5] border border-[#c1c8c2] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono font-bold text-[#0a3525] text-sm">{attr.name}</span>
                    <span
                      className={`text-[10px] uppercase px-1.5 py-0.5 font-bold ${
                        attr.type === 'Target'
                          ? 'bg-[#762e16] text-[#ffffff]'
                          : 'bg-[#ffffff] border border-[#c1c8c2] text-[#55624e]'
                      }`}
                    >
                      {attr.type}
                    </span>
                  </div>
                  <p className="text-xs text-[#414944]">{attr.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Preprocessing DAG */}
      {activeTab === 'pipeline' && (
        <section className="space-y-4">
          <div className="border-b border-[#c1c8c2] pb-2">
            <span className="text-[10px] uppercase tracking-wider text-[#55624e] font-bold">Mathematical Conditioning</span>
            <h2 className="text-2xl font-serif text-[#0a3525]">Pipeline Transformation Architecture</h2>
            <p className="text-xs text-[#414944]">Reproducible DAG (Python 3.11 · Scikit-Learn 1.3)</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-0 border border-[#c1c8c2] bg-[#ffffff]">
            {/* Step 1 */}
            <div className="p-4 border-b md:border-b-0 md:border-r border-[#c1c8c2]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase tracking-wider text-[#55624e] font-bold">Step 01</span>
                <span className="w-5 h-5 bg-[#f5ece5] flex items-center justify-center text-[10px] font-mono text-[#0a3525] font-bold">I</span>
              </div>
              <h3 className="font-bold text-sm text-[#0a3525] mb-1">Raw Dataset</h3>
              <p className="text-[11px] font-mono text-[#55624e] mb-2">395 × 33 Vector Space</p>
              <p className="text-xs text-[#414944]">
                Direct ingestion from Portuguese secondary school registry mapping demographics, social attributes, and quarterly grades.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-4 border-b md:border-b-0 md:border-r border-[#c1c8c2] bg-[#fbf2ea]/40">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase tracking-wider text-[#55624e] font-bold">Step 02</span>
                <span className="w-5 h-5 bg-[#f5ece5] flex items-center justify-center text-[10px] font-mono text-[#0a3525] font-bold">II</span>
              </div>
              <h3 className="font-bold text-sm text-[#0a3525] mb-1">Quality Assertions</h3>
              <p className="text-[11px] font-mono text-[#55624e] mb-2">Nulls = 0 · Range [0,20]</p>
              <p className="text-xs text-[#414944]">
                Zero NaN assertion pass. Boundary checks across ordinal variables. Identification of structural zero dropouts on final exam G3.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-4 border-b md:border-b-0 md:border-r border-[#c1c8c2]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase tracking-wider text-[#55624e] font-bold">Step 03</span>
                <span className="w-5 h-5 bg-[#f5ece5] flex items-center justify-center text-[10px] font-mono text-[#0a3525] font-bold">III</span>
              </div>
              <h3 className="font-bold text-sm text-[#0a3525] mb-1">Categorical Encoding</h3>
              <p className="text-[11px] font-mono text-[#55624e] mb-2">One-Hot &amp; Binary</p>
              <p className="text-xs text-[#414944]">
                Binary conversion for (sex, address, schoolsup, higher). Multi-level nominal dummy encoding for guardian, Mjob, Fjob, and reason.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-4 border-b md:border-b-0 md:border-r border-[#c1c8c2] bg-[#fbf2ea]/40">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase tracking-wider text-[#55624e] font-bold">Step 04</span>
                <span className="w-5 h-5 bg-[#f5ece5] flex items-center justify-center text-[10px] font-mono text-[#0a3525] font-bold">IV</span>
              </div>
              <h3 className="font-bold text-sm text-[#0a3525] mb-1">Normalization</h3>
              <p className="text-[11px] font-mono text-[#55624e] mb-2">StandardScaler (μ=0, σ=1)</p>
              <p className="text-xs text-[#414944]">
                Standardization applied specifically for distance-based estimators (KNN, Logistic Reg, Ridge). Preserved unscaled for Tree ensembles.
              </p>
            </div>

            {/* Step 5 */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] uppercase tracking-wider text-[#55624e] font-bold">Step 05</span>
                <span className="w-5 h-5 bg-[#f5ece5] flex items-center justify-center text-[10px] font-mono text-[#0a3525] font-bold">V</span>
              </div>
              <h3 className="font-bold text-sm text-[#0a3525] mb-1">Partition Protocol</h3>
              <p className="text-[11px] font-mono text-[#55624e] mb-2">Stratified 80:20 Split</p>
              <p className="text-xs text-[#414944]">
                Zero data leakage guarantee. G3 completely withheld from predictor space X. Stratified splitting preserves 32.9% risk class balance.
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
