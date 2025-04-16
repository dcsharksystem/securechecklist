
import React from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Layout, Table as TableIcon } from 'lucide-react';

interface AuditViewToggleProps {
  activeTab: string;
  setActiveTab: (value: string) => void;
  viewMode: 'cards' | 'table';
  setViewMode: (mode: 'cards' | 'table') => void;
}

const AuditViewToggle: React.FC<AuditViewToggleProps> = ({ 
  activeTab, 
  setActiveTab, 
  viewMode, 
  setViewMode 
}) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-bold">Security Controls</h2>
      <div className="flex gap-2">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mr-4">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="compliant">Compliant</TabsTrigger>
            <TabsTrigger value="notCompliant">Not Compliant</TabsTrigger>
            <TabsTrigger value="partial">Partial</TabsTrigger>
            <TabsTrigger value="notApplicable">N/A</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex border rounded-md overflow-hidden">
          <Button 
            variant={viewMode === 'cards' ? 'default' : 'outline'} 
            size="sm"
            className="rounded-none border-0"
            onClick={() => setViewMode('cards')}
          >
            <Layout size={16} className="mr-1" />
            Cards
          </Button>
          <Button 
            variant={viewMode === 'table' ? 'default' : 'outline'}
            size="sm"
            className="rounded-none border-0"
            onClick={() => setViewMode('table')}
          >
            <TableIcon size={16} className="mr-1" />
            Table
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AuditViewToggle;
