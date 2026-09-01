import { Home, Dumbbell, Library, TrendingUp, User } from 'lucide-react';
import { useApp } from '@/context/AppContext';

const navItems = [
  { view: 'home', label: 'Home', icon: Home, action: 'goHome' as const },
  { view: 'plan', label: 'Workouts', icon: Dumbbell, action: 'goToPlan' as const },
  { view: 'library', label: 'Exercises', icon: Library, action: 'goToLibrary' as const },
  { view: 'progress', label: 'Progress', icon: TrendingUp, action: 'goToProgress' as const },
  { view: 'profile', label: 'Profile', icon: User, action: 'goToProfile' as const },
];

export function BottomNav() {
  const { view, goHome, goToPlan, goToLibrary, goToProgress, goToProfile, plan } = useApp();
  const actions = { goHome, goToPlan, goToLibrary, goToProgress, goToProfile };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-800 bg-zinc-950/95 backdrop-blur-md lg:hidden">
      <div className="mx-auto flex max-w-md items-center justify-around px-2 py-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = view === item.view || (item.view === 'plan' && view === 'exercise-detail' && plan !== null);
          return (
            <button
              key={item.view}
              onClick={() => actions[item.action]()}
              className={`flex flex-1 flex-col items-center gap-0.5 rounded-lg py-1.5 transition-colors ${
                isActive ? 'text-lime-400' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Icon className="h-5 w-5" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-semibold">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export function TopNav() {
  const { view, goHome, goToPlan, goToLibrary, goToProgress, goToProfile, plan } = useApp();
  const actions = { goHome, goToPlan, goToLibrary, goToProgress, goToProfile };

  return (
    <header className="sticky top-0 z-40 hidden border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md lg:block">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <button onClick={goHome} className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-lime-400 text-zinc-950">
            <Dumbbell className="h-5 w-5" strokeWidth={2.5} />
          </div>
          <span className="text-lg font-extrabold tracking-tight text-zinc-50">
            Fit<span className="text-lime-400">Start</span>
          </span>
        </button>
        <nav className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive =
              view === item.view || (item.view === 'plan' && view === 'exercise-detail' && plan !== null);
            return (
              <button
                key={item.view}
                onClick={() => actions[item.action]()}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  isActive ? 'bg-lime-400/10 text-lime-300' : 'text-zinc-400 hover:text-zinc-100'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
