
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Shield, ShieldCheck, Edit, X } from "lucide-react";
import { Control } from "@/types";

interface ControlsListProps {
  controls: Control[];
  handleEditControl: (control: Control) => void;
  handleDeleteControl: (id: string) => void;
}

export default function ControlsList({
  controls,
  handleEditControl,
  handleDeleteControl,
}: ControlsListProps) {
  return (
    <div>
      <div className="mb-4">
        <div className="flex items-center gap-2 text-xl font-semibold">
          <ShieldCheck className="text-security-primary" size={20} />
          Security Controls ({controls.length})
        </div>
        <div className="text-muted-foreground -mt-1 mb-4 text-sm">
          Manage your security controls inventory
        </div>
      </div>
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
                  <TableCell className="font-medium">
                    {control.serialNumber || index + 1}
                  </TableCell>
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
    </div>
  );
}

