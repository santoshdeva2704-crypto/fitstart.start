import { Instagram } from 'lucide-react';

const INSTAGRAM_URL = 'https://www.instagram.com/san.thrive?igsh=MTZ3NWppcW9senZtMA==';

export function Footer() {
  return (
    <footer className="border-t border-zinc-800/60 bg-zinc-950 px-4 py-6 pb-24 lg:pb-6">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
          <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Follow FitStart</span>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-900/40 px-3 py-1.5 text-xs font-bold text-zinc-300 transition-colors hover:border-lime-400/40 hover:bg-lime-400/5 hover:text-lime-300"
          >
            <Instagram className="h-3.5 w-3.5" />
            Follow us on Instagram
          </a>
        </div>
        <p className="mt-3 text-center text-[10px] text-zinc-600">
          &copy; {new Date().getFullYear()} FitStart. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
