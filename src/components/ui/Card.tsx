import type { HTMLAttributes } from 'react';
import clsx from 'clsx';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'bordered';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const Card: React.FC<CardProps> = ({ 
  className, 
  variant = 'default', 
  padding = 'md',
  children, 
  ...props 
}) => {
  const variants = {
    default: 'bg-white shadow-card',
    elevated: 'bg-white shadow-elevated',
    bordered: 'bg-white border border-gray-200',
  };
  
  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };
  
  return (
    <div
      className={clsx(
        'rounded-lg',
        variants[variant],
        paddings[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;