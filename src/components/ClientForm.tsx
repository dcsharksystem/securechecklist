
import { useState, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Upload, MapPin } from 'lucide-react';

interface ClientFormProps {
  onSave: (
    clientName: string, 
    logoFile: File | null, 
    address?: string, 
    city?: string, 
    state?: string, 
    zipCode?: string,
    country?: string
  ) => void;
  initialClientName?: string;
  initialLogoUrl?: string;
  initialAddress?: string;
  initialCity?: string;
  initialState?: string;
  initialZipCode?: string;
  initialCountry?: string;
}

const ClientForm = ({ 
  onSave, 
  initialClientName = '', 
  initialLogoUrl = '',
  initialAddress = '',
  initialCity = '',
  initialState = '',
  initialZipCode = '',
  initialCountry = ''
}: ClientFormProps) => {
  const [clientName, setClientName] = useState(initialClientName);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(initialLogoUrl);
  const [address, setAddress] = useState(initialAddress);
  const [city, setCity] = useState(initialCity);
  const [state, setState] = useState(initialState);
  const [zipCode, setZipCode] = useState(initialZipCode);
  const [country, setCountry] = useState(initialCountry);

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setClientName(e.target.value);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    onSave(clientName, logoFile, address, city, state, zipCode, country);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <Building2 className="text-security-primary" size={24} />
          Client Information
        </CardTitle>
        <CardDescription>
          Enter the client details for this security audit
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="clientName">Client Name</Label>
          <Input 
            id="clientName" 
            placeholder="Enter client name" 
            value={clientName}
            onChange={handleNameChange}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="logo">Client Logo</Label>
          <div className="flex flex-col items-center gap-4">
            {previewUrl ? (
              <div className="w-36 h-36 flex items-center justify-center border rounded-md overflow-hidden bg-white p-2">
                <img 
                  src={previewUrl} 
                  alt="Client logo preview" 
                  className="max-w-full max-h-full object-contain" 
                />
              </div>
            ) : (
              <div className="w-36 h-36 flex items-center justify-center border border-dashed rounded-md text-gray-400">
                No logo selected
              </div>
            )}
            
            <div className="relative w-full">
              <Input
                id="logo"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
              />
              <Button
                type="button"
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
              >
                <Upload size={16} />
                {previewUrl ? 'Change Logo' : 'Upload Logo'}
              </Button>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <div className="flex items-center gap-2 mb-2">
            <MapPin size={16} className="text-security-primary" />
            <Label>Client Address</Label>
          </div>
          
          <div className="space-y-2">
            <Input 
              placeholder="Street Address" 
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            
            <div className="grid grid-cols-2 gap-2">
              <Input 
                placeholder="City" 
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
              <Input 
                placeholder="State/Province" 
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <Input 
                placeholder="Postal/Zip Code" 
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
              />
              <Input 
                placeholder="Country" 
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSubmit} 
          className="w-full bg-security-primary hover:bg-security-secondary"
          disabled={!clientName.trim()}
        >
          Continue to Audit
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ClientForm;
