import {
  ArrowLeft,
  Check,
  Clock,
  Dumbbell,
  Play,
  Target,
  Repeat,
  Timer,
  AlertTriangle,
  Lightbulb,
  ListChecks,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { getExerciseById } from '@/data/exercises';
import { difficultyBadgeClasses, equipmentLabel, formatEquipmentRequired } from '@/data/labels';

export function ExerciseDetailPage() {
  const { selectedExerciseId, closeExerciseDetail, plan } = useApp();

  const exercise = selectedExerciseId ? getExerciseById(selectedExerciseId) : undefined;

  if (!exercise) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <p className="text-zinc-400">Exercise not found.</p>
        <div className="mt-4">
          <Button variant="ghost" onClick={closeExerciseDetail} icon={<ArrowLeft className="h-4 w-4" />} iconPosition="left">
            Go back
          </Button>
        </div>
      </div>
    );
  }

  // Find the workout exercise (sets/reps/rest) from the plan if accessed via plan
  const workoutExercise = plan?.days
    .flatMap((d) => d.exercises.map((we) => ({ we, dayNumber: d.dayNumber })))
    .find((item) => item.we.exerciseId === exercise.id);

  const stats = [
    { icon: Target, label: 'Target', value: exercise.targetMuscle },
    { icon: Dumbbell, label: 'Equipment', value: formatEquipmentRequired(exercise.equipmentRequired) },
    {
      icon: Repeat,
      label: 'Sets',
      value: workoutExercise ? `${workoutExercise.we.sets} sets` : '3-4 sets',
    },
    {
      icon: Repeat,
      label: 'Reps',
      value: workoutExercise ? workoutExercise.we.reps : '8-12',
    },
    {
      icon: Timer,
      label: 'Rest',
      value: workoutExercise ? workoutExercise.we.rest : '60-90 sec',
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:py-10 pb-28 animate-fade-in">
      {/* Back button */}
      <button
        onClick={closeExerciseDetail}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-400 hover:text-lime-300 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      {/* Title */}
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-zinc-50 sm:text-3xl">{exercise.name}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-zinc-800 px-2.5 py-1 text-xs font-semibold text-zinc-300">
              {exercise.category}
            </span>
            <span
              className={`rounded-md border px-2.5 py-1 text-xs font-bold uppercase ${difficultyBadgeClasses[exercise.difficulty]}`}
            >
              {exercise.difficulty}
            </span>
          </div>
        </div>
      </div>

      {/* Video placeholder */}
      <div className="mt-6 aspect-video w-full overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950">
        <div className="flex h-full flex-col items-center justify-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-lime-400/10 text-lime-400 ring-1 ring-lime-400/20">
            <Play className="h-7 w-7" fill="currentColor" />
          </div>
          <p className="text-sm font-medium text-zinc-500">Video guide coming soon</p>
        </div>
      </div>

      {/* Quick stats */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3">
              <Icon className="h-4 w-4 text-lime-400" />
              <p className="mt-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-600">{stat.label}</p>
              <p className="mt-0.5 text-sm font-bold text-zinc-200">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* How to perform */}
      <section className="mt-8">
        <h2 className="flex items-center gap-2 text-lg font-bold text-zinc-50">
          <ListChecks className="h-5 w-5 text-lime-400" /> How To Perform
        </h2>
        <ol className="mt-4 space-y-3">
          {exercise.instructions.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-lime-400/10 text-xs font-bold text-lime-400">
                {i + 1}
              </span>
              <p className="pt-0.5 text-sm text-zinc-300 leading-relaxed">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Form tips */}
      <section className="mt-8">
        <h2 className="flex items-center gap-2 text-lg font-bold text-zinc-50">
          <Lightbulb className="h-5 w-5 text-lime-400" /> Proper Form Tips
        </h2>
        <ul className="mt-4 space-y-2.5">
          {exercise.formTips.map((tip, i) => (
            <li key={i} className="flex gap-3 rounded-xl border border-zinc-800 bg-zinc-900/30 p-3">
              <Check className="h-4 w-4 shrink-0 text-lime-400 mt-0.5" strokeWidth={2.5} />
              <p className="text-sm text-zinc-300 leading-relaxed">{tip}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Common mistakes */}
      <section className="mt-8">
        <h2 className="flex items-center gap-2 text-lg font-bold text-zinc-50">
          <AlertTriangle className="h-5 w-5 text-amber-400" /> Common Mistakes
        </h2>
        <ul className="mt-4 space-y-2.5">
          {exercise.commonMistakes.map((mistake, i) => (
            <li key={i} className="flex gap-3 rounded-xl border border-amber-400/10 bg-amber-400/5 p-3">
              <span className="text-amber-400 mt-0.5">✕</span>
              <p className="text-sm text-zinc-300 leading-relaxed">{mistake}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Mark as completed */}
      {workoutExercise && (
        <div className="mt-8">
          <Button
            size="lg"
            variant="primary"
            className="w-full"
            icon={<Check className="h-5 w-5" strokeWidth={3} />}
          >
            Mark as Completed
          </Button>
        </div>
      )}
    </div>
  );
}
