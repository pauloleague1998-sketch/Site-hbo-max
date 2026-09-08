import { Film, Star, X } from "lucide-react";
import { IMG_BASE } from "../tmdb.js";

// Modal com os detalhes do filme selecionado (capa, sinopse, ano e nota).
export default function MovieModal({ filme, onFechar }) {
  if (!filme) return null;

  const ano = filme.release_date ? filme.release_date.slice(0, 4) : "—";
  const nota = filme.vote_average ? filme.vote_average.toFixed(1) : null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onFechar} />

      <div
        className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg bg-zinc-900 shadow-2xl ring-1 ring-white/10 sm:flex-row"
        style={{ animation: "scaleIn 0.25s ease" }}
      >
        <button
          onClick={onFechar}
          className="absolute right-3 top-3 z-10 rounded-full bg-black/60 p-2 text-white transition-colors hover:bg-black/80"
          aria-label="Fechar"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Capa do filme */}
        <div className="h-64 w-full shrink-0 bg-zinc-800 sm:h-auto sm:w-64">
          {filme.poster_path ? (
            <img
              src={`${IMG_BASE}${filme.poster_path}`}
              alt={filme.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-zinc-600">
              <Film className="h-16 w-16" />
            </div>
          )}
        </div>

        {/* Detalhes */}
        <div className="flex-1 overflow-y-auto p-6">
          <h2 className="text-2xl font-bold text-white">{filme.title}</h2>

          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-400">
            <span>{ano}</span>
            {nota && (
              <span className="flex items-center gap-1 text-yellow-400">
                <Star className="h-4 w-4 fill-current" /> {nota} / 10
              </span>
            )}
          </div>

          <h3 className="mt-5 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Sinopse
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-300">
            {filme.overview || "Sinopse não disponível."}
          </p>
        </div>
      </div>
    </div>
  );
}
