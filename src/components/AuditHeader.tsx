
import { Client } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileCog, FileDown, FilePenLine, Save, FileText } from 'lucide-react';

interface AuditHeaderProps {
  client: Client;
  onSave: () => void;
  onSubmit: () => void;
  onExportPdf: () => void;
  onEditCover?: () => void;
  isSubmitted: boolean;
}

const AuditHeader = ({ client, onSave, onSubmit, onExportPdf, onEditCover, isSubmitted }: AuditHeaderProps) => {
  return (
    <Card className="mb-6">
      <CardContent className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            {client.logoUrl && (
              <div className="w-16 h-16 flex-shrink-0 bg-white rounded-md p-1 flex items-center justify-center">
                <img 
                  src={client.logoUrl} 
                  alt={`${client.name} logo`} 
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold">{client.name}</h1>
              <p className="text-muted-foreground">Security Compliance Audit</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 justify-end">
            {onEditCover && (
              <Button 
                variant="outline" 
                className="flex items-center gap-2" 
                onClick={onEditCover}
              >
                <FileText size={16} />
                Edit Cover Page
              </Button>
            )}
            
            <Button 
              variant="outline" 
              className="flex items-center gap-2" 
              onClick={onSave}
            >
              <Save size={16} />
              Save
            </Button>
            
            {isSubmitted ? (
              <Button 
                variant="outline" 
                className="flex items-center gap-2" 
                onClick={onExportPdf}
              >
                <FileDown size={16} />
                Export PDF
              </Button>
            ) : (
              <Button 
                className="flex items-center gap-2 bg-security-primary hover:bg-security-secondary" 
                onClick={onSubmit}
              >
                <FileCog size={16} />
                Submit Audit
              </Button>
            )}
            
            {isSubmitted && (
              <Button 
                variant="outline" 
                className="flex items-center gap-2" 
                onClick={() => {}}
              >
                <FilePenLine size={16} />
                Edit Audit
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuditHeader;
