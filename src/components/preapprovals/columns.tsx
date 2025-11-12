import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { formatCnpj, formatPhone } from "@/utils/format";
import { type Client } from "@/services/clients";

interface ColumnProps {
  onApprove: (client: Client) => void;
  onReject: (client: Client) => void;
  onView: (client: Client) => void;
}

export const createPendingColumns = ({ onApprove, onReject, onView }: ColumnProps): ColumnDef<Client>[] => [
  {
    accessorKey: "tenant.name",
    header: "Empresa",
    cell: ({ row }) => {
      const name = row.original.tenant.name;
      return (
        <div className="flex flex-col">
          <span className="font-bold text-slate-900">{name}</span>
          <span className="text-xs text-slate-500">{row.original.tenant.fantasyName}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "tenant.cnpj",
    header: "CNPJ",
    cell: ({ row }) => {
      const cnpj = row.original.tenant.cnpj;
      return <span className="text-slate-800 font-semibold">{formatCnpj(cnpj)}</span>;
    },
  },
  {
    accessorKey: "name",
    header: "Responsável",
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      const email = row.original.email;
      return (
        <div className="flex flex-col">
          <span className="font-semibold text-slate-900">{name}</span>
          <span className="text-xs text-slate-500">{email}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "phone",
    header: "Telefone",
    cell: ({ row }) => {
      const phone = row.getValue("phone") as string;
      return <span className="text-slate-800 font-semibold">{formatPhone(phone)}</span>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Data do Cadastro",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt") as string);
      return <span className="text-slate-700 font-medium">{date.toLocaleDateString("pt-BR")}</span>;
    },
  },
  {
    accessorKey: "tenant.approved",
    header: "Status",
    cell: () => {
      return (
        <Badge variant="secondary" className="font-bold text-sm px-3 py-1 bg-amber-100 text-amber-800 border border-amber-300">
          Pendente
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => {
      const client = row.original;
      return (
        <TooltipProvider>
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-10 w-10 p-0 hover:bg-blue-100 hover:text-blue-800 text-slate-700 rounded-lg transition-all duration-200 border border-slate-200 hover:border-blue-300" onClick={() => onView(client)}>
                  <Icon name="eye" size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-semibold">Visualizar</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-10 w-10 p-0 hover:bg-green-100 hover:text-green-800 text-slate-700 rounded-lg transition-all duration-200 border border-slate-200 hover:border-green-300" onClick={() => onApprove(client)}>
                  <Icon name="check" size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-semibold">Aprovar</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-10 w-10 p-0 hover:bg-red-100 hover:text-red-800 text-slate-700 rounded-lg transition-all duration-200 border border-slate-200 hover:border-red-300" onClick={() => onReject(client)}>
                  <Icon name="close" size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-semibold">Rejeitar</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      );
    },
  },
];
