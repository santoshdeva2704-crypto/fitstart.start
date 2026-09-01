import { ReactNode } from 'react';
import { Check } from 'lucide-react';

interface SelectableCardProps {
  selected: boolean;
  onClick: () => void;
  icon?: ReactNode;
  title: string;
  description?: string;
  className?: string;
}

export function SelectableCard({
  selected,
  onClick,
  icon,
  title,
  description,
  className = '',
}: SelectableCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative w-full text-left rounded-2xl border p-5 transition-all duration-200 ${
        selected
          ? 'border-lime-400 bg-lime-400/5 shadow-lg shadow-lime-400/10'
          : 'border-zinc-800 bg-zinc-900/40 hover:border-zinc-600 hover:bg-zinc-900/70'
      } ${className}`}
    >
      <div className="flex items-start gap-4">
        {icon && (
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors ${
              selected ? 'bg-lime-400 text-zinc-950' : 'bg-zinc-800 text-zinc-400 group-hover:text-zinc-200'
            }`}
          >
            {icon}
          </div>
        )}
        <div className="flex-1">
          <h3 className={`font-bold text-base ${selected ? 'text-lime-300' : 'text-zinc-100'}`}>{title}</h3>
          {description && <p className="mt-1 text-sm text-zinc-400 leading-relaxed">{description}</p>}
        </div>
        <div
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
            selected ? 'border-lime-400 bg-lime-400 text-zinc-950' : 'border-zinc-700 text-transparent'
          }`}
        >
          <Check className="h-3.5 w-3.5" strokeWidth={3} />
        </div>
      </div>
    </button>
  );
}
