import GradientGenerator from './components/GradientGenerator';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <GradientGenerator />
      <Toaster />
    </div>
  );
}