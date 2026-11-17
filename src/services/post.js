const API_URL = 'https://backend-react-fcsl.onrender.com/api-backend'

// 1. Obtener todas las publicaciones (GET /posts - Público)
export async function obtenerPosts() {
  const res = await fetch(`${API_URL}/posts`)
  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || 'No se pudieron cargar las publicaciones')
  }

  return data.posts
}

// 2. Crear una nueva publicación (POST /posts - Protegido con Token JWT)
export async function crearPost({ title, content }) {
  const token = localStorage.getItem('token')

  if (!token) {
    throw new Error('Debes iniciar sesión o registrarte para poder publicar.')
  }

  const res = await fetch(`${API_URL}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, content }),
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error || `Error al crear publicación (${res.status})`)
  }

  return data.post
}

// 3. Reaccionar a una publicación (POST /posts/:postId/reactions)
export async function reaccionarPost(postId, type) {
  const userGuardado = JSON.parse(localStorage.getItem('user') || 'null')
  const payload = { type }

  // Si hay sesión iniciada enviamos userId; si no, va sin userId (anónimo)
  if (userGuardado?.id) {
    payload.userId = userGuardado.id
  }

  const res = await fetch(`${API_URL}/posts/${postId}/reactions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const data = await res.json()

  // Manejo específico para código 409 Conflict (reacción repetida)
  if (res.status === 409) {
    const error409 = new Error(data.error || 'Ya reaccionaste a este post con este tipo.')
    error409.status = 409
    throw error409
  }

  if (!res.ok) {
    throw new Error(data.error || `Error al reaccionar (${res.status})`)
  }

  return data // Devuelve { reaction, counts }
}