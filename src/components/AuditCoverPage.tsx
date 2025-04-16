
import React from 'react';
import { format } from 'date-fns';
import { Audit } from '@/types';

interface AuditCoverPageProps {
  audit: Audit;
}

const AuditCoverPage = ({ audit }: AuditCoverPageProps) => {
  const { client, title, financialYear, auditDate, companyInfo, confidential, disclaimer } = audit;
  const formattedDate = auditDate ? format(new Date(auditDate), 'dd MMMM yyyy') : format(new Date(), 'dd MMMM yyyy');

  return (
    <div className="flex flex-col min-h-[842px] w-[595px] p-10 mx-auto bg-white text-security-dark border border-gray-200 shadow-sm">
      {/* Title Section */}
      <div className="mt-20 mb-6 text-center">
        <h1 className="text-2xl font-bold text-[#00468b]">
          {title || "Information System & Electronic Data Processing"}
        </h1>
        <h2 className="text-xl font-bold mt-2 text-[#00468b]">
          Audit Financial Year {financialYear || "2024-2025"}
        </h2>
      </div>

      {/* Client Section */}
      <div className="mt-4 mb-10 text-center">
        <h2 className="text-xl font-bold text-[#00468b]">{client.name}</h2>
        {client.logoUrl && (
          <div className="flex justify-center mt-4">
            <img 
              src={client.logoUrl} 
              alt={`${client.name} logo`} 
              className="max-w-[150px] max-h-[150px] object-contain"
            />
          </div>
        )}
      </div>

      {/* Date */}
      <div className="mt-20 mb-6">
        <p className="font-semibold">{formattedDate}</p>
      </div>

      {/* Client and Auditor Address */}
      <div className="mt-auto flex justify-between">
        <div className="max-w-[45%]">
          <h3 className="font-bold">{client.name}</h3>
          <p className="text-sm whitespace-pre-line">
            {client.address || ""}
            {client.address && client.city && <br />}
            {client.city || ""}{client.zipCode ? `, ${client.zipCode}` : ""}
          </p>
        </div>
        
        <div className="max-w-[45%] text-right">
          <h3 className="font-bold">{companyInfo?.name || "Shark Cyber System"}</h3>
          <p className="text-sm whitespace-pre-line">
            {companyInfo?.address || (
              "518, I square Corporate Park,\nNear CIMS Hospital, Science\nCity Road, Ahmedabad -\n380060 (Gujarat)"
            )}
          </p>
        </div>
      </div>

      {/* Confidentiality & Disclaimer */}
      <div className="mt-10 border-t pt-4 text-xs">
        {confidential !== false && (
          <div className="mb-2">
            <p className="font-bold uppercase">CONFIDENTIAL DOCUMENT:</p>
            <p>Not to be circulated or reproduced without appropriate authorization</p>
          </div>
        )}
        
        {(disclaimer || true) && (
          <div className="mt-2">
            <p className="font-bold uppercase">DISCLAIMER:</p>
            <p>Only Shark Cyber System's logo is our property, and all other logos are property of individual owners</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditCoverPage;
