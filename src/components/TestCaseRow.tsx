'use client';

import { useState } from 'react';
import { Trash2, ChevronDown } from 'lucide-react';
import StatusBadge from './StatusBadge';
import type { TestCase, Status } from '@/lib/db';
import clsx from 'clsx';

const STATUSES: Status[] = ['passed', 'failed', 'not_tested'];

interface Props {
  test: TestCase;
  onUpdate: (id: number, status: Status) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

export default function TestCaseRow({ test, onUpdate, onDelete }: Props) {
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleStatusChange = async (status: Status) => {
    setShowMenu(false);
    setLoading(true);
    await onUpdate(test.id, status);
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm(`Delete "${test.name}"?`)) return;
    await onDelete(test.id);
  };

  const formattedDate = new Date(test.updated_at + 'Z').toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className={clsx(
      'group flex items-center gap-4 px-4 py-3 border-b border-border/60 hover:bg-bg-hover/50 transition-colors',
      loading && 'opacity-50'
    )}>
      {/* Name */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-text-primary font-medium truncate">{test.name}</p>
        <p className="text-[11px] text-text-muted font-mono mt-0.5">{formattedDate}</p>
      </div>

      {/* Status Dropdown */}
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          disabled={loading}
          className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
        >
          <StatusBadge status={test.status} />
          <ChevronDown size={12} className="text-text-muted" />
        </button>

        {showMenu && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
            <div className="absolute right-0 mt-1 z-20 bg-bg-card border border-border rounded-lg shadow-xl overflow-hidden w-36 animate-fade-in">
              {STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  className={clsx(
                    'w-full px-3 py-2 text-left text-xs hover:bg-bg-hover transition-colors',
                    test.status === s ? 'text-accent-cyan font-medium' : 'text-text-secondary'
                  )}
                >
                  {s === 'passed' ? '✓ Passed' : s === 'failed' ? '✗ Failed' : '○ Not Tested'}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Delete */}
      <button
        onClick={handleDelete}
        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-accent-red/10 hover:text-accent-red text-text-muted transition-all"
      >
        <Trash2 size={13} />
      </button>
    </div>
  );
}
