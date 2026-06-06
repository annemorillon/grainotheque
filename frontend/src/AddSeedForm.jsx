import { useState, useEffect } from 'react'

const TYPES   = ['Légume', 'Fleur', 'Herbe', 'Fruit', 'Arbre']
const SEASONS = ['Printemps', 'Été', 'Automne', 'Hiver']

function AddSeedForm({ onSeedAdded, seedToEdit, onClose }) { // Ajout de onClose ici
  const [form, setForm] = useState({ name: '', type: '', quantity: '', season: '' })
  const [imageFile, setImageFile]       = useState(null)
  const [previewUrl, setPreviewUrl]     = useState(null)
  const [submitting, setSubmitting]     = useState(false)
  const [error, setError]               = useState(null)

  useEffect(() => {
    if (seedToEdit) {
      setForm({
        name: seedToEdit.name || '',
        type: seedToEdit.type || '',
        quantity: seedToEdit.quantity || '',
        season: seedToEdit.season || '',
      })
      setPreviewUrl(seedToEdit.image_url ? seedToEdit.image_url : null)
    } else {
      setForm({ name: '', type: '', quantity: '', season: '' })
      setPreviewUrl(null)
    }
  }, [seedToEdit])

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  function handleImageChange(e) {
    const file = e.target.files[0]
    if (!file) return

    const MAX_SIZE = 5000 * 1024
    if (file.size > MAX_SIZE) {
      setError("L'image ne doit pas dépasser 5000 Ko.")
      e.target.value = ""
      return
    }

    setError(null)
    setImageFile(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  function handleRemoveImage() {
    setImageFile(null)
    if (previewUrl && previewUrl.startsWith('blob:')) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(null)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    const data = new FormData()
    data.append('name',     form.name)
    data.append('type',     form.type)
    data.append('quantity', form.quantity)
    data.append('season',   form.season)
    if (imageFile) data.append('image', imageFile)

    const isEditing = !!seedToEdit
    const url = isEditing ? `https://grainotheque-production.up.railway.app/seeds/${seedToEdit.id}` : 'https://grainotheque-production.up.railway.app/seeds'

    const method = isEditing ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, { method, body: data })

      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.error || 'Erreur lors de l\'enregistrement')
      }

      const savedSeed = await res.json()
      setForm({ name: '', type: '', quantity: '', season: '' })
      handleRemoveImage()

      // On passe 'PUT' fictivement au parent si on était en train d'éditer pour qu'il mette à jour son tableau
      onSeedAdded(savedSeed, isEditing ? 'PUT' : 'POST')

    } catch (err) {
      setError(err.message || 'Une erreur est survenue')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative bg-white border border-gray-100 rounded-2xl p-5 flex flex-col gap-4 shadow-md max-w-md mx-auto w-full">
      {/* Bouton Fermer / Annuler en haut à droite */}
      <button 
        type="button" 
        onClick={onClose} 
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-medium text-lg"
      >
        ✕
      </button>

      <h2 className="font-semibold text-gray-800 text-base pr-6">
        {seedToEdit ? '✏️ Modifier la graine' : '🌱 Ajouter une graine'}
      </h2>

      {error && <div className="text-sm text-red-500 bg-red-50 rounded-xl px-3 py-2">{error}</div>}

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-600">Nom *</label>
        <input name="name" value={form.name} onChange={handleChange} required className="text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">Type *</label>
          <select name="type" value={form.type} onChange={handleChange} required className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white">
            <option value="">Choisir...</option>
            {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">Quantité</label>
          <input name="quantity" type="number" min="1" value={form.quantity} onChange={handleChange} className="text-sm border border-gray-200 rounded-xl px-3 py-2" />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-600">Période de semis</label>
        <select name="season" value={form.season} onChange={handleChange} className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white">
          <option value="">Choisir...</option>
          {SEASONS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-xs font-medium text-gray-600">Photo</label>
        {previewUrl ? (
          <div className="relative w-full h-36 rounded-xl overflow-hidden bg-gray-50">
            <img src={previewUrl} alt="preview" className="w-full h-full object-cover" />
            <button type="button" onClick={handleRemoveImage} className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs">Retirer</button>
          </div>
        ) : (
          <label className="w-full h-24 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-green-300 transition-colors">
            <span className="text-2xl">📷</span>
            <span className="text-xs text-gray-400">Cliquer pour ajouter une photo</span>
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} className="hidden" />
          </label>
        )}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className={`w-full text-white text-sm font-medium py-2.5 rounded-xl transition-colors bg-green-600 hover:bg-green-700 disabled:bg-gray-300`}
      >
        {submitting ? 'Enregistrement...' : seedToEdit ? 'Mettre à jour' : 'Ajouter la graine'}
      </button>
    </form>
  )
}

export default AddSeedForm