import type { VercelRequest, VercelResponse } from '@vercel/node'
import axios from 'axios'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const inquiryUrl = process.env.VITE_INQUIRY_URL || 'http://38.47.94.165:3132/api/bank/va/inquiry'
    const response = await axios.post(inquiryUrl, req.body)
    res.status(200).json(response.data)
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
}
