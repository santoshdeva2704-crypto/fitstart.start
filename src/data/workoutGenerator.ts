import { exercises } from '@/data/exercises';
import {
  Equipment,
  EquipmentType,
  ExperienceLevel,
  Goal,
  MuscleCategory,
  TrainingDays,
  WorkoutDay,
  WorkoutExercise,
  WorkoutPlan,
} from '@/types';

interface SplitDay {
  title: string;
  focus: MuscleCategory[];
}

const FULL_BODY_A: SplitDay = { title: 'Full Body A', focus: ['Legs', 'Chest', 'Back', 'Shoulders', 'Abs'] };
const FULL_BODY_B: SplitDay = { title: 'Full Body B', focus: ['Legs', 'Back', 'Chest', 'Biceps', 'Triceps'] };
const FULL_BODY_C: SplitDay = { title: 'Full Body C', focus: ['Legs', 'Shoulders', 'Back', 'Chest', 'Abs'] };
const PUSH: SplitDay = { title: 'Push', focus: ['Chest', 'Shoulders', 'Triceps'] };
const PULL: SplitDay = { title: 'Pull', focus: ['Back', 'Biceps'] };
const LEG_DAY: SplitDay = { title: 'Legs', focus: ['Legs', 'Abs'] };
const UPPER_A: SplitDay = { title: 'Upper Body A', focus: ['Chest', 'Back', 'Shoulders', 'Triceps'] };
const LOWER_A: SplitDay = { title: 'Lower Body A', focus: ['Legs', 'Abs'] };
const UPPER_B: SplitDay = { title: 'Upper Body B', focus: ['Back', 'Chest', 'Shoulders', 'Biceps'] };
const LOWER_B: SplitDay = { title: 'Lower Body B', focus: ['Legs', 'Abs'] };
const UPPER: SplitDay = { title: 'Upper Body', focus: ['Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps'] };
const LOWER: SplitDay = { title: 'Lower Body', focus: ['Legs', 'Abs'] };
const CHEST_TRI: SplitDay = { title: 'Chest & Triceps', focus: ['Chest', 'Triceps'] };
const BACK_BI: SplitDay = { title: 'Back & Biceps', focus: ['Back', 'Biceps'] };
const SHOULDERS_ABS: SplitDay = { title: 'Shoulders & Abs', focus: ['Shoulders', 'Abs'] };
const CHEST_DAY: SplitDay = { title: 'Chest', focus: ['Chest'] };
const BACK_DAY: SplitDay = { title: 'Back', focus: ['Back'] };
const SHOULDERS_DAY: SplitDay = { title: 'Shoulders', focus: ['Shoulders'] };
const ARMS: SplitDay = { title: 'Arms', focus: ['Biceps', 'Triceps'] };

function getSplitPlan(trainingDays: TrainingDays, experience: ExperienceLevel): SplitDay[] {
  switch (trainingDays) {
    case 2:
      return [FULL_BODY_A, FULL_BODY_B];
    case 3:
      if (experience === 'beginner') return [FULL_BODY_A, FULL_BODY_B, FULL_BODY_C];
      return [PUSH, PULL, LEG_DAY];
    case 4:
      if (experience === 'advanced') return [PUSH, PULL, LEG_DAY, UPPER];
      return [UPPER_A, LOWER_A, UPPER_B, LOWER_B];
    case 5:
      if (experience === 'beginner') return [CHEST_TRI, BACK_BI, LEG_DAY, SHOULDERS_ABS, FULL_BODY_A];
      if (experience === 'advanced') return [CHEST_DAY, BACK_DAY, SHOULDERS_DAY, LEG_DAY, ARMS];
      return [PUSH, PULL, LEG_DAY, UPPER, LOWER];
    case 6:
      if (experience === 'beginner') return [FULL_BODY_A, FULL_BODY_B, FULL_BODY_C, FULL_BODY_A, FULL_BODY_B, FULL_BODY_C];
      return [PUSH, PULL, LEG_DAY, PUSH, PULL, LEG_DAY];
    default:
      return [FULL_BODY_A, FULL_BODY_B];
  }
}

const SCHEDULES: Record<TrainingDays, boolean[]> = {
  2: [true, false, true, false, false, false, false],
  3: [true, false, true, false, true, false, false],
  4: [true, true, false, true, true, false, false],
  5: [true, true, true, true, true, false, false],
  6: [true, true, true, true, true, true, false],
};

const difficultyRank: Record<ExperienceLevel, number> = { beginner: 0, intermediate: 1, advanced: 2 };

const EQUIPMENT_ALLOWED_TYPES: Record<Equipment, EquipmentType[]> = {
  bodyweight: ['bodyweight'],
  dumbbells: ['dumbbell', 'bodyweight'],
  barbell: ['barbell', 'bodyweight'],
  cable: ['cable', 'bodyweight'],
  machines: ['machine', 'bodyweight'],
  'full-gym': ['barbell', 'dumbbell', 'cable', 'machine', 'bodyweight', 'bench', 'band', 'kettlebell'],
};

function isExerciseCompatible(exerciseTypes: EquipmentType[], allowedTypes: EquipmentType[]): boolean {
  return exerciseTypes.some((type) => allowedTypes.includes(type));
}

function getCategoryPool(
  category: MuscleCategory,
  equipment: Equipment,
  experience: ExperienceLevel,
  offset: number,
): string[] {
  const allowedTypes = EQUIPMENT_ALLOWED_TYPES[equipment];
  const pool = exercises.filter(
    (e) => e.category === category && isExerciseCompatible(e.equipmentRequired, allowedTypes),
  );
  if (pool.length === 0) return [];

  const filteredByLevel =
    experience === 'beginner' ? pool.filter((e) => e.difficulty !== 'advanced') : pool;
  const finalPool = filteredByLevel.length > 0 ? filteredByLevel : pool;

  const sorted = [...finalPool].sort((a, b) => {
    const rankA = Math.abs(difficultyRank[a.difficulty] - difficultyRank[experience]);
    const rankB = Math.abs(difficultyRank[b.difficulty] - difficultyRank[experience]);
    if (experience === 'advanced') return difficultyRank[b.difficulty] - difficultyRank[a.difficulty];
    return rankA - rankB;
  });

  const ids = sorted.map((e) => e.id);
  if (ids.length === 0) return ids;
  const rotation = offset % ids.length;
  return [...ids.slice(rotation), ...ids.slice(0, rotation)];
}

function buildExercisesForDay(
  focus: MuscleCategory[],
  equipment: Equipment,
  experience: ExperienceLevel,
  goal: Goal,
  targetCount: number,
  dayIndex: number,
): WorkoutExercise[] {
  const pools = new Map<MuscleCategory, string[]>();
  const pointers = new Map<MuscleCategory, number>();
  focus.forEach((category, i) => {
    pools.set(category, getCategoryPool(category, equipment, experience, dayIndex * 2 + i));
    pointers.set(category, 0);
  });

  const chosenIds: string[] = [];
  const chosenCategories: MuscleCategory[] = [];
  let round = 0;
  while (chosenIds.length < targetCount && round < 6) {
    for (const category of focus) {
      if (chosenIds.length >= targetCount) break;
      const pool = pools.get(category)!;
      let pointer = pointers.get(category)!;
      while (pointer < pool.length && chosenIds.includes(pool[pointer])) {
        pointer++;
      }
      if (pointer < pool.length) {
        chosenIds.push(pool[pointer]);
        chosenCategories.push(category);
        pointers.set(category, pointer + 1);
      }
    }
    round++;
  }

  return chosenIds.map((exerciseId, i) => {
    const scheme = getSetsRepsRest(goal, experience, chosenCategories[i]);
    return { exerciseId, sets: scheme.sets, reps: scheme.reps, rest: scheme.rest };
  });
}

interface SetsRepsRest {
  sets: number;
  reps: string;
  rest: string;
}

const GOAL_SCHEMES: Record<Goal, SetsRepsRest> = {
  muscle: { sets: 4, reps: '8-12', rest: '75-90 sec' },
  strength: { sets: 5, reps: '4-6', rest: '2-3 min' },
  'fat-loss': { sets: 3, reps: '12-15', rest: '30-45 sec' },
  general: { sets: 3, reps: '10-12', rest: '60 sec' },
};

const ISOLATION_CATEGORIES: MuscleCategory[] = ['Biceps', 'Triceps', 'Abs'];

function getSetsRepsRest(goal: Goal, experience: ExperienceLevel, category: MuscleCategory): SetsRepsRest {
  let scheme = GOAL_SCHEMES[goal];

  if (goal === 'strength' && ISOLATION_CATEGORIES.includes(category)) {
    scheme = { sets: scheme.sets - 1, reps: '8-12', rest: '60-90 sec' };
  }

  let sets = scheme.sets;
  if (experience === 'beginner') sets = Math.min(sets, 3);
  if (experience === 'advanced') sets = sets + 1;

  return { sets, reps: scheme.reps, rest: scheme.rest };
}

function validateAndReplacePlan(
  plan: WorkoutPlan,
  equipment: Equipment,
): WorkoutPlan {
  const allowedTypes = EQUIPMENT_ALLOWED_TYPES[equipment];
  const validatedDays = plan.days.map((day) => {
    if (day.isRest) return day;
    const validatedExercises: WorkoutExercise[] = day.exercises.map((we) => {
      const exercise = exercises.find((e) => e.id === we.exerciseId);
      if (exercise && isExerciseCompatible(exercise.equipmentRequired, allowedTypes)) {
        return we;
      }
      const replacement = exercises.find(
        (e) =>
          e.category === exercise?.category &&
          isExerciseCompatible(e.equipmentRequired, allowedTypes) &&
          !day.exercises.some((other) => other.exerciseId === e.id),
      );
      if (replacement) {
        return { ...we, exerciseId: replacement.id };
      }
      return we;
    });
    return { ...day, exercises: validatedExercises };
  });
  return { ...plan, days: validatedDays };
}

export function generateWorkoutPlan(
  experience: ExperienceLevel,
  goal: Goal,
  trainingDays: TrainingDays,
  equipment: Equipment,
): WorkoutPlan {
  const splitPlan = getSplitPlan(trainingDays, experience);
  const schedule = SCHEDULES[trainingDays];
  const exercisesPerDay = experience === 'beginner' ? 5 : experience === 'intermediate' ? 6 : 7;

  let trainingIndex = 0;
  const days: WorkoutDay[] = schedule.map((isTraining, idx) => {
    const dayNumber = idx + 1;
    if (!isTraining) {
      return { dayNumber, title: 'Rest', isRest: true, focus: [], exercises: [] };
    }
    const { title, focus } = splitPlan[trainingIndex];
    const dayExercises = buildExercisesForDay(focus, equipment, experience, goal, exercisesPerDay, trainingIndex);
    trainingIndex += 1;
    return { dayNumber, title, isRest: false, focus, exercises: dayExercises };
  });

  const rawPlan: WorkoutPlan = { experience, goal, trainingDays, equipment, days };
  return validateAndReplacePlan(rawPlan, equipment);
}
