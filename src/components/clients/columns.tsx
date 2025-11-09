import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { formatCnpj, formatPhone } from "@/utils/format";
import { type Client } from "@/services/clients";

interface ColumnProps {
  onEdit: (client: Client) => void;
}

const getStatusBadge = (active: boolean) => {
  return (
    <Badge variant={active ? "default" : "secondary"}>
      {active ? "Ativo" : "Inativo"}
    </Badge>
  );
};

export const createColumns = ({ onEdit }: ColumnProps): ColumnDef<Client>[] => [
  {
    accessorKey: "tenantName",
    header: "Nome",
  },
  {
    accessorKey: "tenantCnpj",
    header: "CNPJ",
    cell: ({ row }) => formatCnpj(row.getValue("tenantCnpj") as string),
  },
  {
    accessorKey: "email",
    header: "E-mail",
  },
  {
    accessorKey: "phone",
    header: "Telefone",
    cell: ({ row }) => {
      const phone = row.getValue("phone") as string | undefined;
      return phone ? formatPhone(phone) : "-";
    },
  },
  {
    accessorKey: "active",
    header: "Status",
    cell: ({ row }) => {
      const active = row.getValue("active") as boolean;
      return getStatusBadge(active);
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
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-10 w-10 p-0 hover:bg-yellow-100 hover:text-yellow-800 text-slate-700 rounded-lg transition-all duration-200 border border-slate-200 hover:border-yellow-300"
                  onClick={() => onEdit(client)}
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