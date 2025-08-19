export default function StatusBadge({ status }) {
  const map = {
    safe: 'bg-green-100 text-green-800',
    expiring: 'bg-yellow-100 text-yellow-800',
    expired: 'bg-red-100 text-red-800'
  }
  return <span className={`px-2 py-1 rounded text-xs font-medium ${map[status] || ''}`}>{status}</span>
}