import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../api/client'
import StatusBadge from '../components/StatusBadge'
import useAuthGuard from '../hooks/useAuthGuard'

function groupByStatus(items) {
  const groups = { safe: [], expiring: [], expired: [] }
  items.forEach((it) => groups[it.status]?.push(it))
  return groups
}

export default function Dashboard() {
  useAuthGuard()
  const qc = useQueryClient()
  const { data, isLoading } = useQuery({ queryKey: ['items'], queryFn: async () => (await api.get('/api/items')).data })
  const del = useMutation({ mutationFn: async (id) => (await api.delete(`/api/items/${id}`)).data, onSuccess: () => qc.invalidateQueries({ queryKey: ['items'] }) })

  async function requestPushPermission() {
    if (!('Notification' in window)) return alert('Notifications not supported')
    const perm = await Notification.requestPermission()
    if (perm !== 'granted') return
    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.register('/sw.js')
      const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY
      if (!vapidPublicKey) return
      const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey)
      const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: convertedVapidKey })
      await api.post('/api/push/subscribe', sub)
      alert('Push notifications enabled')
    }
  }

  function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
    const rawData = atob(base64)
    const outputArray = new Uint8Array(rawData.length)
    for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i)
    return outputArray
  }

  if (isLoading) return <div>Loading...</div>
  const groups = groupByStatus(data || [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <button className="px-3 py-2 bg-indigo-600 text-white rounded" onClick={requestPushPermission}>Enable Notifications</button>
      </div>

      {['expiring','expired','safe'].map((key) => (
        <section key={key}>
          <h2 className="text-xl font-medium mb-2 capitalize">{key}</h2>
          <div className="bg-white shadow rounded divide-y">
            {(groups[key] || []).map((it) => (
              <div key={it.id} className="p-3 flex items-center justify-between">
                <div>
                  <div className="font-medium">{it.name} <StatusBadge status={it.status} /></div>
                  <div className="text-sm text-gray-600">Qty: {it.quantity} • Category: {it.category || '—'} • Expiry: {it.expiry_date}</div>
                </div>
                <div className="flex gap-2">
                  {/* Edit could be added here */}
                  <button className="px-2 py-1 bg-red-600 text-white rounded" onClick={()=>del.mutate(it.id)}>Delete</button>
                </div>
              </div>
            ))}
            {(!groups[key] || groups[key].length === 0) && (
              <div className="p-3 text-sm text-gray-500">No items</div>
            )}
          </div>
        </section>
      ))}
    </div>
  )
}