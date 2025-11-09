import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Enterprise {
	id: number;
	name: string;
	city: string;
	state: string;
	status: "ativa" | "inativa" | "pendente";
	registrationDate: string;
	revenue: number;
	employees: number;
}

interface EnterprisesReportData {
	enterprisesData: { state: string; count: number }[];
	detailedEnterprisesData: Enterprise[];
	startDate: Date;
	endDate: Date;
}

export const generateEnterprisesReportPDF = (data: EnterprisesReportData) => {
	const doc = new jsPDF();
	const pageWidth = doc.internal.pageSize.width;
	const pageHeight = doc.internal.pageSize.height;

	// Cabeçalho do relatório
	doc.setFontSize(20);
	doc.setFont("helvetica", "bold");
	doc.text("Relatório de Empresas", pageWidth / 2, 25, { align: "center" });

	// Linha decorativa
	doc.setDrawColor(0, 102, 51); // Verde Escuro
	doc.setLineWidth(1);
	doc.line(20, 30, pageWidth - 20, 30);

	// Informações do período
	doc.setFontSize(12);
	doc.setFont("helvetica", "normal");
	const startDateStr = data.startDate.toLocaleDateString("pt-BR");
	const endDateStr = data.endDate.toLocaleDateString("pt-BR");
	doc.text(`Período: ${startDateStr} a ${endDateStr}`, 20, 40);
	doc.text(
		`Data de geração: ${new Date().toLocaleDateString("pt-BR")} às ${new Date().toLocaleTimeString("pt-BR")}`,
		20,
		48,
	);

	// Resumo executivo
	doc.setFontSize(14);
	doc.setFont("helvetica", "bold");
	doc.text("Resumo Executivo", 20, 65);

	const totalEnterprises = data.detailedEnterprisesData.length;
	const activeEnterprises = data.detailedEnterprisesData.filter(
		(e) => e.status === "ativa",
	).length;
	const inactiveEnterprises = data.detailedEnterprisesData.filter(
		(e) => e.status === "inativa",
	).length;
	const pendingEnterprises = data.detailedEnterprisesData.filter(
		(e) => e.status === "pendente",
	).length;
	const totalRevenue = data.detailedEnterprisesData.reduce(
		(sum, e) => sum + e.revenue,
		0,
	);
	const totalEmployees = data.detailedEnterprisesData.reduce(
		(sum, e) => sum + e.employees,
		0,
	);

	doc.setFontSize(11);
	doc.setFont("helvetica", "normal");
	doc.text(`• Total de Empresas: ${totalEnterprises}`, 25, 75);
	doc.text(
		`• Empresas Ativas: ${activeEnterprises} (${((activeEnterprises / totalEnterprises) * 100).toFixed(1)}%)`,
		25,
		83,
	);
	doc.text(
		`• Empresas Inativas: ${inactiveEnterprises} (${((inactiveEnterprises / totalEnterprises) * 100).toFixed(1)}%)`,
		25,
		91,
	);
	doc.text(
		`• Empresas Pendentes: ${pendingEnterprises} (${((pendingEnterprises / totalEnterprises) * 100).toFixed(1)}%)`,
		25,
		99,
	);
	doc.text(
		`• Faturamento Total: R$ ${(totalRevenue / 1000000).toFixed(1)}M`,
		25,
		107,
	);
	doc.text(`• Total de Funcionários: ${totalEmployees}`, 25, 115);

	// Quantitativo por estado
	doc.setFontSize(14);
	doc.setFont("helvetica", "bold");
	doc.text("Quantitativo de Empresas por Estado", 20, 131);

	// Tabela de quantitativo por estado
	autoTable(doc, {
		startY: 141,
		head: [["Estado", "Quantidade de Empresas", "Percentual"]],
		body: data.enterprisesData.map((item) => [
			item.state,
			item.count.toString(),
			`${((item.count / totalEnterprises) * 100).toFixed(1)}%`,
		]),
		headStyles: {
			fillColor: [0, 102, 51],
			textColor: [255, 255, 255],
			fontStyle: "bold",
			halign: "center",
		},
		bodyStyles: {
			halign: "center",
		},
		alternateRowStyles: {
			fillColor: [240, 255, 240],
		},
		margin: { left: 20, right: 20 },
	});

	doc.addPage();

	// Título da segunda página
	doc.setFontSize(16);
	doc.setFont("helvetica", "bold");
	doc.text("Detalhamento das Empresas", 20, 25);

	// Linha decorativa
	doc.setDrawColor(0, 102, 51);
	doc.setLineWidth(0.5);
	doc.line(20, 30, pageWidth - 20, 30);

	// Tabela detalhada das empresas
	autoTable(doc, {
		startY: 40,
		head: [
			["Nome", "Cidade/Estado", "Status", "Data de Registro", "Faturamento", "Funcionários"],
		],
		body: data.detailedEnterprisesData.map((enterprise) => [
			enterprise.name,
			`${enterprise.city}/${enterprise.state}`,
			enterprise.status,
			new Date(enterprise.registrationDate).toLocaleDateString("pt-BR"),
			`R$ ${(enterprise.revenue / 1000).toFixed(0)}k`,
			enterprise.employees.toString(),
		]),
		headStyles: {
			fillColor: [0, 102, 51],
			textColor: [255, 255, 255],
			fontStyle: "bold",
			halign: "center",
		},
		bodyStyles: {
			halign: "center",
			fontSize: 9,
		},
		alternateRowStyles: {
			fillColor: [240, 255, 240],
		},
		columnStyles: {
			0: { halign: "left" }, // Nome alinhado à esquerda
			2: {
				cellWidth: 20,
				fontStyle: "bold",
			}, // Status em negrito
			4: {
				halign: "right",
				fontStyle: "bold",
			}, // Faturamento alinhado à direita
			5: {
				halign: "center",
			}, // Funcionários centralizado
		},
		margin: { left: 20, right: 20 },
		didParseCell: function (data) {
			// Colorir status
			if (data.column.index === 2 && data.cell.section === "body") {
				if (data.cell.text[0] === "ativa") {
					data.cell.styles.textColor = [34, 197, 94]; // Verde
				} else if (data.cell.text[0] === "inativa") {
					data.cell.styles.textColor = [239, 68, 68]; // Vermelho
				} else if (data.cell.text[0] === "pendente") {
					data.cell.styles.textColor = [245, 158, 11]; // Amarelo/Laranja
				}
			}
		},
	});

	// Rodapé
	const lastAutoTable = (doc as unknown as { lastAutoTable?: { finalY?: number } }).lastAutoTable;
	const finalY = lastAutoTable?.finalY ?? 200;
	if (finalY < pageHeight - 40) {
		doc.setFontSize(10);
		doc.setFont("helvetica", "italic");
		doc.text(
			"Relatório gerado automaticamente pelo sistema DroneFlow Admin",
			pageWidth / 2,
			pageHeight - 20,
			{ align: "center" },
		);
	}

	// Salvar o PDF
	const fileName = `Relatorio de Empresas - ${new Date().toISOString().split("T")[0]}.pdf`;
	doc.save(fileName);

	return fileName;
};