import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { BusFormDialog } from "@/components/BusFormDialog";
import { DataTable, type ColumnDef, type TableAction } from "@/components/DataTable";
import { useAuth } from "@/hooks/useAuth";
import { useBusesByCompanyQuery } from "@/hooks/useBusesQuery";
import { useCreateBusMutation, useUpdateBusMutation, useDeleteBusMutation } from "@/hooks/useBusesMutations";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Bus, CreateBusFormData, UpdateBusFormData } from "@/types/bus";

const BusesList = () => {
  const { company } = useAuth();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const { data: busesResponse, isLoading: isLoadingBuses } = useBusesByCompanyQuery(company?.id || "", page, 20, search);
  const createBusMutation = useCreateBusMutation();
  const updateBusMutation = useUpdateBusMutation();
  const deleteBusMutation = useDeleteBusMutation();

  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedBus, setSelectedBus] = useState<Bus | undefined>();

  const buses = busesResponse?.data || [];
  const pagination = busesResponse?.pagination;

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      conventional: "Convencional",
      semi_bed: "Semi-Leito",
      bed: "Leito",
      bed_cabin: "Leito Cabine",
    };
    return labels[type] || type;
  };

  const handleSearch = useCallback(() => {
    setSearch(searchInput);
    setPage(1);
  }, [searchInput]);

  const handleCreateClick = () => {
    setSelectedBus(undefined);
    setOpenFormDialog(true);
  };

  const handleRowClick = (bus: Bus) => {
    setSelectedBus(bus);
    setOpenDetailsDialog(true);
  };

  const handleEditClick = (bus: Bus) => {
    setSelectedBus(bus);
    setOpenFormDialog(true);
  };

  const handleDeleteClick = (bus: Bus) => {
    setSelectedBus(bus);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedBus) {
      await deleteBusMutation.mutateAsync(selectedBus.id);
      setOpenDeleteDialog(false);
      setSelectedBus(undefined);
    }
  };

  const handleFormSubmit = async (data: CreateBusFormData | UpdateBusFormData) => {
    if (selectedBus) {
      await updateBusMutation.mutateAsync({
        id: selectedBus.id,
        data: data as UpdateBusFormData,
      });
    } else {
      await createBusMutation.mutateAsync(data as CreateBusFormData);
    }
    setOpenFormDialog(false);
  };

  const columns: ColumnDef<Bus>[] = [
    {
      key: "name",
      label: "Nome",
      render: (value) => <span className="font-semibold text-slate-900 text-base">{value}</span>,
    },
    {
      key: "plate",
      label: "Placa",
      render: (value) => <span className="text-slate-600 font-mono uppercase">{value}</span>,
    },
    {
      key: "totalSeats",
      label: "Assentos",
      render: (value) => <span className="text-slate-600">{value}</span>,
    },
    {
      key: "type",
      label: "Tipo",
      render: (value) => <span className="text-slate-600">{getTypeLabel(value)}</span>,
    },
    {
      key: "active",
      label: "Status",
      render: (value) => <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{value ? "Ativo" : "Inativo"}</span>,
    },
  ];

  const tableActions: TableAction<Bus>[] = [
    {
      icon: "edit",
      label: "Editar",
      onClick: handleEditClick,
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

  if (isLoadingBuses) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Ônibus</h1>
            <p className="text-slate-600 mt-2">Gerenciar frota de ônibus</p>
          </div>
          <Button disabled>
            <Icon name="plus" size={18} className="mr-2" />
            Novo Ônibus
          </Button>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
          <p className="text-slate-600">Carregando ônibus...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Ônibus</h1>
          <p className="text-slate-600 mt-2">Gerenciar frota de ônibus</p>
        </div>
        <Button onClick={handleCreateClick}>
          <Icon name="plus" size={18} className="mr-2" />
          Novo Ônibus
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4">
          <div className="flex items-center gap-3 h-10">
            <div className="flex items-center gap-2 flex-1 bg-white rounded-md px-3 border border-slate-200 transition-all duration-200 hover:border-slate-300 focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400">
              <Icon name="search" size={18} className="text-slate-400 flex-shrink-0" />
              <Input
                placeholder="Buscar por nome ou placa..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
                disabled={isLoadingBuses}
                isSearch={true}
                className="border-0 bg-transparent focus:bg-transparent focus-visible:ring-0 shadow-none h-full text-sm placeholder-slate-400"
              />
            </div>
            <Button size="sm" variant="outline" className="flex-shrink-0 h-full px-4">
              <Icon name="download" size={16} className="mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        <DataTable
          data={buses}
          columns={columns}
          actions={tableActions}
          pagination={pagination}
          onPageChange={setPage}
          onRowClick={handleRowClick}
          isLoading={isLoadingBuses}
          emptyIcon="bus"
          emptyTitle={search ? "Nenhum ônibus encontrado" : "Nenhum ônibus cadastrado"}
          emptyDescription={search ? "Tente fazer uma nova busca" : "Comece adicionando seu primeiro ônibus"}
        />
      </div>

      <BusFormDialog
        open={openFormDialog}
        onOpenChange={setOpenFormDialog}
        onSubmit={handleFormSubmit}
        isLoading={createBusMutation.isPending || updateBusMutation.isPending}
        bus={selectedBus}
        title={selectedBus ? "Editar Ônibus" : "Novo Ônibus"}
        description={selectedBus ? "Atualize as informações do ônibus" : "Adicione um novo ônibus à sua frota"}
        companyId={company?.id || ""}
      />

      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-slate-900">Confirmar Exclusão</DialogTitle>
            <DialogDescription className="text-slate-600 mt-4">
              Tem certeza que deseja remover o ônibus <span className="font-semibold text-slate-900">"{selectedBus?.name}"</span>? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpenDeleteDialog(false)} disabled={deleteBusMutation.isPending}>
              Cancelar
            </Button>
            <Button onClick={handleConfirmDelete} disabled={deleteBusMutation.isPending} variant="destructive">
              {deleteBusMutation.isPending ? "Removendo..." : "Remover"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={openDetailsDialog} onOpenChange={setOpenDetailsDialog}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-slate-900">{selectedBus?.name}</DialogTitle>
            <DialogDescription className="text-slate-600">Detalhes do ônibus</DialogDescription>
          </DialogHeader>

          {selectedBus && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</p>
                  <p className="text-sm">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${selectedBus.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{selectedBus.active ? "Ativo" : "Inativo"}</span>
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Placa</p>
                  <p className="text-sm text-slate-900 font-mono uppercase">{selectedBus.plate}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Tipo</p>
                  <p className="text-sm text-slate-900">{getTypeLabel(selectedBus.type)}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Assentos</p>
                  <p className="text-sm text-slate-900">{selectedBus.totalSeats}</p>
                </div>
              </div>

              <div className="space-y-2 border-t border-slate-200 pt-6 text-xs text-slate-500">
                <p>Criado em: {new Date(selectedBus.createdAt).toLocaleDateString("pt-BR", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })}</p>
                <p>Última atualização: {new Date(selectedBus.updatedAt).toLocaleDateString("pt-BR", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })}</p>
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
                handleEditClick(selectedBus!);
              }}
            >
              <Icon name="edit" size={16} className="mr-2" />
              Editar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BusesList;
