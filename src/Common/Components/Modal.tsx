import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxWidth = 'lg',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthStyles = {
    sm: 'max-w-[95vw] sm:max-w-sm',
    md: 'max-w-[95vw] sm:max-w-md',
    lg: 'max-w-[95vw] sm:max-w-lg md:max-w-xl',
    xl: 'max-w-[95vw] sm:max-w-xl md:max-w-2xl',
    '2xl': 'max-w-[95vw] sm:max-w-2xl md:max-w-3xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#062c21]/40 backdrop-blur-xs transition-opacity duration-200"
      />

      {/* Modal Card */}
      <div
        role="dialog"
        aria-modal="true"
        className={`relative w-full ${maxWidthStyles[maxWidth]} bg-white rounded-2xl sm:rounded-3xl border border-ayur-sand/60 shadow-2xl p-4 sm:p-6 md:p-7 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]`}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-3 sm:pb-4 border-b border-gray-100 shrink-0">
          <div className="min-w-0 pr-2">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 font-serif truncate sm:whitespace-normal">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs text-ayur-green-mid font-medium mt-0.5 leading-snug">
                {subtitle}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full text-gray-400 hover:text-gray-700 hover:bg-[#fbf9f5] transition-colors cursor-pointer shrink-0 -mr-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="py-3 sm:py-4 overflow-y-auto flex-1 overscroll-contain">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="pt-3 sm:pt-4 border-t border-gray-100 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 shrink-0 [&>*]:w-full [&>*]:sm:w-auto">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
