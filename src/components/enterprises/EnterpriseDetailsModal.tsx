import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { formatCpfCnpj, formatPhone, formatZipCode } from "@/utils/format";
import { type Enterprise } from "@/services/enterprises";

interface EnterpriseDetailsModalProps {
	enterprise: Enterprise | null;
	isOpen: boolean;
	onClose: () => void;
	onDeactivate?: (enterprise: Enterprise) => void;
	onReactivate?: (enterprise: Enterprise) => void;
	onEdit?: (enterprise: Enterprise) => void;
}

export const EnterpriseDetailsModal = ({
	enterprise,
	isOpen,
	onClose,
	onDeactivate,
	onReactivate,
}: EnterpriseDetailsModalProps) => {
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape" && isOpen) {
				onClose();
			}
		};

		document.addEventListener("keydown", handleEscape);
		return () => document.removeEventListener("keydown", handleEscape);
	}, [isOpen, onClose]);

	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "unset";
		}

		return () => {
			document.body.style.overflow = "unset";
		};
	}, [isOpen]);

	if (!isOpen || !enterprise) return null;

	const getInitials = (name: string) => {
		const words = name.split(" ");
		if (words.length === 1) {
			return words[0].substring(0, 2).toUpperCase();
		}
		return words
			.map((word) => word[0])
			.join("")
			.toUpperCase();
	};

	const getStatusBadge = (isActivated: boolean) => {
		if (isActivated) {
			return <Badge className="bg-success text-white">Ativa</Badge>;
		}
		return <Badge className="bg-destructive text-white">Inativa</Badge>;
	};

	const companyName = enterprise.fantasyName || enterprise.socialReason;
	const initials = getInitials(companyName);

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			<button
				type="button"
				className="fixed inset-0 bg-black/50 backdrop-blur-sm pointer-events-none"
				onClick={onClose}
			/>

			<div className="relative bg-background border rounded-lg shadow-lg w-full max-w-6xl max-h-[90vh] overflow-hidden mx-4">
				<div className="flex items-center justify-between p-6 border-b">
					<div className="flex items-center gap-4">
						<div className="flex items-center gap-4">
							{enterprise.logoUrl ? (
								<img
									src={enterprise.logoUrl}
									alt="Logo da empresa"
									className="w-16 h-16 object-contain border border-border rounded-lg"
								/>
							) : (
								<div className="w-16 h-16 bg-primary/10 border border-border rounded-lg flex items-center justify-center">
									<span className="text-lg font-semibold text-primary">
										{initials}
									</span>
								</div>
							)}
							<div>
								<h2 className="text-xl font-semibold text-foreground">
									{companyName}
								</h2>
								<p className="text-sm text-muted-foreground">
									Detalhes completos da empresa
								</p>
							</div>
						</div>
						<div className="flex items-center gap-4">
							{getStatusBadge(enterprise.active)}
							{enterprise.active && onDeactivate && (
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={() => onDeactivate(enterprise)}
									className="text-destructive hover:text-destructive lg:absolute lg:right-20"
								>
									<Icon name="lock" size={14} className="mr-1" />
									Desativar
								</Button>
							)}
							{!enterprise.active && onReactivate && (
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={() => onReactivate(enterprise)}
									className="text-green-600 hover:text-green-600 lg:absolute lg:right-20"
								>
									<Icon name="unlock" size={14} className="mr-1" />
									Reativar
								</Button>
							)}
						</div>
					</div>
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onClick={onClose}
						className="h-8 w-8 p-0"
					>
						<Icon name="close" size={16} />
					</Button>
				</div>

				<div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] scrollbar-hide">
					<style>{`
						.scrollbar-hide {
							scrollbar-width: none;
							-ms-overflow-style: none;
						}
						.scrollbar-hide::-webkit-scrollbar {
							display: none;
						}
					`}</style>
					<div className="space-y-6">
						<div className="space-y-4">
							<h3 className="text-lg font-semibold text-foreground border-b pb-2">
								Informações Básicas
							</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
								{enterprise.fantasyName && (
									<div>
										<label
											htmlFor="fantasyName"
											className="text-sm font-medium text-muted-foreground"
										>
											Nome Fantasia
										</label>
										<p id="fantasyName" className="text-sm mt-1">
											{enterprise.fantasyName}
										</p>
									</div>
								)}
								<div>
									<label
										htmlFor="socialReason"
										className="text-sm font-medium text-muted-foreground"
									>
										Razão Social
									</label>
									<p id="socialReason" className="text-sm mt-1">
										{enterprise.socialReason}
									</p>
								</div>
								<div>
									<label
										htmlFor="cnpj"
										className="text-sm font-medium text-muted-foreground"
									>
										CNPJ
									</label>
									<p id="cnpj" className="text-sm mt-1">
										{formatCpfCnpj(enterprise.cnpj)}
									</p>
								</div>
								{enterprise.stateRegistration && (
									<div>
										<label
											htmlFor="stateRegistration"
											className="text-sm font-medium text-muted-foreground"
										>
											Inscrição Estadual
										</label>
										<p id="stateRegistration" className="text-sm mt-1">
											{enterprise.stateRegistration}
										</p>
									</div>
								)}
								{enterprise.planType && (
									<div>
										<label
											htmlFor="planType"
											className="text-sm font-medium text-muted-foreground"
										>
											Plano Aderido
										</label>
										<p id="planType" className="text-sm mt-1">
											<Badge variant="outline">{enterprise.planType}</Badge>
										</p>
									</div>
								)}
							</div>
						</div>

						<div className="space-y-4">
							<h3 className="text-lg font-semibold text-foreground border-b pb-2">
								Contato
							</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
								<div>
									<label
										htmlFor="email"
										className="text-sm font-medium text-muted-foreground"
									>
										E-mail
									</label>
									<p id="email" className="text-sm mt-1">
										{enterprise.email}
									</p>
								</div>
								{enterprise.phone && (
									<div>
										<label
											htmlFor="phone"
											className="text-sm font-medium text-muted-foreground"
										>
											Telefone
										</label>
										<p id="phone" className="text-sm mt-1">
											{formatPhone(enterprise.phone)}
										</p>
									</div>
								)}
								{enterprise.responsibleName && (
									<div>
										<label
											htmlFor="phone"
											className="text-sm font-medium text-muted-foreground"
										>
											Responsável
										</label>
										<p id="phone" className="text-sm mt-1">
											{enterprise.responsibleName}
										</p>
									</div>
								)}
							</div>
						</div>

						{(enterprise.address ||
							enterprise.city ||
							enterprise.state ||
							enterprise.zipCode) && (
							<div className="space-y-4">
								<h3 className="text-lg font-semibold text-foreground border-b pb-2">
									Endereço
								</h3>
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
									{enterprise.address && (
										<div className="lg:col-span-3">
											<label
												htmlFor="address"
												className="text-sm font-medium text-muted-foreground"
											>
												Endereço
											</label>
											<p id="address" className="text-sm mt-1">
												{enterprise.address}
											</p>
										</div>
									)}
									{enterprise.city && (
										<div>
											<label
												htmlFor="city"
												className="text-sm font-medium text-muted-foreground"
											>
												Cidade
											</label>
											<p id="city" className="text-sm mt-1">
												{enterprise.city}
											</p>
										</div>
									)}
									{enterprise.state && (
										<div>
											<label
												htmlFor="state"
												className="text-sm font-medium text-muted-foreground"
											>
												Estado
											</label>
											<p id="state" className="text-sm mt-1">
												{enterprise.state}
											</p>
										</div>
									)}
									{enterprise.zipCode && (
										<div>
											<label
												htmlFor="zipCode"
												className="text-sm font-medium text-muted-foreground"
											>
												CEP
											</label>
											<p id="zipCode" className="text-sm mt-1">
												{formatZipCode(enterprise.zipCode)}
											</p>
										</div>
									)}
								</div>
							</div>
						)}

						{(enterprise.responsibleName || enterprise.responsibleCrea) && (
							<div className="space-y-4">
								<h3 className="text-lg font-semibold text-foreground border-b pb-2">
									Responsável
								</h3>
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
									{enterprise.responsibleName && (
										<div>
											<label
												htmlFor="responsibleName"
												className="text-sm font-medium text-muted-foreground"
											>
												Nome do Responsável
											</label>
											<p id="responsibleName" className="text-sm mt-1">
												{enterprise.responsibleName}
											</p>
										</div>
									)}
									{enterprise.responsibleCrea && (
										<div>
											<label
												htmlFor="responsibleCrea"
												className="text-sm font-medium text-muted-foreground"
											>
												CREA
											</label>
											<p id="responsibleCrea" className="text-sm mt-1">
												{enterprise.responsibleCrea}
											</p>
										</div>
									)}
								</div>
							</div>
						)}

						{(enterprise.primaryColor ||
							enterprise.secondaryColor ||
							enterprise.accentColor) && (
							<div className="space-y-4">
								<h3 className="text-lg font-semibold text-foreground border-b pb-2">
									Cores da Empresa
								</h3>
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
									{enterprise.primaryColor && (
										<div>
											<label
												htmlFor="primaryColor"
												className="text-sm font-medium text-muted-foreground"
											>
												Cor Primária
											</label>
											<div className="flex items-center gap-2 mt-1">
												<div
													className="w-6 h-6 rounded border border-border"
													style={{ backgroundColor: enterprise.primaryColor }}
												/>
												<p id="primaryColor" className="text-sm">
													{enterprise.primaryColor}
												</p>
											</div>
										</div>
									)}
									{enterprise.secondaryColor && (
										<div>
											<label
												htmlFor="secondaryColor"
												className="text-sm font-medium text-muted-foreground"
											>
												Cor Secundária
											</label>
											<div className="flex items-center gap-2 mt-1">
												<div
													className="w-6 h-6 rounded border border-border"
													style={{ backgroundColor: enterprise.secondaryColor }}
												/>
												<p id="secondaryColor" className="text-sm">
													{enterprise.secondaryColor}
												</p>
											</div>
										</div>
									)}
									{enterprise.accentColor && (
										<div>
											<label
												htmlFor="accentColor"
												className="text-sm font-medium text-muted-foreground"
											>
												Cor de Destaque
											</label>
											<div className="flex items-center gap-2 mt-1">
												<div
													className="w-6 h-6 rounded border border-border"
													style={{ backgroundColor: enterprise.accentColor }}
												/>
												<p id="accentColor" className="text-sm">
													{enterprise.accentColor}
												</p>
											</div>
										</div>
									)}
								</div>
							</div>
						)}

						{(enterprise.instagram || enterprise.facebook) && (
							<div className="space-y-4">
								<h3 className="text-lg font-semibold text-foreground border-b pb-2">
									Redes Sociais
								</h3>
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
									{enterprise.instagram && (
										<div>
											<label
												htmlFor="instagram"
												className="text-sm font-medium text-muted-foreground"
											>
												Instagram
											</label>
											<p id="instagram" className="text-sm mt-1">
												{enterprise.instagram}
											</p>
										</div>
									)}
									{enterprise.facebook && (
										<div>
											<label
												htmlFor="facebook"
												className="text-sm font-medium text-muted-foreground"
											>
												Facebook
											</label>
											<p id="facebook" className="text-sm mt-1">
												{enterprise.facebook}
											</p>
										</div>
									)}
								</div>
							</div>
						)}

						{(enterprise.customDomain ||
							enterprise.invoiceDueDate ||
							enterprise.invoiceEmail) && (
							<div className="space-y-4">
								<h3 className="text-lg font-semibold text-foreground border-b pb-2">
									Configurações
								</h3>
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
									{enterprise.customDomain && (
										<div>
											<label
												htmlFor="customDomain"
												className="text-sm font-medium text-muted-foreground"
											>
												Domínio Personalizado
											</label>
											<p id="customDomain" className="text-sm mt-1">
												{enterprise.customDomain}
											</p>
										</div>
									)}
									{enterprise.invoiceDueDate && (
										<div>
											<label
												htmlFor="invoiceDueDate"
												className="text-sm font-medium text-muted-foreground"
											>
												Vencimento da Fatura (dias)
											</label>
											<p id="invoiceDueDate" className="text-sm mt-1">
												{enterprise.invoiceDueDate}
											</p>
										</div>
									)}
									{enterprise.invoiceEmail && (
										<div>
											<label
												htmlFor="invoiceEmail"
												className="text-sm font-medium text-muted-foreground"
											>
												E-mail para Faturas
											</label>
											<p id="invoiceEmail" className="text-sm mt-1">
												{enterprise.invoiceEmail}
											</p>
										</div>
									)}
								</div>
							</div>
						)}

						<div className="space-y-4">
							<h3 className="text-lg font-semibold text-foreground border-b pb-2">
								Informações do Sistema
							</h3>
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
								<div>
									<label
										htmlFor="createdAt"
										className="text-sm font-medium text-muted-foreground"
									>
										Data de Criação
									</label>
									<p id="createdAt" className="text-sm mt-1">
										{new Date(enterprise.createdAt).toLocaleDateString("pt-BR")}
									</p>
								</div>
								<div>
									<label
										htmlFor="updatedAt"
										className="text-sm font-medium text-muted-foreground"
									>
										Última Atualização
									</label>
									<p id="updatedAt" className="text-sm mt-1">
										{new Date(enterprise.updatedAt).toLocaleDateString("pt-BR")}
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
