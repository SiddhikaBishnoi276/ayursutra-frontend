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
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#062c21]/40 backdrop-blur-xs transition-opacity duration-200"
      />

      {/* Modal Card */}
      <div
        role="dialog"
        aria-modal="true"
        className={`relative w-full ${maxWidthStyles[maxWidth]} bg-white rounded-2xl border border-ayur-sand/60 shadow-2xl p-6 sm:p-7 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200`}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-bold text-gray-900 font-serif">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs text-ayur-green-mid font-medium mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-gray-400 hover:text-gray-700 hover:bg-[#fbf9f5] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="py-4 max-h-[75vh] overflow-y-auto">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
