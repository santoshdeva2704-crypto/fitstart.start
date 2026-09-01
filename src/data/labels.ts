import { Dumbbell, Flame, Trophy, Target, TrendingUp, Zap } from 'lucide-react';
import { Equipment, ExperienceLevel, Goal, TrainingDays } from '@/types';

export const experienceOptions: {
  value: ExperienceLevel;
  title: string;
  description: string;
  icon: typeof Dumbbell;
}[] = [
  {
    value: 'beginner',
    title: 'Beginner',
    description: 'New to the gym or still learning the basics.',
    icon: Dumbbell,
  },
  {
    value: 'intermediate',
    title: 'Intermediate',
    description: 'I train consistently and understand the basic exercises.',
    icon: Flame,
  },
  {
    value: 'advanced',
    title: 'Advanced / Pro',
    description: 'I have several years of training experience and understand advanced training.',
    icon: Trophy,
  },
];

export const goalOptions: { value: Goal; title: string; description: string; icon: typeof Target }[] = [
  {
    value: 'muscle',
    title: 'Build Muscle',
    description: 'Grow size and shape through progressive hypertrophy training.',
    icon: TrendingUp,
  },
  {
    value: 'strength',
    title: 'Build Strength',
    description: 'Get stronger on the big lifts with heavier, lower-rep work.',
    icon: Zap,
  },
  {
    value: 'fat-loss',
    title: 'Lose Fat',
    description: 'Burn calories with higher-rep, shorter-rest circuits.',
    icon: Flame,
  },
  {
    value: 'general',
    title: 'General Fitness',
    description: 'Stay active, healthy and balanced with well-rounded training.',
    icon: Target,
  },
];

export const trainingDaysOptions: TrainingDays[] = [2, 3, 4, 5, 6];

export const equipmentOptions: { value: Equipment; title: string; description: string }[] = [
  { value: 'bodyweight', title: 'Bodyweight', description: 'No equipment — just my body.' },
  { value: 'dumbbells', title: 'Dumbbells', description: 'Dumbbells and bodyweight exercises only.' },
  { value: 'barbell', title: 'Barbell', description: 'Barbell and bodyweight exercises.' },
  { value: 'cable', title: 'Cable', description: 'Cable machine and bodyweight exercises.' },
  { value: 'machines', title: 'Machines', description: 'Weight machines and bodyweight exercises.' },
  { value: 'full-gym', title: 'Full Gym', description: 'Access to barbells, machines, cables and dumbbells.' },
];

export const experienceLabel: Record<ExperienceLevel, string> = {
  beginner: 'Beginner',
  intermediate: 'Intermediate',
  advanced: 'Advanced / Pro',
};

export const goalLabel: Record<Goal, string> = {
  muscle: 'Build Muscle',
  strength: 'Build Strength',
  'fat-loss': 'Lose Fat',
  general: 'General Fitness',
};

export const equipmentLabel: Record<Equipment, string> = {
  bodyweight: 'Bodyweight',
  dumbbells: 'Dumbbells',
  barbell: 'Barbell',
  cable: 'Cable',
  machines: 'Machines',
  'full-gym': 'Full Gym',
};

export const equipmentTypeLabel: Record<string, string> = {
  barbell: 'Barbell',
  dumbbell: 'Dumbbell',
  cable: 'Cable',
  machine: 'Machine',
  bodyweight: 'Bodyweight',
  bench: 'Bench',
  band: 'Band',
  kettlebell: 'Kettlebell',
};

export function formatEquipmentRequired(types: string[]): string {
  return types.map((t) => equipmentTypeLabel[t] ?? t).join(', ');
}

export const difficultyBadgeClasses: Record<ExperienceLevel, string> = {
  beginner: 'bg-emerald-400/10 text-emerald-400 border-emerald-400/20',
  intermediate: 'bg-amber-400/10 text-amber-400 border-amber-400/20',
  advanced: 'bg-rose-400/10 text-rose-400 border-rose-400/20',
};
