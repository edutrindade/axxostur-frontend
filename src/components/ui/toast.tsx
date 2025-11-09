import { toast as sonnerToast } from "sonner";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

type ToastVariant = "success" | "error" | "warning" | "info" | "default";

interface ToastOptions {
	title?: string;
	description?: string;
	duration?: number;
	action?: {
		label: string;
		onClick: () => void;
	};
}

const getToastStyles = (variant: ToastVariant) => {
	const baseStyles = "flex items-center gap-3 p-4 rounded-lg border shadow-lg";

	switch (variant) {
		case "success":
			return cn(
				baseStyles,
				"bg-green-50 border-green-200 text-green-800",
			);
		case "error":
			return cn(
				baseStyles,
				"bg-red-50 border-red-200 text-red-800",
			);
		case "warning":
			return cn(
				baseStyles,
				"bg-yellow-50 border-yellow-200 text-yellow-800",
			);
		case "info":
			return cn(
				baseStyles,
				"bg-blue-50 border-blue-200 text-blue-800",
			);
		default:
			return cn(baseStyles, "bg-background border-border text-foreground");
	}
};

const getIcon = (variant: ToastVariant) => {
	switch (variant) {
		case "success":
			return (
				<Icon
					name="check"
					size={20}
					className="text-success"
				/>
			);
		case "error":
			return (
				<Icon
					name="close"
					size={20}
					className="text-destructive"
				/>
			);
		case "warning":
			return (
				<Icon
					name="alert"
					size={20}
					className="text-attention"
				/>
			);
		case "info":
			return (
				<Icon
					name="info"
					size={20}
					className="text-blue-600"
				/>
			);
		default:
			return null;
	}
};

const createToastContent = (
	variant: ToastVariant,
	title?: string,
	description?: string,
) => {
	return (
		<div className={getToastStyles(variant)}>
			{getIcon(variant)}
			<div className="flex-1">
				{title && <div className="font-semibold text-sm">{title}</div>}
				{description && <div className="text-sm opacity-90">{description}</div>}
			</div>
		</div>
	);
};

export const toast = {
	success: (title: string, options?: ToastOptions) => {
		return sonnerToast.custom(
			() => createToastContent("success", title, options?.description),
			{
				duration: options?.duration || 4000,
				action: options?.action,
			},
		);
	},

	error: (title: string, options?: ToastOptions) => {
		return sonnerToast.custom(
			() => createToastContent("error", title, options?.description),
			{
				duration: options?.duration || 5000,
				action: options?.action,
			},
		);
	},

	warning: (title: string, options?: ToastOptions) => {
		return sonnerToast.custom(
			() => createToastContent("warning", title, options?.description),
			{
				duration: options?.duration || 4000,
				action: options?.action,
			},
		);
	},

	info: (title: string, options?: ToastOptions) => {
		return sonnerToast.custom(
			() => createToastContent("info", title, options?.description),
			{
				duration: options?.duration || 4000,
				action: options?.action,
			},
		);
	},

	default: (title: string, options?: ToastOptions) => {
		return sonnerToast.custom(
			() => createToastContent("default", title, options?.description),
			{
				duration: options?.duration || 4000,
				action: options?.action,
			},
		);
	},

	promise: sonnerToast.promise,
	dismiss: sonnerToast.dismiss,
	loading: (title: string, options?: ToastOptions) => {
		return sonnerToast.loading(title, {
			duration: options?.duration,
		});
	},
};
