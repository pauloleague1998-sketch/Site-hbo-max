import { useState } from "react";
import {
  ChevronDown,
  Film,
  Play,
  Plus,
  Search,
  Star,
  StarHalf,
  X,
} from "lucide-react";
import { buscarFilmes, IMG_BASE } from "./tmdb.js";

// Gera a URL de imagem conforme a política de imagens do projeto.
const IMG = (prompt, size = "portrait_4_3") =>
  `https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=${encodeURIComponent(
    prompt
  )}&image_size=${size}`;

// Pôsteres do carrossel 3D (da esquerda para a direita).
const CAROUSEL = [
  {
    id: "opp",
    title: "Oppenheimer",
    ano: 2023,
    rating: 4.4,
    sinopse:
      "A história do físico J. Robert Oppenheimer e do Projeto Manhattan, que desenvolveu a primeira bomba atômica durante a Segunda Guerra Mundial.",
    img: IMG(
      "Oppenheimer movie poster, extreme close-up of a man's face with intense blue eyes, orange fire and smoke background, dark cinematic lighting, small title text at top"
    ),
  },
  {
    id: "poor-things",
    title: "Poor Things",
    ano: 2023,
    rating: 4.2,
    sinopse:
      "Trazida de volta à vida por um cientista excêntrico, a jovem Bella Baxter foge com um advogado libertino em uma aventura de autodescoberta.",
    img: IMG(
      "Poor Things movie poster, surreal portrait of a woman with dark hair, vibrant teal and pink colors, whimsical artistic fantasy style, visible title text"
    ),
  },
  {
    id: "dune",
    title: "Dune: Part Two",
    ano: 2024,
    rating: 4.5,
    sinopse:
      "Paul Atreides se une a Chani e aos Fremen em uma guerra de vingança contra os conspiradores que destruíram sua família.",
    img: IMG(
      "Dune Part Two movie poster, two people in desert stillsuits, a man and a woman standing in sand dunes, epic sci-fi, orange sky, large title text DUNE PART TWO"
    ),
  },
  {
    id: "barbie",
    title: "Barbie",
    ano: 2023,
    rating: 4.0,
    sinopse:
      "Depois de ser expulsa da Barbielândia, Barbie e Ken partem para o mundo real e descobrem o que significa ser humano.",
    img: IMG(
      "Barbie movie poster, blonde woman smiling beside a pink vintage car, bright pink background, retro style, stylized title text Barbie"
    ),
  },
  {
    id: "killers",
    title: "Killers of the Flower Moon",
    ano: 2023,
    rating: 4.2,
    sinopse:
      "No Oklahoma dos anos 1920, membros da tribo Osage são assassinados após descobrirem petróleo, e o FBI inicia uma investigação.",
    img: IMG(
      "Killers of the Flower Moon movie poster, serious man in early 1900s suit, muted sepia tones, dramatic portrait, visible title text"
    ),
  },
  {
    id: "interstellar",
    title: "Interstellar",
    ano: 2014,
    rating: 4.5,
    sinopse:
      "Em um futuro onde a Terra está morrendo, um grupo de exploradores viaja por um buraco de minhoca em busca de um novo lar para a humanidade.",
    img: IMG(
      "Interstellar movie poster, astronaut standing before a massive black hole and star field, deep space, blue and amber light, visible title text"
    ),
  },
];

// Menu de navegação.
const MENU = ["Filmes"];

// Avaliação por estrelas (preenchidas + meia estrela).
function Stars({ value = 4.5 }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <div className="flex items-center gap-0.5 text-amber-400">
      {Array.from({ length: full }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-current" />
      ))}
      {half && <StarHalf className="h-4 w-4 fill-current" />}
    </div>
  );
}

// Converte um filme da API do TMDB para o formato usado nos cards.
function paraCard(filme) {
  return {
    id: filme.id,
    title: filme.title,
    genres: filme.release_date ? filme.release_date.slice(0, 4) : "Filme",
    ano: filme.release_date ? filme.release_date.slice(0, 4) : null,
    rating: filme.vote_average ? filme.vote_average / 2 : 0,
    img: filme.poster_path ? `${IMG_BASE}${filme.poster_path}` : null,
    desc: filme.overview || "Sem sinopse disponível.",
  };
}

// Card reutilizado tanto pelos filmes salvos quanto pelos resultados de busca.
function FilmeCard({ m, onClick, delay = 0 }) {
  return (
    <article
      onClick={onClick}
      className="w-60 shrink-0 cursor-pointer rounded-2xl bg-white/[0.03] p-3.5 ring-1 ring-white/10 shadow-lg shadow-black/40 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-black/60"
    >
      {/* Pôster miniatura */}
      <div className="overflow-hidden rounded-xl">
        {m.img ? (
          <img
            src={m.img}
            alt={m.title}
            className="aspect-[2/3] w-full object-cover transition-all duration-300 ease-out hover:scale-110 hover:brightness-110 hover:shadow-[0_30px_80px_-15px_rgba(34,211,238,0.6)]"
            style={{
              animation: "float 6s ease-in-out infinite",
              animationDelay: `${delay * 0.35}s`,
            }}
          />
        ) : (
          <div className="flex aspect-[2/3] w-full items-center justify-center text-gray-600">
            <Film className="h-10 w-10" />
          </div>
        )}
      </div>

      {/* Play grande + adicionar à lista */}
      <div className="mt-4 flex items-center gap-3">
        <button
          aria-label={`Reproduzir ${m.title}`}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-cyan-500 text-white shadow-md shadow-cyan-500/30 transition-colors hover:bg-cyan-400"
        >
          <Play className="h-6 w-6 fill-current" />
        </button>
        <button
          aria-label="Adicionar à lista"
          className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white/30 text-white transition-colors hover:border-white"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      {/* Detalhes */}
      <h3 className="mt-4 truncate text-base font-bold text-white">{m.title}</h3>
      <p className="mt-1.5 text-xs text-gray-400">{m.genres || m.ano}</p>
      <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-gray-400">
        {m.desc || m.sinopse || "Sem sinopse disponível."}
      </p>
      <div className="mt-4">
        <Stars value={m.rating} />
      </div>
    </article>
  );
}

// Modal com os detalhes do filme selecionado (capa, ano, nota e sinopse).
function ModalFilme({ filme, onFechar, onSalvar }) {
  if (!filme) return null;

  const ano = filme.ano || null;
  const nota = filme.rating ?? null;
  const sinopse = filme.sinopse || filme.desc || "Sinopse não disponível.";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onFechar} />

      <div className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-zinc-900 shadow-2xl ring-1 ring-white/10 sm:flex-row">
        <button
          onClick={onFechar}
          className="absolute right-3 top-3 z-10 rounded-full bg-black/60 p-2 text-white transition-colors hover:bg-black/80"
          aria-label="Fechar"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Capa do filme */}
        <div className="h-64 w-full shrink-0 bg-zinc-800 sm:h-auto sm:w-64">
          {filme.img ? (
            <img src={filme.img} alt={filme.title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-zinc-600">
              <Film className="h-16 w-16" />
            </div>
          )}
        </div>

        {/* Detalhes */}
        <div className="flex-1 overflow-y-auto p-6">
          <h2 className="pr-8 text-2xl font-bold text-white">{filme.title}</h2>

          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-400">
            {ano && <span>{ano}</span>}
            {nota ? (
              <span className="flex items-center gap-1 text-cyan-400">
                <Star className="h-4 w-4 fill-current" /> {nota}
              </span>
            ) : null}
          </div>

          <h3 className="mt-5 text-sm font-semibold uppercase tracking-wide text-gray-500">
            Sinopse
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-300">{sinopse}</p>

          <button
            onClick={() => onSalvar(filme)}
            className="mt-6 flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-cyan-500/25 transition-all hover:scale-105 hover:opacity-90"
          >
            <Plus className="h-4 w-4" /> Salvar Filme
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  // "Dune: Part Two" é o pôster central do carrossel.
  const center = CAROUSEL.findIndex((m) => m.title === "Dune: Part Two");

  // Estado da busca por nome do filme (TMDB).
  const [termo, setTermo] = useState("");
  const [resultados, setResultados] = useState([]);
  const [buscou, setBuscou] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  // Filme selecionado para exibir a sinopse no modal.
  const [selecionado, setSelecionado] = useState(null);

  // Filmes salvos pelo usuário.
  const [salvos, setSalvos] = useState([]);

  function salvarFilme(filme) {
    setSalvos((prev) =>
      prev.some((f) => f.id === filme.id) ? prev : [...prev, filme]
    );
    setSelecionado(null);
  }

  async function aoBuscar(e) {
    e.preventDefault();
    const q = termo.trim();
    if (!q) return;
    setCarregando(true);
    setErro("");
    setBuscou(true);
    try {
      const filmes = await buscarFilmes(q);
      setResultados(filmes.map(paraCard));
    } catch (err) {
      setErro(err.message || "Erro ao buscar filmes.");
      setResultados([]);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#0d3a3a] via-[#0a1f1f] to-[#0a0a0a]">
      {/* Cabeçalho / Navegação global */}
      <header className="flex items-center justify-between gap-6 px-10 py-6 lg:px-16">
        <a href="#" className="flex items-center gap-2.5">
          <span className="text-2xl font-extrabold tracking-wide text-white">Buscador de Filmes</span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {MENU.map((item) => {
            const ativo = item === "Filmes";
            return (
              <a
                key={item}
                href="#"
                className={`relative text-sm transition-colors ${
                  ativo
                    ? "font-bold text-white after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-full after:rounded-full after:bg-white"
                    : "font-medium text-gray-400 hover:text-white"
                }`}
              >
                {item}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-5">
          <form
            onSubmit={aoBuscar}
            className="flex items-center gap-2 rounded-full bg-white/5 px-4 py-2 ring-1 ring-white/15 transition-shadow focus-within:ring-cyan-400/60"
          >
            <input
              value={termo}
              onChange={(e) => setTermo(e.target.value)}
              placeholder="Buscar filme..."
              className="w-36 bg-transparent text-sm text-white placeholder-gray-500 outline-none sm:w-56"
            />
            <button type="submit" aria-label="Pesquisar" className="text-gray-300 hover:text-white">
              <Search className="h-5 w-5" />
            </button>
          </form>
          <button className="flex items-center gap-1 text-sm font-medium text-white">
            Paulo
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </button>
        </div>
      </header>

      {/* ===== Hero: carrossel 3D de pôsteres ===== */}
      <section className="relative overflow-hidden px-10 py-20 lg:px-16">
        {/* Brilho azul/ciano de fundo (iluminação cinematográfica) */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.18),transparent_60%)]" />

        <div
          className="relative flex items-center justify-center"
          style={{ perspective: "1200px" }}
        >
          {CAROUSEL.map((m, i) => {
            const off = i - center;
            const abs = Math.abs(off);

            // Pôster central claramente maior (~35% maior que os vizinhos).
            const scale = off === 0 ? 1.22 : 1 - abs * 0.115;
            const rotateY = off * -12;
            const translateZ = -abs * 55;
            const z = 20 - abs;

            const sombra =
              off === 0
                ? "shadow-[0_50px_100px_-12px_rgba(0,0,0,0.9)] ring-1 ring-cyan-300/25"
                : "shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] ring-1 ring-white/10";

            return (
              <figure
                key={m.id}
                className="w-56 shrink-0"
                style={{
                  marginLeft: i === 0 ? 0 : "-1.5rem",
                  transform: `rotateY(${rotateY}deg) translateZ(${translateZ}px) scale(${scale})`,
                  zIndex: z,
                  transformStyle: "preserve-3d",
                }}
              >
                <img
                  src={m.img}
                  alt={m.title}
                  onClick={() => setSelecionado(m)}
                  className={`aspect-[2/3] w-full cursor-pointer rounded-lg object-cover transition-all duration-300 ease-out hover:scale-110 hover:brightness-110 hover:shadow-[0_30px_80px_-15px_rgba(34,211,238,0.6)] ${sombra}`}
                  style={{
                    animation: "float 6s ease-in-out infinite",
                    animationDelay: `${i * 0.35}s`,
                  }}
                />
              </figure>
            );
          })}
        </div>
      </section>

      {/* ===== Resultados da busca ===== */}
      {buscou && (
        <section className="px-10 pb-12 lg:px-16">
          <h2 className="mb-8 text-2xl font-extrabold text-white">
            Resultados para “{termo}”
          </h2>

          {carregando ? (
            <p className="text-gray-400">Buscando filmes...</p>
          ) : erro ? (
            <p className="text-gray-400">{erro}</p>
          ) : resultados.length === 0 ? (
            <p className="text-gray-400">Nenhum filme encontrado para “{termo}”.</p>
          ) : (
            <div className="no-scrollbar flex gap-8 overflow-x-auto pb-4">
              {resultados.map((m, i) => (
                <FilmeCard key={m.id} m={m} delay={i} onClick={() => setSelecionado(m)} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* ===== Filmes Salvos ===== */}
      <section className="px-10 pb-20 lg:px-16">
        <h2 className="mb-8 text-2xl font-extrabold text-white">Filmes Salvos</h2>

        {salvos.length === 0 ? (
          <p className="text-gray-400">
            Nenhum filme salvo ainda. Pesquise um filme e clique em “Salvar Filme”.
          </p>
        ) : (
          <div className="no-scrollbar flex gap-8 overflow-x-auto pb-4">
            {salvos.map((m, i) => (
              <FilmeCard key={m.id} m={m} delay={i} onClick={() => setSelecionado(m)} />
            ))}
          </div>
        )}
      </section>

      <ModalFilme
        filme={selecionado}
        onFechar={() => setSelecionado(null)}
        onSalvar={salvarFilme}
      />
    </div>
  );
}
