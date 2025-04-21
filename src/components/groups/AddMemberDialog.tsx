
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User } from "@/types";

interface AddMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (member: User) => void;
}
export function AddMemberDialog({ open, onOpenChange, onAdd }: AddMemberDialogProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleAdd = () => {
    if (name.trim()) {
      onAdd({ id: Date.now().toString(), name, email });
      setName("");
      setEmail("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Member</DialogTitle>
        </DialogHeader>
        <Input
          label="Name"
          placeholder="Member Name"
          value={name}
          onChange={e => setName(e.target.value)}
          autoFocus
        />
        <Input
          label="Email"
          placeholder="Member Email (optional)"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <DialogFooter>
          <Button onClick={handleAdd} disabled={!name.trim()} variant="primary">
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
