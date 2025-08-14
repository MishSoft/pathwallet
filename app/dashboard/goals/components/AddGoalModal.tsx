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

interface AddGoalModalProps {
  onAddGoal: (goal: { title: string; targetAmount: number }) => void;
}

const AddGoalModal: React.FC<AddGoalModalProps> = ({ onAddGoal }) => {
  const [title, setTitle] = useState("");
  const [targetAmount, setTargetAmount] = useState<number | string>("");
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title && targetAmount) {
      onAddGoal({ title, targetAmount: Number(targetAmount) });
      setTitle("");
      setTargetAmount("");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>ახალი მიზნის დამატება</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ახალი მიზნის დამატება</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">მიზნის დასახელება</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="targetAmount">საჭირო თანხა</Label>
            <Input
              id="targetAmount"
              type="number"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            დამატება
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddGoalModal;
