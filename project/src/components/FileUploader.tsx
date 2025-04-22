import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileX, CheckCircle } from 'lucide-react';
import { parseFile } from '../utils/fileParser';
import { useData } from '../context/DataContext';

const FileUploader: React.FC = () => {
  const { addFile } = useData();
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    // Reset states
    setIsUploading(true);
    setError(null);
    setSuccess(null);

    try {
      if (acceptedFiles.length === 0) {
        throw new Error('No files were accepted.');
      }

      const file = acceptedFiles[0]; // Handle one file at a time
      
      // Check file type
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      if (!fileExt || !['csv', 'json'].includes(fileExt)) {
        throw new Error('Only CSV and JSON files are supported.');
      }

      // Check file size (500MB max)
      if (file.size > 500 * 1024 * 1024) {
        throw new Error('File is too large. Maximum size is 500MB.');
      }

      // Parse file
      const parsedFile = await parseFile(file);
      
      // Add file to context
      addFile(parsedFile);
      
      setSuccess(`Successfully processed ${file.name}`);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsUploading(false);
    }
  }, [addFile]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/json': ['.json']
    },
    maxFiles: 1
  });

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
          ${isDragActive 
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
            : 'border-gray-300 dark:border-gray-700 hover:border-primary-400 dark:hover:border-primary-600'
          }
          ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} disabled={isUploading} />
        
        <div className="flex flex-col items-center space-y-3">
          <Upload 
            className={`h-12 w-12 ${
              isDragActive 
                ? 'text-primary-600 dark:text-primary-400' 
                : 'text-gray-400 dark:text-gray-500'
            }`} 
          />
          
          {isUploading ? (
            <p className="text-gray-700 dark:text-gray-300 animate-pulse">Processing file...</p>
          ) : isDragActive ? (
            <p className="text-primary-700 dark:text-primary-300 font-medium">Drop the file here...</p>
          ) : (
            <>
              <p className="text-gray-700 dark:text-gray-300 font-medium">
                Drag & drop your CSV or JSON file here
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                or click to select a file
              </p>
            </>
          )}
        </div>
      </div>
      
      {error && (
        <div className="mt-3 p-3 bg-error-50 dark:bg-error-900/20 text-error-700 dark:text-error-300 rounded-lg flex items-start gap-2 animate-fade-in">
          <FileX className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm">{error}</p>
        </div>
      )}
      
      {success && (
        <div className="mt-3 p-3 bg-success-50 dark:bg-success-900/20 text-success-700 dark:text-success-300 rounded-lg flex items-start gap-2 animate-fade-in">
          <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <p className="text-sm">{success}</p>
        </div>
      )}
      
      <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 text-center">
        Supported files: CSV, JSON (up to 500MB)
      </p>
    </div>
  );
};

export default FileUploader;