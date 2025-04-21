
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";
import { ComplianceStatus, Control } from "@/types";

interface ControlsFormProps {
  isEditing: boolean;
  currentControl: Control | null;
  title: string;
  description: string;
  category: string;
  categories: string[];
  newCategory: string;
  isAddingCategory: boolean;
  status: ComplianceStatus;
  setTitle: (t: string) => void;
  setDescription: (d: string) => void;
  setCategory: (c: string) => void;
  setStatus: (s: ComplianceStatus) => void;
  setNewCategory: (c: string) => void;
  setIsAddingCategory: (adding: boolean) => void;
  handleAddCategory: () => void;
  handleSaveControl: () => void;
  handleCancel: () => void;
}

export default function ControlsForm({
  isEditing,
  currentControl,
  title,
  description,
  category,
  categories,
  newCategory,
  isAddingCategory,
  status,
  setTitle,
  setDescription,
  setCategory,
  setStatus,
  setNewCategory,
  setIsAddingCategory,
  handleAddCategory,
  handleSaveControl,
  handleCancel,
}: ControlsFormProps) {
  // Ensure form is populated with current control data when editing
  useEffect(() => {
    if (isEditing && currentControl) {
      setTitle(currentControl.title);
      setDescription(currentControl.description);
      setCategory(currentControl.category);
      setStatus(currentControl.status);
    }
  }, [currentControl, isEditing, setTitle, setDescription, setCategory, setStatus]);

  return (
    <div>
      <div className="space-y-4">
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
          <Select
            value={status}
            onValueChange={(value) => setStatus(value as ComplianceStatus)}
          >
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
      </div>
      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleSaveControl}>
          {isEditing ? "Update Control" : "Add Control"}
        </Button>
      </div>
    </div>
  );
}
