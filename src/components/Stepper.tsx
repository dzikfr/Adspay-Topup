export const Stepper = ({ step }: { step: number }) => {
  const steps = ['Inquiry', 'Nominal', 'Konfirmasi', 'Status']
  return (
    <ul className="steps steps-vertical sm:steps-horizontal mb-4 w-full">
      {steps.map((s, i)=>(
        <li key={i} className={`step ${i < step ? 'step-primary' : ''}`}>
          {s}
        </li>
      ))}
    </ul>
  )
}
