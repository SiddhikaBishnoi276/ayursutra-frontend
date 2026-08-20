import React from 'react';
import { Card } from './Card';
import { ArrowRight, LucideIcon } from 'lucide-react';

export interface ActionCardProps {
  icon: LucideIcon | React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  footerStat: string;
  actionLabel?: string;
  onClick: () => void;
  className?: string;
}

export const ActionCard: React.FC<ActionCardProps> = ({
  icon: Icon,
  title,
  description,
  footerStat,
  actionLabel = 'Manage',
  onClick,
  className = '',
}) => {
  return (
    <Card
      onClick={onClick}
      hoverable
      className={`flex flex-col justify-between group transition-all duration-200 ${className}`}
    >
      <div className="flex flex-col">
        {/* Uniform Icon Box */}
        <div className="w-10 h-10 rounded-lg bg-ayur-green-light/30 text-ayur-primary flex items-center justify-center mb-3 shrink-0">
          <Icon className="w-5 h-5" />
        </div>

        <div>
          <h4 className="text-base font-bold text-gray-900 group-hover:text-ayur-primary transition-colors font-serif">
            {title}
          </h4>
          <p className="text-xs text-gray-500 font-medium leading-relaxed mt-1">
            {description}
          </p>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
        <span className="font-bold text-gray-900 tracking-tight">
          {footerStat}
        </span>
        <span className="inline-flex items-center gap-1 font-bold text-ayur-primary group-hover:translate-x-1 transition-transform">
          {actionLabel}
          <ArrowRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </Card>
  );
};
