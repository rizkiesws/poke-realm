import React from 'react';

const SkeletonCard = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center animate-pulse transition-colors duration-300">
      {/* Image Section */}
      <div className="bg-gray-200 dark:bg-gray-700 rounded-xl w-full h-32 mb-4 transition-colors"></div>
      
      {/* Small ID Section */}
      <div className="self-start bg-gray-200 dark:bg-gray-700 h-3 w-8 rounded mb-2 transition-colors"></div>
      
      {/* Name Section */}
      <div className="bg-gray-200 dark:bg-gray-700 h-6 w-24 rounded transition-colors"></div>
    </div>
  );
};

export default SkeletonCard;