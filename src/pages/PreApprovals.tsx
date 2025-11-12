import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/users/data-table";
import { createPendingColumns } from "@/components/preapprovals/columns";
import { PreApprovalDetailsModal } from "@/components/preapprovals/PreApprovalDetailsModal";
import { listPendingClients, approveClient, rejectClient, type Client } from "@/services/clients";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const PreApprovals = () => {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [clientToAction, setClientToAction] = useState<Client | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["pending-clients", currentPage, limit],
    queryFn: () => listPendingClients({ page: currentPage, limit }),
  });

  const clients: Client[] = data?.items ?? [];
  const total = data?.total ?? 0;
  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total, limit]);

  const approveMutation = useMutation({
    mutationFn: (tenantId: string) => approveClient(tenantId),
    onSuccess: () => {
      // Invalida todas as queries de pending-clients
      queryClient.invalidateQueries({ queryKey: ["pending-clients"] });
      // Também invalida a query de clients para atualizar a listagem principal
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast.success("Cadastro aprovado com sucesso!", {
        description: "O cliente foi notificado por e-mail.",
      });
      setIsApproveDialogOpen(false);
      setIsModalOpen(false);
      setClientToAction(null);
      // Se for o último item da página, volta para página 1
      if (clients.length === 1 && currentPage > 1) {
        setCurrentPage(1);
      }
    },
    onError: () => {
      toast.error("Erro ao aprovar cadastro", {
        description: "Tente novamente mais tarde.",
      });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (tenantId: string) => rejectClient(tenantId),
    onSuccess: () => {
      // Invalida todas as queries de pending-clients
      queryClient.invalidateQueries({ queryKey: ["pending-clients"] });
      toast.success("Cadastro rejeitado", {
        description: "O pré-cadastro foi removido do sistema.",
      });
      setIsRejectDialogOpen(false);
      setIsModalOpen(false);
      setClientToAction(null);
      // Se for o último item da página, volta para página 1
      if (clients.length === 1 && currentPage > 1) {
        setCurrentPage(1);
      }
    },
    onError: () => {
      toast.error("Erro ao rejeitar cadastro", {
        description: "Tente novamente mais tarde.",
      });
    },
  });

  const handleApprove = (client: Client) => {
    setClientToAction(client);
    setIsApproveDialogOpen(true);
  };

  const handleReject = (client: Client) => {
    setClientToAction(client);
    setIsRejectDialogOpen(true);
  };

  const handleView = (client: Client) => {
    setSelectedClient(client);
    setIsModalOpen(true);
  };

  const confirmApprove = () => {
    if (clientToAction) {
      approveMutation.mutate(clientToAction.tenantId);
    }
  };

  const confirmReject = () => {
    if (clientToAction) {
      rejectMutation.mutate(clientToAction.tenantId);
    }
  };

  const columns = createPendingColumns({
    onApprove: handleApprove,
    onReject: handleReject,
    onView: handleView,
  });

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <>
      <AppHeader title="Aprovação de Pré-Cadastros" showActionButton={false} />

      <div className="flex flex-1 flex-col gap-6 p-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold tracking-tight text-slate-800">Cadastros Pendentes</h2>
            {total > 0 && (
              <span className="bg-amber-100 text-amber-800 text-sm font-bold px-3 py-1 rounded-full border border-amber-300">
                {total} {total === 1 ? "pendente" : "pendentes"}
              </span>
            )}
          </div>
          <p className="text-slate-600">Revise e aprove os pré-cadastros realizados pelos clientes</p>
        </div>

        <div className="space-y-4">
          <DataTable columns={columns} data={clients} isLoading={isLoading} />

          <PreApprovalDetailsModal client={selectedClient} open={isModalOpen} onOpenChange={setIsModalOpen} onApprove={handleApprove} onReject={handleReject} />

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

      <AlertDialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold">Aprovar Cadastro</AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              Tem certeza que deseja aprovar o cadastro de <span className="font-bold text-slate-800">{clientToAction?.tenant.name}</span>?
              <br />
              <br />O cliente receberá um e-mail com as credenciais de acesso à plataforma.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmApprove} className="bg-green-600 hover:bg-green-700" disabled={approveMutation.isPending}>
              {approveMutation.isPending ? "Aprovando..." : "Aprovar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold">Rejeitar Cadastro</AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              Tem certeza que deseja rejeitar o cadastro de <span className="font-bold text-slate-800">{clientToAction?.tenant.name}</span>?
              <br />
              <br />
              Esta ação removerá permanentemente o pré-cadastro do sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmReject} className="bg-red-600 hover:bg-red-700" disabled={rejectMutation.isPending}>
              {rejectMutation.isPending ? "Rejeitando..." : "Rejeitar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default PreApprovals;
