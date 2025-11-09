import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatCpfCnpj, formatPhone } from "@/utils/format";
import { type Enterprise } from "@/services/enterprises";

const getStatusBadge = (active: boolean) => {
	return (
		<Badge
			variant={active ? "default" : "destructive"}
			className={`font-bold text-sm px-3 py-1 ${
				active 
					? "bg-green-100 text-green-800 border border-green-300" 
					: "bg-red-100 text-red-800 border border-red-300"
			}`}
			style={{ width: "80px" }}
		>
			{active ? "Ativa" : "Inativa"}
		</Badge>
	);
};

interface ColumnProps {
	onView: (enterprise: Enterprise) => void;
	onEdit: (enterprise: Enterprise) => void;
}

export const createColumns = ({
	onView,
	onEdit,
}: ColumnProps): ColumnDef<Enterprise>[] => [
	{
		accessorKey: "fantasyName",
		header: "Nome Fantasia",
		cell: ({ row }: { row: { original: Enterprise } }) => {
			const enterprise = row.original;
			return (
				<div>
					<div className="font-bold text-slate-900">
						{enterprise.fantasyName || enterprise.socialReason}
					</div>
					{enterprise.fantasyName && (
						<div className="text-sm text-slate-700 font-semibold">
							{enterprise.socialReason}
						</div>
					)}
				</div>
			);
		},
	},
	{
		accessorKey: "cnpj",
		header: "CNPJ",
		cell: ({ row }: { row: { getValue: (key: string) => unknown } }) => {
			const cnpj = row.getValue("cnpj");
			return <span className="text-slate-800 font-semibold">{cnpj ? formatCpfCnpj(cnpj as string) : "-"}</span>;
		},
	},
	{
		accessorKey: "email",
		header: "E-mail",
		cell: ({ row }: { row: { getValue: (key: string) => unknown } }) => {
			const email = row.getValue("email");
			return <span className="text-slate-800 font-semibold">{email as string}</span>;
		},
	},
	{
		accessorKey: "phone",
		header: "Telefone",
		cell: ({ row }: { row: { getValue: (key: string) => unknown } }) => {
			const phone = row.getValue("phone");
			return <span className="text-slate-800 font-semibold">{phone ? formatPhone(phone as string) : "-"}</span>;
		},
	},
	{
		accessorKey: "active",
		header: "Status",
		cell: ({ row }: { row: { getValue: (key: string) => unknown } }) => {
			const active = row.getValue("active");
			return getStatusBadge(active as boolean);
		},
	},
	{
		id: "actions",
		header: "Ações",
		cell: ({ row }) => {
			const enterprise = row.original;

			return (
				<TooltipProvider>
					<div className="flex items-center gap-2">
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="ghost"
									size="sm"
									className="h-10 w-10 p-0 hover:bg-blue-100 hover:text-blue-800 text-slate-700 rounded-lg transition-all duration-200 border border-slate-200 hover:border-blue-300"
									onClick={() => onView(enterprise)}
								>
									<Icon name="eye" size={18} />
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								<p className="font-semibold">Visualizar</p>
							</TooltipContent>
						</Tooltip>

						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									variant="ghost"
									size="sm"
									className="h-10 w-10 p-0 hover:bg-yellow-100 hover:text-yellow-800 text-slate-700 rounded-lg transition-all duration-200 border border-slate-200 hover:border-yellow-300"
									onClick={() => onEdit(enterprise)}
								>
									<Icon name="edit" size={18} />
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								<p className="font-semibold">Editar</p>
							</TooltipContent>
						</Tooltip>
					</div>
				</TooltipProvider>
			);
		},
	},
];
