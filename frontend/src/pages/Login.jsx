import { useState } from 'react'
import api from '../api/client'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  const [isSignup, setIsSignup] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')

  async function submit(e) {
    e.preventDefault()
    setError('')
    try {
      const url = isSignup ? '/api/auth/signup' : '/api/auth/login'
      const payload = isSignup ? form : { email: form.email, password: form.password }
      const { data } = await api.post(url, payload)
      localStorage.setItem('token', data.token)
      navigate('/')
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed')
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-4">{isSignup ? 'Sign Up' : 'Log In'}</h1>
      <form className="space-y-3" onSubmit={submit}>
        {isSignup && (
          <input className="w-full border rounded p-2" placeholder="Name" value={form.name} onChange={(e)=>setForm({ ...form, name: e.target.value })} />
        )}
        <input className="w-full border rounded p-2" placeholder="Email" type="email" value={form.email} onChange={(e)=>setForm({ ...form, email: e.target.value })} />
        <input className="w-full border rounded p-2" placeholder="Password" type="password" value={form.password} onChange={(e)=>setForm({ ...form, password: e.target.value })} />
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <button className="px-3 py-2 rounded bg-blue-600 text-white" type="submit">{isSignup ? 'Create account' : 'Log in'}</button>
      </form>
      <button className="mt-3 text-blue-600" onClick={()=>setIsSignup(!isSignup)}>
        {isSignup ? 'Have an account? Log in' : "No account? Sign up"}
      </button>
    </div>
  )
}