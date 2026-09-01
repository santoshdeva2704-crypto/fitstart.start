import { useMemo, useState } from 'react';
import { ChevronRight, Dumbbell } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { exercises, muscleCategories } from '@/data/exercises';
import { difficultyBadgeClasses, formatEquipmentRequired } from '@/data/labels';
import { MuscleCategory } from '@/types';

export function LibraryPage() {
  const { openExercise } = useApp();
  const [activeCategory, setActiveCategory] = useState<MuscleCategory | 'All'>('All');

  const filtered = useMemo(() => {
    if (activeCategory === 'All') return exercises;
    return exercises.filter((e) => e.category === activeCategory);
  }, [activeCategory]);

  const categories: (MuscleCategory | 'All')[] = ['All', ...muscleCategories];

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:py-10 pb-28 animate-fade-in">
      <h1 className="text-2xl font-extrabold text-zinc-50 sm:text-3xl">Exercise Library</h1>
      <p className="mt-1 text-sm text-zinc-400">Browse exercises by muscle group and learn proper form.</p>

      {/* Category filter */}
      <div className="mt-6 flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              activeCategory === cat
                ? 'bg-lime-400 text-zinc-950'
                : 'bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Exercise grid */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((exercise, i) => (
          <button
            key={exercise.id}
            onClick={() => openExercise(exercise.id, 'library')}
            className="group flex flex-col rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 text-left transition-all hover:border-lime-400/40 hover:bg-zinc-900/70 animate-fade-in-up"
            style={{ animationDelay: `${Math.min(i * 50, 400)}ms` }}
          >
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-lime-400/10 text-lime-400">
                <Dumbbell className="h-5 w-5" />
              </div>
              <span
                className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase ${difficultyBadgeClasses[exercise.difficulty]}`}
              >
                {exercise.difficulty}
              </span>
            </div>
            <h3 className="mt-4 text-base font-bold text-zinc-50 group-hover:text-lime-300 transition-colors">
              {exercise.name}
            </h3>
            <p className="mt-1 text-xs text-zinc-500">{exercise.targetMuscle}</p>
            <div className="mt-3 flex items-center gap-2 text-xs text-zinc-400">
              <span className="rounded-md bg-zinc-800 px-2 py-0.5 capitalize">{formatEquipmentRequired(exercise.equipmentRequired)}</span>
              <ChevronRight className="h-4 w-4 text-zinc-600 group-hover:text-lime-400 transition-colors" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
