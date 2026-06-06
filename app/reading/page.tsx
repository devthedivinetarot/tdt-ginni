import Link from 'next/link';

const READING_URL = 'https://ginni-ki-baatein-buddy.lovable.app';

export default function ReadingPage() {
  return (
    <div className="bg-[#0a0a0a] text-white min-h-[100dvh] flex flex-col">
      {/* 90% viewport height immersive container */}
      <main className="h-[90vh] w-full flex flex-col items-center justify-center relative">
        {/* Premium Back to Home (single button, top-left escape hatch) */}
        <Link
          href="/"
          className="absolute top-6 left-6 z-10 inline-flex items-center justify-center px-5 py-2 rounded-full border border-yellow-500/50 text-yellow-500 hover:bg-yellow-500 hover:text-black transition-all duration-300 bg-black/30 backdrop-blur-sm shadow-[0_0_20px_rgba(234,179,8,0.18)]"
        >
          ← Back to Home
        </Link>

        {/* Immersive iframe card (90% x 90% of parent) */}
        <div className="w-[90%] h-[90%] overflow-hidden rounded-3xl shadow-[0_0_15px_rgba(234,179,8,0.15)]">
          <iframe
            src={READING_URL}
            title="Tarot Reading Buddy"
            className="w-full h-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer"
            allowFullScreen
            allow="autoplay; clipboard-write; microphone; camera"
            sandbox="allow-scripts allow-forms allow-popups allow-same-origin"
          />
        </div>
      </main>
    </div>
  );
}

