
import { ComplianceStatus } from '@/types';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle, MinusCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: ComplianceStatus;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const config = {
    compliant: {
      label: 'Compliant',
      icon: CheckCircle,
      variant: 'outline',
      className: 'bg-status-compliant/10 text-status-compliant border-status-compliant'
    },
    notCompliant: {
      label: 'Not Compliant',
      icon: XCircle,
      variant: 'outline',
      className: 'bg-status-notCompliant/10 text-status-notCompliant border-status-notCompliant'
    },
    partial: {
      label: 'Partial Compliant',
      icon: AlertCircle,
      variant: 'outline',
      className: 'bg-status-partial/10 text-status-partial border-status-partial'
    },
    notApplicable: {
      label: 'Not Applicable',
      icon: MinusCircle,
      variant: 'outline',
      className: 'bg-status-notApplicable/10 text-status-notApplicable border-status-notApplicable'
    }
  };

  const { label, icon: Icon, className } = config[status];

  return (
    <Badge variant="outline" className={`${className} px-2 py-1 flex items-center gap-1`}>
      <Icon size={14} />
      <span>{label}</span>
    </Badge>
  );
};

export default StatusBadge;
