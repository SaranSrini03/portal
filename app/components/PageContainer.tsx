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
    <div className={`min-h-screen bg-gradient-to-br from-zinc-50 via-blue-50 to-indigo-100 font-sans relative overflow-hidden p-4 text-black ${className}`}>
      <BackgroundElements />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
