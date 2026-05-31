import { http } from '@/lib/axios'

export const getNowPlaying = () => http.get('/movie/now_playing')

export const getPopular = () => http.get('/movie/popular')

export const getMovieDetail = (id: number) => http.get(`/movie/${id}`)
