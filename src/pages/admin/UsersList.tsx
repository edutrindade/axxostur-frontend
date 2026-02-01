import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { UserFormDialog } from "@/components/UserFormDialog";
import { DataTable, type ColumnDef, type TableAction } from "@/components/DataTable";
import { useAuth } from "@/hooks/useAuth";
import { useUsersListQuery } from "@/hooks/useUsersQuery";
import { useCreateUserMutation, useUpdateUserMutation, useDeleteUserMutation } from "@/hooks/useUsersMutations";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { User, CreateUserFormData, UpdateUserFormData } from "@/types/user";

const UsersList = () => {
  const { company, user: authUser } = useAuth();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const { data: usersResponse, isLoading: isLoadingUsers } = useUsersListQuery(page, 20, search);
  const createUserMutation = useCreateUserMutation();
  const updateUserMutation = useUpdateUserMutation();
  const deleteUserMutation = useDeleteUserMutation();

  const [openFormDialog, setOpenFormDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>();

  const users = usersResponse?.data || [];
  const pagination = usersResponse?.pagination;

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      admin: "Admin",
      attendant: "Atendente",
      super_admin: "Super Admin",
    };
    return labels[role] || role;
  };

  const handleSearch = useCallback(() => {
    setSearch(searchInput);
    setPage(1);
  }, [searchInput]);

  const handleCreateClick = () => {
    setSelectedUser(undefined);
    setOpenFormDialog(true);
  };

  const handleRowClick = (user: User) => {
    setSelectedUser(user);
    setOpenDetailsDialog(true);
  };

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setOpenFormDialog(true);
  };

  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setOpenDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedUser) {
      await deleteUserMutation.mutateAsync(selectedUser.id);
      setOpenDeleteDialog(false);
      setSelectedUser(undefined);
    }
  };

  const handleFormSubmit = async (data: CreateUserFormData | UpdateUserFormData) => {
    if (selectedUser) {
      await updateUserMutation.mutateAsync({
        id: selectedUser.id,
        data: data as UpdateUserFormData,
      });
    } else {
      await createUserMutation.mutateAsync(data as CreateUserFormData);
    }
    setOpenFormDialog(false);
  };

  const columns: ColumnDef<User>[] = [
    {
      key: "name",
      label: "Nome",
      render: (value) => <span className="font-semibold text-slate-900 text-base">{value}</span>,
    },
    {
      key: "email",
      label: "Email",
      render: (value) => <span className="text-slate-600 text-sm">{value}</span>,
    },
    {
      key: "phone",
      label: "Telefone",
      render: (value) => <span className="text-slate-600">{value}</span>,
    },
    {
      key: "role",
      label: "Função",
      render: (value) => <span className="text-slate-600">{getRoleLabel(value)}</span>,
    },
    {
      key: "active",
      label: "Status",
      render: (value) => <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${value ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{value ? "Ativo" : "Inativo"}</span>,
    },
  ];

  const tableActions: TableAction<User>[] = [
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

  if (isLoadingUsers) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Usuários</h1>
            <p className="text-slate-600 mt-2">Gerenciar usuários do sistema</p>
          </div>
          <Button disabled>
            <Icon name="plus" size={18} className="mr-2" />
            Novo Usuário
          </Button>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
          <p className="text-slate-600">Carregando usuários...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Usuários</h1>
          <p className="text-slate-600 mt-2">Gerenciar usuários do sistema</p>
        </div>
        <Button onClick={handleCreateClick}>
          <Icon name="plus" size={18} className="mr-2" />
          Novo Usuário
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-4">
          <div className="flex items-center gap-3 h-10">
            <div className="flex items-center gap-2 flex-1 bg-white rounded-md px-3 border border-slate-200 transition-all duration-200 hover:border-slate-300 focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400">
              <Icon name="search" size={18} className="text-slate-400 flex-shrink-0" />
              <Input
                placeholder="Buscar por nome ou email..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }
                }}
                disabled={isLoadingUsers}
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
          data={users}
          columns={columns}
          actions={tableActions}
          pagination={pagination}
          onPageChange={setPage}
          onRowClick={handleRowClick}
          isLoading={isLoadingUsers}
          emptyIcon="users"
          emptyTitle={search ? "Nenhum usuário encontrado" : "Nenhum usuário cadastrado"}
          emptyDescription={search ? "Tente fazer uma nova busca" : "Comece adicionando seu primeiro usuário"}
        />
      </div>

      <UserFormDialog
        open={openFormDialog}
        onOpenChange={setOpenFormDialog}
        onSubmit={handleFormSubmit}
        isLoading={createUserMutation.isPending || updateUserMutation.isPending}
        user={selectedUser}
        title={selectedUser ? "Editar Usuário" : "Novo Usuário"}
        description={selectedUser ? "Atualize as informações do usuário" : "Adicione um novo usuário ao sistema"}
        companyId={company?.id}
        isAdmin={authUser?.role === "super_admin"}
      />

      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-slate-900">Confirmar Exclusão</DialogTitle>
            <DialogDescription className="text-slate-600 mt-4">
              Tem certeza que deseja remover o usuário <span className="font-semibold text-slate-900">"{selectedUser?.name}"</span>? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpenDeleteDialog(false)} disabled={deleteUserMutation.isPending}>
              Cancelar
            </Button>
            <Button onClick={handleConfirmDelete} disabled={deleteUserMutation.isPending} variant="destructive">
              {deleteUserMutation.isPending ? "Removendo..." : "Remover"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={openDetailsDialog} onOpenChange={setOpenDetailsDialog}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-slate-900">{selectedUser?.name}</DialogTitle>
            <DialogDescription className="text-slate-600">Detalhes do usuário</DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Email</p>
                  <p className="text-sm text-slate-900">{selectedUser.email}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Telefone</p>
                  <p className="text-sm text-slate-900">{selectedUser.phone}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">CPF</p>
                  <p className="text-sm text-slate-900">{selectedUser.cpf}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Função</p>
                  <p className="text-sm text-slate-900">{getRoleLabel(selectedUser.role)}</p>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</p>
                  <p className="text-sm">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${selectedUser.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{selectedUser.active ? "Ativo" : "Inativo"}</span>
                  </p>
                </div>
              </div>

              <div className="space-y-2 border-t border-slate-200 pt-6 text-xs text-slate-500">
                <p>Criado em: {new Date(selectedUser.createdAt).toLocaleDateString("pt-BR", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })}</p>
                <p>Última atualização: {new Date(selectedUser.updatedAt).toLocaleDateString("pt-BR", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })}</p>
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
                handleEditClick(selectedUser!);
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

export default UsersList;
