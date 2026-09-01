import { Dumbbell, Target, TrendingUp, Library, ArrowRight, Check, Flame, Trophy } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { experienceOptions } from '@/data/labels';

const features = [
  {
    icon: Target,
    title: 'Know What To Do',
    description: 'Stop wondering what exercise to do next. Get a clear plan tailored to you.',
  },
  {
    icon: Dumbbell,
    title: 'Learn Proper Form',
    description: 'Understand how to perform exercises safely and correctly with step-by-step guides.',
  },
  {
    icon: TrendingUp,
    title: 'Track Your Progress',
    description: 'Keep track of your workouts and progress over time, all in one place.',
  },
];

const levelDetails = [
  { icon: Dumbbell, title: 'Beginner', desc: 'Simple exercises, moderate volume, focus on learning form.' },
  { icon: Flame, title: 'Intermediate', desc: 'More exercise variety and structured training splits.' },
  { icon: Trophy, title: 'Advanced / Pro', desc: 'Sophisticated splits and advanced exercise selection.' },
];

export function HomePage() {
  const { startOnboarding, goToLibrary } = useApp();

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-16 pb-20 sm:pt-24 sm:pb-28">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-lime-400/20 blur-[120px]" />
          <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-lime-600/10 blur-[100px]" />
        </div>
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-lime-400/30 bg-lime-400/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-lime-300">
            <Dumbbell className="h-3.5 w-3.5" /> Fitness Made Simple
          </span>
          <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-zinc-50 sm:text-6xl">
            Your Gym Journey <span className="text-lime-400">Starts Here.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-zinc-400 sm:text-lg leading-relaxed">
            Personalized workouts, proper form guidance, and progress tracking for every experience level.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" onClick={startOnboarding} icon={<ArrowRight className="h-5 w-5" />}>
              Start My Workout
            </Button>
            <Button size="lg" variant="secondary" onClick={goToLibrary} icon={<Library className="h-5 w-5" />} iconPosition="left">
              Explore Exercises
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 pb-20">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-4 sm:grid-cols-3">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 transition-colors hover:border-zinc-700 animate-fade-in-up"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-lime-400/10 text-lime-400">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-zinc-50">{feature.title}</h3>
                  <p className="mt-1.5 text-sm text-zinc-400 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Levels */}
      <section className="px-4 pb-24">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="text-2xl font-extrabold text-zinc-50 sm:text-3xl">Built For Every Level</h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-zinc-400 sm:text-base">
              FitStart adapts workouts based on your experience — from your first day in the gym to your next PR.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {levelDetails.map((level, i) => {
              const Icon = level.icon;
              return (
                <div
                  key={level.title}
                  className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900/60 to-zinc-950 p-6 animate-fade-in-up"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-lime-400/5 blur-2xl" />
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-800 text-lime-400">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-zinc-50">{level.title}</h3>
                  <p className="mt-1.5 text-sm text-zinc-400 leading-relaxed">{level.desc}</p>
                </div>
              );
            })}
          </div>
          <div className="mt-10 flex justify-center">
            <Button size="lg" onClick={startOnboarding} icon={<ArrowRight className="h-5 w-5" />}>
              Get My Plan
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
