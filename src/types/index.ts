export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';

export type Goal = 'muscle' | 'strength' | 'fat-loss' | 'general';

export type TrainingDays = 2 | 3 | 4 | 5 | 6;

export type Equipment = 'bodyweight' | 'dumbbells' | 'barbell' | 'cable' | 'machines' | 'full-gym';

export type EquipmentType = 'barbell' | 'dumbbell' | 'cable' | 'machine' | 'bodyweight' | 'bench' | 'band' | 'kettlebell';

export type MovementType = 'compound' | 'isolation' | 'static' | 'cardio';

export type MuscleCategory =
  | 'Chest'
  | 'Back'
  | 'Shoulders'
  | 'Biceps'
  | 'Triceps'
  | 'Legs'
  | 'Abs';

export interface Exercise {
  id: string;
  name: string;
  category: MuscleCategory;
  targetMuscle: string;
  equipmentRequired: EquipmentType[];
  difficulty: ExperienceLevel;
  movementType: MovementType;
  primaryMuscle: string;
  secondaryMuscles: string[];
  instructions: string[];
  formTips: string[];
  commonMistakes: string[];
}

export interface WorkoutExercise {
  exerciseId: string;
  sets: number;
  reps: string;
  rest: string;
}

export interface WorkoutDay {
  dayNumber: number;
  title: string;
  isRest: boolean;
  focus: MuscleCategory[];
  exercises: WorkoutExercise[];
}

export interface WorkoutPlan {
  experience: ExperienceLevel;
  goal: Goal;
  trainingDays: TrainingDays;
  equipment: Equipment;
  days: WorkoutDay[];
}

export interface OnboardingSelections {
  experience: ExperienceLevel | null;
  goal: Goal | null;
  trainingDays: TrainingDays | null;
  equipment: Equipment | null;
}

export interface PersonalRecord {
  exerciseName: string;
  value: string;
  date: string;
}

export interface SetProgress {
  exerciseId: string;
  completedSets: number;
  totalSets: number;
}

export interface WorkoutSessionState {
  dayNumber: number;
  dayTitle: string;
  exerciseIndex: number;
  setIndex: number;
  sets: SetProgress[];
  startedAt: number;
  isResting: boolean;
  restEndsAt: number | null;
}

export interface HistoryEntry {
  id: string;
  dayNumber: number;
  dayTitle: string;
  date: string;
  durationMinutes: number;
  exercisesCompleted: number;
  setsCompleted: number;
}

export interface WorkoutStats {
  totalWorkouts: number;
  currentStreak: number;
  totalSets: number;
  totalMinutes: number;
  lastWorkoutDate: string | null;
}
