
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import ClientForm from '@/components/ClientForm';
import { Client } from '@/types';

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
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-security-light to-white">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-security-dark mb-2">Security Audit Control</h1>
        <p className="text-lg text-muted-foreground">Begin by setting up your client information</p>
      </div>
      
      <ClientForm onSave={handleSaveClient} />
    </div>
  );
};

export default ClientSetup;
