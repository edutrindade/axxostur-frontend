/** biome-ignore-all lint/a11y/noStaticElementInteractions: <explanation> */
/** biome-ignore-all assist/source/organizeImports: <explanation> */
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import * as React from "react";
import VectorDialog from "../assets/icons/vector-dialog.svg";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Button } from "./ui/button";

interface DialogProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof dialogVariants> {
	title: string;
	description: string;
	isOpen: boolean;
	onClose: () => void;
	onConfirm?: () => void;
	confirmText?: string;
	cancelText?: string;
	showIcon?: boolean;
}

const cn = (...inputs: ClassValue[]) => {
	return twMerge(clsx(inputs));
};

const dialogVariants = cva(
	"fixed inset-0 flex items-center justify-center p-4 bg-dialog/50",
	{
		variants: {
			variant: {
				default: "",
				attention: "",
				destructive: "",
				success: "",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

const dialogContentVariants = cva(
	"relative bg-background rounded-lg shadow-lg max-w-md w-full mx-4 p-6",
	{
		variants: {
			variant: {
				default: "border border-border",
				attention: "border border-border",
				destructive: "border border-border",
				success: "border border-border",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

const dialogTitleVariants = cva("text-xl font-semibold mb-2 z-50", {
	variants: {
		variant: {
			default: "text-foreground",
			attention: "text-attention",
			destructive: "text-destructive",
			success: "text-success",
		},
	},
	defaultVariants: {
		variant: "default",
	},
});

export const Dialog = React.forwardRef<HTMLDivElement, DialogProps>(
	(
		{
			className,
			variant,
			title,
			description,
			isOpen,
			onClose,
			onConfirm,
			confirmText = "Confirm",
			cancelText = "Cancel",
			showIcon = true,
			...props
		},
		ref,
	) => {
		if (!isOpen) return null;

		const getButtonVariant = () => {
			switch (variant) {
				case "attention":
					return "attention";
				case "destructive":
					return "destructive";
				case "success":
					return "success";
				default:
					return "primary";
			}
		};

		const getIcon = () => {
			if (!showIcon) return null;

			return (
				<div className="absolute top-0 left-0">
					<img
						src={VectorDialog}
						alt="Dialog icon"
						className="object-contain resize-y w-[95%]"
					/>
				</div>
			);
		};

		return (
			<div
				ref={ref}
				className={cn(dialogVariants({ variant, className }))}
				onClick={onClose}
				onKeyDown={(e) => {
					if (e.key === "Escape") {
						e.preventDefault();
						onClose();
					}
				}}
				tabIndex={-1}
				{...props}
			>
				<div
					className={cn(dialogContentVariants({ variant }))}
					onClick={(e) => e.stopPropagation()}
					onKeyDown={(e) => e.stopPropagation()}
				>
					<button
						type="button"
						onClick={onClose}
						onKeyDown={(e) => {
							if (e.key === "Escape") {
								e.preventDefault();
								onClose();
							}
						}}
						aria-label="Close dialog"
						className="cursor-pointer z-50 absolute top-7 right-8 text-foreground/60 hover:text-foreground transition-colors"
					>
						<X className="h-4 w-4 z-50" />
					</button>

					<div className="flex items-start gap-4">
						{getIcon()}
						<div className="flex-1 z-40">
							<h2 className={cn(dialogTitleVariants({ variant }))}>{title}</h2>
							<p className="text-foreground/80 text-sm mt-4 mb-8">
								{description}
							</p>

							<div className="flex gap-3 justify-end">
								<Button
									variant="secondary"
									onClick={onClose}
									className="min-w-24"
								>
									{cancelText}
								</Button>
								{onConfirm && (
									<Button
										variant={getButtonVariant()}
										onClick={onConfirm}
										className="min-w-24"
									>
										{confirmText}
									</Button>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	},
);

Dialog.displayName = "Dialog";
