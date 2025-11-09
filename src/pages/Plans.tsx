import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { Icon } from "@/components/ui/icon";
import { AppHeader } from "@/components/AppHeader";
import { useAuth } from "@/hooks/useAuth";
import { getPlans, createPlan, updatePlan } from "@/services/plans";
import type { CreatePlanData, Plan } from "@/types/plan";
import { PlanCard } from "@/components/plans/PlanCard";
import { PlanForm } from "@/components/plans/PlanForm";

const Plans = () => {
	const queryClient = useQueryClient();
	const { isSuperAdmin } = useAuth();
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

	const { data: plansData, isLoading } = useQuery({
		queryKey: ["plans"],
		queryFn: () => getPlans(),
	});

	const plans = plansData || [];

	const createPlanMutation = useMutation({
		mutationFn: createPlan,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["plans"] });
			toast.success("Sucesso", {
				description: "Plano criado com sucesso!",
				duration: 3000,
			});
			setIsFormOpen(false);
		},
		onError: (error) => {
			console.error("Erro ao criar plano:", error);
			toast.error("Erro", {
				description: "Erro ao criar plano. Tente novamente.",
				duration: 3000,
			});
		},
	});

	const updatePlanMutation = useMutation({
		mutationFn: ({ id, data }: { id: string; data: Partial<Plan> }) =>
			updatePlan(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["plans"] });
			toast.success("Sucesso", {
				description: "Plano atualizado com sucesso!",
				duration: 3000,
			});
			setIsFormOpen(false);
			setSelectedPlan(null);
		},
		onError: (error) => {
			console.error("Erro ao atualizar plano:", error);
			toast.error("Erro", {
				description: "Erro ao atualizar plano. Tente novamente.",
				duration: 3000,
			});
		},
	});

	const handleCreatePlan = () => {
		setSelectedPlan(null);
		setIsFormOpen(true);
	};

	const handleEditPlan = (plan: Plan) => {
		setSelectedPlan(plan);
		setIsFormOpen(true);
	};

	const handleFormSubmit = (data: Partial<Plan>) => {
		if (selectedPlan) {
			updatePlanMutation.mutate({ id: selectedPlan.id, data });
		} else {
			createPlanMutation.mutate(data as CreatePlanData);
		}
	};

	return (
		<>
			<AppHeader />
				<div className="flex-1 space-y-6 p-6">
					{/* Header */}
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
						<div>
							<h1 className="text-3xl font-bold tracking-tight">Planos</h1>
							<p className="text-muted-foreground">
								Gerencie os planos disponíveis para as empresas
							</p>
						</div>
						{isSuperAdmin && (
							<Button onClick={handleCreatePlan} className="shrink-0">
								<Icon name="plus" className="mr-2 h-4 w-4" />
								Novo Plano
							</Button>
						)}
					</div>

					{/* Plans Grid */}
					{isLoading ? (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{[1, 2, 3].map((i) => (
								<div
									key={i}
									className="h-80 bg-gray-100 rounded-lg animate-pulse"
								/>
							))}
						</div>
					) : plans.length === 0 ? (
						<div className="text-center py-12">
							<div className="mx-auto h-24 w-24 text-gray-400 mb-4">
								<Icon name="package" className="h-full w-full" />
							</div>
							<h3 className="text-lg font-medium text-gray-900 mb-2">
								Nenhum plano encontrado
							</h3>
							<p className="text-gray-500 mb-6">
								Comece criando seu primeiro plano
							</p>
							{isSuperAdmin && (
								<Button onClick={handleCreatePlan}>
									<Icon name="plus" className="mr-2 h-4 w-4" />
									Criar Primeiro Plano
								</Button>
							)}
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							{plans.map((plan) => (
								<PlanCard
									key={plan.id}
									plan={plan}
									onEdit={isSuperAdmin ? handleEditPlan : undefined}
								/>
							))}
						</div>
					)}
				</div>

				{/* Form Modal */}
				<PlanForm
					isOpen={isFormOpen}
					onClose={() => {
						setIsFormOpen(false);
						setSelectedPlan(null);
					}}
					onSubmit={handleFormSubmit}
					plan={selectedPlan}
					isLoading={
						createPlanMutation.isPending || updatePlanMutation.isPending
					}
				/>
		</>
	);
};

export default Plans;
