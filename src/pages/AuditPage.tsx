
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Client, Control, Audit, ComplianceStatus } from '@/types';
import { mockControls } from '@/data/mockData';
import AuditHeader from '@/components/AuditHeader';
import AuditSummary from '@/components/AuditSummary';
import ControlItem from '@/components/ControlItem';
import AuditTableView from '@/components/AuditTableView';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, ShieldCheck, Table as TableIcon, Layout } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuditCoverPage from '@/components/AuditCoverPage';

const AuditPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [client, setClient] = useState<Client | null>(null);
  const [controls, setControls] = useState<Control[]>([]);
  const [audit, setAudit] = useState<Audit | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [openCoverDialog, setOpenCoverDialog] = useState(false);
  const [auditTitle, setAuditTitle] = useState('Information System & Electronic Data Processing');
  const [financialYear, setFinancialYear] = useState('2024-2025');
  const [auditDate, setAuditDate] = useState<Date>(new Date());
  const coverPageRef = useRef<HTMLDivElement>(null);

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
      
      // Process controls to ensure they have serial numbers
      const controlsWithSerialNumbers = parsedAudit.controls.map((control, index) => ({
        ...control,
        serialNumber: control.serialNumber || index + 1
      }));
      
      setControls(controlsWithSerialNumbers);
      if (parsedAudit.title) setAuditTitle(parsedAudit.title);
      if (parsedAudit.financialYear) setFinancialYear(parsedAudit.financialYear);
      if (parsedAudit.auditDate) setAuditDate(new Date(parsedAudit.auditDate));
    } else {
      // Create a new audit with mock controls
      const controlsWithSerialNumbers = mockControls.map((control, index) => ({
        ...control,
        serialNumber: index + 1
      }));
      
      const newAudit: Audit = {
        id: uuidv4(),
        client: parsedClient,
        controls: controlsWithSerialNumbers,
        title: auditTitle,
        financialYear: financialYear,
        auditDate: new Date(),
        companyInfo: {
          name: "Shark Cyber System",
          address: "518, I square Corporate Park,\nNear CIMS Hospital, Science\nCity Road, Ahmedabad -\n380060 (Gujarat)"
        },
        confidential: true,
        disclaimer: "Only Shark Cyber System's logo is our property, and all other logos are property of individual owners",
        createdAt: new Date(),
        updatedAt: new Date(),
        submitted: false
      };
      setAudit(newAudit);
      setControls(controlsWithSerialNumbers);
      
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
        title: auditTitle,
        financialYear: financialYear,
        auditDate: auditDate,
        updatedAt: new Date()
      };
      
      setAudit(updatedAudit);
      
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
    
    // Configure PDF size for A4
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4" // A4 size
    });
    
    // Add cover page
    if (coverPageRef.current) {
      // First create cover page
      doc.setFontSize(20);
      doc.setTextColor(0, 70, 139); // #00468b color
      doc.text(auditTitle, doc.internal.pageSize.getWidth() / 2, 40, { align: 'center' });
      
      doc.setFontSize(16);
      doc.text(`Audit Financial Year ${financialYear}`, doc.internal.pageSize.getWidth() / 2, 50, { align: 'center' });
      
      doc.setFontSize(16);
      doc.setTextColor(0, 70, 139);
      doc.text(client.name, doc.internal.pageSize.getWidth() / 2, 70, { align: 'center' });
      
      // Add logo if available
      if (client.logoUrl) {
        try {
          // For actual implementation, you would need to handle logo as a data URL
          // This is a simplification - you'd need to actually render the image
          const imgData = client.logoUrl;
          doc.addImage(imgData, 'PNG', doc.internal.pageSize.getWidth() / 2 - 30, 80, 60, 60);
        } catch (e) {
          console.error("Error adding logo to PDF", e);
        }
      }
      
      // Add date
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      const formattedDate = auditDate.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
      doc.text(formattedDate, 20, 180);
      
      // Add client and company addresses
      doc.setFontSize(11);
      doc.text(client.name, 20, 210);
      if (client.address) {
        doc.text(client.address, 20, 215);
      }
      
      // Add Shark Cyber System info
      doc.setFontSize(11);
      doc.text("Shark Cyber System", doc.internal.pageSize.getWidth() - 20, 210, { align: 'right' });
      doc.text("518, I square Corporate Park,", doc.internal.pageSize.getWidth() - 20, 215, { align: 'right' });
      doc.text("Near CIMS Hospital, Science", doc.internal.pageSize.getWidth() - 20, 220, { align: 'right' });
      doc.text("City Road, Ahmedabad -", doc.internal.pageSize.getWidth() - 20, 225, { align: 'right' });
      doc.text("380060 (Gujarat)", doc.internal.pageSize.getWidth() - 20, 230, { align: 'right' });
      
      // Add confidentiality and disclaimer 
      doc.setFontSize(8);
      doc.text("CONFIDENTIAL DOCUMENT:", 20, 260);
      doc.text("Not to be circulated or reproduced without appropriate authorization", 20, 265);
      
      doc.text("DISCLAIMER:", 20, 270);
      doc.text("Only Shark Cyber System's logo is our property, and all other logos are property of individual owners", 20, 275);
    }
    
    // Add a new page for the summary
    doc.addPage();
    
    // Add title
    doc.setFontSize(20);
    doc.setTextColor(0, 0, 0);
    doc.text('Security Compliance Audit', 14, 22);
    
    // Add client info
    doc.setFontSize(12);
    doc.text(`Client: ${client.name}`, 14, 32);
    doc.text(`Date: ${auditDate.toLocaleDateString()}`, 14, 38);
    
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

  const handleCoverInfoSave = () => {
    if (audit) {
      const updatedAudit = {
        ...audit,
        title: auditTitle,
        financialYear: financialYear,
        auditDate: auditDate,
      };
      setAudit(updatedAudit);
      localStorage.setItem('securityAudit', JSON.stringify(updatedAudit));
      setOpenCoverDialog(false);
      toast({
        title: "Cover Page Updated",
        description: "Your audit cover page information has been updated.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="container max-w-6xl pt-6">
        <AuditHeader 
          client={client} 
          onSave={handleSaveAudit}
          onSubmit={handleSubmitAudit}
          onExportPdf={handleExportPdf}
          onEditCover={() => setOpenCoverDialog(true)}
          isSubmitted={audit.submitted}
        />
        
        {/* Cover Page Dialog */}
        <Dialog open={openCoverDialog} onOpenChange={setOpenCoverDialog}>
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
              <Button type="submit" onClick={handleCoverInfoSave}>Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Alerts */}
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
        
        {/* Hidden cover page for reference */}
        <div className="hidden">
          <div ref={coverPageRef}>
            <AuditCoverPage audit={audit} />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-3">
            <AuditSummary controls={controls} />
          </div>
        </div>
        
        {/* View Toggle */}
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
        
        {viewMode === 'cards' ? (
          <div>
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
          </div>
        ) : (
          <AuditTableView 
            controls={filteredControls} 
            onUpdateControl={handleUpdateControl}
            readOnly={audit.submitted}
          />
        )}
        
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
