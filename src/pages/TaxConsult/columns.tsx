import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Badge } from "@/components/ui/badge";
import type { TaxGroupItem } from "@/services/tax";

const formatPercent = (v: number | null | undefined) => (v === null || v === undefined ? "-" : `${Number(v).toFixed(2)}%`);
const formatText = (v: string | null | undefined) => (v ? v : "-");

interface ColumnsProps {
  descricao: string;
  uf: string;
  onViewDetails: (item: TaxGroupItem) => void;
}

export const getColumns = ({ descricao, uf, onViewDetails }: ColumnsProps): ColumnDef<TaxGroupItem>[] => [
  {
    accessorKey: "tipo",
    header: "Descrição",
    cell: ({ row }) => (
      <div className="min-w-[200px]">
        <div className="font-medium text-slate-900">{descricao || formatText(row.original.tipo)}</div>
        {row.original.ncm && (
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="text-xs">
              NCM: {row.original.ncm}
            </Badge>
            {row.original.cest && (
              <Badge variant="outline" className="text-xs">
                CEST: {row.original.cest}
              </Badge>
            )}
          </div>
        )}
      </div>
    ),
  },
  {
    accessorKey: "piscofins",
    header: "PIS/COFINS",
    cell: ({ row }) => {
      const pis = row.original.piscofins;
      return (
        <div className="text-sm">
          <div className="font-medium">
            {formatText(pis?.cstEnt)} / {formatText(pis?.cstSai)}
          </div>
          <div className="text-xs text-muted-foreground">NRI: {formatText(pis?.nri)}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "icms",
    header: "ICMS",
    cell: ({ row }) => {
      const regraUF = row.original.regra?.find((r) => r.uf === uf) ?? row.original.regra?.[0] ?? null;
      return (
        <div className="text-sm">
          <div className="font-medium">
            {formatText(regraUF?.cst)} / {formatText(regraUF?.csosn)}
          </div>
          <div className="text-xs text-muted-foreground">Alíq: {formatPercent(regraUF?.aliqicms ?? null)}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "icmsst",
    header: "ICMS ST",
    cell: ({ row }) => {
      const regraUF = row.original.regra?.find((r) => r.uf === uf) ?? row.original.regra?.[0] ?? null;
      return <div className="text-sm font-medium">{formatPercent(regraUF?.aliqicmsst ?? null)}</div>;
    },
  },
  {
    accessorKey: "iva",
    header: "IVA",
    cell: ({ row }) => {
      const regraUF = row.original.regra?.find((r) => r.uf === uf) ?? row.original.regra?.[0] ?? null;
      return <div className="text-sm font-medium">{formatPercent(regraUF?.iva ?? null)}</div>;
    },
  },
  {
    accessorKey: "fcp",
    header: "FCP",
    cell: ({ row }) => {
      const regraUF = row.original.regra?.find((r) => r.uf === uf) ?? row.original.regra?.[0] ?? null;
      return <div className="text-sm font-medium">{formatPercent(regraUF?.fcp ?? null)}</div>;
    },
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => (
      <Button variant="ghost" size="sm" onClick={() => onViewDetails(row.original)} className="h-8 w-8 p-0">
        <Icon name="eye" size={16} />
      </Button>
    ),
  },
];
