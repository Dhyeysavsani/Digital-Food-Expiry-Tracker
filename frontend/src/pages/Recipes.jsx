import { useQuery } from '@tanstack/react-query'
import api from '../api/client'
import useAuthGuard from '../hooks/useAuthGuard'

export default function Recipes() {
  useAuthGuard()
  const { data, isLoading } = useQuery({ queryKey: ['recipes'], queryFn: async () => (await api.get('/api/recipes')).data })
  if (isLoading) return <div>Loading...</div>
  const recipes = data?.recipes || []
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Recipe Suggestions</h1>
      <div className="grid md:grid-cols-2 gap-4">
        {recipes.map((r)=> (
          <div key={r.id} className="bg-white shadow rounded p-4">
            <div className="font-medium text-lg">{r.title}</div>
            {r.ingredients?.length ? (
              <div className="text-sm text-gray-700 mt-1">Ingredients: {r.ingredients.join(', ')}</div>
            ) : null}
            {r.steps?.length ? (
              <ol className="list-decimal ml-5 mt-2 text-sm text-gray-700">
                {r.steps.map((s, i)=>(<li key={i}>{s}</li>))}
              </ol>
            ) : null}
          </div>
        ))}
      </div>
      {!recipes.length && <div className="text-gray-500">No suggestions right now.</div>}
    </div>
  )
}