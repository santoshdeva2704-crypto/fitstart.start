import { AppProvider, useApp } from '@/context/AppContext';
import { TopNav, BottomNav } from '@/components/Navigation';
import { HomePage } from '@/components/HomePage';
import { OnboardingPage } from '@/components/OnboardingPage';
import { PlanPage } from '@/components/PlanPage';
import { LibraryPage } from '@/components/LibraryPage';
import { ExerciseDetailPage } from '@/components/ExerciseDetailPage';
import { ProgressPage } from '@/components/ProgressPage';
import { ProfilePage } from '@/components/ProfilePage';
import { WorkoutMode } from '@/components/WorkoutMode';
import { Footer } from '@/components/Footer';

function AppContent() {
  const { view } = useApp();

  const showNav = view !== 'onboarding' && view !== 'workout-mode';

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {showNav && <TopNav />}
      <main className={showNav ? 'pb-20 lg:pb-0' : ''}>
        {view === 'home' && <HomePage />}
        {view === 'onboarding' && <OnboardingPage />}
        {view === 'plan' && <PlanPage />}
        {view === 'library' && <LibraryPage />}
        {view === 'exercise-detail' && <ExerciseDetailPage />}
        {view === 'progress' && <ProgressPage />}
        {view === 'profile' && <ProfilePage />}
        {view === 'workout-mode' && <WorkoutMode />}
      </main>
      {showNav && <Footer />}
      {showNav && <BottomNav />}
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
