import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from 'chart.js';
import { Bar, Line, Pie, Doughnut, Radar, PolarArea, Scatter } from 'react-chartjs-2';
import { useData } from '../context/DataContext';
import { suggestCharts, prepareChartData } from '../utils/dataAnalysis';
import { ChartConfig } from '../types';
import DataTable from './DataTable';
import Histogram from './Histogram';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
);

const ChartContainer: React.FC = () => {
  const { activeFileId, files, chartConfigs, updateChartConfigs } = useData();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!activeFileId) return;

    const activeFile = files.find(file => file.id === activeFileId);
    if (!activeFile) return;

    // If we already have chart configs for this file, don't regenerate
    if (chartConfigs[activeFileId]?.length > 0) return;

    setIsLoading(true);
    // Generate chart suggestions
    setTimeout(() => {
      try {
        const suggestions = suggestCharts(activeFile);
        updateChartConfigs(activeFileId, suggestions);
      } catch (error) {
        console.error('Error generating chart suggestions:', error);
      } finally {
        setIsLoading(false);
      }
    }, 0);
  }, [activeFileId, files, chartConfigs, updateChartConfigs]);

  if (!activeFileId) {
    return null;
  }

  const activeFile = files.find(file => file.id === activeFileId);
  if (!activeFile) return null;

  const configs = chartConfigs[activeFileId] || [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 dark:border-primary-400"></div>
      </div>
    );
  }

  if (configs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">No visualizations available for this data.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {configs.map((config) => (
        <div 
          key={config.id}
          className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow animate-fade-in"
        >
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">{config.title}</h3>
          
          <div className="h-80">
            {renderChart(config, activeFile)}
          </div>
        </div>
      ))}
    </div>
  );
};

const renderChart = (config: ChartConfig, file: any) => {
  const chartData = prepareChartData(file, config);
  
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#374151',
        },
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: {
          color: document.documentElement.classList.contains('dark') ? '#9ca3af' : '#6b7280',
        },
        grid: {
          color: document.documentElement.classList.contains('dark') ? 'rgba(75, 85, 99, 0.2)' : 'rgba(209, 213, 219, 0.2)',
        },
      },
      y: {
        ticks: {
          color: document.documentElement.classList.contains('dark') ? '#9ca3af' : '#6b7280',
        },
        grid: {
          color: document.documentElement.classList.contains('dark') ? 'rgba(75, 85, 99, 0.2)' : 'rgba(209, 213, 219, 0.2)',
        },
      },
    },
  };

  switch (config.type) {
    case 'bar':
      return <Bar data={chartData as ChartData<'bar'>} options={commonOptions} />;
    case 'line':
      return <Line data={chartData as ChartData<'line'>} options={commonOptions} />;
    case 'pie':
      return <Pie data={chartData as ChartData<'pie'>} />;
    case 'doughnut':
      return <Doughnut data={chartData as ChartData<'doughnut'>} />;
    case 'radar':
      return <Radar data={chartData as ChartData<'radar'>} options={commonOptions} />;
    case 'polarArea':
      return <PolarArea data={chartData as ChartData<'polarArea'>} />;
    case 'scatter':
      return <Scatter data={chartData as ChartData<'scatter'>} options={commonOptions} />;
    case 'histogram':
      return <Histogram data={chartData.data} label={config.xAxis || ''} />;
    case 'table':
      return <DataTable data={chartData.data || []} />;
    default:
      return <div className="flex justify-center items-center h-full text-gray-500 dark:text-gray-400">Unsupported chart type</div>;
  }
};

export default ChartContainer;