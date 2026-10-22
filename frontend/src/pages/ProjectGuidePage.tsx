import React, { useState } from 'react';
import { BookOpen, CheckCircle, ChevronDown, ChevronRight, HelpCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export const ProjectGuidePage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const practicals = [
    {
      num: 'Practical 1',
      title: 'Data Preprocessing & Exploratory Data Analysis',
      purpose: 'Verify dataset hygiene, identify distributions, and audit nulls/duplicates without modifying original files.',
      metrics: 'Summary statistics (mean, std), Pearson correlation matrix, histogram frequencies.',
      role: 'Foundational stage ensuring clean, leakage-free data ready for modeling.',
    },
    {
      num: 'Practical 2',
      title: 'Simple & Multiple Linear Regression',
      purpose: 'Forecast continuous final grades (G3: 0–20 scale) using ordinary least squares optimization.',
      metrics: 'MAE, MSE, RMSE, R² (Coefficient of Determination), Train R².',
      role: 'Establishes continuous performance baseline and compares early vs late term forecasting.',
    },
    {
      num: 'Practical 3',
      title: 'Supervised Academic Risk Classification',
      purpose: 'Categorize students into binary risk classes (G3 < 10: At Risk) using supervised classifiers.',
      metrics: 'Accuracy, Precision, Recall, F1-Score, ROC-AUC, Confusion Matrix.',
      role: 'Enables targeted academic advisory intervention where high Recall prevents students falling behind.',
    },
    {
      num: 'Practical 4',
      title: 'K-Means Clustering & Segmentation',
      purpose: 'Discover natural student behavioral cohorts without knowing final examination outcomes.',
      metrics: 'Inertia (Elbow Method K=1..12), Silhouette Score, 2D PCA Explained Variance.',
      role: 'Reveals latent study patterns and attendance cohorts independently of grade biases.',
    },
    {
      num: 'Practical 5',
      title: 'Gaussian Mixture Models & Bagging',
      purpose: 'Implement Expectation-Maximization soft probabilistic clustering and initiate bootstrap aggregation.',
      metrics: 'AIC, BIC, Silhouette, Estimator variance reduction.',
      role: 'Accounts for borderline students with hybrid study habits and stabilizes high-variance decision trees.',
    },
    {
      num: 'Practical 6',
      title: 'Random Forest Ensembles & Class Balancing',
      purpose: 'Mitigate tree correlation using feature subspace randomization and inverse class weights.',
      metrics: 'Out-of-fold generalization, F1-score with class_weight="balanced".',
      role: 'Provides state-of-the-art robust classification for imbalanced minority risk populations.',
    },
    {
      num: 'Practical 7',
      title: 'Stratified Cross-Validation & Hyperparameter Tuning',
      purpose: 'Systematically optimize tree depth, splits, and estimator counts without test-set leakage.',
      metrics: '5-fold and 10-fold Stratified CV Mean F1 ± Std Dev, GridSearchCV vs RandomizedSearchCV timing.',
      role: 'Validates that reported performance generalizes reliably to unseen university cohorts.',
    },
  ];

  const vivaQuestions = [
    {
      q: 'Q1: Why must final grade (G3) and academic risk be strictly excluded from clustering inputs?',
      a: 'If G3 or the derived risk label were passed to K-Means or GMM, the algorithm would trivially cluster students based on their final exam outcome rather than discovering genuine behavioral archetypes. Excluding G3 allows us to cluster students solely on their academic habits (study hours, past failures, attendance) and then retrospectively observe how those behavioral clusters correlate with final achievement.',
    },
    {
      q: 'Q2: Why is Recall for the At-Risk class prioritized over overall Accuracy in academic analytics?',
      a: 'The costs of misclassification are asymmetric. A False Negative means a struggling student is mistakenly labeled as safe; they receive no supplementary tutoring and may fail or drop out. A False Positive simply results in a passing student receiving an invitation for optional academic mentoring. Maximizing Recall (TP / (TP + FN)) ensures the institution catches virtually all vulnerable students.',
    },
    {
      q: 'Q3: How does EduRisk AI guarantee that no data leakage occurs across folds?',
      a: 'All preprocessing transformations (OneHotEncoder for categorical nominals and StandardScaler for numeric features) are embedded strictly inside Scikit-Learn Pipelines. During K-Fold Cross-Validation and GridSearchCV, scaling parameters (mean and variance) are calculated exclusively on the training folds and only transformed onto the validation folds. An untouched 25% test set is held out before any tuning.',
    },
    {
      q: 'Q4: What is the primary difference between Bagging and Random Forest?',
      a: 'Both use bootstrap aggregation. However, in standard Bagging, every decision tree considers all features at every split. If one feature (such as G2 or G1) is dominant, all bagged trees will split on it first, making the trees correlated. Random Forest decorrelates individual trees by evaluating only a random subset of features (typically sqrt(p)) at each split, achieving substantially higher variance reduction when averaged.',
    },
    {
      q: 'Q5: What is the difference between K-Means and Gaussian Mixture Models (GMM)?',
      a: 'K-Means performs "hard" spherical clustering based on Euclidean distance to cluster centroids (minimizing within-cluster sum of squares). Gaussian Mixture Models perform "soft" probabilistic clustering by fitting a mixture of multivariate Gaussian distributions via the Expectation-Maximization (EM) algorithm, providing posterior probabilities of membership for students with borderline habits.',
    },
    {
      q: 'Q6: Why is an Early-Warning Mode necessary when Period 2 grade (G2) has such high predictive correlation?',
      a: 'While G2 is strongly correlated with final exam G3 (correlation ~ 0.90), waiting until G2 is recorded leaves very little time in the academic term for advisory interventions. EduRisk AI provides an explicit Early-Warning Mode that excludes G2, forcing the models to rely on baseline exam G1, past class failures, and weekly study habits to identify risk weeks before midterms.',
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Editorial Title */}
      <div className="border-b border-[#D9D2C3] pb-6">
        <h2 className="text-3xl font-normal text-[#244C3A] tracking-tight" style={{ fontFamily: 'var(--font-serif)' }}>
          Project Guide & Academic Defense Manual
        </h2>
        <p className="text-sm text-[#332F2A] opacity-80 mt-1 max-w-3xl leading-relaxed">
          Comprehensive synthesis of the seven laboratory practicals into a unified student analytics workflow,
          including methodology diagrams, algorithm roles, and high-probability viva examination defense questions.
        </p>
      </div>

      {/* Methodology Pipeline Flow */}
      <div className="panel p-6 bg-[#FFFFFF]">
        <h3 className="text-base font-semibold text-[#244C3A] mb-4 pb-2 border-b border-[#D9D2C3]" style={{ fontFamily: 'var(--font-serif)' }}>
          Integrated System Methodology
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-center text-xs">
          <div className="p-3 bg-[#F8F6F0] border border-[#D9D2C3]">
            <span className="font-bold text-[#244C3A] block mb-1">Step 1</span>
            <strong>Raw Ingestion</strong>
            <p className="text-[11px] opacity-70 mt-1">395 UCI records, 0 nulls audited</p>
          </div>

          <div className="p-3 bg-[#F8F6F0] border border-[#D9D2C3]">
            <span className="font-bold text-[#244C3A] block mb-1">Step 2</span>
            <strong>Pipeline Preprocessing</strong>
            <p className="text-[11px] opacity-70 mt-1">OneHot, Ordinal, StandardScaler</p>
          </div>

          <div className="p-3 bg-[#F8F6F0] border border-[#D9D2C3]">
            <span className="font-bold text-[#244C3A] block mb-1">Step 3</span>
            <strong>Dual Supervised</strong>
            <p className="text-[11px] opacity-70 mt-1">Linear Regression & Logistic Clf</p>
          </div>

          <div className="p-3 bg-[#F8F6F0] border border-[#D9D2C3]">
            <span className="font-bold text-[#244C3A] block mb-1">Step 4</span>
            <strong>Clustering</strong>
            <p className="text-[11px] opacity-70 mt-1">K-Means & GMM without G3 bias</p>
          </div>

          <div className="p-3 bg-[#F8F6F0] border border-[#D9D2C3]">
            <span className="font-bold text-[#244C3A] block mb-1">Step 5</span>
            <strong>Ensemble Suite</strong>
            <p className="text-[11px] opacity-70 mt-1">Bagging (5..100) & Random Forest</p>
          </div>

          <div className="p-3 bg-[#F8F6F0] border border-[#D9D2C3]">
            <span className="font-bold text-[#244C3A] block mb-1">Step 6</span>
            <strong>K-Fold Validation</strong>
            <p className="text-[11px] opacity-70 mt-1">5/10-fold Stratified CV</p>
          </div>

          <div className="p-3 bg-[#244C3A] text-[#FFFFFF] border border-[#244C3A]">
            <span className="font-bold text-[#C66B4E] block mb-1">Step 7</span>
            <strong>GridSearchCV</strong>
            <p className="text-[11px] opacity-90 mt-1">Hyperparameter optimization</p>
          </div>
        </div>
      </div>

      {/* Synthesis of 7 Practicals Table */}
      <div className="panel bg-[#FFFFFF]">
        <div className="p-4 border-b border-[#D9D2C3]">
          <h3 className="text-base font-semibold text-[#244C3A]" style={{ fontFamily: 'var(--font-serif)' }}>
            Practical Curriculum Mapping
          </h3>
          <p className="text-xs text-[#332F2A] opacity-75">
            How each university practical contributes directly to the EduRisk AI analytics engine:
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="academic-table">
            <thead>
              <tr>
                <th style={{ width: '130px' }}>Practical</th>
                <th>Technique & Topic</th>
                <th>Core Algorithms Used</th>
                <th>Evaluation Metrics</th>
                <th>Role in EduRisk AI</th>
              </tr>
            </thead>
            <tbody>
              {practicals.map((p, idx) => (
                <tr key={idx}>
                  <td className="font-bold text-[#244C3A] whitespace-nowrap">{p.num}</td>
                  <td className="font-semibold text-[#332F2A]">{p.title}</td>
                  <td className="text-xs text-[#332F2A] opacity-80">{p.purpose}</td>
                  <td className="text-xs font-mono text-[#244C3A]">{p.metrics}</td>
                  <td className="text-xs text-[#332F2A]">{p.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* High-Probability Viva Defense Questions */}
      <div className="panel p-6 bg-[#FFFFFF]">
        <div className="border-b border-[#D9D2C3] pb-3 mb-4">
          <h3 className="text-base font-semibold text-[#244C3A]" style={{ fontFamily: 'var(--font-serif)' }}>
            High-Probability Viva Examination Q&A
          </h3>
          <p className="text-xs text-[#332F2A] opacity-75">
            Click any question to view the rigorous technical justification for your viva evaluation:
          </p>
        </div>

        <div className="space-y-3">
          {vivaQuestions.map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="border border-[#D9D2C3] bg-[#F8F6F0]">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full text-left p-3.5 flex justify-between items-center text-xs font-semibold text-[#244C3A] hover:bg-[#FFFFFF]"
                >
                  <span>{item.q}</span>
                  {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
                {isOpen && (
                  <div className="p-4 pt-1 bg-[#FFFFFF] border-t border-[#D9D2C3] text-xs text-[#332F2A] leading-relaxed">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 5-Minute Lab Presentation Strategy */}
      <div className="panel p-6 bg-[#FFFFFF]">
        <h3 className="text-base font-semibold text-[#244C3A] mb-3 pb-2 border-b border-[#D9D2C3]" style={{ fontFamily: 'var(--font-serif)' }}>
          How to Deliver a 5-Minute Lab Presentation (10/10 Score Strategy)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
          <div className="p-3 bg-[#F8F6F0] border border-[#D9D2C3]">
            <strong className="text-[#244C3A] block mb-1">Minute 1: Problem & Ingestion</strong>
            Open Overview page. Point out 395 records, 0 nulls, and bimodal G3 distribution. State why G3 &lt; 10 is the risk threshold.
          </div>

          <div className="p-3 bg-[#F8F6F0] border border-[#D9D2C3]">
            <strong className="text-[#244C3A] block mb-1">Minute 2: Dual Formulation</strong>
            Switch to Performance tab for regression ($R^2 \approx 0.72$). Toggle Early-Warning mode. Then open Risk Analysis and explain why Recall is paramount.
          </div>

          <div className="p-3 bg-[#F8F6F0] border border-[#D9D2C3]">
            <strong className="text-[#244C3A] block mb-1">Minute 3: Clustering</strong>
            Open Student Segments. Point out that G3 was strictly excluded. Show the 3 distinct behavioral cohorts on the large 2D PCA scatter plot.
          </div>

          <div className="p-3 bg-[#F8F6F0] border border-[#D9D2C3]">
            <strong className="text-[#244C3A] block mb-1">Minute 4: Ensembles & CV</strong>
            Open Model Lab. Show the Bagging scaling curve (variance reduction), 5/10-fold Stratified CV stability, and feature importances.
          </div>

          <div className="p-3 bg-[#244C3A] text-[#FFFFFF] border border-[#244C3A]">
            <strong className="text-[#C66B4E] block mb-1">Minute 5: Live Inference</strong>
            Demonstrate a live prediction in the form by adjusting inputs and showing real-time grade forecasting and tailored intervention guidance.
          </div>
        </div>
      </div>
    </div>
  );
};
