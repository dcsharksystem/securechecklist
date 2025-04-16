
import React from 'react';
import { Button } from '@/components/ui/button';

interface AuditActionButtonsProps {
  onSave: () => void;
  onSubmit: () => void;
  isSubmitted: boolean;
  hasUnaddressedControls: boolean;
}

const AuditActionButtons: React.FC<AuditActionButtonsProps> = ({ 
  onSave, 
  onSubmit, 
  isSubmitted, 
  hasUnaddressedControls 
}) => {
  return (
    <div className="mt-8 flex justify-end">
      <Button 
        onClick={onSave}
        variant="outline" 
        className="mr-2"
      >
        Save Progress
      </Button>
      
      {!isSubmitted && (
        <Button 
          onClick={onSubmit}
          className="bg-security-primary hover:bg-security-secondary"
          disabled={hasUnaddressedControls}
        >
          Submit Audit
        </Button>
      )}
    </div>
  );
};

export default AuditActionButtons;
