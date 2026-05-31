import { useState } from 'react'
import SeedList from './SeedList'
import AddSeedForm from './AddSeedForm'

function App() {
  const [showForm, setShowForm]   = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  function handleSeedAdded() {
    setShowForm(false)
    setRefreshKey(k => k + 1)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-green-700">🌱 Grainothèque</h1>
          <p className="text-xs text-gray-500 mt-0.5">Le tinder du troc de graines</p>
        </div>
        <button
          onClick={() => setShowForm(f => !f)}
          className="text-sm bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-xl transition-colors"
        >
          {showForm ? 'Annuler' : '+ Ajouter'}
        </button>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 flex flex-col gap-6">
        {showForm && <AddSeedForm onSeedAdded={handleSeedAdded} />}
        <SeedList key={refreshKey} />
      </main>
    </div>
  )
}

export default App