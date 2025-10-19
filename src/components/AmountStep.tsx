import { useState } from 'react'

export const AmountStep = ({
  onNext,
  onBack,
}: {
  onNext: (amount: number) => void
  onBack: () => void
}) => {
  const [amount, setAmount] = useState<number>(0)

  return (
    <div>
        <label className="label text-white">Masukkan nominal topup (IDR)</label>
        <input
            type="number"
            value={amount || ''}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="input input-bordered w-full text-right text-lg font-semibold bg-white text-gray-900 placeholder-gray-400"
            placeholder="0"
        />
        <div className="mt-4 flex justify-between">
            <button className="btn btn-outline" onClick={onBack}>
            Kembali
            </button>
            <button
            className="btn btn-primary"
            onClick={() => onNext(amount)}
            disabled={amount <= 0}
            >
            Lanjut
            </button>
        </div>
    </div>
  )
}
