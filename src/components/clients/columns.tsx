import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { formatCnpj, formatPhone } from "@/utils/format";
import { type Client } from "@/services/clients";

interface ColumnProps {
  onEdit: (client: Client) => void;
  onView: (client: Client) => void;
}

export const createColumns = ({ onEdit, onView }: ColumnProps): ColumnDef<Client>[] => [
  {
    accessorKey: "tenant.name",
    header: "Nome",
    cell: ({ row }) => {
      const name = row.original.tenant.name;
      return <span className="font-bold text-slate-900">{name}</span>;
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
    accessorKey: "email",
    header: "E-mail",
    cell: ({ row }) => {
      const email = row.getValue("email") as string;
      return <span className="text-slate-800 font-semibold">{email}</span>;
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
    accessorKey: "tenant.active",
    header: "Status",
    cell: ({ row }) => {
      const active = row.original.tenant.active;
      return (
        <Badge variant={active ? "success" : "secondary"} className={`font-bold text-sm px-3 py-1 ${active ? "bg-green-100 text-green-800 border border-green-300" : "bg-red-100 text-red-800 border border-red-300"}`}>
          {active ? "Ativo" : "Inativo"}
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
                <Button variant="ghost" size="sm" className="h-10 w-10 p-0 hover:bg-yellow-100 hover:text-yellow-800 text-slate-700 rounded-lg transition-all duration-200 border border-slate-200 hover:border-yellow-300" onClick={() => onEdit(client)}>
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
