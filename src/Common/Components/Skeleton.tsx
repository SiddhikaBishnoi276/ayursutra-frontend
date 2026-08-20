import React from 'react';

export interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular' | 'card';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rectangular',
}) => {
  const variantStyles = {
    text: 'h-4 w-full rounded-md',
    rectangular: 'rounded-xl',
    circular: 'rounded-full',
    card: 'rounded-2xl h-44 w-full',
  };

  return (
    <div
      className={`animate-pulse bg-[#f1eee8] border border-ayur-sand/30 ${variantStyles[variant]} ${className}`}
    />
  );
};
