import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icon } from "@/components/ui/icon";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { consultTax, type TaxConsultResponse, type TaxGroupItem } from "@/services/tax";

const MOCK_TENANT_ID = "fb4e7dcf-5c4f-4b87-9b36-5ace1e0ca2ae";
const MOCK_UF = ["MG"];

const formatPercent = (v: number | null | undefined) =>
  v === null || v === undefined ? "-" : `${Number(v).toFixed(2)}%`;

const formatNumber = (v: number | null | undefined) =>
  v === null || v === undefined ? "-" : Number(v).toFixed(2);

const formatText = (v: string | null | undefined) => (v ? v : "-");

export default function TaxConsultPage() {
  const [gtin, setGtin] = useState("");
  const [descricao, setDescricao] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<TaxConsultResponse | null>(null);
  const [detailsItem, setDetailsItem] = useState<TaxGroupItem | null>(null);

  const handleConsult = async () => {
    setError(null);
    setIsLoading(true);
    try {
      const data = await consultTax({
        codigoBarras: gtin.trim(),
        uf: MOCK_UF,
        tenantId: MOCK_TENANT_ID,
      });
      setResponse(data);
    } catch (e: any) {
      setError(e?.message ?? "Falha ao consultar cadastros fiscais");
    } finally {
      setIsLoading(false);
    }
  };

  const grupos = response?.grupo ?? [];

  return (
    <div className="space-y-6 px-6 md:px-8">
      <AppHeader title="Cadastros Fiscais" subtitle="Consulte o cadastro fiscal pelo GTIN" />

      <Card className="bg-white/95">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-slate-700 flex items-center gap-2">
            <Icon name="receipt" className="text-blue-600" /> Consulta fiscal
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="GTIN"
              placeholder="Digite o código de barras"
              value={gtin}
              leftIcon="qrCode"
              className="h-9 text-sm"
              onChange={(e) => setGtin(e.target.value)}
            />
            <div className="md:col-span-2">
              <Input
                label="Descrição"
                placeholder="Descrição do produto (opcional)"
                value={descricao}
                leftIcon="tag"
                className="h-9 text-sm"
                onChange={(e) => setDescricao(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <Button onClick={handleConsult} disabled={!gtin || isLoading} className="h-9">
              {isLoading ? (
                <span className="flex items-center gap-2"><Icon name="loader" className="animate-spin" />Consultando...</span>
              ) : (
                <span className="flex items-center gap-2"><Icon name="search" />Consultar</span>
              )}
            </Button>
            <Button variant="outline" className="h-9">
              <Icon name="download" /> Exportar
            </Button>
            {error && <span className="text-destructive text-sm">{error}</span>}
          </div>
        </CardContent>
      </Card>

      {grupos.length > 0 && (
        <Card className="bg-white/95">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-slate-700">Resultados</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="rounded-xl border overflow-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-white z-10 shadow-sm">
                  <TableRow>
                    <TableHead className="min-w-[18rem]">Descrição</TableHead>
                    <TableHead>NCM</TableHead>
                    <TableHead>CEST</TableHead>
                    <TableHead>PIS/COFINS</TableHead>
                    <TableHead>NRI</TableHead>
                    <TableHead>ICMS</TableHead>
                    <TableHead>ICMS ST</TableHead>
                    <TableHead>IVA</TableHead>
                    <TableHead>FCP</TableHead>
                    <TableHead>Detalhe</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {grupos.map((item, idx) => {
                    const regraUF = item.regra?.find((r) => r.uf === MOCK_UF[0]) ?? item.regra?.[0] ?? null;
                    return (
                      <TableRow key={`${item.codigo}-${idx}`} className="hover:bg-slate-50">
                        <TableCell className="text-sm text-slate-700">{descricao || formatText(item.tipo)}</TableCell>
                        <TableCell className="text-sm">{formatText(item.ncm)}</TableCell>
                        <TableCell className="text-sm">{formatText(item.cest)}</TableCell>
                        <TableCell className="text-sm">
                          {formatText(item.piscofins?.cstEnt)} / {formatText(item.piscofins?.cstSai)}
                        </TableCell>
                        <TableCell className="text-sm">{formatText(item.piscofins?.nri)}</TableCell>
                        <TableCell className="text-sm">
                          {formatText(regraUF?.cst)} / {formatText(regraUF?.csosn)}
                        </TableCell>
                        <TableCell className="text-sm">{formatPercent(regraUF?.aliqicmsst ?? null)}</TableCell>
                        <TableCell className="text-sm">{formatPercent(regraUF?.iva ?? null)}</TableCell>
                        <TableCell className="text-sm">{formatPercent(regraUF?.fcp ?? null)}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="icon" onClick={() => setDetailsItem(item)} aria-label="Detalhes">
                            <Icon name="search" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      <Dialog open={!!detailsItem} onOpenChange={(open) => !open && setDetailsItem(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {descricao ? descricao : `Produto ${gtin}`}
              <span className="ml-2 inline-flex items-center gap-1 rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                UF: {MOCK_UF[0]}
              </span>
            </DialogTitle>
          </DialogHeader>

          {detailsItem && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* PIS/COFINS */}
                <div>
                  <h3 className="font-medium mb-2">PIS/COFINS</h3>
                  <div className="space-y-1 text-sm">
                    <div>• CST Entrada: {formatText(detailsItem.piscofins?.cstEnt)}</div>
                    <div>• CST Saída: {formatText(detailsItem.piscofins?.cstSai)}</div>
                    <div>• Aliq. PIS: {formatPercent(detailsItem.piscofins?.aliqPIS ?? null)}</div>
                    <div>• Aliq. COFINS: {formatPercent(detailsItem.piscofins?.aliqCOFINS ?? null)}</div>
                    <div>• NRI: {formatText(detailsItem.piscofins?.nri)}</div>
                    <div>• Amparo legal: {formatText(detailsItem.piscofins?.ampLegal)}</div>
                  </div>
                </div>

                {/* IPI */}
                <div>
                  <h3 className="font-medium mb-2">IPI</h3>
                  <div className="space-y-1 text-sm">
                    <div>• CST Entrada: {formatText(detailsItem.ipi?.cstEnt)}</div>
                    <div>• CST Saída: {formatText(detailsItem.ipi?.cstSai)}</div>
                    <div>• Aliq. IPI: {formatPercent(detailsItem.ipi?.aliqIPI ?? null)}</div>
                    <div>• Código enquadramento: {formatText(detailsItem.ipi?.codenq)}</div>
                    <div>• EX: {formatText(detailsItem.ipi?.ex)}</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* ICMS - regra UF */}
                <div>
                  <h3 className="font-medium mb-2">ICMS (UF {MOCK_UF[0]})</h3>
                  {(() => {
                    const r = detailsItem.regra?.find((x) => x.uf === MOCK_UF[0]) ?? detailsItem.regra?.[0] ?? null;
                    return (
                      <div className="space-y-1 text-sm">
                        <div>• CST: {formatText(r?.cst)}</div>
                        <div>• CSOSN: {formatText(r?.csosn)}</div>
                        <div>• Aliq. ICMS: {formatPercent(r?.aliqicms ?? null)}</div>
                        <div>• Aliq. ICMS ST: {formatPercent(r?.aliqicmsst ?? null)}</div>
                        <div>• IVA: {formatPercent(r?.iva ?? null)}</div>
                        <div>• FCP: {formatPercent(r?.fcp ?? null)}</div>
                        <div>• CFOP Compra/Venda: {formatText(r?.cfopCompra?.toString() ?? null)} / {formatText(r?.cfopVenda?.toString() ?? null)}</div>
                        <div>• Amparo legal: {formatText(r?.ampLegal)}</div>
                      </div>
                    );
                  })()}
                </div>

                {/* CBS */}
                <div>
                  <h3 className="font-medium mb-2">CBS</h3>
                  <div className="space-y-1 text-sm">
                    <div>• Class. Trib.: {formatText(detailsItem.cbs?.cClassTrib)}</div>
                    <div>• CST: {formatText(detailsItem.cbs?.cst)}</div>
                    <div>• Aliquota: {formatPercent(detailsItem.cbs?.aliquota ?? null)}</div>
                    <div>• Redução: {formatPercent(detailsItem.cbs?.reducao ?? null)}</div>
                    <div>• Amparo legal: {formatText(detailsItem.cbs?.ampLegal)}</div>
                  </div>
                </div>
              </div>

              {/* IBS */}
              <div>
                <h3 className="font-medium mb-2">IBS (UF {MOCK_UF[0]})</h3>
                {(() => {
                  const r = detailsItem.regra?.find((x) => x.uf === MOCK_UF[0]) ?? detailsItem.regra?.[0] ?? null;
                  const ibs = r?.ibs ?? null;
                  return (
                    <div className="space-y-1 text-sm">
                      <div>• Class. Trib.: {formatText(ibs?.cClassTrib)}</div>
                      <div>• CST: {formatText(ibs?.cst)}</div>
                      <div>• IBS UF/Mun.: {formatPercent(ibs?.ibsUF ?? null)} / {formatPercent(ibs?.ibsMun ?? null)}</div>
                      <div>• Redução Aliq/B.C.: {formatPercent(ibs?.reducaoaliqIBS ?? null)} / {formatPercent(ibs?.reducaoBcIBS ?? null)}</div>
                      <div>• Amparo legal: {formatText(ibs?.ampLegal)}</div>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}