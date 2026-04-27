'use client';

import { useState, useEffect } from 'react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';
import { Loader2, TrendingUp, CheckCircle2, XCircle, Circle, Activity } from 'lucide-react';

type EnvStats = {
  environment: string;
  total: number;
  passed: number;
  failed: number;
  not_tested: number;
};

type DashboardData = {
  overall: { total: number; passed: number; failed: number; not_tested: number };
  byEnv: EnvStats[];
  recent: Array<{ id: number; name: string; environment: string; status: string; updated_at: string }>;
};

const ENV_COLORS: Record<string, string> = {
  dev: '#00d4ff',
  staging: '#9b59ff',
  production: '#00e5a0',
};

const STATUS_COLORS = {
  passed: '#00e5a0',
  failed: '#ff4757',
  not_tested: '#5a5a72',
};

const ENV_LABELS: Record<string, string> = {
  dev: 'Dev',
  staging: 'Staging',
  production: 'Production',
};

type FilterOption = 'all' | 'dev' | 'staging' | 'production';

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterOption>('all');
  const isReady = data && data.byEnv.length > 0;

    // useEffect(() => {
    // fetch('/api/dashboard', {
    //     credentials: 'include', // 👈 add this
    // })
    //     .then(r => r.json())
    //     .then(d => { setData(d); setLoading(false); });
    // }, []);


    useEffect(() => {
      fetch('/api/dashboard', {
        credentials: 'include',
      })
        .then(r => r.json())
        .then(d => {
          // 👇 force animation trigger
          setData({
            overall: { total: 0, passed: 0, failed: 0, not_tested: 0 },
            byEnv: [],
            recent: [],
          });

          // 👇 next tick → real data
          setTimeout(() => {
            setData(d);
            setLoading(false);
          }, 50);
        });
    }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <Loader2 size={24} className="animate-spin text-text-muted" />
      </div>
    );
  }

  if (!data) return null;

  const { overall, byEnv, recent } = data;

  // Filter logic
  const filteredEnvStats = filter === 'all' ? byEnv : byEnv.filter(e => e.environment === filter);

  const pieData = filter === 'all'
    ? [
        { name: 'Passed', value: overall.passed, color: STATUS_COLORS.passed },
        { name: 'Failed', value: overall.failed, color: STATUS_COLORS.failed },
        { name: 'Not Tested', value: overall.not_tested, color: STATUS_COLORS.not_tested },
      ].filter(d => d.value > 0)
    : (() => {
        const env = byEnv.find(e => e.environment === filter);
        if (!env) return [];
        return [
          { name: 'Passed', value: env.passed, color: STATUS_COLORS.passed },
          { name: 'Failed', value: env.failed, color: STATUS_COLORS.failed },
          { name: 'Not Tested', value: env.not_tested, color: STATUS_COLORS.not_tested },
        ].filter(d => d.value > 0);
      })();

  const barData = filteredEnvStats.map(e => ({
    name: ENV_LABELS[e.environment] || e.environment,
    Passed: e.passed,
    Failed: e.failed,
    'Not Tested': e.not_tested,
    color: ENV_COLORS[e.environment] || '#ffffff',
  }));

  const passRate = overall.total > 0
    ? Math.round((overall.passed / overall.total) * 100)
    : 0;

  const filteredRecent = filter === 'all'
    ? recent
    : recent.filter(r => r.environment === filter);

  const customTooltipStyle = {
    backgroundColor: '#16161f',
    border: '1px solid #252535',
    borderRadius: '8px',
    fontSize: '12px',
    color: '#e8e8f0',
  };

  return (
    <div className="min-h-screen bg-bg-primary p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <Activity size={18} className="text-accent-cyan" />
            <h1 className="text-2xl font-semibold text-text-primary tracking-tight">Dashboard</h1>
          </div>
          <p className="text-sm text-text-muted">Overview of test status across all environments</p>
        </div>

        {/* Filter dropdown */}
        <select
          value={filter}
          onChange={e => setFilter(e.target.value as FilterOption)}
          className="bg-bg-card border border-border text-text-primary text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-accent-cyan/50 cursor-pointer"
        >
          <option value="all">All Environments</option>
          <option value="dev">Dev</option>
          <option value="staging">Staging</option>
          <option value="production">Production</option>
        </select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <KpiCard
          label="Total Tests"
          value={filter === 'all' ? overall.total : (byEnv.find(e => e.environment === filter)?.total ?? 0)}
          icon={<TrendingUp size={14} />}
          accent="text-accent-cyan"
        />
        <KpiCard
          label="Passed"
          value={filter === 'all' ? overall.passed : (byEnv.find(e => e.environment === filter)?.passed ?? 0)}
          icon={<CheckCircle2 size={14} />}
          accent="text-accent-green"
        />
        <KpiCard
          label="Failed"
          value={filter === 'all' ? overall.failed : (byEnv.find(e => e.environment === filter)?.failed ?? 0)}
          icon={<XCircle size={14} />}
          accent="text-accent-red"
        />
        <KpiCard
          label="Pass Rate"
          value={`${filter === 'all' ? passRate : (() => {
            const env = byEnv.find(e => e.environment === filter);
            return env && env.total > 0 ? Math.round((env.passed / env.total) * 100) : 0;
          })()}%`}
          icon={<Circle size={14} />}
          accent="text-accent-purple"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Pie Chart */}
        <div className="bg-bg-card border border-border rounded-xl p-5">
          <h2 className="text-sm font-semibold text-text-primary mb-1">Pass / Fail Distribution</h2>
          <p className="text-xs text-text-muted mb-4">
            {filter === 'all' ? 'Across all environments' : `${ENV_LABELS[filter]} environment`}
          </p>
          {pieData.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-text-muted text-sm">No data</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0} 
                  isAnimationActive={true}
                  animationDuration={800}
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={customTooltipStyle} />
                <Legend
                  formatter={(value) => <span className="text-xs text-text-secondary">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Bar Chart */}
        <div className="bg-bg-card border border-border rounded-xl p-5">
          <h2 className="text-sm font-semibold text-text-primary mb-1">Environment Comparison</h2>
          <p className="text-xs text-text-muted mb-4">
            {filter === 'all' ? 'Test counts per environment' : `${ENV_LABELS[filter]} breakdown`}
          </p>
          {barData.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-text-muted text-sm">No data</div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData} barSize={18}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e1e2e" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9090a8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9090a8' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={customTooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                <Legend formatter={(value) => <span className="text-xs text-text-secondary">{value}</span>} />
                <Bar dataKey="Passed" fill={STATUS_COLORS.passed} radius={[3, 3, 0, 0]} />
                <Bar dataKey="Failed" fill={STATUS_COLORS.failed} radius={[3, 3, 0, 0]} />
                <Bar dataKey="Not Tested" fill={STATUS_COLORS.not_tested} radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-text-primary">Recent Activity</h2>
          <p className="text-xs text-text-muted mt-0.5">Last updated test cases</p>
        </div>
        {filteredRecent.length === 0 ? (
          <div className="py-10 text-center text-sm text-text-muted">No recent activity</div>
        ) : (
          <div>
            {filteredRecent.map(item => {
              const statusColors: Record<string, string> = {
                passed: 'text-accent-green',
                failed: 'text-accent-red',
                not_tested: 'text-text-secondary',
              };
              return (
                <div key={item.id} className="flex items-center gap-4 px-5 py-3 border-b border-border/50 hover:bg-bg-hover/30 transition-colors">
                  <div
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: ENV_COLORS[item.environment] || '#ffffff' }}
                  />
                  <p className="flex-1 text-sm text-text-primary truncate">{item.name}</p>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-bg-hover text-text-muted">
                    {ENV_LABELS[item.environment]}
                  </span>
                  <span className={`text-xs font-medium ${statusColors[item.status] || ''}`}>
                    {item.status === 'not_tested' ? 'Not Tested' : item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </span>
                  <span className="text-xs text-text-muted font-mono">
                    {new Date(item.updated_at + 'Z').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function KpiCard({ label, value, icon, accent }: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  accent: string;
}) {
  return (
    <div className="bg-bg-card border border-border rounded-xl p-4">
      <div className={`flex items-center gap-1.5 mb-2 ${accent}`}>
        {icon}
        <span className="text-xs font-medium text-text-muted">{label}</span>
      </div>
      <p className="text-2xl font-semibold text-text-primary tracking-tight">{value}</p>
    </div>
  );
}
