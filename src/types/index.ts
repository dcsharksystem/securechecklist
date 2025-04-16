
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

// Extended implementation status for more descriptive table display
export type ImplementationStatus = 
  | "fullyImplemented" 
  | "partiallyImplemented" 
  | "notImplemented" 
  | "notApplicable";

// Convert between ComplianceStatus and ImplementationStatus
export const mapComplianceToImplementation = (status: ComplianceStatus): ImplementationStatus => {
  switch (status) {
    case "compliant": return "fullyImplemented";
    case "notCompliant": return "notImplemented";
    case "partial": return "partiallyImplemented";
    case "notApplicable": return "notApplicable";
  }
};

export const mapImplementationToCompliance = (status: ImplementationStatus): ComplianceStatus => {
  switch (status) {
    case "fullyImplemented": return "compliant";
    case "notImplemented": return "notCompliant";
    case "partiallyImplemented": return "partial";
    case "notApplicable": return "notApplicable";
  }
};

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
  serialNumber?: number; // Serial number for the control in the list
  detailedComment?: string; // Detailed compliance/non-compliance details
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
