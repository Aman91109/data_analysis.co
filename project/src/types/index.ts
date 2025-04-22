export type DataFile = {
  id: string;
  name: string;
  type: 'csv' | 'json';
  data: any[];
  columns: string[];
  dateAdded: Date;
};

export type ChartType = 
  | 'bar' 
  | 'line' 
  | 'pie' 
  | 'doughnut' 
  | 'radar' 
  | 'polarArea' 
  | 'scatter' 
  | 'bubble' 
  | 'histogram'
  | 'table';

export type ChartConfig = {
  id: string;
  type: ChartType;
  title: string;
  xAxis?: string;
  yAxis?: string;
  filters?: {
    column: string;
    operation: 'equals' | 'notEquals' | 'greaterThan' | 'lessThan' | 'contains';
    value: string | number;
  }[];
  aggregation?: {
    function: 'sum' | 'average' | 'count' | 'min' | 'max';
    column: string;
  };
  groupBy?: string;
  color?: string;
  dateCreated: Date;
  lastModified: Date;
};

export type StatsSummary = {
  count: number;
  numeric: Record<string, {
    min: number;
    max: number;
    mean: number;
    median: number;
    stdDev: number;
  }>;
  categorical: Record<string, {
    uniqueValues: number;
    mostCommon: {
      value: string;
      count: number;
    }[];
  }>;
  missingValues: Record<string, number>;
};