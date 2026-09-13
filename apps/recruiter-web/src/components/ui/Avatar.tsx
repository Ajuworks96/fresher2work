import React from 'react';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps {
  src?: string;
  name: string;
  size?: AvatarSize;
  status?: 'online' | 'verified' | 'offline';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = 'md',
  status,
  className = '',
}) => {
  const sizeMap: Record<AvatarSize, { container: string; text: string; dot: string }> = {
    xs: { container: 'w-6 h-6', text: 'text-[10px]', dot: 'w-1.5 h-1.5' },
    sm: { container: 'w-8 h-8', text: 'text-xs', dot: 'w-2 h-2' },
    md: { container: 'w-10 h-10', text: 'text-sm font-bold', dot: 'w-2.5 h-2.5' },
    lg: { container: 'w-14 h-14', text: 'text-lg font-bold', dot: 'w-3 h-3' },
    xl: { container: 'w-20 h-20', text: 'text-2xl font-black', dot: 'w-4 h-4' },
  };

  const getInitials = (n: string) => {
    return n
      .split(' ')
      .map((part) => part[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className={`relative inline-block shrink-0 ${className}`}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={`${sizeMap[size].container} rounded-full object-cover border border-slate-200 shadow-xs`}
        />
      ) : (
        <div
          className={`${sizeMap[size].container} rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold border border-emerald-200 select-none shadow-xs`}
        >
          <span className={sizeMap[size].text}>{getInitials(name)}</span>
        </div>
      )}

      {status && (
        <span
          className={`absolute bottom-0 right-0 ${sizeMap[size].dot} rounded-full ring-2 ring-white ${
            status === 'online'
              ? 'bg-emerald-500'
              : status === 'verified'
              ? 'bg-indigo-500'
              : 'bg-slate-400'
          }`}
        />
      )}
    </div>
  );
};
