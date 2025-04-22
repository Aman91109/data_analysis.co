import React, { createContext, useContext, useState } from 'react';
import { DataFile, ChartConfig } from '../types';

type DataContextType = {
  files: DataFile[];
  activeFileId: string | null;
  chartConfigs: Record<string, ChartConfig[]>;
  addFile: (file: DataFile) => void;
  setActiveFile: (id: string | null) => void;
  updateChartConfigs: (fileId: string, configs: ChartConfig[]) => void;
  removeFile: (id: string) => void;
};

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [files, setFiles] = useState<DataFile[]>([]);
  const [activeFileId, setActiveFileId] = useState<string | null>(null);
  const [chartConfigs, setChartConfigs] = useState<Record<string, ChartConfig[]>>({});

  const addFile = (file: DataFile) => {
    setFiles(prevFiles => {
      // Check if file with same name already exists
      const existingFileIndex = prevFiles.findIndex(f => f.name === file.name);
      if (existingFileIndex >= 0) {
        // Replace existing file
        const newFiles = [...prevFiles];
        newFiles[existingFileIndex] = file;
        return newFiles;
      }
      return [...prevFiles, file];
    });
    setActiveFileId(file.id);
  };

  const removeFile = (id: string) => {
    setFiles(prevFiles => prevFiles.filter(file => file.id !== id));
    if (activeFileId === id) {
      const remainingFiles = files.filter(file => file.id !== id);
      setActiveFileId(remainingFiles.length > 0 ? remainingFiles[0].id : null);
    }
    setChartConfigs(prev => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  const setActiveFile = (id: string | null) => {
    setActiveFileId(id);
  };

  const updateChartConfigs = (fileId: string, configs: ChartConfig[]) => {
    setChartConfigs(prev => ({
      ...prev,
      [fileId]: configs
    }));
  };

  return (
    <DataContext.Provider value={{
      files,
      activeFileId,
      chartConfigs,
      addFile,
      setActiveFile,
      updateChartConfigs,
      removeFile
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};