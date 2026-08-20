import React from 'react';
import { Sparkles, LucideIcon } from 'lucide-react';

export interface EmptyStateProps {
  title?: string;
  message: string;
  icon?: LucideIcon | React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  message,
  icon,
  action,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-10 text-center rounded-2xl border border-dashed border-ayur-sand/80 bg-white/60 ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-[#f4f7f4] text-ayur-green-mid flex items-center justify-center mb-3">
        {icon ? (
          typeof icon === 'function' ? (
            React.createElement(icon as React.ComponentType<{ className?: string }>, { className: 'w-6 h-6' })
          ) : (
            icon
          )
        ) : (
          <Sparkles className="w-5 h-5 text-ayur-green-mid" />
        )}
      </div>
      {title && (
        <h4 className="text-sm font-bold text-gray-900 mb-1 font-serif">
          {title}
        </h4>
      )}
      <p className="text-xs text-ayur-green-mid font-medium max-w-sm">
        {message}
      </p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};
