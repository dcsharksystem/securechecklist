
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { Control, ComplianceStatus } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import ControlsForm from "@/components/ControlsForm";
import ControlsList from "@/components/ControlsList";

const ControlsManagementPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [controls, setControls] = useState<Control[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  // Form state for adding/editing a control
  const [isEditing, setIsEditing] = useState(false);
  const [currentControl, setCurrentControl] = useState<Control | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState<ComplianceStatus>("notCompliant");

  useEffect(() => {
    // Load controls from localStorage
    const auditData = localStorage.getItem("securityAudit");
    if (auditData) {
      const audit = JSON.parse(auditData);
      const savedControls = audit.controls || [];
      setControls(savedControls);

      // Extract unique categories
      const uniqueCategories: string[] = [];
      savedControls.forEach((control: Control) => {
        if (
          control.category &&
          typeof control.category === "string" &&
          !uniqueCategories.includes(control.category)
        ) {
          uniqueCategories.push(control.category);
        }
      });
      setCategories(uniqueCategories);
      
      // Set default category if available
      if (uniqueCategories.length > 0 && !category) {
        setCategory(uniqueCategories[0]);
      }
    } else {
      // Redirect to client setup if no audit exists
      toast({
        title: "No audit found",
        description: "Please set up a client first",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [navigate, toast, category]);

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory("");
      setIsAddingCategory(false);
      setCategory(newCategory.trim());

      toast({
        title: "Category Added",
        description: `Category "${newCategory.trim()}" has been added.`,
      });
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory(categories[0] || "");
    setStatus("notCompliant");
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
    const updatedControls = controls.filter((control) => control.id !== controlId);
    setControls(updatedControls);

    // Update localStorage
    const auditData = localStorage.getItem("securityAudit");
    if (auditData) {
      const audit = JSON.parse(auditData);
      audit.controls = updatedControls;
      localStorage.setItem("securityAudit", JSON.stringify(audit));

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
      updatedControls = controls.map((control) =>
        control.id === currentControl.id
          ? {
              ...control,
              title: title.trim(),
              description: description.trim(),
              category,
              status,
              updatedAt: new Date(),
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
        updatedAt: new Date(),
      };

      updatedControls = [...controls, newControl];

      toast({
        title: "Control Added",
        description: "New security control has been added.",
      });
    }

    // Update state and localStorage
    setControls(updatedControls);

    const auditData = localStorage.getItem("securityAudit");
    if (auditData) {
      const audit = JSON.parse(auditData);
      audit.controls = updatedControls;
      localStorage.setItem("securityAudit", JSON.stringify(audit));
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
            <p className="text-muted-foreground">
              Add, edit, and manage security controls for your audit
            </p>
          </div>
          <Button onClick={() => navigate("/audit")} variant="outline">
            Back to Audit
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>
                  {isEditing ? "Edit Control" : "Add New Control"}
                </CardTitle>
                <CardDescription>
                  {isEditing
                    ? "Update the security control details"
                    : "Define a new security control"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ControlsForm
                  isEditing={isEditing}
                  currentControl={currentControl}
                  title={title}
                  description={description}
                  category={category}
                  categories={categories}
                  newCategory={newCategory}
                  isAddingCategory={isAddingCategory}
                  status={status}
                  setTitle={setTitle}
                  setDescription={setDescription}
                  setCategory={setCategory}
                  setStatus={setStatus}
                  setNewCategory={setNewCategory}
                  setIsAddingCategory={setIsAddingCategory}
                  handleAddCategory={handleAddCategory}
                  handleSaveControl={handleSaveControl}
                  handleCancel={handleCancel}
                />
              </CardContent>
            </Card>
          </div>
          <div className="md:col-span-2">
            <Card>
              <CardHeader />
              <CardContent>
                <ControlsList
                  controls={controls}
                  handleEditControl={handleEditControl}
                  handleDeleteControl={handleDeleteControl}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlsManagementPage;
