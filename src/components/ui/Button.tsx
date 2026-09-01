import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'md' | 'lg';
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
}

const baseClasses =
  'inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-all duration-200 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none';

const variantClasses: Record<string, string> = {
  primary: 'bg-lime-400 text-zinc-950 hover:bg-lime-300 shadow-lg shadow-lime-400/20 hover:shadow-lime-400/30',
  secondary: 'bg-transparent text-zinc-100 border border-zinc-700 hover:border-lime-400/60 hover:text-lime-300',
  ghost: 'bg-zinc-900/60 text-zinc-300 hover:bg-zinc-800 hover:text-white',
};

const sizeClasses: Record<string, string> = {
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
};

export function Button({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'right',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`} {...props}>
      {icon && iconPosition === 'left' && icon}
      {children}
      {icon && iconPosition === 'right' && icon}
    </button>
  );
}
