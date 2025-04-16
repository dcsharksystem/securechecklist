
// Types for the security audit application

export interface Client {
  id: string;
  name: string;
  logoUrl: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ComplianceStatus = "compliant" | "notCompliant" | "partial" | "notApplicable";

export interface Control {
  id: string;
  category: string;
  title: string;
  description: string;
  status: ComplianceStatus;
  comment?: string;
  attachmentUrl?: string;
  attachmentName?: string;
  updatedAt: Date;
}

export interface Audit {
  id: string;
  client: Client;
  controls: Control[];
  title?: string;
  financialYear?: string;
  auditDate?: Date;
  companyInfo?: {
    name: string;
    address: string;
    logo?: string;
  };
  confidential?: boolean;
  disclaimer?: string;
  createdAt: Date;
  updatedAt: Date;
  submitted: boolean;
}
