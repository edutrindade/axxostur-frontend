import { type ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { type User } from "@/services/users";

interface ColumnProps {
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

export const createColumns = ({ onEdit, onDelete }: ColumnProps): ColumnDef<User>[] => [
  {
    accessorKey: "firstName",
    header: "Nome",
    cell: ({ row }) => {
      const firstName = row.original.firstName;
      const lastName = row.original.lastName;
      const fullName = `${firstName} ${lastName}`.trim();
      return <span className="font-bold text-slate-900">{fullName}</span>;
    },
  },
  {
    accessorKey: "email",
    header: "Email",
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
      return <span className="text-slate-800 font-semibold">{phone || "-"}</span>;
    },
  },
  {
    accessorKey: "active",
    header: "Status",
    cell: ({ row }) => {
      const active = row.getValue("active") as boolean;
      return (
        <Badge variant={active ? "success" : "secondary"} className={`font-bold text-sm px-3 py-1 ${active ? "bg-green-100 text-green-800 border border-green-300" : "bg-red-100 text-red-800 border border-red-300"}`}>
          {active ? "Ativo" : "Inativo"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "cpf",
    header: "CPF",
    cell: ({ row }) => {
      const cpf = row.original.cpf;
      if (!cpf) return <span className="text-slate-800 font-semibold">-</span>;

      const cleaned = cpf.replace(/\D/g, "");
      if (cleaned.length === 11) {
        const masked = `${cleaned.substring(0, 3)}.***.***-${cleaned.substring(9, 11)}`;
        return <span className="text-slate-800 font-semibold">{masked}</span>;
      }
      return <span className="text-slate-800 font-semibold">-</span>;
    },
  },
  {
    accessorKey: "birthdate",
    header: "Data de Nascimento",
    cell: ({ row }) => {
      const date = row.getValue("birthdate") as string;
      return <span className="text-slate-800 font-semibold">{date ? new Date(date).toLocaleDateString("pt-BR") : "-"}</span>;
    },
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => {
      const user = row.original;

      return (
        <TooltipProvider>
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-10 w-10 p-0 hover:bg-blue-100 hover:text-blue-800 text-slate-700 rounded-lg transition-all duration-200 border border-slate-200 hover:border-blue-300" onClick={() => onEdit(user)}>
                  <Icon name="edit" size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-semibold">Editar usuário</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="sm" className="h-10 w-10 p-0 hover:bg-red-100 hover:text-red-800 text-slate-700 rounded-lg transition-all duration-200 border border-slate-200 hover:border-red-300" onClick={() => onDelete(user)}>
                  <Icon name="delete" size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-semibold">Excluir usuário</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      );
    },
  },
];
