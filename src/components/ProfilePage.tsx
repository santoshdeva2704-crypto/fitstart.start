import { Dumbbell, RotateCcw, Target, Calendar, Settings, Info } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { experienceLabel, goalLabel, equipmentLabel } from '@/data/labels';

export function ProfilePage() {
  const { selections, plan, retakeOnboarding, startOnboarding, stats } = useApp();

  const hasPlan = !!plan;

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:py-10 pb-28 animate-fade-in">
      {/* Avatar header */}
      <div className="flex flex-col items-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-lime-400 text-zinc-950">
          <Dumbbell className="h-10 w-10" strokeWidth={2.5} />
        </div>
        <h1 className="mt-4 text-xl font-extrabold text-zinc-50">FitStart Athlete</h1>
        <p className="mt-1 text-sm text-zinc-500">
          {hasPlan
            ? `${experienceLabel[plan!.experience]} · ${goalLabel[plan!.goal]}`
            : 'No plan set up yet'}
        </p>
      </div>

      {/* Quick stats */}
      <div className="mt-8 grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 text-center">
          <p className="text-xl font-extrabold text-lime-400">{stats.totalWorkouts}</p>
          <p className="mt-0.5 text-[10px] text-zinc-500">Workouts</p>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 text-center">
          <p className="text-xl font-extrabold text-orange-400">{stats.currentStreak}</p>
          <p className="mt-0.5 text-[10px] text-zinc-500">Streak</p>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 text-center">
          <p className="text-xl font-extrabold text-sky-400">{stats.totalMinutes}</p>
          <p className="mt-0.5 text-[10px] text-zinc-500">Minutes</p>
        </div>
      </div>

      {/* Plan details */}
      {hasPlan ? (
        <div className="mt-8">
          <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-zinc-500">
            <Settings className="h-4 w-4" /> My Plan
          </h2>
          <div className="mt-4 space-y-3">
            <ProfileRow icon={Target} label="Experience" value={experienceLabel[plan!.experience]} />
            <ProfileRow icon={Target} label="Goal" value={goalLabel[plan!.goal]} />
            <ProfileRow icon={Calendar} label="Training Days" value={`${plan!.trainingDays} days/week`} />
            <ProfileRow icon={Dumbbell} label="Equipment" value={equipmentLabel[plan!.equipment]} />
          </div>
          <div className="mt-6">
            <Button variant="secondary" className="w-full" onClick={retakeOnboarding} icon={<RotateCcw className="h-4 w-4" />} iconPosition="left">
              Retake Onboarding
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/20 p-6 text-center">
          <Info className="mx-auto h-8 w-8 text-zinc-600" />
          <p className="mt-3 text-sm text-zinc-400">You haven't set up a workout plan yet.</p>
          <div className="mt-4">
            <Button onClick={startOnboarding}>Start Setup</Button>
          </div>
        </div>
      )}

      {/* About */}
      <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
        <h3 className="text-sm font-bold text-zinc-300">About FitStart</h3>
        <p className="mt-2 text-xs text-zinc-500 leading-relaxed">
          FitStart creates personalized workout plans based on your experience level, goals, schedule and equipment.
          Your progress is saved locally on your device.
        </p>
      </div>
    </div>
  );
}

function ProfileRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Target;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-zinc-800/60 bg-zinc-900/30 p-4">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-800 text-zinc-400">
          <Icon className="h-4 w-4" />
        </div>
        <span className="text-sm font-medium text-zinc-400">{label}</span>
      </div>
      <span className="text-sm font-bold text-lime-300">{value}</span>
    </div>
  );
}
