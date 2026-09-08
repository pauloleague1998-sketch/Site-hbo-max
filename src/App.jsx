import { useEffect, useRef, useState } from "react";
import {
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Instagram,
  Loader2,
  Play,
  Twitter,
  Youtube,
} from "lucide-react";
import MovieCard from "./components/MovieCard.jsx";
import MovieModal from "./components/MovieModal.jsx";
import { buscarFilmes, buscarPopulares, buscarSeriesPopulares } from "./tmdb.js";

// Imagem de fundo do hero (destaque em tela cheia).
const HERO_BG =
  "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=epic%20fantasy%20tv%20series%20key%20art%2C%20massive%20dragon%20silhouette%20over%20dark%20medieval%20castle%2C%20purple%20and%20magenta%20fire%20glow%2C%20cinematic%20dramatic%20lighting&image_size=landscape_16_9";

// Itens do menu de navegação.
const MENU = [
  { rotulo: "Início", href: "#inicio" },
  { rotulo: "Filmes", href: "#filmes" },
  { rotulo: "Séries", href: "#series" },
  { rotulo: "Esportes", href: "#esportes" },
  { rotulo: "Planos", href: "#planos" },
];

// Planos de assinatura (o do meio é o destaque "Mais Popular").
const PLANOS = [
  {
    nome: "Com Anúncios",
    preco: "27,90",
    destaque: false,
    beneficios: ["Catálogo completo", "Full HD", "2 telas simultâneas", "Com anúncios"],
  },
  {
    nome: "Sem Anúncios",
    preco: "37,90",
    destaque: true,
    beneficios: ["Catálogo completo", "Full HD", "3 telas simultâneas", "Sem anúncios"],
  },
  {
    nome: "Premium 4K",
    preco: "49,90",
    destaque: false,
    beneficios: ["Catálogo completo", "4K + Dolby Atmos", "5 telas simultâneas", "Sem anúncios"],
  },
];

// Colunas do rodapé.
const COLUNAS_FOOTER = [
  { titulo: "Sobre", links: ["A HBO Max", "Imprensa", "Carreiras"] },
  { titulo: "Suporte", links: ["Central de ajuda", "Dispositivos", "Fale conosco"] },
  { titulo: "Legal", links: ["Termos de uso", "Privacidade", "Cookies"] },
];

// Carrossel horizontal reutilizável com setas laterais.
function Carrossel({ id, titulo, itens, onAbrir }) {
  const trackRef = useRef(null);

  const rolar = (dir) => {
    const track = trackRef.current;
    const card = track?.querySelector("article");
    const largura = card ? card.offsetWidth + 16 : 600;
    track?.scrollBy({ left: dir * largura * 3, behavior: "smooth" });
  };

  return (
    <section id={id} className="py-6">
      <h2 className="reveal mx-[5%] mb-4 text-2xl font-bold">{titulo}</h2>
      <div className="relative px-[5%]">
        <button
          onClick={() => rolar(-1)}
          aria-label="Anterior"
          className="absolute left-2 top-[45%] z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-dark2/85 text-white transition-colors hover:bg-brand md:flex"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>

        <div
          ref={trackRef}
          className="no-scrollbar flex gap-4 overflow-x-auto scroll-smooth pb-2"
        >
          {itens.map((filme) => (
            <MovieCard key={filme.id} filme={filme} onClick={() => onAbrir(filme)} />
          ))}
        </div>

        <button
          onClick={() => rolar(1)}
          aria-label="Próximo"
          className="absolute right-2 top-[45%] z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-dark2/85 text-white transition-colors hover:bg-brand md:flex"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </div>
    </section>
  );
}

export default function App() {
  // Conteúdo dos carrosséis (dados reais do TMDB).
  const [series, setSeries] = useState([]);
  const [filmes, setFilmes] = useState([]);
  const [filmeSelecionado, setFilmeSelecionado] = useState(null);

  // Máquina de estados do formulário: idle | loading | error | success.
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");

  // Navegação.
  const [menuAberto, setMenuAberto] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Busca de filmes (resultados exibidos abaixo da barra).
  const [busca, setBusca] = useState("");
  const [resultados, setResultados] = useState(null);
  const [buscando, setBuscando] = useState(false);
  const [erroBusca, setErroBusca] = useState("");
  const [termoBuscado, setTermoBuscado] = useState("");

  // Carrega séries e filmes ao abrir.
  useEffect(() => {
    buscarSeriesPopulares().then(setSeries).catch(() => setSeries([]));
    buscarPopulares().then(setFilmes).catch(() => setFilmes([]));
  }, []);

  // Fundo sólido da navbar ao rolar.
  useEffect(() => {
    const aoRolar = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", aoRolar);
    aoRolar();
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  // Revelação ao rolar (fade-in nas seções).
  useEffect(() => {
    const elementos = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    elementos.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // ===== Transições da máquina de estados do formulário =====
  const emailValido = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

  const enviar = (e) => {
    e.preventDefault();
    if (status === "loading") return;

    // Validação → estado de erro.
    if (!emailValido(email)) {
      setStatus("error");
      return;
    }

    // Envio → estado de carregamento.
    setStatus("loading");

    // Simula a chamada assíncrona de cadastro.
    setTimeout(() => {
      setStatus("success");

      // Redireciona em 2s e volta ao estado inicial.
      setTimeout(() => {
        document.getElementById("filmes")?.scrollIntoView({ behavior: "smooth" });
        setEmail("");
        setStatus("idle");
      }, 2000);
    }, 1400);
  };

  const irParaCadastro = () =>
    document.getElementById("cadastro")?.scrollIntoView({ behavior: "smooth" });

  const aoBuscar = async (e) => {
    e.preventDefault();
    const termo = busca.trim();
    if (!termo || buscando) return;

    setBuscando(true);
    setErroBusca("");
    try {
      const dados = await buscarFilmes(termo);
      setResultados(dados);
      setTermoBuscado(termo);
    } catch (erro) {
      setResultados([]);
      setTermoBuscado(termo);
      setErroBusca(erro.message);
    } finally {
      setBuscando(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark font-sans text-white">
      {/* ===================== NAVBAR ===================== */}
      <nav
        className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between gap-4 px-[5%] py-5 transition-all ${
          scrolled ? "bg-dark/95 py-3.5 shadow-[0_2px_20px_rgba(0,0,0,0.5)]" : ""
        }`}
      >
        {/* Logo "HBO" branco + "MAX" em gradiente */}
        <a href="#inicio" className="text-[32px] font-black leading-none tracking-wide">
          <span className="text-white">HBO</span>
          <span className="bg-gradient-to-r from-brand to-magenta bg-clip-text text-transparent">
            MAX
          </span>
        </a>

        {/* Links do menu (desktop) */}
        <ul className="hidden items-center gap-7 lg:flex">
          {MENU.map((item) => (
            <li key={item.rotulo}>
              <a
                href={item.href}
                className="group relative py-1 text-sm font-medium text-white transition-colors"
              >
                {item.rotulo}
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 rounded bg-brand transition-all duration-300 group-hover:w-full" />
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a href="#" className="hidden text-sm font-medium text-white transition-colors hover:text-muted lg:block">
            Login
          </a>
          <button
            onClick={irParaCadastro}
            className="hidden rounded-[50px] bg-gradient-to-r from-brand to-magenta px-7 py-3 text-sm font-bold text-white transition-all hover:from-magenta hover:to-brand hover:brightness-110 sm:inline-flex"
          >
            Assine
          </button>

          {/* Hambúrguer (mobile) */}
          <button
            onClick={() => setMenuAberto(!menuAberto)}
            aria-label="Menu"
            className="flex flex-col gap-1.5 p-1.5 lg:hidden"
          >
            <span
              className={`h-0.5 w-6 bg-white transition-all ${menuAberto ? "translate-y-2 rotate-45" : ""}`}
            />
            <span className={`h-0.5 w-6 bg-white transition-all ${menuAberto ? "opacity-0" : ""}`} />
            <span
              className={`h-0.5 w-6 bg-white transition-all ${menuAberto ? "-translate-y-2 -rotate-45" : ""}`}
            />
          </button>
        </div>

        {/* Menu mobile aberto */}
        {menuAberto && (
          <div className="absolute inset-x-0 top-full flex flex-col gap-4 border-t border-line bg-dark/95 px-[5%] py-6 lg:hidden">
            {MENU.map((item) => (
              <a
                key={item.rotulo}
                href={item.href}
                onClick={() => setMenuAberto(false)}
                className="text-base font-medium text-white"
              >
                {item.rotulo}
              </a>
            ))}
            <a href="#" className="text-base font-medium text-white">
              Login
            </a>
            <button
              onClick={() => {
                setMenuAberto(false);
                irParaCadastro();
              }}
              className="rounded-[50px] bg-gradient-to-r from-brand to-magenta px-7 py-3 text-sm font-bold text-white"
            >
              Assine
            </button>
          </div>
        )}
      </nav>

      {/* ===================== HERO ===================== */}
      <header
        id="inicio"
        className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-[5%] py-32 text-center"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_BG})` }}
        />
        {/* Overlay gradiente preto (70%) para contraste */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/70 to-dark" />

        <div className="relative z-10">
          <p className="anim-slide-up mb-5 text-sm font-bold uppercase tracking-[3px] text-muted">
            Série Original HBO
          </p>
          <h1
            className="anim-slide-up max-w-[14ch] bg-gradient-to-b from-white to-muted bg-clip-text text-5xl font-black uppercase leading-[0.95] tracking-wide text-transparent sm:text-7xl lg:text-8xl"
            style={{ animationDelay: ".08s" }}
          >
            House of the Dragon
          </h1>
          <p
            className="anim-slide-up mx-auto mt-5 max-w-[50ch] text-base text-muted sm:text-xl"
            style={{ animationDelay: ".16s" }}
          >
            A dança dos dragões começa. Uma nova temporada épica, repleta de poder, traição e fogo.
          </p>

          <div
            className="anim-slide-up mt-9 flex flex-wrap items-center justify-center gap-4"
            style={{ animationDelay: ".24s" }}
          >
            <button className="inline-flex items-center gap-2 rounded-[50px] bg-gradient-to-r from-brand to-magenta px-12 py-4 text-lg font-bold text-white transition-all hover:from-magenta hover:to-brand hover:brightness-110">
              <Play className="h-5 w-5 fill-current" />
              Assistir Agora
            </button>
            <button className="inline-flex rounded-[50px] border-2 border-white bg-transparent px-11 py-4 text-lg font-bold text-white transition-colors hover:bg-white/10">
              Saiba Mais
            </button>
          </div>
        </div>
      </header>

      {/* ===================== BUSCA ===================== */}
      <section id="busca" className="bg-dark px-[5%] py-16 text-center">
        <h2 className="reveal text-3xl font-bold sm:text-4xl">Buscar filmes</h2>
        <p className="reveal mt-3 text-muted">Encontre um título para assistir agora</p>

        <form
          onSubmit={aoBuscar}
          className="reveal mx-auto mt-8 flex w-full max-w-xl flex-col gap-3 sm:flex-row sm:items-stretch"
          noValidate
        >
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Digite o nome de um filme..."
            aria-label="Buscar filme"
            className="h-[58px] w-full flex-1 rounded-[50px] border-2 border-line bg-dark2 px-6 text-base text-white outline-none transition-all placeholder:text-[#6b6b6b] focus:border-brand focus:shadow-[0_0_0_3px_rgba(107,44,245,0.25)] sm:max-w-[400px]"
          />
          <button
            type="submit"
            disabled={buscando}
            className="inline-flex h-[58px] items-center justify-center gap-2 rounded-[50px] bg-gradient-to-r from-brand to-magenta px-8 text-base font-bold text-white transition-all hover:from-magenta hover:to-brand hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {buscando ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Buscando...
              </>
            ) : (
              "Buscar"
            )}
          </button>
        </form>

        {erroBusca && (
          <p className="mt-4 text-sm font-medium text-[#FF3366]">{erroBusca}</p>
        )}
      </section>

      {/* Resultados da busca */}
      {resultados !== null && (
        <section className="px-[5%] py-8">
          <h2 className="reveal mb-6 text-2xl font-bold">
            {termoBuscado ? `Resultados para "${termoBuscado}"` : "Resultados"}
          </h2>
          {resultados.length === 0 ? (
            <p className="text-muted">Nenhum filme encontrado. Tente outro nome.</p>
          ) : (
            <div className="flex flex-wrap justify-center gap-4">
              {resultados.map((filme) => (
                <MovieCard
                  key={filme.id}
                  filme={filme}
                  onClick={() => setFilmeSelecionado(filme)}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* ===================== CADASTRO ===================== */}
      <section id="cadastro" className="bg-dark px-[5%] py-20 text-center">
        <h2 className="reveal mx-auto max-w-[20ch] text-4xl font-bold leading-tight sm:text-5xl">
          Tudo o que você ama em um só lugar
        </h2>
        <p className="reveal mt-4 text-lg text-muted sm:text-xl">
          Filmes, séries, esportes ao vivo e muito mais
        </p>

        {/* Prova social agrupada (gap 8px — lei da proximidade) */}
        <div className="reveal mt-7 flex flex-wrap items-center justify-center gap-2 text-sm font-medium text-muted">
          <span className="flex items-center gap-1.5">
            <Check className="h-4 w-4 text-brand" /> 7 dias grátis
          </span>
          <span className="font-bold text-brand">·</span>
          <span>Depois R$ 27,90/mês</span>
          <span className="font-bold text-brand">·</span>
          <span>Cancele quando quiser</span>
        </div>

        {/* Formulário (máquina de estados) */}
        <form
          onSubmit={enviar}
          className="reveal mx-auto mt-12 flex w-full max-w-xl flex-col gap-3 sm:flex-row sm:items-stretch"
          noValidate
        >
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status === "error") setStatus("idle");
            }}
            placeholder="Digite seu email"
            aria-label="Email"
            autoComplete="email"
            className={`h-[58px] w-full flex-1 rounded-[50px] border-2 bg-dark2 px-6 text-base text-white outline-none transition-all placeholder:text-[#6b6b6b] sm:max-w-[400px] ${
              status === "error"
                ? "border-[#FF3366] shadow-[0_0_0_3px_rgba(255,51,102,0.2)]"
                : "border-line focus:border-brand focus:shadow-[0_0_0_3px_rgba(107,44,245,0.25)]"
            }`}
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className={`inline-flex h-[58px] items-center justify-center gap-2 rounded-[50px] bg-gradient-to-r from-brand to-magenta px-8 text-base font-bold text-white transition-all hover:from-magenta hover:to-brand hover:brightness-110 ${
              status === "loading" ? "cursor-not-allowed opacity-50" : ""
            }`}
          >
            {status === "loading" ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Processando...
              </>
            ) : status === "success" ? (
              <>
                <Check className="h-5 w-5 text-[#00FF88]" />
                Conta criada
              </>
            ) : (
              "Começar teste grátis"
            )}
          </button>
        </form>

        {/* Feedback da máquina de estados */}
        <div className="mt-4 flex min-h-[26px] items-center justify-center">
          {status === "error" && (
            <p className="text-sm font-medium text-[#FF3366]">Email inválido</p>
          )}
          {status === "success" && (
            <p className="flex items-center gap-2 text-sm font-medium text-[#00FF88]">
              <CheckCircle2 className="h-4 w-4" />
              Conta criada! Redirecionando...
            </p>
          )}
        </div>
      </section>

      {/* ===================== CARROSSÉIS ===================== */}
      <main className="pb-8">
        <Carrossel id="series" titulo="Originais HBO" itens={series} onAbrir={setFilmeSelecionado} />
        <Carrossel id="filmes" titulo="Filmes em Destaque" itens={filmes} onAbrir={setFilmeSelecionado} />
      </main>

      {/* ===================== PLANOS ===================== */}
      <section id="planos" className="bg-dark2 px-[5%] py-20">
        <h2 className="reveal text-center text-3xl font-bold sm:text-4xl">Escolha seu plano</h2>
        <p className="reveal mt-3 text-center text-muted">
          Cancele quando quiser. Todos os planos incluem 7 dias grátis.
        </p>

        <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
          {PLANOS.map((plano) => (
            <article
              key={plano.nome}
              className={`reveal relative flex flex-col rounded-xl border bg-dark p-8 transition-transform hover:-translate-y-1.5 ${
                plano.destaque
                  ? "border-2 border-brand shadow-[0_0_40px_rgba(107,44,245,0.25)]"
                  : "border-line"
              }`}
            >
              {plano.destaque && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-[50px] bg-gradient-to-r from-brand to-magenta px-5 py-1.5 text-xs font-bold text-white">
                  Mais Popular
                </span>
              )}

              <h3 className="text-xl font-bold">{plano.nome}</h3>
              <div className="mt-3 text-4xl font-extrabold">
                R$ {plano.preco}
                <small className="text-base font-medium text-muted">/mês</small>
              </div>

              <ul className="my-6 flex flex-1 flex-col gap-3.5">
                {plano.beneficios.map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-sm text-muted">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                    {b}
                  </li>
                ))}
              </ul>

              <button
                onClick={irParaCadastro}
                className="w-full rounded-[50px] bg-gradient-to-r from-brand to-magenta py-3.5 text-base font-bold text-white transition-all hover:from-magenta hover:to-brand hover:brightness-110"
              >
                Assinar
              </button>
            </article>
          ))}
        </div>
      </section>

      {/* ===================== FOOTER ===================== */}
      <footer className="border-t border-line bg-dark px-[5%] py-16">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 md:grid-cols-4">
          {COLUNAS_FOOTER.map((col) => (
            <div key={col.titulo}>
              <h4 className="mb-4 text-sm font-bold">{col.titulo}</h4>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-muted transition-colors hover:text-white">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="mb-4 text-sm font-bold">Redes Sociais</h4>
            <div className="flex gap-3.5">
              <a
                href="#"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-white transition-all hover:border-brand hover:bg-brand"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="Twitter"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-white transition-all hover:border-brand hover:bg-brand"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="YouTube"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-white transition-all hover:border-brand hover:bg-brand"
              >
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <p className="mt-10 text-center text-xs text-muted opacity-70">
          © 2026 HBO Max. Todos os direitos reservados.
        </p>
      </footer>

      {/* Modal de detalhes do conteúdo */}
      <MovieModal filme={filmeSelecionado} onFechar={() => setFilmeSelecionado(null)} />
    </div>
  );
}
