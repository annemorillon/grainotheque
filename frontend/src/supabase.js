const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

async function request(path, { prefer = 'return=minimal', ...options } = {}) {
  const response = await fetch(`${supabaseUrl}${path}`, {
    ...options,
    headers: {
      apikey: supabaseKey,
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      Prefer: prefer,
      ...options.headers,
    },
  })
  const body = await response.json().catch(() => null)
  if (!response.ok) throw new Error(body?.message || body?.error || 'Erreur Supabase')
  return body
}

export const listSeeds = () => request('/rest/v1/seeds?select=*&order=created_at.desc')

export async function deleteSeed(id) {
  await request(`/rest/v1/seeds?id=eq.${encodeURIComponent(id)}`, { method: 'DELETE' })
}

export async function saveSeed(seed, id) {
  const path = id ? `/rest/v1/seeds?id=eq.${encodeURIComponent(id)}` : '/rest/v1/seeds'
  const data = await request(path, {
    method: id ? 'PATCH' : 'POST',
    body: JSON.stringify(seed),
    prefer: 'return=representation',
  })
  if (!data?.[0]) throw new Error('Supabase n’a pas renvoyé la graine enregistrée')
  return data[0]
}

export async function uploadSeedImage(file) {
  const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const path = `${crypto.randomUUID()}.${extension}`
  const response = await fetch(`${supabaseUrl}/storage/v1/object/seeds-images/${path}`, {
    method: 'POST',
    headers: {
      apikey: supabaseKey,
      'Content-Type': file.type,
    },
    body: file,
  })
  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new Error(body?.message || 'Erreur lors de l’envoi de la photo')
  }
  return `${supabaseUrl}/storage/v1/object/public/seeds-images/${path}`
}

export const submitRequest = (seed_id, message) => request('/rest/v1/requests', {
  method: 'POST',
  body: JSON.stringify({ seed_id, message }),
})
