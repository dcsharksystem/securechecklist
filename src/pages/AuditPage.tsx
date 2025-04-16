
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Client, Control, Audit, ComplianceStatus } from '@/types';
import { mockControls } from '@/data/mockData';
import AuditHeader from '@/components/AuditHeader';
import AuditSummary from '@/components/AuditSummary';
import ControlItem from '@/components/ControlItem';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

const AuditPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [client, setClient] = useState<Client | null>(null);
  const [controls, setControls] = useState<Control[]>([]);
  const [audit, setAudit] = useState<Audit | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    // Load client data from localStorage
    const clientData = localStorage.getItem('securityAuditClient');
    if (!clientData) {
      // Redirect to client setup if no client data is found
      navigate('/');
      return;
    }
    
    const parsedClient: Client = JSON.parse(clientData);
    setClient(parsedClient);
    
    // Load audit data from localStorage or create a new one
    const auditData = localStorage.getItem('securityAudit');
    if (auditData) {
      const parsedAudit: Audit = JSON.parse(auditData);
      setAudit(parsedAudit);
      setControls(parsedAudit.controls);
    } else {
      // Create a new audit with mock controls
      const newAudit: Audit = {
        id: uuidv4(),
        client: parsedClient,
        controls: mockControls,
        createdAt: new Date(),
        updatedAt: new Date(),
        submitted: false
      };
      setAudit(newAudit);
      setControls(mockControls);
      
      // Save to localStorage
      localStorage.setItem('securityAudit', JSON.stringify(newAudit));
    }
  }, [navigate]);

  const handleUpdateControl = (updatedControl: Control) => {
    const updatedControls = controls.map(control => 
      control.id === updatedControl.id ? updatedControl : control
    );
    setControls(updatedControls);
    
    if (audit) {
      const updatedAudit = {
        ...audit,
        controls: updatedControls,
        updatedAt: new Date()
      };
      setAudit(updatedAudit);
    }
  };

  const handleSaveAudit = () => {
    if (audit && client) {
      const updatedAudit = {
        ...audit,
        controls,
        updatedAt: new Date()
      };
      
      // Save to localStorage (in a real app, save to MongoDB)
      localStorage.setItem('securityAudit', JSON.stringify(updatedAudit));
      
      toast({
        title: "Audit Saved",
        description: "Your audit has been saved successfully.",
      });
    }
  };

  const handleSubmitAudit = () => {
    if (audit && client) {
      const updatedAudit = {
        ...audit,
        controls,
        submitted: true,
        updatedAt: new Date()
      };
      
      setAudit(updatedAudit);
      
      // Save to localStorage (in a real app, save to MongoDB)
      localStorage.setItem('securityAudit', JSON.stringify(updatedAudit));
      
      toast({
        title: "Audit Submitted",
        description: "Your audit has been submitted successfully.",
      });
    }
  };

  const handleExportPdf = () => {
    if (!audit || !client) return;
    
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('Security Compliance Audit', 14, 22);
    
    // Add client info
    doc.setFontSize(12);
    doc.text(`Client: ${client.name}`, 14, 32);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 38);
    
    // Add summary
    doc.setFontSize(16);
    doc.text('Compliance Summary', 14, 48);
    
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
    
    // Calculate compliance percentage
    const totalApplicable = controls.length - summary.notApplicable;
    const compliancePercentage = totalApplicable === 0 
      ? 0 
      : Math.round((summary.compliant / totalApplicable) * 100);
    
    // Add summary table
    doc.setFontSize(12);
    const summaryData = [
      ['Compliant', summary.compliant],
      ['Not Compliant', summary.notCompliant],
      ['Partial Compliant', summary.partial],
      ['Not Applicable', summary.notApplicable],
      ['Overall Compliance', `${compliancePercentage}%`],
    ];
    
    (doc as any).autoTable({
      startY: 52,
      head: [['Status', 'Count']],
      body: summaryData,
      theme: 'striped',
      headStyles: { fillColor: [3, 105, 161] },
    });
    
    // Add controls table
    doc.setFontSize(16);
    doc.text('Control Details', 14, (doc as any).lastAutoTable.finalY + 10);
    
    const controlsData = controls.map(control => [
      control.category,
      control.title,
      getStatusText(control.status),
      control.comment || 'No comments',
    ]);
    
    (doc as any).autoTable({
      startY: (doc as any).lastAutoTable.finalY + 14,
      head: [['Category', 'Control', 'Status', 'Comments']],
      body: controlsData,
      theme: 'striped',
      headStyles: { fillColor: [3, 105, 161] },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 60 },
        2: { cellWidth: 30 },
        3: { cellWidth: 60 },
      },
    });
    
    // Save PDF
    doc.save(`security_audit_${client.name.replace(/\s+/g, '_')}.pdf`);
    
    toast({
      title: "PDF Exported",
      description: "Your audit has been exported as a PDF.",
    });
  };
  
  const getStatusText = (status: ComplianceStatus): string => {
    switch (status) {
      case 'compliant': return 'Compliant';
      case 'notCompliant': return 'Not Compliant';
      case 'partial': return 'Partial Compliant';
      case 'notApplicable': return 'Not Applicable';
    }
  };
  
  const filteredControls = activeTab === 'all' 
    ? controls 
    : controls.filter(control => control.status === activeTab);
  
  if (!client || !audit) {
    return <div>Loading...</div>;
  }

  // Check if any controls are not addressed
  const hasUnaddressedControls = controls.some(control => !control.status);

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="container max-w-5xl pt-6">
        <AuditHeader 
          client={client} 
          onSave={handleSaveAudit}
          onSubmit={handleSubmitAudit}
          onExportPdf={handleExportPdf}
          isSubmitted={audit.submitted}
        />
        
        {hasUnaddressedControls && !audit.submitted && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Incomplete Audit</AlertTitle>
            <AlertDescription>
              Some controls have not been reviewed. Please complete all controls before submitting.
            </AlertDescription>
          </Alert>
        )}
        
        {audit.submitted && (
          <Alert className="mb-6 bg-security-light border-security-primary">
            <ShieldCheck className="h-4 w-4 text-security-primary" />
            <AlertTitle>Audit Complete</AlertTitle>
            <AlertDescription>
              This security audit has been completed and submitted.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-3">
            <AuditSummary controls={controls} />
          </div>
        </div>
        
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Security Controls</h2>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="compliant">Compliant</TabsTrigger>
              <TabsTrigger value="notCompliant">Not Compliant</TabsTrigger>
              <TabsTrigger value="partial">Partial</TabsTrigger>
              <TabsTrigger value="notApplicable">N/A</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value={activeTab}>
            {filteredControls.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                No controls found in this category.
              </div>
            ) : (
              <>
                {filteredControls.map((control) => (
                  <ControlItem 
                    key={control.id} 
                    control={control}
                    onUpdate={handleUpdateControl}
                  />
                ))}
              </>
            )}
          </TabsContent>
        </Tabs>
        
        <div className="mt-8 flex justify-end">
          <Button 
            onClick={handleSaveAudit}
            variant="outline" 
            className="mr-2"
          >
            Save Progress
          </Button>
          
          {!audit.submitted && (
            <Button 
              onClick={handleSubmitAudit}
              className="bg-security-primary hover:bg-security-secondary"
              disabled={hasUnaddressedControls}
            >
              Submit Audit
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuditPage;
