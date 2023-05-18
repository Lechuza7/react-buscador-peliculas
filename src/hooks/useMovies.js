import { useMemo, useRef, useState } from 'react'
import { searchMovies } from '../services/movies.js'

export function useMovies ({ search, sort }) {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  //usaremos useRef para almacenar el valor de la búsqueda previa entre renderizados e impedir con ese dato repetir dicha búsqueda
  const previousSearch = useRef({ search, sort })

  const getMovies = useMemo(() => {
    return async () => {
      if (search === previousSearch.current) return

      try {
        setLoading(true)
        setError(null)
        previousSearch.current = search
        const newMovies = await searchMovies({ search })
        setMovies(newMovies)
      } catch (e) {
        setError(e.message)
      } finally {
        //finally se ejecuta tanto si entre el try como si va por catch
        setLoading(false)
      }
    }
  }, [search])

  // con useMemo hacemos que solamente se actualice el orden de pelis (sort) si se modifica el checkbox sort o las películas.
  // Si no usamos useMemo, al escribir en el input de búsqueda y renderizarse el componente por el onchange, repetirá sort seguido sin necesidad
  const sortedMovies = useMemo(() => {
    return sort
      ? [...movies].sort((a,b) => a.title.localeCompare(b.title))
      : movies
  }, [sort, movies])

  return { movies, loading, getMovies, error }
}

  