
import { Control } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, XCircle, AlertCircle, MinusCircle, PieChart } from 'lucide-react';

interface AuditSummaryProps {
  controls: Control[];
}

const AuditSummary = ({ controls }: AuditSummaryProps) => {
  // Count controls by status
  const summary = controls.reduce(
    (acc, control) => {
      acc[control.status]++;
      return acc;
    },
    {
      compliant: 0,
      notCompliant: 0,
      partial: 0,
      notApplicable: 0,
    }
  );

  // Calculate total applicable controls
  const totalApplicable = controls.length - summary.notApplicable;
  
  // Calculate compliance percentage (excluding not applicable)
  const compliancePercentage = totalApplicable === 0 
    ? 0 
    : Math.round((summary.compliant / totalApplicable) * 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <PieChart className="text-security-primary" size={20} />
          Audit Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <SummaryItem 
            icon={CheckCircle2}
            count={summary.compliant}
            label="Compliant"
            color="text-status-compliant"
          />
          <SummaryItem 
            icon={XCircle}
            count={summary.notCompliant}
            label="Not Compliant"
            color="text-status-notCompliant"
          />
          <SummaryItem 
            icon={AlertCircle}
            count={summary.partial}
            label="Partial"
            color="text-status-partial"
          />
          <SummaryItem 
            icon={MinusCircle}
            count={summary.notApplicable}
            label="Not Applicable"
            color="text-status-notApplicable"
          />
        </div>
        
        <div className="flex flex-col items-center">
          <div className="relative h-32 w-32">
            <svg className="h-full w-full" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="10"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke={getComplianceColor(compliancePercentage)}
                strokeWidth="10"
                strokeDasharray={`${(compliancePercentage * 2.51327)}px 251.327px`}
                strokeDashoffset="0"
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold">
                {compliancePercentage}%
              </span>
              <span className="text-xs text-muted-foreground">Compliance</span>
            </div>
          </div>
          <p className="mt-4 text-sm text-center text-muted-foreground">
            Based on {totalApplicable} applicable controls
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

interface SummaryItemProps {
  icon: React.ElementType;
  count: number;
  label: string;
  color: string;
}

const SummaryItem = ({ icon: Icon, count, label, color }: SummaryItemProps) => (
  <div className="flex flex-col items-center">
    <Icon className={color} size={24} />
    <div className="text-xl font-bold mt-1">{count}</div>
    <div className="text-xs text-muted-foreground">{label}</div>
  </div>
);

const getComplianceColor = (percentage: number): string => {
  if (percentage >= 90) return '#10B981'; // Green
  if (percentage >= 70) return '#F59E0B'; // Amber
  return '#EF4444'; // Red
};

export default AuditSummary;
