import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface MortgageCalculatorProps {
  propertyPrice: number;
}

export function MortgageCalculator({ propertyPrice }: MortgageCalculatorProps) {
  const [downPayment, setDownPayment] = useState(propertyPrice * 0.2);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTerm, setLoanTerm] = useState(30);

  const principal = propertyPrice - downPayment;
  const monthlyRate = interestRate / 100 / 12;
  const numberOfPayments = loanTerm * 12;
  const monthlyPayment =
    principal > 0 && monthlyRate > 0
      ? (principal *
          (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
      : 0;

  return (
    <div className="rounded-xl border bg-card p-6">
      <h2 className="font-heading text-xl font-semibold">
        Mortgage Calculator
      </h2>
      <div className="mt-4 space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Down Payment: ${downPayment.toLocaleString()}
          </label>
          <input
            type="range"
            min={0}
            max={propertyPrice}
            step={10000}
            value={downPayment}
            onChange={(e) => setDownPayment(parseFloat(e.target.value))}
            className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
          />
          <div className="text-xs text-muted-foreground mt-1">
            {((downPayment / propertyPrice) * 100).toFixed(1)}% of property
            price
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            Interest Rate: {interestRate.toFixed(2)}%
          </label>
          <input
            type="range"
            min={2}
            max={12}
            step={0.1}
            value={interestRate}
            onChange={(e) => setInterestRate(parseFloat(e.target.value))}
            className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            Loan Term: {loanTerm} years
          </label>
          <input
            type="range"
            min={5}
            max={40}
            step={1}
            value={loanTerm}
            onChange={(e) => setLoanTerm(parseInt(e.target.value))}
            className="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>
        <div className="rounded-lg bg-secondary/20 p-4 text-center">
          <p className="text-sm text-muted-foreground">
            Estimated Monthly Payment
          </p>
          <p className="mt-2 font-heading text-3xl font-bold text-primary">
            $
            {monthlyPayment.toLocaleString("en-US", {
              maximumFractionDigits: 0,
            })}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Principal: ${principal.toLocaleString()} | Total interest: $
            {(monthlyPayment * numberOfPayments - principal).toLocaleString(
              "en-US",
              { maximumFractionDigits: 0 },
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
