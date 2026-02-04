import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Plus, UsersRound, Pencil, Trash2 } from "lucide-react";
import { formatCpf, formatPhone } from "@/utils/format";
import type { Traveler } from "@/types/traveler";

interface EditingTravelerForm {
  name: string;
  cpf: string;
  document: string;
  email: string;
  phone: string;
  birthDate: string;
  gender: string;
  notes: string;
}

interface TravelersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTravelers: Traveler[];
  editingTravelerId: string;
  editingTravelerForm: EditingTravelerForm;
  onEditFieldChange: (field: keyof EditingTravelerForm, value: string) => void;
  onEditFieldUpdate: (field: keyof EditingTravelerForm, value: string) => void;
  onSelectTraveler: (traveler: Traveler) => void;
  onRemoveTraveler: (travelerId: string) => void;
  onOpenCreate: () => void;
  onOpenList: () => void;
  isListDisabled?: boolean;
}

export const TravelersDialog = ({ open, onOpenChange, selectedTravelers, editingTravelerId, editingTravelerForm, onEditFieldChange, onEditFieldUpdate, onSelectTraveler, onRemoveTraveler, onOpenCreate, onOpenList, isListDisabled = false }: TravelersDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-2xl sm:max-w-3xl md:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Viajantes</DialogTitle>
          <DialogDescription>Gerencie os viajantes selecionados para esta venda.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-slate-900">Viajantes selecionados</h3>
            <div className="flex items-center gap-2">
              <Button onClick={onOpenList} disabled={isListDisabled} variant="premium">
                <UsersRound size={16} />
                Viajantes cadastrados
              </Button>
              <Button size="sm" className="gap-2" onClick={onOpenCreate}>
                <Plus size={16} />
                Cadastrar
              </Button>
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
                {selectedTravelers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-slate-500 py-6">
                      Nenhum viajante selecionado
                    </TableCell>
                  </TableRow>
                ) : (
                  selectedTravelers.map((traveler) => (
                    <TableRow key={traveler.id}>
                      <TableCell className="text-slate-600">{traveler.code !== undefined && traveler.code !== null ? String(traveler.code).padStart(3, "0") : "-"}</TableCell>
                      <TableCell className="font-semibold text-slate-900">{traveler.name}</TableCell>
                      <TableCell className="text-slate-600">{traveler.cpf ? formatCpf(traveler.cpf) : "-"}</TableCell>
                      <TableCell className="text-slate-600">{traveler.phone ? formatPhone(traveler.phone) : "-"}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button size="icon" variant="outline" onClick={() => onSelectTraveler(traveler)} aria-label="Editar viajante">
                                <Pencil size={18} />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Editar viajante</TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button size="icon" variant="ghost" className="text-red-600 hover:text-red-700" onClick={() => onRemoveTraveler(traveler.id)} aria-label="Remover viajante">
                                <Trash2 size={18} />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Remover viajante</TooltipContent>
                          </Tooltip>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {editingTravelerId && (
            <div className="border border-slate-200 rounded-lg p-4 space-y-4">
              <h4 className="text-sm font-semibold text-slate-900">Editar viajante</h4>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                <div className="lg:col-span-6 space-y-2">
                  <Label htmlFor="edit-traveler-name">Nome</Label>
                  <Input id="edit-traveler-name" value={editingTravelerForm.name} onChange={(e) => onEditFieldChange("name", e.target.value)} onBlur={(e) => onEditFieldUpdate("name", e.target.value)} className="h-11 text-base" />
                </div>
                <div className="lg:col-span-3 space-y-2">
                  <Label htmlFor="edit-traveler-cpf">CPF</Label>
                  <Input id="edit-traveler-cpf" value={editingTravelerForm.cpf} onChange={(e) => onEditFieldChange("cpf", formatCpf(e.target.value))} onBlur={(e) => onEditFieldUpdate("cpf", e.target.value)} maxLength={14} className="h-11 text-base" />
                </div>
                <div className="lg:col-span-3 space-y-2">
                  <Label htmlFor="edit-traveler-phone">Telefone</Label>
                  <Input id="edit-traveler-phone" value={editingTravelerForm.phone} onChange={(e) => onEditFieldChange("phone", formatPhone(e.target.value))} onBlur={(e) => onEditFieldUpdate("phone", e.target.value)} maxLength={15} className="h-11 text-base" />
                </div>
                <div className="lg:col-span-4 space-y-2">
                  <Label htmlFor="edit-traveler-document">RG</Label>
                  <Input id="edit-traveler-document" value={editingTravelerForm.document} onChange={(e) => onEditFieldChange("document", e.target.value)} onBlur={(e) => onEditFieldUpdate("document", e.target.value)} className="h-11 text-base" />
                </div>
                <div className="lg:col-span-4 space-y-2">
                  <Label htmlFor="edit-traveler-email">Email</Label>
                  <Input id="edit-traveler-email" type="email" value={editingTravelerForm.email} onChange={(e) => onEditFieldChange("email", e.target.value)} onBlur={(e) => onEditFieldUpdate("email", e.target.value)} className="h-11 text-base" />
                </div>
                <div className="lg:col-span-4 space-y-2">
                  <Label htmlFor="edit-traveler-birth">Data de Nascimento</Label>
                  <Input id="edit-traveler-birth" type="date" value={editingTravelerForm.birthDate} onChange={(e) => onEditFieldChange("birthDate", e.target.value)} onBlur={(e) => onEditFieldUpdate("birthDate", e.target.value)} className="h-11 text-base" />
                </div>
                <div className="lg:col-span-4 space-y-2">
                  <Label htmlFor="edit-traveler-gender">Gênero</Label>
                  <Select
                    value={editingTravelerForm.gender}
                    onValueChange={(value) => {
                      onEditFieldChange("gender", value);
                      onEditFieldUpdate("gender", value);
                    }}
                  >
                    <SelectTrigger id="edit-traveler-gender" className="h-11 text-base">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Masculino</SelectItem>
                      <SelectItem value="female">Feminino</SelectItem>
                      <SelectItem value="other">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="lg:col-span-12 space-y-2">
                  <Label htmlFor="edit-traveler-notes">Observações</Label>
                  <Input id="edit-traveler-notes" value={editingTravelerForm.notes} onChange={(e) => onEditFieldChange("notes", e.target.value)} onBlur={(e) => onEditFieldUpdate("notes", e.target.value)} className="h-11 text-base" />
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
