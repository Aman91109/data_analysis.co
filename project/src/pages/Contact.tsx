import React from 'react';
import { Mail, MessageSquare, Send } from 'lucide-react';

const Contact: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Contact Us</h1>
      
      <div className="max-w-2xl mx-auto">
        <form className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-8">
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-white-300 mb-2">
             <h3> Email</h3>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white-400" />
              <input
                type="email"
                id="email"
                className="pl-10 w-full rounded-md border-white-300 dark:border-white-700 dark:bg-white-900 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200"
                placeholder="your@email.com"
              />
            </div>
          </div>
          
          <div className="mb-6">
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-white-300 mb-2">
             <h3>Message</h3>
            </label>
            <div className="relative">
              <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <textarea
                id="message"
                rows={4}
                className="pl-10 w-full rounded-md border-white-300 dark:border-white-700 dark:bg-white-900 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200"
                placeholder="How can we help?"
              ></textarea>
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full flex items-center justify-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            <Send className="h-5 w-5" />
            <span>Send Message</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact