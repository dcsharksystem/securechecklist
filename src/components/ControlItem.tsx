
import { useState } from 'react';
import { Control, ComplianceStatus } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Paperclip, X } from 'lucide-react';
import StatusBadge from './StatusBadge';

interface ControlItemProps {
  control: Control;
  onUpdate: (updatedControl: Control) => void;
}

const ControlItem = ({ control, onUpdate }: ControlItemProps) => {
  const [status, setStatus] = useState<ComplianceStatus>(control.status);
  const [comment, setComment] = useState(control.comment || '');
  const [attachment, setAttachment] = useState<File | null>(null);
  const [attachmentName, setAttachmentName] = useState(control.attachmentName || '');
  const [attachmentUrl, setAttachmentUrl] = useState(control.attachmentUrl || '');

  const handleStatusChange = (value: ComplianceStatus) => {
    setStatus(value);
    onUpdate({
      ...control,
      status: value,
      updatedAt: new Date()
    });
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
    onUpdate({
      ...control,
      comment: e.target.value,
      updatedAt: new Date()
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAttachment(file);
      setAttachmentName(file.name);
      
      // Create a temporary URL for display
      const reader = new FileReader();
      reader.onload = () => {
        const url = reader.result as string;
        setAttachmentUrl(url);
        onUpdate({
          ...control,
          attachmentName: file.name,
          attachmentUrl: url,
          updatedAt: new Date()
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAttachment = () => {
    setAttachment(null);
    setAttachmentName('');
    setAttachmentUrl('');
    onUpdate({
      ...control,
      attachmentName: undefined,
      attachmentUrl: undefined,
      updatedAt: new Date()
    });
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-sm text-muted-foreground mb-1">{control.category}</div>
            <CardTitle className="text-lg">{control.title}</CardTitle>
          </div>
          {status && <StatusBadge status={status} />}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{control.description}</p>
        
        <div className="space-y-2">
          <Label>Compliance Status</Label>
          <RadioGroup 
            value={status} 
            onValueChange={(value) => handleStatusChange(value as ComplianceStatus)}
            className="grid grid-cols-2 gap-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="compliant" id={`compliant-${control.id}`} />
              <Label htmlFor={`compliant-${control.id}`} className="text-status-compliant">Compliant</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="notCompliant" id={`notCompliant-${control.id}`} />
              <Label htmlFor={`notCompliant-${control.id}`} className="text-status-notCompliant">Not Compliant</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="partial" id={`partial-${control.id}`} />
              <Label htmlFor={`partial-${control.id}`} className="text-status-partial">Partial Compliant</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="notApplicable" id={`notApplicable-${control.id}`} />
              <Label htmlFor={`notApplicable-${control.id}`} className="text-status-notApplicable">Not Applicable</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor={`comment-${control.id}`}>Comments</Label>
          <Textarea 
            id={`comment-${control.id}`}
            placeholder="Add comments or notes regarding compliance..." 
            value={comment}
            onChange={handleCommentChange}
            rows={3}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Supporting Documentation</Label>
          {attachmentName ? (
            <div className="flex items-center p-2 border rounded-md bg-muted/30">
              <Paperclip size={16} className="mr-2 text-muted-foreground" />
              <span className="text-sm flex-1 truncate">{attachmentName}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={removeAttachment} 
                className="h-8 w-8 p-0"
              >
                <X size={16} />
              </Button>
            </div>
          ) : (
            <div className="relative">
              <Input
                id={`attachment-${control.id}`}
                type="file"
                onChange={handleFileChange}
                className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
              />
              <Button
                type="button"
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
              >
                <Paperclip size={16} />
                Attach File
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ControlItem;
