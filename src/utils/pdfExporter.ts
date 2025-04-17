
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Client, Control, Audit, ComplianceStatus } from '@/types';

export const exportAuditToPdf = (audit: Audit, client: Client): void => {
  if (!audit || !client) return;
  
  // Configure PDF size for A4
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4" // A4 size
  });
  
  // Add cover page
  doc.setFontSize(20);
  doc.setTextColor(0, 70, 139); // #00468b color
  doc.text(audit.title || 'Information System & Electronic Data Processing', doc.internal.pageSize.getWidth() / 2, 40, { align: 'center' });
  
  doc.setFontSize(16);
  doc.text(`Audit Financial Year ${audit.financialYear || ''}`, doc.internal.pageSize.getWidth() / 2, 50, { align: 'center' });
  
  doc.setFontSize(16);
  doc.setTextColor(0, 70, 139);
  doc.text(client.name, doc.internal.pageSize.getWidth() / 2, 70, { align: 'center' });
  
  // Add logo if available
  if (client.logoUrl) {
    try {
      // Client logo URLs from localStorage are dataURLs, not file URLs
      doc.addImage(client.logoUrl, 'JPEG', doc.internal.pageSize.getWidth() / 2 - 30, 80, 60, 60);
    } catch (e) {
      console.error("Error adding logo to PDF", e);
    }
  }
  
  // Add date
  const auditDate = audit.auditDate ? new Date(audit.auditDate) : new Date();
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
  const summary = audit.controls.reduce(
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
  const totalApplicable = audit.controls.length - summary.notApplicable;
  const compliancePercentage = totalApplicable === 0 
    ? 0 
    : Math.round((summary.compliant / totalApplicable) * 100);
  
  // Add summary table using autoTable
  const summaryData = [
    ['Compliant', summary.compliant],
    ['Not Compliant', summary.notCompliant],
    ['Partial Compliant', summary.partial],
    ['Not Applicable', summary.notApplicable],
    ['Overall Compliance', `${compliancePercentage}%`],
  ];
  
  autoTable(doc, {
    startY: 52,
    head: [['Status', 'Count']],
    body: summaryData,
    theme: 'striped',
    headStyles: { fillColor: [3, 105, 161] },
  });
  
  // Add controls table
  doc.setFontSize(16);
  doc.text('Control Details', 14, doc.lastAutoTable.finalY + 10);
  
  const controlsData = audit.controls.map(control => [
    control.category,
    control.title,
    getStatusText(control.status),
    control.comment || control.detailedComment || 'No comments',
  ]);
  
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 14,
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
};

// Helper function to convert status to text
const getStatusText = (status: ComplianceStatus): string => {
  switch (status) {
    case 'compliant': return 'Compliant';
    case 'notCompliant': return 'Not Compliant';
    case 'partial': return 'Partial Compliant';
    case 'notApplicable': return 'Not Applicable';
    default: return '';
  }
};
