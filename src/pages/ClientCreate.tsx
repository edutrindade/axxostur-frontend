import { useEffect, useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Icon } from "@/components/ui/icon";
import { toast } from "@/components/ui/toast";
import { formatCnpj, formatCpf, formatPhone, formatZipCode } from "@/utils/format";
import { consultarCep } from "@/services/viaCep";
import { createClient, getClientById, type CreateClientPayload, type Client } from "@/services/clients";
import { Stepper } from "@/components/ui/steps";

const BR_STATES = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

const ClientCreate = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const clientId = searchParams.get("clientId");

  const [currentStep, setCurrentStep] = useState(0);
  const [tenantName, setTenantName] = useState("");
  const [tenantCnpj, setTenantCnpj] = useState("");
  const [tenantFantasyName, setTenantFantasyName] = useState("");
  const [tenantLogoUrl, setTenantLogoUrl] = useState("https://cdn/logo.png");
  const [tenantNotes, setTenantNotes] = useState("");

  const [zipCode, setZipCode] = useState("");
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("Brasil");
  const [addressLoading, setAddressLoading] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");

  const createMutation = useMutation({
    mutationFn: (payload: CreateClientPayload) => createClient(payload),
    onSuccess: () => {
      toast.success("Sucesso", { description: "Cliente cadastrado com sucesso!", duration: 3000 });
      navigate("/clients");
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      toast.error("Erro", { description: error.response?.data?.message || "Erro ao cadastrar cliente", duration: 3000 });
    },
  });

  useEffect(() => {
    const loadClient = async () => {
      if (!clientId) return;
      try {
        const client: Client = await getClientById(clientId);
        setTenantName(client.tenantName || "");
        setTenantCnpj(client.tenantCnpj || "");
        setTenantFantasyName(client.tenantFantasyName || "");
        setTenantLogoUrl(client.tenantLogoUrl || "https://cdn/logo.png");
        setTenantNotes(client.tenantNotes || "");
        setStreet(client.street || "");
        setNumber(client.number || "");
        setComplement(client.complement || "");
        setNeighborhood(client.neighborhood || "");
        setCity(client.city || "");
        setState(client.state || "");
        setCountry(client.country || "Brasil");
        setZipCode(client.zipCode || "");
        setFirstName(client.firstName || "");
        setLastName(client.lastName || "");
        setPhone(client.phone || "");
        setEmail(client.email || "");
        setCpf(client.cpf || "");
      } catch (e) {
        toast.error("Erro", { description: "Não foi possível carregar o cliente", duration: 3000 });
      }
    };
    loadClient();
  }, [clientId]);

  const isEmailValid = useMemo(() => /.+@.+\..+/.test(email), [email]);
  const isUrlValid = useMemo(() => {
    try { new URL(tenantLogoUrl); return true; } catch { return false; }
  }, [tenantLogoUrl]);

  const validateEmpresaStep = () => {
    if (!tenantName || !tenantCnpj || !tenantFantasyName) {
      toast.error("Erro", { description: "Preencha Nome, CNPJ e Nome Fantasia", duration: 3000 });
      return false;
    }
    if (!isUrlValid) {
      toast.error("Erro", { description: "URL inválida para o logo", duration: 3000 });
      return false;
    }
    return true;
  };

  const validateEnderecoStep = () => {
    if (!zipCode || !street || !number || !neighborhood || !city || !state) {
      toast.error("Erro", { description: "Preencha CEP, Rua, Número, Bairro, Cidade e Estado", duration: 3000 });
      return false;
    }
    return true;
  };

  const validateContatoStep = () => {
    if (!firstName || !lastName || !phone || !email || !cpf) {
      toast.error("Erro", { description: "Preencha Nome, Sobrenome, Telefone, E-mail e CPF", duration: 3000 });
      return false;
    }
    if (!isEmailValid) {
      toast.error("Erro", { description: "E-mail inválido", duration: 3000 });
      return false;
    }
    return true;
  };

  const handleCnpjChange = (value: string) => {
    setTenantCnpj(formatCnpj(value));
  };

  const handleCpfChange = (value: string) => {
    setCpf(formatCpf(value));
  };

  const handlePhoneChange = (value: string) => {
    setPhone(formatPhone(value));
  };

  const handleZipChange = async (value: string) => {
    const formatted = formatZipCode(value);
    setZipCode(formatted);
    const digits = value.replace(/\D/g, "");
    if (digits.length === 8) {
      setAddressLoading(true);
      try {
        const address = await consultarCep(digits);
        if (address) {
          setStreet(address.street || "");
          setNeighborhood(address.neighborhood || "");
          setCity(address.city || "");
          setState(address.state || "");
          toast.success("Sucesso", { description: "Endereço encontrado!", duration: 3000 });
        } else {
          toast.error("Erro", { description: "CEP não encontrado", duration: 3000 });
        }
      } catch {
        toast.error("Erro", { description: "Erro ao consultar CEP", duration: 3000 });
      } finally {
        setAddressLoading(false);
      }
    }
  };

  const handleLogoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Upload de arquivo não é mais utilizado para logo.
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Final validation across steps
    if (!validateEmpresaStep() || !validateEnderecoStep() || !validateContatoStep()) return;
    const payload: CreateClientPayload = {
      tenantName,
      tenantCnpj,
      tenantFantasyName,
      tenantLogoUrl,
      tenantNotes,
      street,
      number,
      complement,
      neighborhood,
      city,
      state,
      country,
      zipCode,
      firstName,
      lastName,
      phone,
      email,
      cpf,
    };
    createMutation.mutate(payload);
  };

  const nextStep = () => {
    if (currentStep === 0 && !validateEmpresaStep()) return;
    if (currentStep === 1 && !validateEnderecoStep()) return;
    setCurrentStep((s) => Math.min(2, s + 1));
  };

  const prevStep = () => setCurrentStep((s) => Math.max(0, s - 1));

  const steps = [
    { label: "Empresa" },
    { label: "Endereço" },
    { label: "Contato" },
  ];

  return (
    <>
      <AppHeader title="Cadastrar Cliente" showActionButton={false} />
      <div className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <Button
          variant="outline"
          onClick={() => navigate("/clients")}
          size="default"
          className="px-6 text-slate-700 font-medium rounded-xl border-slate-300 hover:bg-slate-50"
        >
          <Icon name="arrowLeft" size={18} className="mr-2" />
          Voltar
        </Button>
        <div className="flex-1" />
      </div>
      <div className="p-6">
        <div className="mb-6 w-full">
          <Stepper steps={steps} current={currentStep} />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {currentStep === 0 && (
            <Card className="bg-white border border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle>Dados da Empresa</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-1 sm:col-span-2">
                  <Label htmlFor="tenantName">Nome da Empresa</Label>
                  <Input id="tenantName" value={tenantName} onChange={(e) => setTenantName(e.target.value)} className="bg-slate-50" />
                </div>
                <div className="lg:col-span-1">
                  <Label htmlFor="tenantCnpj">CNPJ</Label>
                  <Input id="tenantCnpj" value={tenantCnpj} onChange={(e) => handleCnpjChange(e.target.value)} className="bg-slate-50" />
                </div>
                <div className="lg:col-span-1">
                  <Label htmlFor="tenantFantasyName">Nome Fantasia</Label>
                  <Input id="tenantFantasyName" value={tenantFantasyName} onChange={(e) => setTenantFantasyName(e.target.value)} className="bg-slate-50" />
                </div>
                <div className="lg:col-span-1 sm:col-span-2">
                  <Label htmlFor="tenantLogoUrl">Logo da Empresa (URL)</Label>
                  <Input id="tenantLogoUrl" value={tenantLogoUrl} onChange={(e) => setTenantLogoUrl(e.target.value)} className="bg-slate-50" />
                </div>
                <div className="sm:col-span-2 lg:col-span-3">
                  <Label htmlFor="tenantNotes">Observações</Label>
                  <textarea id="tenantNotes" value={tenantNotes} onChange={(e) => setTenantNotes(e.target.value)} className="w-full border border-slate-300 rounded-md px-3 py-2 bg-slate-50" rows={3} />
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 1 && (
            <Card className="bg-white border border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle>Endereço</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-1">
                  <Label htmlFor="zipCode">CEP</Label>
                  <Input id="zipCode" value={zipCode} onChange={(e) => handleZipChange(e.target.value)} className="bg-slate-50" />
                  {addressLoading && (
                    <span className="mt-1 block text-xs text-slate-500">Consultando CEP...</span>
                  )}
                </div>
                <div className="sm:col-span-2 lg:col-span-2">
                  <Label htmlFor="street">Rua</Label>
                  <Input id="street" value={street} onChange={(e) => setStreet(e.target.value)} disabled={addressLoading} className="bg-slate-50" />
                </div>
                <div className="lg:col-span-1">
                  <Label htmlFor="number">Número</Label>
                  <Input id="number" value={number} onChange={(e) => setNumber(e.target.value)} className="bg-slate-50" />
                </div>
                <div className="lg:col-span-1">
                  <Label htmlFor="complement">Complemento</Label>
                  <Input id="complement" value={complement} onChange={(e) => setComplement(e.target.value)} className="bg-slate-50" />
                </div>
                <div className="lg:col-span-1">
                  <Label htmlFor="neighborhood">Bairro</Label>
                  <Input id="neighborhood" value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} disabled={addressLoading} className="bg-slate-50" />
                </div>
                <div className="lg:col-span-1">
                  <Label htmlFor="city">Cidade</Label>
                  <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} disabled={addressLoading} className="bg-slate-50" />
                </div>
                <div className="lg:col-span-1">
                  <Label>Estado</Label>
                  <Select value={state} onValueChange={setState}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {BR_STATES.map((uf) => (
                        <SelectItem key={uf} value={uf}>{uf}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="lg:col-span-1">
                  <Label htmlFor="country">País</Label>
                  <Input id="country" value={country} onChange={(e) => setCountry(e.target.value)} className="bg-slate-50" />
                </div>
              </CardContent>
            </Card>
          )}

          {currentStep === 2 && (
            <Card className="bg-white border border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle>Contato</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-1">
                  <Label htmlFor="firstName">Nome</Label>
                  <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="bg-slate-50" />
                </div>
                <div className="lg:col-span-1">
                  <Label htmlFor="lastName">Sobrenome</Label>
                  <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} className="bg-slate-50" />
                </div>
                <div className="lg:col-span-1">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input id="phone" value={phone} onChange={(e) => handlePhoneChange(e.target.value)} className="bg-slate-50" />
                </div>
                <div className="sm:col-span-2 lg:col-span-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-slate-50" />
                </div>
                <div className="lg:col-span-1">
                  <Label htmlFor="cpf">CPF</Label>
                  <Input id="cpf" value={cpf} onChange={(e) => handleCpfChange(e.target.value)} className="bg-slate-50" />
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex items-center justify-between">
            <Button size="default" variant="outline" onClick={prevStep} disabled={currentStep === 0} className="border-slate-300 text-slate-700 hover:bg-slate-50">
              <Icon name="chevronLeft" size={16} className="mr-2" />
              Anterior
            </Button>
            {currentStep < 2 ? (
              <Button size="default" onClick={nextStep} className="bg-primary hover:bg-primary/90 text-white">
                Próximo
                <Icon name="chevronRight" size={16} className="ml-2 text-white" />
              </Button>
            ) : (
              <Button size="default" type="submit" disabled={createMutation.isPending} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-md">
                {createMutation.isPending ? "Cadastrando..." : "Concluir cadastro"}
                <Icon name="check" size={16} className="ml-2 text-white" />
              </Button>
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default ClientCreate;