import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="skeleton"
			className={cn(
				"bg-gradient-to-br from-slate-200 to-slate-100 animate-pulse rounded-lg",
				className,
			)}
			{...props}
		/>
	);
}

export { Skeleton };
