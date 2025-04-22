import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import FileUploader from './components/FileUploader';
import FileList from './components/FileList';
import DataSummary from './components/DataSummary';
import ChartContainer from './components/ChartContainer';
import EmptyState from './components/EmptyState';
import About from './pages/About';
import Contact from './pages/Contact';
import { ThemeProvider } from './context/ThemeContext';
import { DataProvider, useData } from './context/DataContext';

const Dashboard: React.FC = () => {
  const { files, activeFileId } = useData();
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {files.length === 0 ? (
          <div className="max-w-3xl mx-auto">
            <EmptyState />
            <div className="mt-12">
              <FileUploader />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Data Analysis
              </h1>
              <FileUploader />
              <div className="mt-8">
                <FileList />
              </div>
            </div>
            
            <div className="lg:col-span-3">
              {activeFileId ? (
                <>
                  <DataSummary />
                  <ChartContainer />
                </>
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    Select a file to view analysis and visualizations
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
      
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6 mt-auto">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400">
          DataVizAI - Automatic Data Analysis & Visualization © {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <ThemeProvider>
        <DataProvider>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </DataProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;