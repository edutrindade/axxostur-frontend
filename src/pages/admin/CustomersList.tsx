import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { CustomerFormDialog } from "@/components/CustomerFormDialog";
import { DataTable, type ColumnDef, type TableAction } from "@/components/DataTable";
import { useAuth } from "@/hooks/useAuth";
import { useCustomersByCompanyQuery } from "@/hooks/useCustomersQuery";
import { useCreateCustomerMutation, useUpdateCustomerMutation, useDeleteCustomerMutation } from "@/hooks/useCustomersMutations";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatPhone, formatCpf } from "@/utils/format";
import type { Customer, CreateCustomerRequest, UpdateCustomerRequest } from "@/services/customers";

const CustomersList = () => {
  const { company } = useAuth();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const { data: customersResponse, isLoading: isLoadingCustomers } = useCustomersByCompanyQuery(company?.id || "", page, 20, search);
  const createCustomerMutation = useCreateCustomerMutation();
  const updateCustomerMutation = useUpdateCustomerMutation();
  const deleteCustomerMutation = useDeleteCustomerMutation();

  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | undefined>();

  const customers = customersResponse?.data || [];
  const pagination = customersResponse?.pagination;

  const handleSearch = useCallback(() => {
    setSearch(searchInput);
    setPage(1);
  }, [searchInput]);

  const handleCreateClick = () => {
    setSelectedCustomer(undefined);
    setOpenFormDialog(true);
  };

  const handleRowClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    setOpenDetailsDialog(true);
  };

  const handleEditClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    setOpenFormDialog(true);
  };

  const handleDeleteClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedCustomer) {
      await deleteCustomerMutation.mutateAsync(selectedCustomer.id);
      setOpenDeleteDialog(false);
      setSelectedCustomer(undefined);
    }
  };

  const handleFormSubmit = async (data: CreateCustomerRequest | UpdateCustomerRequest) => {
    if (selectedCustomer) {
      await updateCustomerMutation.mutateAsync({
        id: selectedCustomer.id,
        data: data as UpdateCustomerRequest,
      });
    } else {
      await createCustomerMutation.mutateAsync(data as CreateCustomerRequest);
    }
    setOpenFormDialog(false);
  };

  const columns: ColumnDef<Customer>[] = [
    {
      key: "name",
      label: "Nome",
      render: (value) => <span className="font-semibold text-slate-900 text-base">{value}</span>,
    },
    {
      key: "email",
      label: "Email",
      render: (value) => (
        <div className="flex items-center gap-2">
          <Icon name="mail" size={16} className="text-slate-400 flex-shrink-0" />
          <span className="text-slate-600">{value || "-"}</span>
        </div>
      ),
    },
    {
      key: "phone",
      label: "Telefone",
      render: (value) => <span className="text-slate-600">{value ? formatPhone(value) : "-"}</span>,
    },
    {
      key: "cpf",
      label: "CPF",
      render: (value) => <span className="text-slate-600 font-mono">{value ? formatCpf(value) : "-"}</span>,
    },
    {
      key: "gender",
      label: "Gênero",
      render: (value) => <span className="text-slate-600">{value ? (value === "male" ? "Masculino" : value === "female" ? "Feminino" : "Outro") : "-"}</span>,
    },
    {
      key: "active",
      label: "Status",
      render: (value) => <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{value ? "Ativo" : "Inativo"}</span>,
    },
  ];

  const tableActions: TableAction<Customer>[] = [
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

  if (isLoadingCustomers) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Clientes</h1>
            <p className="text-slate-600 mt-2">Gerenciar clientes e informações de contato</p>
          </div>
          <Button disabled>
            <Icon name="plus" size={18} className="mr-2" />
            Novo Cliente
          </Button>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
          <p className="text-slate-600">Carregando clientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Clientes</h1>
          <p className="text-slate-600 mt-2">Gerenciar clientes e informações de contato</p>
        </div>
        <Button onClick={handleCreateClick}>
          <Icon name="plus" size={18} className="mr-2" />
          Novo Cliente
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-100">
          <div className="flex items-center gap-3 h-10">
            <div className="flex items-center gap-2 flex-1 bg-white rounded-md px-3 border border-slate-200 transition-all duration-200 hover:border-slate-300 focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400">
              <Icon name="search" size={18} className="text-slate-400 flex-shrink-0" />
              <Input
                placeholder="Buscar por nome ou CPF..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
                disabled={isLoadingCustomers}
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
          data={customers}
          columns={columns}
          actions={tableActions}
          pagination={pagination}
          onPageChange={setPage}
          onRowClick={handleRowClick}
          isLoading={isLoadingCustomers}
          emptyIcon="users"
          emptyTitle={search ? "Nenhum cliente encontrado" : "Nenhum cliente cadastrado"}
          emptyDescription={search ? "Tente fazer uma nova busca" : "Comece adicionando seu primeiro cliente"}
        />
      </div>

      <CustomerFormDialog
        open={openFormDialog}
        onOpenChange={setOpenFormDialog}
        onSubmit={handleFormSubmit}
        isLoading={createCustomerMutation.isPending || updateCustomerMutation.isPending}
        customer={selectedCustomer}
        title={selectedCustomer ? "Editar Cliente" : "Novo Cliente"}
        description={selectedCustomer ? "Atualize as informações do cliente" : "Adicione um novo cliente"}
        companyId={company?.id || ""}
      />

      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-slate-900">Confirmar Exclusão</DialogTitle>
            <DialogDescription className="text-slate-600 mt-4">
              Tem certeza que deseja remover o cliente <span className="font-semibold text-slate-900">"{selectedCustomer?.name}"</span>? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpenDeleteDialog(false)} disabled={deleteCustomerMutation.isPending}>
              Cancelar
            </Button>
            <Button onClick={handleConfirmDelete} disabled={deleteCustomerMutation.isPending} variant="destructive">
              {deleteCustomerMutation.isPending ? "Removendo..." : "Remover"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={openDetailsDialog} onOpenChange={setOpenDetailsDialog}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-slate-900">{selectedCustomer?.name}</DialogTitle>
            <DialogDescription className="text-slate-600">Detalhes do cliente</DialogDescription>
          </DialogHeader>

          {selectedCustomer && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</p>
                  <p className="text-sm">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${selectedCustomer.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{selectedCustomer.active ? "Ativo" : "Inativo"}</span>
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Email</p>
                  <p className="text-sm text-slate-900">{selectedCustomer.email || "-"}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Telefone</p>
                  <p className="text-sm text-slate-900">{selectedCustomer.phone ? formatPhone(selectedCustomer.phone) : "-"}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">CPF</p>
                  <p className="text-sm text-slate-900">{selectedCustomer.cpf || "-"}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Documento</p>
                  <p className="text-sm text-slate-900">{selectedCustomer.document || "-"}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Gênero</p>
                  <p className="text-sm text-slate-900">{selectedCustomer.gender ? (selectedCustomer.gender === "male" ? "Masculino" : selectedCustomer.gender === "female" ? "Feminino" : "Outro") : "-"}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Data de Nascimento</p>
                  <p className="text-sm text-slate-900">{selectedCustomer.birthDate ? new Date(selectedCustomer.birthDate).toLocaleDateString("pt-BR") : "-"}</p>
                </div>
              </div>

              {selectedCustomer.notes && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Anotações</p>
                  <p className="text-sm text-slate-700 leading-relaxed">{selectedCustomer.notes}</p>
                </div>
              )}

              {selectedCustomer.address && (
                <div className="space-y-2 border-t border-slate-200 pt-6">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">Endereço</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-700">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Rua</p>
                      <p>{selectedCustomer.address.street}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Número</p>
                      <p>{selectedCustomer.address.number}</p>
                    </div>
                    {selectedCustomer.address.complement && (
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Complemento</p>
                        <p>{selectedCustomer.address.complement}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Bairro</p>
                      <p>{selectedCustomer.address.neighborhood}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Cidade</p>
                      <p>{selectedCustomer.address.city}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Estado</p>
                      <p>{selectedCustomer.address.state}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">CEP</p>
                      <p>{selectedCustomer.address.zipCode}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2 border-t border-slate-200 pt-6 text-xs text-slate-500">
                <p>Criado em: {new Date(selectedCustomer.createdAt).toLocaleDateString("pt-BR", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })}</p>
                <p>Última atualização: {new Date(selectedCustomer.updatedAt).toLocaleDateString("pt-BR", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })}</p>
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
                handleEditClick(selectedCustomer!);
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

export default CustomersList;
