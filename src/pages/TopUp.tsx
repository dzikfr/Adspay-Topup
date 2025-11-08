import { useState } from "react";
import { InquiryStep } from "../components/InquiryStep";
import { AmountStep } from "../components/AmountStep";
import { ConfirmStep } from "../components/ConfirmStep";
import { StatusStep } from "../components/StatusStep";
import { Stepper } from "../components/Stepper";
import { Link } from "react-router-dom";

export function TopUp() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<any>({});
  const [amount, setAmount] = useState<number>(0);
  const [status, setStatus] = useState<any>(null);

  return (
    <>
      <Stepper step={step}  />
      {step === 1 && (
        <InquiryStep
          onNext={(d) => {
            setData(d);
            setStep(2);
          }}
        />
      )}
      {step === 2 && (
        <AmountStep
          onNext={(amt) => {
            setAmount(amt);
            setStep(3);
          }}
          onBack={() => setStep(1)}
        />
      )}
      {step === 3 && (
        <ConfirmStep
          data={data}
          amount={amount}
          onNext={(s) => {
            setStatus(s);
            setStep(4);
          }}
          onBack={() => setStep(2)}
        />
      )}
      {step === 4 && (
        <StatusStep
          status={status}
          onNew={() => {
            setStep(1);
            setData({});
            setAmount(0);
          }}
        />
      )}
      <Link
        to="/qris"
        className="block text-center w-full mt-50 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
      >
        Go to Generate QRIS!
      </Link>   
    </>
  );
}
