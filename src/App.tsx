
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import ClientSetup from '@/pages/ClientSetup';
import AuditPage from '@/pages/AuditPage';
import ControlsManagementPage from '@/pages/ControlsManagementPage';
import NotFound from '@/pages/NotFound';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <Router>
      <Toaster />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/client-setup" element={<ClientSetup />} />
        <Route path="/audit" element={<AuditPage />} />
        <Route path="/controls" element={<ControlsManagementPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
