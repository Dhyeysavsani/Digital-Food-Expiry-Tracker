export default function NotificationButton({ onEnable }) {
  return (
    <button className="px-3 py-2 bg-indigo-600 text-white rounded" onClick={onEnable}>Enable Notifications</button>
  )
}