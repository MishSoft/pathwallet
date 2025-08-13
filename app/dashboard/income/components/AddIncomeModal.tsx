// src/components/income/AddIncomeModal.tsx

"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface AddIncomeModalProps {
  onAddIncome: (income: { source: string; amount: number }) => void;
}

const AddIncomeModal: React.FC<AddIncomeModalProps> = ({ onAddIncome }) => {
  const [source, setSource] = useState('');
  const [amount, setAmount] = useState<number | string>('');
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (source && amount) {
      onAddIncome({ source, amount: Number(amount) });
      setSource('');
      setAmount('');
      setOpen(false); // ფანჯრის დახურვა
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>ახალი შემოსავლის დამატება</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ახალი შემოსავლის დამატება</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="source">წყარო</Label>
            <Input
              id="source"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="amount">თანხა</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
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

export default AddIncomeModal;