import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icon } from "@/components/ui/icon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { formatCpfCnpj, formatPhone, formatZipCode } from "@/utils/format";
import { useEnterpriseForm } from "@/hooks/useEnterpriseForm";
import type { Enterprise } from "@/services/enterprises";

interface EnterpriseFormPageProps {
	onSuccess: () => void;
	onCancel: () => void;
	enterprise?: Enterprise | null;
	isEditing?: boolean;
}

export const EnterpriseFormPage = ({
	onSuccess,
	onCancel,
	enterprise,
	isEditing = false,
}: EnterpriseFormPageProps) => {
	const {
		formData,
		addressLoading,
		addressFieldsDisabled,
		isLoading,
		handleInputChange,
		handleCepChange,
		handleSubmit,
	} = useEnterpriseForm(onSuccess, enterprise, isEditing);

	return (
		<form onSubmit={handleSubmit} className="space-y-8">
			<Card>
				<CardHeader>
					<CardTitle className="text-lg flex items-center">
						<Icon name="building" className="h-5 w-5 mr-2" />
						Dados Básicos
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="cnpj">CNPJ *</Label>
							<Input
								id="cnpj"
								leftIcon="creditCard"
								value={formatCpfCnpj(formData.cnpj)}
								onChange={(e) => handleInputChange("cnpj", e.target.value)}
								placeholder="00.000.000/0000-00"
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="stateRegistration">Inscrição Estadual</Label>
							<Input
								id="stateRegistration"
								leftIcon="building"
								value={formData.stateRegistration}
								onChange={(e) =>
									handleInputChange("stateRegistration", e.target.value)
								}
								placeholder="000.000.000.000"
							/>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="socialReason">Razão Social *</Label>
							<Input
								id="socialReason"
								leftIcon="building"
								value={formData.socialReason}
								onChange={(e) =>
									handleInputChange("socialReason", e.target.value)
								}
								placeholder="Razão social da empresa"
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="fantasyName">Nome Fantasia *</Label>
							<Input
								id="fantasyName"
								leftIcon="building"
								value={formData.fantasyName}
								onChange={(e) =>
									handleInputChange("fantasyName", e.target.value)
								}
								placeholder="Nome fantasia da empresa"
								required
							/>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="text-lg flex items-center">
						<Icon name="users" className="h-5 w-5 mr-2" />
						Responsável Técnico
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="responsibleName">Nome do Responsável *</Label>
							<Input
								id="responsibleName"
								leftIcon="userCheck"
								value={formData.responsibleName}
								onChange={(e) =>
									handleInputChange("responsibleName", e.target.value)
								}
								placeholder="Nome completo do responsável"
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="responsibleCrea">CREA do Responsável</Label>
							<Input
								id="responsibleCrea"
								leftIcon="creditCard"
								value={formData.responsibleCrea}
								onChange={(e) =>
									handleInputChange("responsibleCrea", e.target.value)
								}
								placeholder="Número do CREA"
							/>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="text-lg flex items-center">
						<Icon name="phone" className="h-5 w-5 mr-2" />
						Contato
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="phone">Telefone *</Label>
							<Input
								id="phone"
								leftIcon="phone"
								value={formatPhone(formData.phone)}
								onChange={(e) => handleInputChange("phone", e.target.value)}
								placeholder="(00) 00000-0000"
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="email">Email *</Label>
							<Input
								id="email"
								leftIcon="mail"
								type="email"
								value={formData.email}
								onChange={(e) => handleInputChange("email", e.target.value)}
								placeholder="email@empresa.com"
								required
							/>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="text-lg flex items-center">
						<Icon name="mapPin" className="h-5 w-5 mr-2" />
						Endereço
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div className="space-y-2">
							<Label htmlFor="zipCode">CEP</Label>
							<Input
								id="zipCode"
								leftIcon="mapPin"
								value={formatZipCode(formData.zipCode)}
								onChange={(e) => handleCepChange(e.target.value)}
								placeholder="00000-000"
								disabled={addressLoading}
							/>
						</div>

						<div className="space-y-2 md:col-span-2">
							<Label htmlFor="address">Endereço</Label>
							<Input
								id="address"
								leftIcon="home"
								value={formData.address}
								onChange={(e) => handleInputChange("address", e.target.value)}
								placeholder="Rua, Avenida, etc."
								disabled={addressFieldsDisabled}
							/>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="city">Cidade</Label>
							<Input
								id="city"
								leftIcon="building"
								value={formData.city}
								onChange={(e) => handleInputChange("city", e.target.value)}
								placeholder="Cidade"
								disabled={true}
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="state">Estado</Label>
							<Input
								id="state"
								leftIcon="map"
								value={formData.state}
								onChange={(e) => handleInputChange("state", e.target.value)}
								placeholder="Estado"
								disabled={true}
							/>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="text-lg flex items-center">
						<Icon name="code" className="h-5 w-5 mr-2" />
						Personalização
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="logoUrl">Logo da Empresa</Label>
						<Input
							id="logoUrl"
							leftIcon="image"
							value={formData.logoUrl}
							onChange={(e) => handleInputChange("logoUrl", e.target.value)}
							placeholder="URL do logo da empresa"
						/>
						{formData.logoUrl && (
							<div className="mt-2">
								<img
									src={formData.logoUrl}
									alt="Preview do logo"
									className="h-16 w-16 object-contain border rounded"
									onError={(e) => {
										e.currentTarget.style.display = "none";
									}}
								/>
							</div>
						)}
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<div className="space-y-2">
							<Label htmlFor="primaryColor">Cor Primária</Label>
							<div className="flex gap-2">
								<input
									type="color"
									value={formData.primaryColor}
									onChange={(e) =>
										handleInputChange("primaryColor", e.target.value)
									}
									className="w-12 h-12 border-none cursor-pointer"
								/>
								<Input
									id="primaryColor"
									value={formData.primaryColor}
									onChange={(e) =>
										handleInputChange("primaryColor", e.target.value)
									}
									placeholder="#000000"
									className="flex-1"
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="secondaryColor">Cor Secundária</Label>
							<div className="flex gap-2">
								<input
									type="color"
									value={formData.secondaryColor}
									onChange={(e) =>
										handleInputChange("secondaryColor", e.target.value)
									}
									className="w-12 h-12 border-none cursor-pointer"
								/>
								<Input
									id="secondaryColor"
									value={formData.secondaryColor}
									onChange={(e) =>
										handleInputChange("secondaryColor", e.target.value)
									}
									placeholder="#000000"
									className="flex-1"
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="accentColor">Cor de Destaque</Label>
							<div className="flex gap-2">
								<input
									type="color"
									value={formData.accentColor}
									onChange={(e) =>
										handleInputChange("accentColor", e.target.value)
									}
									className="w-12 h-12 border-none cursor-pointer"
								/>
								<Input
									id="accentColor"
									value={formData.accentColor}
									onChange={(e) =>
										handleInputChange("accentColor", e.target.value)
									}
									placeholder="#000000"
									className="flex-1"
								/>
							</div>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="customDomain">Domínio Personalizado</Label>
						<Input
							id="customDomain"
							leftIcon="globe"
							value={formData.customDomain}
							onChange={(e) =>
								handleInputChange("customDomain", e.target.value)
							}
							placeholder="empresa.com.br"
						/>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="text-lg flex items-center">
						<Icon name="share" className="h-5 w-5 mr-2" />
						Redes Sociais
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="instagram">Instagram</Label>
							<Input
								id="instagram"
								leftIcon="instagram"
								value={formData.instagram}
								onChange={(e) => handleInputChange("instagram", e.target.value)}
								placeholder="@empresa"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="facebook">Facebook</Label>
							<Input
								id="facebook"
								leftIcon="facebook"
								value={formData.facebook}
								onChange={(e) => handleInputChange("facebook", e.target.value)}
								placeholder="facebook.com/empresa"
							/>
						</div>
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="text-lg flex items-center">
						<Icon name="creditCard" className="h-5 w-5 mr-2" />
						Faturamento
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="invoiceEmail">Email para Faturamento</Label>
							<Input
								id="invoiceEmail"
								leftIcon="mail"
								type="email"
								value={formData.invoiceEmail}
								onChange={(e) =>
									handleInputChange("invoiceEmail", e.target.value)
								}
								placeholder="faturamento@empresa.com"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="invoiceDueDate">Dia de Vencimento</Label>
							<Input
								id="invoiceDueDate"
								leftIcon="calendar"
								type="number"
								min="1"
								max="31"
								value={formData.invoiceDueDate}
								onChange={(e) =>
									handleInputChange("invoiceDueDate", e.target.value)
								}
								placeholder="Dia do mês (1-31)"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="planType">Tipo de Plano</Label>
							<Select
								value={formData.planType}
								onValueChange={(value) => handleInputChange("planType", value)}
							>
								<SelectTrigger>
									<SelectValue placeholder="Selecione o tipo de plano" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="BASIC">Básico</SelectItem>
									<SelectItem value="PREMIUM">Premium</SelectItem>
									<SelectItem value="ENTERPRISE">Enterprise</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				</CardContent>
			</Card>

			<div className="flex flex-col sm:flex-row gap-4 pt-6 pb-2">
				<Button
					type="submit"
					disabled={isLoading}
					className="flex-1 sm:flex-none sm:min-w-[200px]"
				>
					{isLoading ? (
						<>
							<Icon name="lock" className="mr-2 h-4 w-4 animate-spin" />
							{isEditing ? "Atualizando..." : "Salvando..."}
						</>
					) : (
						<>
							<Icon name="check" className="mr-2 h-4 w-4" />
							{isEditing ? "Atualizar empresa" : "Salvar alterações"}
						</>
					)}
				</Button>

				<Button
					type="button"
					variant="outline"
					onClick={onCancel}
					disabled={isLoading}
					className="flex-1 sm:flex-none sm:min-w-[200px]"
				>
					<Icon name="close" className="mr-2 h-4 w-4" />
					Cancelar
				</Button>
			</div>
		</form>
	);
};
