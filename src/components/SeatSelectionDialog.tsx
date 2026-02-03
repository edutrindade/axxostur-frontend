import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

interface SeatSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (seatNumber: number) => void;
  isLoading: boolean;
  totalSeats?: number;
  occupiedSeats?: number[];
  busType?: "conventional" | "semi_bed" | "bed" | "bed_cabin";
}

type SeatStatus = "available" | "occupied" | "selected";

interface SeatProps {
  number: number;
  status: SeatStatus;
  onClick: () => void;
}

function Seat({ number, status, onClick }: SeatProps) {
  const isDisabled = status === "occupied";

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={cn(
        "relative w-12 h-14 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-1",
        "flex flex-col items-center justify-center gap-0.5 text-xs font-semibold shadow-sm",
        status === "available" && "bg-emerald-100 text-emerald-700 border-2 border-emerald-300 hover:bg-emerald-200 hover:border-emerald-400 focus:ring-emerald-500",
        status === "occupied" && "bg-gray-200 text-gray-400 border-2 border-gray-300 cursor-not-allowed opacity-60",
        status === "selected" && "bg-blue-600 text-white border-2 border-blue-700 ring-2 ring-blue-300 scale-105 hover:bg-blue-700 focus:ring-blue-500",
      )}
    >
      <svg className={cn("w-5 h-5", status === "occupied" && "opacity-40")} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
      <span className="text-[10px] font-bold">{number}</span>
      {status === "occupied" && (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-6 h-6 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </div>
      )}
    </button>
  );
}

function SeatBlocked() {
  return (
    <div aria-hidden className={cn("relative w-12 h-14 rounded-lg", "flex flex-col items-center justify-center gap-0.5 text-xs font-semibold shadow-sm", "bg-gray-200 text-gray-400 border-2 border-gray-300 opacity-60")}>
      <div className="absolute inset-0 flex items-center justify-center">
        <svg className="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </div>
    </div>
  );
}

function SeatEmpty() {
  return <div aria-hidden className="w-12 h-14" />;
}

function BusLayout({ children, type }: { children: React.ReactNode; type: string }) {
  return (
    <div className="flex justify-center overflow-x-auto">
      <div className="relative bg-gradient-to-b md:bg-gradient-to-r from-slate-100 to-slate-50 rounded-2xl p-4 md:p-6 border-2 border-slate-300 shadow-xl w-fit">
        <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4 mb-4 md:mb-0 md:mr-4 pb-4 md:pb-0 md:pr-4 border-b-2 md:border-b-0 md:border-r-2 border-slate-300">
          <div className="flex md:flex-col items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-700 border-4 border-slate-500 flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="8" r="4" />
                <path d="M12 14c-4 0-7 2-7 5v1h14v-1c0-3-3-5-7-5z" />
              </svg>
            </div>
            <div className="md:text-center">
              <p className="text-xs font-semibold text-slate-600">MOTORISTA</p>
              <p className="text-[10px] text-slate-500">{type === "conventional" ? "Convencional" : type === "semi_bed" ? "Semi-Leito" : type === "bed" ? "Leito" : "Leito Cama"}</p>
            </div>
          </div>
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border-4 border-slate-600 bg-slate-700 shadow-inner" />
        </div>

        <div className="flex flex-col md:flex-row md:items-start">
          <div className="flex flex-col md:flex-row gap-1.5">{children}</div>

          <div className="mt-4 md:mt-0 md:ml-4 pt-4 md:pt-0 md:pl-4 border-t-2 md:border-t-0 md:border-l-2 border-slate-300 flex md:flex-col items-center justify-center gap-2 text-slate-600">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 2v2h6V2M5 6h14v12H5V6m10 5h3v4h-3v-4m-8-3a2 2 0 0 1 2 2 2 2 0 0 1-2 2 2 2 0 0 1-2-2 2 2 0 0 1 2-2z" />
            </svg>
            <span className="text-xs font-medium md:[writing-mode:vertical-lr]">BANHEIRO</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function DesktopBusLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="hidden md:flex justify-center overflow-x-auto">
      <div className="relative w-fit">
        <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-24 h-52 rounded-[999px] bg-gradient-to-b from-sky-200 to-sky-400 opacity-70 blur-[0.5px]" />
        <div className="absolute -right-10 top-1/2 -translate-y-1/2 w-24 h-52 rounded-[999px] bg-gradient-to-b from-sky-200 to-sky-400 opacity-70 blur-[0.5px]" />
        <div className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border-4 border-slate-800 bg-white shadow-sm" />

        <div className="relative bg-white rounded-[28px] border-2 border-slate-200 shadow-lg px-10 py-8">
          <div className="flex items-center justify-center">{children}</div>
        </div>
      </div>
    </div>
  );
}

function ConventionalBusSeats({ totalSeats, occupiedSeats, selectedSeat, onSeatClick }: { totalSeats: number; occupiedSeats: number[]; selectedSeat: number | null; onSeatClick: (seat: number) => void }) {
  const rows = Math.ceil(totalSeats / 4);

  return (
    <>
      {Array.from({ length: rows }, (_, rowIndex) => {
        const seat1 = rowIndex * 4 + 1;
        const seat2 = rowIndex * 4 + 2;
        const seat3 = rowIndex * 4 + 3;
        const seat4 = rowIndex * 4 + 4;

        return (
          <div key={rowIndex} className="flex flex-col gap-1.5">
            <div className="flex gap-1.5">
              {seat3 <= totalSeats && <Seat number={seat3} status={occupiedSeats.includes(seat3) ? "occupied" : selectedSeat === seat3 ? "selected" : "available"} onClick={() => onSeatClick(seat3)} />}
              {seat4 <= totalSeats && <Seat number={seat4} status={occupiedSeats.includes(seat4) ? "occupied" : selectedSeat === seat4 ? "selected" : "available"} onClick={() => onSeatClick(seat4)} />}
            </div>

            <div className="flex gap-1.5">
              {seat1 <= totalSeats && <Seat number={seat1} status={occupiedSeats.includes(seat1) ? "occupied" : selectedSeat === seat1 ? "selected" : "available"} onClick={() => onSeatClick(seat1)} />}
              {seat2 <= totalSeats && <Seat number={seat2} status={occupiedSeats.includes(seat2) ? "occupied" : selectedSeat === seat2 ? "selected" : "available"} onClick={() => onSeatClick(seat2)} />}
            </div>
          </div>
        );
      })}
    </>
  );
}

type DesktopSeatCell = number | "blocked" | null;

function DesktopSeatColumn({ top, bottom, occupiedSeats, selectedSeat, onSeatClick, totalSeats }: { top: DesktopSeatCell; bottom: DesktopSeatCell; occupiedSeats: number[]; selectedSeat: number | null; onSeatClick: (seat: number) => void; totalSeats: number }) {
  const renderCell = (cell: DesktopSeatCell) => {
    if (cell === null) return <SeatEmpty />;
    if (cell === "blocked") return <SeatBlocked />;
    if (cell > totalSeats) return <SeatEmpty />;
    const status: SeatStatus = occupiedSeats.includes(cell) ? "occupied" : selectedSeat === cell ? "selected" : "available";
    return <Seat number={cell} status={status} onClick={() => onSeatClick(cell)} />;
  };

  return (
    <div className="flex flex-col gap-2">
      {renderCell(top)}
      {renderCell(bottom)}
    </div>
  );
}

function DesktopConventionalBusSeats({ totalSeats, occupiedSeats, selectedSeat, onSeatClick }: { totalSeats: number; occupiedSeats: number[]; selectedSeat: number | null; onSeatClick: (seat: number) => void }) {
  const top: Array<[DesktopSeatCell, DesktopSeatCell]> = [
    [3, 4],
    [7, 8],
    [11, 12],
    [15, 16],
    [19, 20],
    [23, 24],
    [27, 28],
    [31, 32],
    [35, 36],
    [39, 40],
    [43, 44],
    [47, 48],
  ];

  const bottom: Array<[DesktopSeatCell, DesktopSeatCell]> = [
    [1, 2],
    [6, 5],
    [10, 9],
    [14, 13],
    [18, 17],
    [22, 21],
    [26, 25],
    [30, 29],
    [34, 33],
    [38, 37],
    [42, 41],
    [46, 45],
  ];

  return (
    <div className="hidden md:flex flex-col items-center">
      <div className="flex items-start gap-8">
        <div className="flex gap-2">
          {top.map(([top, bottom], idx) => (
            <DesktopSeatColumn key={`tl-${idx}`} top={top} bottom={bottom} occupiedSeats={occupiedSeats} selectedSeat={selectedSeat} onSeatClick={onSeatClick} totalSeats={totalSeats} />
          ))}
        </div>
      </div>

      <div className="h-10" />

      <div className="flex items-start gap-2">
        {bottom.map(([top, bottom], idx) => (
          <DesktopSeatColumn key={`b-${idx}`} top={top} bottom={bottom} occupiedSeats={occupiedSeats} selectedSeat={selectedSeat} onSeatClick={onSeatClick} totalSeats={totalSeats} />
        ))}
      </div>
    </div>
  );
}

function DoubleDeckerBusSeats({ totalSeats, occupiedSeats, selectedSeat, onSeatClick, busType }: { totalSeats: number; occupiedSeats: number[]; selectedSeat: number | null; onSeatClick: (seat: number) => void; busType: "semi_bed" | "bed" | "bed_cabin" }) {
  const seatsPerRow = busType === "bed_cabin" ? 2 : 3;
  const rows = Math.ceil(totalSeats / seatsPerRow);

  return (
    <>
      {Array.from({ length: rows }, (_, rowIndex) => {
        const leftSeats = [rowIndex * seatsPerRow + 1];
        const rightSeats = busType === "bed_cabin" ? [rowIndex * seatsPerRow + 2] : [rowIndex * seatsPerRow + 2, rowIndex * seatsPerRow + 3];

        return (
          <div key={rowIndex} className="flex flex-col items-center gap-1.5">
            <div className="flex gap-1.5">
              {leftSeats.map((seatNum) => {
                if (seatNum > totalSeats) return null;
                const status: SeatStatus = occupiedSeats.includes(seatNum) ? "occupied" : selectedSeat === seatNum ? "selected" : "available";
                return <Seat key={seatNum} number={seatNum} status={status} onClick={() => onSeatClick(seatNum)} />;
              })}
            </div>

            <div className="h-1 w-14 flex items-center justify-center my-1">
              <div className="w-full h-1 bg-gradient-to-r from-transparent via-amber-300 to-transparent rounded-full" />
            </div>

            <div className="flex gap-1.5">
              {rightSeats.map((seatNum) => {
                if (seatNum > totalSeats) return null;
                const status: SeatStatus = occupiedSeats.includes(seatNum) ? "occupied" : selectedSeat === seatNum ? "selected" : "available";
                return <Seat key={seatNum} number={seatNum} status={status} onClick={() => onSeatClick(seatNum)} />;
              })}
            </div>
          </div>
        );
      })}
    </>
  );
}

export function SeatSelectionDialog({ open, onOpenChange, onSubmit, isLoading, totalSeats = 40, occupiedSeats = [], busType = "conventional" }: SeatSelectionDialogProps) {
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);

  const handleSubmit = () => {
    if (selectedSeat) {
      onSubmit(selectedSeat);
      setSelectedSeat(null);
    }
  };

  const handleSeatClick = (seatNum: number) => {
    if (!occupiedSeats.includes(seatNum)) {
      setSelectedSeat(seatNum === selectedSeat ? null : seatNum);
    }
  };

  const availableCount = totalSeats - occupiedSeats.length;
  const isDoubleDecker = busType !== "conventional";

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) setSelectedSeat(null);
        onOpenChange(open);
      }}
    >
      <DialogContent className="w-full max-w-2xl sm:max-w-3xl md:max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Selecione sua Poltrona</DialogTitle>
          <DialogDescription>
            Escolha a poltrona desejada no mapa abaixo. {availableCount} {availableCount === 1 ? "poltrona disponível" : "poltronas disponíveis"}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex flex-wrap gap-6 justify-center pb-4 border-b">
            <div className="flex items-center gap-2">
              <div className="w-8 h-10 bg-emerald-100 border-2 border-emerald-300 rounded-lg flex items-center justify-center shadow-sm">
                <svg className="w-4 h-4 text-emerald-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <span className="text-sm font-medium text-slate-700">Disponível</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-10 bg-gray-200 border-2 border-gray-300 rounded-lg flex items-center justify-center shadow-sm opacity-60">
                <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <span className="text-sm font-medium text-slate-700">Ocupada</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-10 bg-blue-600 border-2 border-blue-700 rounded-lg flex items-center justify-center shadow-sm">
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <span className="text-sm font-medium text-slate-700">Selecionada</span>
            </div>
          </div>

          <div className="md:hidden">
            <BusLayout type={busType}>
              {isDoubleDecker ? (
                <DoubleDeckerBusSeats totalSeats={totalSeats} occupiedSeats={occupiedSeats} selectedSeat={selectedSeat} onSeatClick={handleSeatClick} busType={busType} />
              ) : (
                <ConventionalBusSeats totalSeats={totalSeats} occupiedSeats={occupiedSeats} selectedSeat={selectedSeat} onSeatClick={handleSeatClick} />
              )}
            </BusLayout>
          </div>

          {!isDoubleDecker ? (
            <DesktopBusLayout>
              <DesktopConventionalBusSeats totalSeats={totalSeats} occupiedSeats={occupiedSeats} selectedSeat={selectedSeat} onSeatClick={handleSeatClick} />
            </DesktopBusLayout>
          ) : (
            <div className="hidden md:block">
              <BusLayout type={busType}>
                <DoubleDeckerBusSeats totalSeats={totalSeats} occupiedSeats={occupiedSeats} selectedSeat={selectedSeat} onSeatClick={handleSeatClick} busType={busType} />
              </BusLayout>
            </div>
          )}

          {selectedSeat && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 text-center animate-in fade-in slide-in-from-bottom-2 duration-300">
              <p className="text-sm text-blue-900">
                Poltrona selecionada: <span className="font-bold text-lg">#{selectedSeat}</span>
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={!selectedSeat || isLoading}>
            {isLoading ? (
              <>
                <Icon name="refresh" size={16} className="mr-2 animate-spin" />
                Confirmando...
              </>
            ) : (
              <>
                <Icon name="check" size={16} className="mr-2" />
                Confirmar Poltrona
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
