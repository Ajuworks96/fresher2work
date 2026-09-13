import React from 'react';

export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse bg-slate-200 rounded-md ${className}`} />
);

export const CandidateCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 shadow-xs">
    <div className="flex items-start justify-between">
      <div className="space-y-2">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-3 w-48" />
      </div>
      <Skeleton className="h-5 w-16 rounded-full" />
    </div>

    <Skeleton className="h-10 w-full" />

    <div className="flex gap-2">
      <Skeleton className="h-5 w-14" />
      <Skeleton className="h-5 w-14" />
      <Skeleton className="h-5 w-14" />
    </div>

    <div className="pt-3 border-t border-slate-100 flex gap-2">
      <Skeleton className="h-8 flex-1" />
      <Skeleton className="h-8 w-16" />
    </div>
  </div>
);
