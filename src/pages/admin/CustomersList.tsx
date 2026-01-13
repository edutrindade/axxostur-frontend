import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CustomerFormDialog } from "@/components/CustomerFormDialog";
import { CustomPagination } from "@/components/CustomPagination";
import { useAuth } from "@/hooks/useAuth";
import { useCustomersByCompanyQuery } from "@/hooks/useCustomersQuery";
import { useCreateCustomerMutation, useUpdateCustomerMutation, useDeleteCustomerMutation } from "@/hooks/useCustomersMutations";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatPhone } from "@/utils/format";
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

  const handleClearSearch = useCallback(() => {
    setSearchInput("");
    setSearch("");
    setPage(1);
  }, []);

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

      <div className="flex gap-2">
        <Input
          placeholder="Pesquisar cliente por nome ou CPF..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          disabled={isLoadingCustomers}
          className="flex-1"
        />
      </div>

      {!customers || customers.length === 0 ? (
        <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
          <Icon name="users" size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-600 text-lg mb-2">{search ? "Nenhum cliente encontrado" : "Nenhum cliente cadastrado"}</p>
          <p className="text-slate-500">{search ? "Tente fazer uma nova busca" : "Comece adicionando seu primeiro cliente"}</p>
        </div>
      ) : (
        <>
          <div className="hidden lg:block bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
            <Table>
              <TableHeader className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-slate-700 font-semibold">Nome</TableHead>
                  <TableHead className="text-slate-700 font-semibold">Email</TableHead>
                  <TableHead className="text-slate-700 font-semibold">Telefone</TableHead>
                  <TableHead className="text-slate-700 font-semibold">CPF</TableHead>
                  <TableHead className="text-slate-700 font-semibold">Gênero</TableHead>
                  <TableHead className="text-slate-700 font-semibold">Status</TableHead>
                  <TableHead className="text-slate-700 font-semibold text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer) => (
                  <TableRow key={customer.id} className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer" onClick={() => handleRowClick(customer)}>
                    <TableCell className="font-medium text-slate-900">{customer.name}</TableCell>
                    <TableCell className="text-slate-600">{customer.email || "-"}</TableCell>
                    <TableCell className="text-slate-600">{customer.phone ? formatPhone(customer.phone) : "-"}</TableCell>
                    <TableCell className="text-slate-600">{customer.cpf || "-"}</TableCell>
                    <TableCell className="text-slate-600">{customer.gender ? (customer.gender === "male" ? "Masculino" : customer.gender === "female" ? "Feminino" : "Outro") : "-"}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${customer.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{customer.active ? "Ativo" : "Inativo"}</span>
                    </TableCell>
                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end gap-2">
                        <Button onClick={() => handleEditClick(customer)} size="sm" variant="outline">
                          <Icon name="edit" size={16} />
                        </Button>
                        <Button onClick={() => handleDeleteClick(customer)} size="sm" variant="destructive">
                          <Icon name="delete" size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="border-t border-slate-200 p-4">
              {pagination && <CustomPagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={setPage} hasNextPage={pagination.hasNextPage} hasPreviousPage={pagination.hasPreviousPage} disabled={isLoadingCustomers} />}
            </div>
          </div>

          <div className="lg:hidden space-y-4">
            {customers.map((customer) => (
              <div key={customer.id} className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleRowClick(customer)}>
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 text-lg">{customer.name}</h3>
                      <p className="text-sm text-slate-600 mt-1">{customer.email || "-"}</p>
                    </div>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-2 ${customer.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{customer.active ? "Ativo" : "Inativo"}</span>
                  </div>

                  {(customer.phone || customer.cpf || customer.gender) && (
                    <div className="text-sm text-slate-600 space-y-1">
                      {customer.phone && <p>Telefone: {formatPhone(customer.phone)}</p>}
                      {customer.cpf && <p>CPF: {customer.cpf}</p>}
                      {customer.gender && <p>Gênero: {customer.gender === "male" ? "Masculino" : customer.gender === "female" ? "Feminino" : "Outro"}</p>}
                    </div>
                  )}

                  {customer.notes && <p className="text-sm text-slate-600 line-clamp-2">{customer.notes}</p>}

                  <div className="flex gap-2 pt-2" onClick={(e) => e.stopPropagation()}>
                    <Button onClick={() => handleEditClick(customer)} size="sm" variant="outline" className="flex-1">
                      <Icon name="edit" size={16} className="mr-1" />
                      Editar
                    </Button>
                    <Button onClick={() => handleDeleteClick(customer)} size="sm" variant="destructive" className="flex-1">
                      <Icon name="delete" size={16} className="mr-1" />
                      Remover
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {pagination && (
              <div className="bg-white rounded-lg border border-slate-200 p-4">
                <CustomPagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={setPage} hasNextPage={pagination.hasNextPage} hasPreviousPage={pagination.hasPreviousPage} disabled={isLoadingCustomers} />
              </div>
            )}
          </div>
        </>
      )}

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
