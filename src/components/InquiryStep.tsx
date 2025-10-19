import { useState } from 'react'
import Swal from 'sweetalert2'
import { inquiryVA } from '../utils/api'

export const InquiryStep = ({ onNext }: { onNext: (data: any) => void }) => {
  const [va, setVa] = useState('')
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<any>(null)

  const handleInquiry = async () => {
    if (!va) return Swal.fire('Perhatian', 'Masukkan Nomor VA dahulu', 'warning')
    setLoading(true)
    try {
      const res = await inquiryVA(va)
      if (res.data?.resp_code === '00' && res.data?.data) {
        setData(res.data.data)
        Swal.fire('Sukses', res.data.resp_message, 'success')
      } else {
        Swal.fire('Gagal', res.data?.resp_message || 'VA tidak ditemukan', 'error')
      }
    } catch (err: any) {
      Swal.fire('Error', err?.response?.data?.resp_message || err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
        <label className="label text-white">Nomor VA</label>
        <div className="flex gap-2">
            <input
                value={va}
                onChange={(e) => setVa(e.target.value)}
                className="input input-bordered flex-1 bg-white text-gray-900 placeholder-gray-400"
                placeholder="8808xxxxxxxxxxxx"
            />
            <button
                className="btn btn-primary"
                onClick={handleInquiry}
                disabled={loading}
            >
                {loading ? '...' : 'Cek'}
            </button>
        </div>


      {data && (
        <div className="mt-4 p-4 rounded-xl bg-white border border-base-300">
          <p className="font-semibold">{data.account_name}</p>
          <p className="text-sm text-gray-500">{data.bank_code} - {data.institution_name}</p>
          <p className="text-sm text-gray-600">VA: {data.va_number}</p>
          <p className="text-sm text-gray-600">No. HP: {data.phone_number}</p>
          <div className="mt-3 flex justify-end">
            <button className="btn btn-primary" onClick={() => onNext(data)}>Lanjutkan</button>
          </div>
        </div>
      )}
    </div>
  )
}
