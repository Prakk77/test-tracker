'use client';

import { useState, useEffect, useCallback } from 'react';
import type { TestCase, Environment, Status } from '@/lib/db';
import TestCaseRow from './TestCaseRow';
import AddTestForm from './AddTestForm';
import StatsBar from './StatsBar';
import { Loader2, ClipboardList } from 'lucide-react';

interface Props {
  environment: Environment;
  title: string;
  accentColor: string;
  icon: React.ReactNode;
}

export default function EnvironmentPage({ environment, title, accentColor, icon }: Props) {
  const [tests, setTests] = useState<TestCase[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTests = useCallback(async () => {
    const res = await fetch(`/api/tests?environment=${environment}`);
    const data = await res.json();
    setTests(data.tests);
    setLoading(false);
  }, [environment]);

  useEffect(() => { fetchTests(); }, [fetchTests]);

  const handleAdd = async (name: string) => {
    const res = await fetch('/api/tests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, environment }),
    });
    if (res.ok) {
      const data = await res.json();
      setTests(prev => [data.test, ...prev]);
    }
  };

  const handleUpdate = async (id: number, status: Status) => {
    const res = await fetch(`/api/tests/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      const data = await res.json();
      setTests(prev => prev.map(t => t.id === id ? data.test : t));
    }
  };

  const handleDelete = async (id: number) => {
    const res = await fetch(`/api/tests/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setTests(prev => prev.filter(t => t.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center bg-current/10 ${accentColor}`}
            style={{ backgroundColor: `color-mix(in srgb, currentColor 12%, transparent)` }}>
            {icon}
          </div>
          <h1 className="text-2xl font-semibold text-text-primary tracking-tight">{title}</h1>
        </div>
        <p className="text-sm text-text-muted ml-11">
          Manage and track test cases for the <span className="font-mono text-xs">{environment}</span> environment
        </p>
      </div>

      {/* Card */}
      <div className="bg-bg-card border border-border rounded-xl overflow-hidden shadow-lg">
        {/* Stats */}
        {!loading && <StatsBar tests={tests} />}

        {/* Add Form */}
        <AddTestForm onAdd={handleAdd} />

        {/* Test List */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={20} className="animate-spin text-text-muted" />
          </div>
        ) : tests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <ClipboardList size={32} className="text-text-muted mb-3" />
            <p className="text-sm text-text-secondary font-medium">No test cases yet</p>
            <p className="text-xs text-text-muted mt-1">Add your first test case above</p>
          </div>
        ) : (
          <div className="divide-y-0">
            {tests.map(test => (
              <TestCaseRow
                key={test.id}
                test={test}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
