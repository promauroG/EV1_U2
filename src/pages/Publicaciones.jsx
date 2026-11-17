import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { obtenerPosts, reaccionarPost } from '../services/post'

const REACCIONES_OFICIALES = [
  { type: 'like', emoji: '👍', label: 'Me gusta' },
  { type: 'love', emoji: '❤️', label: 'Me encanta' },
  { type: 'haha', emoji: '😂', label: 'Me divierte' },
  { type: 'wow', emoji: '😮', label: 'Me sorprende' },
  { type: 'sad', emoji: '😢', label: 'Me entristece' },
  { type: 'angry', emoji: '😡', label: 'Me enoja' },
]

function Publicaciones() {
  const [posts, setPosts] = useState([])
  const [cargando, setCargando] = useState(true)
  const [avisoError, setAvisoError] = useState('')

  const cargarPublicaciones = async () => {
    try {
      setCargando(true)
      const lista = await obtenerPosts()
      setPosts(lista)
    } catch (error) {
      setAvisoError(error.message)
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargarPublicaciones()
  }, [])

  const handleReaccion = async (postId, type) => {
    setAvisoError('')
    try {
      const { counts } = await reaccionarPost(postId, type)

      // Actualizamos en pantalla los contadores usando el objeto counts devuelto
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, reactions: counts } : post
        )
      )
    } catch (error) {
      // Muestra el mensaje de advertencia si es 409 Conflict u otro error
      setAvisoError(error.message)
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
            Muro de{' '}
            <span className="bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text text-transparent">
              Publicaciones
            </span>
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Lee las ideas y preguntas de tus compañeros o comparte la tuya.
          </p>
        </div>

        <Link
          to="/crear-post"
          className="rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-violet-500/25 transition-transform hover:scale-[1.02]"
        >
          + Nueva publicación
        </Link>
      </header>

      {avisoError && (
        <div
          role="alert"
          className="flex items-center justify-between rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800 shadow-sm"
        >
          <span>⚠️ {avisoError}</span>
          <button
            type="button"
            onClick={() => setAvisoError('')}
            className="ml-4 font-bold text-amber-900 hover:opacity-75"
          >
            ✕
          </button>
        </div>
      )}

      {cargando ? (
        <div className="rounded-2xl border border-neutral-200 bg-white p-10 text-center text-sm text-neutral-500">
          Cargando publicaciones de la clase...
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-2xl border border-neutral-200 bg-white p-10 text-center text-sm text-neutral-500">
          Aún no hay publicaciones. ¡Sé el primero en crear una!
        </div>
      ) : (
        <div className="space-y-5">
          {posts.map((post) => (
            <article
              key={post.id}
              className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-500">
                <span className="font-semibold text-violet-700">
                  {post.author?.name || 'Anónimo'}
                </span>
                <time dateTime={post.createdAt}>
                  {new Date(post.createdAt).toLocaleString('es-CL')}
                </time>
              </div>

              <h2 className="mt-2 text-xl font-bold text-neutral-900">
                {post.title}
              </h2>

              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-neutral-600">
                {post.content}
              </p>

              {/* Barra de los 6 tipos oficiales de reacción */}
              <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-neutral-100 pt-4">
                {REACCIONES_OFICIALES.map((reac) => {
                  const cantidad = post.reactions?.[reac.type] ?? 0
                  return (
                    <button
                      key={reac.type}
                      type="button"
                      onClick={() => handleReaccion(post.id, reac.type)}
                      title={reac.label}
                      className="flex cursor-pointer items-center gap-1.5 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-medium text-neutral-700 transition-colors hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700"
                    >
                      <span className="text-base">{reac.emoji}</span>
                      <span>{cantidad}</span>
                    </button>
                  )
                })}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}

export default Publicaciones