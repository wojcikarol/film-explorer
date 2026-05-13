import { http, HttpResponse, delay } from "msw";
import type {
  GenresResponse,
  MovieDetails,
  MoviesResponse,
} from "@/types/movie";
import type { RamResponse } from "@/types/character";

const GENRES: GenresResponse = {
  genres: [
    { id: 28, name: "Action" },
    { id: 12, name: "Adventure" },
    { id: 16, name: "Animation" },
    { id: 35, name: "Comedy" },
    { id: 18, name: "Drama" },
    { id: 27, name: "Horror" },
    { id: 878, name: "Science Fiction" },
    { id: 10749, name: "Romance" },
  ],
};

const TITLES = [
  "Neon Drift",
  "Echoes of Mars",
  "The Glass Forest",
  "Quantum Hearts",
  "Velvet Storm",
  "Last Light",
  "Paper Tigers",
  "Midnight Cartographer",
  "Hollow Saints",
  "Aurora Protocol",
  "Salt & Static",
  "Iron Lullaby",
  "Gravity's Daughter",
  "Slow Comets",
  "The Quiet Engine",
  "Brass Cathedrals",
  "Pale Horizons",
  "Wires of Olympus",
  "Crimson Archive",
  "Northern Mirror",
];

function makeMovie(i: number) {
  const id = 1000 + i;
  return {
    id,
    title: TITLES[i % TITLES.length] + " " + Math.floor(i / TITLES.length + 1),
    overview:
      "A sweeping tale of ambition, loss, and an unexpected discovery that reshapes everything the protagonists thought they knew.",
    poster_path: null,
    backdrop_path: null,
    release_date: `20${10 + (i % 14)}-0${(i % 9) + 1}-15`,
    vote_average: Math.round((5 + (i % 50) / 10) * 10) / 10,
    vote_count: 1000 + i * 11,
    genre_ids: [GENRES.genres[i % GENRES.genres.length].id, GENRES.genres[(i + 2) % GENRES.genres.length].id],
    popularity: 100 - i,
  };
}

function buildPage(page: number, total = 60): MoviesResponse {
  const perPage = 20;
  const total_pages = Math.ceil(total / perPage);
  const start = (page - 1) * perPage;
  const results = Array.from({ length: perPage }, (_, k) => makeMovie(start + k));
  return { page, results, total_pages, total_results: total };
}

const TMDB = "https://api.themoviedb.org/3";

export const handlers = [
  http.get(`${TMDB}/movie/popular`, async ({ request }) => {
    await delay(900);
    const url = new URL(request.url);
    if (url.searchParams.get("mockError") === "true") {
      return HttpResponse.json(
        { status_message: "Invalid API key.", status_code: 7 },
        { status: 401 },
      );
    }
    const page = Number(url.searchParams.get("page") || "1");
    return HttpResponse.json(buildPage(page));
  }),

  http.get(`${TMDB}/search/movie`, async ({ request }) => {
    await delay(800);
    const url = new URL(request.url);
    if (url.searchParams.get("mockEmpty") === "true") {
      return HttpResponse.json<MoviesResponse>({
        page: 1,
        results: [],
        total_pages: 0,
        total_results: 0,
      });
    }
    const q = (url.searchParams.get("query") || "").toLowerCase();
    const page = Number(url.searchParams.get("page") || "1");
    const all = Array.from({ length: 40 }, (_, i) => makeMovie(i)).filter((m) =>
      m.title.toLowerCase().includes(q),
    );
    if (all.length === 0) {
      return HttpResponse.json<MoviesResponse>({
        page: 1,
        results: [],
        total_pages: 0,
        total_results: 0,
      });
    }
    const perPage = 20;
    const total_pages = Math.max(1, Math.ceil(all.length / perPage));
    const start = (page - 1) * perPage;
    return HttpResponse.json<MoviesResponse>({
      page,
      results: all.slice(start, start + perPage),
      total_pages,
      total_results: all.length,
    });
  }),

  http.get(`${TMDB}/movie/:id`, async ({ params }) => {
    await delay(700);
    const id = Number(params.id);
    const base = makeMovie(id - 1000);
    const details: MovieDetails = {
      ...base,
      id,
      genres: [GENRES.genres[id % GENRES.genres.length], GENRES.genres[(id + 1) % GENRES.genres.length]],
      runtime: 90 + (id % 60),
      status: "Released",
      budget: 25_000_000,
      revenue: 110_000_000,
      tagline: "Some stories choose you.",
      homepage: null,
    };
    return HttpResponse.json(details);
  }),

  http.get(`${TMDB}/genre/movie/list`, async () => {
    await delay(400);
    return HttpResponse.json(GENRES);
  }),

  http.get("https://rickandmortyapi.com/api/character", async ({ request }) => {
    await delay(600);
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") || "1");
    const results = Array.from({ length: 20 }, (_, i) => {
      const id = (page - 1) * 20 + i + 1;
      return {
        id,
        name: `Character ${id}`,
        status: (id % 3 === 0 ? "Dead" : "Alive") as "Alive" | "Dead",
        species: id % 2 ? "Human" : "Alien",
        type: "",
        gender: id % 2 ? "Male" : "Female",
        image: `https://rickandmortyapi.com/api/character/avatar/${((id - 1) % 826) + 1}.jpeg`,
        origin: { name: "Earth", url: "" },
        location: { name: "Earth", url: "" },
      };
    });
    const resp: RamResponse = {
      info: { count: 200, pages: 10, next: page < 10 ? "next" : null, prev: page > 1 ? "prev" : null },
      results,
    };
    return HttpResponse.json(resp);
  }),
];