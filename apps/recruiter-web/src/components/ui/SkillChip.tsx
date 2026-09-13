import React from 'react';
import { SkillLevel } from '@fresher2work/types';

export interface SkillChipProps {
  name: string;
  level?: SkillLevel;
  isVerified?: boolean;
  onRemove?: () => void;
  className?: string;
}

export const SkillChip: React.FC<SkillChipProps> = ({
  name,
  level = SkillLevel.BEGINNER,
  isVerified = false,
  onRemove,
  className = '',
}) => {
  const levelLabels: Record<SkillLevel, string> = {
    BEGINNER: 'Beginner',
    INTERMEDIATE: 'Intermediate',
    ADVANCED: 'Advanced',
  };

  const levelBadges: Record<SkillLevel, string> = {
    BEGINNER: 'bg-slate-100 text-slate-600',
    INTERMEDIATE: 'bg-indigo-50 text-indigo-700',
    ADVANCED: 'bg-emerald-50 text-emerald-700 font-bold',
  };

  return (
    <div
      className={`inline-flex items-center gap-2 bg-white border border-slate-200 shadow-xs px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-800 transition-all hover:border-slate-300 ${className}`}
    >
      <span className="font-bold">{name}</span>
      <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${levelBadges[level]}`}>
        {levelLabels[level]}
      </span>
      {isVerified && (
        <span title="Verified via Proof of Work" className="text-emerald-600 text-xs">
          ✓
        </span>
      )}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="text-slate-400 hover:text-red-600 font-bold ml-1"
        >
          ×
        </button>
      )}
    </div>
  );
};
