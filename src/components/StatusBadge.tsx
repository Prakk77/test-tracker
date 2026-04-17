import clsx from 'clsx';
import { CheckCircle2, XCircle, Circle } from 'lucide-react';
import type { Status } from '@/lib/db';

const config: Record<Status, { label: string; icon: typeof CheckCircle2; classes: string }> = {
  passed: {
    label: 'Passed',
    icon: CheckCircle2,
    classes: 'text-accent-green bg-accent-green/10 border-accent-green/20',
  },
  failed: {
    label: 'Failed',
    icon: XCircle,
    classes: 'text-accent-red bg-accent-red/10 border-accent-red/20',
  },
  not_tested: {
    label: 'Not Tested',
    icon: Circle,
    classes: 'text-text-secondary bg-bg-hover border-border',
  },
};

export default function StatusBadge({ status }: { status: Status }) {
  const { label, icon: Icon, classes } = config[status];
  return (
    <span className={clsx('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border', classes)}>
      <Icon size={11} />
      {label}
    </span>
  );
}
