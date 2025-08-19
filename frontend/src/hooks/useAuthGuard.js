import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function useAuthGuard() {
  const navigate = useNavigate()
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) navigate('/login')
  }, [navigate])
}