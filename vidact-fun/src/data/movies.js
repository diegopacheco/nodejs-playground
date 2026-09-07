export const MOVIES = [
  { id: 'blade-runner-2049', title: 'Blade Runner 2049', year: 2017, genre: 'Sci-Fi', rating: 8.0, priceCents: 449, copies: 3, art: '🌆' },
  { id: 'dune-part-two', title: 'Dune: Part Two', year: 2024, genre: 'Sci-Fi', rating: 8.5, priceCents: 599, copies: 4, art: '🏜️' },
  { id: 'the-godfather', title: 'The Godfather', year: 1972, genre: 'Drama', rating: 9.2, priceCents: 299, copies: 2, art: '🍊' },
  { id: 'parasite', title: 'Parasite', year: 2019, genre: 'Thriller', rating: 8.5, priceCents: 399, copies: 3, art: '🏠' },
  { id: 'mad-max-fury-road', title: 'Mad Max: Fury Road', year: 2015, genre: 'Action', rating: 8.1, priceCents: 349, copies: 1, art: '🔥' },
  { id: 'spirited-away', title: 'Spirited Away', year: 2001, genre: 'Animation', rating: 8.6, priceCents: 329, copies: 5, art: '🐉' },
  { id: 'heat', title: 'Heat', year: 1995, genre: 'Action', rating: 8.3, priceCents: 279, copies: 2, art: '🌃' },
  { id: 'arrival', title: 'Arrival', year: 2016, genre: 'Sci-Fi', rating: 7.9, priceCents: 349, copies: 2, art: '🛸' },
  { id: 'no-country-for-old-men', title: 'No Country for Old Men', year: 2007, genre: 'Thriller', rating: 8.2, priceCents: 299, copies: 1, art: '🤠' },
  { id: 'whiplash', title: 'Whiplash', year: 2014, genre: 'Drama', rating: 8.5, priceCents: 319, copies: 3, art: '🥁' },
  { id: 'the-grand-budapest-hotel', title: 'The Grand Budapest Hotel', year: 2014, genre: 'Comedy', rating: 8.1, priceCents: 289, copies: 4, art: '🛎️' },
  { id: 'everything-everywhere', title: 'Everything Everywhere All at Once', year: 2022, genre: 'Comedy', rating: 7.8, priceCents: 449, copies: 2, art: '🥯' },
]

export const GENRES = ['All', ...[...new Set(MOVIES.map((movie) => movie.genre))].sort()]
