import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { HotelFormDialog } from "@/components/HotelFormDialog";
import { CustomPagination } from "@/components/CustomPagination";
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
      />

      {!hotels || hotels.length === 0 ? (
        <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
          <Icon name="building" size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-600 text-lg mb-2">{name ? "Nenhum hotel encontrado com esse nome" : "Nenhum hotel cadastrado"}</p>
          <p className="text-slate-500">{name ? "Tente fazer uma nova busca" : "Comece adicionando seu primeiro hotel"}</p>
        </div>
      ) : (
        <>
          <div className="hidden lg:block bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
            <Table>
              <TableHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-slate-700 font-semibold">Nome</TableHead>
                  <TableHead className="text-slate-700 font-semibold">Classificação</TableHead>
                  <TableHead className="text-slate-700 font-semibold">Quartos</TableHead>
                  <TableHead className="text-slate-700 font-semibold">Contato</TableHead>
                  <TableHead className="text-slate-700 font-semibold">Status</TableHead>
                  <TableHead className="text-slate-700 font-semibold text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hotels.map((hotel) => (
                  <TableRow key={hotel.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <TableCell className="font-medium text-slate-900">{hotel.name}</TableCell>
                    <TableCell className="text-slate-600">
                      {hotel.stars && (
                        <span className="inline-flex items-center gap-1">
                          {Array.from({ length: hotel.stars }).map((_, i) => (
                            <Icon key={i} name="star" size={14} className="fill-yellow-400 text-yellow-400" />
                          ))}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-slate-600">{hotel.totalRooms || "-"}</TableCell>
                    <TableCell className="text-slate-600">
                      {hotel.phone || hotel.email ? (
                        <div className="text-sm">
                          {hotel.phone && <p>{formatPhone(hotel.phone)}</p>}
                          {hotel.email && <p className="text-xs text-slate-500">{hotel.email}</p>}
                        </div>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${hotel.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{hotel.active ? "Ativo" : "Inativo"}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button onClick={() => handleEditClick(hotel)} size="sm" variant="outline">
                          <Icon name="edit" size={16} />
                        </Button>
                        <Button onClick={() => handleDeleteClick(hotel)} size="sm" variant="destructive">
                          <Icon name="delete" size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="border-t border-slate-200 p-4">
              {pagination && <CustomPagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={setPage} hasNextPage={pagination.hasNextPage} hasPreviousPage={pagination.hasPreviousPage} disabled={isLoadingHotels} />}
            </div>
          </div>

          <div className="lg:hidden space-y-4">
            {hotels.map((hotel) => (
              <div key={hotel.id} className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 text-lg">{hotel.name}</h3>
                      {hotel.stars && (
                        <div className="flex items-center gap-1 mt-1">
                          {Array.from({ length: hotel.stars }).map((_, i) => (
                            <Icon key={i} name="star" size={14} className="fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      )}
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-2 ${hotel.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{hotel.active ? "Ativo" : "Inativo"}</span>
                  </div>

                  {(hotel.totalRooms || hotel.phone || hotel.email) && (
                    <div className="text-sm text-slate-600 space-y-1">
                      {hotel.totalRooms && <p>Quartos: {hotel.totalRooms}</p>}
                      {hotel.phone && <p>{formatPhone(hotel.phone)}</p>}
                      {hotel.email && <p>{hotel.email}</p>}
                    </div>
                  )}

                  {hotel.description && <p className="text-sm text-slate-600 line-clamp-2">{hotel.description}</p>}

                  <div className="flex gap-2 pt-2">
                    <Button onClick={() => handleEditClick(hotel)} size="sm" variant="outline" className="flex-1">
                      <Icon name="edit" size={16} className="mr-1" />
                      Editar
                    </Button>
                    <Button onClick={() => handleDeleteClick(hotel)} size="sm" variant="destructive" className="flex-1">
                      <Icon name="delete" size={16} className="mr-1" />
                      Deletar
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {pagination && (
              <div className="bg-white rounded-lg border border-slate-200 p-4">
                <CustomPagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={setPage} hasNextPage={pagination.hasNextPage} hasPreviousPage={pagination.hasPreviousPage} disabled={isLoadingHotels} />
              </div>
            )}
          </div>
        </>
      )}

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
    </div>
  );
};

export default HotelsList;
