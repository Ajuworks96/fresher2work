import React from 'react';
import { Card } from './Card';
import { Badge } from './Badge';
import { Globe, Code2, ExternalLink } from 'lucide-react';

export interface ProjectCardProps {
  title: string;
  description: string;
  techStack: string[];
  liveDemoUrl?: string;
  githubRepoUrl?: string;
  mediaUrls?: string[];
  onDelete?: () => void;
  className?: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  techStack = [],
  liveDemoUrl,
  githubRepoUrl,
  mediaUrls = [],
  onDelete,
  className = '',
}) => {
  return (
    <Card className={`overflow-hidden ${className}`}>
      {mediaUrls.length > 0 && (
        <div className="h-44 w-full bg-slate-100 overflow-hidden relative border-b border-slate-100">
          <img
            src={mediaUrls[0]}
            alt={title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}

      <div className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-base font-bold text-slate-900 leading-snug">{title}</h4>
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="text-xs text-red-500 hover:text-red-700 font-semibold p-1"
            >
              Delete
            </button>
          )}
        </div>

        <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{description}</p>

        {/* Tech Stack Tags */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {techStack.map((tech, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-semibold border border-slate-200/80"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Action Links */}
        {(liveDemoUrl || githubRepoUrl) && (
          <div className="pt-3 border-t border-slate-100 flex items-center gap-4 text-xs font-bold">
            {liveDemoUrl && (
              <a
                href={liveDemoUrl}
                target="_blank"
                rel="noreferrer"
                className="text-emerald-600 hover:text-emerald-700 hover:underline flex items-center gap-1.5"
              >
                <Globe className="w-3.5 h-3.5 stroke-[1.75]" />
                Live Demo
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
            )}
            {githubRepoUrl && (
              <a
                href={githubRepoUrl}
                target="_blank"
                rel="noreferrer"
                className="text-slate-700 hover:text-slate-900 hover:underline flex items-center gap-1.5"
              >
                <Code2 className="w-3.5 h-3.5 stroke-[1.75]" />
                View GitHub Code
                <ExternalLink className="w-3 h-3 opacity-60" />
              </a>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};
