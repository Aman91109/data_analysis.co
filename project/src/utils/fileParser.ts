import Papa from 'papaparse';
import { DataFile } from '../types';

// Generate a unique ID
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};

// Parse CSV file
export const parseCSV = (file: File): Promise<DataFile> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          reject(new Error(`Error parsing CSV: ${results.errors[0].message}`));
          return;
        }
        
        const columns = results.meta.fields || [];
        resolve({
          id: generateId(),
          name: file.name,
          type: 'csv',
          data: results.data,
          columns,
          dateAdded: new Date(),
        });
      },
      error: (error) => {
        reject(new Error(`Error parsing CSV: ${error.message}`));
      }
    });
  });
};

// Parse JSON file
export const parseJSON = async (file: File): Promise<DataFile> => {
  try {
    const text = await file.text();
    const data = JSON.parse(text);
    
    // Handle array of objects
    if (Array.isArray(data)) {
      // Extract columns from the first item if it's an object
      const columns = data.length > 0 && typeof data[0] === 'object' 
        ? Object.keys(data[0]) 
        : [];
      
      return {
        id: generateId(),
        name: file.name,
        type: 'json',
        data,
        columns,
        dateAdded: new Date(),
      };
    } 
    // Handle single object with array property
    else if (typeof data === 'object') {
      // Find the first array property
      const arrayProp = Object.keys(data).find(key => Array.isArray(data[key]));
      
      if (arrayProp && Array.isArray(data[arrayProp])) {
        const arrayData = data[arrayProp];
        const columns = arrayData.length > 0 && typeof arrayData[0] === 'object'
          ? Object.keys(arrayData[0])
          : [];
          
        return {
          id: generateId(),
          name: file.name,
          type: 'json',
          data: arrayData,
          columns,
          dateAdded: new Date(),
        };
      }
    }
    
    throw new Error('Invalid JSON structure. Expected an array of objects or an object with an array property.');
  } catch (error) {
    throw new Error(`Error parsing JSON: ${(error as Error).message}`);
  }
};

// Determine file type and parse accordingly
export const parseFile = async (file: File): Promise<DataFile> => {
  const fileType = file.name.split('.').pop()?.toLowerCase();
  
  if (fileType === 'csv') {
    return parseCSV(file);
  } else if (fileType === 'json') {
    return parseJSON(file);
  } else {
    throw new Error('Unsupported file type. Please upload a CSV or JSON file.');
  }
};