import { useState, useMemo } from "react";
import { toast } from "@/components/ui/toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog } from "@/components/Dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Icon } from "@/components/ui/icon";
import { AppHeader } from "@/components/AppHeader";
import { DataTable } from "@/components/users/data-table";
import { createColumns } from "@/components/users/columns";
import { useIsMobile } from "@/hooks/use-mobile";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { formatCpf, formatPhone } from "@/utils/format";
import { getUsers, createUser, updateUser, deleteUser, type User, type CreateUserData, type UpdateUserData } from "@/services/users";

interface UserFormData {
  name: string;
  email: string;
  role: string;
  birthdate: string;
  phone: string;
  cpfCnpj: string;
}

const Users = () => {
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    email: "",
    role: "super_admin",
    birthdate: "",
    phone: "",
    cpfCnpj: "",
  });

  const {
    data: users = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  // Filtrar usuários por role
  const adminUsers = useMemo(() => users.filter((user) => user.role?.toLowerCase() === "admin"), [users]);
  const clientUsers = useMemo(() => users.filter((user) => user.role?.toLowerCase() === "client"), [users]);

  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsSheetOpen(false);
      resetForm();
      toast.success("Sucesso", {
        description: "Usuário criado com sucesso!",
        duration: 3000,
      });
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      toast.error("Erro", {
        description: error.response?.data?.message || "Erro ao criar usuário",
        duration: 3000,
      });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserData }) => updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsSheetOpen(false);
      setEditingUser(null);
      resetForm();
      toast.success("Sucesso", {
        description: "Usuário atualizado com sucesso!",
        duration: 3000,
      });
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      toast.error("Erro", {
        description: error.response?.data?.message || "Erro ao atualizar usuário",
        duration: 3000,
      });
    },
  });

  // Status toggle removido conforme especificação

  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Sucesso", {
        description: "Usuário excluído com sucesso!",
        duration: 3000,
      });
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      toast.error("Erro", {
        description: error.response?.data?.message || "Erro ao excluir usuário",
        duration: 3000,
      });
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      role: "super_admin",
      birthdate: "",
      phone: "",
      cpfCnpj: "",
    });
  };

  const handleNewUser = () => {
    setEditingUser(null);
    resetForm();
    setIsSheetOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role || "ADMIN",
      birthdate: user.birthdate ? new Date(user.birthdate).toISOString().split("T")[0] : "",
      phone: user.phone || "",
      cpfCnpj: user.cpfCnpj || "",
    });
    setIsSheetOpen(true);
  };

  // Funções de alternância de status removidas

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteUser = () => {
    if (userToDelete) {
      deleteUserMutation.mutate(userToDelete.id);
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      toast.error("Erro", {
        description: "Nome e e-mail são obrigatórios.",
      });
      return;
    }

    // Validação histórica de data de nascimento
    if (formData.birthdate) {
      const birth = new Date(formData.birthdate);
      const minDate = new Date("1900-01-01");
      const today = new Date();
      if (isNaN(birth.getTime())) {
        toast.error("Erro", {
          description: "Data de nascimento inválida.",
        });
        return;
      }
      if (birth < minDate) {
        toast.error("Erro", {
          description: "Data de nascimento não pode ser anterior a 01/01/1900.",
        });
        return;
      }
      if (birth > today) {
        toast.error("Erro", {
          description: "Data de nascimento não pode ser futura.",
        });
        return;
      }
    }

    const userData: CreateUserData | UpdateUserData = {
      name: formData.name,
      email: formData.email,
      role: formData.role,
      ...(formData.birthdate && {
        birthdate: new Date(formData.birthdate),
      }),
      ...(formData.phone && { phone: formData.phone }),
      ...(formData.cpfCnpj && { cpfCnpj: formData.cpfCnpj }),
    };

    if (editingUser) {
      updateUserMutation.mutate({
        id: editingUser.id,
        data: userData as UpdateUserData,
      });
    } else {
      createUserMutation.mutate(userData as CreateUserData);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const columns = createColumns({
    onEdit: handleEditUser,
    onDelete: handleDeleteUser,
  });

  if (error) {
    toast.error("Erro", {
      description: "Erro ao carregar usuários",
      duration: 3000,
    });
  }

  interface UserCardProps {
    user: User;
    onEdit: (user: User) => void;
    onDelete: (user: User) => void;
  }

  const UserCard = ({ user, onEdit, onDelete }: UserCardProps) => {
    return (
      <Card className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{user.name}</h3>
              <Badge variant={user.active ? "default" : "secondary"}>{user.active ? "Ativo" : "Inativo"}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            {user.phone && <p className="text-sm text-muted-foreground">{user.phone}</p>}
            {user.birthdate && <p className="text-sm text-muted-foreground">Nascimento: {new Date(user.birthdate).toLocaleDateString("pt-BR")}</p>}
            <p className="text-xs text-muted-foreground">Criado em: {new Date(user.createdAt).toLocaleDateString("pt-BR")}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => onEdit(user)}>
              <Icon name="settings" size={16} />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive" onClick={() => onDelete(user)}>
              <Icon name="delete" size={16} />
            </Button>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <>
      <AppHeader title="Gerenciamento de Usuários" showActionButton={false} />

      <div className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <div className="ml-auto flex items-center gap-3">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <Button size="sm" className="bg-primary hover:bg-primary/90" onClick={handleNewUser}>
              <Icon name="plus" size={20} className="mr-2 text-white" />
              <span className="text-white font-bold text-md">Novo Usuário</span>
            </Button>
            <SheetContent className="min-w-[400px] sm:min-w-[540px] p-4">
              <SheetHeader>
                <SheetTitle className="text-xl">{editingUser ? "Editar Usuário" : "Cadastrar Novo Usuário"}</SheetTitle>
                <SheetDescription>{editingUser ? "Atualize os dados do usuário." : "Preencha os dados para cadastrar um novo usuário administrador."}</SheetDescription>
              </SheetHeader>
              <form onSubmit={handleSubmit} className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome *</Label>
                  <Input id="name" leftIcon="userPlus" value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} placeholder="Digite o nome completo" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-mail *</Label>
                  <Input id="email" type="email" leftIcon="mail" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} placeholder="Digite o email" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cpfCnpj">CPF/CNPJ</Label>
                  <Input id="cpfCnpj" leftIcon="creditCard" value={formatCpf(formData.cpfCnpj)} onChange={(e) => handleInputChange("cpfCnpj", e.target.value)} placeholder="123.456.789-00" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input id="phone" leftIcon="phone" value={formatPhone(formData.phone)} onChange={(e) => handleInputChange("phone", e.target.value)} placeholder="(11) 99999-9999" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birthdate">Data de Nascimento</Label>
                  <DatePicker value={formData.birthdate ? new Date(formData.birthdate) : undefined} onChange={(date) => handleInputChange("birthdate", date ? date.toISOString() : "")} placeholder="Selecione a data de nascimento" />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1" disabled={createUserMutation.isPending || updateUserMutation.isPending}>
                    <Icon name="check" size={16} className="mr-2 text-white" />
                    <span className="text-white font-bold">{editingUser ? "Atualizar" : "Cadastrar"}</span>
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsSheetOpen(false)} className="flex-1 text-slate-700">
                    <span className="font-bold">Cancelar</span>
                  </Button>
                </div>
              </form>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-6 p-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">Lista de Usuários</h2>
          <p className="text-slate-600">Gerencie todos os usuários administradores do sistema</p>
        </div>

        <Tabs defaultValue="admin" className="space-y-4">
          <TabsList>
            <TabsTrigger value="admin" className="flex items-center gap-2">
              <Icon name="shield" size={16} />
              Administradores ({adminUsers.length})
            </TabsTrigger>
            <TabsTrigger value="client" className="flex items-center gap-2">
              <Icon name="users" size={16} />
              Clientes ({clientUsers.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="admin" className="space-y-4">
            {isMobile ? (
              <div className="space-y-4">
                {isLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : adminUsers.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-slate-600 font-medium">Nenhum usuário administrador encontrado</p>
                  </div>
                ) : (
                  adminUsers.map((user) => <UserCard key={user.id} user={user} onEdit={handleEditUser} onDelete={handleDeleteUser} />)
                )}
              </div>
            ) : (
              <DataTable columns={columns} data={adminUsers} isLoading={isLoading} />
            )}
          </TabsContent>

          <TabsContent value="client" className="space-y-4">
            {isMobile ? (
              <div className="space-y-4">
                {isLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : clientUsers.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-slate-600 font-medium">Nenhum usuário cliente encontrado</p>
                  </div>
                ) : (
                  clientUsers.map((user) => <UserCard key={user.id} user={user} onEdit={handleEditUser} onDelete={handleDeleteUser} />)
                )}
              </div>
            ) : (
              <DataTable columns={columns} data={clientUsers} isLoading={isLoading} />
            )}
          </TabsContent>
        </Tabs>
      </div>
      <Dialog
        title="Confirmar Exclusão"
        description={`Tem certeza que deseja excluir o usuário ${userToDelete?.name}? Esta ação não pode ser desfeita.`}
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDeleteUser}
        confirmText="Excluir"
        cancelText="Cancelar"
        variant="destructive"
        showIcon={true}
      />
    </>
  );
};

export default Users;
