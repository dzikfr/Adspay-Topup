import axios from 'axios'

export const inquiryVA = (vaNumber: string) =>
  axios.post('/api/inquiry', { vaNumber })

export const topupVA = (vaNumber: string, amount: number) =>
  axios.post('/api/topup', { vaNumber, amount })

export const generateQris = (params: URLSearchParams) =>
  axios.post(`/api/qris/generate?${params.toString()}`)

export const monitorMerchant = () =>
  axios.get(`/api/qris/monitor`)