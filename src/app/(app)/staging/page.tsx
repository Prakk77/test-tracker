import EnvironmentPage from '@/components/EnvironmentPage';
import { Layers } from 'lucide-react';

export const metadata = { title: 'Staging Environment — TestTracker' };

export default function StagingPage() {
  return (
    <EnvironmentPage
      environment="staging"
      title="Staging Environment"
      accentColor="text-accent-purple"
      icon={<Layers size={16} className="text-accent-purple" />}
    />
  );
}
