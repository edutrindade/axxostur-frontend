import { CustomPagination } from "@/components/CustomPagination";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { formatCpf, formatPhone } from "@/utils/format";
import type { Traveler, PaginationData } from "@/types/traveler";
import { UserPlus } from "lucide-react";

interface TravelersListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  travelers: Traveler[];
  isLoading: boolean;
  isSelected: (travelerId: string) => boolean;
  onSelect: (traveler: Traveler) => void;
  filterField: "name" | "cpf";
  filterValue: string;
  onFilterFieldChange: (value: "name" | "cpf") => void;
  onFilterValueChange: (value: string) => void;
  pagination?: PaginationData | null;
  onPageChange?: (page: number) => void;
}

export const TravelersListDialog = ({ open, onOpenChange, travelers, isLoading, isSelected, onSelect, filterField, filterValue, onFilterFieldChange, onFilterValueChange, pagination, onPageChange }: TravelersListDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-2xl sm:max-w-3xl md:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Listagem de viajantes</DialogTitle>
          <DialogDescription>Selecione um viajante para adicionar à venda.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="w-full sm:max-w-[120px]">
            <label className="mb-2 block text-sm font-semibold text-slate-700">Filtrar por</label>
            <Select value={filterField} onValueChange={(value) => onFilterFieldChange(value as "name" | "cpf")}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Nome</SelectItem>
                <SelectItem value="cpf">CPF</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full sm:flex-1">
            <label className="mb-2 block text-sm font-semibold text-slate-700">Pesquisar</label>
            <Input placeholder={filterField === "name" ? "Digite o nome do viajante" : "Digite o CPF do viajante"} value={filterValue} onChange={(event) => onFilterValueChange(event.target.value)} />
          </div>
        </div>

        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-28">Código</TableHead>
                <TableHead>Nome</TableHead>
                <TableHead className="w-40">CPF</TableHead>
                <TableHead className="w-40">Telefone</TableHead>
                <TableHead className="w-40 text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-slate-500 py-6">
                    Carregando viajantes...
                  </TableCell>
                </TableRow>
              ) : travelers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-slate-500 py-6">
                    Nenhum viajante encontrado
                  </TableCell>
                </TableRow>
              ) : (
                travelers.map((traveler) => (
                  <TableRow key={traveler.id}>
                    <TableCell className="text-slate-600">{traveler.code !== undefined && traveler.code !== null ? String(traveler.code).padStart(3, "0") : "-"}</TableCell>
                    <TableCell className="font-semibold text-slate-900">{traveler.name}</TableCell>
                    <TableCell className="text-slate-600">{traveler.cpf ? formatCpf(traveler.cpf) : "-"}</TableCell>
                    <TableCell className="text-slate-600">{traveler.phone ? formatPhone(traveler.phone) : "-"}</TableCell>
                    <TableCell className="text-right">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button size="icon" variant="outline" onClick={() => onSelect(traveler)} disabled={isSelected(traveler.id)} aria-label="Selecionar viajante ao serviço">
                            <UserPlus />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Selecionar viajante ao serviço</TooltipContent>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {pagination && onPageChange ? (
          <div className="border border-slate-200 rounded-lg p-4">
            <CustomPagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={onPageChange} hasNextPage={pagination.hasNextPage} hasPreviousPage={pagination.hasPreviousPage} disabled={isLoading} />
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};
