interface LoadingIndicatorProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-1 h-1',
    md: 'w-1.5 h-1.5',
    lg: 'w-2 h-2',
  };
  
  const gaps = {
    sm: 'gap-0.5',
    md: 'gap-1',
    lg: 'gap-1.5',
  };
  
  return (
    <div className={`flex ${gaps[size]} ${className}`}>
      <div className={`${sizes[size]} rounded-full bg-red-400 animate-bounce`} style={{ animationDelay: '0ms' }}></div>
      <div className={`${sizes[size]} rounded-full bg-amber-400 animate-bounce`} style={{ animationDelay: '150ms' }}></div>
      <div className={`${sizes[size]} rounded-full bg-green-400 animate-bounce`} style={{ animationDelay: '300ms' }}></div>
    </div>
  );
};

export default LoadingIndicator;