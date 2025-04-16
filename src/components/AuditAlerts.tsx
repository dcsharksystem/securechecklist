
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, ShieldCheck } from 'lucide-react';
import { Control } from '@/types';

interface AuditAlertsProps {
  controls: Control[];
  isSubmitted: boolean;
}

const AuditAlerts: React.FC<AuditAlertsProps> = ({ controls, isSubmitted }) => {
  // Check if any controls are not addressed
  const hasUnaddressedControls = controls.some(control => !control.status);

  if (!hasUnaddressedControls && !isSubmitted) {
    return null;
  }

  return (
    <>
      {hasUnaddressedControls && !isSubmitted && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Incomplete Audit</AlertTitle>
          <AlertDescription>
            Some controls have not been reviewed. Please complete all controls before submitting.
          </AlertDescription>
        </Alert>
      )}
      
      {isSubmitted && (
        <Alert className="mb-6 bg-security-light border-security-primary">
          <ShieldCheck className="h-4 w-4 text-security-primary" />
          <AlertTitle>Audit Complete</AlertTitle>
          <AlertDescription>
            This security audit has been completed and submitted.
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default AuditAlerts;
