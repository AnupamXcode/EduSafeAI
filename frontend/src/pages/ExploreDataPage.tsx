import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ScatterChart, Scatter, ReferenceLine, Legend, Cell
} from 'recharts';
import { api } from '../api/client';
import { EdaData, DatasetSummary } from '../types';
import { Database, Search, CheckCircle, HelpCircle, Grid, ChevronDown, ChevronUp } from 'lucide-react';

interface ExploreDataPageProps {
  course: string;
  summary: DatasetSummary | null;
}

export const ExploreDataPage: React.FC<ExploreDataPageProps> = ({ course, summary }) => {
  const [eda, setEda] = useState<EdaData | null>(null);
  const [preview, setPreview] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewLimit, setPreviewLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    Promise.all([api.getEdaData(course), api.getDatasetPreview(course, 50)])
      .then(([edaData, prevData]) => {
        if (isMounted) {
          setEda(edaData);
          setPreview(prevData.records);
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

  // Compute average final grade from grade distribution
  const avgG3 = React.useMemo(() => {
    if (!eda?.grade_distribution?.length) return course === 'mat' ? '10.4' : '11.9';
    let totalScore = 0;
    let totalStudents = 0;
    eda.grade_distribution.forEach((item) => {
      totalScore += item.grade * item.G3;
      totalStudents += item.G3;
    });
    return totalStudents > 0 ? (totalScore / totalStudents).toFixed(1) : '10.4';
  }, [eda, course]);

  // Filter preview records
  const filteredPreview = preview.filter((row) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      row.school?.toLowerCase().includes(term) ||
      row.sex?.toLowerCase().includes(term) ||
      String(row.age).includes(term) ||
      String(row.studytime).includes(term) ||
      String(row.G1).includes(term) ||
      String(row.G2).includes(term) ||
      String(row.G3).includes(term)
    );
  });

  const correlationKeys = eda?.correlation_matrix ? Object.keys(eda.correlation_matrix) : [];

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 py-8 lg:py-12 space-y-12">
      {/* Page Header */}
      <section className="space-y-3 animate-slide-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#E9E4F5] text-[#5146A5] rounded-full text-xs font-semibold">
          <Database size={14} className="text-[#F28C45]" />
          <span>Practical 1: Dataset Exploration, Preprocessing &amp; Feature Analysis</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#17243B] tracking-tight">
          Explore the student data
        </h1>
        <p className="text-base text-[#555866] max-w-3xl leading-relaxed">
          We use student academic records to study how factors such as study time, absences, previous grades, and other recorded characteristics relate to final performance.
        </p>
      </section>

      {/* Dataset Summary Cards */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-up">
        <div className="p-5 bg-[#FFFFFF] border border-[#E9E4F5] rounded-2xl shadow-2xs">
          <span className="text-xs text-[#828696] font-semibold block uppercase tracking-wider">Number of Student Records</span>
          <div className="text-3xl font-serif font-bold text-[#17243B] mt-1">
            {summary?.total_records || (course === 'mat' ? 395 : 649)}
          </div>
          <p className="text-xs text-[#555866] mt-1">Real records from UCI repository</p>
        </div>

        <div className="p-5 bg-[#FFFFFF] border border-[#E9E4F5] rounded-2xl shadow-2xs">
          <span className="text-xs text-[#828696] font-semibold block uppercase tracking-wider">Number of Features</span>
          <div className="text-3xl font-serif font-bold text-[#5146A5] mt-1">33</div>
          <p className="text-xs text-[#555866] mt-1">Demographic, social &amp; academic</p>
        </div>

        <div className="p-5 bg-[#FFFFFF] border border-[#E9E4F5] rounded-2xl shadow-2xs">
          <span className="text-xs text-[#828696] font-semibold block uppercase tracking-wider">Missing-Value Count</span>
          <div className="text-3xl font-serif font-bold text-[#789579] mt-1 flex items-center gap-2">
            <span>0</span>
            <CheckCircle size={22} className="text-[#789579]" />
          </div>
          <p className="text-xs text-[#555866] mt-1">100% complete benchmark data</p>
        </div>

        <div className="p-5 bg-[#FFFFFF] border border-[#E9E4F5] rounded-2xl shadow-2xs">
          <span className="text-xs text-[#828696] font-semibold block uppercase tracking-wider">Average Final Grade</span>
          <div className="text-3xl font-serif font-bold text-[#F28C45] mt-1">
            {avgG3} <span className="text-base text-[#828696] font-sans font-normal">/ 20</span>
          </div>
          <p className="text-xs text-[#555866] mt-1">Passing boundary: G3 &ge; 10</p>
        </div>
      </section>

      {/* 5 Main Analytical Graphs */}
      <section className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-2 border-b border-[#E9E4F5] pb-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#5146A5]">Core Visualizations</span>
            <h2 className="text-2xl font-serif font-bold text-[#17243B]">Five Key Insights from the Student Data</h2>
          </div>
          <span className="text-xs text-[#828696]">Rendered from genuine {course === 'mat' ? 'Mathematics' : 'Portuguese'} cohort records</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Graph 1: Distribution of Final Grades */}
          <div className="bg-[#FFFFFF] border border-[#E9E4F5] rounded-2xl p-6 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#5146A5]">Graph 1</span>
                <h3 className="font-serif text-lg font-bold text-[#17243B]">Distribution of Final Grades (G3)</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#FBE6D5] text-[#D6732E] text-xs font-bold">
                Pass Threshold: 10 / 20
              </span>
            </div>

            <div className="h-[280px] w-full pt-2">
              {eda ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={eda.grade_distribution} margin={{ top: 15, right: 10, left: -15, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#FAF7F0" vertical={false} />
                    <XAxis dataKey="grade" tick={{ fill: '#17243B', fontSize: 11 }} label={{ value: 'Grade (G3 out of 20)', position: 'insideBottom', offset: -5, fontSize: 11, fill: '#555866' }} />
                    <YAxis tick={{ fill: '#17243B', fontSize: 11 }} label={{ value: 'Students', angle: -90, position: 'insideLeft', fontSize: 11, fill: '#555866' }} />
                    <Tooltip
                      formatter={(val: any) => [val, 'Students']}
                      labelFormatter={(label) => `Score: ${label}/20 (${Number(label) < 10 ? 'At Risk' : 'Passing'})`}
                      contentStyle={{
                        backgroundColor: '#17243B',
                        border: '1px solid #5146A5',
                        borderRadius: '8px',
                        color: '#FFFFFF',
                        fontSize: '12px'
                      }}
                    />
                    <ReferenceLine x={10} stroke="#F28C45" strokeWidth={2} strokeDasharray="4 4" label={{ value: 'Pass (10)', fill: '#F28C45', fontSize: 11, position: 'top' }} />
                    <Bar dataKey="G3" name="Student Count">
                      {eda.grade_distribution.map((entry, idx) => (
                        <Cell key={idx} fill={entry.grade < 10 ? '#F28C45' : '#5146A5'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-[#828696]">Loading distribution...</div>
              )}
            </div>

            <p className="text-xs text-[#555866] pt-1 border-t border-[#FAF7F0] italic leading-relaxed">
              This chart shows how final grades are distributed across the available student records. Notice the passing boundary at 10 marks and the cluster of students at score 0 who dropped out or missed the examination.
            </p>
          </div>

          {/* Graph 2: Study Time vs Final Grade */}
          <div className="bg-[#FFFFFF] border border-[#E9E4F5] rounded-2xl p-6 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#5146A5]">Graph 2</span>
                <h3 className="font-serif text-lg font-bold text-[#17243B]">Study Time vs Final Grade</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#E9E4F5] text-[#5146A5] text-xs font-bold">
                1: &lt;2h | 2: 2-5h | 3: 5-10h | 4: &gt;10h
              </span>
            </div>

            <div className="h-[280px] w-full pt-2">
              {eda ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={eda.study_comparison} margin={{ top: 15, right: 10, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#FAF7F0" vertical={false} />
                    <XAxis dataKey="studytime" tick={{ fill: '#17243B', fontSize: 11 }} label={{ value: 'Weekly Study Time Category', position: 'insideBottom', offset: -5, fontSize: 11, fill: '#555866' }} />
                    <YAxis domain={[0, 20]} tick={{ fill: '#17243B', fontSize: 11 }} label={{ value: 'Avg Grade (0-20)', angle: -90, position: 'insideLeft', fontSize: 11, fill: '#555866' }} />
                    <Tooltip
                      formatter={(val: any) => [`${val} / 20`, 'Average Grade']}
                      contentStyle={{
                        backgroundColor: '#17243B',
                        border: '1px solid #5146A5',
                        borderRadius: '8px',
                        color: '#FFFFFF',
                        fontSize: '12px'
                      }}
                    />
                    <Bar dataKey="mean_g3" name="Average G3 Score">
                      {eda.study_comparison.map((entry, idx) => (
                        <Cell key={idx} fill={idx >= 2 ? '#5146A5' : '#789579'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-[#828696]">Loading study time data...</div>
              )}
            </div>

            <p className="text-xs text-[#555866] pt-1 border-t border-[#FAF7F0] italic leading-relaxed">
              This chart helps us examine the relationship between recorded study time and final grades. It does not prove that study time alone causes higher grades.
            </p>
          </div>

          {/* Graph 3: Absences vs Final Grade */}
          <div className="bg-[#FFFFFF] border border-[#E9DFCC] rounded-2xl p-6 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#5146A5]">Graph 3</span>
                <h3 className="font-serif text-lg font-bold text-[#17243B]">Absences vs Final Grade</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#FAF7F0] text-[#17243B] text-xs font-bold border border-[#E9E4F5]">
                Scatter Plot (Attendance Impact)
              </span>
            </div>

            <div className="h-[280px] w-full pt-2">
              {eda ? (
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 15, right: 10, left: -15, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#FAF7F0" />
                    <XAxis type="number" dataKey="absences" name="Absences" tick={{ fill: '#17243B', fontSize: 11 }} label={{ value: 'Days Absent', position: 'insideBottom', offset: -5, fontSize: 11, fill: '#555866' }} />
                    <YAxis type="number" dataKey="g3" name="Grade G3" domain={[0, 20]} tick={{ fill: '#17243B', fontSize: 11 }} label={{ value: 'Final Grade (G3)', angle: -90, position: 'insideLeft', fontSize: 11, fill: '#555866' }} />
                    <Tooltip
                      formatter={(val: any, name: any) => [val, name === 'absences' ? 'Days Absent' : 'Final Grade (G3)']}
                      contentStyle={{
                        backgroundColor: '#17243B',
                        border: '1px solid #5146A5',
                        borderRadius: '8px',
                        color: '#FFFFFF',
                        fontSize: '12px'
                      }}
                    />
                    <ReferenceLine y={10} stroke="#F28C45" strokeDasharray="3 3" label={{ value: 'Pass Boundary (10)', fill: '#F28C45', fontSize: 10 }} />
                    <Scatter data={eda.absences_scatter} fill="#5146A5" opacity={0.65} />
                  </ScatterChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-[#828696]">Loading scatter data...</div>
              )}
            </div>

            <p className="text-xs text-[#555866] pt-1 border-t border-[#FAF7F0] italic leading-relaxed">
              This graph shows how recorded absences and final grades are distributed. While occasional absences are manageable, high absentee rates (&gt; 15 days) correlate strongly with academic failure.
            </p>
          </div>

          {/* Graph 4: Previous Grades vs Final Grade */}
          <div className="bg-[#FFFFFF] border border-[#E9DFCC] rounded-2xl p-6 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#5146A5]">Graph 4</span>
                <h3 className="font-serif text-lg font-bold text-[#17243B]">Previous Grades (G1, G2) vs Final Grade (G3)</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-[#E9E4F5] text-[#5146A5] text-xs font-bold">
                Term Exam Progression
              </span>
            </div>

            <div className="h-[280px] w-full pt-2">
              {eda ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={eda.grade_distribution.slice(4, 18)} margin={{ top: 15, right: 10, left: -15, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#FAF7F0" vertical={false} />
                    <XAxis dataKey="grade" tick={{ fill: '#17243B', fontSize: 11 }} label={{ value: 'Score Level (out of 20)', position: 'insideBottom', offset: -5, fontSize: 11, fill: '#555866' }} />
                    <YAxis tick={{ fill: '#17243B', fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#17243B',
                        border: '1px solid #5146A5',
                        borderRadius: '8px',
                        color: '#FFFFFF',
                        fontSize: '12px'
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }} />
                    <Bar dataKey="G1" fill="#789579" name="Period 1 Exam (G1)" />
                    <Bar dataKey="G2" fill="#F2C14E" name="Period 2 Exam (G2)" />
                    <Bar dataKey="G3" fill="#5146A5" name="Final Exam (G3)" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-[#828696]">Loading grade comparison...</div>
              )}
            </div>

            <p className="text-xs text-[#555866] pt-1 border-t border-[#FAF7F0] italic leading-relaxed">
              This chart compares Period 1 (G1), Period 2 (G2), and Final (G3) exam scores across performance bands, demonstrating high longitudinal consistency across terms.
            </p>
          </div>
        </div>

        {/* Graph 5: Numerical Correlation Heatmap Matrix */}
        <div className="bg-[#FFFFFF] border border-[#E9E4F5] rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#5146A5]">Graph 5</span>
              <h3 className="font-serif text-lg font-bold text-[#17243B]">
                Numerical Correlation Heatmap Matrix (Pearson r)
              </h3>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[#5146A5]"></span> Positive Corr (&gt; 0.3)</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[#FAF7F0] border border-[#E9E4F5]"></span> Neutral</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[#F28C45]"></span> Negative Corr (&lt; -0.2)</span>
            </div>
          </div>

          {eda?.correlation_matrix ? (
            <div className="overflow-x-auto">
              <table className="w-full text-center text-xs border-collapse">
                <thead>
                  <tr className="bg-[#FAF7F0] text-[#17243B]">
                    <th className="p-2.5 text-left font-bold border border-[#E9E4F5]">Feature</th>
                    {correlationKeys.map((k) => (
                      <th key={k} className="p-2.5 font-bold border border-[#E9E4F5]">
                        {k}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {correlationKeys.map((rowKey) => (
                    <tr key={rowKey} className="hover:bg-[#FAF7F0]">
                      <td className="p-2.5 text-left font-bold text-[#17243B] bg-[#FAF7F0] border border-[#E9E4F5]">
                        {rowKey}
                      </td>
                      {correlationKeys.map((colKey) => {
                        const val = eda.correlation_matrix[rowKey]?.[colKey] ?? 0;
                        let bg = '#FFFFFF';
                        let textColor = '#292B33';
                        if (rowKey === colKey) {
                          bg = '#E9E4F5';
                          textColor = '#5146A5';
                        } else if (val >= 0.5) {
                          bg = '#5146A5';
                          textColor = '#FFFFFF';
                        } else if (val >= 0.2) {
                          bg = '#E9E4F5';
                          textColor = '#5146A5';
                        } else if (val <= -0.2) {
                          bg = '#FBE6D5';
                          textColor = '#D6732E';
                        }
                        return (
                          <td
                            key={colKey}
                            style={{ backgroundColor: bg, color: textColor }}
                            className="p-2 border border-[#E9E4F5] font-mono text-[11px] font-semibold"
                            title={`${rowKey} vs ${colKey}: ${val}`}
                          >
                            {val.toFixed(2)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-[#828696]">Loading correlation heatmap...</div>
          )}

          <p className="text-xs text-[#555866] pt-1 border-t border-[#FAF7F0] italic leading-relaxed">
            This matrix displays the pairwise correlation across all numerical variables. Notice that previous grades (G1: +0.80, G2: +0.90) exhibit high positive correlation with final performance G3, while past failures (-0.36) show strong negative correlation.
          </p>
        </div>
      </section>

      {/* Data Preprocessing Explanation */}
      <section className="bg-[#FFFFFF] border border-[#E9E4F5] rounded-2xl p-6 sm:p-8 space-y-4 shadow-2xs">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#5146A5]">Data Preparation</span>
          <h2 className="text-2xl font-serif font-bold text-[#17243B]">How We Clean &amp; Prepare the Features</h2>
          <p className="text-sm text-[#555866] mt-1">
            Machine learning algorithms require clean numerical data. Here is the exact preprocessing pipeline applied to the UCI dataset:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="p-4 bg-[#FAF7F0] rounded-xl border border-[#E9E4F5]">
            <span className="text-xs font-bold text-[#5146A5] uppercase">Step 1</span>
            <h4 className="font-bold text-sm text-[#17243B] mt-1">Raw Dataset Inspection</h4>
            <p className="text-xs text-[#555866] mt-1">
              Parsed the semicolon-delimited CSV containing 395 secondary students and 33 demographic/academic columns.
            </p>
          </div>

          <div className="p-4 bg-[#FAF7F0] rounded-xl border border-[#E9E4F5]">
            <span className="text-xs font-bold text-[#789579] uppercase">Step 2</span>
            <h4 className="font-bold text-sm text-[#17243B] mt-1">Check Missing Values</h4>
            <p className="text-xs text-[#555866] mt-1">
              Confirmed <strong>0 null or empty values</strong> across all 395 records. No artificial imputation was necessary.
            </p>
          </div>

          <div className="p-4 bg-[#FAF7F0] rounded-xl border border-[#E9E4F5]">
            <span className="text-xs font-bold text-[#5146A5] uppercase">Step 3</span>
            <h4 className="font-bold text-sm text-[#17243B] mt-1">Encode Categoricals</h4>
            <p className="text-xs text-[#555866] mt-1">
              Converted binary categories (sex, internet, higher education) into 0/1 binary indicators and nominals into dummy columns.
            </p>
          </div>

          <div className="p-4 bg-[#FAF7F0] rounded-xl border border-[#E9E4F5]">
            <span className="text-xs font-bold text-[#F28C45] uppercase">Step 4</span>
            <h4 className="font-bold text-sm text-[#17243B] mt-1">Feature Normalization</h4>
            <p className="text-xs text-[#555866] mt-1">
              Fit StandardScaler on training splits only to prevent data leakage, ensuring zero bias in model evaluation.
            </p>
          </div>
        </div>
      </section>

      {/* Dataset Preview Table */}
      <section className="bg-[#FFFFFF] border border-[#E9E4F5] rounded-2xl p-6 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#5146A5]">Raw Student Records</span>
            <h3 className="font-serif text-xl font-bold text-[#17243B]">Dataset Sample Preview</h3>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-2.5 text-[#828696]" />
              <input
                type="text"
                placeholder="Search by age, sex, grades..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-[#FAF7F0] border border-[#E9E4F5] rounded-lg outline-none focus:border-[#5146A5]"
              />
            </div>
            <span className="text-xs text-[#828696]">Showing {Math.min(previewLimit, filteredPreview.length)} of {filteredPreview.length}</span>
          </div>
        </div>

        <div className="overflow-x-auto border border-[#E9E4F5] rounded-xl">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#FAF7F0] border-b border-[#E9E4F5] text-[#17243B] font-semibold text-[11px] uppercase tracking-wider">
                <th className="py-2.5 px-3">School</th>
                <th className="py-2.5 px-3">Sex</th>
                <th className="py-2.5 px-3">Age</th>
                <th className="py-2.5 px-3">Study Time</th>
                <th className="py-2.5 px-3">Failures</th>
                <th className="py-2.5 px-3">Absences</th>
                <th className="py-2.5 px-3">G1</th>
                <th className="py-2.5 px-3">G2</th>
                <th className="py-2.5 px-3 text-right text-[#F28C45]">G3 (Target)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9E4F5] font-mono">
              {filteredPreview.slice(0, previewLimit).map((row, idx) => (
                <tr key={idx} className="hover:bg-[#FAF7F0] transition-colors">
                  <td className="py-2 px-3 font-sans">{row.school === 'GP' ? 'Gabriel Pereira' : 'Mousinho da Silveira'}</td>
                  <td className="py-2 px-3">{row.sex}</td>
                  <td className="py-2 px-3">{row.age}</td>
                  <td className="py-2 px-3">{row.studytime} ({row.studytime === 1 ? '<2h' : row.studytime === 2 ? '2-5h' : row.studytime === 3 ? '5-10h' : '>10h'})</td>
                  <td className="py-2 px-3">{row.failures}</td>
                  <td className="py-2 px-3">{row.absences} days</td>
                  <td className="py-2 px-3 font-semibold">{row.G1}</td>
                  <td className="py-2 px-3 font-semibold">{row.G2}</td>
                  <td className={`py-2 px-3 text-right font-bold ${row.G3 < 10 ? 'text-[#D6732E]' : 'text-[#5146A5]'}`}>
                    {row.G3} / 20
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPreview.length > previewLimit && (
          <div className="text-center pt-2">
            <button
              onClick={() => setPreviewLimit((prev) => prev + 10)}
              className="px-4 py-2 bg-[#FAF7F0] border border-[#E9E4F5] text-[#17243B] rounded-xl text-xs font-semibold hover:border-[#5146A5] transition-all cursor-pointer inline-flex items-center gap-1.5"
            >
              <span>View More Records ({filteredPreview.length - previewLimit} remaining)</span>
              <ChevronDown size={14} />
            </button>
          </div>
        )}
      </section>
    </div>
  );
};
