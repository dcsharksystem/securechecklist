
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import ClientForm from '@/components/ClientForm';
import { Client } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, MapPin } from 'lucide-react';

const ClientSetup = () => {
  const navigate = useNavigate();

  const handleSaveClient = (
    clientName: string, 
    logoFile: File | null, 
    address?: string, 
    city?: string, 
    state?: string, 
    zipCode?: string,
    country?: string
  ) => {
    // Create the client object
    const logoUrl = logoFile 
      ? URL.createObjectURL(logoFile) 
      : '';
    
    const client: Client = {
      id: uuidv4(),
      name: clientName,
      logoUrl,
      address,
      city,
      state,
      zipCode,
      country,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // In a real application, we would save this to MongoDB
    // For now, we'll store it in localStorage
    localStorage.setItem('securityAuditClient', JSON.stringify(client));
    
    // Navigate to the audit page
    navigate('/audit');
  };

  return (
    <div className="min-h-screen flex flex-col p-4 bg-gradient-to-br from-security-light to-white">
      <div className="text-center mb-8 pt-8">
        <h1 className="text-3xl font-bold text-security-dark mb-2">Security Audit Control</h1>
        <p className="text-lg text-muted-foreground">Begin by setting up your client information</p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6 max-w-7xl mx-auto w-full">
        {/* Client Information (Left Side) */}
        <div className="flex-1">
          <ClientForm onSave={handleSaveClient} />
        </div>
        
        {/* Company Information (Right Side) */}
        <div className="flex-1">
          <Card className="w-full h-full">
            <CardContent className="p-6 flex flex-col items-center">
              <div className="mb-6 w-48 h-48 flex items-center justify-center">
                <img 
                  src="/placeholder.svg" 
                  alt="Shark Cyber System Logo" 
                  className="max-w-full max-h-full"
                />
              </div>
              
              <h2 className="text-2xl font-semibold text-center mb-2 flex items-center gap-2">
                <Building2 className="text-security-primary" size={24} />
                Shark Cyber System
              </h2>
              
              <div className="mt-4 text-center space-y-1 text-muted-foreground">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <MapPin size={16} className="text-security-primary" />
                  <span className="font-medium">Company Address</span>
                </div>
                <p>518, I square Corporate Park,</p>
                <p>Near CIMS Hospital, Science</p>
                <p>City Road, Ahmedabad -</p>
                <p>380060 (Gujarat)</p>
              </div>
              
              <div className="mt-8 p-4 border border-dashed rounded-md bg-slate-50 w-full">
                <h3 className="text-sm font-medium mb-2">About Us</h3>
                <p className="text-sm text-muted-foreground">
                  Shark Cyber System provides comprehensive security audit services to help organizations 
                  identify vulnerabilities and strengthen their security posture.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClientSetup;
