import { DataFile, StatsSummary, ChartConfig } from '../types';

// Get basic statistics for a dataset
export const getDataSummary = (file: DataFile): StatsSummary => {
  const { data, columns } = file;
  const summary: StatsSummary = {
    count: data.length,
    numeric: {},
    categorical: {},
    missingValues: {}
  };

  // Initialize missing values counter
  columns.forEach(col => {
    summary.missingValues[col] = 0;
  });

  // First pass: determine column types and count missing values
  const columnTypes: Record<string, 'numeric' | 'categorical'> = {};
  
  columns.forEach(column => {
    // Check first few non-null values to determine type
    const sampleSize = Math.min(10, data.length);
    let numericCount = 0;
    
    for (let i = 0; i < sampleSize; i++) {
      if (i >= data.length) break;
      
      const value = data[i][column];
      
      if (value === null || value === undefined || value === '') {
        summary.missingValues[column]++;
        continue;
      }
      
      if (typeof value === 'number' || !isNaN(Number(value))) {
        numericCount++;
      }
    }
    
    // If most sample values are numeric, consider it a numeric column
    columnTypes[column] = numericCount > sampleSize / 2 ? 'numeric' : 'categorical';
  });

  // Second pass: compute statistics based on column types
  columns.forEach(column => {
    const type = columnTypes[column];
    
    if (type === 'numeric') {
      const values = data
        .map(row => row[column])
        .filter(val => val !== null && val !== undefined && val !== '')
        .map(val => typeof val === 'number' ? val : Number(val));
      
      if (values.length === 0) {
        summary.numeric[column] = {
          min: 0,
          max: 0,
          mean: 0,
          median: 0,
          stdDev: 0
        };
        return;
      }
      
      // Sort for median and min/max
      values.sort((a, b) => a - b);
      
      const min = values[0];
      const max = values[values.length - 1];
      const sum = values.reduce((acc, val) => acc + val, 0);
      const mean = sum / values.length;
      
      // Calculate median
      const mid = Math.floor(values.length / 2);
      const median = values.length % 2 === 0
        ? (values[mid - 1] + values[mid]) / 2
        : values[mid];
      
      // Calculate standard deviation
      const squareDiffs = values.map(val => Math.pow(val - mean, 2));
      const avgSquareDiff = squareDiffs.reduce((acc, val) => acc + val, 0) / values.length;
      const stdDev = Math.sqrt(avgSquareDiff);
      
      summary.numeric[column] = {
        min,
        max,
        mean,
        median,
        stdDev
      };
    } else {
      // For categorical columns
      const valueCounts: Record<string, number> = {};
      
      data.forEach(row => {
        const value = row[column];
        if (value === null || value === undefined || value === '') {
          summary.missingValues[column]++;
          return;
        }
        
        const strValue = String(value);
        valueCounts[strValue] = (valueCounts[strValue] || 0) + 1;
      });
      
      const uniqueValues = Object.keys(valueCounts).length;
      
      // Get most common values (top 5)
      const mostCommon = Object.entries(valueCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([value, count]) => ({ value, count }));
      
      summary.categorical[column] = {
        uniqueValues,
        mostCommon
      };
    }
  });
  
  return summary;
};

// Suggest chart types based on data characteristics
export const suggestCharts = (file: DataFile): ChartConfig[] => {
  const { columns, data } = file;
  const suggestions: ChartConfig[] = [];
  const numericColumns: string[] = [];
  const categoricalColumns: string[] = [];
  
  // Identify column types
  columns.forEach(column => {
    let numericCount = 0;
    const sampleSize = Math.min(20, data.length);
    
    for (let i = 0; i < sampleSize; i++) {
      if (i >= data.length) break;
      
      const value = data[i][column];
      if (value === null || value === undefined || value === '') continue;
      
      if (typeof value === 'number' || !isNaN(Number(value))) {
        numericCount++;
      }
    }
    
    // If most sample values are numeric, consider it a numeric column
    if (numericCount > sampleSize / 2) {
      numericColumns.push(column);
    } else {
      categoricalColumns.push(column);
    }
  });
  
  const now = new Date();
  
  // Generate a unique ID for each chart
  const generateChartId = () => {
    return Math.random().toString(36).substring(2, 15);
  };
  
  // If we have categorical and numeric columns, suggest a bar chart
  if (categoricalColumns.length > 0 && numericColumns.length > 0) {
    // Bar chart
    suggestions.push({
      id: generateChartId(),
      type: 'bar',
      title: `${categoricalColumns[0]} by ${numericColumns[0]}`,
      xAxis: categoricalColumns[0],
      yAxis: numericColumns[0],
      dateCreated: now,
      lastModified: now
    });
    
    // Line chart if we have enough data points
    if (data.length > 5) {
      suggestions.push({
        id: generateChartId(),
        type: 'line',
        title: `${numericColumns[0]} Trend by ${categoricalColumns[0]}`,
        xAxis: categoricalColumns[0],
        yAxis: numericColumns[0],
        dateCreated: now,
        lastModified: now
      });
    }
  }
  
  // If we have at least one categorical column, suggest a pie chart
  if (categoricalColumns.length > 0) {
    suggestions.push({
      id: generateChartId(),
      type: 'pie',
      title: `Distribution of ${categoricalColumns[0]}`,
      xAxis: categoricalColumns[0],
      yAxis: numericColumns[0] || 'count',
      aggregation: numericColumns[0] 
        ? { function: 'sum', column: numericColumns[0] }
        : { function: 'count', column: categoricalColumns[0] },
      dateCreated: now,
      lastModified: now
    });
  }
  
  // If we have at least two numeric columns, suggest a scatter plot
  if (numericColumns.length >= 2) {
    suggestions.push({
      id: generateChartId(),
      type: 'scatter',
      title: `${numericColumns[0]} vs ${numericColumns[1]}`,
      xAxis: numericColumns[0],
      yAxis: numericColumns[1],
      dateCreated: now,
      lastModified: now
    });
    
    // Also suggest a histogram for the first numeric column
    suggestions.push({
      id: generateChartId(),
      type: 'histogram',
      title: `Distribution of ${numericColumns[0]}`,
      xAxis: numericColumns[0],
      dateCreated: now,
      lastModified: now
    });
  }
  
  // Always include a data table
  suggestions.push({
    id: generateChartId(),
    type: 'table',
    title: 'Data Table',
    dateCreated: now,
    lastModified: now
  });
  
  return suggestions;
};

// Prepare data for various chart types
export const prepareChartData = (file: DataFile, config: ChartConfig) => {
  const { data } = file;
  let processedData = [...data];
  
  // Apply filters if any
  if (config.filters && config.filters.length > 0) {
    processedData = processedData.filter(row => {
      return config.filters!.every(filter => {
        const value = row[filter.column];
        
        switch (filter.operation) {
          case 'equals':
            return value === filter.value;
          case 'notEquals':
            return value !== filter.value;
          case 'greaterThan':
            return Number(value) > Number(filter.value);
          case 'lessThan':
            return Number(value) < Number(filter.value);
          case 'contains':
            return String(value).toLowerCase().includes(String(filter.value).toLowerCase());
          default:
            return true;
        }
      });
    });
  }
  
  // For table type, just return filtered data
  if (config.type === 'table') {
    return {
      data: processedData.slice(0, 100), // Limit to first 100 rows
    };
  }
  
  // For histogram, just return numeric values of the specified column
  if (config.type === 'histogram' && config.xAxis) {
    const values = processedData
      .map(row => row[config.xAxis!])
      .filter(val => val !== null && val !== undefined && val !== '')
      .map(val => typeof val === 'number' ? val : Number(val))
      .filter(val => !isNaN(val));
    
    return {
      data: values,
    };
  }
  
  // For other chart types, group and aggregate data
  if (config.groupBy) {
    const groupedData: Record<string, any[]> = {};
    
    // Group data
    processedData.forEach(row => {
      const groupValue = String(row[config.groupBy!]);
      if (!groupedData[groupValue]) {
        groupedData[groupValue] = [];
      }
      groupedData[groupValue].push(row);
    });
    
    // Aggregate each group
    const aggregatedData: Record<string, number> = {};
    
    Object.entries(groupedData).forEach(([groupValue, groupRows]) => {
      if (config.aggregation) {
        const { function: aggFunc, column } = config.aggregation;
        
        switch (aggFunc) {
          case 'sum':
            aggregatedData[groupValue] = groupRows.reduce(
              (sum, row) => sum + (Number(row[column]) || 0), 0
            );
            break;
          case 'average':
            aggregatedData[groupValue] = groupRows.reduce(
              (sum, row) => sum + (Number(row[column]) || 0), 0
            ) / groupRows.length;
            break;
          case 'count':
            aggregatedData[groupValue] = groupRows.length;
            break;
          case 'min':
            aggregatedData[groupValue] = Math.min(
              ...groupRows.map(row => Number(row[column]) || 0)
            );
            break;
          case 'max':
            aggregatedData[groupValue] = Math.max(
              ...groupRows.map(row => Number(row[column]) || 0)
            );
            break;
        }
      } else {
        // Default to count if no aggregation specified
        aggregatedData[groupValue] = groupRows.length;
      }
    });
    
    // Convert to chart.js format
    const labels = Object.keys(aggregatedData);
    const values = Object.values(aggregatedData);
    
    return {
      labels,
      datasets: [{
        label: config.title,
        data: values,
        backgroundColor: getChartColors(labels.length),
        borderColor: config.type === 'line' ? getChartColors(1)[0] : undefined,
        borderWidth: 1
      }]
    };
  } 
  // Handle charts with x and y axes
  else if (config.xAxis && config.yAxis) {
    // Handle categorical x-axis with numerical y-axis (common for bar and line charts)
    const groupedData: Record<string, number[]> = {};
    
    processedData.forEach(row => {
      const xValue = String(row[config.xAxis!]);
      const yValue = Number(row[config.yAxis!]) || 0;
      
      if (!groupedData[xValue]) {
        groupedData[xValue] = [];
      }
      
      groupedData[xValue].push(yValue);
    });
    
    // Aggregate y-values for each x category
    const aggregatedData: Record<string, number> = {};
    
    Object.entries(groupedData).forEach(([xValue, yValues]) => {
      if (config.aggregation) {
        const { function: aggFunc } = config.aggregation;
        
        switch (aggFunc) {
          case 'sum':
            aggregatedData[xValue] = yValues.reduce((sum, val) => sum + val, 0);
            break;
          case 'average':
            aggregatedData[xValue] = yValues.reduce((sum, val) => sum + val, 0) / yValues.length;
            break;
          case 'count':
            aggregatedData[xValue] = yValues.length;
            break;
          case 'min':
            aggregatedData[xValue] = Math.min(...yValues);
            break;
          case 'max':
            aggregatedData[xValue] = Math.max(...yValues);
            break;
        }
      } else {
        // Default to sum for numeric y values
        aggregatedData[xValue] = yValues.reduce((sum, val) => sum + val, 0);
      }
    });
    
    // For scatter plots, no aggregation needed, just x-y pairs
    if (config.type === 'scatter') {
      const scatterData = processedData.map(row => ({
        x: Number(row[config.xAxis!]) || 0,
        y: Number(row[config.yAxis!]) || 0
      }));
      
      return {
        datasets: [{
          label: config.title,
          data: scatterData,
          backgroundColor: getChartColors(1)[0]
        }]
      };
    }
    
    // Convert to chart.js format for other chart types
    const labels = Object.keys(aggregatedData);
    const values = Object.values(aggregatedData);
    
    return {
      labels,
      datasets: [{
        label: config.yAxis,
        data: values,
        backgroundColor: getChartColors(labels.length),
        borderColor: config.type === 'line' ? getChartColors(1)[0] : undefined,
        borderWidth: 1
      }]
    };
  }
  
  // Fallback for pie charts or other types without specific axes
  else if (config.type === 'pie' || config.type === 'doughnut') {
    // Count occurrences of each unique value in the first column
    const column = file.columns[0];
    const counts: Record<string, number> = {};
    
    processedData.forEach(row => {
      const value = String(row[column]);
      counts[value] = (counts[value] || 0) + 1;
    });
    
    const labels = Object.keys(counts);
    const values = Object.values(counts);
    
    return {
      labels,
      datasets: [{
        data: values,
        backgroundColor: getChartColors(labels.length),
        borderWidth: 1
      }]
    };
  }
  
  // Default return empty data structure
  return {
    labels: [],
    datasets: [{
      label: 'No data',
      data: [],
      backgroundColor: [],
      borderWidth: 1
    }]
  };
};

// Helper function to generate chart colors
const getChartColors = (count: number): string[] => {
  const baseColors = [
    '#3B82F6', // blue
    '#8B5CF6', // purple
    '#14B8A6', // teal
    '#22C55E', // green
    '#F59E0B', // amber
    '#EF4444', // red
    '#EC4899', // pink
    '#6366F1', // indigo
    '#F97316', // orange
    '#A855F7', // purple
  ];
  
  // For few items, use the base colors
  if (count <= baseColors.length) {
    return baseColors.slice(0, count);
  }
  
  // For more items, generate variations
  const colors: string[] = [...baseColors];
  let current = baseColors.length;
  
  while (colors.length < count) {
    // Cycle through base colors with opacity variations
    const baseIndex = current % baseColors.length;
    const opacity = 0.7 - (Math.floor(current / baseColors.length) * 0.15);
    const baseColor = baseColors[baseIndex];
    
    // Create a variation by adjusting opacity
    const hex = baseColor.substring(1);
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    colors.push(`rgba(${r}, ${g}, ${b}, ${opacity})`);
    current++;
  }
  
  return colors;
};