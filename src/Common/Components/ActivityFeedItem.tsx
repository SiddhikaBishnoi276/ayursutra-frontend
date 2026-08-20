import React from 'react';
import { Badge, BadgeVariant } from './Badge';

export interface ActivityFeedItemProps {
  severity: 'info' | 'warning' | 'critical';
  message: string;
  user: string;
  role: string;
  time: string;
  isLast?: boolean;
}

export const ActivityFeedItem: React.FC<ActivityFeedItemProps> = ({
  severity,
  message,
  user,
  role,
  time,
  isLast = false,
}) => {
  const severityBadgeVariant: Record<'info' | 'warning' | 'critical', BadgeVariant> = {
    info: 'info',
    warning: 'warning',
    critical: 'danger',
  };

  return (
    <div
      className={`py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#fbf9f5]/60 px-3 rounded-xl transition-colors duration-150 ${
        !isLast ? 'border-b border-gray-100' : ''
      }`}
    >
      <div className="flex items-start sm:items-center gap-3 min-w-0">
        <Badge
          variant={severityBadgeVariant[severity]}
          size="sm"
          className="uppercase tracking-wider shrink-0 mt-0.5 sm:mt-0 font-bold"
        >
          {severity === 'critical' ? 'ALERT' : severity}
        </Badge>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900 leading-snug">
            {message}
          </p>
          <p className="text-xs text-ayur-green-mid font-medium mt-0.5">
            By <span className="font-semibold text-gray-700">{user}</span> ({role})
          </p>
        </div>
      </div>
      <span className="text-xs text-gray-400 font-medium whitespace-nowrap self-end sm:self-center">
        {time}
      </span>
    </div>
  );
};
