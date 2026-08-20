import React from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'ayur';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  children,
  className = '',
  disabled = false,
  ...props
}) => {
  const variantStyles: Record<ButtonVariant, string> = {
    primary: 'bg-ayur-primary text-white hover:bg-[#0c4434] border border-transparent shadow-xs',
    secondary: 'bg-white text-ayur-primary border border-ayur-sand/80 hover:bg-[#fbf9f5]',
    outline: 'bg-transparent border border-ayur-green-mid/30 text-ayur-primary hover:bg-[#f4f7f4]',
    ghost: 'bg-transparent text-ayur-green-mid hover:text-ayur-primary hover:bg-[#f4f7f4]',
    ayur: 'bg-ayur-brown text-white hover:bg-[#9e5c3b] border border-transparent shadow-xs',
  };

  const sizeStyles: Record<ButtonSize, string> = {
    sm: 'px-3 py-1.5 text-xs font-semibold rounded-lg gap-1.5',
    md: 'px-4 py-2 text-sm font-semibold rounded-xl gap-2',
    lg: 'px-6 py-2.5 text-base font-semibold rounded-xl gap-2.5',
  };

  return (
    <button
      disabled={disabled}
      className={`inline-flex items-center justify-center transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};
