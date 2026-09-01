import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Dumbbell,
  SkipForward,
  Timer,
  Trophy,
  X,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { getExerciseById } from '@/data/exercises';
import { formatEquipmentRequired } from '@/data/labels';

function formatTime(ms: number): string {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function WorkoutMode() {
  const { session, plan, completeSet, skipExercise, skipRest, prevExercise, nextExercise: goNextExercise, finishWorkout, exitWorkout } = useApp();
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(interval);
  }, []);

  if (!session || !plan) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <p className="text-zinc-400">No active workout session.</p>
        <div className="mt-4">
          <Button variant="ghost" onClick={exitWorkout} icon={<ArrowLeft className="h-4 w-4" />} iconPosition="left">
            Back to plan
          </Button>
        </div>
      </div>
    );
  }

  const day = plan.days.find((d) => d.dayNumber === session.dayNumber);
  if (!day) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <p className="text-zinc-400">Workout day not found.</p>
        <div className="mt-4">
          <Button variant="ghost" onClick={exitWorkout} icon={<ArrowLeft className="h-4 w-4" />} iconPosition="left">
            Back to plan
          </Button>
        </div>
      </div>
    );
  }

  const allComplete = session.sets.every((sp) => sp.completedSets >= sp.totalSets);

  if (allComplete) {
    const setsCompleted = session.sets.reduce((sum, sp) => sum + sp.completedSets, 0);
    const exercisesCompleted = session.sets.length;
    const durationMs = Date.now() - session.startedAt;
    const durationMin = Math.max(1, Math.round(durationMs / 60000));

    return (
      <div className="mx-auto max-w-2xl px-4 py-10 pb-28 animate-fade-in">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-lime-400/10 text-lime-400 ring-1 ring-lime-400/30">
            <Trophy className="h-10 w-10" />
          </div>
          <h1 className="mt-6 text-3xl font-extrabold text-zinc-50">Workout Complete</h1>
          <p className="mt-2 text-sm text-zinc-400">Great work finishing {session.dayTitle}.</p>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 text-center">
            <p className="text-2xl font-extrabold text-lime-400">{exercisesCompleted}</p>
            <p className="mt-1 text-xs text-zinc-500">Exercises</p>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 text-center">
            <p className="text-2xl font-extrabold text-lime-400">{setsCompleted}</p>
            <p className="mt-1 text-xs text-zinc-500">Sets</p>
          </div>
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 text-center">
            <p className="text-2xl font-extrabold text-lime-400">{durationMin}</p>
            <p className="mt-1 text-xs text-zinc-500">Minutes</p>
          </div>
        </div>

        <div className="mt-8 space-y-3">
          <Button size="lg" className="w-full" onClick={finishWorkout} icon={<Check className="h-5 w-5" strokeWidth={3} />}>
            Finish Workout
          </Button>
          <Button variant="ghost" className="w-full" onClick={exitWorkout} icon={<X className="h-4 w-4" />} iconPosition="left">
            Discard
          </Button>
        </div>
      </div>
    );
  }

  const currentExercise = day.exercises[session.exerciseIndex];
  const exercise = currentExercise ? getExerciseById(currentExercise.exerciseId) : null;
  const setProgress = session.sets[session.exerciseIndex];
  const nextExerciseData = day.exercises[session.exerciseIndex + 1];
  const upcomingExercise = nextExerciseData ? getExerciseById(nextExerciseData.exerciseId) : null;

  const restMs = session.restEndsAt ? session.restEndsAt - now : 0;
  const isResting = session.isResting && restMs > 0;

  const overallProgress = session.sets.reduce((sum, sp) => sum + sp.completedSets, 0);
  const overallTotal = session.sets.reduce((sum, sp) => sum + sp.totalSets, 0);
  const progressPercent = overallTotal > 0 ? Math.round((overallProgress / overallTotal) * 100) : 0;

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 pb-28 animate-fade-in">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={exitWorkout}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-400 hover:text-lime-300 transition-colors"
        >
          <X className="h-4 w-4" /> Exit
        </button>
        <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">{session.dayTitle}</p>
      </div>

      {/* Progress bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-zinc-500">
          <span>{overallProgress} / {overallTotal} sets</span>
          <span>{progressPercent}%</span>
        </div>
        <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-zinc-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-lime-500 to-lime-300 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Rest timer overlay */}
      {isResting ? (
        <div className="mt-8 flex flex-col items-center rounded-2xl border border-sky-400/20 bg-sky-400/5 p-8 animate-fade-in">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sky-400/10 text-sky-400">
            <Timer className="h-8 w-8" />
          </div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-sky-400">Rest Timer</p>
          <p className="mt-2 text-5xl font-extrabold tabular-nums text-zinc-50">{formatTime(restMs)}</p>
          <Button variant="ghost" className="mt-6" onClick={skipRest} icon={<SkipForward className="h-4 w-4" />} iconPosition="left">
            Skip Rest
          </Button>
        </div>
      ) : exercise && setProgress ? (
        <div className="mt-6 animate-fade-in">
          {/* Exercise header */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Exercise {session.exerciseIndex + 1} of {day.exercises.length}
              </p>
              <h1 className="mt-1 text-2xl font-extrabold text-zinc-50">{exercise.name}</h1>
              <p className="mt-1 text-sm text-zinc-400">{exercise.targetMuscle}</p>
            </div>
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-lime-400/10 text-lime-400">
              <Dumbbell className="h-6 w-6" />
            </div>
          </div>

          {/* Set info */}
          <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Current Set</p>
                <p className="mt-1 text-3xl font-extrabold text-zinc-50">
                  {Math.min(setProgress.completedSets + 1, setProgress.totalSets)}
                  <span className="text-lg text-zinc-500"> / {setProgress.totalSets}</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Reps</p>
                <p className="mt-1 text-3xl font-extrabold text-lime-400">{currentExercise.reps}</p>
              </div>
            </div>

            {/* Set dots */}
            <div className="mt-5 flex gap-2">
              {Array.from({ length: setProgress.totalSets }).map((_, i) => (
                <div
                  key={i}
                  className={`h-2.5 flex-1 rounded-full transition-colors ${
                    i < setProgress.completedSets ? 'bg-lime-400' : 'bg-zinc-700'
                  }`}
                />
              ))}
            </div>

            <div className="mt-5 flex items-center gap-4 text-xs text-zinc-500">
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" /> Rest: {currentExercise.rest}
              </span>
              <span className="flex items-center gap-1.5">
                <Dumbbell className="h-3.5 w-3.5" /> {formatEquipmentRequired(exercise.equipmentRequired)}
              </span>
            </div>
          </div>

          {/* Instruction */}
          <div className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-900/30 p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Instruction</p>
            <p className="mt-2 text-sm leading-relaxed text-zinc-300">{exercise.instructions[0]}</p>
          </div>

          {/* Complete set button */}
          <div className="mt-6">
            <Button size="lg" className="w-full" onClick={completeSet} icon={<Check className="h-5 w-5" strokeWidth={3} />}>
              Complete Set
            </Button>
          </div>

          {/* Navigation */}
          <div className="mt-4 flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={prevExercise}
              disabled={session.exerciseIndex === 0}
              icon={<ChevronLeft className="h-4 w-4" />}
              iconPosition="left"
            >
              Prev
            </Button>
            <Button
              variant="ghost"
              onClick={skipExercise}
              icon={<SkipForward className="h-4 w-4" />}
              iconPosition="left"
            >
              Skip Exercise
            </Button>
            <Button
              variant="ghost"
              onClick={goNextExercise}
              disabled={session.exerciseIndex >= day.exercises.length - 1}
              icon={<ChevronRight className="h-4 w-4" />}
            >
              Next
            </Button>
          </div>

          {/* Next exercise preview */}
          {upcomingExercise && (
            <div className="mt-6 rounded-xl border border-zinc-800/60 bg-zinc-900/20 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-600">Up Next</p>
              <p className="mt-1 text-sm font-bold text-zinc-300">{upcomingExercise.name}</p>
              <p className="text-xs text-zinc-500">{upcomingExercise.targetMuscle}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-8 text-center text-zinc-400">Loading exercise...</div>
      )}
    </div>
  );
}
