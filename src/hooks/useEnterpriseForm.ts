import { useEffect, useState } from "react";
import { toast } from "@/components/ui/toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
	createEnterprise,
	type CreateEnterpriseData,
	type Enterprise,
} from "@/services/enterprises";
import { consultarCep } from "@/services/viaCep";
import { type EnterpriseFormData } from "@/types/enterprise";
import { formatPhone, formatZipCode } from "@/utils/format";
import {
	updateEnterprise,
	type UpdateEnterpriseData,
} from "@/services/enterprises";

const initialFormData: EnterpriseFormData = {
	cnpj: "",
	stateRegistration: "",
	socialReason: "",
	fantasyName: "",
	responsibleName: "",
	responsibleCrea: "",
	phone: "",
	email: "",
	address: "",
	city: "",
	state: "",
	zipCode: "",
	instagram: "",
	facebook: "",
	invoiceEmail: "",
	invoiceDueDate: "",
	logoUrl: "",
	primaryColor: "#3B82F6",
	secondaryColor: "#10B981",
	accentColor: "#F59E0B",
	customDomain: "",
	planType: "BASIC",
};

export const useEnterpriseForm = (
	onSuccess?: () => void,
	enterprise?: Enterprise | null,
	isEditing = false,
) => {
	const queryClient = useQueryClient();
	const [formData, setFormData] = useState<EnterpriseFormData>(initialFormData);
	const [addressLoading, setAddressLoading] = useState(false);
	const [addressFieldsDisabled, setAddressFieldsDisabled] = useState(true);

	const createEnterpriseMutation = useMutation({
		mutationFn: createEnterprise,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["enterprises"] });
			resetForm();
			onSuccess?.();
			toast.success("Sucesso", {
				description: "Empresa criada com sucesso!",
				duration: 3000,
			});
		},
		onError: (
			error: Error & { response?: { data?: { message?: string } } },
		) => {
			toast.error("Erro", {
				description: error.response?.data?.message || "Erro ao criar empresa",
				duration: 3000,
			});
		},
	});

	const resetForm = () => {
		setFormData(initialFormData);
		setAddressFieldsDisabled(true);
	};

	const handleInputChange = (field: string, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handlePhoneChange = (value: string) => {
		const formattedPhone = formatPhone(value);
		setFormData((prev) => ({ ...prev, phone: formattedPhone }));
	};

	const handleCepChange = async (value: string) => {
		const formattedCep = formatZipCode(value);
		const unmaskedValue = value.replace(/\D/g, "");

		setFormData((prev) => ({ ...prev, zipCode: formattedCep }));

		if (unmaskedValue.length === 8) {
			setAddressLoading(true);
			try {
				const addressData = await consultarCep(unmaskedValue);

				if (addressData) {
					setFormData((prev) => ({
						...prev,
						address: addressData.street,
						city: addressData.city,
						state: addressData.state,
					}));
					setAddressFieldsDisabled(false);
					toast.success("Sucesso", {
						description: "Endereço encontrado!",
						duration: 3000,
					});
				} else {
					toast.error("Erro", {
						description: "CEP não encontrado",
						duration: 3000,
					});
					setAddressFieldsDisabled(true);
				}
			} catch (error) {
				console.error("Erro ao consultar CEP:", error);
				toast.error("Erro", {
					description: "Erro ao consultar CEP",
					duration: 3000,
				});
				setAddressFieldsDisabled(true);
			} finally {
				setAddressLoading(false);
			}
		} else {
			setFormData((prev) => ({
				...prev,
				address: "",
				city: "",
				state: "",
			}));
			setAddressFieldsDisabled(true);
		}
	};

	const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				const logoUrl = e.target?.result as string;
				setFormData((prev) => ({ ...prev, logoUrl }));
			};
			reader.readAsDataURL(file);
		}
	};

	useEffect(() => {
		if (isEditing && enterprise) {
			setFormData({
				cnpj: enterprise.cnpj || "",
				stateRegistration: enterprise.stateRegistration || "",
				socialReason: enterprise.socialReason || "",
				fantasyName: enterprise.fantasyName || "",
				responsibleName: enterprise.responsibleName || "",
				responsibleCrea: enterprise.responsibleCrea || "",
				phone: enterprise.phone || "",
				email: enterprise.email || "",
				address: enterprise.address || "",
				city: enterprise.city || "",
				state: enterprise.state || "",
				zipCode: enterprise.zipCode || "",
				instagram: enterprise.instagram || "",
				facebook: enterprise.facebook || "",
				invoiceEmail: enterprise.invoiceEmail || "",
				invoiceDueDate: enterprise.invoiceDueDate?.toString() || "",
				logoUrl: enterprise.logoUrl || "",
				primaryColor: enterprise.primaryColor || "#3B82F6",
				secondaryColor: enterprise.secondaryColor || "#10B981",
				accentColor: enterprise.accentColor || "#F59E0B",
				customDomain: enterprise.customDomain || "",
				planType:
					(enterprise.planType as "BASIC" | "PREMIUM" | "ENTERPRISE") ||
					"BASIC",
			});
			setAddressFieldsDisabled(false);
		}
	}, [isEditing, enterprise]);

	const updateEnterpriseMutation = useMutation({
		mutationFn: ({ id, data }: { id: string; data: UpdateEnterpriseData }) =>
			updateEnterprise(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["enterprises"] });
			resetForm();
			onSuccess?.();
			toast.success("Sucesso", {
				description: "Empresa atualizada com sucesso!",
				duration: 3000,
			});
		},
		onError: (
			error: Error & { response?: { data?: { message?: string } } },
		) => {
			toast.error("Erro", {
				description:
					error.response?.data?.message || "Erro ao atualizar empresa",
				duration: 3000,
			});
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!formData.cnpj || !formData.socialReason || !formData.email) {
			toast.error("Erro", {
				description: "CNPJ, Razão Social e E-mail são obrigatórios.",
			});
			return;
		}

		const enterpriseData = {
			cnpj: formData.cnpj,
			socialReason: formData.socialReason,
			email: formData.email,
			...(formData.stateRegistration && {
				stateRegistration: formData.stateRegistration,
			}),
			...(formData.fantasyName && { fantasyName: formData.fantasyName }),
			...(formData.responsibleName && {
				responsibleName: formData.responsibleName,
			}),
			...(formData.responsibleCrea && {
				responsibleCrea: formData.responsibleCrea,
			}),
			...(formData.phone && { phone: formData.phone }),
			...(formData.address && { address: formData.address }),
			...(formData.city && { city: formData.city }),
			...(formData.state && { state: formData.state }),
			...(formData.zipCode && { zipCode: formData.zipCode }),
			...(formData.instagram && { instagram: formData.instagram }),
			...(formData.facebook && { facebook: formData.facebook }),
			...(formData.invoiceEmail && { invoiceEmail: formData.invoiceEmail }),
			...(formData.invoiceDueDate && {
				invoiceDueDate: Number(formData.invoiceDueDate),
			}),
		};

		if (isEditing && enterprise) {
			updateEnterpriseMutation.mutate({
				id: enterprise.id,
				data: enterpriseData as UpdateEnterpriseData,
			});
		} else {
			createEnterpriseMutation.mutate(enterpriseData as CreateEnterpriseData);
		}
	};

	return {
		formData,
		handleInputChange,
		handlePhoneChange,
		handleCepChange,
		handleLogoChange,
		handleSubmit,
		resetForm,
		addressLoading,
		addressFieldsDisabled,
		isLoading:
			createEnterpriseMutation.isPending || updateEnterpriseMutation.isPending,
	};
};
