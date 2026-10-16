import React from 'react';

export type BadgeVariant = 'brand' | 'accent' | 'success' | 'warning' | 'error' | 'neutral';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'brand',
  dot = false,
  className = '',
  ...props
}) => {
  const variantStyles: Record<BadgeVariant, string> = {
    brand: 'bg-[#1f357c]/10 text-[#1f357c] border-[#3e7aa7]/30',
    accent: 'bg-[#3e7aa7]/15 text-[#1f357c] border-[#3e7aa7]/30',
    success: 'bg-[#4ad1c7]/15 text-[#1f357c] border-[#4ad1c7]/40',
    warning: 'bg-amber-50 text-amber-800 border-amber-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  const dotColors: Record<BadgeVariant, string> = {
    brand: 'bg-[#3e7aa7]',
    accent: 'bg-[#1f357c]',
    success: 'bg-[#4ad1c7]',
    warning: 'bg-amber-500',
    error: 'bg-red-500',
    neutral: 'bg-slate-400',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${dotColors[variant]}`} />}
      {children}
    </span>
  );
};

export interface FilterChipProps {
  label: string;
  count?: number;
  selected?: boolean;
  onToggle?: () => void;
}

export const FilterChip: React.FC<FilterChipProps> = ({
  label,
  count,
  selected = false,
  onToggle,
}) => {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
        selected
          ? 'bg-gradient-to-r from-[#1f357c] to-[#3e7aa7] text-white border-[#1f357c] shadow-xs'
          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
      }`}
    >
      <span>{label}</span>
      {typeof count === 'number' && (
        <span
          className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
            selected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
};

export const VerificationBadge: React.FC<{ label?: string }> = ({ label = 'Verified Candidate' }) => (
  <span className="inline-flex items-center gap-1 bg-[#1f357c]/10 text-[#1f357c] border border-[#3e7aa7]/30 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
    <svg className="w-3.5 h-3.5 text-[#4ad1c7]" fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
    {label}
  </span>
);
