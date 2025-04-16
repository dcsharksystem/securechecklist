import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, ClipboardCheck, FileBadge } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-security-light to-white">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-security-dark mb-2">
          Security Audit Control
        </h1>
        <p className="text-xl text-muted-foreground max-w-xl mx-auto">
          Streamline your information security audits with our comprehensive compliance tracking solution
        </p>
      </div>
      
      <Card className="w-full max-w-md bg-white shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-security-primary/10 rounded-full flex items-center justify-center mb-2">
            <ShieldCheck size={32} className="text-security-primary" />
          </div>
          <CardTitle className="text-2xl">Security Audit Tool</CardTitle>
          <CardDescription>
            Track and manage compliance across your organization
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <FeatureItem 
            icon={ClipboardCheck} 
            title="Comprehensive Controls" 
            description="Evaluate compliance across all security domains with our structured controls framework" 
          />
          <FeatureItem 
            icon={FileBadge} 
            title="Detailed Reporting" 
            description="Generate professional compliance reports and track your security posture over time" 
          />
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full bg-security-primary hover:bg-security-secondary"
            onClick={() => navigate('/client-setup')}
          >
            Start New Audit
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

interface FeatureItemProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

const FeatureItem = ({ icon: Icon, title, description }: FeatureItemProps) => (
  <div className="flex items-start">
    <div className="mt-1 mr-4 h-8 w-8 flex-shrink-0 bg-security-primary/10 rounded-full flex items-center justify-center">
      <Icon size={18} className="text-security-primary" />
    </div>
    <div>
      <h3 className="font-medium">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  </div>
);

export default Index;
