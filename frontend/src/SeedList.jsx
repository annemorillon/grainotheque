import { useState, useEffect, useRef } from 'react'

const TYPE_COLORS = {
  'Légume': 'bg-green-100 text-green-700',
  'Fleur':  'bg-pink-100 text-pink-700',
  'Herbe':  'bg-yellow-100 text-yellow-700',
}

function SeedCard({ seed, onEdit, onDelete, onTroc }) {
  const badgeColor = TYPE_COLORS[seed.type] ?? 'bg-gray-100 text-gray-700'
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef()

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col gap-3 hover:shadow-md transition-shadow justify-between relative">
      <div>
        <div className="w-full h-36 bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center relative">
          {seed.image_url ? (
            <img
              src={seed.image_url} 
              alt={seed.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-4xl">🌱</span>
          )}

          <div className="absolute top-2 right-2" ref={menuRef}>
            <button
              type="button"
              onClick={() => setShowMenu(!showMenu)}
              className="w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full shadow flex items-center justify-center text-xs text-gray-700 hover:bg-white transition-colors"
            >
              ⚙️
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-10 w-28 text-left animate-in fade-in zoom-in-95 duration-100">
                <button
                  type="button"
                  onClick={() => { onEdit(seed); setShowMenu(false); }}
                  className="w-full px-3 py-1.5 text-xs text-green-600 hover:bg-green-50 font-medium transition-colors block text-left"
                >
                  ✏️ Modifier
                </button>
                <button
                  type="button"
                  onClick={() => { onDelete(seed.id, seed.name); setShowMenu(false); }}
                  className="w-full px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 font-medium transition-colors block border-t border-gray-50 text-left"
                >
                  🗑️ Supprimer
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-start justify-between gap-2 mt-3">
          <h2 className="font-semibold text-gray-800 text-sm leading-tight">{seed.name}</h2>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${badgeColor}`}>
            {seed.type}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
          {seed.season && <span>🗓 {seed.season}</span>}
          <span className="ml-auto">{seed.quantity} dispo</span>
        </div>
      </div>

      <button 
        type="button" 
        onClick={() => onTroc(seed)}
		className="w-full bg-green-600 hover:bg-green-700 text-white text-xs font-medium py-2 rounded-xl transition-colors"
      >
        Demander un troc
      </button>
    </div>
  )
}

function Filters({ seeds, onFilter }) {
  const [selectedType, setSelectedType]     = useState('')
  const [selectedSeason, setSelectedSeason] = useState('')

  const [openType, setOpenType]     = useState(false)
  const [openSeason, setOpenSeason] = useState(false)

  const typeRef = useRef()
  const seasonRef = useRef()

  const types   = [...new Set(seeds.map(s => s.type).filter(Boolean))]
  const seasons = [...new Set(seeds.map(s => s.season).filter(Boolean))]

  useEffect(() => {
    function handleClickOutside(e) {
      if (typeRef.current && !typeRef.current.contains(e.target)) setOpenType(false)
      if (seasonRef.current && !seasonRef.current.contains(e.target)) setOpenSeason(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    applyFilters(selectedType, selectedSeason)
  }, [seeds, selectedType, selectedSeason])

  function applyFilters(type, season) {
    const filtered = seeds.filter(seed => {
      const matchType   = type   ? seed.type   === type   : true
      const matchSeason = season ? seed.season === season : true
      return matchType && matchSeason
    })
    onFilter(filtered)
  }

  function handleReset() {
    setSelectedType('')
    setSelectedSeason('')
  }

  const hasActiveFilter = selectedType || selectedSeason

  return (
    <div className="flex flex-wrap gap-3 mb-6 items-center">
      
      <div className="relative" ref={typeRef}>
        <button
          type="button"
          onClick={() => { setOpenType(!openType); setOpenSeason(false); }}
          className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white text-gray-700 min-w-35 text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-green-100 hover:border-green-300 transition-colors"
        >
          <span>{selectedType || "Tous les types"}</span>
          <span className="text-xs text-gray-400">⌵</span>
        </button>

        {openType && (
          <div className="absolute left-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-20 w-48 animate-in fade-in zoom-in-95 duration-100">
            <button
              type="button"
              onClick={() => { setSelectedType(''); setOpenType(false); }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
            >
              Tous les types
            </button>
            {types.map(type => (
              <button
                key={type}
                type="button"
                onClick={() => { setSelectedType(type); setOpenType(false); }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
              >
                {type}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="relative" ref={seasonRef}>
        <button
          type="button"
          onClick={() => { setOpenSeason(!openSeason); setOpenType(false); }}
          className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white text-gray-700 min-w-38.75 text-left flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-green-100 hover:border-green-300 transition-colors"
        >
          <span>{selectedSeason || "Toutes les saisons"}</span>
          <span className="text-xs text-gray-400">▼</span>
        </button>

        {openSeason && (
          <div className="absolute left-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-20 w-48 animate-in fade-in zoom-in-95 duration-100">
            <button
              type="button"
              onClick={() => { setSelectedSeason(''); setOpenSeason(false); }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
            >
              Toutes les saisons
            </button>
            {seasons.map(season => (
              <button
                key={season}
                type="button"
                onClick={() => { setSelectedSeason(season); setOpenSeason(false); }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors"
              >
                {season}
              </button>
            ))}
          </div>
        )}
      </div>

      {hasActiveFilter && (
        <button type="button" onClick={handleReset} className="text-sm text-gray-400 hover:text-gray-600 underline">
          Réinitialiser
        </button>
      )}
    </div>
  )
}

function SeedList({ seeds, loading, error, onEdit, onDelete, onTroc }) {
  const [filteredSeeds, setFilteredSeeds] = useState([])

  if (loading) return <div className="flex items-center justify-center h-48 text-gray-400 text-sm">Chargement des graines...</div>
  if (error) return <div className="flex items-center justify-center h-48 text-red-400 text-sm">{error}</div>

  return (
    <div>
      <Filters seeds={seeds} onFilter={setFilteredSeeds} />

      {filteredSeeds.length === 0 ? (
        <div className="flex items-center justify-center h-48 text-gray-400 text-sm">Aucune graine pour ces filtres.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredSeeds.map(seed => (
            <SeedCard 
              key={seed.id} 
              seed={seed} 
              onEdit={onEdit} 
              onDelete={onDelete} 
              onTroc={onTroc} 
			  />
          ))}
        </div>
      )}
    </div>
  )
}

export default SeedList