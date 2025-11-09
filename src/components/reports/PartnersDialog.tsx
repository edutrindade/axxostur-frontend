import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface Partner {
	id: number;
	name: string;
	city: string;
	state: string;
	status: string;
	joinDate: string;
	totalSales: string;
}

interface PartnersDialogProps {
	detailedPartnersData: Partner[];
	triggerButton: React.ReactNode;
}

export const PartnersDialog = ({
	detailedPartnersData,
	triggerButton,
}: PartnersDialogProps) => {
	return (
		<Dialog>
			<DialogTrigger asChild>{triggerButton}</DialogTrigger>
			<DialogContent className="!max-w-6xl max-h-[80vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Detalhes dos Parceiros</DialogTitle>
					<DialogDescription>
						Visualização completa dos dados de parceiros no período selecionado
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<Card>
							<CardContent className="p-4">
								<div className="text-center">
									<div className="text-2xl font-bold text-blue-600">
										{detailedPartnersData.length}
									</div>
									<div className="text-sm text-muted-foreground">
										Total de Parceiros
									</div>
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="p-4">
								<div className="text-center">
									<div className="text-2xl font-bold text-green-600">
										{
											detailedPartnersData.filter((p) => p.status === "Ativo")
												.length
										}
									</div>
									<div className="text-sm text-muted-foreground">Ativos</div>
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="p-4">
								<div className="text-center">
									<div className="text-2xl font-bold text-orange-600">
										R$ 292.500
									</div>
									<div className="text-sm text-muted-foreground">
										Vendas Totais
									</div>
								</div>
							</CardContent>
						</Card>
					</div>

					<div className="border rounded-lg">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Nome</TableHead>
									<TableHead>Cidade</TableHead>
									<TableHead>Estado</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Data de Ingresso</TableHead>
									<TableHead>Vendas Totais</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{detailedPartnersData.map((partner) => (
									<TableRow key={partner.id}>
										<TableCell className="font-medium">
											{partner.name}
										</TableCell>
										<TableCell>{partner.city}</TableCell>
										<TableCell>{partner.state}</TableCell>
										<TableCell>
											<Badge
												variant={
													partner.status === "Ativo" ? "default" : "secondary"
												}
												className={
													partner.status === "Ativo"
														? "bg-green-100 text-green-800"
														: "bg-red-100 text-red-800"
												}
											>
												{partner.status}
											</Badge>
										</TableCell>
										<TableCell>
											{new Date(partner.joinDate).toLocaleDateString("pt-BR")}
										</TableCell>
										<TableCell className="font-medium">
											{partner.totalSales}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};
