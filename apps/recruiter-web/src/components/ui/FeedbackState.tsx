import React from 'react';

export interface AlertBannerProps {
  type: 'success' | 'warning' | 'error' | 'info';
  title?: string;
  message: string;
  onDismiss?: () => void;
  className?: string;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({
  type,
  title,
  message,
  onDismiss,
  className = '',
}) => {
  const styles = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    warning: 'bg-amber-50 border-amber-200 text-amber-900',
    error: 'bg-red-50 border-red-200 text-red-900',
    info: 'bg-blue-50 border-blue-200 text-blue-900',
  };

  const icons = {
    success: '✓',
    warning: '⚠️',
    error: '✕',
    info: 'ℹ️',
  };

  return (
    <div
      className={`p-4 rounded-xl border flex items-start justify-between gap-3 text-xs leading-relaxed ${styles[type]} ${className}`}
    >
      <div className="flex items-start gap-2.5">
        <span className="text-sm font-bold shrink-0">{icons[type]}</span>
        <div>
          {title && <p className="font-bold text-slate-900 text-xs mb-0.5">{title}</p>}
          <p>{message}</p>
        </div>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-slate-400 hover:text-slate-700 font-bold ml-2"
        >
          ✕
        </button>
      )}
    </div>
  );
};
