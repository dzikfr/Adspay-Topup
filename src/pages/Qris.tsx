import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { generateQris, monitorMerchant } from "../utils/api";

export function Qris() {
  const [activeTab, setActiveTab] = useState<"generate" | "monitor">(
    "generate"
  );
  const [nmid, setNmid] = useState<string>("");
  const [type, setType] = useState<"STATIC" | "DYNAMIC">("STATIC");
  const [amount, setAmount] = useState<string>("");
  const [qrResult, setQrResult] = useState<any | null>(null);
  const [merchantList, setMerchantList] = useState<any[]>([]);
  const [loadingMerchants, setLoadingMerchants] = useState<boolean>(false);
  const qrCodeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/qrcodejs/qrcode.min.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (qrResult && qrCodeRef.current && (window as any).QRCode) {
      const QRCode = (window as any).QRCode;
      qrCodeRef.current.innerHTML = "";
      new QRCode(qrCodeRef.current, {
        text: qrResult.qr_string,
        width: 200,
        height: 200,
      });
    } else if (qrCodeRef.current) {
      qrCodeRef.current.innerHTML = "";
    }
  }, [qrResult]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!nmid) {
      alert("Pilih merchant terlebih dahulu.");
      return;
    }
    const params = new URLSearchParams();
    params.append("nmid", nmid);
    params.append("type", type);
    if (type === "DYNAMIC" && amount) params.append("amount", amount);
    try {
      //   const response = await fetch(`http://38.47.94.165:3132/api/bank/qris/generate?${params.toString()}`, {
      //     method: "POST",
      //   });
      const response = await generateQris(params);
      const json = response.data;
      if (json.resp_code !== "00") {
        alert("❌ Gagal generate QRIS: " + json.resp_message);
        return;
      }
      // Save only the necessary portion of the response to state
      setQrResult({
        merchant_name: json.data.merchant_name,
        merchant_city: json.data.merchant_city,
        nmid: json.data.nmid,
        type: json.data.type,
        amount: type === "DYNAMIC" && amount ? amount : null,
        qr_string: json.data.qr_string,
      });
    } catch (err: any) {
      alert("Terjadi kesalahan: " + err.message);
    }
  }

  async function loadMerchants() {
    setLoadingMerchants(true);
    try {
      const res = await monitorMerchant();
      const json = res.data;

      const list = Array.isArray(json)
        ? json
        : Array.isArray(json.data)
        ? json.data
        : [];
      setMerchantList(list);
    } catch (err: any) {
      alert("Gagal memuat data merchant: " + err.message);
      setMerchantList([]);
    } finally {
      setLoadingMerchants(false);
    }
  }

  useEffect(() => {
    if (activeTab === "monitor") {
      loadMerchants();
    }
  }, [activeTab]);

  const merchantOptions = [
    { value: "9110012345678", name: "TOKO AZZAM", city: "Jakarta" },
    { value: "9110012345679", name: "KOPI KENANGAN", city: "Bandung" },
    { value: "9110012345680", name: "WARUNG BU RINI", city: "Surabaya" },
    { value: "9110012345681", name: "TOKO ELEKTRONIK JAYA", city: "Semarang" },
    { value: "9110012345682", name: "MINIMARKET MAKMUR", city: "Depok" },
  ];

  return (
    <div className=" bg-gray-100 py-10 px-4 flex flex-col items-center w-full">
      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-800 mb-8">QRIS Simulator</h1>
      {/* Card with tabs */}
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-5xl">
        {/* Tab headers */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("generate")}
            className={`w-1/2 py-3 text-center font-semibold border-b-2 ${
              activeTab === "generate"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-blue-600"
            }`}
          >
            Generate QRIS
          </button>
          <button
            onClick={() => setActiveTab("monitor")}
            className={`w-1/2 py-3 text-center font-semibold border-b-2 ${
              activeTab === "monitor"
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-blue-600"
            }`}
          >
            Monitor Merchant
          </button>
        </div>

        {/* Generate tab content */}
        {activeTab === "generate" && (
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5" id="qrisForm">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Pilih Merchant
                </label>
                <select
                  value={nmid}
                  onChange={(e) => setNmid(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Pilih Merchant --</option>
                  {merchantOptions.map((m) => (
                    <option key={m.value} value={m.value}>
                      {`${m.name} (${m.city})`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Jenis QR
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="STATIC">Static (tanpa nominal)</option>
                  <option value="DYNAMIC">Dynamic (dengan nominal)</option>
                </select>
              </div>

              <div className={type === "STATIC" ? "opacity-50" : ""}>
                <label className="block text-gray-700 font-medium mb-1">
                  Nominal (untuk Dynamic QR)
                </label>
                <input
                  type="number"
                  value={amount}
                  disabled={type === "STATIC"}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
                  placeholder="contoh: 15000"
                />
              </div>

              <div className="flex justify-center">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow"
                >
                  Generate QRIS
                </button>
              </div>
            </form>

            {qrResult && (
              <div id="resultSection" className="mt-8 text-center">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  QRIS Generated ✅
                </h2>
                <div ref={qrCodeRef} className="flex justify-center mb-4"></div>
                <div className="bg-gray-50 rounded-lg p-4 text-left border">
                  <p>
                    <strong>Merchant:</strong> {qrResult.merchant_name}
                  </p>
                  <p>
                    <strong>Kota:</strong> {qrResult.merchant_city}
                  </p>
                  <p>
                    <strong>NMID:</strong> {qrResult.nmid}
                  </p>
                  <p>
                    <strong>Jenis:</strong> {qrResult.type}
                  </p>
                  <p>
                    <strong>Nominal:</strong>{" "}
                    {qrResult.amount ? `Rp ${qrResult.amount}` : "-"}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Monitor tab content */}
        {activeTab === "monitor" && (
          <div className="p-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Daftar Merchant & Saldo
              </h2>
              <button
                onClick={loadMerchants}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg shadow text-sm"
              >
                Refresh
              </button>
            </div>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left text-sm text-gray-700">
                  <th className="p-2 border-b">NMID</th>
                  <th className="p-2 border-b">Nama Merchant</th>
                  <th className="p-2 border-b">Kota</th>
                  <th className="p-2 border-b">Rekening</th>
                  <th className="p-2 border-b text-right">Saldo</th>
                  <th className="p-2 border-b">Status</th>
                </tr>
              </thead>
              <tbody>
                {loadingMerchants ? (
                  <tr>
                    <td colSpan={6} className="p-3 text-center text-gray-400">
                      Loading...
                    </td>
                  </tr>
                ) : merchantList.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-3 text-center text-gray-400">
                      Data merchant tidak tersedia
                    </td>
                  </tr>
                ) : (
                  merchantList.map((m, idx) => {
                    const saldo = Number(m.balance || 0);
                    const saldoColor =
                      saldo < 0
                        ? "text-red-600 font-bold"
                        : "text-green-600 font-bold";
                    return (
                      <tr
                        key={idx}
                        className="border-b hover:bg-gray-50 text-sm"
                      >
                        <td className="p-2">{m.nmid ?? "-"}</td>
                        <td className="p-2">{m.merchantName ?? "-"}</td>
                        <td className="p-2">{m.merchantCity ?? "-"}</td>
                        <td className="p-2">{m.accountNo ?? "-"}</td>
                        <td className={`p-2 text-right ${saldoColor}`}>
                          Rp {saldo.toLocaleString("id-ID")}
                        </td>
                        <td className="p-2">{m.status ?? "-"}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Link
        to="/"
        className="mt-10 block text-center text-blue-600 hover:underline"
      >
        ← Kembali ke menu Topup
      </Link>
      <footer className="mt-10 text-gray-500 text-sm text-center">
        Made for AdsPay • Bank Simulator QRIS Module © 2025
      </footer>
    </div>
  );
}
