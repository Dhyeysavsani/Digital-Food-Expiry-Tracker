import { useEffect, useRef, useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Quagga from 'quagga'
import api from '../api/client'
import useAuthGuard from '../hooks/useAuthGuard'

export default function AddItem() {
  useAuthGuard()
  const qc = useQueryClient()
  const [form, setForm] = useState({ name: '', category: '', expiry_date: '', quantity: 1, barcode: '' })
  const [scanning, setScanning] = useState(false)
  const scannerRef = useRef(null)

  useEffect(() => {
    if (!scanning) return
    Quagga.init({
      inputStream: { type: 'LiveStream', target: scannerRef.current, constraints: { facingMode: 'environment' } },
      decoder: { readers: ['ean_reader', 'upc_reader', 'upc_e_reader', 'code_128_reader'] }
    }, (err) => {
      if (err) { console.error(err); return }
      Quagga.start()
    })
    Quagga.onDetected((data) => {
      const code = data?.codeResult?.code
      if (code) {
        setForm((f) => ({ ...f, barcode: code }))
        setScanning(false)
        Quagga.stop()
      }
    })
    return () => { try { Quagga.stop() } catch {} }
  }, [scanning])

  const create = useMutation({
    mutationFn: async (payload) => (await api.post('/api/items', payload)).data,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['items'] }); setForm({ name: '', category: '', expiry_date: '', quantity: 1, barcode: '' }) }
  })

  function submit(e) {
    e.preventDefault()
    create.mutate(form)
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <h1 className="text-2xl font-semibold mb-4">Add Item</h1>
        <form className="space-y-3" onSubmit={submit}>
          <input className="w-full border rounded p-2" placeholder="Name" value={form.name} onChange={(e)=>setForm({ ...form, name: e.target.value })} />
          <input className="w-full border rounded p-2" placeholder="Category" value={form.category} onChange={(e)=>setForm({ ...form, category: e.target.value })} />
          <input className="w-full border rounded p-2" placeholder="Expiry Date" type="date" value={form.expiry_date} onChange={(e)=>setForm({ ...form, expiry_date: e.target.value })} />
          <input className="w-full border rounded p-2" placeholder="Quantity" type="number" min="1" value={form.quantity} onChange={(e)=>setForm({ ...form, quantity: Number(e.target.value) })} />
          <div className="flex gap-2 items-center">
            <input className="flex-1 border rounded p-2" placeholder="Barcode (optional)" value={form.barcode} onChange={(e)=>setForm({ ...form, barcode: e.target.value })} />
            <button type="button" onClick={()=>setScanning(true)} className="px-3 py-2 rounded bg-gray-200">Scan</button>
          </div>
          <button className="px-3 py-2 rounded bg-blue-600 text-white" type="submit" disabled={create.isPending}>Save</button>
        </form>
      </div>

      <div>
        {scanning && (
          <div>
            <div className="mb-2 font-medium">Scan Barcode</div>
            <div ref={scannerRef} className="w-full aspect-video bg-black rounded overflow-hidden" />
            <button className="mt-2 px-3 py-2 rounded bg-gray-200" onClick={()=>{ setScanning(false); try { Quagga.stop() } catch {} }}>Stop</button>
          </div>
        )}
      </div>
    </div>
  )
}