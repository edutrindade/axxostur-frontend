import { forwardRef } from "react";
import { format } from "date-fns";
import { ptBR as dfPtBR } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import ReactDatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./date-picker.css";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface DatePickerProps {
	value?: Date;
	onChange?: (date: Date | undefined) => void;
	placeholder?: string;
	disabled?: boolean;
	className?: string;
}

export function DatePicker({
	value,
	onChange,
	placeholder = "Selecione uma data",
	disabled = false,
	className,
}: DatePickerProps) {
	// locale pt-BR para datas
	registerLocale("ptBR", dfPtBR);

	const CustomInput = forwardRef<HTMLInputElement, React.HTMLProps<HTMLInputElement>>(
		({ value: v, onClick }, ref) => (
			<Input
				ref={ref as any}
				value={v as string}
				onClick={onClick}
				readOnly
				placeholder={placeholder}
				leftIcon="calendar"
				className={cn("h-12 w-full font-medium text-slate-900", className)}
				aria-label="Selecionar data"
				disabled={disabled}
			/>
		)
	);

	return (
		<div className="w-full relative">
			<ReactDatePicker
				selected={value}
				onChange={(date) => onChange?.(date ? (date as Date) : undefined)}
				locale="ptBR"
				dateFormat="dd/MM/yyyy"
				minDate={new Date("1900-01-01")}
				maxDate={new Date()}
				popperPlacement="bottom-start"
				showPopperArrow={false}
				calendarClassName="nexxus-datepicker"
				popperClassName="nexxus-datepicker-popper"
				shouldCloseOnSelect
				customInput={<CustomInput />}
				// igualar largura do popover ao trigger
				popperProps={{ strategy: "absolute" }}
				popperContainer={({ children }) => (
					<div className="relative z-50">{children}</div>
				)}
				popperModifiers={[
					{ name: "offset", options: { offset: [0, 6] } },
					{
						name: "sameWidth",
						enabled: true,
						phase: "write",
						requires: ["computeStyles"],
						fn: ({ state }: any) => {
							const w = `${state.rects.reference.width}px`;
							state.styles.popper.width = w;
							state.styles.popper.minWidth = w;
						},
						effect: ({ state }: any) => {
							const refWidth = `${(state.elements.reference as HTMLElement).offsetWidth}px`;
							(state.elements.popper as HTMLElement).style.width = refWidth;
							(state.elements.popper as HTMLElement).style.minWidth = refWidth;
						},
					},
				]}
				ariaLabelledBy="datepicker-label"
			/>
		</div>
	);
}
