import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCpfCnpj, formatPhone, formatZipCode } from "@/utils/format";
import { type Enterprise } from "@/services/enterprises";

interface EnterpriseCardProps {
	enterprise: Enterprise;
}

const getStatusBadge = (active: boolean) => {
	return (
		<Badge variant={active ? "default" : "secondary"}>
			{active ? "Ativa" : "Inativa"}
		</Badge>
	);
};

export const EnterpriseCard = ({ enterprise }: EnterpriseCardProps) => {
	return (
		<Card className="p-4">
			<div className="flex items-start justify-between">
				<div className="space-y-2 flex-1">
					<div className="flex items-center gap-2">
						<h3 className="font-semibold">
							{enterprise.fantasyName || enterprise.socialReason}
						</h3>
						{getStatusBadge(enterprise.active)}
					</div>
					{enterprise.fantasyName && (
						<p className="text-sm text-muted-foreground">
							{enterprise.socialReason}
						</p>
					)}
					<p className="text-sm text-muted-foreground">
						CNPJ: {formatCpfCnpj(enterprise.cnpj)}
					</p>
					<p className="text-sm text-muted-foreground">{enterprise.email}</p>
					{enterprise.phone && (
						<p className="text-sm text-muted-foreground">
							{formatPhone(enterprise.phone)}
						</p>
					)}
					{enterprise.zipCode && (
						<p className="text-sm text-muted-foreground">
							CEP: {formatZipCode(enterprise.zipCode)}
						</p>
					)}
				</div>
			</div>
		</Card>
	);
};
