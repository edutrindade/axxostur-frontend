import { useState, useRef, useEffect } from "react";
import { Button } from "./button";
import { Input } from "./input";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  disabled?: boolean;
  label?: string;
}

const PRESET_COLORS = [
  "#000000", // Preto
  "#FFFFFF", // Branco
  "#EF4444", // Vermelho
  "#F97316", // Laranja
  "#EAB308", // Amarelo
  "#22C55E", // Verde
  "#06B6D4", // Cyan
  "#3B82F6", // Azul
  "#8B5CF6", // Púrpura
  "#EC4899", // Rosa
  "#1E3A8A", // Azul escuro (Primária padrão)
  "#374151", // Cinza escuro
];

export const ColorPicker = ({ value, onChange, disabled = false, label }: ColorPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [displayValue, setDisplayValue] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDisplayValue(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleColorChange = (color: string) => {
    setDisplayValue(color);
    onChange(color);
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let color = e.target.value.toUpperCase();
    if (!color.startsWith("#")) color = "#" + color;
    if (color.length <= 7) {
      setDisplayValue(color);
      if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)) {
        onChange(color);
      }
    }
  };

  const handleInputBlur = () => {
    if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(displayValue)) {
      setDisplayValue(value);
    }
  };

  return (
    <div className="space-y-2" ref={containerRef}>
      {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input type="text" value={displayValue} onChange={handleInputChange} onBlur={handleInputBlur} placeholder="#000000" disabled={disabled} className="font-mono text-sm pl-10" maxLength={7} />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded border border-slate-300 cursor-pointer" style={{ backgroundColor: value }} onClick={() => !disabled && setIsOpen(!isOpen)} />
        </div>
      </div>

      {isOpen && (
        <div className="absolute bg-white border border-slate-200 rounded-lg shadow-lg p-4 z-50 w-64">
          <div className="space-y-3">
            <div>
              <p className="text-xs font-semibold text-slate-600 mb-2 uppercase">Cores predefinidas</p>
              <div className="grid grid-cols-6 gap-2">
                {PRESET_COLORS.map((color) => (
                  <button key={color} onClick={() => handleColorChange(color)} className={`w-8 h-8 rounded border-2 transition-all hover:scale-110 ${value === color ? "border-slate-900" : "border-slate-300"}`} style={{ backgroundColor: color }} title={color} />
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-slate-600 mb-2 uppercase">Entrada nativa</p>
              <input type="color" value={value} onChange={(e) => handleColorChange(e.target.value)} className="w-full h-10 cursor-pointer rounded border border-slate-200" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
