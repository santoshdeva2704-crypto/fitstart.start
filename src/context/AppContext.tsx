import { createContext, ReactNode, useContext, useMemo } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { generateWorkoutPlan } from '@/data/workoutGenerator';
import {
  Equipment,
  ExperienceLevel,
  Goal,
  HistoryEntry,
  OnboardingSelections,
  TrainingDays,
  WorkoutDay,
  WorkoutPlan,
  WorkoutSessionState,
  WorkoutStats,
} from '@/types';

export type View =
  | 'home'
  | 'onboarding'
  | 'plan'
  | 'library'
  | 'exercise-detail'
  | 'progress'
  | 'profile'
  | 'workout-mode';

const emptySelections: OnboardingSelections = {
  experience: null,
  goal: null,
  trainingDays: null,
  equipment: null,
};

function todayStr(): string {
  return new Date().toISOString().split('T')[0];
}

function daysBetween(a: string, b: string): number {
  const d1 = new Date(a + 'T00:00:00');
  const d2 = new Date(b + 'T00:00:00');
  return Math.round((d2.getTime() - d1.getTime()) / 86400000);
}

function computeStreak(history: HistoryEntry[]): number {
  if (history.length === 0) return 0;
  const dates = [...new Set(history.map((h) => h.date))].sort();
  const today = todayStr();
  const lastDate = dates[dates.length - 1];
  if (daysBetween(lastDate, today) > 1) return 0;
  let streak = 0;
  let cursor = today;
  const dateSet = new Set(dates);
  if (!dateSet.has(cursor)) {
    cursor = dates[dates.length - 1];
  }
  while (dateSet.has(cursor)) {
    streak += 1;
    const d = new Date(cursor + 'T00:00:00');
    d.setDate(d.getDate() - 1);
    cursor = d.toISOString().split('T')[0];
  }
  return streak;
}

function parseRestFromPlan(plan: WorkoutPlan | null, dayNumber: number, exerciseIdx: number): number {
  if (!plan) return 90000;
  const day = plan.days.find((d) => d.dayNumber === dayNumber);
  if (!day) return 90000;
  const we = day.exercises[exerciseIdx];
  if (!we) return 90000;
  const match = we.rest.match(/(\d+)/);
  return match ? parseInt(match[1], 10) * 1000 : 90000;
}

interface AppContextValue {
  view: View;
  goHome: () => void;
  startOnboarding: () => void;
  goToPlan: () => void;
  goToLibrary: () => void;
  goToProgress: () => void;
  goToProfile: () => void;
  openExercise: (exerciseId: string, referrer: 'library' | 'plan') => void;
  closeExerciseDetail: () => void;
  selectedExerciseId: string | null;
  exerciseReferrer: 'library' | 'plan';

  selections: OnboardingSelections;
  setExperience: (value: ExperienceLevel) => void;
  setGoal: (value: Goal) => void;
  setTrainingDays: (value: TrainingDays) => void;
  setEquipment: (value: Equipment) => void;

  plan: WorkoutPlan | null;
  generatePlan: () => void;
  retakeOnboarding: () => void;

  session: WorkoutSessionState | null;
  startWorkout: (day: WorkoutDay) => void;
  completeSet: () => void;
  skipExercise: () => void;
  skipRest: () => void;
  prevExercise: () => void;
  nextExercise: () => void;
  finishWorkout: () => void;
  exitWorkout: () => void;

  history: HistoryEntry[];
  stats: WorkoutStats;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useLocalStorage<View>('fitstart-view', 'home');
  const [selectedExerciseId, setSelectedExerciseId] = useLocalStorage<string | null>('fitstart-selected-exercise', null);
  const [exerciseReferrer, setExerciseReferrer] = useLocalStorage<'library' | 'plan'>('fitstart-exercise-referrer', 'library');
  const [selections, setSelections] = useLocalStorage<OnboardingSelections>('fitstart-selections', emptySelections);
  const [plan, setPlan] = useLocalStorage<WorkoutPlan | null>('fitstart-plan', null);
  const [session, setSession] = useLocalStorage<WorkoutSessionState | null>('fitstart-session', null);
  const [history, setHistory] = useLocalStorage<HistoryEntry[]>('fitstart-history', []);

  const goHome = () => setView('home');
  const startOnboarding = () => setView('onboarding');
  const goToPlan = () => setView('plan');
  const goToLibrary = () => setView('library');
  const goToProgress = () => setView('progress');
  const goToProfile = () => setView('profile');

  const openExercise = (exerciseId: string, referrer: 'library' | 'plan') => {
    setSelectedExerciseId(exerciseId);
    setExerciseReferrer(referrer);
    setView('exercise-detail');
  };

  const closeExerciseDetail = () => {
    setView(exerciseReferrer === 'plan' ? 'plan' : 'library');
  };

  const setExperience = (value: ExperienceLevel) => setSelections((prev) => ({ ...prev, experience: value }));
  const setGoal = (value: Goal) => setSelections((prev) => ({ ...prev, goal: value }));
  const setTrainingDays = (value: TrainingDays) => setSelections((prev) => ({ ...prev, trainingDays: value }));
  const setEquipment = (value: Equipment) => setSelections((prev) => ({ ...prev, equipment: value }));

  const generatePlan = () => {
    const { experience, goal, trainingDays, equipment } = selections;
    if (!experience || !goal || !trainingDays || !equipment) return;
    const newPlan = generateWorkoutPlan(experience, goal, trainingDays, equipment);
    setPlan(newPlan);
    setView('plan');
  };

  const retakeOnboarding = () => {
    setSelections(emptySelections);
    setPlan(null);
    setSession(null);
    setView('onboarding');
  };

  const startWorkout = (day: WorkoutDay) => {
    if (day.isRest || day.exercises.length === 0) return;
    const sets = day.exercises.map((we) => ({
      exerciseId: we.exerciseId,
      completedSets: 0,
      totalSets: we.sets,
    }));
    setSession({
      dayNumber: day.dayNumber,
      dayTitle: day.title,
      exerciseIndex: 0,
      setIndex: 0,
      sets,
      startedAt: Date.now(),
      isResting: false,
      restEndsAt: null,
    });
    setView('workout-mode');
  };

  const completeSet = () => {
    setSession((prev) => {
      if (!prev) return prev;
      const sets = [...prev.sets];
      const cur = sets[prev.exerciseIndex];
      if (!cur) return prev;
      const newCompleted = cur.completedSets + 1;
      sets[prev.exerciseIndex] = { ...cur, completedSets: newCompleted };

      const isLastSetOfExercise = newCompleted >= cur.totalSets;
      const isLastExercise = prev.exerciseIndex >= sets.length - 1;

      if (isLastSetOfExercise && isLastExercise) {
        return { ...prev, sets, isResting: false, restEndsAt: null };
      }

      const restMs = parseRestFromPlan(plan, prev.dayNumber, prev.exerciseIndex);

      if (isLastSetOfExercise) {
        return {
          ...prev,
          sets,
          exerciseIndex: prev.exerciseIndex + 1,
          setIndex: 0,
          isResting: true,
          restEndsAt: Date.now() + restMs,
        };
      }

      return {
        ...prev,
        sets,
        setIndex: prev.setIndex + 1,
        isResting: true,
        restEndsAt: Date.now() + restMs,
      };
    });
  };

  const skipExercise = () => {
    setSession((prev) => {
      if (!prev) return prev;
      const isLastExercise = prev.exerciseIndex >= prev.sets.length - 1;
      if (isLastExercise) {
        return { ...prev, isResting: false, restEndsAt: null };
      }
      return {
        ...prev,
        exerciseIndex: prev.exerciseIndex + 1,
        setIndex: 0,
        isResting: false,
        restEndsAt: null,
      };
    });
  };

  const skipRest = () => {
    setSession((prev) => (prev ? { ...prev, isResting: false, restEndsAt: null } : prev));
  };

  const prevExercise = () => {
    setSession((prev) => {
      if (!prev || prev.exerciseIndex === 0) return prev;
      return {
        ...prev,
        exerciseIndex: prev.exerciseIndex - 1,
        setIndex: 0,
        isResting: false,
        restEndsAt: null,
      };
    });
  };

  const nextExercise = () => {
    setSession((prev) => {
      if (!prev || prev.exerciseIndex >= prev.sets.length - 1) return prev;
      return {
        ...prev,
        exerciseIndex: prev.exerciseIndex + 1,
        setIndex: 0,
        isResting: false,
        restEndsAt: null,
      };
    });
  };

  const finishWorkout = () => {
    setSession((prev) => {
      if (!prev) return prev;
      const setsCompleted = prev.sets.reduce((sum, sp) => sum + sp.completedSets, 0);
      const exercisesCompleted = prev.sets.filter((sp) => sp.completedSets >= sp.totalSets).length;
      const durationMinutes = Math.max(1, Math.round((Date.now() - prev.startedAt) / 60000));
      const today = todayStr();
      const alreadyToday = history.some((h) => h.date === today && h.dayNumber === prev.dayNumber);

      if (!alreadyToday) {
        const entry: HistoryEntry = {
          id: `${prev.dayNumber}-${Date.now()}`,
          dayNumber: prev.dayNumber,
          dayTitle: prev.dayTitle,
          date: today,
          durationMinutes,
          exercisesCompleted,
          setsCompleted,
        };
        setHistory((h) => [...h, entry]);
      }
      return null;
    });
    setView('plan');
  };

  const exitWorkout = () => {
    setSession(null);
    setView('plan');
  };

  const stats: WorkoutStats = useMemo(() => {
    const totalWorkouts = history.length;
    const totalSets = history.reduce((sum, h) => sum + h.setsCompleted, 0);
    const totalMinutes = history.reduce((sum, h) => sum + h.durationMinutes, 0);
    const lastWorkoutDate = history.length > 0 ? history[history.length - 1].date : null;
    const currentStreak = computeStreak(history);
    return { totalWorkouts, currentStreak, totalSets, totalMinutes, lastWorkoutDate };
  }, [history]);

  const value: AppContextValue = {
    view,
    goHome,
    startOnboarding,
    goToPlan,
    goToLibrary,
    goToProgress,
    goToProfile,
    openExercise,
    closeExerciseDetail,
    selectedExerciseId,
    exerciseReferrer,
    selections,
    setExperience,
    setGoal,
    setTrainingDays,
    setEquipment,
    plan,
    generatePlan,
    retakeOnboarding,
    session,
    startWorkout,
    completeSet,
    skipExercise,
    skipRest,
    prevExercise,
    nextExercise,
    finishWorkout,
    exitWorkout,
    history,
    stats,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within an AppProvider');
  return ctx;
}
