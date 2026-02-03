import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Icon } from "@/components/ui/icon";

interface SeatSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (seatNumber: number) => void;
  isLoading: boolean;
  totalSeats?: number;
  occupiedSeats?: number[];
}

export function SeatSelectionDialog({ open, onOpenChange, onSubmit, isLoading, totalSeats = 40, occupiedSeats = [] }: SeatSelectionDialogProps) {
  const [selectedSeat, setSelectedSeat] = useState<string>("");

  const handleSubmit = () => {
    if (selectedSeat) {
      onSubmit(parseInt(selectedSeat));
      setSelectedSeat("");
    }
  };

  const availableSeats = Array.from({ length: totalSeats }, (_, i) => i + 1).filter((seat) => !occupiedSeats?.includes(seat));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Selecionar Poltrona</DialogTitle>
          <DialogDescription>Escolha uma poltrona disponível para o viajante</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="seat-select">Poltrona</Label>
            <Select value={selectedSeat} onValueChange={setSelectedSeat}>
              <SelectTrigger id="seat-select">
                <SelectValue placeholder="Escolha uma poltrona..." />
              </SelectTrigger>
              <SelectContent>
                {availableSeats.map((seat) => (
                  <SelectItem key={seat} value={seat.toString()}>
                    Poltrona {seat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="bg-slate-100 rounded-lg p-4">
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: totalSeats }, (_, i) => i + 1).map((seat) => (
                <button
                  key={seat}
                  onClick={() => {
                    if (!occupiedSeats?.includes(seat)) {
                      setSelectedSeat(seat.toString());
                    }
                  }}
                  disabled={occupiedSeats?.includes(seat)}
                  className={`p-2 text-xs font-semibold rounded transition-colors ${selectedSeat === seat.toString() ? "bg-blue-500 text-white" : occupiedSeats?.includes(seat) ? "bg-red-200 text-red-700 cursor-not-allowed" : "bg-green-100 text-green-700 hover:bg-green-200"}`}
                >
                  {seat}
                </button>
              ))}
            </div>
            <div className="mt-3 flex gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-100 rounded border border-green-400" />
                <span>Disponível</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-200 rounded border border-red-400" />
                <span>Ocupada</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded border border-blue-600" />
                <span>Selecionada</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={!selectedSeat || isLoading}>
            {isLoading ? (
              <>
                <Icon name="refresh" size={16} className="mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              "Confirmar"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
