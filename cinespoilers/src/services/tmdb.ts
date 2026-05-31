import api from '@/lib/axios'

export const tmdb = {
  movies: {
    popular: (page = 1) =>
      api.get('/movie/popular', { params: { language: 'es-ES', page } }),

    topRated: (page = 1) =>
      api.get('/movie/top_rated', { params: { language: 'es-ES', page } }),

    details: (id: number) =>
      api.get(`/movie/${id}`, { params: { language: 'es-ES' } }),

    search: (query: string, page = 1) =>
      api.get('/search/movie', { params: { query, language: 'es-ES', page } }),
  },

  tv: {
    popular: (page = 1) =>
      api.get('/tv/popular', { params: { language: 'es-ES', page } }),

    topRated: (page = 1) =>
      api.get('/tv/top_rated', { params: { language: 'es-ES', page } }),

    details: (id: number) =>
      api.get(`/tv/${id}`, { params: { language: 'es-ES' } }),

    search: (query: string, page = 1) =>
      api.get('/search/tv', { params: { query, language: 'es-ES', page } }),
  },
}
