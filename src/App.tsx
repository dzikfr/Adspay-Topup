import { TopUp } from './pages/TopUp'
import { Routes, Route } from 'react-router-dom'
import { Qris } from './pages/Qris'

export default function App() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-sky-400 p-5">
        <Routes>
          <Route path="/qris" element={<Qris />} />
          <Route path="/" element={<TopUp />} />
        </Routes>
    </div>
  )
}
