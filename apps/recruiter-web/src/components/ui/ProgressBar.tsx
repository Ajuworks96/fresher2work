import React from 'react';

export interface ProgressBarProps {
  value: number; // 0 to 100
  size?: 'sm' | 'md' | 'lg';
  variant?: 'brand' | 'accent' | 'warning' | 'error';
  animated?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  size = 'md',
  variant = 'brand',
  animated = false,
  className = '',
}) => {
  const clamped = Math.min(100, Math.max(0, value));

  const heightMap = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const colorMap = {
    brand: 'bg-emerald-500',
    accent: 'bg-indigo-500',
    warning: 'bg-amber-500',
    error: 'bg-red-500',
  };

  return (
    <div
      className={`w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/60 ${heightMap[size]} ${className}`}
    >
      <div
        className={`h-full rounded-full transition-all duration-500 ${colorMap[variant]} ${
          animated ? 'animate-pulse' : ''
        }`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
};

export interface CompletenessMeterProps {
  score: number;
  missingSteps?: string[];
  onActionClick?: (step: string) => void;
}

export const CompletenessMeter: React.FC<CompletenessMeterProps> = ({
  score,
  missingSteps = [],
  onActionClick,
}) => {
  const isHigh = score >= 70;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Profile Strength
          </span>
          <h4 className="text-base font-extrabold text-slate-900 mt-0.5">
            {score === 100
              ? 'Complete & High Impact'
              : isHigh
              ? 'Activation Ready (≥70%)'
              : 'Needs Details Before Activation'}
          </h4>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-black text-emerald-600">{score}</span>
          <span className="text-xs font-bold text-slate-400">/ 100%</span>
        </div>
      </div>

      <ProgressBar value={score} size="md" variant={isHigh ? 'brand' : 'warning'} />

      {missingSteps.length > 0 ? (
        <div className="pt-3 border-t border-slate-100 space-y-2">
          <p className="text-xs font-semibold text-slate-700">Next Recommended Actions:</p>
          <div className="space-y-1.5">
            {missingSteps.slice(0, 3).map((step, idx) => (
              <div
                key={idx}
                onClick={() => onActionClick?.(step)}
                className="flex items-center justify-between p-2 rounded-lg bg-slate-50 hover:bg-slate-100 cursor-pointer text-xs transition-colors"
              >
                <span className="text-slate-700 font-medium flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  {step}
                </span>
                <span className="text-emerald-700 font-bold hover:underline">Add +</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-xs text-emerald-700 font-bold bg-emerald-50 p-2 rounded-lg text-center">
          ✓ All profile sections complete! You have maximum visibility.
        </p>
      )}
    </div>
  );
};
