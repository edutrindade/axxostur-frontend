import { useState } from "react";
import { toast } from "@/components/ui/toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog } from "@/components/Dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { Icon } from "@/components/ui/icon";
import { AppHeader } from "@/components/AppHeader";
import { DataTable } from "@/components/users/data-table";
import { createColumns } from "@/components/users/columns";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/hooks/useAuth";

import { formatCpf, formatPhone } from "@/utils/format";
import {
	getProspectors,
	createProspector,
	updateProspector,
	toggleProspectorStatus,
	deleteProspector,
	type User,
	type CreateUserData,
	type UpdateUserData,
} from "@/services/users";

interface ProspectorFormData {
	name: string;
	email: string;
	role: string;
	birthdate: string;
	phone: string;
	cpfCnpj: string;
}

const Prospectors = () => {
	const { isSuperAdmin } = useAuth();
	const queryClient = useQueryClient();
	const isMobile = useIsMobile();
	const [isSheetOpen, setIsSheetOpen] = useState(false);
	const [editingProspector, setEditingProspector] = useState<User | null>(null);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
	const [prospectorToDelete, setProspectorToDelete] = useState<User | null>(
		null,
	);
	const [prospectorToToggleStatus, setProspectorToToggleStatus] =
		useState<User | null>(null);
	const [formData, setFormData] = useState<ProspectorFormData>({
		name: "",
		email: "",
		role: "prospector",
		birthdate: "",
		phone: "",
		cpfCnpj: "",
	});

	const { data: prospectors = [], isLoading } = useQuery({
		queryKey: ["prospectors"],
		queryFn: getProspectors,
		retry: (
			failureCount,
			error: Error & { response?: { status?: number } },
		) => {
			if (error?.response?.status === 404) {
				return false;
			}
			return failureCount < 3;
		},
	});

	const createProspectorMutation = useMutation({
		mutationFn: createProspector,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["prospectors"] });
			setIsSheetOpen(false);
			resetForm();
			toast.success("Sucesso", {
				description: "Parceiro criado com sucesso!",
				duration: 3000,
			});
		},
		onError: (
			error: Error & { response?: { data?: { message?: string } } },
		) => {
			toast.error("Erro", {
				description: error.response?.data?.message || "Erro ao criar parceiro",
				duration: 3000,
			});
		},
	});

	const updateProspectorMutation = useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateUserData }) =>
			updateProspector(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["prospectors"] });
			setIsSheetOpen(false);
			setEditingProspector(null);
			resetForm();
			toast.success("Sucesso", {
				description: "Parceiro atualizado com sucesso!",
				duration: 3000,
			});
		},
		onError: (
			error: Error & { response?: { data?: { message?: string } } },
		) => {
			toast.error("Erro", {
				description:
					error.response?.data?.message || "Erro ao atualizar parceiro",
				duration: 3000,
			});
		},
	});

	const toggleStatusMutation = useMutation({
		mutationFn: ({ id }: { id: string }) => toggleProspectorStatus(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["prospectors"] });
			toast.success("Sucesso", {
				description: "Status do parceiro alterado com sucesso!",
				duration: 3000,
			});
		},
		onError: (
			error: Error & { response?: { data?: { message?: string } } },
		) => {
			toast.error("Erro", {
				description:
					error.response?.data?.message || "Erro ao alterar status do parceiro",
				duration: 3000,
			});
		},
	});

	const deleteProspectorMutation = useMutation({
		mutationFn: deleteProspector,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["prospectors"] });
			toast.success("Sucesso", {
				description: "Parceiro excluído com sucesso!",
				duration: 3000,
			});
		},
		onError: (
			error: Error & { response?: { data?: { message?: string } } },
		) => {
			if (
				error?.response?.data?.message &&
				error?.response?.data?.message !== "404"
			) {
				toast.error("Erro", {
					description: "Erro ao carregar parceiros",
					duration: 3000,
				});
			}
		},
	});

	const resetForm = () => {
		setFormData({
			name: "",
			email: "",
			role: "prospector",
			birthdate: "",
			phone: "",
			cpfCnpj: "",
		});
	};

	const handleNewProspector = () => {
		setEditingProspector(null);
		resetForm();
		setIsSheetOpen(true);
	};

	const handleEditProspector = (prospector: User) => {
		setEditingProspector(prospector);
		setFormData({
			name: prospector.name,
			email: prospector.email,
			role: prospector.role,
			birthdate: prospector.birthdate || "",
			phone: prospector.phone || "",
			cpfCnpj: prospector.cpfCnpj || prospector.cpf || "",
		});
		setIsSheetOpen(true);
	};

	const handleToggleUpdateProspectorStatus = (prospector: User) => {
		setProspectorToToggleStatus(prospector);
		setIsStatusDialogOpen(true);
	};

	const confirmToggleStatus = () => {
		if (prospectorToToggleStatus) {
			toggleStatusMutation.mutate({ id: prospectorToToggleStatus.id });
		}
		setIsStatusDialogOpen(false);
		setProspectorToToggleStatus(null);
	};

	const handleDeleteProspector = (prospector: User) => {
		setProspectorToDelete(prospector);
		setIsDeleteDialogOpen(true);
	};

	const confirmDeleteProspector = () => {
		if (prospectorToDelete) {
			deleteProspectorMutation.mutate(prospectorToDelete.id);
			setIsDeleteDialogOpen(false);
			setProspectorToDelete(null);
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

		const prospectorData: CreateUserData | UpdateUserData = {
			name: formData.name,
			email: formData.email,
			role: formData.role,
			...(formData.birthdate && {
				birthdate: new Date(formData.birthdate),
			}),
			...(formData.phone && { phone: formData.phone }),
			...(formData.cpfCnpj && { cpfCnpj: formData.cpfCnpj }),
		};

		if (editingProspector) {
			updateProspectorMutation.mutate({
				id: editingProspector.id,
				data: prospectorData as UpdateUserData,
			});
		} else {
			createProspectorMutation.mutate(prospectorData as CreateUserData);
		}
	};

	const handleInputChange = (field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const columns = createColumns({
		onEdit: handleEditProspector,
		onDelete: handleDeleteProspector,
		onToggleStatus: handleToggleUpdateProspectorStatus,
	});

	interface ProspectorCardProps {
		prospector: User;
		onEdit: (prospector: User) => void;
		onDelete: (prospector: User) => void;
		onToggleStatus: (prospector: User) => void;
	}

	const ProspectorCard = ({
		prospector,
		onEdit,
		onDelete,
		onToggleStatus,
	}: ProspectorCardProps) => {
		return (
			<Card className="p-4">
				<div className="flex items-start justify-between">
					<div className="space-y-2 flex-1">
						<div className="flex items-center gap-2">
							<h3 className="font-semibold">{prospector.name}</h3>
							<button
								type="button"
								className="hover:opacity-70 transition-opacity"
								onClick={() => onToggleStatus(prospector)}
							>
								<Badge variant={prospector.active ? "default" : "secondary"}>
									{prospector.active ? "Ativo" : "Inativo"}
								</Badge>
							</button>
						</div>
						<p className="text-sm text-muted-foreground">{prospector.email}</p>
						{prospector.phone && (
							<p className="text-sm text-muted-foreground">
								{prospector.phone}
							</p>
						)}
						{prospector.birthdate && (
							<p className="text-sm text-muted-foreground">
								Nascimento:{" "}
								{new Date(prospector.birthdate).toLocaleDateString("pt-BR")}
							</p>
						)}
						<p className="text-xs text-muted-foreground">
							Criado em:{" "}
							{new Date(prospector.createdAt).toLocaleDateString("pt-BR")}
						</p>
					</div>
					<div className="flex gap-2">
						<Button
							variant="ghost"
							size="sm"
							className="h-8 w-8 p-0"
							onClick={() => onEdit(prospector)}
						>
							<Icon name="settings" size={16} />
						</Button>
						<Button
							variant="ghost"
							size="sm"
							className="h-8 w-8 p-0 text-destructive hover:text-destructive"
							onClick={() => onDelete(prospector)}
						>
							<Icon name="delete" size={16} />
						</Button>
					</div>
				</div>
			</Card>
		);
	};

	if (!isSuperAdmin) {
		return (
			<div className="flex items-center justify-center h-screen">
				<div className="text-center">
					<h2 className="text-2xl font-bold text-red-600 mb-4">
						Acesso Negado
					</h2>
					<p className="text-gray-600">
						Você não tem permissão para acessar esta página.
					</p>
				</div>
			</div>
		);
	}

	return (
		<>
			<AppHeader
				title="Gerenciamento de Parceiros"
				showActionButton={false}
			/>

			<div className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
				<div className="ml-auto flex items-center gap-3">
					<Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
						<Button
							size="sm"
							className="bg-primary hover:bg-primary/90"
							onClick={handleNewProspector}
						>
							<Icon name="plus" size={20} className="mr-2 text-foreground" />
							<span className="text-foreground font-bold text-md">
								Novo Parceiro
							</span>
						</Button>
						<SheetContent className="min-w-[400px] sm:min-w-[540px] p-4">
							<SheetHeader>
								<SheetTitle className="text-xl">
									{editingProspector
										? "Editar Parceiro"
										: "Cadastrar Novo Parceiro"}
								</SheetTitle>
								<SheetDescription>
									{editingProspector
										? "Atualize os dados do parceiro."
										: "Preencha os dados para cadastrar um novo parceiro."}
								</SheetDescription>
							</SheetHeader>
							<form onSubmit={handleSubmit} className="space-y-4 mt-6">
								<div className="space-y-2">
									<Label htmlFor="name">Nome *</Label>
									<Input
										id="name"
										leftIcon="userPlus"
										value={formData.name}
										onChange={(e) =>
											handleInputChange("name", e.target.value)
										}
										placeholder="Digite o nome completo"
										required
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="email">E-mail *</Label>
									<Input
										id="email"
										type="email"
										leftIcon="mail"
										value={formData.email}
										onChange={(e) =>
											handleInputChange("email", e.target.value)
										}
										placeholder="Digite o email"
										required
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="cpfCnpj">CPF/CNPJ</Label>
									<Input
										id="cpfCnpj"
										leftIcon="creditCard"
										value={formatCpf(formData.cpfCnpj)}
										onChange={(e) =>
											handleInputChange("cpfCnpj", e.target.value)
										}
										placeholder="123.456.789-00"
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="phone">Telefone</Label>
									<Input
										id="phone"
										leftIcon="phone"
										value={formatPhone(formData.phone)}
										onChange={(e) =>
											handleInputChange("phone", e.target.value)
										}
										placeholder="(11) 99999-9999"
									/>
								</div>

								<div className="space-y-2">
									<Label htmlFor="birthdate">Data de Nascimento</Label>
									<DatePicker
										value={
											formData.birthdate
												? new Date(formData.birthdate)
												: undefined
										}
										onChange={(date) =>
											handleInputChange(
												"birthdate",
												date ? date.toISOString() : "",
											)
										}
										placeholder="Selecione a data de nascimento"
									/>
								</div>

								<div className="flex gap-3 pt-4">
									<Button
										type="submit"
										className="flex-1"
										disabled={
											createProspectorMutation.isPending ||
											updateProspectorMutation.isPending
										}
									>
										<Icon
											name="check"
											size={16}
											className="mr-2 text-white"
										/>
										<span className="text-white font-bold text-lg">
											{editingProspector ? "Atualizar" : "Cadastrar"}
										</span>
									</Button>
									<Button
										type="button"
										variant="outline"
										onClick={() => setIsSheetOpen(false)}
										className="flex-1 text-slate-700"
									>
										<span className="font-bold text-lg">Cancelar</span>
									</Button>
								</div>
							</form>
						</SheetContent>
					</Sheet>
				</div>
			</div>

			<div className="flex flex-1 flex-col gap-6 p-6">
				<div className="space-y-2">
					<h2 className="text-2xl font-bold tracking-tight text-slate-800">
						Lista de Parceiros
					</h2>
					<p className="text-slate-600">
						Gerencie todos os parceiros prospectores do sistema
					</p>
				</div>

				<div className="space-y-4">
					{isMobile ? (
						<div className="space-y-4">
							{isLoading ? (
								<div className="flex justify-center items-center py-8">
									<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
								</div>
							) : prospectors.length === 0 ? (
								<div className="text-center py-8">
									<p className="text-muted-foreground">
										Nenhum parceiro encontrado
									</p>
								</div>
							) : (
								prospectors.map((prospector) => (
									<ProspectorCard
										key={prospector.id}
										prospector={prospector}
										onEdit={handleEditProspector}
										onDelete={handleDeleteProspector}
										onToggleStatus={handleToggleUpdateProspectorStatus}
									/>
								))
							)}
						</div>
					) : (
						<DataTable
							columns={columns}
							data={prospectors}
							isLoading={isLoading}
						/>
					)}
				</div>
			</div>
			<Dialog
				title="Confirmar Exclusão"
				description={`Tem certeza que deseja excluir o parceiro ${prospectorToDelete?.name}? Esta ação não pode ser desfeita.`}
				isOpen={isDeleteDialogOpen}
				onClose={() => setIsDeleteDialogOpen(false)}
				onConfirm={confirmDeleteProspector}
				confirmText="Excluir"
				cancelText="Cancelar"
				variant="destructive"
				showIcon={true}
			/>

			<Dialog
				title={
					prospectorToToggleStatus?.active
						? "Desativar Parceiro"
						: "Ativar Parceiro"
				}
				description={`Tem certeza que deseja ${prospectorToToggleStatus?.active ? "desativar" : "ativar"} o parceiro "${prospectorToToggleStatus?.name}"?`}
				isOpen={isStatusDialogOpen}
				onClose={() => setIsStatusDialogOpen(false)}
				onConfirm={confirmToggleStatus}
				confirmText={prospectorToToggleStatus?.active ? "Desativar" : "Ativar"}
				cancelText="Cancelar"
				variant="attention"
				showIcon={true}
			/>
		</>
	);
};

export default Prospectors;
