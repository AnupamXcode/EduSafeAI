import React, { useEffect, useState } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Cell,
  Legend,
} from 'recharts';
import { ClusteringResponse } from '../types';
import { api } from '../api/client';
import { Layers, Users, Sliders, Sparkles, TrendingUp } from 'lucide-react';

interface StudentSegmentsPageProps {
  course: string;
}

export const StudentSegmentsPage: React.FC<StudentSegmentsPageProps> = ({ course }) => {
  const [kClusters, setKClusters] = useState<number>(3);
  const [data, setData] = useState<ClusteringResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Palette colors for clusters
  const clusterColors = ['#244C3A', '#C66B4E', '#A9B8A0', '#762E16', '#3E6653', '#BCCBB2'];

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    api
      .getClusteringModels(course, kClusters)
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
  }, [course, kClusters]);

  return (
    <div className="space-y-8 pb-12">
      {/* Editorial Title & Cluster Slider */}
      <div className="flex flex-wrap justify-between items-end border-b border-[#D9D2C3] pb-6 gap-4">
        <div>
          <h2 className="text-3xl font-normal text-[#244C3A] tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>
            Unsupervised Student Segmentation
          </h2>
          <p className="text-sm text-[#332F2A] opacity-80 mt-1 max-w-2xl leading-relaxed">
            Discovers organic student behavioral archetypes using <strong>K-Means Clustering</strong> and <strong>Gaussian Mixture Models (GMM)</strong>.
            <br />
            <strong className="text-[#244C3A]">Methodological Rigor:</strong> G3 is strictly excluded from clustering inputs and only analyzed retrospectively.
          </p>
        </div>

        {/* K Selector */}
        <div className="panel p-3 bg-[#FFFFFF] flex items-center gap-3">
          <Sliders size={16} className="text-[#244C3A]" />
          <span className="text-xs font-semibold text-[#244C3A]">Cluster Count (K):</span>
          <div className="flex items-center gap-1">
            {[2, 3, 4, 5, 6].map((k) => (
              <button
                key={k}
                onClick={() => setKClusters(k)}
                className={`w-7 h-7 text-xs font-bold transition-all ${
                  kClusters === k ? 'bg-[#244C3A] text-[#FFFFFF]' : 'bg-[#F8F6F0] text-[#332F2A] hover:bg-[#E6DCCB]'
                }`}
              >
                {k}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Primary Visual: Large 2D PCA Cluster Map */}
      {data && (
        <div className="panel p-6 bg-[#FFFFFF]">
          <div className="flex flex-wrap justify-between items-baseline border-b border-[#D9D2C3] pb-3 mb-4 gap-2">
            <div>
              <h3 className="text-lg font-semibold text-[#244C3A]" style={{ fontFamily: 'var(--font-serif)' }}>
                2D Principal Component Analysis (PCA) Student Scatter
              </h3>
              <p className="text-xs text-[#332F2A] opacity-75">
                Each point represents an individual student. Points are clustered in high-dimensional behavioral space and projected onto the top 2 principal components.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="badge-nominal">
                Explained Variance: {((data.explained_variance[0] + data.explained_variance[1]) * 100).toFixed(1)}%
              </span>
              <span className="badge-neutral">
                Silhouette: {data.silhouette_score.toFixed(4)}
              </span>
            </div>
          </div>

          <div className="h-[420px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 15, right: 20, bottom: 20, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#D9D2C3" />
                <XAxis
                  type="number"
                  dataKey="pca1"
                  name="Principal Component 1"
                  tick={{ fill: '#332F2A', fontSize: 11 }}
                  label={{ value: 'Principal Component 1 (Primary Behavioral Variance)', position: 'insideBottom', offset: -10, fontSize: 11, fill: '#332F2A' }}
                />
                <YAxis
                  type="number"
                  dataKey="pca2"
                  name="Principal Component 2"
                  tick={{ fill: '#332F2A', fontSize: 11 }}
                  label={{ value: 'Principal Component 2', angle: -90, position: 'insideLeft', offset: 20, fontSize: 11, fill: '#332F2A' }}
                />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const pt = payload[0].payload;
                      return (
                        <div className="p-3 bg-[#FFFFFF] border border-[#244C3A] text-xs shadow-sm space-y-1">
                          <div className="font-bold text-[#244C3A]">
                            Cluster {pt.cluster} Student
                          </div>
                          <div>Final Grade (G3): <span className="font-bold num">{pt.g3} / 20</span></div>
                          <div>Weekly Study: <span className="num">{pt.studytime} ({pt.studytime === 1 ? '<2h' : pt.studytime === 2 ? '2-5h' : '5h+'})</span></div>
                          <div>Class Failures: <span className="num">{pt.failures}</span></div>
                          <div>School Absences: <span className="num">{pt.absences}</span></div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter data={data.pca_points}>
                  {data.pca_points.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={clusterColors[entry.cluster % clusterColors.length]}
                      opacity={0.8}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="mt-4 pt-3 border-t border-[#D9D2C3] flex flex-wrap gap-4 text-xs font-semibold">
            {Array.from({ length: data.k_selected }).map((_, idx) => (
              <span key={idx} className="flex items-center gap-1.5">
                <span
                  className="w-3 h-3"
                  style={{ backgroundColor: clusterColors[idx % clusterColors.length] }}
                ></span>
                Cluster {idx} ({data.cluster_profiles[idx]?.percentage || 0}%)
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Cluster Characteristic Profiles Table */}
      {data && (
        <div className="panel bg-[#FFFFFF]">
          <div className="p-4 border-b border-[#D9D2C3]">
            <h3 className="text-base font-semibold text-[#244C3A]" style={{ fontFamily: 'var(--font-serif)' }}>
              Empirical Cluster Characteristic Profiles
            </h3>
            <p className="text-xs text-[#332F2A] opacity-75">
              Mean attribute values computed for each discovered student archetype:
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="academic-table">
              <thead>
                <tr>
                  <th>Cluster Archetype</th>
                  <th className="text-right">Student Count</th>
                  <th className="text-right">Cohort Share</th>
                  <th className="text-right">Study Time</th>
                  <th className="text-right">Past Failures</th>
                  <th className="text-right">Absences</th>
                  <th className="text-right">Mean G1</th>
                  <th className="text-right font-bold text-[#244C3A]">Retrospective G3</th>
                </tr>
              </thead>
              <tbody>
                {data.cluster_profiles.map((prof, idx) => (
                  <tr key={idx}>
                    <td className="font-semibold text-[#244C3A] flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5"
                        style={{ backgroundColor: clusterColors[prof.cluster_kmeans % clusterColors.length] }}
                      ></span>
                      Cluster {prof.cluster_kmeans}: {
                        prof.G3 >= 11
                          ? 'High Academic Engagement'
                          : prof.G3 >= 9.5
                          ? 'Moderate Engagement / Stable Attendance'
                          : 'High Vulnerability / Needs Remedial Support'
                      }
                    </td>
                    <td className="text-right num font-semibold">{prof.student_count}</td>
                    <td className="text-right num">{prof.percentage.toFixed(1)}%</td>
                    <td className="text-right num">{prof.studytime.toFixed(2)}</td>
                    <td className="text-right num">{prof.failures.toFixed(2)}</td>
                    <td className="text-right num">{prof.absences.toFixed(1)}</td>
                    <td className="text-right num">{prof.G1.toFixed(1)}</td>
                    <td className="text-right num font-bold text-[#244C3A]">{prof.G3.toFixed(2)} / 20</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Elbow Method & GMM Component Comparison */}
      {data && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Elbow Method Inertia (6 cols) */}
          <div className="lg:col-span-6 panel p-6 bg-[#FFFFFF]">
            <div className="border-b border-[#D9D2C3] pb-3 mb-4">
              <h3 className="text-base font-semibold text-[#244C3A]" style={{ fontFamily: 'var(--font-serif)' }}>
                Elbow Method: Sum of Squared Errors (Inertia vs K)
              </h3>
              <p className="text-xs text-[#332F2A] opacity-75">
                Evaluates cluster compactness for K = 1 to 12. Elbow bend appears near K = 3.
              </p>
            </div>

            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.elbow_series} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#D9D2C3" />
                  <XAxis dataKey="k" tick={{ fill: '#332F2A', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#332F2A', fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #244C3A',
                      borderRadius: '0px',
                      fontSize: '11px',
                    }}
                  />
                  <Line type="monotone" dataKey="inertia" stroke="#244C3A" strokeWidth={2} dot={{ fill: '#C66B4E', r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* GMM Components Comparison (6 cols) */}
          <div className="lg:col-span-6 panel bg-[#FFFFFF]">
            <div className="p-4 border-b border-[#D9D2C3]">
              <h3 className="text-base font-semibold text-[#244C3A]" style={{ fontFamily: 'var(--font-serif)' }}>
                Gaussian Mixture Model (EM Soft Clustering)
              </h3>
              <p className="text-xs text-[#332F2A] opacity-75">
                Akaike and Bayesian Information Criteria (AIC & BIC) comparison:
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="academic-table">
                <thead>
                  <tr>
                    <th>Components (K)</th>
                    <th className="text-right">AIC Score</th>
                    <th className="text-right">BIC Score</th>
                    <th className="text-right">Silhouette</th>
                  </tr>
                </thead>
                <tbody>
                  {data.gmm_comparison.map((row, idx) => (
                    <tr key={idx}>
                      <td className="font-semibold text-[#244C3A]">K = {row['Components (K)']} Components</td>
                      <td className="text-right num">{row.AIC.toLocaleString()}</td>
                      <td className="text-right num font-semibold">{row.BIC.toLocaleString()}</td>
                      <td className="text-right num">{row['Silhouette Score'].toFixed(4)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 text-xs text-[#332F2A] opacity-75 border-t border-[#D9D2C3] leading-relaxed">
              <strong>Soft Membership Benefit:</strong> Unlike hard K-Means assignments, GMM calculates posterior membership probabilities, identifying borderline students with hybrid study characteristics.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
