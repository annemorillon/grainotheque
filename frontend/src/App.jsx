import SeedList from './SeedList'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 px-6 py-4">
        <h1 className="text-xl font-bold text-green-700">🌱 Grainothèque</h1>
        <p className="text-xs text-gray-500 mt-0.5">Le tinder du troc de graines</p>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-6">
        <SeedList />
      </main>
    </div>
  )
}

export default App