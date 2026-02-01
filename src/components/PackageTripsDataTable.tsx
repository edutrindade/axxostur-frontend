import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { DataTable, type ColumnDef, type TableAction } from "@/components/DataTable";
import { usePackageTripsQuery } from "@/hooks/usePackageTripsQuery";
import { useDeletePackageTripMutation, useUpdatePackageTripMutation } from "@/hooks/usePackageTripsMutations";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatCurrency } from "@/utils/format";
import type { PackageTrip, PackageTripStatus } from "@/types/packageTrip";

interface PackageTripsDataTableProps {
  onEdit: (trip: PackageTrip) => void;
}

const getStatusLabel = (status: PackageTripStatus) => {
  const labels: Record<PackageTripStatus, string> = {
    scheduled: "Agendada",
    in_progress: "Em Andamento",
    completed: "Concluída",
    cancelled: "Cancelada",
    open: "Aberta",
  };
  return labels[status] || status;
};

const getStatusColor = (status: PackageTripStatus) => {
  const colors: Record<PackageTripStatus, string> = {
    scheduled: "bg-blue-100 text-blue-800",
    in_progress: "bg-yellow-100 text-yellow-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    open: "bg-purple-100 text-purple-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("pt-BR");
};

const formatPrice = (price: string | number) => {
  const numPrice = typeof price === "string" ? parseFloat(price) : price;
  return formatCurrency(numPrice);
};

const getBusTypeLabel = (type: string) => {
  const labels: Record<string, string> = {
    conventional: "Convencional",
    semi_bed: "Semi-Leito",
    bed: "Leito",
    bed_cabin: "Leito Cabine",
  };
  return labels[type] || type;
};

export const PackageTripsDataTable = ({ onEdit }: PackageTripsDataTableProps) => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const { data: tripsResponse, isLoading } = usePackageTripsQuery(page, 20, search);
  const deleteTripmutation = useDeletePackageTripMutation();
  const updateMutation = useUpdatePackageTripMutation();

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<PackageTrip | undefined>();
  const [statusChangeTrip, setStatusChangeTrip] = useState<PackageTrip | undefined>();
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [newStatus, setNewStatus] = useState<PackageTripStatus | "">();
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const trips = tripsResponse?.data || [];
  const pagination = tripsResponse?.pagination;

  const handleSearch = useCallback(() => {
    setSearch(searchInput);
    setPage(1);
  }, [searchInput]);

  const handleConfirmStatusChange = async () => {
    if (statusChangeTrip && newStatus) {
      await updateMutation.mutateAsync({
        id: statusChangeTrip.id,
        data: { status: newStatus as PackageTripStatus },
      });
      setShowStatusDialog(false);
      setStatusChangeTrip(undefined);
      setNewStatus("");
    }
  };

  const handleDeleteClick = (trip: PackageTrip) => {
    setSelectedTrip(trip);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedTrip) {
      await deleteTripmutation.mutateAsync(selectedTrip.id);
      setOpenDeleteDialog(false);
      setSelectedTrip(undefined);
    }
  };

  const handleViewDetails = (trip: PackageTrip) => {
    setSelectedTrip(trip);
    setOpenDetailsDialog(true);
  };

  const columns: ColumnDef<PackageTrip>[] = [
    {
      key: "package",
      label: "Pacote",
      render: (_, row) => <span className="font-semibold text-slate-900 text-base">{row.package?.name || row.packageId}</span>,
    },
    {
      key: "bus",
      label: "Ônibus",
      render: (_, row) => (
        <div className="flex flex-col gap-1">
          <span className="font-semibold text-slate-900">{row.bus?.name || row.busId}</span>
          <span className="text-sm text-slate-600">{row.bus?.plate}</span>
        </div>
      ),
    },
    {
      key: "departureDate",
      label: "Partida",
      render: (value) => <span className="text-slate-600">{formatDate(value)}</span>,
    },
    {
      key: "returnDate",
      label: "Retorno",
      render: (value) => <span className="text-slate-600">{formatDate(value)}</span>,
    },
    {
      key: "price",
      label: "Valor",
      render: (value) => <span className="font-medium text-slate-900">{formatPrice(value)}</span>,
    },
    {
      key: "reservedSeats",
      label: "Reservados",
      render: (value) => <span className="text-slate-600">{value}</span>,
    },
    {
      key: "soldSeats",
      label: "Vendidos",
      render: (value) => <span className="text-slate-600">{value}</span>,
    },
    {
      key: "status",
      label: "Status",
      render: (value) => <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(value)}`}>{getStatusLabel(value)}</span>,
    },
  ];

  const tableActions: TableAction<PackageTrip>[] = [
    {
      icon: "edit",
      label: "Editar",
      onClick: onEdit,
      variant: "outline",
      className: "bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100",
    },
    {
      icon: "delete",
      label: "Remover",
      onClick: handleDeleteClick,
      variant: "destructive",
    },
  ];

  return (
    <>
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4">
          <div className="flex items-center gap-3 h-10">
            <div className="flex items-center gap-2 flex-1 bg-white rounded-md px-3 border border-slate-200 transition-all duration-200 hover:border-slate-300 focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400">
              <Icon name="search" size={18} className="text-slate-400 flex-shrink-0" />
              <Input
                placeholder="Buscar viagens..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
                disabled={isLoading}
                isSearch={true}
                className="border-0 bg-transparent focus:bg-transparent focus-visible:ring-0 shadow-none h-full text-sm placeholder-slate-400"
              />
            </div>
          </div>
        </div>

        <DataTable
          data={trips}
          columns={columns}
          actions={tableActions}
          pagination={pagination}
          onPageChange={setPage}
          onRowClick={handleViewDetails}
          isLoading={isLoading}
          emptyIcon="package"
          emptyTitle={search ? "Nenhuma viagem encontrada" : "Nenhuma viagem cadastrada"}
          emptyDescription={search ? "Tente fazer uma nova busca" : "Comece adicionando sua primeira viagem"}
        />
      </div>

      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remover viagem</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja remover a viagem de <strong>{selectedTrip?.package?.name || selectedTrip?.packageId}</strong>? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setOpenDeleteDialog(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete} disabled={deleteTripmutation.isPending}>
              {deleteTripmutation.isPending ? "Removendo..." : "Remover"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alterar status da viagem</DialogTitle>
            <DialogDescription>Selecione o novo status para a viagem</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Select value={newStatus || ""} onValueChange={(value) => setNewStatus(value as PackageTripStatus)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Aberta</SelectItem>
                <SelectItem value="scheduled">Agendada</SelectItem>
                <SelectItem value="in_progress">Em Andamento</SelectItem>
                <SelectItem value="completed">Concluída</SelectItem>
                <SelectItem value="cancelled">Cancelada</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowStatusDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleConfirmStatusChange} disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Alterando..." : "Alterar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={openDetailsDialog} onOpenChange={setOpenDetailsDialog}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-slate-900">{selectedTrip?.package?.name}</DialogTitle>
            <DialogDescription className="text-slate-600">Detalhes da viagem</DialogDescription>
          </DialogHeader>

          {selectedTrip && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Ônibus</p>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-slate-900">{selectedTrip.bus?.name || selectedTrip.busId}</p>
                    <p className="text-sm text-slate-600">{selectedTrip.bus?.plate}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Tipo de Ônibus</p>
                  <p className="text-sm text-slate-900">{selectedTrip.bus?.type ? getBusTypeLabel(selectedTrip.bus.type) : "-"}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total de Poltronas</p>
                  <p className="text-sm text-slate-900">{selectedTrip.bus?.totalSeats || "-"}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</p>
                  <p className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedTrip.status)}`}>{getStatusLabel(selectedTrip.status)}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Data de Partida</p>
                  <p className="text-sm text-slate-900">{formatDate(selectedTrip.departureDate)}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Data de Retorno</p>
                  <p className="text-sm text-slate-900">{formatDate(selectedTrip.returnDate)}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Valor</p>
                  <p className="text-sm font-semibold text-slate-900">{formatPrice(selectedTrip.price)}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Poltronas</p>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-slate-500">Reservadas</p>
                      <p className="text-sm font-semibold text-slate-900">{selectedTrip.reservedSeats}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Vendidas</p>
                      <p className="text-sm font-semibold text-slate-900">{selectedTrip.soldSeats}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Informações do Pacote</p>
                <p className="text-sm text-slate-700">{selectedTrip.package?.description || "Sem descrição"}</p>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 mt-6">
            <Button type="button" variant="outline" onClick={() => setOpenDetailsDialog(false)}>
              Fechar
            </Button>
            <Button
              onClick={() => {
                setOpenDetailsDialog(false);
                onEdit(selectedTrip!);
              }}
            >
              <Icon name="edit" size={16} className="mr-2" />
              Editar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
