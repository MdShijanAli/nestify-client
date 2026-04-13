"use client";

import { useState, useMemo } from "react";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, DollarSign, Percent, CalendarDays } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface MortgageCalculatorProps {
  propertyPrice: number;
}

export function MortgageCalculator({ propertyPrice }: MortgageCalculatorProps) {
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTerm, setLoanTerm] = useState(30);

  const downPayment = (propertyPrice * downPaymentPercent) / 100;
  const loanAmount = propertyPrice - downPayment;

  const result = useMemo(() => {
    const monthlyRate = interestRate / 100 / 12;
    const numPayments = loanTerm * 12;

    if (monthlyRate === 0) {
      return {
        monthly: loanAmount / numPayments,
        totalPayment: loanAmount,
        totalInterest: 0,
      };
    }

    const monthly =
      (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments))) /
      (Math.pow(1 + monthlyRate, numPayments) - 1);

    const totalPayment = monthly * numPayments;
    const totalInterest = totalPayment - loanAmount;

    return { monthly, totalPayment, totalInterest };
  }, [loanAmount, interestRate, loanTerm]);

  const chartData = [
    { name: "Principal", value: loanAmount },
    { name: "Interest", value: result.totalInterest },
    { name: "Down Payment", value: downPayment },
  ];

  const COLORS = [
    "hsl(220, 60%, 20%)",
    "hsl(35, 90%, 55%)",
    "hsl(152, 60%, 40%)",
  ];

  return (
    <div className="rounded-xl border bg-card p-6 shadow-card">
      <div className="pb-3">
        <h2 className="flex items-center gap-2 font-heading text-lg font-semibold">
          <Calculator className="h-5 w-5 text-secondary" />
          Mortgage Calculator
        </h2>
      </div>
      <div className="space-y-5">
        {/* Monthly Payment */}
        <div className="rounded-xl bg-muted p-4 text-center">
          <p className="text-sm text-muted-foreground">
            Estimated Monthly Payment
          </p>
          <p className="mt-1 font-heading text-3xl font-bold text-secondary">
            ${Math.round(result.monthly).toLocaleString()}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">/month</p>
        </div>

        {/* Down Payment */}
        <div>
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-1.5 text-sm">
              <DollarSign className="h-3.5 w-3.5" />
              Down Payment
            </Label>
            <span className="text-sm font-medium">
              {downPaymentPercent}% (${downPayment.toLocaleString()})
            </span>
          </div>
          <Slider
            min={5}
            max={50}
            step={1}
            value={[downPaymentPercent]}
            onValueChange={([v]) => setDownPaymentPercent(v)}
            className="mt-2"
          />
        </div>

        {/* Interest Rate */}
        <div>
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-1.5 text-sm">
              <Percent className="h-3.5 w-3.5" />
              Interest Rate
            </Label>
            <span className="text-sm font-medium">{interestRate}%</span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <Slider
              min={1}
              max={15}
              step={0.1}
              value={[interestRate]}
              onValueChange={([v]) => setInterestRate(v)}
              className="flex-1"
            />
            <Input
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
              className="w-20 text-center"
              step={0.1}
              min={1}
              max={15}
            />
          </div>
        </div>

        {/* Loan Term */}
        <div>
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-1.5 text-sm">
              <CalendarDays className="h-3.5 w-3.5" />
              Loan Term
            </Label>
            <span className="text-sm font-medium">{loanTerm} years</span>
          </div>
          <div className="mt-2 flex gap-2">
            {[15, 20, 25, 30].map((term) => (
              <button
                key={term}
                onClick={() => setLoanTerm(term)}
                className={`flex-1 rounded-lg border py-1.5 text-sm font-medium transition-colors ${
                  loanTerm === term
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-muted-foreground hover:bg-muted"
                }`}
              >
                {term}yr
              </button>
            ))}
          </div>
        </div>

        {/* Chart */}
        <div>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={60}
                paddingAngle={3}
                dataKey="value"
              >
                {chartData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) =>
                  `$${Math.round(value).toLocaleString()}`
                }
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4">
            {chartData.map((item, i) => (
              <div
                key={item.name}
                className="flex items-center gap-1.5 text-xs"
              >
                <div
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: COLORS[i] }}
                />
                <span className="text-muted-foreground">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="space-y-2 rounded-lg border p-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Home Price</span>
            <span className="font-medium">
              ${propertyPrice.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Loan Amount</span>
            <span className="font-medium">${loanAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Interest</span>
            <span className="font-medium">
              ${Math.round(result.totalInterest).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between border-t pt-2 text-sm font-semibold">
            <span>Total Payment</span>
            <span>${Math.round(result.totalPayment).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
