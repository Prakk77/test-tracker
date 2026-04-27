import EnvironmentPage from '@/components/EnvironmentPage';
import { FlaskConical } from 'lucide-react';

export const metadata = { title: 'Dev Environment — TestTracker' };

export default function DevPage() {
  return (
    <EnvironmentPage
      environment="dev"
      title="Dev Environment"
      accentColor="text-accent-cyan"
      icon={<FlaskConical size={16} className="text-accent-cyan" />}
    />
  );
}
