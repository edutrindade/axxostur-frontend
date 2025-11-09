import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
	"inline-flex items-center rounded-lg border px-3 py-1 text-sm font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
	{
		variants: {
			variant: {
				default:
					"border-blue-300 bg-blue-100 text-blue-800 hover:bg-blue-200 shadow-sm",
				secondary:
					"border-slate-300 bg-slate-100 text-slate-800 hover:bg-slate-200 shadow-sm",
				destructive:
					"border-red-300 bg-red-100 text-red-800 hover:bg-red-200 shadow-sm",
				success:
					"border-green-300 bg-green-100 text-green-800 hover:bg-green-200 shadow-sm",
				warning:
					"border-yellow-300 bg-yellow-100 text-yellow-800 hover:bg-yellow-200 shadow-sm",
				outline:
					"border-slate-400 text-slate-800 bg-white hover:bg-slate-50 shadow-sm",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

export interface BadgeProps
	extends React.HTMLAttributes<HTMLDivElement>,
	VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
	return (
		<div className={cn(badgeVariants({ variant }), className)} {...props} />
	);
}

export { Badge };
