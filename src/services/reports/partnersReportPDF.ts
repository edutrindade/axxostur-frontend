import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Partner {
	id: number;
	name: string;
	city: string;
	state: string;
	status: string;
	joinDate: string;
	totalSales: string;
}

interface PartnersReportData {
	partnersData: { city: string; count: number }[];
	detailedPartnersData: Partner[];
	startDate: Date;
	endDate: Date;
}

export const generatePartnersReportPDF = (data: PartnersReportData) => {
	const doc = new jsPDF();
	const pageWidth = doc.internal.pageSize.width;
	const pageHeight = doc.internal.pageSize.height;

	// Cabeçalho do relatório
	doc.setFontSize(20);
	doc.setFont("helvetica", "bold");
	doc.text("Relatório de Parceiros", pageWidth / 2, 25, { align: "center" });

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

	const totalPartners = data.detailedPartnersData.length;
	const activePartners = data.detailedPartnersData.filter(
		(p) => p.status === "Ativo",
	).length;
	const inactivePartners = totalPartners - activePartners;

	doc.setFontSize(11);
	doc.setFont("helvetica", "normal");
	doc.text(`• Total de Parceiros: ${totalPartners}`, 25, 75);
	doc.text(
		`• Parceiros Ativos: ${activePartners} (${((activePartners / totalPartners) * 100).toFixed(1)}%)`,
		25,
		83,
	);
	doc.text(
		`• Parceiros Inativos: ${inactivePartners} (${((inactivePartners / totalPartners) * 100).toFixed(1)}%)`,
		25,
		91,
	);
	doc.text(`• Total de Vendas: R$ 292.500`, 25, 99);

	// Quantitativo por cidade/estado
	doc.setFontSize(14);
	doc.setFont("helvetica", "bold");
	doc.text("Quantitativo de Parceiros por Cidade", 20, 115);

	// Tabela de quantitativo por cidade
	autoTable(doc, {
		startY: 125,
		head: [["Cidade", "Quantidade de Parceiros", "Percentual"]],
		body: data.partnersData.map((item) => [
			item.city,
			item.count.toString(),
			`${(item.count / totalPartners).toFixed(1)}%`,
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
	doc.text("Detalhamento dos Parceiros", 20, 25);

	// Linha decorativa
	doc.setDrawColor(0, 102, 51);
	doc.setLineWidth(0.5);
	doc.line(20, 30, pageWidth - 20, 30);

	// Tabela detalhada dos parceiros
	autoTable(doc, {
		startY: 40,
		head: [
			["Nome", "Cidade/Estado", "Status", "Data de Ingresso", "Vendas Totais"],
		],
		body: data.detailedPartnersData.map((partner) => [
			partner.name,
			`${partner.city}/${partner.state}`,
			partner.status,
			new Date(partner.joinDate).toLocaleDateString("pt-BR"),
			partner.totalSales,
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
			}, // Vendas alinhadas à direita
		},
		margin: { left: 20, right: 20 },
		didParseCell: function (data) {
			// Colorir status
			if (data.column.index === 2 && data.cell.section === "body") {
				if (data.cell.text[0] === "Ativo") {
					data.cell.styles.textColor = [34, 197, 94]; // Verde
				} else if (data.cell.text[0] === "Inativo") {
					data.cell.styles.textColor = [239, 68, 68]; // Vermelho
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
	const fileName = `Relatorio de Parceiros - ${new Date().toISOString().split("T")[0]}.pdf`;
	doc.save(fileName);

	return fileName;
};
