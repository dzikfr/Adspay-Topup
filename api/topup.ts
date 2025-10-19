import type { VercelRequest, VercelResponse } from '@vercel/node'
import axios from 'axios'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const topupUrl = process.env.VITE_TOPUP_URL || 'http://38.47.94.165:3132/api/bank/topups/pay'
    const response = await axios.post(topupUrl, req.body)
    res.status(200).json(response.data)
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
}
