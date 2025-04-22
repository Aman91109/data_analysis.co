import React from 'react';
import { FileSpreadsheet, FileJson } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">About DataVizAI</h1>
      
      <div className="prose dark:prose-invert max-w-none">
        <p className="text-lg text-gray-700 dark:text-black-300 mb-6">
          This web application is designed to simplify the initial steps of data analysis by allowing users to upload raw .csv or .json files and instantly receive visual insights. Once the data is uploaded, the application automatically processes the dataset, performs exploratory data analysis (EDA), and generates meaningful visualizations such as bar charts, histograms, pie charts, and correlation heatmaps. It also provides data previews, summary statistics, and type identification to assist users in understanding the structure of their data.
        </p>
        
        <p className="text-lg text-gray-700 dark:text-black-300 mb-12">
          This tool is especially useful for data analysts, data scientists, engineers, and students who need quick, on-the-fly analysis without writing a single line of code. Built using Flask, Pandas, and Matplotlib/Plotly, the system combines automation and interactivity to improve productivity and decision-making in data-centric tasks.
        </p>
      </div>
      
      <div className="mt-12">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Sample Files</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <a
            href="https://raw.githubusercontent.com/datasciencedojo/datasets/master/titanic.csv"
            download
            className="flex items-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <FileSpreadsheet className="h-8 w-8 text-primary-600 dark:text-primary-400 mr-4" />
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Titanic Dataset (CSV)</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Classic dataset for data analysis and machine learning
              </p>
            </div>
          </a>
          
          <a
            href="https://raw.githubusercontent.com/plotly/datasets/master/iris.json"
            download
            className="flex items-center p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <FileJson className="h-8 w-8 text-secondary-600 dark:text-secondary-400 mr-4" />
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Iris Dataset (JSON)</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Famous dataset for statistical classification
              </p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default About