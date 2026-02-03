import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CustomPagination } from "@/components/CustomPagination";
import type { IconName } from "@/components/ui/icon";

export interface ColumnDef<T> {
  key: keyof T | string;
  label: string;
  render?: (value: T[keyof T] | any, item: T) => ReactNode;
  className?: string;
}

export interface TableAction<T> {
  icon: IconName;
  label: string;
  onClick: (item: T) => void;
  variant?: "default" | "outline" | "destructive";
  className?: string;
}

interface Pagination {
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  limit?: number;
  total?: number;
}

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  actions?: TableAction<T>[];
  pagination?: Pagination;
  onPageChange?: (page: number) => void;
  onRowClick?: (item: T) => void;
  isLoading?: boolean;
  emptyIcon?: IconName;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  actions = [],
  pagination,
  onPageChange,
  onRowClick,
  isLoading = false,
  emptyIcon = "inbox" as IconName,
  emptyTitle = "Nenhum registro encontrado",
  emptyDescription = "Comece adicionando seu primeiro item",
}: DataTableProps<T>) {
  const handleRowClick = (item: T) => {
    onRowClick?.(item);
  };

  const handleActionClick = (e: React.MouseEvent, action: TableAction<T>, item: T) => {
    e.stopPropagation();
    action.onClick(item);
  };

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
        <Icon name={emptyIcon} size={48} className="mx-auto text-slate-300 mb-4" />
        <p className="text-slate-600 text-lg mb-2">{emptyTitle}</p>
        <p className="text-slate-500">{emptyDescription}</p>
      </div>
    );
  }

  return (
    <>
      <div className="hidden lg:block bg-white border border-slate-200 overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-gradient-to-r from-slate-200 to-slate-100">
            <TableRow className="hover:bg-transparent">
              {columns.map((column) => (
                <TableHead key={String(column.key)} className="text-slate-800 font-semibold">
                  {column.label}
                </TableHead>
              ))}
              {actions.length > 0 && <TableHead className="text-slate-800 font-semibold text-right">Ações</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id} className="border-b border-slate-100 hover:bg-slate-50 cursor-pointer" onClick={() => handleRowClick(item)}>
                {columns.map((column) => (
                  <TableCell key={String(column.key)} className={column.className || "text-slate-900"}>
                    {column.render ? column.render((item as any)[column.key as string], item) : String((item as any)[column.key as string] || "-")}
                  </TableCell>
                ))}
                {actions.length > 0 && (
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end gap-2">
                      {actions.map((action) => (
                        <Button key={action.label} onClick={(e) => handleActionClick(e, action, item)} size="sm" variant={action.variant || "outline"} className={action.className}>
                          <Icon name={action.icon} size={16} />
                        </Button>
                      ))}
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {pagination && onPageChange && (
          <div className="border-t border-slate-200 p-4">
            <CustomPagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={onPageChange} hasNextPage={pagination.hasNextPage} hasPreviousPage={pagination.hasPreviousPage} disabled={isLoading} />
          </div>
        )}
      </div>

      <div className="lg:hidden space-y-4">
        {data.map((item) => (
          <div key={item.id} className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleRowClick(item)}>
            <div className="space-y-3">
              <div className="flex flex-col gap-3">
                {columns.slice(0, 2).map((column) => (
                  <div key={String(column.key)}>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">{column.label}</p>
                    <p className="text-sm text-slate-900">{column.render ? column.render((item as any)[column.key as string], item) : String((item as any)[column.key as string] || "-")}</p>
                  </div>
                ))}
              </div>

              {columns.length > 2 && (
                <div className="text-sm text-slate-600 space-y-1">
                  {columns.slice(2, 4).map((column) => (
                    <p key={String(column.key)}>
                      <span className="font-semibold">{column.label}:</span> {column.render ? column.render((item as any)[column.key as string], item) : String((item as any)[column.key as string] || "-")}
                    </p>
                  ))}
                </div>
              )}

              {actions.length > 0 && (
                <div className="flex gap-2 pt-2" onClick={(e) => e.stopPropagation()}>
                  {actions.map((action) => (
                    <Button key={action.label} onClick={(e) => handleActionClick(e, action, item)} size="sm" variant={action.variant || "outline"} className={(action.className || "") + " flex-1"}>
                      <Icon name={action.icon} size={16} className="mr-1" />
                      {action.label}
                    </Button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {pagination && onPageChange && (
          <div className="bg-white rounded-lg p-4">
            <CustomPagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={onPageChange} hasNextPage={pagination.hasNextPage} hasPreviousPage={pagination.hasPreviousPage} disabled={isLoading} />
          </div>
        )}
      </div>
    </>
  );
}
