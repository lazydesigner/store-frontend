import React from 'react';

const Loader = ({ size = 'md', fullScreen = false, message = '' }) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-10 w-10',
    lg: 'h-16 w-16'
  };

  const loader = (
    <div className="flex flex-col items-center justify-center">
      <div className={`spinner ${sizeClasses[size]}`}></div>
      {message && <p className="mt-3 text-gray-600 text-sm">{message}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
        {loader}
      </div>
    );
  }

  return loader;
};

export default Loader;