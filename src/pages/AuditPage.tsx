
import { useRef } from 'react';
import { useAudit } from '@/hooks/useAudit';
import AuditHeader from '@/components/AuditHeader';
import AuditSummary from '@/components/AuditSummary';
import ControlItem from '@/components/ControlItem';
import AuditTableView from '@/components/AuditTableView';
import AuditCoverDialog from '@/components/AuditCoverDialog';
import AuditAlerts from '@/components/AuditAlerts';
import AuditViewToggle from '@/components/AuditViewToggle';
import AuditActionButtons from '@/components/AuditActionButtons';
import AuditCoverPage from '@/components/AuditCoverPage';

const AuditPage = () => {
  const { 
    client, 
    audit, 
    controls,
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
  } = useAudit();

  const coverPageRef = useRef<HTMLDivElement>(null);

  if (!client || !audit) {
    return <div>Loading...</div>;
  }

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
        <AuditCoverDialog
          open={openCoverDialog}
          onOpenChange={setOpenCoverDialog}
          auditTitle={auditTitle}
          setAuditTitle={setAuditTitle}
          financialYear={financialYear}
          setFinancialYear={setFinancialYear}
          auditDate={auditDate}
          setAuditDate={setAuditDate}
          onSave={handleCoverInfoSave}
        />
        
        {/* Alerts */}
        <AuditAlerts controls={controls} isSubmitted={audit.submitted} />
        
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
        <AuditViewToggle
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />
        
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
        
        <AuditActionButtons
          onSave={handleSaveAudit}
          onSubmit={handleSubmitAudit}
          isSubmitted={audit.submitted}
          hasUnaddressedControls={hasUnaddressedControls}
        />
      </div>
    </div>
  );
};

export default AuditPage;
