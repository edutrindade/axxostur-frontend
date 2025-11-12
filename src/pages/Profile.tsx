import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AppHeader } from "@/components/AppHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { toast } from "sonner";
import { getMyProfile, updateMyProfile, type UpdateUserData } from "@/services/users";
import { updateMyPassword } from "@/services/auth";

const Profile = () => {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["me"], queryFn: getMyProfile });

  const [form, setForm] = useState<Partial<UpdateUserData>>({});

  // Password form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (data) {
      setForm({
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone ?? undefined,
        cpf: data.cpf ?? undefined,
        birthdate: data.birthdate ?? undefined,
      });
    }
  }, [data]);

  const updateMutation = useMutation({
    mutationFn: (payload: UpdateUserData) => updateMyProfile(payload),
    onSuccess: (updated) => {
      toast.success("Perfil atualizado", { description: "Seus dados foram salvos." });
      // keep localStorage user in sync
      try {
        const stored = localStorage.getItem("user");
        if (stored) {
          const parsed = JSON.parse(stored);
          const merged = {
            ...parsed,
            ...{
              firstName: updated.firstName,
              lastName: updated.lastName,
              phone: updated.phone ?? parsed.phone,
              cpf: updated.cpf ?? parsed.cpf,
              birthDate: updated.birthdate ?? parsed.birthDate,
            },
          };
          localStorage.setItem("user", JSON.stringify(merged));
        }
      } catch (e) {
        // ignore
      }
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
    onError: (err: any) => {
      toast.error("Erro ao salvar", { description: err?.response?.data?.message || "Tente novamente." });
    },
  });

  const passwordMutation = useMutation({
    mutationFn: (payload: { currentPassword?: string; newPassword: string; confirmPassword: string }) => updateMyPassword(payload),
    onSuccess: () => {
      toast.success("Senha atualizada", { description: "Sua senha foi alterada com sucesso." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
    onError: (err: any) => {
      toast.error("Erro ao alterar senha", { description: err?.response?.data?.message || "Tente novamente." });
    },
  });

  const handleSave = () => {
    const payload: UpdateUserData = {};
    if (form.firstName !== undefined) payload.firstName = form.firstName as string;
    if (form.lastName !== undefined) payload.lastName = form.lastName as string;
    if (form.phone !== undefined) payload.phone = form.phone as string;
    if (form.cpf !== undefined) payload.cpf = form.cpf as string;
    if (form.birthdate !== undefined) payload.birthdate = form.birthdate as string | Date;

    updateMutation.mutate(payload);
  };

  const validatePassword = () => {
    const hasMinLength = newPassword.length >= 8;
    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasLowerCase = /[a-z]/.test(newPassword);
    const hasNumber = /\d/.test(newPassword);
    const hasSpecialChar = /[@$!%*?&#]/.test(newPassword);
    const passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;
    return hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && passwordsMatch;
  };

  const handleChangePassword = () => {
    if (!validatePassword()) {
      toast.error("Senha inválida", { description: "Verifique se atende aos requisitos." });
      return;
    }

    passwordMutation.mutate({ currentPassword, newPassword, confirmPassword });
  };

  return (
    <>
      <AppHeader title="Meu Perfil" subtitle="Gerencie seus dados" showActionButton={false} />

      <div className="flex flex-1 flex-col gap-6 p-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">Meu Perfil</h2>
          <p className="text-slate-600">Atualize suas informações pessoais e altere sua senha</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-2 shadow-lg">
            <CardHeader className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-slate-100 rounded-lg">
                  <Icon name="users" size={24} className="text-slate-600" />
                </div>
                <div>
                  <CardTitle className="text-xl">Informações pessoais</CardTitle>
                  <CardDescription className="text-slate-600">Atualize seu nome, telefone, CPF e data de nascimento</CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Nome" value={form.firstName || ""} onChange={(e) => setForm((s) => ({ ...s, firstName: e.target.value }))} />
                <Input label="Sobrenome" value={form.lastName || ""} onChange={(e) => setForm((s) => ({ ...s, lastName: e.target.value }))} />
                <Input label="E-mail" value={data?.email || ""} disabled leftIcon="mail" className="col-span-2" />
                <Input label="Telefone" value={form.phone || ""} onChange={(e) => setForm((s) => ({ ...s, phone: e.target.value }))} />
                <Input label="CPF" value={form.cpf || ""} onChange={(e) => setForm((s) => ({ ...s, cpf: e.target.value }))} />
                <Input label="Data de Nascimento" type="date" value={form.birthdate ? String(form.birthdate).split("T")[0] : ""} onChange={(e) => setForm((s) => ({ ...s, birthdate: e.target.value }))} />
              </div>

              <div className="flex items-center gap-3">
                <Button variant="default" onClick={handleSave} disabled={updateMutation.isPending || isLoading}>
                  <Icon name="check" size={18} />
                  {updateMutation.isPending ? "Salvando..." : "Salvar alterações"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 shadow-lg">
            <CardHeader className="border-b border-slate-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Icon name="lock" size={24} className="text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-xl">Alterar senha</CardTitle>
                  <CardDescription className="text-slate-600">Atualize sua senha para manter sua conta segura</CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-6 space-y-4">
              <div className="space-y-3">
                <Input label="Senha atual" type={showPassword ? "text" : "password"} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                <div className="relative">
                  <Input label="Nova senha" type={showPassword ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                </div>
                <Input label="Confirmar nova senha" type={showPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

                <div className="flex items-center gap-2">
                  <input id="showPassword" type="checkbox" checked={showPassword} onChange={() => setShowPassword((s) => !s)} className="mr-2" />
                  <label htmlFor="showPassword" className="text-sm text-slate-600">
                    Mostrar senhas
                  </label>
                </div>

                <div className="bg-slate-50 border-2 border-slate-200 rounded-lg p-4">
                  <p className="text-sm font-semibold text-slate-700 mb-2">Requisitos de senha</p>
                  <ul className="text-sm text-slate-600 list-disc list-inside">
                    <li>Mínimo de 8 caracteres</li>
                    <li>Letra maiúscula</li>
                    <li>Letra minúscula</li>
                    <li>Número</li>
                    <li>Caractere especial (@$!%*?&#)</li>
                  </ul>
                </div>

                <div className="flex items-center gap-3">
                  <Button variant="default" onClick={handleChangePassword} disabled={passwordMutation.isPending}>
                    <Icon name="lock" size={18} />
                    {passwordMutation.isPending ? "Alterando..." : "Alterar senha"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Profile;
