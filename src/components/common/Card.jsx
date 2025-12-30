import React from 'react';

const Card = ({ 
  children, 
  title, 
  subtitle,
  headerActions,
  footer,
  hover = false,
  className = '',
  headerClassName = '',
  bodyClassName = '',
  footerClassName = ''
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${hover ? 'card-hover' : ''} ${className}`}>
      {(title || headerActions) && (
        <div className={`px-6 py-4 border-b border-gray-200 flex items-center justify-between ${headerClassName}`}>
          <div>
            {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
            {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          </div>
          {headerActions && <div className="flex items-center space-x-2">{headerActions}</div>}
        </div>
      )}
      
      <div className={`px-6 py-4 ${bodyClassName}`}>
        {children}
      </div>
      
      {footer && (
        <div className={`px-6 py-4 bg-gray-50 border-t border-gray-200 ${footerClassName}`}>
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;