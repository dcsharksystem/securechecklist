
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Client, Control, Audit } from '@/types';
import { mockControls } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import { exportAuditToPdf } from '@/utils/pdfExporter';

export const useAudit = () => {
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
    if (audit && client) {
      exportAuditToPdf(audit, client);
      
      toast({
        title: "PDF Exported",
        description: "Your audit has been exported as a PDF.",
      });
    }
  };

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

  // Filtered controls based on active tab
  const filteredControls = activeTab === 'all' 
    ? controls 
    : controls.filter(control => control.status === activeTab);

  // Check if any controls are not addressed
  const hasUnaddressedControls = controls.some(control => !control.status);

  return {
    client,
    controls,
    audit,
    activeTab,
    setActiveTab,
    viewMode,
    setViewMode,
    openCoverDialog,
    setOpenCoverDialog,
    auditTitle,
    setAuditTitle,
    financialYear,
    setFinancialYear,
    auditDate,
    setAuditDate,
    filteredControls,
    hasUnaddressedControls,
    handleUpdateControl,
    handleSaveAudit,
    handleSubmitAudit,
    handleExportPdf,
    handleCoverInfoSave,
  };
};
