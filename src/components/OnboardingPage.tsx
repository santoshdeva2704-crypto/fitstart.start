import { ArrowLeft, ArrowRight, Check, Dumbbell, Home } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { SelectableCard } from '@/components/ui/SelectableCard';
import {
  experienceOptions,
  goalOptions,
  trainingDaysOptions,
  equipmentOptions,
  experienceLabel,
  goalLabel,
  equipmentLabel,
} from '@/data/labels';
import { ExperienceLevel, Goal, TrainingDays, Equipment } from '@/types';

const steps = ['Experience', 'Goal', 'Days', 'Equipment', 'Plan'];

export function OnboardingPage() {
  const {
    selections,
    setExperience,
    setGoal,
    setTrainingDays,
    setEquipment,
    generatePlan,
    goHome,
    goToPlan,
    plan,
  } = useApp();

  const currentStep = !selections.experience
    ? 0
    : !selections.goal
    ? 1
    : !selections.trainingDays
    ? 2
    : !selections.equipment
    ? 3
    : 4;

  const canContinue = () => {
    if (currentStep === 0) return !!selections.experience;
    if (currentStep === 1) return !!selections.goal;
    if (currentStep === 2) return !!selections.trainingDays;
    if (currentStep === 3) return !!selections.equipment;
    return true;
  };

  const handleContinue = () => {
    if (currentStep === 4) {
      generatePlan();
    } else {
      // Advance by scrolling to next step section — we use a single page with all steps visible
      const nextStepEl = document.getElementById(`step-${currentStep + 1}`);
      nextStepEl?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleBack = () => {
    if (currentStep === 0) {
      goHome();
    } else {
      const prevEl = document.getElementById(`step-${currentStep - 1}`);
      prevEl?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:py-10 animate-fade-in pb-28">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, i) => (
            <div key={step} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                    i < currentStep
                      ? 'bg-lime-400 text-zinc-950'
                      : i === currentStep
                      ? 'bg-lime-400/20 text-lime-300 ring-2 ring-lime-400'
                      : 'bg-zinc-800 text-zinc-500'
                  }`}
                >
                  {i < currentStep ? <Check className="h-4 w-4" strokeWidth={3} /> : i + 1}
                </div>
                <span
                  className={`text-[10px] font-semibold sm:text-xs ${
                    i <= currentStep ? 'text-lime-300' : 'text-zinc-600'
                  }`}
                >
                  {step}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`mx-1 h-0.5 flex-1 rounded-full transition-colors ${
                    i < currentStep ? 'bg-lime-400' : 'bg-zinc-800'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Experience */}
      <section id="step-0" className="scroll-mt-6">
        <h2 className="text-2xl font-extrabold text-zinc-50 sm:text-3xl">What's your experience level?</h2>
        <p className="mt-2 text-sm text-zinc-400">We'll tailor your exercises and volume to match.</p>
        <div className="mt-6 space-y-3">
          {experienceOptions.map((opt) => {
            const Icon = opt.icon;
            return (
              <SelectableCard
                key={opt.value}
                selected={selections.experience === opt.value}
                onClick={() => setExperience(opt.value as ExperienceLevel)}
                icon={<Icon className="h-6 w-6" />}
                title={opt.title}
                description={opt.description}
              />
            );
          })}
        </div>
      </section>

      {/* Step 2: Goal */}
      {selections.experience && (
        <section id="step-1" className="mt-12 scroll-mt-6 animate-fade-in-up">
          <h2 className="text-2xl font-extrabold text-zinc-50 sm:text-3xl">What's your main goal?</h2>
          <p className="mt-2 text-sm text-zinc-400">Your sets, reps and rest will adapt to this goal.</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {goalOptions.map((opt) => {
              const Icon = opt.icon;
              return (
                <SelectableCard
                  key={opt.value}
                  selected={selections.goal === opt.value}
                  onClick={() => setGoal(opt.value as Goal)}
                  icon={<Icon className="h-6 w-6" />}
                  title={opt.title}
                  description={opt.description}
                />
              );
            })}
          </div>
        </section>
      )}

      {/* Step 3: Training Days */}
      {selections.experience && selections.goal && (
        <section id="step-2" className="mt-12 scroll-mt-6 animate-fade-in-up">
          <h2 className="text-2xl font-extrabold text-zinc-50 sm:text-3xl">How many days can you train each week?</h2>
          <p className="mt-2 text-sm text-zinc-400">Pick a schedule you can stick to consistently.</p>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
            {trainingDaysOptions.map((days) => (
              <button
                key={days}
                onClick={() => setTrainingDays(days as TrainingDays)}
                className={`flex flex-col items-center justify-center rounded-2xl border p-5 transition-all ${
                  selections.trainingDays === days
                    ? 'border-lime-400 bg-lime-400/5 shadow-lg shadow-lime-400/10'
                    : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-600'
                }`}
              >
                <span
                  className={`text-3xl font-extrabold ${selections.trainingDays === days ? 'text-lime-300' : 'text-zinc-100'}`}
                >
                  {days}
                </span>
                <span className="mt-1 text-xs font-semibold text-zinc-500">days</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Step 4: Equipment */}
      {selections.experience && selections.goal && selections.trainingDays && (
        <section id="step-3" className="mt-12 scroll-mt-6 animate-fade-in-up">
          <h2 className="text-2xl font-extrabold text-zinc-50 sm:text-3xl">Where do you train?</h2>
          <p className="mt-2 text-sm text-zinc-400">We'll only recommend exercises you can actually do.</p>
          <div className="mt-6 space-y-3">
            {equipmentOptions.map((opt) => (
              <SelectableCard
                key={opt.value}
                selected={selections.equipment === opt.value}
                onClick={() => setEquipment(opt.value as Equipment)}
                icon={<Dumbbell className="h-6 w-6" />}
                title={opt.title}
                description={opt.description}
              />
            ))}
          </div>
        </section>
      )}

      {/* Step 5: Summary */}
      {selections.experience && selections.goal && selections.trainingDays && selections.equipment && (
        <section id="step-4" className="mt-12 scroll-mt-6 animate-fade-in-up">
          <h2 className="text-2xl font-extrabold text-zinc-50 sm:text-3xl">Your workout plan is ready</h2>
          <p className="mt-2 text-sm text-zinc-400">Here's a summary of your selections.</p>
          <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
            <dl className="space-y-4">
              {[
                { label: 'Experience', value: experienceLabel[selections.experience] },
                { label: 'Goal', value: goalLabel[selections.goal] },
                { label: 'Training', value: `${selections.trainingDays} days/week` },
                { label: 'Equipment', value: equipmentLabel[selections.equipment] },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between border-b border-zinc-800/60 pb-4 last:border-0 last:pb-0">
                  <dt className="text-sm font-medium text-zinc-500">{row.label}</dt>
                  <dd className="text-sm font-bold text-lime-300">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="mt-6">
            <Button size="lg" className="w-full" onClick={generatePlan} icon={<ArrowRight className="h-5 w-5" />}>
              Create My Workout Plan
            </Button>
          </div>
        </section>
      )}

      {/* Nav buttons */}
      <div className="mt-10 flex items-center justify-between gap-3">
        <Button variant="ghost" onClick={handleBack} icon={<ArrowLeft className="h-4 w-4" />} iconPosition="left">
          {currentStep === 0 ? 'Home' : 'Back'}
        </Button>
        {currentStep < 4 && (
          <Button
            onClick={handleContinue}
            disabled={!canContinue()}
            icon={<ArrowRight className="h-4 w-4" />}
          >
            Continue
          </Button>
        )}
        {currentStep === 4 && plan && (
          <Button variant="ghost" onClick={goToPlan} icon={<ArrowRight className="h-4 w-4" />}>
            View Plan
          </Button>
        )}
      </div>

      {/* Home shortcut */}
      <div className="mt-6 text-center">
        <button onClick={goHome} className="inline-flex items-center gap-1.5 text-xs text-zinc-600 hover:text-zinc-400">
          <Home className="h-3.5 w-3.5" /> Back to home
        </button>
      </div>
    </div>
  );
}
