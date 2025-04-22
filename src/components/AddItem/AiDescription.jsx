'use client'
import { useState } from 'react';

const AiDescription = () => {
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAIGenerate = async () => {
    setLoading(true);
    // Mock AI generation
    setTimeout(() => {
      setDescription('This is an AI-generated description of your product. Edit as needed.');
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="border p-4 rounded-lg shadow-sm bg-white space-y-4 ">
      <div>
        <h2 className="text-xl font-semibold text-gray-800">Description</h2>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Write a detailed description of your item..."
          className="w-full mt-2 p-3 border rounded-md text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none h-32"
        />
      </div>
      <div>
        <button
          onClick={handleAIGenerate}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md transition"
        >
          {loading ? 'Generating...' : 'Use AI Description'}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default AiDescription;
