import { Check, Clock, Dumbbell, RotateCcw, ChevronRight, Bed, Play, Flame, TrendingUp, Calendar, History } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { getExerciseById } from '@/data/exercises';
import { experienceLabel, goalLabel, equipmentLabel, difficultyBadgeClasses, formatEquipmentRequired } from '@/data/labels';
import { WorkoutDay } from '@/types';
import { MINUTES_PER_EXERCISE } from '@/data/progress';

function estimateDuration(exerciseCount: number): number {
  return Math.max(10, exerciseCount * MINUTES_PER_EXERCISE);
}

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

export function PlanPage() {
  const { plan, retakeOnboarding, openExercise, startWorkout, stats, history } = useApp();

  if (!plan) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center animate-fade-in">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-800 text-zinc-500">
          <Dumbbell className="h-8 w-8" />
        </div>
        <h2 className="mt-6 text-2xl font-extrabold text-zinc-50">No workout plan yet</h2>
        <p className="mt-2 text-sm text-zinc-400">Complete the quick setup to get your personalized plan.</p>
        <div className="mt-6">
          <Button size="lg" onClick={retakeOnboarding} icon={<ChevronRight className="h-5 w-5" />}>
            Start Setup
          </Button>
        </div>
      </div>
    );
  }

  const trainingDayCount = plan.days.filter((d) => !d.isRest).length;

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:py-10 pb-28 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-50 sm:text-3xl">Your Weekly Plan</h1>
          <div className="mt-2 space-y-1">
            <p className="text-sm text-zinc-400">
              <span className="text-zinc-500">Goal:</span> {goalLabel[plan.goal]}
            </p>
            <p className="text-sm text-zinc-400">
              <span className="text-zinc-500">Level:</span> {experienceLabel[plan.experience]}
            </p>
            <p className="text-sm text-zinc-400">
              <span className="text-zinc-500">Days:</span> {plan.trainingDays}
            </p>
            <p className="text-sm text-zinc-400">
              <span className="text-zinc-500">Equipment:</span> {equipmentLabel[plan.equipment]}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="md" onClick={retakeOnboarding} icon={<RotateCcw className="h-4 w-4" />} iconPosition="left">
          Retake
        </Button>
      </div>

      {/* Equipment badge */}
      <div className="mt-4">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${
            plan.equipment === 'bodyweight'
              ? 'border-lime-400/30 bg-lime-400/10 text-lime-300'
              : plan.equipment === 'dumbbells'
              ? 'border-sky-400/30 bg-sky-400/10 text-sky-300'
              : plan.equipment === 'barbell'
              ? 'border-orange-400/30 bg-orange-400/10 text-orange-300'
              : plan.equipment === 'cable'
              ? 'border-violet-400/30 bg-violet-400/10 text-violet-300'
              : plan.equipment === 'machines'
              ? 'border-teal-400/30 bg-teal-400/10 text-teal-300'
              : 'border-amber-400/30 bg-amber-400/10 text-amber-300'
          }`}
        >
          <Dumbbell className="h-3.5 w-3.5" />
          Equipment: {equipmentLabel[plan.equipment]}{plan.equipment === 'bodyweight' ? ' Only' : ''}
        </span>
      </div>

      {/* Progress card */}
      <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
        <h2 className="text-sm font-bold uppercase tracking-wider text-zinc-500">Your Progress</h2>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-400/10 text-lime-400">
              <Dumbbell className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xl font-extrabold text-zinc-50">{stats.totalWorkouts}</p>
              <p className="text-xs text-zinc-500">Workouts</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-400/10 text-orange-400">
              <Flame className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xl font-extrabold text-zinc-50">{stats.currentStreak}</p>
              <p className="text-xs text-zinc-500">{stats.currentStreak === 1 ? 'Day' : 'Days'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-400/10 text-sky-400">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xl font-extrabold text-zinc-50">{stats.totalSets}</p>
              <p className="text-xs text-zinc-500">Sets</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-400/10 text-violet-400">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xl font-extrabold text-zinc-50">{formatTotalTime(stats.totalMinutes)}</p>
              <p className="text-xs text-zinc-500">Time</p>
            </div>
          </div>
        </div>
      </div>

      {/* Day cards */}
      <div className="mt-8 space-y-4">
        {plan.days.map((day) => (
          <DayCard
            key={day.dayNumber}
            day={day}
            onOpenExercise={(id) => openExercise(id, 'plan')}
            onStartWorkout={() => startWorkout(day)}
          />
        ))}
      </div>

      {/* Workout history */}
      {history.length > 0 && (
        <div className="mt-8">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-zinc-500" />
            <h2 className="text-base font-bold text-zinc-50">Workout History</h2>
          </div>
          <div className="mt-4 space-y-3">
            {[...history].reverse().map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/30 p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-800 text-zinc-400">
                    <Calendar className="h-5 w-5" />
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
    </div>
  );
}

interface DayCardProps {
  day: WorkoutDay;
  onOpenExercise: (exerciseId: string) => void;
  onStartWorkout: () => void;
}

function DayCard({ day, onOpenExercise, onStartWorkout }: DayCardProps) {
  if (day.isRest) {
    return (
      <div className="flex items-center gap-4 rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/20 p-5">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-800/60 text-zinc-500">
          <Bed className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-zinc-600">Day {day.dayNumber}</p>
          <h3 className="text-base font-bold text-zinc-400">Rest Day</h3>
        </div>
      </div>
    );
  }

  const duration = estimateDuration(day.exercises.length);

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40">
      <div className="flex items-center justify-between border-b border-zinc-800/60 p-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-lime-400/10 text-lime-400">
            <Dumbbell className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Day {day.dayNumber}</p>
            <h3 className="text-base font-bold text-zinc-50">{day.title}</h3>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-zinc-500">{day.exercises.length} exercises</p>
          <p className="flex items-center justify-end gap-1 text-xs text-zinc-500">
            <Clock className="h-3 w-3" /> ~{duration} min
          </p>
        </div>
      </div>

      {/* Exercise list */}
      <div className="divide-y divide-zinc-800/40">
        {day.exercises.map((we) => {
          const exercise = getExerciseById(we.exerciseId);
          if (!exercise) return null;
          return (
            <button
              key={we.exerciseId}
              onClick={() => onOpenExercise(we.exerciseId)}
              className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-zinc-800/30"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-zinc-100">{exercise.name}</p>
                <p className="text-xs text-zinc-500">
                  {exercise.targetMuscle} · {formatEquipmentRequired(exercise.equipmentRequired)}
                </p>
              </div>
              <div className="hidden shrink-0 items-center gap-2 sm:flex">
                <span className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase ${difficultyBadgeClasses[exercise.difficulty]}`}>
                  {exercise.difficulty}
                </span>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-xs font-bold text-zinc-300">
                  {we.sets} × {we.reps}
                </p>
                <p className="flex items-center justify-end gap-1 text-[10px] text-zinc-500">
                  <Clock className="h-3 w-3" /> {we.rest}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-zinc-600" />
            </button>
          );
        })}
      </div>

      {/* Start workout button */}
      <div className="border-t border-zinc-800/60 p-4">
        <Button className="w-full" onClick={onStartWorkout} icon={<Play className="h-4 w-4" fill="currentColor" />} iconPosition="left">
          Start Workout
        </Button>
      </div>
    </div>
  );
}
