import React from 'react';

interface FieldGroupProps {
  children: React.ReactNode;
  className?: string;
}

export const FieldGroup: React.FC<FieldGroupProps> = ({ children, className = '' }) => {
  return (
    <div className={`space-y-6 ${className}`}>
      {children}
    </div>
  );
};
