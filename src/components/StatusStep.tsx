export const StatusStep = ({
  status,
  onNew
}: {
  status: any
  onNew: () => void
}) => {
  const success = status?.data?.status === 'SUCCESS'
  const data = status?.data || {}

  return (
    <div className="text-center text-white">
      <div
        className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-3 ${
          success ? 'bg-green-100' : 'bg-red-100'
        }`}
      >
        <span className={`text-3xl ${success ? 'text-green-600' : 'text-red-600'}`}>
          {success ? '✓' : '✗'}
        </span>
      </div>
      <h3 className="text-xl font-semibold">
        {success ? 'Topup Berhasil' : 'Topup Gagal'}
      </h3>
      <p className="text-gray-300 mt-1">{status?.resp_message}</p>

      {success && (
        <div className="mt-5 text-left bg-white border border-base-300 p-4 rounded-xl text-gray-900">
          <h4 className="font-semibold mb-2">E-Receipt</h4>
          <div className="grid grid-cols-2 gap-1 text-sm">
            <span>ID Transaksi</span><span>{data.trxId || '-'}</span>
            <span>Status</span><span>{data.status || '-'}</span>
          </div>
        </div>
      )}

      <div className="mt-4">
        <button className="btn btn-outline" onClick={onNew}>
          Transaksi Baru
        </button>
      </div>
    </div>
  )
}
