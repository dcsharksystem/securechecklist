
import React, { useState } from 'react';
import { 
  Control, 
  ComplianceStatus, 
  ImplementationStatus, 
  mapComplianceToImplementation 
} from '@/types';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface AuditDetailTableProps {
  controls: Control[];
  category?: string;
  onUpdateControl: (updatedControl: Control) => void;
  readOnly?: boolean;
}

const AuditDetailTable: React.FC<AuditDetailTableProps> = ({ 
  controls, 
  category, 
  onUpdateControl,
  readOnly = false
}) => {
  const filteredControls = category 
    ? controls.filter(control => control.category === category) 
    : controls;

  // Sort controls by serial number if available
  const sortedControls = [...filteredControls].sort((a, b) => {
    if (a.serialNumber && b.serialNumber) {
      return a.serialNumber - b.serialNumber;
    }
    return 0;
  });

  const getImplementationStatus = (control: Control): ImplementationStatus => {
    return mapComplianceToImplementation(control.status);
  };

  const getStatusBackgroundColor = (status: ImplementationStatus): string => {
    switch (status) {
      case "fullyImplemented":
        return "bg-green-500 text-white";
      case "partiallyImplemented":
        return "bg-orange-500 text-white";
      case "notImplemented":
        return "bg-red-500 text-white";
      case "notApplicable":
        return "bg-gray-300 text-gray-700";
      default:
        return "";
    }
  };

  const getStatusText = (status: ImplementationStatus): string => {
    switch (status) {
      case "fullyImplemented":
        return "Fully Implemented";
      case "partiallyImplemented":
        return "Partially Implemented";
      case "notImplemented":
        return "No";
      case "notApplicable":
        return "Not Applicable";
      default:
        return "";
    }
  };

  const handleCommentChange = (control: Control, comment: string) => {
    if (!readOnly) {
      onUpdateControl({
        ...control,
        detailedComment: comment,
        updatedAt: new Date()
      });
    }
  };

  const handleStatusChange = (control: Control, status: ComplianceStatus) => {
    if (!readOnly) {
      onUpdateControl({
        ...control,
        status,
        updatedAt: new Date()
      });
    }
  };

  return (
    <div className="overflow-auto border rounded-md">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="w-16 text-center">Sr.No.</TableHead>
            <TableHead className="w-1/3">PARTICULARS</TableHead>
            <TableHead className="w-1/3 text-center">
              Control Implemented?<br />
              (Partially Implemented / Fully Implemented / No / Not Applicable)
            </TableHead>
            <TableHead className="w-1/3">Compliance/Non-Compliance details</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedControls.map((control, index) => {
            const implementationStatus = getStatusBackgroundColor(getImplementationStatus(control));
            return (
              <TableRow key={control.id} className="border-b">
                <TableCell className="text-center font-medium">
                  {control.serialNumber || index + 1}
                </TableCell>
                <TableCell className="align-top">
                  {control.title}
                </TableCell>
                <TableCell className={cn("text-center align-middle", !readOnly && "p-0")}>
                  {readOnly ? (
                    <div className={cn("py-2 px-4 mx-auto", implementationStatus)}>
                      {getStatusText(getImplementationStatus(control))}
                    </div>
                  ) : (
                    <RadioGroup
                      value={control.status}
                      onValueChange={(value) => handleStatusChange(control, value as ComplianceStatus)}
                      className="flex flex-col space-y-1 p-2"
                    >
                      <div className="flex items-center space-x-2 rounded-sm px-2 py-1 hover:bg-muted/50">
                        <RadioGroupItem value="compliant" id={`compliant-${control.id}`} />
                        <Label htmlFor={`compliant-${control.id}`} className="text-status-compliant font-medium">
                          Fully Implemented
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 rounded-sm px-2 py-1 hover:bg-muted/50">
                        <RadioGroupItem value="partial" id={`partial-${control.id}`} />
                        <Label htmlFor={`partial-${control.id}`} className="text-status-partial font-medium">
                          Partially Implemented
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 rounded-sm px-2 py-1 hover:bg-muted/50">
                        <RadioGroupItem value="notCompliant" id={`notCompliant-${control.id}`} />
                        <Label htmlFor={`notCompliant-${control.id}`} className="text-status-notCompliant font-medium">
                          No
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 rounded-sm px-2 py-1 hover:bg-muted/50">
                        <RadioGroupItem value="notApplicable" id={`notApplicable-${control.id}`} />
                        <Label htmlFor={`notApplicable-${control.id}`} className="text-status-notApplicable font-medium">
                          Not Applicable
                        </Label>
                      </div>
                    </RadioGroup>
                  )}
                </TableCell>
                <TableCell className="align-top">
                  {readOnly ? (
                    <div className="py-2 px-1">{control.detailedComment || control.comment || ""}</div>
                  ) : (
                    <Textarea
                      placeholder="Enter compliance/non-compliance details..."
                      value={control.detailedComment || control.comment || ""}
                      onChange={(e) => handleCommentChange(control, e.target.value)}
                      className="min-h-[80px] w-full"
                    />
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default AuditDetailTable;
