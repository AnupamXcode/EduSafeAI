import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ExploreDataPage } from './pages/ExploreDataPage';
import { PredictionPage } from './pages/PredictionPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { DatasetSummary } from './types';
import { api } from './api/client';
import { AlertCircle, RefreshCw } from 'lucide-react';

export function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [course, setCourse] = useState<string>('mat');
  const [summary, setSummary] = useState<DatasetSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [apiError, setApiError] = useState<string | null>(null);

  const fetchSummary = (selectedCourse: string) => {
    setLoading(true);
    setApiError(null);
    api
      .getDatasetSummary(selectedCourse)
      .then((data) => {
        setSummary(data);
      })
      .catch((err) => {
        console.error('Failed to load dataset summary:', err);
        setApiError(
          'Unable to connect to the FastAPI machine learning backend at http://127.0.0.1:8000. Please ensure the Python backend server is running.'
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchSummary(course);
  }, [course]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F0] text-[#17243B] font-sans antialiased">
      {/* 4-Tab Header */}
      <Header
        currentTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab)}
        course={course}
        onCourseChange={(c) => setCourse(c)}
        summary={summary}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {apiError && (
          <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 pt-4">
            <div className="p-4 bg-[#FBE6D5] border border-[#F28C45] text-[#D6732E] rounded-2xl flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="shrink-0" size={20} />
                <p className="text-xs">
                  <strong>Backend Notice:</strong> {apiError}
                </p>
              </div>
              <button
                onClick={() => fetchSummary(course)}
                className="px-3.5 py-1.5 bg-[#FFFFFF] border border-[#F28C45] text-[#D6732E] rounded-xl text-xs font-bold hover:bg-[#FAF7F0] flex items-center gap-1.5 cursor-pointer shrink-0 shadow-2xs"
              >
                <RefreshCw size={12} />
                <span>Retry</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 1: Home */}
        {currentTab === 'home' && (
          <HomePage
            summary={summary}
            onNavigate={(tab) => setCurrentTab(tab)}
          />
        )}

        {/* Tab 2: Explore Data */}
        {currentTab === 'explore' && (
          <ExploreDataPage
            course={course}
            summary={summary}
          />
        )}

        {/* Tab 3: Predictions */}
        {currentTab === 'predict' && (
          <PredictionPage
            course={course}
          />
        )}

        {/* Tab 4: How It Works */}
        {currentTab === 'how-it-works' && (
          <HowItWorksPage
            course={course}
          />
        )}
      </main>

      {/* Academic Footer */}
      <Footer />
    </div>
  );
}

export default App;
