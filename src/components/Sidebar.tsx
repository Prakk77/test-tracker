'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FlaskConical, Layers, Rocket, Activity } from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dev', label: 'Dev', icon: FlaskConical, color: 'text-accent-cyan' },
  { href: '/staging', label: 'Staging', icon: Layers, color: 'text-accent-purple' },
  { href: '/production', label: 'Production', icon: Rocket, color: 'text-accent-green' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 bg-bg-secondary border-r border-border flex flex-col shrink-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center">
            <Activity size={14} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-text-primary tracking-tight">TestTracker</p>
            <p className="text-[10px] text-text-muted font-mono uppercase tracking-widest">v1.0.0</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-text-muted px-2 mb-2">Navigation</p>
        <ul className="space-y-0.5">
          {navItems.map(({ href, label, icon: Icon, color }) => {
            const active = pathname === href;
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={clsx(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150',
                    active
                      ? 'bg-bg-hover text-text-primary'
                      : 'text-text-secondary hover:text-text-primary hover:bg-bg-tertiary'
                  )}
                >
                  <Icon
                    size={16}
                    className={clsx(active ? (color || 'text-accent-cyan') : 'text-text-muted', 'transition-colors')}
                  />
                  <span className={clsx('font-medium', active && 'text-text-primary')}>{label}</span>
                  {active && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-accent-cyan" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-border">
        <p className="text-[10px] text-text-muted font-mono">
          Supabase · Next.js 14
        </p>
      </div>
    </aside>
  );
}
