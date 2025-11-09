import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icon } from "@/components/ui/icon";
import { formatCpfCnpj, formatPhone, formatZipCode } from "@/utils/format";
import { useEnterpriseForm } from "@/hooks/useEnterpriseForm";
import type { Enterprise } from "@/services/enterprises";

interface EnterpriseFormProps {
	onSuccess: () => void;
	enterprise?: Enterprise | null;
	isEditing?: boolean;
}

export const EnterpriseForm = ({ onSuccess, enterprise, isEditing = false }: EnterpriseFormProps) => {
	const {
		formData,
		addressLoading,
		addressFieldsDisabled,
		isLoading,
		handleInputChange,
		handleCepChange,
		handleSubmit,
	} = useEnterpriseForm(onSuccess, enterprise ?? undefined, isEditing);

	return (
		<form onSubmit={handleSubmit} className="space-y-4 mt-6">
			<div className="space-y-4">
				<h3 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2">
					Dados Básicos
				</h3>

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
						placeholder="Digite a inscrição estadual"
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="socialReason">Razão Social *</Label>
					<Input
						id="socialReason"
						leftIcon="building"
						value={formData.socialReason}
						onChange={(e) => handleInputChange("socialReason", e.target.value)}
						placeholder="Digite a razão social"
						required
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="fantasyName">Nome Fantasia</Label>
					<Input
						id="fantasyName"
						leftIcon="tag"
						value={formData.fantasyName}
						onChange={(e) => handleInputChange("fantasyName", e.target.value)}
						placeholder="Digite o nome fantasia"
					/>
				</div>
			</div>

			<div className="space-y-4">
				<h3 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2">
					Dados de Contato
				</h3>

				<div className="space-y-2">
					<Label htmlFor="email">E-mail *</Label>
					<Input
						id="email"
						type="email"
						leftIcon="mail"
						value={formData.email}
						onChange={(e) => handleInputChange("email", e.target.value)}
						placeholder="Digite o email"
						required
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="phone">Telefone</Label>
					<Input
						id="phone"
						leftIcon="phone"
						value={formatPhone(formData.phone)}
						onChange={(e) => handleInputChange("phone", e.target.value)}
						placeholder="(11) 99999-9999"
					/>
				</div>
			</div>

			{/* Endereço */}
			<div className="space-y-4">
				<h3 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2">
					Endereço
				</h3>

				<div className="space-y-2">
					<Label htmlFor="zipCode">CEP</Label>
					<Input
						id="zipCode"
						leftIcon="mapPin"
						value={formatZipCode(formData.zipCode)}
						onChange={(e) => {
							const unmaskedValue = e.target.value.replace(/\D/g, "");
							handleCepChange(unmaskedValue);
						}}
						placeholder="00000-000"
						disabled={addressLoading}
					/>
					{addressLoading && (
						<div className="text-sm text-muted-foreground flex items-center gap-2">
							<div className="animate-spin rounded-full h-3 w-3 border-b border-primary"></div>
							Consultando CEP...
						</div>
					)}
				</div>

				<div className="space-y-2">
					<Label htmlFor="address">Endereço</Label>
					<Input
						id="address"
						leftIcon="home"
						value={formData.address}
						onChange={(e) => handleInputChange("address", e.target.value)}
						placeholder="Digite o endereço completo"
						disabled={addressFieldsDisabled}
					/>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label htmlFor="city">Cidade</Label>
						<Input
							id="city"
							leftIcon="map"
							value={formData.city}
							onChange={(e) => handleInputChange("city", e.target.value)}
							placeholder="Digite a cidade"
							disabled={addressFieldsDisabled}
						/>
					</div>

					<div className="space-y-2">
						<Label htmlFor="state">Estado</Label>
						<Input
							id="state"
							leftIcon="globe"
							value={formData.state}
							onChange={(e) => handleInputChange("state", e.target.value)}
							placeholder="Digite o estado"
							disabled={addressFieldsDisabled}
						/>
					</div>
				</div>
			</div>

			<div className="space-y-4">
				<h3 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2">
					Responsável Técnico
				</h3>

				<div className="space-y-2">
					<Label htmlFor="responsibleName">Nome do Responsável</Label>
					<Input
						id="responsibleName"
						leftIcon="userCheck"
						value={formData.responsibleName}
						onChange={(e) =>
							handleInputChange("responsibleName", e.target.value)
						}
						placeholder="Digite o nome do responsável"
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="responsibleCrea">CREA do Responsável</Label>
					<Input
						id="responsibleCrea"
						leftIcon="award"
						value={formData.responsibleCrea}
						onChange={(e) =>
							handleInputChange("responsibleCrea", e.target.value)
						}
						placeholder="Digite o CREA"
					/>
				</div>
			</div>

			<div className="space-y-4">
				<h3 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2">
					Redes Sociais
				</h3>

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

			<div className="space-y-4">
				<h3 className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2">
					Faturamento
				</h3>

				<div className="space-y-2">
					<Label htmlFor="invoiceEmail">E-mail para Faturamento</Label>
					<Input
						id="invoiceEmail"
						type="email"
						leftIcon="mail"
						value={formData.invoiceEmail}
						onChange={(e) => handleInputChange("invoiceEmail", e.target.value)}
						placeholder="faturamento@empresa.com"
					/>
				</div>

				<div className="space-y-2">
					<Label htmlFor="invoiceDueDate">Dia de Vencimento da Fatura</Label>
					<Input
						id="invoiceDueDate"
						type="number"
						leftIcon="calendar"
						value={formData.invoiceDueDate}
						onChange={(e) =>
							handleInputChange("invoiceDueDate", e.target.value)
						}
						placeholder="5"
						min="1"
						max="31"
					/>
				</div>
			</div>

			<div className="flex gap-3 pt-4">
				<Button type="submit" className="flex-1" disabled={isLoading}>
					<Icon name="check" size={16} className="mr-2 text-white" />
					<span className="text-white font-bold text-lg">{isEditing ? "Atualizar" : "Cadastrar"}</span>
				</Button>
				<Button
					type="button"
					variant="outline"
					onClick={onSuccess}
					className="flex-1 text-slate-700"
				>
					<span className="font-bold text-lg">Cancelar</span>
				</Button>
			</div>
		</form>
	);
};
