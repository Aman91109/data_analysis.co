import React from 'react';
import { BarChart2, FileUp, PieChart } from 'lucide-react';

const EmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center animate-fade-in">
      <div className="flex space-x-2 mb-6">
        <FileUp className="h-12 w-12 text-primary-500 dark:text-primary-400" />
        <BarChart2 className="h-12 w-12 text-secondary-500 dark:text-secondary-400" />
        <PieChart className="h-12 w-12 text-accent-500 dark:text-accent-400" />
      </div>
      
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-3">
        Instant Data Analysis
      </h2>
      
      <p className="text-gray-600 dark:text-gray-300 max-w-md mb-6">
        Upload your CSV or JSON file to automatically generate insightful visualizations and data summaries.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-3xl">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 flex items-center justify-center bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-full mb-3">
            <span className="font-bold">1</span>
          </div>
          <h3 className="font-medium text-gray-900 dark:text-white mb-2">Upload</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            Drag & drop your data file or use the file picker
          </p>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 flex items-center justify-center bg-secondary-100 dark:bg-secondary-900/20 text-secondary-600 dark:text-secondary-400 rounded-full mb-3">
            <span className="font-bold">2</span>
          </div>
          <h3 className="font-medium text-gray-900 dark:text-white mb-2">Analyze</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            AI automatically processes your data and identifies patterns
          </p>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 flex items-center justify-center bg-accent-100 dark:bg-accent-900/20 text-accent-600 dark:text-accent-400 rounded-full mb-3">
            <span className="font-bold">3</span>
          </div>
          <h3 className="font-medium text-gray-900 dark:text-white mb-2">Visualize</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            View interactive charts, trends, and summary statistics
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;