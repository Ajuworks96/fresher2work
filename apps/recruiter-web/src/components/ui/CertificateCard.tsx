import React from 'react';
import { Card } from './Card';
import { VerificationBadge } from './Badge';

export interface CertificateCardProps {
  name: string;
  issuingOrganization: string;
  issueDate: string;
  credentialUrl?: string;
  className?: string;
}

export const CertificateCard: React.FC<CertificateCardProps> = ({
  name,
  issuingOrganization,
  issueDate,
  credentialUrl,
  className = '',
}) => {
  return (
    <Card className={`p-4 flex items-start justify-between gap-4 ${className}`}>
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h4 className="text-sm font-bold text-slate-900">{name}</h4>
          <VerificationBadge label="Verified Cert" />
        </div>
        <p className="text-xs text-slate-600 font-medium">Issued by: {issuingOrganization}</p>
        <p className="text-[11px] text-slate-400 font-mono">Issued: {issueDate}</p>
      </div>

      {credentialUrl && (
        <a
          href={credentialUrl}
          target="_blank"
          rel="noreferrer"
          className="rounded-lg bg-slate-100 hover:bg-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 whitespace-nowrap shrink-0 transition-colors"
        >
          Verify Credential ↗
        </a>
      )}
    </Card>
  );
};
