import { useState, useMemo, useEffect } from "react";
import { Plus, Minus, DollarSign, Percent, Tag, AlertCircle, Trash2, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Icon } from "@/components/ui/icon";
import { useAuth } from "@/hooks/useAuth";
import { useCustomersByCompanyQuery } from "@/hooks/useCustomersQuery";
import { usePackageTripsQuery } from "@/hooks/usePackageTripsQuery";
import { useCreateSaleMutation, useUpdateSaleMutation, useCreateSaleTravelerMutation } from "@/hooks/useSalesMutations";
import { SeatSelectionDialog } from "@/components/SeatSelectionDialog";
import { formatPrice, formatDate, formatCpf, formatPhone } from "@/utils/format";
import { getCustomerByCode } from "@/services/customers";
import { getPackageTripByCode } from "@/services/packageTrips";
import { createTraveler, getTravelersByCompany, updateTraveler } from "@/services/travelers";
import { useUsersListQuery } from "@/hooks/useUsersQuery";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { Traveler } from "@/types/traveler";

interface SaleTravelerTemp {
  id: string;
  name: string;
  seatNumber: number;
}

const PDV = () => {
  const { company, user } = useAuth();
  const [selectedCustomer, setSelectedCustomer] = useState<string>("");
  const [selectedPackageTrip, setSelectedPackageTrip] = useState<string>("");
  const [discount, setDiscount] = useState<number>(0);
  const [addition, setAddition] = useState<number>(0);
  const [discountType, setDiscountType] = useState<"fixed" | "percent">("fixed");
  const [additionType, setAdditionType] = useState<"fixed" | "percent">("fixed");
  const [paymentMethod, setPaymentMethod] = useState<string>("credit_card");
  const [installments, setInstallments] = useState<number>(1);
  const [interestRate, setInterestRate] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [saleTravelers, setSaleTravelers] = useState<SaleTravelerTemp[]>([]);
  const [seatDialogOpen, setSeatDialogOpen] = useState(false);
  const [travelerDialogOpen, setTravelerDialogOpen] = useState(false);
  const [travelerListDialogOpen, setTravelerListDialogOpen] = useState(false);
  const [travelerCreateDialogOpen, setTravelerCreateDialogOpen] = useState(false);
  const [travelerSnapshot, setTravelerSnapshot] = useState<Traveler | null>(null);
  const [selectedTravelers, setSelectedTravelers] = useState<Traveler[]>([]);
  const [editingTravelerId, setEditingTravelerId] = useState<string>("");
  const [editingTravelerForm, setEditingTravelerForm] = useState({
    name: "",
    cpf: "",
    document: "",
    email: "",
    phone: "",
    birthDate: "",
    gender: "male",
    notes: "",
  });
  const [travelersList, setTravelersList] = useState<Traveler[]>([]);
  const [travelersLoading, setTravelersLoading] = useState(false);
  const [seatSelectionTraveler, setSeatSelectionTraveler] = useState<Traveler | null>(null);
  const [travelerCreateError, setTravelerCreateError] = useState<string>("");
  const [travelerCreateSaving, setTravelerCreateSaving] = useState(false);
  const [travelerCreateForm, setTravelerCreateForm] = useState({
    name: "",
    cpf: "",
    document: "",
    email: "",
    phone: "",
    birthDate: "",
    gender: "male",
    notes: "",
  });
  const [saleCreated, setSaleCreated] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [customerCodeInput, setCustomerCodeInput] = useState<string>("");
  const [customerCodeError, setCustomerCodeError] = useState<string>("");
  const [customerCodeLoading, setCustomerCodeLoading] = useState(false);
  const [serviceCodeInput, setServiceCodeInput] = useState<string>("");
  const [serviceCodeError, setServiceCodeError] = useState<string>("");
  const [serviceCodeLoading, setServiceCodeLoading] = useState(false);
  const [saleType, setSaleType] = useState<string>("pdv");
  const [sellerId, setSellerId] = useState<string>(user?.id || "");
  const [saleDate, setSaleDate] = useState<string>(new Date().toISOString().slice(0, 10));

  // Queries
  const { data: customersResponse } = useCustomersByCompanyQuery(company?.id || "", 1, 1000);
  const { data: packageTripsResponse } = usePackageTripsQuery(1, 1000, company?.id);
  const { data: usersResponse } = useUsersListQuery(1, 1000, "");

  // Mutations
  const createSaleMutation = useCreateSaleMutation();
  const updateSaleMutation = useUpdateSaleMutation();
  const createSaleTravelerMutation = useCreateSaleTravelerMutation();

  const customers = customersResponse?.data || [];
  const packageTrips = packageTripsResponse?.data || [];
  const users = usersResponse?.data || [];

  const selectedCustomerData = customers.find((c) => c.id === selectedCustomer);
  const selectedPackageTripData = packageTrips.find((p) => p.id === selectedPackageTrip);

  const baseValue = selectedPackageTripData ? Number(selectedPackageTripData.price) : 0;

  const subtotal = baseValue * quantity;

  const discountValue = useMemo(() => {
    if (discountType === "percent") {
      return (subtotal * discount) / 100;
    }
    return discount;
  }, [subtotal, discount, discountType]);

  const additionValue = useMemo(() => {
    if (additionType === "percent") {
      return (subtotal * addition) / 100;
    }
    return addition;
  }, [subtotal, addition, additionType]);

  const finalValue = Math.max(0, subtotal - discountValue + additionValue);
  const installmentValue = finalValue / Math.max(1, installments);

  const occupiedSeats = saleTravelers.map((t) => t.seatNumber);

  const sellers = useMemo(() => {
    return users.filter((seller) => {
      if (seller.role === "super_admin") {
        return false;
      }

      if (user?.role === "super_admin") {
        return true;
      }

      return seller.companyId === user?.companyId;
    });
  }, [users, user?.companyId, user?.role]);

  useEffect(() => {
    if (!sellerId && user?.id) {
      setSellerId(user.id);
    }
  }, [sellerId, user?.id]);

  const validateEmail = (value: string) => {
    if (!value) {
      return true;
    }

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const resetEditingTraveler = () => {
    setEditingTravelerId("");
    setTravelerSnapshot(null);
    setEditingTravelerForm({
      name: "",
      cpf: "",
      document: "",
      email: "",
      phone: "",
      birthDate: "",
      gender: "male",
      notes: "",
    });
  };

  const resetCreateTraveler = () => {
    setTravelerCreateError("");
    setTravelerCreateForm({
      name: "",
      cpf: "",
      document: "",
      email: "",
      phone: "",
      birthDate: "",
      gender: "male",
      notes: "",
    });
  };

  useEffect(() => {
    if (!travelerListDialogOpen || !company?.id) {
      return;
    }

    setTravelersLoading(true);
    getTravelersByCompany(company.id)
      .then((response) => setTravelersList(response.data || []))
      .catch((error) => console.error("Erro ao carregar viajantes:", error))
      .finally(() => setTravelersLoading(false));
  }, [travelerListDialogOpen, company?.id]);

  const handleOpenTravelerDialog = () => {
    resetEditingTraveler();
    setTravelerDialogOpen(true);
  };

  const handleSearchCustomerByCode = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter" || !customerCodeInput.trim()) {
      return;
    }

    setCustomerCodeError("");

    // Validar se é apenas número
    if (!/^\d+$/.test(customerCodeInput)) {
      setCustomerCodeError("Por favor, digite apenas números");
      return;
    }

    setCustomerCodeLoading(true);

    try {
      const customer = await getCustomerByCode(customerCodeInput, company?.id || "");
      setSelectedCustomer(customer.id);
    } catch (error: any) {
      setCustomerCodeError("Cliente não encontrado");
      console.error("Erro ao buscar cliente por código:", error);
    } finally {
      setCustomerCodeLoading(false);
    }
  };

  const handleSearchServiceByCode = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter" || !serviceCodeInput.trim()) {
      return;
    }

    setServiceCodeError("");

    if (!/^[\w-]+$/.test(serviceCodeInput)) {
      setServiceCodeError("Código inválido");
      return;
    }

    setServiceCodeLoading(true);

    try {
      const service = await getPackageTripByCode(serviceCodeInput, company?.id || "");
      setSelectedPackageTrip(service.id);
    } catch (error: any) {
      setServiceCodeError("Serviço não encontrado");
      console.error("Erro ao buscar serviço por código:", error);
    } finally {
      setServiceCodeLoading(false);
    }
  };

  const handleSelectTraveler = (traveler: Traveler) => {
    const formatted = {
      ...traveler,
      cpf: traveler.cpf ? formatCpf(traveler.cpf) : "",
      phone: traveler.phone ? formatPhone(traveler.phone) : "",
      birthDate: traveler.birthDate ? traveler.birthDate.split("T")[0] : "",
    };
    setEditingTravelerId(traveler.id);
    setTravelerSnapshot(traveler);
    setEditingTravelerForm({
      name: formatted.name || "",
      cpf: formatted.cpf || "",
      document: formatted.document || "",
      email: formatted.email || "",
      phone: formatted.phone || "",
      birthDate: formatted.birthDate || "",
      gender: formatted.gender || "male",
      notes: formatted.notes || "",
    });
  };

  const handleTravelerFieldUpdate = async (field: keyof typeof editingTravelerForm, value: string) => {
    if (!editingTravelerId) {
      return;
    }

    if (field === "email" && !validateEmail(value)) {
      return;
    }

    if (field === "email" && !validateEmail(value)) {
      setTravelerCreateError("E-mail inválido");
      return;
    }

    const snapshotValue = travelerSnapshot?.[field as keyof Traveler] ?? "";
    const normalizedValue = field === "cpf" ? value.replace(/\D/g, "") : field === "phone" ? value.replace(/\D/g, "") : value;
    const normalizedSnapshotRaw = typeof snapshotValue === "string" ? snapshotValue : "";
    const normalizedSnapshot = field === "birthDate" ? normalizedSnapshotRaw.split("T")[0] : normalizedSnapshotRaw;

    if (normalizedValue === normalizedSnapshot) {
      return;
    }

    try {
      const updated = await updateTraveler(editingTravelerId, {
        [field]: normalizedValue || undefined,
      });
      setTravelerSnapshot(updated);
      setTravelersList((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      setSelectedTravelers((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    } catch (error) {
      console.error("Erro ao atualizar viajante:", error);
    }
  };

  const handleCreateTravelerSubmit = async () => {
    setTravelerCreateError("");

    if (!company?.id || !travelerCreateForm.name || !travelerCreateForm.cpf || !travelerCreateForm.birthDate) {
      setTravelerCreateError("Preencha os campos obrigatórios");
      return;
    }

    if (!validateEmail(travelerCreateForm.email)) {
      setTravelerCreateError("Email inválido");
      return;
    }

    setTravelerCreateSaving(true);

    try {
      const traveler = await createTraveler({
        companyId: company.id,
        name: travelerCreateForm.name,
        cpf: travelerCreateForm.cpf.replace(/\D/g, ""),
        document: travelerCreateForm.document || undefined,
        email: travelerCreateForm.email || undefined,
        phone: travelerCreateForm.phone ? travelerCreateForm.phone.replace(/\D/g, "") : undefined,
        birthDate: travelerCreateForm.birthDate,
        gender: travelerCreateForm.gender as "male" | "female" | "other",
        notes: travelerCreateForm.notes || undefined,
      });
      setTravelersList((prev) => [traveler, ...prev]);
      resetCreateTraveler();
      setTravelerCreateDialogOpen(false);
      setTravelerListDialogOpen(true);
    } catch (error) {
      console.error("Erro ao cadastrar viajante:", error);
      setTravelerCreateError("Erro ao cadastrar viajante");
    } finally {
      setTravelerCreateSaving(false);
    }
  };

  const handleSeatSelected = (seatNumber: number) => {
    if (!seatSelectionTraveler) {
      return;
    }

    setSaleTravelers((prev) => {
      if (prev.some((item) => item.id === seatSelectionTraveler.id)) {
        return prev;
      }
      return [
        ...prev,
        {
          id: seatSelectionTraveler.id,
          name: seatSelectionTraveler.name,
          seatNumber,
        },
      ];
    });

    setSelectedTravelers((prev) => {
      if (prev.some((item) => item.id === seatSelectionTraveler.id)) {
        return prev;
      }
      return [seatSelectionTraveler, ...prev];
    });

    setSeatDialogOpen(false);
    setTravelerListDialogOpen(false);
  };

  const handleCreateSale = async () => {
    if (!selectedCustomer || !selectedPackageTrip || saleTravelers.length === 0 || !sellerId) {
      alert("Preencha todos os campos e adicione pelo menos um viajante");
      return;
    }

    setIsProcessing(true);

    try {
      // Step 1: Create sale
      const saleResponse = await createSaleMutation.mutateAsync({
        companyId: company?.id || "",
        clientId: selectedCustomer,
        userId: sellerId,
        packageTripId: selectedPackageTrip,
        status: "reserved",
        totalValue: subtotal,
        discount: discountValue,
        addition: additionValue,
      });

      // Step 2: Update sale with payment info
      await updateSaleMutation.mutateAsync({
        id: saleResponse.id,
        data: {
          status: "confirmed",
          paymentMethod: paymentMethod as any,
          installments,
          interestRate,
        },
      });

      // Step 3: Add travelers to sale
      for (const traveler of saleTravelers) {
        await createSaleTravelerMutation.mutateAsync({
          saleId: saleResponse.id,
          travelerId: traveler.id,
          seatNumber: traveler.seatNumber,
        });
      }

      setSaleCreated(saleResponse.id);

      // Reset form
      setSelectedCustomer("");
      setSelectedPackageTrip("");
      setQuantity(1);
      setDiscount(0);
      setAddition(0);
      setDiscountType("fixed");
      setAdditionType("fixed");
      setPaymentMethod("credit_card");
      setInstallments(1);
      setInterestRate(0);
      setSaleTravelers([]);
      setSelectedTravelers([]);
    } catch (error) {
      console.error("Erro ao criar venda:", error);
      alert("Erro ao criar venda. Tente novamente.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleNewSale = () => {
    setSaleCreated(null);
  };

  if (saleCreated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center shadow-lg">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <Icon name="check" size={32} className="text-green-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Venda Confirmada!</h2>
          <p className="text-slate-600 mb-6">ID da Venda: {saleCreated}</p>
          <div className="flex gap-3">
            <Button className="flex-1" variant="outline" onClick={handleNewSale}>
              Nova Venda
            </Button>
            <Button className="flex-1" variant="default">
              Comprovante
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              {company?.logoUrl && <img src={company.logoUrl} alt={company.name} className="h-12 object-contain" />}
              <div>
                <h1 className="text-4xl font-bold text-slate-900">Ponto de Venda</h1>
                <p className="text-slate-600 mt-1">{company?.fantasyName}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Header Card */}
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-slate-900 text-white rounded-lg flex items-center justify-center">
                <Icon name="dollar" size={20} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Dados da Venda</h2>
                <p className="text-sm text-slate-600">Agilize a venda usando o teclado</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-2 space-y-2">
                <Label htmlFor="customer-code">Cód. Cliente</Label>
                <Input
                  id="customer-code"
                  type="text"
                  inputMode="numeric"
                  placeholder="000"
                  value={customerCodeInput}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    setCustomerCodeInput(value);
                    setCustomerCodeError("");
                  }}
                  onKeyDown={handleSearchCustomerByCode}
                  disabled={customerCodeLoading || isProcessing}
                  className="text-sm"
                />
                {customerCodeError && (
                  <div className="flex items-center gap-2 text-xs text-red-600">
                    <AlertCircle size={14} />
                    {customerCodeError}
                  </div>
                )}
              </div>

              <div className="lg:col-span-4 space-y-2">
                <Label htmlFor="customer-select">Cliente</Label>
                <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                  <SelectTrigger id="customer-select">
                    <SelectValue placeholder="Escolha um cliente..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-48">
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name} {customer.phone && `(${customer.phone})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="lg:col-span-2 space-y-2">
                <Label htmlFor="sale-type">Tipo de Venda</Label>
                <Select value={saleType} onValueChange={setSaleType}>
                  <SelectTrigger id="sale-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdv">PDV</SelectItem>
                    <SelectItem value="telefone">Telefone</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="empresa">Empresa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="lg:col-span-2 space-y-2">
                <Label htmlFor="seller">Vendedor</Label>
                <Select value={sellerId} onValueChange={setSellerId}>
                  <SelectTrigger id="seller">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-48">
                    {sellers.map((seller) => (
                      <SelectItem key={seller.id} value={seller.id}>
                        {seller.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="lg:col-span-2 space-y-2">
                <Label htmlFor="sale-date">Data</Label>
                <Input id="sale-date" type="date" value={saleDate} onChange={(e) => setSaleDate(e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-6">
              <div className="lg:col-span-2 space-y-2">
                <Label htmlFor="service-code">Cód. Serviço</Label>
                <Input
                  id="service-code"
                  type="text"
                  placeholder="000"
                  value={serviceCodeInput}
                  onChange={(e) => {
                    setServiceCodeInput(e.target.value);
                    setServiceCodeError("");
                  }}
                  onKeyDown={handleSearchServiceByCode}
                  disabled={serviceCodeLoading || isProcessing}
                  className="text-sm"
                />
                {serviceCodeError && (
                  <div className="flex items-center gap-2 text-xs text-red-600">
                    <AlertCircle size={14} />
                    {serviceCodeError}
                  </div>
                )}
              </div>

              <div className="lg:col-span-10 space-y-2">
                <Label htmlFor="trip-select">Selecione um serviço</Label>
                <Select value={selectedPackageTrip} onValueChange={setSelectedPackageTrip}>
                  <SelectTrigger id="trip-select">
                    <SelectValue placeholder="Escolha uma viagem..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-48">
                    {packageTrips.map((trip) => (
                      <SelectItem key={trip.id} value={trip.id}>
                        {trip.package?.name} - {formatDate(trip.departureDate)} ({formatPrice(trip.price)})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {selectedCustomerData && (
              <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-slate-600">
                  <span className="font-semibold">Email:</span> {selectedCustomerData.email || "Não informado"}
                </p>
                <p className="text-sm text-slate-600">
                  <span className="font-semibold">CPF:</span> {selectedCustomerData.cpf || "Não informado"}
                </p>
              </div>
            )}
          </Card>

          {/* Services List */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Lista de Serviços</h2>
                <p className="text-sm text-slate-600">Itens da venda</p>
              </div>
              <div className="text-sm text-slate-500">UN = Unidade</div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Item</TableHead>
                  <TableHead className="w-32">Código</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="w-24 text-center">Qtd</TableHead>
                  <TableHead className="w-20 text-center">Und</TableHead>
                  <TableHead className="w-32 text-right">Preço</TableHead>
                  <TableHead className="w-32 text-right">Total</TableHead>
                  <TableHead className="w-40 text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!selectedPackageTripData ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-slate-500 py-10">
                      Nenhum serviço selecionado
                    </TableCell>
                  </TableRow>
                ) : (
                  <TableRow>
                    <TableCell className="font-semibold">1</TableCell>
                    <TableCell className="text-slate-600">{selectedPackageTripData.code !== undefined && selectedPackageTripData.code !== null ? String(selectedPackageTripData.code).padStart(3, "0") : "-"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {saleTravelers.length < quantity && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 text-amber-600">
                                <AlertCircle size={14} />
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>Informe os viajantes</TooltipContent>
                          </Tooltip>
                        )}
                        <div>
                          <p className="font-semibold text-slate-900">{selectedPackageTripData.package?.name || "Serviço"}</p>
                          <p className="text-xs text-slate-500">
                            {formatDate(selectedPackageTripData.departureDate)} • {formatDate(selectedPackageTripData.returnDate)}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="inline-flex items-center gap-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-7 w-7"
                          onClick={() =>
                            setQuantity((prev) => {
                              const nextValue = Math.max(1, prev - 1);
                              if (saleTravelers.length > nextValue) {
                                setSaleTravelers((current) => current.slice(0, nextValue));
                              }
                              return nextValue;
                            })
                          }
                          disabled={quantity <= 1}
                        >
                          <Minus size={14} />
                        </Button>
                        <span className="min-w-[20px] text-center font-semibold">{quantity}</span>
                        <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => setQuantity((prev) => prev + 1)}>
                          <Plus size={14} />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">UN</TableCell>
                    <TableCell className="text-right">{formatPrice(baseValue)}</TableCell>
                    <TableCell className="text-right">{formatPrice(subtotal)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button size="sm" variant="outline" className="gap-2" onClick={handleOpenTravelerDialog} disabled={!selectedCustomer || !selectedPackageTrip}>
                          <UsersRound size={16} />
                          Viajantes
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => {
                            setSelectedPackageTrip("");
                            setSaleTravelers([]);
                            setSelectedTravelers([]);
                            setQuantity(1);
                          }}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Summary & Payment - Right Section */}
            <div className="space-y-6">
              {/* Values Summary */}
              <Card className="p-6 sticky top-8">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Resumo da Venda</h2>

                <div className="space-y-4">
                  {/* Base values */}
                  <div className="space-y-3 pb-4 border-b">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Valor Unitário:</span>
                      <span className="font-semibold">{formatPrice(baseValue)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Quantidade:</span>
                      <span className="font-semibold">{quantity}</span>
                    </div>
                    <div className="flex justify-between text-base font-semibold bg-slate-50 p-2 rounded">
                      <span>Subtotal:</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                  </div>

                  {/* Discount */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <Percent size={16} className="text-red-600" />
                      <span className="text-sm font-semibold">Desconto</span>
                    </label>
                    <div className="flex gap-2">
                      <Input type="number" value={discount} onChange={(e) => setDiscount(Math.max(0, Number(e.target.value)))} placeholder="0" disabled={isProcessing} className="flex-1" />
                      <Select value={discountType} onValueChange={(value: any) => setDiscountType(value)} disabled={isProcessing}>
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fixed">R$</SelectItem>
                          <SelectItem value="percent">%</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {discountValue > 0 && <div className="text-sm text-red-600 font-semibold">-{formatPrice(discountValue)}</div>}
                  </div>

                  {/* Addition */}
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <Tag size={16} className="text-green-600" />
                      <span className="text-sm font-semibold">Acréscimo</span>
                    </label>
                    <div className="flex gap-2">
                      <Input type="number" value={addition} onChange={(e) => setAddition(Math.max(0, Number(e.target.value)))} placeholder="0" disabled={isProcessing} className="flex-1" />
                      <Select value={additionType} onValueChange={(value: any) => setAdditionType(value)} disabled={isProcessing}>
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fixed">R$</SelectItem>
                          <SelectItem value="percent">%</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {additionValue > 0 && <div className="text-sm text-green-600 font-semibold">+{formatPrice(additionValue)}</div>}
                  </div>

                  {/* Final Value */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Total:</span>
                      <span className="font-bold text-lg text-blue-600">{formatPrice(finalValue)}</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Payment Information */}
              <Card className="p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Pagamento</h2>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="payment-method">Forma de Pagamento</Label>
                    <Select value={paymentMethod} onValueChange={setPaymentMethod} disabled={isProcessing}>
                      <SelectTrigger id="payment-method">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="credit_card">Cartão de Crédito</SelectItem>
                        <SelectItem value="debit_card">Cartão de Débito</SelectItem>
                        <SelectItem value="cash">Dinheiro</SelectItem>
                        <SelectItem value="pix">PIX</SelectItem>
                        <SelectItem value="check">Cheque</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {paymentMethod === "credit_card" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="installments">Parcelamento</Label>
                        <Select value={installments.toString()} onValueChange={(v) => setInstallments(Number(v))} disabled={isProcessing}>
                          <SelectTrigger id="installments">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 6, 12].map((num) => (
                              <SelectItem key={num} value={num.toString()}>
                                {num}x de {formatPrice(finalValue / num)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="interest-rate">Taxa de Juros (%)</Label>
                        <Input id="interest-rate" type="number" value={interestRate} onChange={(e) => setInterestRate(Math.max(0, Number(e.target.value)))} placeholder="0" disabled={isProcessing} step="0.1" />
                      </div>
                    </>
                  )}

                  <div className="bg-slate-100 p-3 rounded-lg">
                    <p className="text-xs text-slate-600 mb-1">VALOR POR PARCELA</p>
                    <p className="text-2xl font-bold text-slate-900">{formatPrice(installmentValue)}</p>
                  </div>
                </div>
              </Card>

              {/* Action Button */}
              <Button className="w-full h-12 text-lg gap-2" disabled={isProcessing || saleTravelers.length === 0 || !selectedCustomer || !selectedPackageTrip} onClick={handleCreateSale}>
                {isProcessing ? (
                  <>
                    <Icon name="refresh" size={20} className="animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <DollarSign size={20} />
                    Confirmar Venda
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={travelerDialogOpen} onOpenChange={setTravelerDialogOpen}>
        <DialogContent className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Viajantes</DialogTitle>
            <DialogDescription>Gerencie os viajantes selecionados para esta venda.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-900">Viajantes selecionados</h3>
              <Button size="sm" className="gap-2" onClick={() => setTravelerCreateDialogOpen(true)}>
                <Plus size={16} />
                Cadastrar
              </Button>
            </div>

            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-28">Código</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead className="w-40">CPF</TableHead>
                    <TableHead className="w-40">Telefone</TableHead>
                    <TableHead className="w-40 text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedTravelers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-slate-500 py-6">
                        Nenhum viajante selecionado
                      </TableCell>
                    </TableRow>
                  ) : (
                    selectedTravelers.map((traveler) => (
                      <TableRow key={traveler.id}>
                        <TableCell className="text-slate-600">{traveler.code !== undefined && traveler.code !== null ? String(traveler.code).padStart(3, "0") : "-"}</TableCell>
                        <TableCell className="font-semibold text-slate-900">{traveler.name}</TableCell>
                        <TableCell className="text-slate-600">{traveler.cpf ? formatCpf(traveler.cpf) : "-"}</TableCell>
                        <TableCell className="text-slate-600">{traveler.phone ? formatPhone(traveler.phone) : "-"}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleSelectTraveler(traveler)}>
                              Editar
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => {
                                setSelectedTravelers((prev) => prev.filter((item) => item.id !== traveler.id));
                                setSaleTravelers((prev) => prev.filter((item) => item.id !== traveler.id));
                                if (editingTravelerId === traveler.id) {
                                  resetEditingTraveler();
                                }
                              }}
                            >
                              Remover
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {editingTravelerId && (
              <div className="border border-slate-200 rounded-lg p-4 space-y-4">
                <h4 className="text-sm font-semibold text-slate-900">Editar viajante</h4>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                  <div className="lg:col-span-6 space-y-2">
                    <Label htmlFor="edit-traveler-name">Nome</Label>
                    <Input id="edit-traveler-name" value={editingTravelerForm.name} onChange={(e) => setEditingTravelerForm((prev) => ({ ...prev, name: e.target.value }))} onBlur={(e) => handleTravelerFieldUpdate("name", e.target.value)} className="h-11 text-base" />
                  </div>
                  <div className="lg:col-span-3 space-y-2">
                    <Label htmlFor="edit-traveler-cpf">CPF</Label>
                    <Input
                      id="edit-traveler-cpf"
                      value={editingTravelerForm.cpf}
                      onChange={(e) => setEditingTravelerForm((prev) => ({ ...prev, cpf: formatCpf(e.target.value) }))}
                      onBlur={(e) => handleTravelerFieldUpdate("cpf", e.target.value)}
                      maxLength={14}
                      className="h-11 text-base"
                    />
                  </div>
                  <div className="lg:col-span-3 space-y-2">
                    <Label htmlFor="edit-traveler-phone">Telefone</Label>
                    <Input
                      id="edit-traveler-phone"
                      value={editingTravelerForm.phone}
                      onChange={(e) => setEditingTravelerForm((prev) => ({ ...prev, phone: formatPhone(e.target.value) }))}
                      onBlur={(e) => handleTravelerFieldUpdate("phone", e.target.value)}
                      maxLength={15}
                      className="h-11 text-base"
                    />
                  </div>
                  <div className="lg:col-span-4 space-y-2">
                    <Label htmlFor="edit-traveler-document">RG</Label>
                    <Input
                      id="edit-traveler-document"
                      value={editingTravelerForm.document}
                      onChange={(e) => setEditingTravelerForm((prev) => ({ ...prev, document: e.target.value }))}
                      onBlur={(e) => handleTravelerFieldUpdate("document", e.target.value)}
                      className="h-11 text-base"
                    />
                  </div>
                  <div className="lg:col-span-4 space-y-2">
                    <Label htmlFor="edit-traveler-email">Email</Label>
                    <Input
                      id="edit-traveler-email"
                      type="email"
                      value={editingTravelerForm.email}
                      onChange={(e) => setEditingTravelerForm((prev) => ({ ...prev, email: e.target.value }))}
                      onBlur={(e) => handleTravelerFieldUpdate("email", e.target.value)}
                      className="h-11 text-base"
                    />
                  </div>
                  <div className="lg:col-span-4 space-y-2">
                    <Label htmlFor="edit-traveler-birth">Data de Nascimento</Label>
                    <Input
                      id="edit-traveler-birth"
                      type="date"
                      value={editingTravelerForm.birthDate}
                      onChange={(e) => setEditingTravelerForm((prev) => ({ ...prev, birthDate: e.target.value }))}
                      onBlur={(e) => handleTravelerFieldUpdate("birthDate", e.target.value)}
                      className="h-11 text-base"
                    />
                  </div>
                  <div className="lg:col-span-4 space-y-2">
                    <Label htmlFor="edit-traveler-gender">Gênero</Label>
                    <Select
                      value={editingTravelerForm.gender}
                      onValueChange={(value) => {
                        setEditingTravelerForm((prev) => ({ ...prev, gender: value }));
                        handleTravelerFieldUpdate("gender", value);
                      }}
                    >
                      <SelectTrigger id="edit-traveler-gender" className="h-11 text-base">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Masculino</SelectItem>
                        <SelectItem value="female">Feminino</SelectItem>
                        <SelectItem value="other">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="lg:col-span-12 space-y-2">
                    <Label htmlFor="edit-traveler-notes">Observações</Label>
                    <Input id="edit-traveler-notes" value={editingTravelerForm.notes} onChange={(e) => setEditingTravelerForm((prev) => ({ ...prev, notes: e.target.value }))} onBlur={(e) => handleTravelerFieldUpdate("notes", e.target.value)} className="h-11 text-base" />
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button onClick={() => setTravelerListDialogOpen(true)} disabled={!selectedPackageTrip}>
              Listagem
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={travelerListDialogOpen} onOpenChange={setTravelerListDialogOpen}>
        <DialogContent className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Listagem de viajantes</DialogTitle>
            <DialogDescription>Selecione um viajante para adicionar à venda.</DialogDescription>
          </DialogHeader>

          <div className="border border-slate-200 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-28">Código</TableHead>
                  <TableHead>Nome</TableHead>
                  <TableHead className="w-40">CPF</TableHead>
                  <TableHead className="w-40">Telefone</TableHead>
                  <TableHead className="w-40 text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {travelersLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-slate-500 py-6">
                      Carregando viajantes...
                    </TableCell>
                  </TableRow>
                ) : travelersList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-slate-500 py-6">
                      Nenhum viajante encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  travelersList.map((traveler) => (
                    <TableRow key={traveler.id}>
                      <TableCell className="text-slate-600">{traveler.code !== undefined && traveler.code !== null ? String(traveler.code).padStart(3, "0") : "-"}</TableCell>
                      <TableCell className="font-semibold text-slate-900">{traveler.name}</TableCell>
                      <TableCell className="text-slate-600">{traveler.cpf ? formatCpf(traveler.cpf) : "-"}</TableCell>
                      <TableCell className="text-slate-600">{traveler.phone ? formatPhone(traveler.phone) : "-"}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          onClick={() => {
                            setSeatSelectionTraveler(traveler);
                            setTravelerListDialogOpen(false);
                            setSeatDialogOpen(true);
                          }}
                          disabled={selectedTravelers.some((item) => item.id === traveler.id)}
                        >
                          Selecionar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={travelerCreateDialogOpen} onOpenChange={setTravelerCreateDialogOpen}>
        <DialogContent className="w-full max-w-2xl sm:max-w-3xl md:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Cadastrar viajante</DialogTitle>
            <DialogDescription>Preencha os dados para cadastrar um novo viajante.</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4 md:border-r md:pr-6">
                <h3 className="text-base font-semibold text-slate-900">Informações Pessoais</h3>

                <div className="space-y-2">
                  <label className="text-base font-medium text-slate-700">
                    Nome <span className="text-red-500">*</span>
                  </label>
                  <Input id="create-traveler-name" value={travelerCreateForm.name} onChange={(e) => setTravelerCreateForm((prev) => ({ ...prev, name: e.target.value }))} placeholder="Ex: João Santos" />
                </div>

                <div className="space-y-2">
                  <label className="text-base font-medium text-slate-700">CPF</label>
                  <Input id="create-traveler-cpf" value={travelerCreateForm.cpf} onChange={(e) => setTravelerCreateForm((prev) => ({ ...prev, cpf: formatCpf(e.target.value) }))} placeholder="000.000.000-00" maxLength={14} />
                </div>

                <div className="space-y-2">
                  <label className="text-base font-medium text-slate-700">RG</label>
                  <Input id="create-traveler-document" value={travelerCreateForm.document} onChange={(e) => setTravelerCreateForm((prev) => ({ ...prev, document: e.target.value }))} placeholder="Ex: MG123456789" />
                </div>

                <div className="space-y-2">
                  <label className="text-base font-medium text-slate-700">Data de Nascimento</label>
                  <Input id="create-traveler-birth" type="date" value={travelerCreateForm.birthDate} onChange={(e) => setTravelerCreateForm((prev) => ({ ...prev, birthDate: e.target.value }))} />
                </div>

                <div className="space-y-2">
                  <label className="text-base font-medium text-slate-700">Gênero</label>
                  <Select value={travelerCreateForm.gender} onValueChange={(value) => setTravelerCreateForm((prev) => ({ ...prev, gender: value }))}>
                    <SelectTrigger id="create-traveler-gender">
                      <SelectValue placeholder="Selecione o gênero" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Masculino</SelectItem>
                      <SelectItem value="female">Feminino</SelectItem>
                      <SelectItem value="other">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-base font-semibold text-slate-900">Contato</h3>

                <div className="space-y-2">
                  <label className="text-base font-medium text-slate-700">Email</label>
                  <Input id="create-traveler-email" type="email" value={travelerCreateForm.email} onChange={(e) => setTravelerCreateForm((prev) => ({ ...prev, email: e.target.value }))} placeholder="joao.santos@email.com" />
                </div>

                <div className="space-y-2">
                  <label className="text-base font-medium text-slate-700">Telefone</label>
                  <Input id="create-traveler-phone" value={travelerCreateForm.phone} onChange={(e) => setTravelerCreateForm((prev) => ({ ...prev, phone: formatPhone(e.target.value) }))} placeholder="(85) 3366-1234" maxLength={15} />
                </div>
              </div>
            </div>

            <div className="border-t" />

            <div className="space-y-2">
              <label className="text-base font-medium text-slate-700">Observações</label>
              <Input id="create-traveler-notes" value={travelerCreateForm.notes} onChange={(e) => setTravelerCreateForm((prev) => ({ ...prev, notes: e.target.value }))} placeholder="Observações sobre o viajante" />
            </div>
          </div>

          {travelerCreateError && (
            <div className="flex items-center gap-2 text-sm text-red-600">
              <AlertCircle size={16} />
              {travelerCreateError}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={resetCreateTraveler} disabled={travelerCreateSaving}>
              Limpar
            </Button>
            <Button onClick={handleCreateTravelerSubmit} disabled={travelerCreateSaving}>
              Cadastrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Seat Selection Dialog */}
      <SeatSelectionDialog open={seatDialogOpen} onOpenChange={setSeatDialogOpen} onSubmit={handleSeatSelected} isLoading={isProcessing} occupiedSeats={occupiedSeats} totalSeats={selectedPackageTripData?.bus?.totalSeats || 40} />
    </div>
  );
};

export default PDV;
