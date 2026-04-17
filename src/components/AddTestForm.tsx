'use client';

import { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';

interface Props {
  onAdd: (name: string) => Promise<void>;
}

export default function AddTestForm({ onAdd }: Props) {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = value.trim();
    if (!name) return;
    setLoading(true);
    await onAdd(name);
    setValue('');
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-4 border-b border-border">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Add new test case..."
        disabled={loading}
        className="flex-1 bg-bg-tertiary border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-cyan/50 focus:bg-bg-hover transition-colors font-sans"
      />
      <button
        type="submit"
        disabled={!value.trim() || loading}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-accent-cyan/10 hover:bg-accent-cyan/20 text-accent-cyan text-sm font-medium border border-accent-cyan/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
      >
        {loading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
        Add
      </button>
    </form>
  );
}
