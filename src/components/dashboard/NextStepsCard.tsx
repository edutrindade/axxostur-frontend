import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface Step {
  number: number;
  text: string;
  completed?: boolean;
}

interface NextStepsCardProps {
  steps: Step[];
}

export const NextStepsCard = ({ steps }: NextStepsCardProps) => {
  return (
    <Card className="bg-gradient-to-r from-blue-500 to-blue-600 border-0 text-white lg:col-span-2 hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="text-white">Comece Aqui</CardTitle>
        <CardDescription className="text-blue-100">Configure sua empresa passo a passo</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {steps.map((step) => (
          <div key={step.number} className="flex items-start gap-4">
            <div className={`flex-shrink-0 h-8 w-8 flex items-center justify-center rounded-full text-sm font-semibold ${step.completed ? "bg-green-400 text-white" : "bg-white/20"}`}>{step.completed ? "✓" : step.number}</div>
            <span className={step.completed ? "line-through opacity-60" : ""}>{step.text}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
