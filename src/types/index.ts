
// Types for the security audit application

export interface Client {
  id: string;
  name: string;
  logoUrl: string;
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
  createdAt: Date;
  updatedAt: Date;
  submitted: boolean;
}
