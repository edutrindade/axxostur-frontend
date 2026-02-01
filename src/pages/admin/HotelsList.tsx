import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { HotelFormDialog } from "@/components/HotelFormDialog";
import { DataTable, type ColumnDef, type TableAction } from "@/components/DataTable";
import { useAuth } from "@/hooks/useAuth";
import { useHotelsByCompanyQuery } from "@/hooks/useHotelsQuery";
import { useCreateHotelMutation, useUpdateHotelMutation, useDeleteHotelMutation } from "@/hooks/useHotelsMutations";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatPhone } from "@/utils/format";
import type { Hotel, CreateHotelRequest, UpdateHotelRequest } from "@/services/hotels";

const HotelsList = () => {
  const { company } = useAuth();
  const [page, setPage] = useState(1);
  const [name, setName] = useState("");
  const [nameInput, setNameInput] = useState("");
  const { data: hotelsResponse, isLoading: isLoadingHotels } = useHotelsByCompanyQuery(company?.id || "", page, 20, name);
  const createHotelMutation = useCreateHotelMutation();
  const updateHotelMutation = useUpdateHotelMutation();
  const deleteHotelMutation = useDeleteHotelMutation();

  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | undefined>();

  const hotels = hotelsResponse?.data || [];
  const pagination = hotelsResponse?.pagination;

  const handleSearch = useCallback(() => {
    setName(nameInput);
    setPage(1);
  }, [nameInput]);

  const handleCreateClick = () => {
    setSelectedHotel(undefined);
    setOpenFormDialog(true);
  };

  const handleRowClick = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    setOpenDetailsDialog(true);
  };

  const handleEditClick = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    setOpenFormDialog(true);
  };

  const handleDeleteClick = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedHotel) {
      await deleteHotelMutation.mutateAsync(selectedHotel.id);
      setOpenDeleteDialog(false);
      setSelectedHotel(undefined);
    }
  };

  const handleFormSubmit = async (data: CreateHotelRequest | UpdateHotelRequest) => {
    if (selectedHotel) {
      await updateHotelMutation.mutateAsync({
        id: selectedHotel.id,
        data: data as UpdateHotelRequest,
      });
    } else {
      await createHotelMutation.mutateAsync(data as CreateHotelRequest);
    }
    setOpenFormDialog(false);
  };

  const columns: ColumnDef<Hotel>[] = [
    {
      key: "name",
      label: "Nome",
      render: (value) => <span className="font-semibold text-slate-900 text-base">{value}</span>,
    },
    {
      key: "stars",
      label: "Classificação",
      render: (_value, hotel) =>
        hotel.stars && (
          <span className="inline-flex items-center gap-1">
            {Array.from({ length: hotel.stars }).map((_, i) => (
              <Icon key={i} name="star" size={14} className="fill-yellow-400 text-yellow-400" />
            ))}
          </span>
        ),
    },
    {
      key: "totalRooms",
      label: "Quartos",
      render: (value) => <span className="text-slate-600">{value || "-"}</span>,
    },
    {
      key: "phone",
      label: "Contato",
      render: (_value, hotel) => (
        <div className="text-sm">
          {hotel.phone && <p>{formatPhone(hotel.phone)}</p>}
          {hotel.email && <p className="text-xs text-slate-500">{hotel.email}</p>}
        </div>
      ),
    },
    {
      key: "active",
      label: "Status",
      render: (value) => <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{value ? "Ativo" : "Inativo"}</span>,
    },
  ];

  const tableActions: TableAction<Hotel>[] = [
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

  if (isLoadingHotels) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Hotéis</h1>
            <p className="text-slate-600 mt-2">Gerenciar hotéis e acomodações</p>
          </div>
          <Button disabled>
            <Icon name="plus" size={18} className="mr-2" />
            Novo Hotel
          </Button>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
          <p className="text-slate-600">Carregando hotéis...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Hotéis</h1>
          <p className="text-slate-600 mt-2">Gerenciar hotéis e acomodações</p>
        </div>
        <Button onClick={handleCreateClick}>
          <Icon name="plus" size={18} className="mr-2" />
          Novo Hotel
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4">
          <div className="flex items-center gap-3 h-10">
            <div className="flex items-center gap-2 flex-1 bg-white rounded-md px-3 border border-slate-200 transition-all duration-200 hover:border-slate-300 focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400">
              <Icon name="search" size={18} className="text-slate-400 flex-shrink-0" />
              <Input
                placeholder="Pesquisar hotel por nome..."
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
                disabled={isLoadingHotels}
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
          data={hotels}
          columns={columns}
          actions={tableActions}
          pagination={pagination}
          onPageChange={setPage}
          onRowClick={handleRowClick}
          isLoading={isLoadingHotels}
          emptyIcon="building"
          emptyTitle={name ? "Nenhum hotel encontrado com esse nome" : "Nenhum hotel cadastrado"}
          emptyDescription={name ? "Tente fazer uma nova busca" : "Comece adicionando seu primeiro hotel"}
        />
      </div>

      <HotelFormDialog
        open={openFormDialog}
        onOpenChange={setOpenFormDialog}
        onSubmit={handleFormSubmit}
        isLoading={createHotelMutation.isPending || updateHotelMutation.isPending}
        hotel={selectedHotel}
        title={selectedHotel ? "Editar Hotel" : "Novo Hotel"}
        description={selectedHotel ? "Atualize as informações do hotel" : "Adicione um novo hotel ao seu catálogo"}
        companyId={company?.id || ""}
      />

      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-slate-900">Confirmar Exclusão</DialogTitle>
            <DialogDescription className="text-slate-600 mt-4">
              Tem certeza que deseja remover o hotel <span className="font-semibold text-slate-900">"{selectedHotel?.name}"</span>? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpenDeleteDialog(false)} disabled={deleteHotelMutation.isPending}>
              Cancelar
            </Button>
            <Button onClick={handleConfirmDelete} disabled={deleteHotelMutation.isPending} variant="destructive">
              {deleteHotelMutation.isPending ? "Removendo..." : "Remover"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={openDetailsDialog} onOpenChange={setOpenDetailsDialog}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-slate-900">{selectedHotel?.name}</DialogTitle>
            <DialogDescription className="text-slate-600">Detalhes do hotel</DialogDescription>
          </DialogHeader>

          {selectedHotel && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</p>
                  <p className="text-sm">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${selectedHotel.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{selectedHotel.active ? "Ativo" : "Inativo"}</span>
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Classificação</p>
                  <div className="flex items-center gap-1">
                    {selectedHotel.stars ? Array.from({ length: selectedHotel.stars }).map((_, i) => <Icon key={i} name="star" size={16} className="fill-yellow-400 text-yellow-400" />) : <span className="text-slate-600 text-sm">Sem classificação</span>}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Contato</p>
                  <div className="space-y-1">
                    {selectedHotel.phone ? <p className="text-sm text-slate-900 font-medium">{formatPhone(selectedHotel.phone)}</p> : <p className="text-sm text-slate-500">-</p>}
                    {selectedHotel.email && <p className="text-sm text-slate-600">{selectedHotel.email}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Quartos</p>
                  <p className="text-sm text-slate-900">{selectedHotel.totalRooms || "-"}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Check-in</p>
                  <p className="text-sm text-slate-900">{selectedHotel.checkInTime || "-"}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Check-out</p>
                  <p className="text-sm text-slate-900">{selectedHotel.checkOutTime || "-"}</p>
                </div>
              </div>

              {selectedHotel.website && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Website</p>
                  <p className="text-sm">
                    <a href={selectedHotel.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 underline">
                      {selectedHotel.website}
                    </a>
                  </p>
                </div>
              )}

              {selectedHotel.description && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Descrição</p>
                  <p className="text-sm text-slate-700 leading-relaxed">{selectedHotel.description}</p>
                </div>
              )}

              {selectedHotel.internalNotes && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Anotações Internas</p>
                  <p className="text-sm text-slate-700 leading-relaxed">{selectedHotel.internalNotes}</p>
                </div>
              )}

              {selectedHotel.address && (
                <div className="space-y-2 border-t border-slate-200 pt-6">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">Endereço</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-700">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Rua</p>
                      <p>{selectedHotel.address.street}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Número</p>
                      <p>{selectedHotel.address.number}</p>
                    </div>
                    {selectedHotel.address.complement && (
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Complemento</p>
                        <p>{selectedHotel.address.complement}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Bairro</p>
                      <p>{selectedHotel.address.neighborhood}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Cidade</p>
                      <p>{selectedHotel.address.city}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Estado</p>
                      <p>{selectedHotel.address.state}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">CEP</p>
                      <p>{selectedHotel.address.zipCode}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2 border-t border-slate-200 pt-6 text-xs text-slate-500">
                <p>Criado em: {new Date(selectedHotel.createdAt).toLocaleDateString("pt-BR", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })}</p>
                <p>Última atualização: {new Date(selectedHotel.updatedAt).toLocaleDateString("pt-BR", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })}</p>
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
                handleEditClick(selectedHotel!);
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

export default HotelsList;
