import { AlertCircle, ArrowRight, TrendingUp } from "lucide-react";
import React from "react";
import { Badge, BadgeVariant } from "./Badge";
import { Card } from "./Card";

export interface StatCardProps {
  label: string;
  value: string | number;
  context: string;
  trend?: {
    text: string;
    variant?: BadgeVariant;
    icon?: React.ReactNode;
  };
  alertPill?: {
    text: string;
    linkLabel?: string;
    onViewDetails?: () => void;
  };
  onClick?: () => void;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  context,
  trend,
  alertPill,
  onClick,
  className = "",
}) => {
  return (
    <Card
      onClick={onClick}
      hoverable={!!onClick}
      className={`flex flex-col h-full justify-between ${className}`}
    >
      <div className="flex flex-col flex-1">
        {/* Row 1: Label + Trend Badge (fixed min-height, never truncates label, badge stays compact) */}
        <div className="flex items-start justify-between gap-2 mb-1 min-h-[2.5rem]">
          <span className="text-xs font-bold uppercase text-ayur-green-mid tracking-wider flex-1 min-w-0 leading-tight">
            {label}
          </span>
          {trend && (
            <Badge
              variant={trend.variant || "success"}
              size="sm"
              icon={trend.icon || <TrendingUp className="w-3 h-3" />}
              className="shrink-0 whitespace-nowrap"
            >
              {trend.text}
            </Badge>
          )}
        </div>

        {/* Row 2: Big Value (responsive typography & aligned baseline across cards) */}
        <div className="text-2xl sm:text-3xl font-bold text-gray-900 font-sans leading-tight mb-1 min-h-[2rem] sm:min-h-[2.25rem] flex items-end">
          {value}
        </div>

        {/* Row 3: Divider + Context line (always identical structure, pinned via mt-auto) */}
        <div className="mt-auto pt-2.5 border-t border-gray-100">
          <p className="text-xs text-gray-500 font-medium leading-relaxed">
            {context}
          </p>
        </div>
      </div>

      {/* Row 4: Optional Alert Pill (strictly appended AFTER Row 3, never reordering or replacing it) */}
      {alertPill && (
        <div className="mt-2.5">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              alertPill.onViewDetails?.();
            }}
            className="w-full text-left bg-[#fbeeed] border border-[#f4cbc6] text-[#a13c32] hover:bg-[#f9e5e3] transition-colors text-xs font-medium rounded-xl px-3 py-2 flex items-center justify-between gap-2 cursor-pointer shadow-2xs"
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 text-[#a13c32]" />
              <span className="truncate">{alertPill.text}</span>
            </div>
            <span className="shrink-0 font-bold text-ayur-brown flex items-center gap-1">
              {alertPill.linkLabel || "View Details"}
              <ArrowRight className="w-3 h-3" />
            </span>
          </button>
        </div>
      )}
    </Card>
  );
};