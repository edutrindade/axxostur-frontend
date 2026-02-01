import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { DataTable, type ColumnDef, type TableAction } from "@/components/DataTable";
import { usePackagesQuery } from "@/hooks/usePackagesQuery";
import { useDeletePackageMutation } from "@/hooks/usePackagesMutations";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Package } from "@/types/package";

interface PackagesDataTableProps {
  onEdit: (pkg: Package) => void;
}

export const PackagesDataTable = ({ onEdit }: PackagesDataTableProps) => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const { data: packagesResponse, isLoading } = usePackagesQuery(page, 20, search);
  const deletePackageMutation = useDeletePackageMutation();

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | undefined>();
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const packages = packagesResponse?.data || [];
  const pagination = packagesResponse?.pagination;

  const handleSearch = useCallback(() => {
    setSearch(searchInput);
    setPage(1);
  }, [searchInput]);

  const handleEditClick = (pkg: Package) => {
    onEdit(pkg);
  };

  const handleDeleteClick = (pkg: Package) => {
    setSelectedPackage(pkg);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedPackage) {
      await deletePackageMutation.mutateAsync(selectedPackage.id);
      setOpenDeleteDialog(false);
      setSelectedPackage(undefined);
    }
  };

  const handleViewDetails = (pkg: Package) => {
    setSelectedPackage(pkg);
    setOpenDetailsDialog(true);
  };

  const columns: ColumnDef<Package>[] = [
    {
      key: "name",
      label: "Nome",
      render: (value) => <span className="font-semibold text-slate-900 text-base">{value}</span>,
    },
    {
      key: "hotel",
      label: "Hotel",
      render: (_, row) => <span className="text-slate-600">{row.hotel?.name || "-"}</span>,
    },
    {
      key: "nights",
      label: "Noites",
      render: (value) => <span className="text-slate-600">{value}</span>,
    },
    {
      key: "description",
      label: "Descrição",
      render: (value) => <span className="text-slate-600">{value || "-"}</span>,
    },
    {
      key: "active",
      label: "Status",
      render: (value) => <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{value ? "Ativo" : "Inativo"}</span>,
    },
  ];

  const tableActions: TableAction<Package>[] = [
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

  return (
    <>
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4">
          <div className="flex items-center gap-3 h-10">
            <div className="flex items-center gap-2 flex-1 bg-white rounded-md px-3 border border-slate-200 transition-all duration-200 hover:border-slate-300 focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400">
              <Icon name="search" size={18} className="text-slate-400 flex-shrink-0" />
              <Input
                placeholder="Buscar por nome..."
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
          data={packages}
          columns={columns}
          actions={tableActions}
          pagination={pagination}
          onPageChange={setPage}
          onRowClick={handleViewDetails}
          isLoading={isLoading}
          emptyIcon="package"
          emptyTitle={search ? "Nenhum pacote encontrado" : "Nenhum pacote cadastrado"}
          emptyDescription={search ? "Tente fazer uma nova busca" : "Comece adicionando seu primeiro pacote"}
        />
      </div>

      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remover pacote</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja remover o pacote <strong>{selectedPackage?.name}</strong>? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setOpenDeleteDialog(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete} disabled={deletePackageMutation.isPending}>
              {deletePackageMutation.isPending ? "Removendo..." : "Remover"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={openDetailsDialog} onOpenChange={setOpenDetailsDialog}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-slate-900">{selectedPackage?.name}</DialogTitle>
            <DialogDescription className="text-slate-600">Detalhes do pacote</DialogDescription>
          </DialogHeader>

          {selectedPackage && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Hotel</p>
                  <p className="text-sm font-semibold text-slate-900">{selectedPackage.hotel?.name || "-"}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Quantidade de Noites</p>
                  <p className="text-sm text-slate-900">{selectedPackage.nights}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</p>
                  <p className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${selectedPackage.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{selectedPackage.active ? "Ativo" : "Inativo"}</p>
                </div>
              </div>

              {selectedPackage.description && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Descrição</p>
                  <p className="text-sm text-slate-700 leading-relaxed">{selectedPackage.description}</p>
                </div>
              )}

              <div className="border-t border-slate-200 pt-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">Incluso no Pacote</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${selectedPackage.includesBreakfast ? "bg-green-500" : "bg-slate-300"}`} />
                    <span className="text-sm text-slate-700">Café da Manhã</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${selectedPackage.includesLunch ? "bg-green-500" : "bg-slate-300"}`} />
                    <span className="text-sm text-slate-700">Almoço</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${selectedPackage.includesDinner ? "bg-green-500" : "bg-slate-300"}`} />
                    <span className="text-sm text-slate-700">Jantar</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${selectedPackage.includesTours ? "bg-green-500" : "bg-slate-300"}`} />
                    <span className="text-sm text-slate-700">Passeios</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${selectedPackage.includesTransfer ? "bg-green-500" : "bg-slate-300"}`} />
                    <span className="text-sm text-slate-700">Transfer</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${selectedPackage.includesInsurance ? "bg-green-500" : "bg-slate-300"}`} />
                    <span className="text-sm text-slate-700">Seguro</span>
                  </div>
                  {selectedPackage.openFood && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      <span className="text-sm text-slate-700">Comida Aberta</span>
                    </div>
                  )}
                </div>
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
                handleEditClick(selectedPackage!);
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
