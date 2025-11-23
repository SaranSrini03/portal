import React from 'react';

export const BackgroundElements = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-200 to-transparent rounded-full blur-3xl opacity-60"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-indigo-200 to-transparent rounded-full blur-3xl opacity-60"></div>
    </div>
  );
};
