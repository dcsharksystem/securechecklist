
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Control, ComplianceStatus } from '@/types';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Shield, ShieldCheck, Edit, X, Plus } from 'lucide-react';

const ControlsManagementPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [controls, setControls] = useState<Control[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  
  // Form state for adding/editing a control
  const [isEditing, setIsEditing] = useState(false);
  const [currentControl, setCurrentControl] = useState<Control | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState<ComplianceStatus>('notCompliant');
  
  useEffect(() => {
    // Load controls from localStorage
    const auditData = localStorage.getItem('securityAudit');
    if (auditData) {
      const audit = JSON.parse(auditData);
      const savedControls = audit.controls || [];
      setControls(savedControls);
      
      // Extract unique categories
      const uniqueCategories = [...new Set(savedControls.map((control: Control) => control.category))];
      setCategories(uniqueCategories);
    } else {
      // Redirect to client setup if no audit exists
      toast({
        title: "No audit found",
        description: "Please set up a client first",
        variant: "destructive",
      });
      navigate('/');
    }
  }, [navigate, toast]);
  
  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory('');
      setIsAddingCategory(false);
      setCategory(newCategory.trim());
      
      toast({
        title: "Category Added",
        description: `Category "${newCategory.trim()}" has been added.`,
      });
    }
  };
  
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory(categories[0] || '');
    setStatus('notCompliant');
    setCurrentControl(null);
    setIsEditing(false);
  };
  
  const handleEditControl = (control: Control) => {
    setCurrentControl(control);
    setTitle(control.title);
    setDescription(control.description);
    setCategory(control.category);
    setStatus(control.status);
    setIsEditing(true);
  };
  
  const handleDeleteControl = (controlId: string) => {
    const updatedControls = controls.filter(control => control.id !== controlId);
    setControls(updatedControls);
    
    // Update localStorage
    const auditData = localStorage.getItem('securityAudit');
    if (auditData) {
      const audit = JSON.parse(auditData);
      audit.controls = updatedControls;
      localStorage.setItem('securityAudit', JSON.stringify(audit));
      
      toast({
        title: "Control Deleted",
        description: "The security control has been deleted.",
      });
    }
  };
  
  const handleSaveControl = () => {
    if (!title.trim() || !description.trim() || !category) {
      toast({
        title: "Validation Error",
        description: "Please fill out all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    let updatedControls: Control[];
    
    if (isEditing && currentControl) {
      // Update existing control
      updatedControls = controls.map(control => 
        control.id === currentControl.id
          ? {
              ...control,
              title: title.trim(),
              description: description.trim(),
              category,
              status,
              updatedAt: new Date()
            }
          : control
      );
      
      toast({
        title: "Control Updated",
        description: "The security control has been updated.",
      });
    } else {
      // Add new control
      const newControl: Control = {
        id: uuidv4(),
        title: title.trim(),
        description: description.trim(),
        category,
        status,
        serialNumber: controls.length + 1,
        updatedAt: new Date()
      };
      
      updatedControls = [...controls, newControl];
      
      toast({
        title: "Control Added",
        description: "New security control has been added.",
      });
    }
    
    // Update state and localStorage
    setControls(updatedControls);
    
    const auditData = localStorage.getItem('securityAudit');
    if (auditData) {
      const audit = JSON.parse(auditData);
      audit.controls = updatedControls;
      localStorage.setItem('securityAudit', JSON.stringify(audit));
    }
    
    // Reset form
    resetForm();
  };
  
  const handleCancel = () => {
    resetForm();
  };
  
  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="container max-w-6xl pt-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Security Controls Management</h1>
            <p className="text-muted-foreground">Add, edit, and manage security controls for your audit</p>
          </div>
          <Button onClick={() => navigate('/audit')} variant="outline">
            Back to Audit
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Control Form */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>
                  {isEditing ? 'Edit Control' : 'Add New Control'}
                </CardTitle>
                <CardDescription>
                  {isEditing ? 'Update the security control details' : 'Define a new security control'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Control Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter control title"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the security control"
                    rows={4}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  {isAddingCategory ? (
                    <div className="flex space-x-2">
                      <Input
                        id="newCategory"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder="New category name"
                        className="flex-1"
                      />
                      <Button type="button" onClick={handleAddCategory} size="sm">
                        Add
                      </Button>
                      <Button 
                        type="button" 
                        onClick={() => setIsAddingCategory(false)} 
                        size="sm"
                        variant="ghost"
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex space-x-2">
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button 
                        type="button" 
                        onClick={() => setIsAddingCategory(true)} 
                        size="sm"
                        variant="outline"
                      >
                        <Plus size={16} />
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Default Status</Label>
                  <Select value={status} onValueChange={(value) => setStatus(value as ComplianceStatus)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select default status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="compliant">Compliant</SelectItem>
                      <SelectItem value="notCompliant">Not Compliant</SelectItem>
                      <SelectItem value="partial">Partially Compliant</SelectItem>
                      <SelectItem value="notApplicable">Not Applicable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button onClick={handleSaveControl}>
                  {isEditing ? 'Update Control' : 'Add Control'}
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Controls List */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="text-security-primary" size={20} />
                  Security Controls ({controls.length})
                </CardTitle>
                <CardDescription>
                  Manage your security controls inventory
                </CardDescription>
              </CardHeader>
              <CardContent>
                {controls.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Shield className="mx-auto mb-3 text-muted-foreground" size={32} />
                    <p>No security controls defined yet</p>
                    <p className="text-sm">Add your first control using the form</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[50px]">ID</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {controls.map((control, index) => (
                          <TableRow key={control.id}>
                            <TableCell className="font-medium">{control.serialNumber || index + 1}</TableCell>
                            <TableCell>{control.title}</TableCell>
                            <TableCell>{control.category}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleEditControl(control)}
                                >
                                  <Edit size={16} />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleDeleteControl(control.id)}
                                  className="text-destructive hover:text-destructive/90"
                                >
                                  <X size={16} />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlsManagementPage;
