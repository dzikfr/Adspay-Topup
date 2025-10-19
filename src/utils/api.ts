import axios from 'axios'

const inquiryUrl = import.meta.env.VITE_INQUIRY_URL as string
const topupUrl = import.meta.env.VITE_TOPUP_URL as string

export const inquiryVA = (vaNumber: string) =>
  axios.post(inquiryUrl, { vaNumber })

export const topupVA = (vaNumber: string, amount: number) =>
  axios.post(topupUrl, { vaNumber, amount })
