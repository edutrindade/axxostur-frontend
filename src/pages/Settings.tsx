import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icon } from "@/components/ui/icon";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { getNotificationEmails, updateNotificationEmails } from "@/services/settings";
import { Badge } from "@/components/ui/badge";

const Settings = () => {
  const queryClient = useQueryClient();
  const [newEmail, setNewEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["notification-emails"],
    queryFn: getNotificationEmails,
  });

  const emails = data?.emails ?? [];

  const updateMutation = useMutation({
    mutationFn: updateNotificationEmails,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notification-emails"] });
      toast.success("E-mails atualizados com sucesso!", {
        description: "As configurações de notificação foram salvas.",
      });
      setNewEmail("");
      setEmailError("");
    },
    onError: () => {
      toast.error("Erro ao atualizar e-mails", {
        description: "Tente novamente mais tarde.",
      });
    },
  });

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleAddEmail = () => {
    const trimmedEmail = newEmail.trim().toLowerCase();

    if (!trimmedEmail) {
      setEmailError("Digite um e-mail válido");
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      setEmailError("Formato de e-mail inválido");
      return;
    }

    if (emails.includes(trimmedEmail)) {
      setEmailError("Este e-mail já está cadastrado");
      return;
    }

    const updatedEmails = [...emails, trimmedEmail];
    updateMutation.mutate({ emails: updatedEmails });
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    const updatedEmails = emails.filter((email) => email !== emailToRemove);
    updateMutation.mutate({ emails: updatedEmails });
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddEmail();
    }
  };

  return (
    <>
      <AppHeader title="Configurações do Sistema" showActionButton={false} subtitle="Gerencie as configurações e notificações da plataforma" />

      <div className="flex flex-1 flex-col gap-6 p-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-slate-800">Configurações Gerais</h2>
          <p className="text-slate-600">Ajuste as configurações do sistema conforme necessário</p>
        </div>

        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          <Card className="border-2 shadow-lg">
            <CardHeader className="border-b border-slate-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Icon name="bell" size={24} className="text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-xl">Notificações de Pré-Cadastros</CardTitle>
                  <CardDescription className="text-slate-600">E-mails que receberão alertas de novas solicitações</CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-6 space-y-6">
              <div className="space-y-3">
                <label className="text-sm font-bold text-slate-700">Adicionar novo e-mail</label>
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="exemplo@email.com"
                    value={newEmail}
                    onChange={(e) => {
                      setNewEmail(e.target.value);
                      setEmailError("");
                    }}
                    onKeyPress={handleKeyPress}
                    leftIcon="mail"
                    className={emailError ? "border-red-400" : ""}
                    disabled={updateMutation.isPending}
                  />
                  <Button onClick={handleAddEmail} disabled={updateMutation.isPending || isLoading} className="shrink-0">
                    <Icon name="plus" size={18} />
                  </Button>
                </div>
                {emailError && <p className="text-sm text-red-600 font-medium">{emailError}</p>}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-700">E-mails cadastrados</label>
                  <Badge variant="secondary" className="text-xs">
                    {emails.length} {emails.length === 1 ? "e-mail" : "e-mails"}
                  </Badge>
                </div>

                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : emails.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 px-6 bg-slate-50 rounded-lg border-2 border-dashed border-slate-300">
                    <Icon name="mail" size={32} className="text-slate-400 mb-3" />
                    <p className="text-sm text-slate-600 font-medium text-center">Nenhum e-mail cadastrado</p>
                    <p className="text-xs text-slate-500 text-center mt-1">Adicione e-mails para receber notificações</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {emails.map((email) => (
                      <div key={email} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors group">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Icon name="mail" size={16} className="text-blue-600" />
                          </div>
                          <span className="text-sm font-semibold text-slate-800">{email}</span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => handleRemoveEmail(email)} disabled={updateMutation.isPending} className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 hover:text-red-700">
                          <Icon name="delete" size={16} />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {emails.length > 0 && (
                <div className="pt-4 border-t border-slate-200">
                  <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <Icon name="info" size={20} className="text-blue-600 mt-0.5 shrink-0" />
                    <div className="text-sm">
                      <p className="font-bold text-blue-900 mb-1">Como funciona?</p>
                      <p className="text-blue-700">Todos os e-mails cadastrados receberão uma notificação automática sempre que um novo pré-cadastro for realizado na plataforma.</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-2 shadow-lg">
            <CardHeader className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-slate-100 rounded-lg">
                  <Icon name="settings" size={24} className="text-slate-600" />
                </div>
                <div>
                  <CardTitle className="text-xl">Outras Configurações</CardTitle>
                  <CardDescription className="text-slate-600">Configurações adicionais do sistema</CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center py-12 px-6">
                <div className="p-4 bg-slate-100 rounded-full mb-4">
                  <Icon name="settings" size={32} className="text-slate-400" />
                </div>
                <p className="text-sm text-slate-600 font-medium text-center">Em breve</p>
                <p className="text-xs text-slate-500 text-center mt-1">Novas configurações serão adicionadas em atualizações futuras</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Settings;
