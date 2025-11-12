import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icon } from "@/components/ui/icon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/users/data-table";
import { consultTax, type TaxConsultResponse, type TaxGroupItem } from "@/services/tax";
import { useAuth } from "@/hooks/useAuth";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";
import { getColumns } from "./TaxConsult/columns";
import * as XLSX from "xlsx";

const MOCK_UF = ["MG"];

const formatPercent = (v: number | null | undefined) => (v === null || v === undefined ? "-" : `${Number(v).toFixed(2)}%`);

const formatText = (v: string | null | undefined) => (v ? v : "-");

export default function TaxConsultPage() {
  const { tenantId } = useAuth();
  const isMobile = useIsMobile();
  const [gtin, setGtin] = useState("");
  const [descricao, setDescricao] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<TaxConsultResponse | null>(null);
  const [detailsItem, setDetailsItem] = useState<TaxGroupItem | null>(null);

  const isGtinValid = gtin.trim().length >= 8 && gtin.trim().length <= 14;
  const isDescricaoValid = descricao.trim().length >= 3;
  const isFormValid = isGtinValid && isDescricaoValid;

  const handleConsult = async () => {
    if (!tenantId) {
      toast.error("Erro de autenticação", {
        description: "Tenant ID não encontrado. Faça login novamente.",
      });
      return;
    }

    if (!isFormValid) {
      toast.error("Dados inválidos", {
        description: "Preencha todos os campos corretamente antes de consultar.",
      });
      return;
    }

    setResponse(null);
    setIsLoading(true);

    try {
      const data = await consultTax({
        codigoBarras: gtin.trim(),
        uf: MOCK_UF,
        tenantId,
      });

      if (!data.grupo || data.grupo.length === 0) {
        toast.error("Nenhum resultado encontrado", {
          description: "Não foram encontrados cadastros fiscais para o GTIN informado.",
        });
        setResponse(data);
      } else {
        toast.success("Consulta realizada com sucesso", {
          description: `${data.grupo.length} cadastro(s) fiscal(is) encontrado(s).`,
        });
        setResponse(data);
      }
    } catch (e: any) {
      const errorMessage = e?.response?.data?.message || e?.message || "Falha ao consultar cadastros fiscais";
      toast.error("Erro na consulta", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportToExcel = () => {
    if (!grupos || grupos.length === 0) {
      toast.error("Nenhum dado para exportar", {
        description: "Realize uma consulta primeiro.",
      });
      return;
    }

    try {
      const exportData = grupos.map((item) => {
        const regraUF = item.regra?.find((r) => r.uf === MOCK_UF[0]) ?? item.regra?.[0] ?? null;
        const ibs = regraUF?.ibs ?? null;

        return {
          Descrição: descricao || formatText(item.tipo),
          NCM: formatText(item.ncm),
          CEST: formatText(item.cest),
          Código: formatText(item.codigo?.toString() ?? null),

          // PIS/COFINS
          "CST Entrada (PIS/COFINS)": formatText(item.piscofins?.cstEnt),
          "CST Saída (PIS/COFINS)": formatText(item.piscofins?.cstSai),
          "Alíq. PIS": formatPercent(item.piscofins?.aliqPIS ?? null),
          "Alíq. COFINS": formatPercent(item.piscofins?.aliqCOFINS ?? null),
          "NRI (PIS/COFINS)": formatText(item.piscofins?.nri),
          "Amparo Legal (PIS/COFINS)": formatText(item.piscofins?.ampLegal),
          "Data Vigência Início (PIS/COFINS)": formatText(item.piscofins?.dtVigIni),
          "Data Vigência Fim (PIS/COFINS)": formatText(item.piscofins?.dtVigFin),

          // IPI
          "CST Entrada (IPI)": formatText(item.ipi?.cstEnt),
          "CST Saída (IPI)": formatText(item.ipi?.cstSai),
          "Alíq. IPI": formatPercent(item.ipi?.aliqIPI ?? null),
          "Cód. Enquadramento (IPI)": formatText(item.ipi?.codenq),
          "EX (IPI)": formatText(item.ipi?.ex),

          // ICMS
          UF: MOCK_UF[0],
          "CST (ICMS)": formatText(regraUF?.cst),
          "CSOSN (ICMS)": formatText(regraUF?.csosn),
          "Alíq. ICMS": formatPercent(regraUF?.aliqicms ?? null),
          "Alíq. ICMS ST": formatPercent(regraUF?.aliqicmsst ?? null),
          IVA: formatPercent(regraUF?.iva ?? null),
          FCP: formatPercent(regraUF?.fcp ?? null),
          "CFOP Compra": formatText(regraUF?.cfopCompra?.toString() ?? null),
          "CFOP Venda": formatText(regraUF?.cfopVenda?.toString() ?? null),
          "Amparo Legal (ICMS)": formatText(regraUF?.ampLegal),

          // CBS
          "Class. Trib. (CBS)": formatText(item.cbs?.cClassTrib),
          "CST (CBS)": formatText(item.cbs?.cst),
          "Alíquota (CBS)": formatPercent(item.cbs?.aliquota ?? null),
          "Redução (CBS)": formatPercent(item.cbs?.reducao ?? null),
          "Amparo Legal (CBS)": formatText(item.cbs?.ampLegal),

          // IBS
          "Class. Trib. (IBS)": formatText(ibs?.cClassTrib),
          "CST (IBS)": formatText(ibs?.cst),
          "IBS UF": formatPercent(ibs?.ibsUF ?? null),
          "IBS Município": formatPercent(ibs?.ibsMun ?? null),
          "Redução Alíq. (IBS)": formatPercent(ibs?.reducaoaliqIBS ?? null),
          "Redução B.C. (IBS)": formatPercent(ibs?.reducaoBcIBS ?? null),
          "Amparo Legal (IBS)": formatText(ibs?.ampLegal),
        };
      });

      const worksheet = XLSX.utils.json_to_sheet(exportData);

      // Ajustar largura das colunas
      const columnWidths = [
        { wch: 30 }, // Descrição
        { wch: 12 }, // NCM
        { wch: 12 }, // CEST
        { wch: 15 }, // Código
        { wch: 20 }, // CST Entrada (PIS/COFINS)
        { wch: 20 }, // CST Saída (PIS/COFINS)
        { wch: 12 }, // Alíq. PIS
        { wch: 12 }, // Alíq. COFINS
        { wch: 20 }, // NRI
        { wch: 50 }, // Amparo Legal (PIS/COFINS)
        { wch: 15 }, // Data Início
        { wch: 15 }, // Data Fim
        { wch: 20 }, // CST Entrada (IPI)
        { wch: 20 }, // CST Saída (IPI)
        { wch: 12 }, // Alíq. IPI
        { wch: 20 }, // Cód. Enquadramento
        { wch: 10 }, // EX
        { wch: 8 }, // UF
        { wch: 15 }, // CST (ICMS)
        { wch: 15 }, // CSOSN (ICMS)
        { wch: 12 }, // Alíq. ICMS
        { wch: 12 }, // Alíq. ICMS ST
        { wch: 12 }, // IVA
        { wch: 12 }, // FCP
        { wch: 15 }, // CFOP Compra
        { wch: 15 }, // CFOP Venda
        { wch: 50 }, // Amparo Legal (ICMS)
        { wch: 20 }, // Class. Trib. (CBS)
        { wch: 15 }, // CST (CBS)
        { wch: 12 }, // Alíquota (CBS)
        { wch: 12 }, // Redução (CBS)
        { wch: 50 }, // Amparo Legal (CBS)
        { wch: 20 }, // Class. Trib. (IBS)
        { wch: 15 }, // CST (IBS)
        { wch: 12 }, // IBS UF
        { wch: 12 }, // IBS Município
        { wch: 15 }, // Redução Alíq. (IBS)
        { wch: 15 }, // Redução B.C. (IBS)
        { wch: 50 }, // Amparo Legal (IBS)
      ];
      worksheet["!cols"] = columnWidths;

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Cadastros Fiscais");

      const fileName = `cadastros_fiscais_${gtin}_${new Date().toISOString().split("T")[0]}.xlsx`;
      XLSX.writeFile(workbook, fileName);

      toast.success("Exportação concluída!", {
        description: `Arquivo ${fileName} foi baixado com sucesso.`,
      });
    } catch (error) {
      console.error("Erro ao exportar:", error);
      toast.error("Erro ao exportar", {
        description: "Não foi possível gerar o arquivo Excel.",
      });
    }
  };

  const grupos = response?.grupo ?? [];

  const columns = getColumns({
    descricao,
    uf: MOCK_UF[0],
    onViewDetails: setDetailsItem,
  });

  return (
    // <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
    // <div className="space-y-6 px-6 md:px-8 py-8">
    <>
      <AppHeader title="Cadastros Fiscais" subtitle="Consulte informações tributárias completas pelo GTIN" />

      <Card className="border-2 border-blue-100 bg-gradient-to-br from-white via-blue-50/20 to-white shadow-lg mt-4">
        <CardHeader className="pb-4 space-y-1">
          <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-md">
              <Icon name="search" className="text-white" size={20} />
            </div>
            Consulta Fiscal
          </CardTitle>
          <p className="text-sm text-slate-600">Pesquise por GTIN (Código de Barras) e obtenha as informações tributárias detalhadas.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Input label="GTIN *" placeholder="Código de 8 a 14 dígitos" value={gtin} leftIcon="qrCode" className="h-10 text-sm border-slate-300 focus:border-blue-500 focus:ring-blue-500" onChange={(e) => setGtin(e.target.value.replace(/\D/g, ""))} maxLength={14} />
              {gtin && !isGtinValid && <span className="text-xs text-destructive mt-1 flex items-center gap-1">GTIN deve ter entre 8 e 14 dígitos</span>}
            </div>
            <div className="md:col-span-2">
              <Input label="Descrição *" placeholder="Mínimo 3 caracteres" value={descricao} leftIcon="tag" className="h-10 text-sm border-slate-300 focus:border-blue-500 focus:ring-blue-500" onChange={(e) => setDescricao(e.target.value)} />
              {descricao && !isDescricaoValid && <span className="text-xs text-destructive mt-1 flex items-center gap-1">Descrição deve ter no mínimo 3 caracteres</span>}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button onClick={handleConsult} disabled={!isFormValid || isLoading} className="h-10 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md">
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Icon name="refresh" className="animate-spin" />
                  Consultando...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Icon name="search" />
                  Consultar
                </span>
              )}
            </Button>
            {grupos.length > 0 && (
              <>
                <Button variant="outline" className="h-10 border-green-300 hover:bg-green-50 hover:border-green-400 text-green-700 hover:text-green-800" onClick={handleExportToExcel}>
                  <Icon name="download" /> Exportar Excel
                </Button>
                <Badge variant="secondary" className="ml-auto bg-blue-100 text-blue-800 border-blue-200">
                  {grupos.length} resultado{grupos.length !== 1 ? "s" : ""} encontrado{grupos.length !== 1 ? "s" : ""}
                </Badge>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {grupos.length > 0 && (
        <Card className="border-2 border-blue-100 bg-white shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-green-500 to-green-600 shadow-md">
                    <Icon name="check" className="text-white" size={20} />
                  </div>
                  Resultados da Consulta
                </CardTitle>
                <p className="text-sm text-slate-600 mt-1">Informações tributárias para o GTIN consultado</p>
              </div>
              <Badge className="bg-green-100 text-green-800 border-green-200 text-base px-4 py-2">
                {grupos.length} {grupos.length === 1 ? "registro" : "registros"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {isMobile ? (
              <div className="space-y-4">
                {grupos.map((item, idx) => {
                  const regraUF = item.regra?.find((r) => r.uf === MOCK_UF[0]) ?? item.regra?.[0] ?? null;
                  return (
                    <Card key={`${item.codigo}-${idx}`} className="border-2 border-slate-200 hover:border-blue-300 transition-colors">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <CardTitle className="text-base font-bold text-slate-900 leading-tight">{descricao || formatText(item.tipo)}</CardTitle>
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                              {item.ncm && (
                                <Badge variant="outline" className="text-xs">
                                  NCM: {item.ncm}
                                </Badge>
                              )}
                              {item.cest && (
                                <Badge variant="outline" className="text-xs">
                                  CEST: {item.cest}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => setDetailsItem(item)} className="h-8 w-8 p-0 shrink-0">
                            <Icon name="eye" size={16} />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3 pt-0">
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-slate-600 text-xs block mb-1">PIS/COFINS</span>
                            <span className="font-medium text-slate-900">
                              {formatText(item.piscofins?.cstEnt)} / {formatText(item.piscofins?.cstSai)}
                            </span>
                            <div className="text-xs text-muted-foreground mt-0.5">NRI: {formatText(item.piscofins?.nri)}</div>
                          </div>
                          <div>
                            <span className="text-slate-600 text-xs block mb-1">ICMS</span>
                            <span className="font-medium text-slate-900">
                              {formatText(regraUF?.cst)} / {formatText(regraUF?.csosn)}
                            </span>
                            <div className="text-xs text-muted-foreground mt-0.5">Alíq: {formatPercent(regraUF?.aliqicms ?? null)}</div>
                          </div>
                        </div>
                        <Separator />
                        <div className="grid grid-cols-3 gap-3 text-sm">
                          <div>
                            <span className="text-slate-600 text-xs block mb-1">ICMS ST</span>
                            <span className="font-medium text-blue-700">{formatPercent(regraUF?.aliqicmsst ?? null)}</span>
                          </div>
                          <div>
                            <span className="text-slate-600 text-xs block mb-1">IVA</span>
                            <span className="font-medium text-blue-700">{formatPercent(regraUF?.iva ?? null)}</span>
                          </div>
                          <div>
                            <span className="text-slate-600 text-xs block mb-1">FCP</span>
                            <span className="font-medium text-blue-700">{formatPercent(regraUF?.fcp ?? null)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <DataTable columns={columns} data={grupos} isLoading={isLoading} />
            )}
          </CardContent>
        </Card>
      )}

      <Dialog open={!!detailsItem} onOpenChange={(open) => !open && setDetailsItem(null)}>
        <DialogContent className="max-w-[90vw] lg:max-w-7xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="space-y-3 pb-6 border-b">
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <DialogTitle className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-md">
                    <Icon name="receipt" className="text-white" size={22} />
                  </div>
                  {descricao || `Produto ${gtin}`}
                </DialogTitle>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-sm px-3 py-1">UF: {MOCK_UF[0]}</Badge>
                  {detailsItem?.ncm && (
                    <Badge variant="outline" className="text-sm px-3 py-1">
                      NCM: {detailsItem.ncm}
                    </Badge>
                  )}
                  {detailsItem?.cest && (
                    <Badge variant="outline" className="text-sm px-3 py-1">
                      CEST: {detailsItem.cest}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </DialogHeader>

          {detailsItem && (
            <div className="space-y-6 pt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border-2 border-purple-100 bg-gradient-to-br from-purple-50/50 to-white shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-bold text-purple-900 flex items-center gap-2">
                      <Icon name="percent" className="text-purple-600" size={20} />
                      PIS/COFINS
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">CST Entrada:</span>
                      <span className="font-medium text-slate-900">{formatText(detailsItem.piscofins?.cstEnt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">CST Saída:</span>
                      <span className="font-medium text-slate-900">{formatText(detailsItem.piscofins?.cstSai)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-slate-600">Alíq. PIS:</span>
                      <span className="font-medium text-purple-700">{formatPercent(detailsItem.piscofins?.aliqPIS ?? null)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Alíq. COFINS:</span>
                      <span className="font-medium text-purple-700">{formatPercent(detailsItem.piscofins?.aliqCOFINS ?? null)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-slate-600">NRI:</span>
                      <span className="font-medium text-slate-900">{formatText(detailsItem.piscofins?.nri)}</span>
                    </div>
                    {detailsItem.piscofins?.ampLegal && (
                      <div className="pt-2 text-xs text-slate-600 bg-purple-50 p-2 rounded border border-purple-100">
                        <strong>Amparo legal:</strong> {detailsItem.piscofins.ampLegal}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-2 border-orange-100 bg-gradient-to-br from-orange-50/50 to-white shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-bold text-orange-900 flex items-center gap-2">
                      <Icon name="package" className="text-orange-600" size={20} />
                      IPI
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">CST Entrada:</span>
                      <span className="font-medium text-slate-900">{formatText(detailsItem.ipi?.cstEnt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">CST Saída:</span>
                      <span className="font-medium text-slate-900">{formatText(detailsItem.ipi?.cstSai)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-slate-600">Alíq. IPI:</span>
                      <span className="font-medium text-orange-700">{formatPercent(detailsItem.ipi?.aliqIPI ?? null)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-slate-600">Cód. enquadramento:</span>
                      <span className="font-medium text-slate-900">{formatText(detailsItem.ipi?.codenq)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">EX:</span>
                      <span className="font-medium text-slate-900">{formatText(detailsItem.ipi?.ex)}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-2 border-blue-100 bg-gradient-to-br from-blue-50/50 to-white shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-bold text-blue-900 flex items-center gap-2">
                      <Icon name="barChart" className="text-blue-600" size={20} />
                      ICMS (UF {MOCK_UF[0]})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    {(() => {
                      const r = detailsItem.regra?.find((x) => x.uf === MOCK_UF[0]) ?? detailsItem.regra?.[0] ?? null;
                      return (
                        <>
                          <div className="flex justify-between">
                            <span className="text-slate-600">CST:</span>
                            <span className="font-medium text-slate-900">{formatText(r?.cst)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">CSOSN:</span>
                            <span className="font-medium text-slate-900">{formatText(r?.csosn)}</span>
                          </div>
                          <Separator />
                          <div className="flex justify-between">
                            <span className="text-slate-600">Alíq. ICMS:</span>
                            <span className="font-medium text-blue-700">{formatPercent(r?.aliqicms ?? null)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">Alíq. ICMS ST:</span>
                            <span className="font-medium text-blue-700">{formatPercent(r?.aliqicmsst ?? null)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">IVA:</span>
                            <span className="font-medium text-blue-700">{formatPercent(r?.iva ?? null)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">FCP:</span>
                            <span className="font-medium text-blue-700">{formatPercent(r?.fcp ?? null)}</span>
                          </div>
                          <Separator />
                          <div className="flex justify-between">
                            <span className="text-slate-600">CFOP Compra:</span>
                            <span className="font-medium text-slate-900">{formatText(r?.cfopCompra?.toString() ?? null)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-600">CFOP Venda:</span>
                            <span className="font-medium text-slate-900">{formatText(r?.cfopVenda?.toString() ?? null)}</span>
                          </div>
                          {r?.ampLegal && (
                            <div className="pt-2 text-xs text-slate-600 bg-blue-50 p-2 rounded border border-blue-100">
                              <strong>Amparo legal:</strong> {r.ampLegal}
                            </div>
                          )}
                        </>
                      );
                    })()}
                  </CardContent>
                </Card>

                <Card className="border-2 border-green-100 bg-gradient-to-br from-green-50/50 to-white shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg font-bold text-green-900 flex items-center gap-2">
                      <Icon name="trending" className="text-green-600" size={20} />
                      CBS
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Class. Trib.:</span>
                      <span className="font-medium text-slate-900">{formatText(detailsItem.cbs?.cClassTrib)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">CST:</span>
                      <span className="font-medium text-slate-900">{formatText(detailsItem.cbs?.cst)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-slate-600">Alíquota:</span>
                      <span className="font-medium text-green-700">{formatPercent(detailsItem.cbs?.aliquota ?? null)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Redução:</span>
                      <span className="font-medium text-green-700">{formatPercent(detailsItem.cbs?.reducao ?? null)}</span>
                    </div>
                    {detailsItem.cbs?.ampLegal && (
                      <div className="pt-2 text-xs text-slate-600 bg-green-50 p-2 rounded border border-green-100">
                        <strong>Amparo legal:</strong> {detailsItem.cbs.ampLegal}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <Card className="border-2 border-indigo-100 bg-gradient-to-br from-indigo-50/50 to-white shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg font-bold text-indigo-900 flex items-center gap-2">
                    <Icon name="percent" className="text-indigo-600" size={20} />
                    IBS (UF {MOCK_UF[0]})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  {(() => {
                    const r = detailsItem.regra?.find((x) => x.uf === MOCK_UF[0]) ?? detailsItem.regra?.[0] ?? null;
                    const ibs = r?.ibs ?? null;
                    return (
                      <>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Class. Trib.:</span>
                          <span className="font-medium text-slate-900">{formatText(ibs?.cClassTrib)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">CST:</span>
                          <span className="font-medium text-slate-900">{formatText(ibs?.cst)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-slate-600">IBS UF:</span>
                          <span className="font-medium text-indigo-700">{formatPercent(ibs?.ibsUF ?? null)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">IBS Município:</span>
                          <span className="font-medium text-indigo-700">{formatPercent(ibs?.ibsMun ?? null)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-slate-600">Redução Alíq.:</span>
                          <span className="font-medium text-indigo-700">{formatPercent(ibs?.reducaoaliqIBS ?? null)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Redução B.C.:</span>
                          <span className="font-medium text-indigo-700">{formatPercent(ibs?.reducaoBcIBS ?? null)}</span>
                        </div>
                        {ibs?.ampLegal && (
                          <div className="pt-2 text-xs text-slate-600 bg-indigo-50 p-2 rounded border border-indigo-100">
                            <strong>Amparo legal:</strong> {ibs.ampLegal}
                          </div>
                        )}
                      </>
                    );
                  })()}
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
