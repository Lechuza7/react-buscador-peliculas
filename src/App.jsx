import { useEffect, useState } from "react";
import "./App.css";
import { Movies } from "./components/Movies.jsx";
import { useMovies } from "./hooks/useMovies.js";

function useSearch () {
  const [search, updateSearch] = useState('')
  const [error, setError] = useState(null)

  useEffect(() => {
    if (search === '') {
      setError('No se puede hacer una búsqueda vacía')
      return
    }

    if (search.match(/^\d+$/)) {
      setError('No se pueden hacer búsquedas númericas')
      return
    }

    if (search.length < 3) {
      setError('La búsqueda debe tener almenos 3 caracteres')
      return
    }

    setError(null)
  }, [search])

  return { search, updateSearch, error }
}

function App() {
  const [sort, setSort] = useState(false)

  const { search, updateSearch, error } = useSearch();
  const { movies, loading, getMovies } = useMovies({ search, sort });

  const handleSubmit = (event) => {
    event.preventDefault();
    getMovies()
  };

  const handleSort = () => {
    setSort(!sort)
  }

  const handleChange = (event) => {
    updateSearch(event.target.value);
  };



  return (
    <div className="page">
      <header>
        <h1>Buscador de películas</h1>
        <form className="form" onSubmit={handleSubmit}>
          <input
            style={{
              border: '1px solid transparent',
              borderColor: error ? 'red' : 'transparent'
            }}
            onChange={handleChange}
            value={search}
            name="search"
            placeholder="Big Fish, Lock & Stock, Star Wars..."
          />
          <input type='checkbox' onChange={handleSort} checked={sort} />
          <button type="submit">Buscar</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </header>

      <main>
        {
          loading ? <p>Cargando...</p> : <Movies movies={movies} />
        }
        
      </main>
    </div>
  );
}

export default App;
