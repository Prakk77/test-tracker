import { CheckCircle2, XCircle, Circle, FlaskConical } from 'lucide-react';
import type { TestCase } from '@/lib/db';

export default function StatsBar({ tests }: { tests: TestCase[] }) {
  const total = tests.length;
  const passed = tests.filter(t => t.status === 'passed').length;
  const failed = tests.filter(t => t.status === 'failed').length;
  const notTested = tests.filter(t => t.status === 'not_tested').length;
  const passRate = total > 0 ? Math.round((passed / total) * 100) : 0;

  return (
    <div className="grid grid-cols-4 gap-3 p-4 bg-bg-secondary/50 border-b border-border">
      <Stat icon={<FlaskConical size={14} className="text-text-muted" />} label="Total" value={total} />
      <Stat icon={<CheckCircle2 size={14} className="text-accent-green" />} label="Passed" value={passed} accent="text-accent-green" />
      <Stat icon={<XCircle size={14} className="text-accent-red" />} label="Failed" value={failed} accent="text-accent-red" />
      <Stat icon={<Circle size={14} className="text-text-secondary" />} label="Pass Rate" value={`${passRate}%`} />
    </div>
  );
}

function Stat({ icon, label, value, accent }: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  accent?: string;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-7 h-7 rounded-lg bg-bg-hover flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <p className={`text-base font-semibold ${accent || 'text-text-primary'}`}>{value}</p>
        <p className="text-[11px] text-text-muted">{label}</p>
      </div>
    </div>
  );
}
