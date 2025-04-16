
import React from 'react';
import { Control } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AuditDetailTable from './AuditDetailTable';

interface AuditTableViewProps {
  controls: Control[];
  onUpdateControl: (updatedControl: Control) => void;
  readOnly?: boolean;
}

const AuditTableView: React.FC<AuditTableViewProps> = ({ 
  controls, 
  onUpdateControl,
  readOnly = false 
}) => {
  // Get unique categories
  const categories = [...new Set(controls.map(control => control.category))];

  return (
    <div className="space-y-6">
      {categories.map(category => (
        <Card key={category} className="overflow-hidden">
          <CardHeader className="bg-security-primary text-white py-3">
            <CardTitle className="text-lg font-bold">{category}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <AuditDetailTable 
              controls={controls} 
              category={category} 
              onUpdateControl={onUpdateControl}
              readOnly={readOnly}
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AuditTableView;
