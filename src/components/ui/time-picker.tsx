import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface TimePickerProps {
  value: string;
  onChange: (time: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const TimePicker = ({ value, onChange, placeholder = "Selecionar hora", disabled = false }: TimePickerProps) => {
  const [hour, setHour] = useState<string>("00");
  const [minute, setMinute] = useState<string>("00");
  const [isOpen, setIsOpen] = useState(false);
  const hourScrollRef = useRef<HTMLDivElement>(null);
  const minuteScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value) {
      const [h, m] = value.split(":");
      setHour(h.padStart(2, "0"));
      setMinute(m.padStart(2, "0"));
    }
  }, [value, isOpen]);

  const handleTimeChange = (newHour: string, newMinute: string) => {
    const formattedTime = `${newHour.padStart(2, "0")}:${newMinute.padStart(2, "0")}`;
    onChange(formattedTime);
  };

  const handleHourChange = (newHour: string) => {
    setHour(newHour);
    handleTimeChange(newHour, minute);
  };

  const handleMinuteChange = (newMinute: string) => {
    setMinute(newMinute);
    handleTimeChange(hour, newMinute);
  };

  const displayTime = value || placeholder;

  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"));

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-between text-left font-normal" disabled={disabled}>
          <span>{displayTime}</span>
          <Icon name="clock" size={16} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0" align="start">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white rounded-t-lg">
          <div className="flex items-center justify-center gap-4">
            <div className="text-5xl font-bold">{hour}</div>
            <div className="text-4xl">:</div>
            <div className="text-5xl font-bold">{minute}</div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">Hora</label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newHour = (parseInt(hour) - 1 + 24) % 24;
                  handleHourChange(newHour.toString().padStart(2, "0"));
                }}
              >
                <Icon name="chevronUp" size={16} />
              </Button>
              <div ref={hourScrollRef} className="flex-1 max-h-40 overflow-y-auto border border-slate-200 rounded-lg bg-slate-50">
                <div className="flex flex-col">
                  {hours.map((h) => (
                    <button key={h} onClick={() => handleHourChange(h)} className={`py-2 px-4 text-center text-sm font-medium transition-colors ${hour === h ? "bg-blue-500 text-white" : "text-slate-700 hover:bg-slate-100"}`}>
                      {h}
                    </button>
                  ))}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newHour = (parseInt(hour) + 1) % 24;
                  handleHourChange(newHour.toString().padStart(2, "0"));
                }}
              >
                <Icon name="chevronDown" size={16} />
              </Button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">Minuto</label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newMinute = (parseInt(minute) - 1 + 60) % 60;
                  handleMinuteChange(newMinute.toString().padStart(2, "0"));
                }}
              >
                <Icon name="chevronUp" size={16} />
              </Button>
              <div ref={minuteScrollRef} className="flex-1 max-h-40 overflow-y-auto border border-slate-200 rounded-lg bg-slate-50">
                <div className="flex flex-col">
                  {minutes.map((m) => (
                    <button key={m} onClick={() => handleMinuteChange(m)} className={`py-2 px-4 text-center text-sm font-medium transition-colors ${minute === m ? "bg-blue-500 text-white" : "text-slate-700 hover:bg-slate-100"}`}>
                      {m}
                    </button>
                  ))}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const newMinute = (parseInt(minute) + 1) % 60;
                  handleMinuteChange(newMinute.toString().padStart(2, "0"));
                }}
              >
                <Icon name="chevronDown" size={16} />
              </Button>
            </div>
          </div>

          <Button onClick={() => setIsOpen(false)} className="w-full">
            Confirmar
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
