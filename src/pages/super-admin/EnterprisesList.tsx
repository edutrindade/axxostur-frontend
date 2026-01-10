import { useState } from "react";
import { useCompaniesQuery } from "@/hooks/useCompaniesQuery";
import { useCreateCompanyMutation, useUpdateCompanyMutation } from "@/hooks/useCompaniesMutations";
import { CompanyFormDialog } from "@/components/CompanyFormDialog";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { toast } from "sonner";
import type { Company, CreateCompanyRequest, UpdateCompanyRequest } from "@/services/companies";
import { formatCnpj, formatPhone } from "@/utils/format";

const EnterprisesList = () => {
  const { data: companies = [], isLoading, error } = useCompaniesQuery();
  const createMutation = useCreateCompanyMutation();
  const updateMutation = useUpdateCompanyMutation();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const handleCreate = (data: CreateCompanyRequest | UpdateCompanyRequest) => {
    if (selectedCompany) {
      updateMutation.mutate(
        { id: selectedCompany.id, data: data as UpdateCompanyRequest },
        {
          onSuccess: () => {
            toast.success("Empresa atualizada com sucesso");
            setSelectedCompany(null);
            setDialogOpen(false);
          },
          onError: () => {
            toast.error("Falha ao atualizar empresa");
          },
        }
      );
    } else {
      createMutation.mutate(data as CreateCompanyRequest, {
        onSuccess: () => {
          toast.success("Empresa criada com sucesso");
          setDialogOpen(false);
        },
        onError: () => {
          toast.error("Falha ao criar empresa");
        },
      });
    }
  };

  const handleEdit = (company: Company) => {
    setSelectedCompany(company);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedCompany(null);
    setDialogOpen(false);
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Empresas</h1>
            <p className="text-slate-600 mt-2">Gerencie todas as empresas registradas no sistema</p>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <p className="text-red-700">Falha ao carregar empresas. Por favor, tente novamente mais tarde.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Empresas</h1>
          <p className="text-slate-600 mt-2">Gerencie todas as empresas registradas no sistema</p>
        </div>
        <Button
          onClick={() => {
            setSelectedCompany(null);
            setDialogOpen(true);
          }}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
        >
          <Icon name="plus" size={18} className="mr-2" />
          Nova Empresa
        </Button>
      </div>

      <CompanyFormDialog
        open={dialogOpen}
        onOpenChange={handleCloseDialog}
        onSubmit={handleCreate}
        isLoading={createMutation.isPending || updateMutation.isPending}
        company={selectedCompany || undefined}
        title={selectedCompany ? "Editar Empresa" : "Criar Nova Empresa"}
        description={selectedCompany ? "Atualizar informações da empresa" : "Adicione uma nova empresa ao sistema"}
      />

      {isLoading ? (
        <div className="bg-white rounded-lg border border-slate-200 p-12 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : companies.length === 0 ? (
        <div className="bg-white rounded-lg border border-slate-200 p-12 text-center">
          <Icon name="building" size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-600 mb-4">Nenhuma empresa registrada ainda</p>
          <Button
            onClick={() => {
              setSelectedCompany(null);
              setDialogOpen(true);
            }}
            variant="outline"
          >
            Criar Primeira Empresa
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company) => {
            const colors = [company.primaryColor, company.secondaryColor, company.tertiaryColor].filter(Boolean);

            return (
              <div key={company.id} className="relative bg-white rounded-lg border border-slate-200 p-6 hover:shadow-md transition-shadow overflow-hidden">
                {colors.length > 0 && (
                  <div className="absolute top-0 right-0 flex gap-0">
                    {colors.map((color, index) => (
                      <div key={index} className="w-3 h-20" style={{ backgroundColor: color }} />
                    ))}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">{company.name}</h3>
                    <p className="text-sm text-slate-600">{company.fantasyName}</p>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-slate-700">
                      <span className="font-medium mr-2 w-20">CNPJ:</span>
                      <span className="text-slate-600">{formatCnpj(company.cnpj)}</span>
                    </div>
                    <div className="flex items-center text-slate-700">
                      <span className="font-medium mr-2 w-20">Email:</span>
                      <span className="text-slate-600">{company.email}</span>
                    </div>
                    <div className="flex items-center text-slate-700">
                      <span className="font-medium mr-2 w-20">Telefone:</span>
                      <span className="text-slate-600">{formatPhone(company.phone)}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200 flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(company)} className="flex-1">
                      <Icon name="edit" size={16} className="mr-1" />
                      Editar
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Icon name="info" size={16} className="mr-1" />
                      Ver Informações
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EnterprisesList;
