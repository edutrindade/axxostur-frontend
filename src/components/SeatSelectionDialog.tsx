import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import volantePng from "@/assets/img/volante.png";

interface SeatSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (seatNumber: number) => void;
  isLoading: boolean;
  totalSeats?: number;
  occupiedSeats?: number[];
  reservedSeats?: number;
  hasBathroom?: boolean;
  busType?: "conventional" | "semi_bed" | "bed" | "bed_cabin";
}

type SeatStatus = "available" | "occupied" | "reserved" | "selected";

interface SeatProps {
  number: number;
  status: SeatStatus;
  onClick: () => void;
}

function Seat({ number, status, onClick }: SeatProps) {
  const isDisabled = status === "occupied" || status === "reserved";

  return (
    <button
      data-seat
      onClick={onClick}
      disabled={isDisabled}
      className={cn(
        "relative w-12 h-14 rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-1",
        "flex flex-col items-center justify-center gap-0.5 text-xs font-semibold shadow-sm",
        status === "available" && "bg-emerald-100 text-emerald-700 border-2 border-emerald-300 hover:bg-emerald-200 hover:border-emerald-400 focus:ring-emerald-500",
        status === "occupied" && "bg-gray-200 text-gray-400 border-2 border-gray-300 cursor-not-allowed opacity-60",
        status === "reserved" && "bg-slate-200 text-slate-500 border-2 border-slate-300 cursor-not-allowed opacity-80",
        status === "selected" && "bg-blue-600 text-white border-2 border-blue-700 ring-2 ring-blue-300 scale-105 hover:bg-blue-700 focus:ring-blue-500",
      )}
    >
      <svg className={cn("w-5 h-5", status === "occupied" && "opacity-40")} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
      <span className="text-[10px] font-bold">{number}</span>
      {(status === "occupied" || status === "reserved") && (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className={cn("w-6 h-6", status === "occupied" ? "text-red-500" : "text-slate-500")} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
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

function FrontDoorPanel() {
  return (
    <div className="w-12 h-[7.5rem] flex items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-1 text-slate-500">
        <div className="w-8 h-14 mt-[-7.5rem] rounded-md border-2 border-slate-300 bg-blue-100" />
        <span className="text-[9px] font-semibold tracking-wide">PORTA</span>
      </div>
    </div>
  );
}

function FrontSteeringPanel() {
  return (
    <div className="w-12 h-[7.5rem] flex items-center justify-center">
      <img src={volantePng} alt="Volante" className="w-12 h-12 -rotate-90" draggable={false} />
    </div>
  );
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
        <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-20 h-52 rounded-[999px] bg-gradient-to-b from-sky-200 to-sky-400 opacity-70 blur-[0.5px]" />
        <div className="absolute -right-10 top-1/2 -translate-y-1/2 w-20 h-52 rounded-[999px] bg-gradient-to-b from-sky-200 to-sky-400 opacity-70 blur-[0.5px]" />
        <div className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border-4 border-slate-800 bg-white shadow-sm" />

        <div className="pointer-events-none absolute -left-10 top-1/2 -translate-y-[80px] z-50 w-4 h-8 rounded-full bg-amber-200 border border-amber-300 shadow-[0_0_16px_rgba(251,191,36,0.9)]" />
        <div className="pointer-events-none absolute -left-10 top-1/2 translate-y-[50px] z-50 w-4 h-8 rounded-full bg-amber-200 border border-amber-300 shadow-[0_0_16px_rgba(251,191,36,0.9)]" />

        <div className="relative bg-white rounded-[28px] border-2 border-slate-200 shadow-lg pl-20 pr-10 py-8">
          <div className="flex items-center justify-center">{children}</div>
        </div>
      </div>
    </div>
  );
}

function MobileDesktopBusLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="md:hidden w-full">
      <div className="relative w-full h-[60dvh] overflow-auto overscroll-contain">
        <div className="relative w-fit origin-top-left [&_[data-seat]]:-rotate-90 [&_.rotate-90]:-rotate-90" style={{ transform: "rotate(90deg) translateY(-100%)" }}>
          <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-20 h-52 rounded-[999px] bg-gradient-to-b from-sky-200 to-sky-400 opacity-70 blur-[0.5px]" />
          <div className="absolute -right-10 top-1/2 -translate-y-1/2 w-20 h-52 rounded-[999px] bg-gradient-to-b from-sky-200 to-sky-400 opacity-70 blur-[0.5px]" />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border-4 border-slate-800 bg-white shadow-sm" />

          <div className="pointer-events-none absolute -left-10 top-1/2 -translate-y-[80px] z-50 w-4 h-8 rounded-full bg-amber-200 border border-amber-300 shadow-[0_0_16px_rgba(251,191,36,0.9)]" />
          <div className="pointer-events-none absolute -left-10 top-1/2 translate-y-[50px] z-50 w-4 h-8 rounded-full bg-amber-200 border border-amber-300 shadow-[0_0_16px_rgba(251,191,36,0.9)]" />

          <div className="relative bg-white rounded-[28px] border-2 border-slate-200 shadow-lg pl-20 pr-10 py-8">
            <div className="flex items-center justify-center">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

type DesktopSeatCell = number | "blocked" | "bathroom" | null;

function BathroomIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("w-4 h-4", className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 3h7a2 2 0 0 1 2 2v8" />
      <path d="M7 11h9" />
      <path d="M7 7h4" />
      <path d="M8 21h8" />
      <path d="M9 21v-3" />
      <path d="M15 21v-3" />
      <path d="M5 11v3a6 6 0 0 0 6 6h2a6 6 0 0 0 6-6v-3" />
    </svg>
  );
}

function BathroomColumnPanel({ className }: { className?: string }) {
  return (
    <div className={cn("w-12 rounded-xl bg-slate-100 border-2 border-slate-300 shadow-sm flex items-center justify-center", className)}>
      <div className="flex items-center gap-2 rotate-90 text-slate-700">
        <BathroomIcon />
        <span className="text-xs font-semibold tracking-wide">BANHEIRO</span>
      </div>
    </div>
  );
}

function DesktopSeatColumn({
  top,
  bottom,
  occupiedSeats,
  reservedSeats,
  selectedSeat,
  onSeatClick,
  totalSeats,
}: {
  top: DesktopSeatCell;
  bottom: DesktopSeatCell;
  occupiedSeats: number[];
  reservedSeats: number;
  selectedSeat: number | null;
  onSeatClick: (seat: number) => void;
  totalSeats: number;
}) {
  if (top === "bathroom" && bottom === "bathroom") {
    return <BathroomColumnPanel className="h-[7.5rem]" />;
  }

  const renderCell = (cell: DesktopSeatCell) => {
    if (cell === null) return <SeatEmpty />;
    if (cell === "blocked") return <SeatBlocked />;
    if (cell === "bathroom") return <BathroomColumnPanel className="h-14" />;
    if (cell > totalSeats) return <SeatEmpty />;
    const status: SeatStatus = occupiedSeats.includes(cell) ? "occupied" : cell <= reservedSeats ? "reserved" : selectedSeat === cell ? "selected" : "available";
    return <Seat number={cell} status={status} onClick={() => onSeatClick(cell)} />;
  };

  return (
    <div className="flex flex-col gap-2">
      {renderCell(top)}
      {renderCell(bottom)}
    </div>
  );
}

function DesktopConventionalBusSeats({
  totalSeats,
  occupiedSeats,
  reservedSeats,
  hasBathroom,
  selectedSeat,
  onSeatClick,
  variant = "desktop",
}: {
  totalSeats: number;
  occupiedSeats: number[];
  reservedSeats: number;
  hasBathroom: boolean;
  selectedSeat: number | null;
  onSeatClick: (seat: number) => void;
  variant?: "desktop" | "mobile";
}) {
  const rows = Math.ceil(totalSeats / 4);

  const top: Array<[DesktopSeatCell, DesktopSeatCell]> = Array.from({ length: rows }, (_, rowIndex) => {
    const seat3 = rowIndex * 4 + 3;
    const seat4 = rowIndex * 4 + 4;
    return [seat3 <= totalSeats ? seat3 : null, seat4 <= totalSeats ? seat4 : null];
  });

  const bottom: Array<[DesktopSeatCell, DesktopSeatCell]> = Array.from({ length: rows }, (_, rowIndex) => {
    const seat1 = rowIndex * 4 + 1;
    const seat2 = rowIndex * 4 + 2;
    return [seat2 <= totalSeats ? seat2 : null, seat1 <= totalSeats ? seat1 : null];
  });

  const isDivisibleBy4 = totalSeats % 4 === 0;

  if (hasBathroom && !isDivisibleBy4) {
    const lastTopIndex = top.length - 1;
    const [lastTopA, lastTopB] = top[lastTopIndex] ?? [null, null];
    if (lastTopA === null && lastTopB === null) {
      top[lastTopIndex] = ["bathroom", "bathroom"];
    }
  }

  const shouldAddBathroomColumn = hasBathroom && rows % 2 === 1 && isDivisibleBy4;
  const shouldShowBathroomStripe = hasBathroom && rows % 2 === 0;

  return (
    <div className={cn(variant === "desktop" ? "hidden md:flex" : "flex", "flex-col items-center")}>
      <div className={cn("relative", shouldShowBathroomStripe && "pr-16")}>
        <div className="flex items-stretch gap-2">
          <div>
            <div className="flex items-start gap-8">
              <div className="flex gap-2">
                {top.map(([top, bottom], idx) => (
                  <DesktopSeatColumn key={`tl-${idx}`} top={top} bottom={bottom} occupiedSeats={occupiedSeats} reservedSeats={reservedSeats} selectedSeat={selectedSeat} onSeatClick={onSeatClick} totalSeats={totalSeats} />
                ))}
              </div>
            </div>

            <div className="h-10" />

            <div className="flex items-start gap-2">
              {bottom.map(([top, bottom], idx) => (
                <DesktopSeatColumn key={`b-${idx}`} top={top} bottom={bottom} occupiedSeats={occupiedSeats} reservedSeats={reservedSeats} selectedSeat={selectedSeat} onSeatClick={onSeatClick} totalSeats={totalSeats} />
              ))}
            </div>
          </div>

          {shouldAddBathroomColumn && <BathroomColumnPanel className="self-stretch" />}
        </div>

        <div className="absolute -left-14 top-0">
          <FrontDoorPanel />
          <div className="h-10" />
          <FrontSteeringPanel />
        </div>

        {shouldShowBathroomStripe && (
          <div className="absolute -right-16 top-1/2 -translate-y-1/2">
            <div className="h-[7.5rem] w-14 rounded-xl bg-slate-100 border-2 border-slate-300 shadow-sm flex items-center justify-center">
              <div className="flex items-center gap-2 rotate-90 text-slate-700">
                <BathroomIcon />
                <span className="text-xs font-semibold tracking-wide">BANHEIRO</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DoubleDeckerBusSeats({
  totalSeats,
  occupiedSeats,
  reservedSeats,
  selectedSeat,
  onSeatClick,
  busType,
}: {
  totalSeats: number;
  occupiedSeats: number[];
  reservedSeats: number;
  selectedSeat: number | null;
  onSeatClick: (seat: number) => void;
  busType: "semi_bed" | "bed" | "bed_cabin";
}) {
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
                const status: SeatStatus = occupiedSeats.includes(seatNum) ? "occupied" : seatNum <= reservedSeats ? "reserved" : selectedSeat === seatNum ? "selected" : "available";
                return <Seat key={seatNum} number={seatNum} status={status} onClick={() => onSeatClick(seatNum)} />;
              })}
            </div>

            <div className="h-1 w-14 flex items-center justify-center my-1">
              <div className="w-full h-1 bg-gradient-to-r from-transparent via-amber-300 to-transparent rounded-full" />
            </div>

            <div className="flex gap-1.5">
              {rightSeats.map((seatNum) => {
                if (seatNum > totalSeats) return null;
                const status: SeatStatus = occupiedSeats.includes(seatNum) ? "occupied" : seatNum <= reservedSeats ? "reserved" : selectedSeat === seatNum ? "selected" : "available";
                return <Seat key={seatNum} number={seatNum} status={status} onClick={() => onSeatClick(seatNum)} />;
              })}
            </div>
          </div>
        );
      })}
    </>
  );
}

export function SeatSelectionDialog({ open, onOpenChange, onSubmit, isLoading, totalSeats = 40, occupiedSeats = [], reservedSeats = 0, hasBathroom = false, busType = "conventional" }: SeatSelectionDialogProps) {
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);
  const normalizedReservedSeats = Math.min(Math.max(0, reservedSeats), totalSeats);

  const handleSubmit = () => {
    if (selectedSeat) {
      onSubmit(selectedSeat);
      setSelectedSeat(null);
    }
  };

  const handleSeatClick = (seatNum: number) => {
    if (!occupiedSeats.includes(seatNum) && seatNum > normalizedReservedSeats) {
      setSelectedSeat(seatNum === selectedSeat ? null : seatNum);
    }
  };

  const unavailableSeats = new Set<number>();
  for (let i = 1; i <= normalizedReservedSeats; i += 1) {
    unavailableSeats.add(i);
  }
  for (const seatNum of occupiedSeats) {
    if (seatNum >= 1 && seatNum <= totalSeats) {
      unavailableSeats.add(seatNum);
    }
  }
  const availableCount = Math.max(0, totalSeats - unavailableSeats.size);
  const isDoubleDecker = busType !== "conventional";

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) setSelectedSeat(null);
        onOpenChange(open);
      }}
    >
      <DialogContent className="w-full max-w-2xl sm:max-w-3xl md:max-w-7xl max-h-[92dvh] md:max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl">Selecione a Poltrona</DialogTitle>
          <DialogDescription>
            {availableCount} {availableCount === 1 ? "poltrona disponível" : "poltronas disponíveis"}. {reservedSeats > 0 && `Para esta viagem, ${normalizedReservedSeats} poltronas estão reservadas.`}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 min-h-0 space-y-4 py-4 overflow-y-auto">
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
            {isDoubleDecker ? (
              <BusLayout type={busType}>
                <DoubleDeckerBusSeats totalSeats={totalSeats} occupiedSeats={occupiedSeats} reservedSeats={normalizedReservedSeats} selectedSeat={selectedSeat} onSeatClick={handleSeatClick} busType={busType} />
              </BusLayout>
            ) : (
              <MobileDesktopBusLayout>
                <DesktopConventionalBusSeats totalSeats={totalSeats} occupiedSeats={occupiedSeats} reservedSeats={normalizedReservedSeats} hasBathroom={hasBathroom} selectedSeat={selectedSeat} onSeatClick={handleSeatClick} variant="mobile" />
              </MobileDesktopBusLayout>
            )}
          </div>

          {!isDoubleDecker ? (
            <DesktopBusLayout>
              <DesktopConventionalBusSeats totalSeats={totalSeats} occupiedSeats={occupiedSeats} reservedSeats={normalizedReservedSeats} hasBathroom={hasBathroom} selectedSeat={selectedSeat} onSeatClick={handleSeatClick} />
            </DesktopBusLayout>
          ) : (
            <div className="hidden md:block">
              <BusLayout type={busType}>
                <DoubleDeckerBusSeats totalSeats={totalSeats} occupiedSeats={occupiedSeats} reservedSeats={normalizedReservedSeats} selectedSeat={selectedSeat} onSeatClick={handleSeatClick} busType={busType} />
              </BusLayout>
            </div>
          )}

          {/* {selectedSeat && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 text-center animate-in fade-in slide-in-from-bottom-2 duration-300">
              <p className="text-sm text-blue-900">
                Poltrona selecionada: <span className="font-bold text-lg">#{selectedSeat}</span>
              </p>
            </div>
          )} */}
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
