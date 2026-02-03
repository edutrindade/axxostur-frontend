import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatCpf, formatPhone } from "@/utils/format";
import type { Traveler } from "@/types/traveler";

interface TravelersListDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  travelers: Traveler[];
  isLoading: boolean;
  isSelected: (travelerId: string) => boolean;
  onSelect: (traveler: Traveler) => void;
}

export const TravelersListDialog = ({ open, onOpenChange, travelers, isLoading, isSelected, onSelect }: TravelersListDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Listagem de viajantes</DialogTitle>
          <DialogDescription>Selecione um viajante para adicionar à venda.</DialogDescription>
        </DialogHeader>

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
                      <Button size="sm" onClick={() => onSelect(traveler)} disabled={isSelected(traveler.id)}>
                        Selecionar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
};
