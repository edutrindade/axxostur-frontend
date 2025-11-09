import React from "react";

interface Step {
  label: string;
}

interface StepperProps {
  steps: Step[];
  current: number; // zero-based index
}

export const Stepper: React.FC<StepperProps> = ({ steps, current }) => {
  return (
    <div className="flex items-center justify-between w-full">
      {steps.map((step, index) => {
        const isActive = index === current;
        const isCompleted = index < current;
        return (
          <div key={index} className="flex items-center w-full">
            <div className="flex flex-col items-center">
              <div
                className={
                  `flex items-center justify-center h-10 w-10 rounded-full border-2 transition-all ` +
                  (isActive
                    ? "border-primary bg-primary text-white shadow-sm"
                    : isCompleted
                      ? "border-primary bg-primary text-white"
                      : "border-slate-300 bg-white text-slate-700")
                }
                aria-current={isActive ? "step" : undefined}
              >
                <span className="font-bold text-sm">{index + 1}</span>
              </div>
              <span className={`mt-2 text-sm font-semibold ${isActive || isCompleted ? "text-primary" : "text-slate-800"}`}>
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 mx-4">
                <div className={`w-full rounded-full ${isCompleted ? "bg-primary h-1" : "bg-slate-300 h-[1px] opacity-80"}`} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Stepper;