import { Dumbbell, Flame, Clock, Trophy, TrendingUp, Target, Calendar, History } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { samplePersonalRecords } from '@/data/progress';
import { Button } from '@/components/ui/Button';

function formatTotalTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function ProgressPage() {
  const { stats, history, plan, startOnboarding, goToPlan } = useApp();

  const statCards = [
    {
      icon: Dumbbell,
      label: 'Workouts Completed',
      value: stats.totalWorkouts,
      accent: 'text-lime-400',
      bg: 'bg-lime-400/10',
    },
    {
      icon: Flame,
      label: 'Current Streak',
      value: stats.currentStreak,
      suffix: stats.currentStreak === 1 ? 'day' : 'days',
      accent: 'text-orange-400',
      bg: 'bg-orange-400/10',
    },
    {
      icon: TrendingUp,
      label: 'Total Sets',
      value: stats.totalSets,
      accent: 'text-sky-400',
      bg: 'bg-sky-400/10',
    },
    {
      icon: Clock,
      label: 'Total Workout Time',
      value: formatTotalTime(stats.totalMinutes),
      accent: 'text-violet-400',
      bg: 'bg-violet-400/10',
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-10 pb-28 animate-fade-in">
      <h1 className="text-2xl font-extrabold text-zinc-50 sm:text-3xl">Your Progress</h1>
      <p className="mt-1 text-sm text-zinc-400">Track your workouts, streaks and personal records.</p>

      {/* Stat cards */}
      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 animate-fade-in-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.bg} ${stat.accent}`}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="mt-3 text-2xl font-extrabold text-zinc-50">
                {stat.value}
                {stat.suffix && <span className="ml-1 text-sm font-medium text-zinc-500">{stat.suffix}</span>}
              </p>
              <p className="mt-0.5 text-xs text-zinc-500">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Last workout date */}
      {stats.lastWorkoutDate && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-zinc-800/60 bg-zinc-900/30 p-4">
          <Calendar className="h-4 w-4 text-zinc-500" />
          <p className="text-sm text-zinc-400">
            Last workout: <span className="font-bold text-zinc-200">{formatDate(stats.lastWorkoutDate)}</span>
          </p>
        </div>
      )}

      {/* Workout history */}
      {history.length > 0 && (
        <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-zinc-500" />
            <h2 className="text-base font-bold text-zinc-50">Workout History</h2>
          </div>
          <div className="mt-4 space-y-3">
            {[...history].reverse().map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between rounded-xl border border-zinc-800/60 bg-zinc-900/30 p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-800 text-zinc-400">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-zinc-100">{entry.dayTitle}</p>
                    <p className="text-xs text-zinc-500">{formatDate(entry.date)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-zinc-300">{entry.durationMinutes} min</p>
                  <p className="text-xs text-zinc-500">
                    {entry.exercisesCompleted} exercises · {entry.setsCompleted} sets
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {history.length === 0 && (
        <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-800 text-zinc-500">
            <History className="h-6 w-6" />
          </div>
          <p className="mt-4 text-sm text-zinc-400">No workouts completed yet.</p>
          <p className="mt-1 text-xs text-zinc-500">Start a workout from your plan to begin tracking progress.</p>
          {plan ? (
            <div className="mt-4">
              <Button size="md" onClick={goToPlan}>
                Go to my plan
              </Button>
            </div>
          ) : (
            <div className="mt-4">
              <Button size="md" onClick={startOnboarding}>
                Create a plan
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Personal records */}
      <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-400" />
          <h2 className="text-base font-bold text-zinc-50">Personal Records</h2>
        </div>
        <div className="mt-4 space-y-3">
          {samplePersonalRecords.map((pr) => (
            <div
              key={pr.exerciseName}
              className="flex items-center justify-between rounded-xl border border-zinc-800/60 bg-zinc-900/30 p-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-400/10 text-amber-400">
                  <Target className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-bold text-zinc-100">{pr.exerciseName}</p>
                  <p className="text-xs text-zinc-500">{pr.date}</p>
                </div>
              </div>
              <span className="text-sm font-extrabold text-amber-400">{pr.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      {plan && (
        <div className="mt-6 text-center">
          <Button variant="ghost" onClick={goToPlan} icon={<TrendingUp className="h-4 w-4" />} iconPosition="left">
            Go to my workout plan
          </Button>
        </div>
      )}
    </div>
  );
}
