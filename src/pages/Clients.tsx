import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/users/data-table";
import { createColumns } from "@/components/clients/columns";
import { ClientDetailsModal } from "@/components/clients/ClientDetailsModal";
import { listClients, type Client } from "@/services/clients";

const Clients = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["clients", currentPage, limit],
    queryFn: () => listClients({ page: currentPage, limit }),
  });

  // Filtrar apenas clientes aprovados
  const clients: Client[] = (data?.items ?? []).filter((client) => client.tenant.approved === true);
  const total = clients.length; // Total de clientes aprovados filtrados
  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total, limit]);

  const columns = createColumns({
    onEdit: (client) => {
      setSelectedClient(client);
      setIsModalOpen(true);
    },
    onView: (client) => {
      setSelectedClient(client);
      setIsModalOpen(true);
    },
  });

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <>
      <AppHeader title="Clientes" showActionButton={false} />

      <div className="flex flex-1 flex-col gap-6 p-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold tracking-tight text-slate-800">Empresas Cadastradas</h2>
            {total > 0 && (
              <span className="bg-blue-100 text-blue-800 text-sm font-bold px-3 py-1 rounded-full border border-blue-300">
                {total} {total === 1 ? "empresa" : "empresas"}
              </span>
            )}
          </div>
          <p className="text-slate-600">Gerencie as informações das empresas cadastradas</p>
        </div>

        <div className="space-y-4">
          <DataTable columns={columns} data={clients} isLoading={isLoading} />

          <ClientDetailsModal client={selectedClient} open={isModalOpen} onOpenChange={setIsModalOpen} />

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
                  className="border border-slate-300 rounded-lg px-2 py-1"
                >
                  {[10, 20, 50].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                  Anterior
                </Button>
                <span className="px-3 py-1 text-slate-700 font-semibold">
                  {currentPage} / {totalPages}
                </span>
                <Button variant="outline" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                  Próximo
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Clients;
