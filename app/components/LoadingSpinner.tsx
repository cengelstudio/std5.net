import { memo } from 'react';
import { LoadingSpinnerProps } from '../../types';

const LoadingSpinner = memo(({ size = 'md', className = '' }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`border-2 border-std5-accent border-t-transparent rounded-full animate-spin ${sizeClasses[size]} ${className}`} />
  );
});

LoadingSpinner.displayName = 'LoadingSpinner';

export default LoadingSpinner;
