import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-700"></div>
      <p className="mt-4 text-primary-700 font-medium">Carregando...</p>
    </div>
  );
};

export default LoadingSpinner;