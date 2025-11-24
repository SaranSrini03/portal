import React, { ReactNode } from 'react';
import { BackgroundElements } from './BackgroundElements';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`min-h-screen font-sans relative overflow-hidden p-4 text-black bg-white ${className}`}>
      {/* <BackgroundElements /> */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
