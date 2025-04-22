import React, { useEffect, useState } from 'react';
import { useData } from '../context/DataContext';
import { getDataSummary } from '../utils/dataAnalysis';
import { StatsSummary } from '../types';
import { BarChart, PieChart, LineChart, ActivitySquare } from 'lucide-react';

const DataSummary: React.FC = () => {
  const { activeFileId, files } = useData();
  const [dataSummary, setDataSummary] = useState<StatsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!activeFileId) {
      setDataSummary(null);
      return;
    }

    const activeFile = files.find(file => file.id === activeFileId);
    if (!activeFile) {
      setDataSummary(null);
      return;
    }

    setIsLoading(true);
    // Use setTimeout to avoid blocking the UI
    setTimeout(() => {
      try {
        const summary = getDataSummary(activeFile);
        setDataSummary(summary);
      } catch (error) {
        console.error('Error generating data summary:', error);
      } finally {
        setIsLoading(false);
      }
    }, 0);
  }, [activeFileId, files]);

  if (!activeFileId || !dataSummary) {
    return null;
  }

  const activeFile = files.find(file => file.id === activeFileId);
  if (!activeFile) return null;

  const numericColumns = Object.keys(dataSummary.numeric);
  const categoricalColumns = Object.keys(dataSummary.categorical);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center">
        <ActivitySquare className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" />
        Data Summary
      </h2>

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 dark:border-primary-400"></div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Rows</span>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{dataSummary.count}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Columns</span>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{activeFile.columns.length}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Numeric Fields</span>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{numericColumns.length}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Categorical Fields</span>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{categoricalColumns.length}</p>
            </div>
          </div>

          {numericColumns.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                <BarChart className="w-4 h-4 mr-2 text-primary-600 dark:text-primary-400" />
                Numeric Columns
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Column</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Min</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Max</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Mean</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Median</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {numericColumns.map(column => {
                      const stats = dataSummary.numeric[column];
                      return (
                        <tr key={column}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{column}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{stats.min.toFixed(2)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{stats.max.toFixed(2)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{stats.mean.toFixed(2)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{stats.median.toFixed(2)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {categoricalColumns.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                <PieChart className="w-4 h-4 mr-2 text-secondary-600 dark:text-secondary-400" />
                Categorical Columns
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Column</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Unique Values</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Most Common</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {categoricalColumns.map(column => {
                      const stats = dataSummary.categorical[column];
                      return (
                        <tr key={column}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{column}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{stats.uniqueValues}</td>
                          <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                            {stats.mostCommon.slice(0, 3).map((item, index) => (
                              <div key={index} className="flex justify-between max-w-xs">
                                <span className="truncate mr-2">{String(item.value)}</span>
                                <span className="text-gray-400 dark:text-gray-500">({item.count})</span>
                              </div>
                            ))}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div>
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3 flex items-center">
              <LineChart className="w-4 h-4 mr-2 text-accent-600 dark:text-accent-400" />
              Missing Values
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Column</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Missing Count</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Missing %</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {activeFile.columns.map(column => {
                    const missingCount = dataSummary.missingValues[column] || 0;
                    const missingPercent = ((missingCount / dataSummary.count) * 100).toFixed(1);
                    return (
                      <tr key={column}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{column}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{missingCount}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{missingPercent}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataSummary;