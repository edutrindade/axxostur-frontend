import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { type Tenant } from "@/services/tenants";

interface ColumnProps {
  onEdit: (tenant: Tenant) => void;
}

export const createColumns = ({ onEdit }: ColumnProps): ColumnDef<Tenant>[] => [
  {
    accessorKey: "name",
    header: "Razão Social",
    cell: ({ row }) => {
      const name = row.getValue("name") as string;
      return <span className="font-bold text-slate-900">{name}</span>;
    },
  },
  {
    accessorKey: "fantasyName",
    header: "Nome Fantasia",
    cell: ({ row }) => {
      const value = row.getValue("fantasyName") as string | null;
      return <span className="text-slate-800 font-semibold">{value || "-"}</span>;
    },
  },
  {
    accessorKey: "cnpj",
    header: "CNPJ",
    cell: ({ row }) => {
      const cnpj = row.getValue("cnpj") as string;
      return <span className="text-slate-800 font-semibold">{cnpj}</span>;
    },
  },
  {
    accessorKey: "contactName",
    header: "Contato",
    cell: ({ row }) => {
      const value = row.getValue("contactName") as string | null;
      return <span className="text-slate-800 font-semibold">{value || "-"}</span>;
    },
  },
  {
    accessorKey: "contactPhone",
    header: "Telefone",
    cell: ({ row }) => {
      const value = row.getValue("contactPhone") as string | null;
      return <span className="text-slate-800 font-semibold">{value || "-"}</span>;
    },
  },
  {
    accessorKey: "active",
    header: "Status",
    cell: ({ row }) => {
      const active = row.getValue("active") as boolean;
      return (
        <Badge
          variant={active ? "success" : "secondary"}
          className={`font-bold text-sm px-3 py-1 ${
            active
              ? "bg-green-100 text-green-800 border border-green-300"
              : "bg-red-100 text-red-800 border border-red-300"
          }`}
        >
          {active ? "Ativa" : "Inativa"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Criada em",
    cell: ({ row }) => {
      const date = row.getValue("createdAt") as string;
      return (
        <span className="text-slate-800 font-semibold">
          {new Date(date).toLocaleDateString("pt-BR")}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => {
      const tenant = row.original;
      return (
        <Button
          variant="ghost"
          size="sm"
          className="h-10 w-10 p-0 hover:bg-blue-100 hover:text-blue-800 text-slate-700 rounded-lg transition-all duration-200 border border-slate-200 hover:border-blue-300"
          onClick={() => onEdit(tenant)}
        >
          <Icon name="edit" size={18} />
        </Button>
      );
    },
  },
];