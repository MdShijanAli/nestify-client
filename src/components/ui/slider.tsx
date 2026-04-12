"use client";

import * as React from "react";

interface SliderProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange"
> {
  value?: number[];
  onValueChange?: (value: number[]) => void;
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  (
    { className, value, onValueChange, max = 100, min = 0, step = 1, ...props },
    ref,
  ) => {
    // Default to first value or 0 if no value provided
    const displayValue = value && value.length > 0 ? value[0] : 0;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = parseFloat(e.target.value);
      onValueChange?.([newValue]);
    };

    const percentage =
      ((displayValue - Number(min)) / (Number(max) - Number(min))) * 100;

    return (
      <div className="w-full">
        <div className="relative h-2 w-full bg-secondary rounded-full overflow-hidden">
          <div
            className="absolute h-full bg-primary rounded-full transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <input
          ref={ref}
          type="range"
          min={min}
          max={max}
          step={step}
          value={displayValue}
          onChange={handleChange}
          className="sr-only"
          {...props}
        />
      </div>
    );
  },
);
Slider.displayName = "Slider";

export { Slider };
export type { SliderProps };
