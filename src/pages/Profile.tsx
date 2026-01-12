import { useState, useEffect } from "react";
import { useProfileQuery, useProfileMutation } from "@/hooks/useProfileMutation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icon } from "@/components/ui/icon";
import { toast } from "sonner";

const Profile = () => {
  const { data: profile, isLoading } = useProfileQuery();
  const updateMutation = useProfileMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    cpf: "",
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name,
        phone: profile.phone,
        cpf: profile.cpf,
      });
    }
  }, [profile]);

  const getRoleLabel = (role: string) => {
    const roles: Record<string, string> = {
      super_admin: "Administrador Geral",
      admin: "Administrador",
      attendant: "Funcionário",
    };
    return roles[role] || role;
  };

  const formatPhone = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    const match = cleaned.match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
    if (!match) return value;
    const [, part1, part2, part3] = match;
    if (part3) return `(${part1}) ${part2}-${part3}`;
    if (part2) return `(${part1}) ${part2}`;
    if (part1) return `(${part1}`;
    return "";
  };

  const formatCPF = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    const match = cleaned.match(/(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2})/);
    if (!match) return value;
    const [, part1, part2, part3, part4] = match;
    if (part4) return `${part1}.${part2}.${part3}-${part4}`;
    if (part3) return `${part1}.${part2}.${part3}`;
    if (part2) return `${part1}.${part2}`;
    if (part1) return `${part1}`;
    return "";
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setFormData({ ...formData, phone: formatted });
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setFormData({ ...formData, cpf: formatted });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const cleanPhone = formData.phone.replace(/\D/g, "");
      const cleanCPF = formData.cpf.replace(/\D/g, "");

      await updateMutation.mutateAsync({
        name: formData.name,
        phone: cleanPhone,
        cpf: cleanCPF,
      });
      setIsEditing(false);
      toast.success("Perfil atualizado com sucesso!");
    } catch (error) {
      toast.error("Erro ao atualizar perfil");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <svg className="animate-spin h-8 w-8 text-primary mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-muted-foreground">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Erro ao carregar perfil</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Meu Perfil</h1>
        <p className="text-slate-600 mt-2">Visualize e atualize suas informações pessoais</p>
      </div>

      <div className="max-w-2xl">
        <div
          className="rounded-2xl shadow-lg p-8 text-white mb-6 relative overflow-hidden"
          style={{
            background: profile.company.primaryColor && profile.company.secondaryColor ? `linear-gradient(135deg, ${profile.company.primaryColor} 0%, ${profile.company.secondaryColor} 100%)` : "linear-gradient(to bottom right, rgb(37, 99, 235), rgb(59, 130, 246))",
          }}
        >
          <div className="absolute top-4 right-4 opacity-10">
            <Icon name="users" size={120} />
          </div>

          <div className="relative z-10">
            <div className="mb-6">
              <h2 className="text-3xl font-bold mb-1">{profile.name}</h2>
              <p className="text-blue-100">{getRoleLabel(profile.role)}</p>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-blue-400">
              <div>
                <p className="text-blue-100 text-sm mb-1">Email</p>
                <p className="font-medium text-lg">{profile.email}</p>
              </div>
              <div>
                <p className="text-blue-100 text-sm mb-1">Telefone</p>
                <p className="font-medium text-lg">{formatPhone(profile.phone)}</p>
              </div>
              <div>
                <p className="text-blue-100 text-sm mb-1">CPF</p>
                <p className="font-medium text-lg">{formatCPF(profile.cpf)}</p>
              </div>
              <div>
                <p className="text-blue-100 text-sm mb-1">Empresa</p>
                <p className="font-medium text-lg">{profile.company.fantasyName}</p>
              </div>
            </div>
          </div>
        </div>

        {!isEditing ? (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900">Informações Pessoais</h3>
              <Button onClick={() => setIsEditing(true)} className="gap-2">
                <Icon name="edit" size={16} />
                Editar
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-slate-600 text-sm">Nome Completo</Label>
                <p className="text-slate-900 font-medium">{profile.name}</p>
              </div>
              <div>
                <Label className="text-slate-600 text-sm">Telefone</Label>
                <p className="text-slate-900 font-medium">{formatPhone(profile.phone)}</p>
              </div>
              <div>
                <Label className="text-slate-600 text-sm">CPF</Label>
                <p className="text-slate-900 font-medium">{formatCPF(profile.cpf)}</p>
              </div>
            </div>
            {profile.company.logoUrl && (
              <div className="mt-6 pt-6 border-t border-slate-200 flex justify-end">
                <img src={profile.company.logoUrl} alt={profile.company.name} className="h-16 object-contain" />
              </div>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-6">Editar Informações</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-slate-700">
                  Nome Completo
                </Label>
                <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="mt-2" />
              </div>

              <div>
                <Label htmlFor="phone" className="text-slate-700">
                  Telefone
                </Label>
                <Input id="phone" value={formData.phone} onChange={handlePhoneChange} placeholder="(00) 00000-0000" className="mt-2" />
              </div>

              <div>
                <Label htmlFor="cpf" className="text-slate-700">
                  CPF
                </Label>
                <Input id="cpf" value={formData.cpf} onChange={handleCPFChange} placeholder="000.000.000-00" className="mt-2" />
              </div>

              <div className="pt-6 flex gap-3">
                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? "Salvando..." : "Salvar Alterações"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)} disabled={updateMutation.isPending}>
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-blue-50 rounded-xl border border-blue-200 p-4 mt-6">
          <div className="flex gap-3">
            <Icon name="info" size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Atenção</p>
              <p className="text-blue-700">Caso necessite alterar seu e-mail, entre em contato com o administrador.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
