import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { formatCpfCnpj, formatPhone } from "@/utils/format";
import { type Client } from "@/services/clients";

const getStatusBadge = (active: boolean) => {
  return (
    <Badge variant={active ? "default" : "destructive"} className={`font-bold text-sm px-3 py-1 ${active ? "bg-green-100 text-green-800 border border-green-300" : "bg-red-100 text-red-800 border border-red-300"}`} style={{ width: "80px" }}>
      {active ? "Ativa" : "Inativa"}
    </Badge>
  );
};

interface ColumnProps {
  onView: (client: Client) => void;
  onEdit: (client: Client) => void;
}

export const createColumns = ({ onView, onEdit }: ColumnProps): ColumnDef<Client>[] => [
  {
    accessorKey: "tenant.name",
    header: "Razão Social",
    cell: ({ row }: { row: { original: Client } }) => {
      const client = row.original;
      return <span className="font-bold text-slate-900">{client.tenant.name}</span>;
    },
  },
  {
    accessorKey: "tenant.fantasyName",
    header: "Nome Fantasia",
    cell: ({ row }: { row: { original: Client } }) => {
      const client = row.original;
      return <span className="text-slate-800 font-semibold">{client.tenant.fantasyName || "-"}</span>;
    },
  },
  {
    accessorKey: "tenant.cnpj",
    header: "CNPJ",
    cell: ({ row }: { row: { original: Client } }) => {
      const client = row.original;
      const cnpj = client.tenant.cnpj;
      return <span className="text-slate-800 font-semibold">{cnpj ? formatCpfCnpj(cnpj) : "-"}</span>;
    },
  },
  {
    accessorKey: "email",
    header: "E-mail",
    cell: ({ row }: { row: { original: Client } }) => {
      const client = row.original;
      return <span className="text-slate-800 font-semibold">{client.email}</span>;
    },
  },
  {
    accessorKey: "phone",
    header: "Telefone",
    cell: ({ row }: { row: { original: Client } }) => {
      const client = row.original;
      const phone = client.phone;
      return <span className="text-slate-800 font-semibold">{phone ? formatPhone(phone) : "-"}</span>;
    },
  },
  {
    accessorKey: "tenant.active",
    header: "Status",
    cell: ({ row }: { row: { original: Client } }) => {
      const client = row.original;
      return getStatusBadge(client.tenant.active);
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
