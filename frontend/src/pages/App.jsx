import { Link, Outlet, useNavigate } from 'react-router-dom'

export default function App() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const logout = () => { localStorage.removeItem('token'); navigate('/login') }
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white shadow sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="text-xl font-semibold">DFET</Link>
          <div className="flex items-center gap-4">
            <Link to="/" className="hover:text-blue-600">Dashboard</Link>
            <Link to="/add" className="hover:text-blue-600">Add Item</Link>
            <Link to="/recipes" className="hover:text-blue-600">Recipes</Link>
            {!token ? (
              <Link to="/login" className="px-3 py-1 rounded bg-blue-600 text-white">Login</Link>
            ) : (
              <button onClick={logout} className="px-3 py-1 rounded bg-gray-200">Logout</button>
            )}
          </div>
        </div>
      </nav>
      <main className="flex-1 max-w-5xl mx-auto w-full p-4">
        <Outlet />
      </main>
      <footer className="py-4 text-center text-sm text-gray-500">© {new Date().getFullYear()} DFET</footer>
    </div>
  )
}