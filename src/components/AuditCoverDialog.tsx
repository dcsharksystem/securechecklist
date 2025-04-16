
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AuditCoverDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  auditTitle: string;
  setAuditTitle: (title: string) => void;
  financialYear: string;
  setFinancialYear: (year: string) => void;
  auditDate: Date;
  setAuditDate: (date: Date) => void;
  onSave: () => void;
}

const AuditCoverDialog: React.FC<AuditCoverDialogProps> = ({
  open,
  onOpenChange,
  auditTitle,
  setAuditTitle,
  financialYear,
  setFinancialYear,
  auditDate,
  setAuditDate,
  onSave,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Audit Cover Page</DialogTitle>
          <DialogDescription>
            Update the information that will appear on your audit cover page.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="auditTitle" className="text-right">
              Audit Title
            </Label>
            <Input
              id="auditTitle"
              value={auditTitle}
              onChange={(e) => setAuditTitle(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="financialYear" className="text-right">
              Financial Year
            </Label>
            <Input
              id="financialYear"
              value={financialYear}
              onChange={(e) => setFinancialYear(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="auditDate" className="text-right">
              Audit Date
            </Label>
            <Input
              id="auditDate"
              type="date"
              value={auditDate.toISOString().split('T')[0]}
              onChange={(e) => setAuditDate(new Date(e.target.value))}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={onSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AuditCoverDialog;
