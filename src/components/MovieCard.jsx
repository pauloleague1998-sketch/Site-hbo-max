import { Film, Play } from "lucide-react";
import { IMG_BASE } from "../tmdb.js";

// Card no estilo HBO Max: pôster 2:3, overlay roxo + play no hover e badges.
export default function MovieCard({ filme, onClick }) {
  // Badges determinísticos (demo) — "4K" e "Dolby Atmos" em alguns cards.
  const badges = [];
  if (filme.id % 3 === 0) badges.push("4K");
  if (filme.id % 4 === 0) badges.push("Dolby Atmos");

  return (
    <article
      onClick={onClick}
      className="group relative w-[140px] shrink-0 cursor-pointer overflow-hidden rounded-lg border-2 border-transparent bg-dark2 transition-all duration-300 hover:-translate-y-1.5 hover:border-brand hover:shadow-[0_16px_36px_rgba(107,44,245,0.35)] sm:w-[160px] lg:w-[200px]"
    >
      {/* Badges no canto superior esquerdo */}
      {badges.length > 0 && (
        <div className="absolute left-2 top-2 z-10 flex gap-1.5">
          {badges.map((b) => (
            <span
              key={b}
              className="rounded bg-brand px-2 py-0.5 text-[11px] font-bold text-white"
            >
              {b}
            </span>
          ))}
        </div>
      )}

      {/* Pôster em proporção 2:3 */}
      <div className="aspect-[2/3] w-full overflow-hidden bg-dark2">
        {filme.poster_path ? (
          <img
            src={`${IMG_BASE}${filme.poster_path}`}
            alt={filme.title}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-zinc-600">
            <Film className="h-12 w-12" />
          </div>
        )}
      </div>

      {/* Overlay roxo (60%) + play centralizado */}
      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-brand/85 to-magenta/40 opacity-0 transition-opacity duration-300 group-hover:opacity-60">
        <div className="flex h-14 w-14 scale-75 items-center justify-center rounded-full bg-white text-brand transition-transform duration-300 group-hover:scale-100">
          <Play className="h-6 w-6 fill-current" />
        </div>
      </div>

      <h3 className="truncate px-3.5 py-3.5 text-sm font-semibold text-white">
        {filme.title}
      </h3>
    </article>
  );
}
