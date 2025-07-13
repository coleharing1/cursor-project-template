"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// Mock data
function getMockCategories() {
  return ['Work', 'Personal'];
}

export default function Categories() {
  const [newCategory, setNewCategory] = useState('');
  const [categories, setCategories] = useState(getMockCategories());

  const handleAdd = () => {
    if (newCategory) {
      setCategories([...categories, newCategory]);
      setNewCategory('');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Categories</h1>
      <div className="flex gap-2 mb-4">
        <Input value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="New category name" />
        <Button onClick={handleAdd} className="bg-accent-primary">Add</Button>
      </div>
      <ul className="space-y-2">
        {categories.map((cat, idx) => <li key={idx} className="p-2 bg-surface rounded-md">{cat}</li>)}
      </ul>
    </div>
  );
} 