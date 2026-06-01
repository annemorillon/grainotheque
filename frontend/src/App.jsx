import { useState, useEffect } from 'react'
import SeedList from './SeedList'
import AddSeedForm from './AddSeedForm'
import ConfirmationModal from './ConfirmationModal'
import TrocModal from './TrocModal'

function App() {
  const [seeds, setSeeds] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const [showForm, setShowForm] = useState(false)
  const [seedToEdit, setSeedToEdit] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  
  // LE LIEN DU PROBLÈME ÉTAIT ICI : déclaration stricte de trocTarget en français
  const [trocTarget, setTrocTarget] = useState(null) 

  // Charge les graines de la base de données au démarrage
  useEffect(() => {
    fetchSeeds()
  }, [])

  function fetchSeeds() {
    setLoading(true)
    fetch('https://grainotheque-production.up.railway.app/seeds')
      .then(res => res.json())
      .then(data => {
        setSeeds(data)
        setLoading(false)
      })
      .catch(() => {
        setError('Impossible de charger les graines')
        setLoading(false)
      })
  }

  function handleToggleForm() {
    if (showForm || seedToEdit) {
      setShowForm(false)
      setSeedToEdit(null)
    } else {
      setShowForm(true)
    }
  }

  function handleStartEdit(seed) {
    setSeedToEdit(seed)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleSeedSaved(savedSeed, method) {
    if (method === 'PUT') {
      setSeeds(prev => prev.map(s => s.id === savedSeed.id ? savedSeed : s))
    } else {
      setSeeds(prev => [...prev, savedSeed])
    }
    setShowForm(false)
    setSeedToEdit(null)
  }

  function handleRequestDelete(id, name) {
    setDeleteTarget({ id, name })
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return
    try {
      const res = await fetch(`https://grainotheque-production.up.railway.app/seeds/${deleteTarget.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      setSeeds(prev => prev.filter(s => s.id !== deleteTarget.id))
    } catch {
      alert('Erreur lors de la suppression de la graine')
    } finally {
      setDeleteTarget(null)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-green-700">🌱 Grainothèque</h1>
          <p className="text-xs text-gray-500 mt-0.5">Le tinder du troc de graines</p>
        </div>
        <button
          onClick={handleToggleForm}
          className={`text-sm font-medium px-4 py-2 rounded-xl transition-colors text-white ${
            showForm ? 'bg-gray-500 hover:bg-gray-600' : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {showForm ? 'Annuler' : '+ Ajouter'}
        </button>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 flex flex-col gap-6">
        {showForm && (
          <AddSeedForm 
            onSeedAdded={handleSeedSaved} 
            seedToEdit={seedToEdit} 
            onClose={handleToggleForm}
          />
        )}
        
        <SeedList 
          seeds={seeds} 
          loading={loading} 
          error={error} 
          onEdit={handleStartEdit}
          onDelete={handleRequestDelete}
          onTroc={setTrocTarget} // Passe bien le setter ici
        />
      </main>

      {/* Modale de confirmation de suppression */}
      <ConfirmationModal
        isOpen={deleteTarget !== null}
        title="Supprimer la graine"
        message={`Voulez-vous vraiment supprimer définitivement "${deleteTarget?.name}" de votre stock ?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Modale de demande de Troc (Ligne 124) */}
      <TrocModal
        isOpen={trocTarget !== null} // Utilise trocTarget de manière sécurisée ici
        seed={trocTarget}
        onClose={() => setTrocTarget(null)}
      />
    </div>
  )
}

export default App