import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { toast } from "@/components/ui/toast";
import type {
	Plan,
	CreatePlanData,
	UpdatePlanData,
	PlanType,
} from "@/types/plan";
import { PLAN_CONFIGS, DEFAULT_PLAN_FEATURES } from "@/types/plan";
import { formatCurrency } from "@/utils/format";

interface PlanFormProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: CreatePlanData | UpdatePlanData) => void;
	plan?: Plan | null;
	isLoading?: boolean;
}

export const PlanForm: React.FC<PlanFormProps> = ({
	isOpen,
	onClose,
	onSubmit,
	plan,
	isLoading = false,
}) => {
	const [formData, setFormData] = useState({
		name: plan?.name || "",
		description: plan?.description || "",
		price: plan?.price || 0,
		type: plan?.type || ("BASIC" as PlanType),
		features: plan?.features || DEFAULT_PLAN_FEATURES.BASIC,
	});

	const [priceDisplay, setPriceDisplay] = useState(
		plan?.price ? formatCurrency(plan.price) : "",
	);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!formData.name.trim()) {
			toast.error("Erro", {
				description: "Nome do plano é obrigatório",
				duration: 3000,
			});
			return;
		}

		if (!formData.description.trim()) {
			toast.error("Erro", {
				description: "Descrição do plano é obrigatória",
				duration: 3000,
			});
			return;
		}

		if (formData.price <= 0) {
			toast.error("Erro", {
				description: "Preço deve ser maior que zero",
				duration: 3000,
			});
			return;
		}

		onSubmit({
			...formData,
			features: [...formData.features],
		});
	};

	const handleInputChange = (
		field: string,
		value: string | number | string[],
	) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleTypeChange = (newType: PlanType) => {
		setFormData((prev) => ({
			...prev,
			type: newType,
			features: DEFAULT_PLAN_FEATURES[newType],
		}));
	};

	const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		const numericValue = value.replace(/\D/g, "");

		if (numericValue === "") {
			setPriceDisplay("");
			handleInputChange("price", 0);
			return;
		}

		const priceValue = parseFloat(numericValue) / 100;

		handleInputChange("price", priceValue);
		setPriceDisplay(formatCurrency(priceValue));
	};

	return (
		<Sheet open={isOpen} onOpenChange={onClose}>
			<SheetContent className="w-full sm:max-w-md px-4 sm:px-6 overflow-y-auto">
				<SheetHeader>
					<SheetTitle>{plan ? "Editar Plano" : "Novo Plano"}</SheetTitle>
					<SheetDescription>
						{plan
							? "Atualize as informações do plano"
							: "Preencha os dados para criar um novo plano"}
					</SheetDescription>
				</SheetHeader>

				<form onSubmit={handleSubmit} className="space-y-6 mt-6">
					<div className="space-y-2">
						<Label htmlFor="name">Nome do Plano</Label>
						<Input
							id="name"
							value={formData.name}
							onChange={(e) => handleInputChange("name", e.target.value)}
							placeholder="Ex: Hangar, Frota, Esquadrão"
							required
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="type">Tipo do Plano</Label>
						<Select value={formData.type} onValueChange={handleTypeChange}>
							<SelectTrigger>
								<SelectValue placeholder="Selecione o tipo" />
							</SelectTrigger>
							<SelectContent>
								{Object.entries(PLAN_CONFIGS).map(([key, config]) => (
									<SelectItem key={key} value={key}>
										<div className="flex items-center gap-2">
											<span>{config.name}</span>
										</div>
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-2">
						<Label htmlFor="price">Preço</Label>
						<Input
							id="price"
							type="text"
							value={priceDisplay}
							onChange={handlePriceChange}
							placeholder="R$ 149,90"
							required
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="description">Descrição</Label>
						<Textarea
							id="description"
							value={formData.description}
							onChange={(e) => handleInputChange("description", e.target.value)}
							placeholder="Descreva as características e benefícios do plano"
							rows={4}
							required
						/>
					</div>

					<div className="flex gap-3 pt-4">
						<Button
							type="button"
							variant="outline"
							onClick={onClose}
							className="flex-1"
							disabled={isLoading}
						>
							Cancelar
						</Button>
						<Button type="submit" className="flex-1" disabled={isLoading}>
							{isLoading ? "Salvando..." : plan ? "Atualizar" : "Criar"}
						</Button>
					</div>
				</form>
			</SheetContent>
		</Sheet>
	);
};
