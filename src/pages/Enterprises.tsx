import { useState, useEffect } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
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
import { Dialog } from "@/components/Dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import {
	getEnterprises,
	type Enterprise,
	updateEnterprise,
} from "@/services/enterprises";
import { createColumns } from "@/components/enterprises/columns";
import { EnterpriseCard } from "@/components/enterprises/EnterpriseCard";
import { EnterpriseForm } from "@/components/enterprises/EnterpriseForm";
import { EnterpriseDetailsModal } from "@/components/enterprises/EnterpriseDetailsModal";
import { useNavigate } from "react-router-dom";

const Enterprises = () => {
	const queryClient = useQueryClient();
	const isMobile = useIsMobile();
	const navigate = useNavigate();
	const [searchInput, setSearchInput] = useState("");
	const [searchTerm, setSearchTerm] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedEnterprise, setSelectedEnterprise] =
    useState<Enterprise | null>(null);
	const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
	const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false);
	const [enterpriseToDeactivate, setEnterpriseToDeactivate] =
		useState<Enterprise | null>(null);
	const [isReactivateDialogOpen, setIsReactivateDialogOpen] = useState(false);
	const [enterpriseToReactivate, setEnterpriseToReactivate] =
		useState<Enterprise | null>(null);

	const itemsPerPage = 10;

	useEffect(() => {
		const timer = setTimeout(() => {
			setSearchTerm(searchInput);
			setCurrentPage(1);
		}, 500);

		return () => clearTimeout(timer);
	}, [searchInput]);

	const { data: enterprisesData, isLoading } = useQuery({
		queryKey: ["enterprises", currentPage, searchTerm],
		queryFn: () =>
			getEnterprises({
				page: currentPage,
				limit: itemsPerPage,
				search: searchTerm.trim() || undefined,
			}),
	});

	const enterprises = enterprisesData?.data || [];
	const totalPages = enterprisesData?.pagination?.totalPages || 1;

	const updateEnterpriseMutation = useMutation({
		mutationFn: ({ id, data }: { id: string; data: Partial<Enterprise> }) =>
			updateEnterprise(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["enterprises"] });
			toast.success("Sucesso", {
				description: "Empresa atualizada com sucesso!",
				duration: 3000,
			});
		},
		onError: (error) => {
			console.error("Erro ao atualizar empresa:", error);
			toast.error("Erro", {
				description: "Erro ao atualizar empresa. Tente novamente.",
				duration: 3000,
			});
		},
	});

	const handleViewEnterprise = (enterprise: Enterprise) => {
		setSelectedEnterprise(enterprise);
		setIsDetailsModalOpen(true);
	};

	const handleDeactivateEnterprise = (enterprise: Enterprise) => {
		setEnterpriseToDeactivate(enterprise);
		setIsDeactivateDialogOpen(true);
		setIsDetailsModalOpen(false);
	};

	const handleReactivateEnterprise = (enterprise: Enterprise) => {
		setEnterpriseToReactivate(enterprise);
		setIsReactivateDialogOpen(true);
		setIsDetailsModalOpen(false);
	};

	const handleConfirmDeactivate = async () => {
		if (enterpriseToDeactivate) {
			updateEnterpriseMutation.mutate({
				id: enterpriseToDeactivate.id,
				data: { active: false },
			});
		}
		setIsDeactivateDialogOpen(false);
		setEnterpriseToDeactivate(null);
	};

	const handleConfirmReactivate = async () => {
		if (enterpriseToReactivate) {
			updateEnterpriseMutation.mutate({
				id: enterpriseToReactivate.id,
				data: { active: true },
			});
		}
		setIsReactivateDialogOpen(false);
		setEnterpriseToReactivate(null);
	};

  const handleEditEnterprise = (enterprise: Enterprise) => {
    setSelectedEnterprise(enterprise);
    setIsSheetOpen(true);
  };

	const columns = createColumns({
		onView: handleViewEnterprise,
		onEdit: handleEditEnterprise,
	});

  const handleFormSuccess = () => {
    setIsSheetOpen(false);
    setSelectedEnterprise(null);
    queryClient.invalidateQueries({ queryKey: ["enterprises", currentPage, searchTerm] });
  };

	const handleSearchInputChange = (value: string) => {
		setSearchInput(value);
	};

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	return (
		<>
			<AppHeader title="Gerenciamento de Empresas" showActionButton={false} />

				<div className="flex h-auto min-h-16 shrink-0 items-center gap-2 border-b px-4 py-3">
					<div className="ml-auto flex items-center gap-3 w-full sm:w-auto">
						<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
							<div className="relative flex-1 sm:flex-none">
								<Icon
									name="search"
									size={16}
									className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
								/>
								<Input
									placeholder="Buscar empresas..."
									value={searchInput}
									onChange={(e) => handleSearchInputChange(e.target.value)}
									className="pl-10 w-full sm:w-64"
								/>
							</div>

							<Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
								<div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <Button
                    onClick={() => {
                      setSelectedEnterprise(null);
                      setIsSheetOpen(true);
                    }}
                    size={isMobile ? "default" : "default"}
                    className="w-full sm:w-auto"
                  >
										<Icon name="plus" className="h-4 w-4 mr-2" />
										Nova Empresa
									</Button>
								</div>
                <SheetContent className="min-w-[400px] sm:min-w-[540px] p-4 overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle className="text-xl">
                      {selectedEnterprise ? "Editar Empresa" : "Cadastrar Nova Empresa"}
                    </SheetTitle>
                    <SheetDescription>
                      {selectedEnterprise
                        ? "Atualize os dados da empresa."
                        : "Preencha os dados para cadastrar uma nova empresa no sistema."}
                    </SheetDescription>
                  </SheetHeader>
                  <EnterpriseForm onSuccess={handleFormSuccess} enterprise={selectedEnterprise ?? undefined} isEditing={Boolean(selectedEnterprise)} />
                </SheetContent>
              </Sheet>
						</div>
					</div>
				</div>

				<div className="flex flex-1 flex-col gap-6 p-6">
					<div className="space-y-2">
						<h2 className="text-2xl font-bold tracking-tight text-slate-800">
							Lista de Empresas
						</h2>
						<p className="text-slate-600">
							Gerencie todas as empresas cadastradas no sistema
						</p>
					</div>

					<div className="space-y-4">
						{isMobile ? (
							<div className="space-y-4">
								{isLoading ? (
									<div className="flex justify-center items-center py-8">
										<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
									</div>
								) : enterprises.length === 0 ? (
									<div className="text-center py-8">
										<p className="text-muted-foreground">
											{searchTerm
												? "Nenhuma empresa encontrada para a busca"
												: "Nenhuma empresa encontrada"}
										</p>
									</div>
								) : (
									enterprises.map((enterprise) => (
										<EnterpriseCard
											key={enterprise.id}
											enterprise={enterprise}
										/>
									))
								)}

								{!isLoading && enterprises.length > 0 && totalPages > 1 && (
									<div className="flex justify-center items-center gap-2 mt-6">
										<Button
											variant="outline"
											size="sm"
											onClick={() => handlePageChange(currentPage - 1)}
											disabled={currentPage === 1}
										>
											<Icon name="chevronLeft" size={16} />
										</Button>
										<span className="text-sm text-muted-foreground px-2">
											{currentPage} de {totalPages}
										</span>
										<Button
											variant="outline"
											size="sm"
											onClick={() => handlePageChange(currentPage + 1)}
											disabled={currentPage === totalPages}
										>
											<Icon name="chevronRight" size={16} />
										</Button>
									</div>
								)}
							</div>
						) : (
							<DataTable
								columns={columns}
								data={enterprises}
								isLoading={isLoading}
							/>
						)}
					</div>
				</div>
			<EnterpriseDetailsModal
				enterprise={selectedEnterprise}
				isOpen={isDetailsModalOpen}
				onClose={() => {
					setIsDetailsModalOpen(false);
					setSelectedEnterprise(null);
				}}
				onDeactivate={handleDeactivateEnterprise}
				onReactivate={handleReactivateEnterprise}
				onEdit={handleEditEnterprise}
			/>

			<Dialog
				title="Desativar Empresa"
				description={`Tem certeza que deseja desativar a empresa "${enterpriseToDeactivate?.fantasyName || enterpriseToDeactivate?.socialReason}"? Esta ação pode ser revertida posteriormente.`}
				isOpen={isDeactivateDialogOpen}
				onClose={() => {
					setIsDeactivateDialogOpen(false);
					setEnterpriseToDeactivate(null);
				}}
				onConfirm={handleConfirmDeactivate}
				confirmText="Desativar"
				cancelText="Cancelar"
				variant="attention"
				showIcon={true}
			/>

			<Dialog
				title="Reativar Empresa"
				description={`Tem certeza que deseja reativar a empresa "${enterpriseToReactivate?.fantasyName || enterpriseToReactivate?.socialReason}"? A empresa voltará a ficar ativa no sistema.`}
				isOpen={isReactivateDialogOpen}
				onClose={() => {
					setIsReactivateDialogOpen(false);
					setEnterpriseToReactivate(null);
				}}
				onConfirm={handleConfirmReactivate}
				confirmText="Reativar"
				cancelText="Cancelar"
				variant="default"
				showIcon={true}
			/>
		</>
	);
};

export default Enterprises;
