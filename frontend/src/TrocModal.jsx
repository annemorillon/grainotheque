import { useState, useEffect } from 'react'

function TrocModal({ isOpen, seed, onClose }) {
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState(null) // 'success' ou 'error'

  // Pré-remplit le message dès que la modale s'ouvre pour une graine spécifique
  useEffect(() => {
    if (seed) {
      setMessage(`Bonjour, je souhaite troquer vos graines de "${seed.name}" contre...`)
      setStatus(null)
    }
  }, [seed])

  if (!isOpen) return null

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    setStatus(null)

    try {
      const res = await fetch('https://grainotheque-production.up.railway.app/request', { // Ajuste l'URL selon ton préfixe d'API
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          seed_id: seed.id,
          message: message,
        }),
      })

      if (!res.ok) throw new Error()

      setStatus('success')
      // Ferme la modale automatiquement après 1.5 seconde en cas de succès
      setTimeout(() => {
        onClose()
      }, 1500)
    } catch {
      setStatus('error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-5 max-w-md w-full shadow-xl border border-gray-100 flex flex-col gap-4 relative animate-in fade-in zoom-in-95 duration-150">
        
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-lg"
        >
          ✕
        </button>

        <div>
          <h3 className="font-bold text-gray-900 text-base">🤝 Demander un troc</h3>
          <p className="text-xs text-gray-500 mt-0.5">Proposez un échange pour les graines de <span className="font-semibold text-green-700">{seed?.name}</span></p>
        </div>

        {status === 'success' && (
          <div className="text-sm text-green-600 bg-green-50 rounded-xl px-3 py-2 text-center font-medium">
            🎉 Demande de troc envoyée avec succès !
          </div>
        )}

        {status === 'error' && (
          <div className="text-sm text-red-500 bg-red-50 rounded-xl px-3 py-2 text-center font-medium">
            ❌ Une erreur est survenue. Réessayez.
          </div>
        )}

        {status !== 'success' && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">Votre message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows="4"
                className="text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-300 w-full resize-none"
                placeholder="Spécifiez ce que vous proposez en échange..."
              />
            </div>

            <div className="flex gap-3 mt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-2.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-300 rounded-xl transition-colors"
              >
                {submitting ? 'Envoi...' : 'Envoyer la demande'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default TrocModal