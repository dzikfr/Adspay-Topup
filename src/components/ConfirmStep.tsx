import { topupVA } from '../utils/api'
import Swal from 'sweetalert2'

export const ConfirmStep = ({
  data,
  amount,
  onNext,
  onBack
}: {
  data: any
  amount: number
  onNext: (status: any) => void
  onBack: () => void
}) => {

  const handleTopup = async () => {
    try {
      const res = await topupVA(data.va_number, amount)
      if (res.data?.resp_code === '00') {
        Swal.fire('Sukses', res.data.resp_message, 'success')
        onNext(res.data)
      } else {
        Swal.fire('Gagal', res.data?.resp_message, 'error')
      }
    } catch (err: any) {
      Swal.fire('Error', err?.response?.data?.resp_message || err.message, 'error')
    }
  }

  return (
    <div>
      <div className="bg-white border border-base-300 rounded-xl p-4">
        <h3 className="font-semibold">Konfirmasi Topup</h3>
        <div className="grid grid-cols-2 text-sm gap-2 mt-3">
          <span>Penerima</span><span>{data.account_name}</span>
          <span>Nomor VA</span><span>{data.va_number}</span>
          <span>Bank</span><span>{data.bank_code}</span>
          <span>Nominal</span><span className="font-semibold text-blue-600">Rp {amount.toLocaleString()}</span>
        </div>
      </div>
      <div className="mt-4 flex justify-between">
        <button className="btn btn-outline" onClick={onBack}>Kembali</button>
        <button className="btn btn-primary" onClick={handleTopup}>Bayar</button>
      </div>
    </div>
  )
}
