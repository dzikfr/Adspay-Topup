import type { VercelRequest, VercelResponse } from '@vercel/node'
import axios from 'axios'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const baseUrl = process.env.VITE_QRIS_BASE_URL || 'http://38.47.94.165:3132'
    const url = `${baseUrl}/api/bank/qris/generate?${new URLSearchParams(req.query as any).toString()}`
    const response = await axios.post(url)
    res.status(200).json(response.data)
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
}
