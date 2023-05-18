import { useRef, useState } from 'react'
import { searchMovies } from '../services/movies.js'

export function useMovies ({ search }) {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  //usaremos useRef para almacenar el valor de la búsqueda previa entre renderizados e impedir con ese dato repetir dicha búsqueda
  const previousSearch = useRef(search)

  const getMovies = async () => {
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

  return { movies, loading, getMovies, error }
}