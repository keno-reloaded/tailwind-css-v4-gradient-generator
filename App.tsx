import GradientGenerator from './components/GradientGenerator';
import { Toaster } from './components/ui/sonner';
import { ThemeProvider } from './components/ThemeProvider';

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="gradient-app-theme">
      <div className="min-h-screen bg-background">
        <GradientGenerator />
        <Toaster />
      </div>
    </ThemeProvider>
  );
}
