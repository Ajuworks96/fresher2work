import React from 'react';
import { Button } from './Button';
import { Search } from 'lucide-react';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200 p-12 text-center flex flex-col items-center justify-center max-w-lg mx-auto shadow-xs ${className}`}
    >
      <div className="h-14 w-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 mb-4 border border-slate-200/60">
        {icon || <Search className="w-6 h-6 text-slate-400 stroke-[1.75]" />}
      </div>
      <h3 className="text-base font-bold text-slate-900 tracking-tight">{title}</h3>
      <p className="text-xs text-slate-500 mt-1.5 leading-relaxed max-w-sm">{description}</p>
      {actionLabel && onAction && (
        <Button variant="primary" size="md" onClick={onAction} className="mt-5">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
