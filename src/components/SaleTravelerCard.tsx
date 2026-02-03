import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import type { SaleTraveler } from "@/types/sale";

interface SaleTravelerCardProps {
  traveler: {
    id: string;
    name: string;
    seatNumber: number;
  };
  onRemove: (travelerId: string) => void;
  isLoading?: boolean;
}

export function SaleTravelerCard({ traveler, onRemove, isLoading = false }: SaleTravelerCardProps) {
  return (
    <Card className="p-4 flex items-center justify-between hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3 flex-1">
        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
          <Icon name="user" size={20} className="text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-slate-900 truncate">{traveler.name}</p>
          <p className="text-sm text-slate-500">Poltrona {traveler.seatNumber}</p>
        </div>
      </div>
      <Button variant="ghost" size="sm" onClick={() => onRemove(traveler.id)} disabled={isLoading} className="text-red-600 hover:text-red-700 hover:bg-red-50">
        <Trash2 size={18} />
      </Button>
    </Card>
  );
}
