# Movie Browser

Aplikacja React + TypeScript + Vite (TanStack Start) pokazująca integrację z REST API.

## Funkcje

- Lista popularnych filmów z TMDB + paginacja klasyczna
- Wyszukiwanie filmów (debounce 300 ms, start od 2 znaków)
- Modal szczegółów filmu z lazy fetch (`enabled`)
- Ulubione w `localStorage` (klucz `movie-browser-favorites`) z optimistic update
- Filtrowanie po gatunku
- Infinite scroll (`useInfiniteQuery` + IntersectionObserver) z przełącznikiem
- Sekcja warm-up: Rick & Morty API
- Pełna obsługa stanów: loading (skeleton + shimmer), error (ErrorBanner z retry), empty (EmptyState), success, placeholder data
- React Query v5 + ReactQueryDevtools
- MSW v2 — mockowanie wszystkich endpointów (z opóźnieniem ~800 ms i opcjami testowania błędu 401 / pustego wyniku)

## Uruchomienie

```bash
bun install      # albo npm install
cp .env.example .env
# uzupełnij VITE_TMDB_API_KEY (lub zostaw VITE_ENABLE_MOCKS=true, by korzystać tylko z mocków)
bun dev          # albo npm run dev
```

## Konfiguracja `.env`

| Zmienna | Opis |
| --- | --- |
| `VITE_TMDB_BASE_URL` | Bazowy URL TMDB (`https://api.themoviedb.org/3`) |
| `VITE_TMDB_API_KEY`  | Klucz TMDB (NIE commituj!) |
| `VITE_ENABLE_MOCKS`  | `true` włącza MSW również poza dev |

Klucz API **nie jest hardcodowany** — wczytujemy go wyłącznie z `import.meta.env`.

## MSW (mockowanie HTTP)

W trybie deweloperskim worker startuje automatycznie (`src/mocks/browser.ts → enableMocking()` w `src/routes/index.tsx`).
Plik service workera leży w `public/mockServiceWorker.js`.

Mockowane endpointy:
- `GET /movie/popular` — dodaj `?mockError=true` aby zwrócić **401**
- `GET /search/movie` — dodaj `?mockEmpty=true` aby zwrócić pustą listę
- `GET /movie/:id`
- `GET /genre/movie/list`
- `GET https://rickandmortyapi.com/api/character`

Aby wyłączyć mocki w dev — usuń `VITE_ENABLE_MOCKS` i edytuj `src/mocks/browser.ts` (warunek `isDev`).

## Alternatywnie: Requestly

1. Zainstaluj rozszerzenie [Requestly](https://requestly.io/).
2. Utwórz regułę **Modify API Response**.
3. Warunek: URL **contains** `api.themoviedb.org/3/movie/popular`.
4. W body wklej przykładowy JSON odpowiadający `MoviesResponse`.
5. Włącz **Add Delay** = `1000 ms`.
6. Aby przetestować `ErrorBanner`, użyj **Override Status Code** = `500`.

## Struktura

```
src/
  api/            tmdbClient.ts, endpoints.ts
  hooks/          useFetchMovies, useMovieDetails, useDebounce, useFavorites,
                  useCharacters, useInfiniteMovies, useGenres
  components/     MovieCard, MovieModal, SkeletonCard, ErrorBanner, EmptyState,
                  SearchBar, Pagination, GenreFilter, InfiniteMovieList, CharacterWarmup
  mocks/          handlers.ts, browser.ts
  constants/      queryKeys.ts
  types/          movie.ts, character.ts
  App.tsx
  routes/         index.tsx (mountuje App + uruchamia MSW)
```
