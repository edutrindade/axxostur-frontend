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

interface Enterprise {
	id: number;
	name: string;
	state: string;
	city: string;
	status: "ativa" | "inativa" | "pendente";
	registrationDate: string;
	revenue: number;
	employees: number;
}

interface EnterprisesDialogProps {
	enterprises: Enterprise[];
	triggerButton: React.ReactNode;
}

export const EnterprisesDialog = ({
	enterprises,
	triggerButton,
}: EnterprisesDialogProps) => {
	const totalRevenue = enterprises
		.filter((e) => e.status === "ativa")
		.reduce((sum, e) => sum + e.revenue, 0);

	const totalEmployees = enterprises
		.filter((e) => e.status === "ativa")
		.reduce((sum, e) => sum + e.employees, 0);

	return (
		<Dialog>
			<DialogTrigger asChild>{triggerButton}</DialogTrigger>
			<DialogContent className="!max-w-6xl max-h-[80vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Detalhes das Empresas</DialogTitle>
					<DialogDescription>
						Visualização completa dos dados de empresas no período selecionado
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<Card>
							<CardContent className="p-4">
								<div className="text-center">
									<div className="text-2xl font-bold text-blue-600">
										{enterprises.length}
									</div>
									<div className="text-sm text-muted-foreground">
										Total de Empresas
									</div>
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="p-4">
								<div className="text-center">
									<div className="text-2xl font-bold text-green-600">
										R$ {totalRevenue.toLocaleString()}
									</div>
									<div className="text-sm text-muted-foreground">Faturamento Total</div>
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="p-4">
								<div className="text-center">
									<div className="text-2xl font-bold text-purple-600">
										{totalEmployees.toLocaleString()}
									</div>
									<div className="text-sm text-muted-foreground">
										Total de Funcionários
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
									<TableHead>Estado</TableHead>
									<TableHead>Cidade</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Data de Registro</TableHead>
									<TableHead>Faturamento</TableHead>
									<TableHead>Funcionários</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{enterprises.map((enterprise) => (
									<TableRow key={enterprise.id}>
										<TableCell className="font-medium">
											{enterprise.name}
										</TableCell>
										<TableCell>{enterprise.state}</TableCell>
										<TableCell>{enterprise.city}</TableCell>
										<TableCell>
											<Badge
												variant={
													enterprise.status === "ativa" 
														? "default" 
														: enterprise.status === "pendente" 
															? "secondary" 
															: "destructive"
												}
												className={
													enterprise.status === "ativa"
														? "bg-green-100 text-green-800"
														: enterprise.status === "pendente"
															? "bg-yellow-100 text-yellow-800"
															: "bg-red-100 text-red-800"
												}
											>
												{enterprise.status === "ativa" 
													? "Ativa" 
													: enterprise.status === "pendente" 
														? "Pendente" 
														: "Inativa"
												}
											</Badge>
										</TableCell>
										<TableCell>
											{new Date(enterprise.registrationDate).toLocaleDateString("pt-BR")}
										</TableCell>
										<TableCell className="font-medium text-green-600">
											R$ {enterprise.revenue.toLocaleString()}
										</TableCell>
										<TableCell>{enterprise.employees}</TableCell>
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