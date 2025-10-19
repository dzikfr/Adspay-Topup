import { useState } from 'react'
import { InquiryStep } from './components/InquiryStep'
import { AmountStep } from './components/AmountStep'
import { ConfirmStep } from './components/ConfirmStep'
import { StatusStep } from './components/StatusStep'
import { Stepper } from './components/Stepper'

export default function App() {
  const [step, setStep] = useState(1)
  const [data, setData] = useState<any>({})
  const [amount, setAmount] = useState<number>(0)
  const [status, setStatus] = useState<any>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-sky-400 p-5">
      <div className="max-w-md mx-auto bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6">
        <Stepper step={step} />
        {step === 1 && <InquiryStep onNext={(d)=>{setData(d); setStep(2)}} />}
        {step === 2 && <AmountStep onNext={(amt)=>{setAmount(amt); setStep(3)}} onBack={()=>setStep(1)} />}
        {step === 3 && <ConfirmStep data={data} amount={amount} onNext={(s)=>{setStatus(s); setStep(4)}} onBack={()=>setStep(2)} />}
        {step === 4 && <StatusStep status={status} onNew={()=>{setStep(1); setData({}); setAmount(0);}} />}
      </div>
    </div>
  )
}
