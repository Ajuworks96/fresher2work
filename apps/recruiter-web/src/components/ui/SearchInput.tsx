import React from 'react';

export interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
  shortcutKey?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  onClear,
  shortcutKey = '⌘K',
  placeholder = 'Search skills, projects, candidates...',
  className = '',
  ...props
}) => {
  return (
    <div className={`relative flex items-center w-full ${className}`}>
      <span className="absolute left-3.5 text-slate-400">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </span>

      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-20 py-2.5 text-sm text-slate-900 placeholder-slate-400 shadow-xs transition-all focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
        {...props}
      />

      <div className="absolute right-3 flex items-center gap-1.5">
        {value && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 text-xs font-bold"
          >
            ✕
          </button>
        )}
        {shortcutKey && (
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono font-semibold text-slate-400 bg-slate-100 border border-slate-200 rounded">
            {shortcutKey}
          </kbd>
        )}
      </div>
    </div>
  );
};
