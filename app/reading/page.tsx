'use client';

import { useMemo, useState } from 'react';

type BookStatus = 'Currently Reading' | 'Up Next' | 'Finished';

type Book = {
  id: string;
  title: string;
  author: string;
  coverUrl: string;
  status: BookStatus;
  progress?: number; // 0..100 for Currently Reading
  rating: number; // out of 10
  synopsis: string;
  takeaways: string[];
};

type TabKey = 'All' | BookStatus;

const booksSeed: Book[] = [
  {
    id: 'b1',
    title: 'The Art of Quiet Mind',
    author: 'A. L. Mercer',
    coverUrl:
      'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=70',
    status: 'Currently Reading',
    progress: 65,
    rating: 8.5,
    synopsis:
      'A practice-forward meditation on attention: how to notice thought patterns without becoming them—and return to the page with steadier clarity.',
    takeaways: [
      'Attention isn’t a talent; it’s a habit you can train.',
      'Clarity arrives after you stop bargaining with distraction.',
      'Small daily resets beat dramatic reinventions.'
    ],
  },
  {
    id: 'b2',
    title: 'Maps for the Inner Roads',
    author: 'Nora Kestrel',
    coverUrl:
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=70',
    status: 'Up Next',
    rating: 9.1,
    synopsis:
      'A narrative compass for reflective living—connecting decisions to values, and values to the kind of life you keep choosing.',
    takeaways: [
      'Write your rules of engagement, not your resolutions.',
      'Your schedule is your ethics in motion.',
      'Every “yes” deserves a matching “because”.'
    ],
  },
  {
    id: 'b3',
    title: 'Signals & Solitude',
    author: 'Jules Hart',
    coverUrl:
      'https://images.unsplash.com/photo-1455885666463-5f0a6b1d0e2a?auto=format&fit=crop&w=800&q=70',
    status: 'Finished',
    rating: 8.0,
    synopsis:
      'An exploration of modern noise and the surprising power of fewer inputs—how solitude can sharpen discernment and deepen presence.',
    takeaways: [
      'Reduce inputs to amplify meaning.',
      'Silence is not absence; it’s signal processing.',
      'Friendship with your own thoughts is a skill.'
    ],
  },
  {
    id: 'b4',
    title: 'The Gentle Discipline',
    author: 'Rina Alvarez',
    coverUrl:
      'https://images.unsplash.com/photo-1522718321417-0d79d3f6d6f6?auto=format&fit=crop&w=800&q=70',
    status: 'Finished',
    rating: 8.7,
    synopsis:
      'A compassionate system for consistency—turning intentions into rituals that survive bad days, travel, and uncertainty.',
    takeaways: [
      'Consistency loves kindness more than pressure.',
      'Design your environment for your future self.',
      'Rituals create momentum without drama.'
    ],
  },
  {
    id: 'b5',
    title: 'Learning to Listen to Time',
    author: 'E. Sato',
    coverUrl:
      'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=800&q=70',
    status: 'Up Next',
    rating: 7.9,
    synopsis:
      'A study of how we experience time—why some days expand and others collapse—and how to build rhythms that feel spacious.',
    takeaways: [
      'Time perception follows attention, not clocks.',
      'Routines can be elastic, not rigid.',
      'Meaning is often measured in pauses.'
    ],
  },
  {
    id: 'b6',
    title: 'A Practice of Receiving',
    author: 'Mira Donovan',
    coverUrl:
      'https://images.unsplash.com/photo-1473186578172-c141e6798cf4?auto=format&fit=crop&w=800&q=70',
    status: 'Currently Reading',
    progress: 42,
    rating: 8.3,
    synopsis:
      'A gentle framework for appreciation and intake: receiving support, feedback, and beauty without turning them into performance.',
    takeaways: [
      'Receiving isn’t passive—it’s intentional.',
      'Gratitude is a lens you can practice.',
      'The body knows before the mind explains.'
    ],
  },
];

function statusBadgeClasses(status: BookStatus) {
  switch (status) {
    case 'Currently Reading':
      return {
        dot: 'bg-emerald-400',
        ring: 'ring-emerald-500/20',
        text: 'text-emerald-200',
        bg: 'bg-emerald-500/10',
      };
    case 'Up Next':
      return {
        dot: 'bg-slate-300',
        ring: 'ring-white/10',
        text: 'text-slate-200',
        bg: 'bg-white/5',
      };
    case 'Finished':
    default:
      return {
        dot: 'bg-zinc-400',
        ring: 'ring-zinc-500/20',
        text: 'text-zinc-200',
        bg: 'bg-zinc-500/10',
      };
  }
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function ReadingPage() {
  const [tab, setTab] = useState<TabKey>('All');
  const [selected, setSelected] = useState<Book | null>(null);

  const filteredBooks = useMemo(() => {
    if (tab === 'All') return booksSeed;
    return booksSeed.filter((b) => b.status === tab);
  }, [tab]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white/0 via-white/0 to-transparent text-zinc-900 dark:text-zinc-100">
      {/* subtle background */}
      <div className="pointer-events-none fixed inset-0 -z-10 opacity-70">
        <div className="absolute -top-32 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(234,179,8,0.25),transparent_60%)] blur-2xl" />
        <div className="absolute top-[40%] left-[8%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.16),transparent_55%)] blur-2xl dark:opacity-80" />
        <div className="absolute top-[10%] right-[6%] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.12),transparent_58%)] blur-2xl dark:opacity-70" />
      </div>

      <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Header */}
        <header className="flex flex-col gap-3 sm:gap-4">
          <div className="inline-flex items-center gap-3 rounded-full border border-zinc-200/70 bg-white/60 px-3 py-1 text-sm shadow-sm backdrop-blur dark:border-white/10 dark:bg-black/30">
            <span className="inline-block h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_20px_rgba(234,179,8,0.55)]" />
            <span className="font-medium text-zinc-700 dark:text-zinc-200">
              Personal bookshelf
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight font-[family-name:serif]">
            Shelf
          </h1>
          <p className="max-w-2xl text-base sm:text-lg leading-relaxed text-zinc-700 dark:text-zinc-300">
            I read to collect patterns—small, luminous insights that compound into how I live.
            Choose a book, then open its notes.
          </p>
        </header>

        {/* Tabs */}
        <section className="mt-8">
          <div className="flex flex-wrap items-center gap-3">
            {(['All', 'Currently Reading', 'Up Next', 'Finished'] as TabKey[]).map((t) => {
              const active = tab === t;
              return (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={
                    'group inline-flex items-center rounded-full border px-4 py-2 text-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/60 ' +
                    (active
                      ? 'border-amber-400/50 bg-amber-400/15 text-amber-900 dark:text-amber-200 shadow-[0_0_0_1px_rgba(234,179,8,0.10),0_10px_30px_rgba(234,179,8,0.08)]'
                      : 'border-zinc-200/80 bg-white/40 text-zinc-700 hover:bg-white/70 dark:border-white/10 dark:bg-black/20 dark:text-zinc-200 dark:hover:bg-black/30')
                  }
                  aria-pressed={active}
                >
                  <span className="font-medium">
                    {t === 'All' ? 'All' : t}
                  </span>
                  <span
                    aria-hidden
                    className={
                      'ml-2 inline-flex h-2 w-2 rounded-full transition-all ' +
                      (active
                        ? 'bg-amber-400 shadow-[0_0_18px_rgba(234,179,8,0.55)] opacity-100'
                        : 'bg-zinc-300 opacity-0 group-hover:opacity-60 dark:bg-zinc-500')
                    }
                  />
                </button>
              );
            })}
          </div>

          {/* Back link (kept, but style matches new UI) */}
          <div className="mt-5 flex items-center justify-between gap-4">
            <p className="text-sm text-zinc-600 dark:text-zinc-300">
              Showing <span className="font-semibold text-zinc-900 dark:text-zinc-100">{filteredBooks.length}</span> books
            </p>
            <a
              href="/"
              className="inline-flex items-center rounded-full border border-zinc-200/70 bg-white/50 px-4 py-2 text-sm text-zinc-700 hover:bg-white/80 transition-all shadow-sm backdrop-blur dark:border-white/10 dark:bg-black/25 dark:text-zinc-200 dark:hover:bg-black/35"
            >
              ← Back to Home
            </a>
          </div>
        </section>

        {/* Grid */}
        <section className="mt-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredBooks.map((book) => {
              const badge = statusBadgeClasses(book.status);
              const progress = book.status === 'Currently Reading' ? clamp(book.progress ?? 0, 0, 100) : null;

              return (
                <article
                  key={book.id}
                  className={
                    'group relative rounded-2xl border border-zinc-200/80 bg-white/60 dark:bg-black/25 dark:border-white/10 ' +
                    'p-3 sm:p-4 overflow-hidden cursor-pointer select-none ' +
                    'transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-amber-400/35 dark:hover:border-amber-300/30'
                  }
                  onClick={() => setSelected(book)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') setSelected(book);
                  }}
                  aria-label={`Open details for ${book.title}`}
                >
                  {/* Cover + status badge */}
                  <div className="relative">
                    <div
                      className={
                        'aspect-[2/3] w-full overflow-hidden rounded-xl bg-gradient-to-b from-zinc-100 to-zinc-50 dark:from-white/5 dark:to-black/10'
                      }
                    >
                      <img
                        src={book.coverUrl}
                        alt={`${book.title} cover`}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
                        loading="lazy"
                      />
                    </div>

                    <div
                      className={
                        'absolute left-3 top-3 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs backdrop-blur ' +
                        ' ' +
                        `border-white/15 ${badge.ring} ${badge.bg}`
                      }
                    >
                      <span
                        className={
                          'inline-block h-1.5 w-1.5 rounded-full shadow-[0_0_18px_rgba(0,0,0,0.2)] ' + badge.dot
                        }
                      />
                      <span className={`font-medium ${badge.text}`}>{book.status}</span>
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="mt-4 space-y-3">
                    <div>
                      <h3 className="font-[family-name:serif] text-zinc-900 dark:text-zinc-100 leading-snug text-base sm:text-lg">
                        {book.title}
                      </h3>
                      <p className="mt-1 text-xs sm:text-sm font-mono text-zinc-600 dark:text-zinc-300">
                        {book.author}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300">
                        Rating
                      </div>
                      <div className="rounded-full border border-zinc-200/70 bg-white/40 px-3 py-1 text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        {book.rating.toFixed(1)}/10
                      </div>
                    </div>

                    {progress !== null && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[11px] text-zinc-600 dark:text-zinc-300">
                          <span className="font-medium">Progress</span>
                          <span className="tabular-nums">{progress}%</span>
                        </div>
                        <div className="h-[3px] w-full rounded-full bg-zinc-200/70 dark:bg-white/10 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.35)] transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </main>

      {/* Drawer / modal */}
      {selected && (
        <div
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label="Book details"
        >
          {/* Backdrop */}
          <button
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            onClick={() => setSelected(null)}
            aria-label="Close"
          />

          {/* Panel */}
          <div className="relative w-full max-w-4xl">
            <div className="rounded-t-3xl sm:rounded-3xl border border-zinc-200/70 bg-white/80 shadow-2xl backdrop-blur dark:border-white/10 dark:bg-black/50 overflow-hidden">
              <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-4 border-b border-zinc-200/60 dark:border-white/10">
                <div>
                  <div className="text-xs text-zinc-600 dark:text-zinc-300 font-medium">
                    {selected.status}
                  </div>
                  <div className="text-xl sm:text-2xl font-[family-name:serif] text-zinc-900 dark:text-zinc-100">
                    {selected.title}
                  </div>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="rounded-full border border-zinc-200/70 bg-white/60 px-3 py-1.5 text-sm text-zinc-800 hover:bg-white/80 transition-all dark:border-white/10 dark:bg-black/20 dark:text-zinc-100 dark:hover:bg-black/30"
                >
                  Close
                </button>
              </div>

              <div className="p-4 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6 items-start">
                  <div className="">
                    <div className="aspect-[2/3] overflow-hidden rounded-2xl bg-gradient-to-b from-zinc-100 to-zinc-50 dark:from-white/5 dark:to-black/10">
                      <img
                        src={selected.coverUrl}
                        alt={`${selected.title} cover`}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {selected.status === 'Currently Reading' && (
                      <div className="mt-4">
                        <div className="flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-300">
                          <span className="font-medium">Reading progress</span>
                          <span className="tabular-nums">
                            {clamp(selected.progress ?? 0, 0, 100)}%
                          </span>
                        </div>
                        <div className="mt-2 h-[4px] w-full rounded-full bg-zinc-200/80 dark:bg-white/10 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.35)]"
                            style={{ width: `${clamp(selected.progress ?? 0, 0, 100)}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-5">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="text-sm font-mono text-zinc-700 dark:text-zinc-300">
                        {selected.author}
                      </div>
                      <div className="ml-auto rounded-full border border-zinc-200/70 bg-white/40 px-3 py-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        {selected.rating.toFixed(1)}/10
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        Quick Synopsis
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
                        {selected.synopsis}
                      </p>
                    </div>

                    <div>
                      <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        Golden Nuances &amp; Takeaways
                      </div>
                      <ul className="mt-3 space-y-2">
                        {selected.takeaways.map((t, idx) => (
                          <li
                            key={`${selected.id}-t-${idx}`}
                            className="flex gap-3 items-start text-sm text-zinc-700 dark:text-zinc-300"
                          >
                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-400 shadow-[0_0_18px_rgba(234,179,8,0.55)]" />
                            <span className="leading-relaxed">{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-1">
                      <div className="text-xs text-zinc-500 dark:text-zinc-400">
                        Tip: connect this UI to your database/API by replacing <span className="font-mono">booksSeed</span>.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

