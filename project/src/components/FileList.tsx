import React from 'react';
import { useData } from '../context/DataContext';
import { File, Delete as FileDeleted, Clock, Trash2 } from 'lucide-react';

const FileList: React.FC = () => {
  const { files, activeFileId, setActiveFile, removeFile } = useData();

  if (files.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
        Uploaded Files
      </h2>
      <div className="overflow-x-auto">
        <div className="grid grid-cols-1 gap-3 min-w-full">
          {files.map((file) => {
            const isActive = file.id === activeFileId;
            const fileDate = new Date(file.dateAdded);
            const formattedDate = fileDate.toLocaleDateString();
            const formattedTime = fileDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            return (
              <div
                key={file.id}
                className={`
                  p-3 rounded-lg border flex items-center justify-between
                  cursor-pointer transition-all duration-200
                  ${isActive 
                    ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-300 dark:border-primary-700' 
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-800'
                  }
                `}
                onClick={() => setActiveFile(file.id)}
              >
                <div className="flex items-center space-x-3">
                  {file.type === 'csv' ? (
                    <File className={`h-5 w-5 ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-gray-500'}`} />
                  ) : (
                    <FileDeleted className={`h-5 w-5 ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-gray-500'}`} />
                  )}
                  <div>
                    <p className={`font-medium truncate max-w-xs ${isActive ? 'text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'}`}>
                      {file.name}
                    </p>
                    <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>{formattedDate} at {formattedTime}</span>
                      <span className="mx-2">•</span>
                      <span>{file.data.length} rows</span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(file.id);
                  }}
                  className="p-1.5 rounded-full text-gray-400 hover:text-error-500 dark:text-gray-500 dark:hover:text-error-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Remove file"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FileList;