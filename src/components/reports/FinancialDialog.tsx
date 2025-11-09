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

interface FinancialTransaction {
	id: number;
	date: string;
	description: string;
	category: string;
	type: "receita" | "despesa";
	amount: number;
	status: "confirmado" | "pendente" | "cancelado";
}

interface FinancialDialogProps {
	financialTransactions: FinancialTransaction[];
	triggerButton: React.ReactNode;
}

export const FinancialDialog = ({
	financialTransactions,
	triggerButton,
}: FinancialDialogProps) => {
	const totalRevenue = financialTransactions
		.filter((t) => t.type === "receita" && t.status === "confirmado")
		.reduce((sum, t) => sum + t.amount, 0);

	const totalExpenses = financialTransactions
		.filter((t) => t.type === "despesa" && t.status === "confirmado")
		.reduce((sum, t) => sum + t.amount, 0);

	const netProfit = totalRevenue - totalExpenses;

	return (
		<Dialog>
			<DialogTrigger asChild>{triggerButton}</DialogTrigger>
			<DialogContent className="!max-w-6xl max-h-[80vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>Detalhes Financeiros</DialogTitle>
					<DialogDescription>
						Visualização completa das transações financeiras no período selecionado
					</DialogDescription>
				</DialogHeader>
				<div className="space-y-6">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						<Card>
							<CardContent className="p-4">
								<div className="text-center">
									<div className="text-2xl font-bold text-green-600">
										R$ {totalRevenue.toLocaleString()}
									</div>
									<div className="text-sm text-muted-foreground">
										Total de Receitas
									</div>
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="p-4">
								<div className="text-center">
									<div className="text-2xl font-bold text-red-600">
										R$ {totalExpenses.toLocaleString()}
									</div>
									<div className="text-sm text-muted-foreground">Total de Despesas</div>
								</div>
							</CardContent>
						</Card>
						<Card>
							<CardContent className="p-4">
								<div className="text-center">
									<div className={`text-2xl font-bold ${
										netProfit >= 0 ? "text-blue-600" : "text-red-600"
									}`}>
										R$ {netProfit.toLocaleString()}
									</div>
									<div className="text-sm text-muted-foreground">
										Lucro Líquido
									</div>
								</div>
							</CardContent>
						</Card>
					</div>

					<div className="border rounded-lg">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Data</TableHead>
									<TableHead>Descrição</TableHead>
									<TableHead>Categoria</TableHead>
									<TableHead>Tipo</TableHead>
									<TableHead>Valor</TableHead>
									<TableHead>Status</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{financialTransactions.map((transaction) => (
									<TableRow key={transaction.id}>
										<TableCell className="font-medium">
											{new Date(transaction.date).toLocaleDateString("pt-BR")}
										</TableCell>
										<TableCell>{transaction.description}</TableCell>
										<TableCell>{transaction.category}</TableCell>
										<TableCell>
											<Badge
												variant={transaction.type === "receita" ? "default" : "secondary"}
												className={
													transaction.type === "receita"
														? "bg-green-100 text-green-800"
														: "bg-red-100 text-red-800"
												}
											>
												{transaction.type === "receita" ? "Receita" : "Despesa"}
											</Badge>
										</TableCell>
										<TableCell className={`font-medium ${
											transaction.type === "receita" ? "text-green-600" : "text-red-600"
										}`}>
											{transaction.type === "receita" ? "+" : "-"}R$ {transaction.amount.toLocaleString()}
										</TableCell>
										<TableCell>
											<Badge
												variant={
													transaction.status === "confirmado" 
														? "default" 
														: transaction.status === "pendente" 
															? "secondary" 
															: "destructive"
												}
												className={
													transaction.status === "confirmado"
														? "bg-green-100 text-green-800"
														: transaction.status === "pendente"
															? "bg-yellow-100 text-yellow-800"
															: "bg-red-100 text-red-800"
												}
											>
												{transaction.status === "confirmado" 
													? "Confirmado" 
													: transaction.status === "pendente" 
														? "Pendente" 
														: "Cancelado"
												}
											</Badge>
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