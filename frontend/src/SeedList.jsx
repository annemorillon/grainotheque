import { useState, useEffect } from 'react'

const TYPE_COLORS = {
'Légume': 'bg-green-100 text-green-700',
'Fleur':  'bg-pink-100 text-pink-700',
'Herbe':  'bg-yellow-100 text-yellow-700',
}

function SeedCard({ seed }) {
const badgeColor = TYPE_COLORS[seed.type] ?? 'bg-gray-100 text-gray-700'

return (
	<div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col gap-3 hover:shadow-md transition-shadow">
	<div className="w-full h-36 bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center">
		{seed.image_url ? (
		<img
			src={`http://localhost:3000${seed.image_url}`}
			alt={seed.name}
			className="w-full h-full object-cover"
		/>
		) : (
		<span className="text-4xl">🌱</span>
		)}
	</div>

	<div className="flex items-start justify-between gap-2">
		<h2 className="font-semibold text-gray-800 text-sm leading-tight">{seed.name}</h2>
		<span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${badgeColor}`}>
		{seed.type}
		</span>
	</div>

	<div className="flex items-center justify-between text-xs text-gray-500">
		{seed.season && <span>🗓 {seed.season}</span>}
		<span className="ml-auto">{seed.quantity} dispo</span>
	</div>

	<button className="w-full mt-1 bg-green-600 hover:bg-green-700 text-white text-xs font-medium py-2 rounded-xl transition-colors">
		Demander un troc
	</button>
	</div>
)
}

function SeedList() {
const [seeds, setSeeds] = useState([])
const [loading, setLoading] = useState(true)
const [error, setError] = useState(null)

useEffect(() => {
	fetch('http://localhost:3000/seeds')
	.then(res => res.json())
	.then(data => {
		setSeeds(data)
		setLoading(false)
	})
	.catch(() => {
		setError('Impossible de charger les graines')
		setLoading(false)
	})
}, [])

if (loading) return (
	<div className="flex items-center justify-center h-48 text-gray-400 text-sm">
	Chargement des graines...
	</div>
)

if (error) return (
	<div className="flex items-center justify-center h-48 text-red-400 text-sm">
	{error}
	</div>
)

return (
	<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
	{seeds.map(seed => (
		<SeedCard key={seed.id} seed={seed} />
	))}
	</div>
)
}

export default SeedList