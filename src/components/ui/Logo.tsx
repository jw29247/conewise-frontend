import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'md', showText = true }) => {
  const sizes = {
    sm: { icon: 'h-6 w-6', text: 'text-lg' },
    md: { icon: 'h-8 w-8', text: 'text-2xl' },
    lg: { icon: 'h-10 w-10', text: 'text-3xl' },
  };
  
  return (
    <Link to="/" className={`flex items-center gap-3 ${className} hover:opacity-80 transition-opacity`}>
      <div className={`${sizes[size].icon} relative flex-shrink-0`}>
        {/* Minimalist cone icon */}
        <div className="w-full h-full flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 32 32" fill="none">
            <path 
              d="M16 4L4 28H28L16 4Z" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinejoin="round"
              className="fill-current opacity-10"
            />
            <circle cx="16" cy="20" r="2" className="fill-current" />
          </svg>
        </div>
      </div>
      {showText && (
        <span className={`font-light ${sizes[size].text} tracking-tight`}>Conewise</span>
      )}
    </Link>
  );
};

export default Logo;