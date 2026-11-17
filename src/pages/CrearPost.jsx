import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { crearPost } from '../services/post'

const inputClass =
  'w-full rounded-xl border border-neutral-300 bg-neutral-50 px-3.5 py-2.5 text-sm text-neutral-900 transition-colors outline-none placeholder:text-neutral-400 focus:border-violet-500 focus:bg-white focus:ring-2 focus:ring-violet-500/20'

const labelClass = 'mb-1.5 block text-sm font-medium text-neutral-700'

function CrearPost() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [feedback, setFeedback] = useState('')
  const [enviando, setEnviando] = useState(false)

  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFeedback('')

    try {
      setEnviando(true)
      await crearPost({ title, content })
      // Tras obtener 201 Created, redirigimos al listado de publicaciones
      navigate('/posts')
    } catch (error) {
      setFeedback(error.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="mx-auto max-w-lg">
      <header className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
          Nueva{' '}
          <span className="bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
            Publicación
          </span>
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          Comparte una duda, apunte o recurso con toda tu clase.
        </p>
      </header>

      {!token && (
        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-center text-sm text-amber-800">
          ⚠️ No tienes una sesión iniciada.{' '}
          <Link to="/registrarme" className="font-semibold underline">
            Regístrate aquí primero
          </Link>{' '}
          para obtener tu token y poder publicar.
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-5 rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm"
      >
        <div>
          <label htmlFor="title" className={labelClass}>
            Título
          </label>
          <input
            id="title"
            type="text"
            placeholder="Ej: Duda sobre React Router"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputClass}
            required
          />
        </div>

        <div>
          <label htmlFor="content" className={labelClass}>
            Contenido
          </label>
          <textarea
            id="content"
            rows="5"
            placeholder="Escribe aquí los detalles de tu publicación..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={inputClass}
            required
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            to="/posts"
            className="rounded-full border border-neutral-300 px-5 py-2.5 text-sm font-semibold text-neutral-700 transition-colors hover:bg-neutral-100"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={enviando}
            className="cursor-pointer rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {enviando ? 'Publicando...' : 'Publicar'}
          </button>
        </div>

        {feedback && (
          <p
            aria-live="polite"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-700"
          >
            {feedback}
          </p>
        )}
      </form>
    </div>
  )
}

export default CrearPost