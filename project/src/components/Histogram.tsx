import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';

interface HistogramProps {
  data: number[];
  label: string;
  binCount?: number;
}

const Histogram: React.FC<HistogramProps> = ({ data, label, binCount = 10 }) => {
  const [histogramData, setHistogramData] = useState<any>(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Calculate bins
    const min = Math.min(...data);
    const max = Math.max(...data);
    const binWidth = (max - min) / binCount;
    
    // Initialize bins
    const bins = Array(binCount).fill(0);
    const binLabels = Array(binCount).fill('').map((_, i) => {
      const start = min + i * binWidth;
      const end = min + (i + 1) * binWidth;
      return `${start.toFixed(1)}-${end.toFixed(1)}`;
    });
    
    // Count values in each bin
    data.forEach(value => {
      // Handle edge case for the maximum value
      if (value === max) {
        bins[binCount - 1]++;
        return;
      }
      
      const binIndex = Math.floor((value - min) / binWidth);
      if (binIndex >= 0 && binIndex < binCount) {
        bins[binIndex]++;
      }
    });
    
    // Create chart data
    setHistogramData({
      labels: binLabels,
      datasets: [
        {
          label: `Distribution of ${label}`,
          data: bins,
          backgroundColor: 'rgba(59, 130, 246, 0.7)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 1,
        },
      ],
    });
  }, [data, label, binCount]);

  if (!histogramData) {
    return (
      <div className="flex justify-center items-center h-full text-gray-500 dark:text-gray-400">
        Preparing histogram...
      </div>
    );
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#374151',
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: label,
          color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#374151',
        },
        ticks: {
          color: document.documentElement.classList.contains('dark') ? '#9ca3af' : '#6b7280',
          maxRotation: 45,
          minRotation: 45,
        },
        grid: {
          color: document.documentElement.classList.contains('dark') ? 'rgba(75, 85, 99, 0.2)' : 'rgba(209, 213, 219, 0.2)',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Frequency',
          color: document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#374151',
        },
        ticks: {
          color: document.documentElement.classList.contains('dark') ? '#9ca3af' : '#6b7280',
        },
        grid: {
          color: document.documentElement.classList.contains('dark') ? 'rgba(75, 85, 99, 0.2)' : 'rgba(209, 213, 219, 0.2)',
        },
      },
    },
  };

  return <Bar data={histogramData} options={options} />;
};

export default Histogram;