import React from 'react';

export type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'ayur';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'info',
  size = 'sm',
  className = '',
  icon,
}) => {
  const variantStyles: Record<BadgeVariant, string> = {
    success: 'bg-[#eef5ec] text-[#2d5a27] border border-[#cfe1ca]',
    warning: 'bg-[#fbf3ea] text-[#8c532b] border border-[#eecfb8]',
    danger: 'bg-[#fbeeed] text-[#a13c32] border border-[#f4cbc6]',
    info: 'bg-[#f1f5f2] text-[#3d5e4b] border border-[#d5e3da]',
    ayur: 'bg-[#f7f2e7] text-[#062c21] border border-[#e2bfa7]',
  };

  const sizeStyles: Record<BadgeSize, string> = {
    sm: 'px-2.5 py-0.5 text-[11px]',
    md: 'px-3 py-1 text-xs',
  };

  const renderIcon = () => {
    if (!icon) return null;
    if (React.isValidElement(icon)) return icon;
    if (
      typeof icon === 'function' ||
      (typeof icon === 'object' && icon !== null && ('$$typeof' in icon || 'render' in icon))
    ) {
      const IconComponent = icon as unknown as React.ComponentType<{ className?: string }>;
      return <IconComponent className="w-3.5 h-3.5" />;
    }
    return null;
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold tracking-wide ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {icon && <span className="shrink-0">{renderIcon()}</span>}
      <span>{children}</span>
    </span>
  );
};
