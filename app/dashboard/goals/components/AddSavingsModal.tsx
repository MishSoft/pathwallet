"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddSavingsModalProps {
  goalId: string;
  onAddSavings: (goalId: string, amount: number) => void;
}

const AddSavingsModal: React.FC<AddSavingsModalProps> = ({
  goalId,
  onAddSavings,
}) => {
  const [amount, setAmount] = useState<number | string>("");
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount) {
      onAddSavings(goalId, Number(amount));
      setAmount("");
      setOpen(false); // ფანჯრის დახურვა
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Add
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Amount</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Add
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSavingsModal;
