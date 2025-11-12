import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { DataTable } from "@/components/users/data-table";
import { createColumns } from "@/components/tenants/columns";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { TenantForm } from "@/components/tenants/TenantForm";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { listTenants, type Tenant } from "@/services/tenants";

const Tenants = () => {
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(20);

  const { data = { items: [], total: 0, page: 1, limit: 20 }, isLoading } = useQuery({
    queryKey: ["tenants", currentPage, limit],
    queryFn: () => listTenants({ page: currentPage, limit }),
  });

  const tenants: Tenant[] = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total, limit]);

  useEffect(() => {}, []);

  const columns = createColumns({
    onEdit: (tenant) => {
      setSelectedTenant(tenant);
      setIsSheetOpen(true);
    },
  });

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const TenantCard = ({ tenant }: { tenant: Tenant }) => (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">{tenant.fantasyName || tenant.name}</h3>
            <Badge variant={tenant.active ? "default" : "secondary"}>{tenant.active ? "Ativa" : "Inativa"}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">CNPJ: {tenant.cnpj}</p>
          {tenant.contactName && <p className="text-sm text-muted-foreground">Contato: {tenant.contactName}</p>}
          {tenant.contactPhone && <p className="text-sm text-muted-foreground">Telefone: {tenant.contactPhone}</p>}
          <p className="text-xs text-muted-foreground">Criada em: {new Date(tenant.createdAt).toLocaleDateString("pt-BR")}</p>
        </div>
      </div>
    </Card>
  );

  return (
    <>
      <AppHeader title="Empresas" showActionButton={false} />

      <div className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <div className="ml-auto flex items-center gap-3">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <Button
              size="sm"
              className="bg-primary hover:bg-primary/90"
              onClick={() => {
                setSelectedTenant(null);
                setIsSheetOpen(true);
              }}
            >
              <Icon name="plus" size={20} className="mr-2 text-white" />
              <span className="text-white font-bold text-md">Nova Empresa</span>
            </Button>
            <SheetContent className="min-w-[400px] sm:min-w-[540px] p-4">
              <SheetHeader>
                <SheetTitle className="text-xl">{selectedTenant ? "Editar Empresa" : "Cadastrar Nova Empresa"}</SheetTitle>
                <SheetDescription>{selectedTenant ? "Atualize os dados da empresa." : "Preencha os dados para cadastrar uma nova empresa."}</SheetDescription>
              </SheetHeader>
              <TenantForm
                initialData={selectedTenant ?? undefined}
                onSuccess={() => {
                  setIsSheetOpen(false);
                  setSelectedTenant(null);
                  queryClient.invalidateQueries({ queryKey: ["tenants"] });
                }}
              />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-6 p-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">Lista de Empresas</h2>
          <p className="text-slate-600">Gerencie as empresas (tenants) cadastradas</p>
        </div>

        <div className="space-y-4">
          {isMobile ? (
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : tenants.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Nenhuma empresa encontrada</p>
                </div>
              ) : (
                tenants.map((tenant) => (
                  <div key={tenant.id} className="space-y-2">
                    <TenantCard tenant={tenant} />
                    <div className="flex justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-auto"
                        onClick={() => {
                          setSelectedTenant(tenant);
                          setIsSheetOpen(true);
                        }}
                      >
                        <Icon name="edit" size={16} className="mr-2" /> Editar
                      </Button>
                    </div>
                  </div>
                ))
              )}

              {!isLoading && totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                    <Icon name="chevronLeft" size={16} />
                  </Button>
                  <span className="text-sm text-muted-foreground px-2">
                    {currentPage} de {totalPages}
                  </span>
                  <Button variant="outline" size="sm" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                    <Icon name="chevronRight" size={16} />
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <>
              <DataTable columns={columns} data={tenants} isLoading={isLoading} />
              {!isLoading && totalPages > 1 && (
                <div className="flex items-center justify-between px-6 py-6 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl border-2 border-slate-200 shadow-sm">
                  <div className="flex items-center space-x-3">
                    <p className="text-sm font-bold text-slate-800">Itens por página</p>
                    <select
                      value={limit}
                      onChange={(e) => {
                        setLimit(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                      className="h-10 w-[100px] rounded-lg border-2 border-slate-300 bg-white px-3 py-2 text-sm font-bold text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 hover:border-slate-400 transition-colors"
                    >
                      {[10, 20, 30, 40, 50].map((pageSize) => (
                        <option key={pageSize} value={pageSize}>
                          {pageSize}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex w-[180px] items-center justify-center text-sm font-bold text-slate-800">
                    Página {currentPage} de {totalPages}
                  </div>
                  <div className="flex items-center space-x-3">
                    <Button variant="outline" className="h-10 w-10 p-0" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                      <Icon name="chevronLeft" size={18} />
                    </Button>
                    <Button variant="outline" className="h-10 w-10 p-0" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                      <Icon name="chevronRight" size={18} />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Tenants;
