import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { toast } from "sonner";
import { formatCpf, formatCnpj, formatPhone, formatZipCode } from "@/utils/format.ts";
import { consultarCep } from "@/services/viaCep.ts";
import { createPreRegistration } from "@/services/preRegistration.ts";

interface AddressForm {
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
}

const PreRegistration = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [cepFound, setCepFound] = useState(false);

  const [tenantName, setTenantName] = useState("");
  const [tenantCnpj, setTenantCnpj] = useState("");
  const [tenantCnae, setTenantCnae] = useState("");
  const [tenantCnaeSecundario, setTenantCnaeSecundario] = useState("");
  const [tenantFantasyName, setTenantFantasyName] = useState("");
  const [tenantContactPhone, setTenantContactPhone] = useState("");

  const [address, setAddress] = useState<AddressForm>({
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    country: "Brasil",
    zipCode: "",
  });

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");

  const handleCepBlur = async () => {
    const cleanCep = address.zipCode.replace(/\D/g, "");
    if (cleanCep.length === 8) {
      setIsLoadingCep(true);
      try {
        const addressData = await consultarCep(cleanCep);
        if (addressData) {
          setAddress((prev) => ({
            ...prev,
            street: addressData.street,
            neighborhood: addressData.neighborhood,
            city: addressData.city,
            state: addressData.state,
          }));
          setCepFound(true);
          toast.success("CEP encontrado com sucesso!");
        } else {
          toast.error("CEP não encontrado");
        }
      } catch (error) {
        toast.error("Erro ao buscar CEP");
      } finally {
        setIsLoadingCep(false);
      }
    }
  };

  const validateStep1 = () => {
    if (!tenantName || !tenantCnpj || !tenantCnae || !tenantFantasyName || !tenantContactPhone) {
      toast.error("Preencha todos os campos obrigatórios");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!address.zipCode || !address.street || !address.number || !address.neighborhood || !address.city || !address.state) {
      toast.error("Preencha todos os campos obrigatórios do endereço");
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!firstName || !lastName || !phone || !email || !cpf) {
      toast.error("Preencha todos os campos obrigatórios");
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep3()) {
      return;
    }

    setIsLoading(true);

    try {
      const payload = {
        tenantName,
        tenantCnpj,
        tenantCnae,
        tenantCnaeSecundario,
        tenantFantasyName,
        tenantContactName: `${firstName} ${lastName}`,
        tenantContactPhone,
        address,
        firstName,
        lastName,
        phone,
        email,
        cpf,
      };

      await createPreRegistration(payload);

      toast.success("Cadastro realizado com sucesso!", {
        description: "Redirecionando...",
      });

      setTimeout(() => {
        navigate("/pre-registration/success", {
          state: { fromPreRegistration: true },
          replace: true,
        });
      }, 1500);
    } catch (error: any) {
      console.error("Erro no cadastro:", error);

      const errorMessage = error?.response?.data?.message || "Ocorreu um erro inesperado. Tente novamente.";

      toast.error("Erro ao realizar cadastro", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden animate-fade-in">
      <div
        className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800"
        style={{
          background: `
						linear-gradient(135deg, 
							rgb(15, 23, 42) 0%, 
							rgb(30, 58, 95) 35%, 
							rgb(51, 65, 85) 100%
						)
					`,
        }}
      />

      <div className="absolute inset-0 opacity-50 animate-pulse-subtle">
        <svg className="w-full h-full" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dots" width="60" height="60" patternUnits="userSpaceOnUse">
              <circle cx="30" cy="30" r="1" fill="white" fillOpacity="0.03" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dots)" />
        </svg>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-4xl animate-slide-in-up">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Icon name="userPlus" size={24} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Pré-Cadastro</h2>
                    <p className="text-blue-100 text-sm">Preencha os dados para criar sua conta</p>
                  </div>
                </div>
                <Link to="/login" className="flex items-center space-x-2 text-white hover:text-blue-100 transition-colors">
                  <Icon name="arrowLeft" size={16} />
                  <span className="text-sm">Voltar</span>
                </Link>
              </div>
            </div>

            <div className="px-8 py-6">
              <div className="flex items-center mb-8 w-full">
                {[1, 2, 3].map((stepNumber, index) => (
                  <>
                    <div key={stepNumber} className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step >= stepNumber ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-500"}`}>{stepNumber}</div>
                      <span className={`text-xs mt-2 font-medium whitespace-nowrap ${step >= stepNumber ? "text-blue-600" : "text-slate-500"}`}>
                        {stepNumber === 1 && "Empresa"}
                        {stepNumber === 2 && "Endereço"}
                        {stepNumber === 3 && "Responsável"}
                      </span>
                    </div>
                    {index < 2 && <div className={`flex-1 h-1 mx-4 transition-all ${step > stepNumber ? "bg-blue-600" : "bg-slate-200"}`} />}
                  </>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {step === 1 && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Razão Social *</label>
                        <Input value={tenantName} onChange={(e) => setTenantName(e.target.value)} placeholder="Nome da empresa" className="h-12" required />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Nome Fantasia *</label>
                        <Input value={tenantFantasyName} onChange={(e) => setTenantFantasyName(e.target.value)} placeholder="Nome fantasia" className="h-12" required />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">CNPJ *</label>
                        <Input value={tenantCnpj} onChange={(e) => setTenantCnpj(formatCnpj(e.target.value))} placeholder="00.000.000/0000-00" className="h-12" required />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Telefone *</label>
                        <Input value={tenantContactPhone} onChange={(e) => setTenantContactPhone(formatPhone(e.target.value))} placeholder="(00) 00000-0000" className="h-12" required />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">CNAE Principal *</label>
                        <Input value={tenantCnae} onChange={(e) => setTenantCnae(e.target.value)} placeholder="0000-0/00" className="h-12" required />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">CNAE Secundário</label>
                        <Input value={tenantCnaeSecundario} onChange={(e) => setTenantCnaeSecundario(e.target.value)} placeholder="0000-0/00" className="h-12" />
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">CEP *</label>
                        <div className="relative">
                          <Input value={address.zipCode} onChange={(e) => setAddress({ ...address, zipCode: formatZipCode(e.target.value) })} onBlur={handleCepBlur} placeholder="00000-000" className="h-12" required />
                          {isLoadingCep && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                              <div className="w-4 h-4 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium text-slate-700">Rua *</label>
                        <Input value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} placeholder="Nome da rua" className="h-12" required />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Número *</label>
                        <Input value={address.number} onChange={(e) => setAddress({ ...address, number: e.target.value })} placeholder="123" className="h-12" required />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium text-slate-700">Complemento</label>
                        <Input value={address.complement} onChange={(e) => setAddress({ ...address, complement: e.target.value })} placeholder="Sala, apartamento, etc." className="h-12" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Bairro *</label>
                        <Input value={address.neighborhood} onChange={(e) => setAddress({ ...address, neighborhood: e.target.value })} placeholder="Nome do bairro" className="h-12" required />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Cidade *</label>
                        <Input value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} placeholder="Nome da cidade" className="h-12" required disabled={cepFound} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Estado *</label>
                        <Input value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value.toUpperCase() })} placeholder="UF" maxLength={2} className="h-12" required disabled={cepFound} />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">País *</label>
                        <Input value={address.country} onChange={(e) => setAddress({ ...address, country: e.target.value })} placeholder="Brasil" className="h-12" required disabled={cepFound} />
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Nome *</label>
                        <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Primeiro nome" className="h-12" required />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Sobrenome *</label>
                        <Input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Sobrenome" className="h-12" required />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">CPF *</label>
                        <Input value={cpf} onChange={(e) => setCpf(formatCpf(e.target.value))} placeholder="000.000.000-00" className="h-12" required />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700">Telefone *</label>
                        <Input value={phone} onChange={(e) => setPhone(formatPhone(e.target.value))} placeholder="(00) 00000-0000" className="h-12" required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700">E-mail *</label>
                      <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Informe o e-mail para acesso" className="h-12" required />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-6 border-t border-slate-200">
                  {step > 1 && (
                    <Button type="button" onClick={handleBack} variant="outline" className="h-12 px-6">
                      <div className="flex items-center space-x-2">
                        <Icon name="arrowLeft" size={16} />
                        <span>Voltar</span>
                      </div>
                    </Button>
                  )}

                  {step < 3 ? (
                    <Button type="button" onClick={handleNext} className={`h-12 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 ${step === 1 ? "w-full" : "ml-auto"}`}>
                      <div className="flex items-center space-x-2">
                        <span>Próximo</span>
                        <Icon name="arrowRight" size={16} />
                      </div>
                    </Button>
                  ) : (
                    <Button type="submit" className="h-12 px-6 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 ml-auto" disabled={isLoading}>
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Enviando...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <Icon name="check" size={16} />
                          <span>Finalizar Cadastro</span>
                        </div>
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </div>
          </div>

          <div className="text-center mt-6">
            <p className="text-sm text-white/80">
              Já tem uma conta?{" "}
              <Link to="/login" className="font-medium text-white hover:text-blue-200 transition-colors">
                Faça login aqui
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreRegistration;
