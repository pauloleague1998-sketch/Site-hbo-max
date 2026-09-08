// Configuração e funções de acesso à API do TMDB (The Movie Database).

const API_KEY = "ad118bce1d067485ec470df15495adb9";
const BASE_URL = "https://api.themoviedb.org/3";
export const IMG_BASE = "https://image.tmdb.org/t/p/w500";

async function requisitar(caminho, params = "") {
  const res = await fetch(
    `${BASE_URL}${caminho}?api_key=${API_KEY}&language=pt-BR${params}`
  );
  if (!res.ok) {
    throw new Error("Não foi possível acessar o TMDB. Tente novamente.");
  }
  const dados = await res.json();
  return dados.results ?? [];
}

// Busca filmes pelo nome digitado pelo usuário.
export function buscarFilmes(query) {
  return requisitar("/search/movie", `&query=${encodeURIComponent(query)}`);
}

// Lista de filmes populares exibidos antes da primeira busca.
export function buscarPopulares() {
  return requisitar("/movie/popular", "&page=1");
}

// Lista de séries populares (normalizadas para o mesmo formato de filme,
// para que os cards e o modal funcionem com os mesmos campos).
export async function buscarSeriesPopulares() {
  const series = await requisitar("/tv/popular", "&page=1");
  return series.map((s) => ({
    ...s,
    title: s.name,
    release_date: s.first_air_date,
  }));
}
