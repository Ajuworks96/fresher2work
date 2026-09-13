import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevated?: boolean;
  interactive?: boolean;
  highlighted?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  elevated = false,
  interactive = false,
  highlighted = false,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`bg-white rounded-xl border transition-all ${
        highlighted
          ? 'border-emerald-300 ring-2 ring-emerald-50 shadow-sm'
          : 'border-slate-200/90'
      } ${
        elevated ? 'shadow-md' : 'shadow-xs'
      } ${
        interactive
          ? 'hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer active:translate-y-0'
          : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => <div className={`p-5 pb-3 ${className}`} {...props}>{children}</div>;

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <h3 className={`text-base font-bold text-slate-900 tracking-tight ${className}`} {...props}>
    {children}
  </h3>
);

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <p className={`text-xs text-slate-500 mt-1 leading-relaxed ${className}`} {...props}>
    {children}
  </p>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => <div className={`p-5 pt-0 ${className}`} {...props}>{children}</div>;

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => (
  <div className={`p-4 pt-3 border-t border-slate-100 bg-slate-50/50 rounded-b-xl flex items-center justify-between ${className}`} {...props}>
    {children}
  </div>
);
