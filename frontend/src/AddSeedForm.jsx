import { useState } from 'react'

const TYPES   = ['Légume', 'Fleur', 'Herbe', 'Fruit', 'Arbre']
const SEASONS = ['Printemps', 'Été', 'Automne', 'Hiver']

function AddSeedForm({ onSeedAdded }) {
  const [form, setForm] = useState({
    name:     '',
    type:     '',
    quantity: '',
    season:   '',
  })
  const [imageFile, setImageFile]       = useState(null)
  const [previewUrl, setPreviewUrl]     = useState(null)
  const [submitting, setSubmitting]     = useState(false)
  const [error, setError]               = useState(null)

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  function handleImageChange(e) {
    const file = e.target.files[0]
    if (!file) return

    setImageFile(file)

    // Crée une URL temporaire locale pour la prévisualisation
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
  }

  function handleRemoveImage() {
    setImageFile(null)
    if (previewUrl) URL.revokeObjectURL(previewUrl) // libère la mémoire
    setPreviewUrl(null)
  }

  async function handleSubmit(e) {
    e.preventDefault() // empêche le rechargement de page par défaut
    setError(null)
    setSubmitting(true)

    // FormData pour envoyer texte + fichier en multipart/form-data
    const data = new FormData()
    data.append('name',     form.name)
    data.append('type',     form.type)
    data.append('quantity', form.quantity)
    data.append('season',   form.season)
    if (imageFile) data.append('image', imageFile)

    try {
      const res = await fetch('http://localhost:3000/seeds', {
        method: 'POST',
        body: data,
      })

      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.error || 'Erreur lors de la création')
      }

      const newSeed = await res.json()

      // Réinitialise le formulaire
      setForm({ name: '', type: '', quantity: '', season: '' })
      handleRemoveImage()

      // Informe le parent qu'une graine a été ajoutée
      onSeedAdded(newSeed)

    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-4 shadow-sm">
      <h2 className="font-semibold text-gray-800 text-base">Ajouter une graine</h2>

      {error && (
        <div className="text-sm text-red-500 bg-red-50 rounded-xl px-3 py-2">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-600">Nom *</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="ex: Tomate Cœur de Bœuf"
          required
          className="text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">Type *</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            required
            className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-green-300"
          >
            <option value="">Choisir...</option>
            {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">Quantité</label>
          <input
            name="quantity"
            type="number"
            min="1"
            max="9999"
            value={form.quantity}
            onChange={handleChange}
            placeholder="0"
            className="text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-600">Période de semis</label>
        <select
          name="season"
          value={form.season}
          onChange={handleChange}
          required
          className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-green-300"
        >
          <option value="">Choisir...</option>
          {SEASONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-gray-600">Photo</label>

        {previewUrl ? (
          <div className="relative w-full h-36 rounded-xl overflow-hidden bg-gray-50">
            <img src={previewUrl} alt="Prévisualisation" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-white rounded-full w-6 h-6 text-xs text-gray-500 hover:text-red-500 shadow flex items-center justify-center"
            >
              ✕
            </button>
          </div>
        ) : (
          <label className="w-full h-24 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-green-300 transition-colors">
            <span className="text-2xl">📷</span>
            <span className="text-xs text-gray-400">Cliquer pour ajouter une photo</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        )}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white text-sm font-medium py-2.5 rounded-xl transition-colors"
      >
        {submitting ? 'Ajout en cours...' : 'Ajouter la graine'}
      </button>
    </form>
  )
}

export default AddSeedForm