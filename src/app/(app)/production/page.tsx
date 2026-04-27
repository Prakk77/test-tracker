import EnvironmentPage from '@/components/EnvironmentPage';
import { Rocket } from 'lucide-react';

export const metadata = { title: 'Production Environment — TestTracker' };

export default function ProductionPage() {
  return (
    <EnvironmentPage
      environment="production"
      title="Production Environment"
      accentColor="text-accent-green"
      icon={<Rocket size={16} className="text-accent-green" />}
    />
  );
}
