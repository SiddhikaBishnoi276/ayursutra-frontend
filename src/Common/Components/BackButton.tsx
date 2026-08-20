// src/Common/Components/BackButton.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export interface BackButtonProps {
  to?: string;
  onClick?: () => void;
  className?: string;
  label?: string;
}

export const BackButton: React.FC<BackButtonProps> = ({ to, onClick, className = '', label }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onClick) return onClick();
    if (to) return navigate(to);
    navigate(-1);
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className={`h-9 flex items-center justify-center rounded-full border border-stone-200 bg-white text-gray-700 hover:bg-stone-100 hover:text-ayur-primary transition shadow-2xs cursor-pointer ${
        label ? 'px-3 gap-1.5' : 'w-9'
      } ${className}`}
      aria-label="Go back"
      title="Go back"
    >
      <ChevronLeft size={20} />
      {label && <span className="text-xs font-bold font-serif">{label}</span>}
    </button>
  );
};

export default BackButton;
