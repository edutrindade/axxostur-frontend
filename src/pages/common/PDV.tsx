import { useState, useMemo, useEffect, useRef } from "react";
import { Plus, Minus, DollarSign, Percent, Tag, AlertCircle, Trash2, UsersRound, PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Icon } from "@/components/ui/icon";
import { useAuth } from "@/hooks/useAuth";
import { useCustomersByCompanyQuery } from "@/hooks/useCustomersQuery";
import { usePackageTripsQuery } from "@/hooks/usePackageTripsQuery";
import { useCreateSaleMutation, useUpdateSaleMutation, useCreateSaleTravelerMutation } from "@/hooks/useSalesMutations";
import { SeatSelectionDialog } from "@/components/SeatSelectionDialog";
import { formatCpf, formatPrice, formatPhone } from "@/utils/format";
import { getCustomerByCode } from "@/services/customers";
import { getPackageTripByCode } from "@/services/packageTrips";
import { createTraveler, getTravelersByCompany, updateTraveler } from "@/services/travelers";
import { useUsersListQuery } from "@/hooks/useUsersQuery";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { TravelerFormDialog } from "@/components/TravelerFormDialog";
import { TravelersDialog } from "@/components/TravelersDialog";
import { TravelersListDialog } from "@/components/TravelersListDialog";
import type { Traveler, PaginationData } from "@/types/traveler";

interface SaleTravelerTemp {
  id: string;
  name: string;
  seatNumber: number;
}

interface ServiceCartItem {
  id: string;
  packageTripId: string;
  quantity: number;
  saleTravelers: SaleTravelerTemp[];
  selectedTravelers: Traveler[];
}

const TRAVELERS_PAGE_SIZE = 10;

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
  const [serviceItems, setServiceItems] = useState<ServiceCartItem[]>([]);
  const [activeServiceItemId, setActiveServiceItemId] = useState<string>("");
  const [seatDialogOpen, setSeatDialogOpen] = useState(false);
  const [travelerDialogOpen, setTravelerDialogOpen] = useState(false);
  const [travelerListDialogOpen, setTravelerListDialogOpen] = useState(false);
  const [travelerCreateDialogOpen, setTravelerCreateDialogOpen] = useState(false);
  const [travelerSnapshot, setTravelerSnapshot] = useState<Traveler | null>(null);
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
  const [travelersPage, setTravelersPage] = useState(1);
  const [travelersPagination, setTravelersPagination] = useState<PaginationData | null>(null);
  const [travelersFilterField, setTravelersFilterField] = useState<"name" | "cpf">("name");
  const [travelersFilterValue, setTravelersFilterValue] = useState("");
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
  const [saleType, setSaleType] = useState<string>("sell");
  const [sellerId, setSellerId] = useState<string>(user?.id || "");
  const [saleDate, setSaleDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [duplicateServiceDialogOpen, setDuplicateServiceDialogOpen] = useState(false);
  const [pendingServiceId, setPendingServiceId] = useState<string>("");

  const customerCodeInputRef = useRef<HTMLInputElement | null>(null);
  const serviceCodeInputRef = useRef<HTMLInputElement | null>(null);

  const { data: customersResponse } = useCustomersByCompanyQuery(company?.id || "", 1, 1000);
  const { data: packageTripsResponse } = usePackageTripsQuery(1, 1000, company?.id);
  const { data: usersResponse } = useUsersListQuery(1, 1000, "");

  const createSaleMutation = useCreateSaleMutation();
  const updateSaleMutation = useUpdateSaleMutation();
  const createSaleTravelerMutation = useCreateSaleTravelerMutation();

  const customers = customersResponse?.data || [];
  const packageTrips = packageTripsResponse?.data || [];
  const users = usersResponse?.data || [];

  const packageTripsById = useMemo(() => new Map(packageTrips.map((trip) => [trip.id, trip])), [packageTrips]);
  const activeServiceItem = serviceItems.find((item) => item.id === activeServiceItemId);
  const activeServiceTrip = activeServiceItem ? packageTripsById.get(activeServiceItem.packageTripId) : undefined;
  const primaryServiceItem = serviceItems[0];
  const primarySaleTravelers = primaryServiceItem?.saleTravelers || [];

  const subtotal = useMemo(() => {
    return serviceItems.reduce((sum, item) => {
      const trip = packageTripsById.get(item.packageTripId);
      if (!trip) {
        return sum;
      }
      return sum + Number(trip.price) * item.quantity;
    }, 0);
  }, [serviceItems, packageTripsById]);

  const totalQuantity = useMemo(() => {
    return serviceItems.reduce((sum, item) => sum + item.quantity, 0);
  }, [serviceItems]);

  const baseValue = totalQuantity > 0 ? subtotal / totalQuantity : 0;

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

  const occupiedSeats = activeServiceItem?.saleTravelers.map((t) => t.seatNumber) || [];

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

  useEffect(() => {
    customerCodeInputRef.current?.focus();
  }, []);

  const validateEmail = (value: string) => {
    if (!value) {
      return true;
    }

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const formatServiceDate = (value: string) => {
    if (!value) {
      return "-";
    }

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return value;
    }

    return parsed.toLocaleDateString("pt-BR");
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
    const normalizedSearch = travelersFilterValue.trim();
    const searchValue = normalizedSearch ? (travelersFilterField === "cpf" ? normalizedSearch.replace(/\D/g, "") : normalizedSearch) : "";

    getTravelersByCompany(company.id, travelersPage, TRAVELERS_PAGE_SIZE, searchValue || undefined)
      .then((response) => {
        setTravelersList(response.data || []);
        setTravelersPagination(response.pagination ?? null);
      })
      .catch((error) => console.error("Erro ao carregar viajantes:", error))
      .finally(() => setTravelersLoading(false));
  }, [travelerListDialogOpen, company?.id, travelersFilterField, travelersFilterValue, travelersPage]);

  const handleTravelerFilterFieldChange = (value: "name" | "cpf") => {
    setTravelersFilterField(value);
    setTravelersPage(1);
  };

  const handleTravelerFilterValueChange = (value: string) => {
    setTravelersFilterValue(value);
    setTravelersPage(1);
  };

  const handleTravelersPageChange = (page: number) => {
    setTravelersPage(page);
  };

  const handleOpenTravelerDialog = (serviceItemId: string) => {
    resetEditingTraveler();
    setActiveServiceItemId(serviceItemId);
    setTravelerDialogOpen(true);
  };

  const clearServiceInputs = () => {
    setSelectedPackageTrip("");
    setServiceCodeInput("");
    setServiceCodeError("");
    requestAnimationFrame(() => serviceCodeInputRef.current?.focus());
  };

  const addServiceToCart = (packageTripId: string) => {
    const newItem: ServiceCartItem = {
      id: `${packageTripId}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      packageTripId,
      quantity: 1,
      saleTravelers: [],
      selectedTravelers: [],
    };

    setServiceItems((prev) => [...prev, newItem]);
    setActiveServiceItemId(newItem.id);
    clearServiceInputs();
  };

  const handleAddService = () => {
    if (!selectedPackageTrip) {
      return;
    }

    const hasSameService = serviceItems.some((item) => item.packageTripId === selectedPackageTrip);
    if (hasSameService) {
      setPendingServiceId(selectedPackageTrip);
      setDuplicateServiceDialogOpen(true);
      return;
    }

    addServiceToCart(selectedPackageTrip);
  };

  const handleSearchCustomerByCode = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter" || !customerCodeInput.trim()) {
      return;
    }

    setCustomerCodeError("");

    if (!/^\d+$/.test(customerCodeInput)) {
      setCustomerCodeError("Por favor, digite apenas números");
      return;
    }

    setCustomerCodeLoading(true);

    try {
      const customer = await getCustomerByCode(customerCodeInput, company?.id || "");
      setSelectedCustomer(customer.id);
      setCustomerCodeInput(customer.code ? String(customer.code).padStart(3, "0") : "");
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
      setServiceCodeInput(service.code ? String(service.code).padStart(3, "0") : "");
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
      setServiceItems((prev) =>
        prev.map((item) => ({
          ...item,
          selectedTravelers: item.selectedTravelers.map((traveler) => (traveler.id === updated.id ? updated : traveler)),
        })),
      );
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
      if (activeServiceItemId) {
        setServiceItems((prev) =>
          prev.map((item) => {
            if (item.id !== activeServiceItemId) {
              return item;
            }
            const alreadySelected = item.selectedTravelers.some((selected) => {
              if (selected.companyId === traveler.companyId && selected.code !== undefined && selected.code !== null && traveler.code !== undefined && traveler.code !== null) {
                return String(selected.code) === String(traveler.code);
              }
              return selected.id === traveler.id;
            });
            return {
              ...item,
              selectedTravelers: alreadySelected ? item.selectedTravelers : [traveler, ...item.selectedTravelers],
            };
          }),
        );
      }
      toast.success("Viajante cadastrado com sucesso!");
      resetCreateTraveler();
      setTravelerCreateDialogOpen(false);
    } catch (error) {
      console.error("Erro ao cadastrar viajante:", error);
      setTravelerCreateError("Erro ao cadastrar viajante");
    } finally {
      setTravelerCreateSaving(false);
    }
  };

  const handleSeatSelected = (seatNumber: number) => {
    if (!seatSelectionTraveler || !activeServiceItemId) {
      return;
    }

    setServiceItems((prev) =>
      prev.map((item) => {
        if (item.id !== activeServiceItemId) {
          return item;
        }

        if (item.saleTravelers.some((traveler) => traveler.id === seatSelectionTraveler.id)) {
          return item;
        }

        return {
          ...item,
          saleTravelers: [
            ...item.saleTravelers,
            {
              id: seatSelectionTraveler.id,
              name: seatSelectionTraveler.name,
              seatNumber,
            },
          ],
          selectedTravelers: item.selectedTravelers.some((traveler) => traveler.id === seatSelectionTraveler.id) ? item.selectedTravelers : [seatSelectionTraveler, ...item.selectedTravelers],
        };
      }),
    );

    setSeatDialogOpen(false);
    setTravelerListDialogOpen(false);
  };

  const handleCreateSale = async () => {
    if (!selectedCustomer || !primaryServiceItem || primarySaleTravelers.length === 0 || !sellerId) {
      alert("Preencha todos os campos e adicione pelo menos um viajante");
      return;
    }

    setIsProcessing(true);

    try {
      const saleResponse = await createSaleMutation.mutateAsync({
        companyId: company?.id || "",
        clientId: selectedCustomer,
        userId: sellerId,
        packageTripId: primaryServiceItem.packageTripId,
        status: "reserved",
        totalValue: subtotal,
        discount: discountValue,
        addition: additionValue,
      });

      await updateSaleMutation.mutateAsync({
        id: saleResponse.id,
        data: {
          status: "confirmed",
          paymentMethod: paymentMethod as any,
          installments,
          interestRate,
        },
      });

      for (const traveler of primarySaleTravelers) {
        await createSaleTravelerMutation.mutateAsync({
          saleId: saleResponse.id,
          travelerId: traveler.id,
          seatNumber: traveler.seatNumber,
        });
      }

      setSaleCreated(saleResponse.id);

      setSelectedCustomer("");
      clearServiceInputs();
      setDiscount(0);
      setAddition(0);
      setDiscountType("fixed");
      setAdditionType("fixed");
      setPaymentMethod("credit_card");
      setInstallments(1);
      setInterestRate(0);
      setServiceItems([]);
      setActiveServiceItemId("");
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

  const handleTravelerCreateFormChange = (field: keyof typeof travelerCreateForm, value: string) => {
    setTravelerCreateForm((prev) => ({ ...prev, [field]: value }));
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
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-slate-900 text-white rounded-lg flex items-center justify-center">
                <Icon name="dollar" size={20} />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Dados da Venda</h2>
                <p className="text-sm text-slate-600">Preencha as informações da venda abaixo</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-1 space-y-2">
                <Label htmlFor="customer-code">Cód. Cliente</Label>
                <Input
                  id="customer-code"
                  type="text"
                  inputMode="numeric"
                  placeholder="000"
                  ref={customerCodeInputRef}
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

              <div className="lg:col-span-5 space-y-2">
                <Label htmlFor="customer-select">Cliente</Label>
                <Select
                  value={selectedCustomer}
                  onValueChange={(value) => {
                    setSelectedCustomer(value);
                    const customer = customers.find((c) => c.id === value);
                    setCustomerCodeInput(customer?.code ? String(customer.code).padStart(3, "0") : "");
                  }}
                >
                  <SelectTrigger id="customer-select">
                    <SelectValue placeholder="Escolha um cliente..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-48">
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name} {customer.phone && `- ${formatPhone(customer.phone)}`}
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
                    <SelectItem value="sell">Venda</SelectItem>
                    <SelectItem value="budget">Orçamento</SelectItem>
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
              <div className="lg:col-span-1 space-y-2">
                <Label htmlFor="service-code">Cód. Serviço</Label>
                <Input
                  id="service-code"
                  type="text"
                  placeholder="000"
                  ref={serviceCodeInputRef}
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
                <Select
                  value={selectedPackageTrip}
                  onValueChange={(value) => {
                    setSelectedPackageTrip(value);
                    const service = packageTripsById.get(value);
                    setServiceCodeInput(service?.code ? String(service.code).padStart(3, "0") : "");
                  }}
                >
                  <SelectTrigger id="trip-select">
                    <SelectValue placeholder="Escolha uma viagem..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-48">
                    {packageTrips.map((trip) => (
                      <SelectItem key={trip.id} value={trip.id}>
                        {trip.package?.name} - {formatServiceDate(trip.departureDate)} ({formatPrice(trip.price)})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="lg:col-span-1 flex items-end">
                <Button className="w-full h-12" onClick={handleAddService} disabled={isProcessing || serviceCodeLoading || !selectedPackageTrip}>
                  <PlusIcon size={16} />
                  Adicionar
                </Button>
              </div>
            </div>
          </Card>

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
                {serviceItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-slate-500 py-10">
                      Nenhum serviço selecionado
                    </TableCell>
                  </TableRow>
                ) : (
                  serviceItems.map((item, index) => {
                    const trip = packageTripsById.get(item.packageTripId);
                    const itemPrice = trip ? Number(trip.price) : 0;
                    const itemTotal = itemPrice * item.quantity;
                    return (
                      <TableRow key={item.id}>
                        <TableCell className="font-semibold">{index + 1}</TableCell>
                        <TableCell className="text-slate-600">{trip?.code !== undefined && trip?.code !== null ? String(trip.code).padStart(3, "0") : "-"}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {item.saleTravelers.length < item.quantity && (
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
                              <p className="font-semibold text-slate-900">{trip?.package?.name || "Serviço"}</p>
                              <p className="text-xs text-slate-500">
                                {formatServiceDate(trip?.departureDate || "")} • {formatServiceDate(trip?.returnDate || "")}
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
                                setServiceItems((prev) =>
                                  prev.map((current) => {
                                    if (current.id !== item.id) {
                                      return current;
                                    }
                                    const nextValue = Math.max(1, current.quantity - 1);
                                    const nextTravelers = current.saleTravelers.slice(0, nextValue);
                                    const nextSelected = current.selectedTravelers.slice(0, nextValue);
                                    return {
                                      ...current,
                                      quantity: nextValue,
                                      saleTravelers: nextTravelers,
                                      selectedTravelers: nextSelected,
                                    };
                                  }),
                                )
                              }
                              disabled={item.quantity <= 1}
                            >
                              <Minus size={14} />
                            </Button>
                            <span className="min-w-[20px] text-center font-semibold">{item.quantity}</span>
                            <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => setServiceItems((prev) => prev.map((current) => (current.id === item.id ? { ...current, quantity: current.quantity + 1 } : current)))}>
                              <Plus size={14} />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">UN</TableCell>
                        <TableCell className="text-right">{formatPrice(itemPrice)}</TableCell>
                        <TableCell className="text-right">{formatPrice(itemTotal)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button size="sm" variant="outline" className="gap-2" onClick={() => handleOpenTravelerDialog(item.id)} disabled={!selectedCustomer || !item.packageTripId}>
                              <UsersRound size={16} />
                              Viajantes
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => {
                                setServiceItems((prev) => {
                                  const nextItems = prev.filter((current) => current.id !== item.id);
                                  if (activeServiceItemId === item.id) {
                                    setActiveServiceItemId(nextItems[0]?.id || "");
                                    setTravelerDialogOpen(false);
                                    setTravelerListDialogOpen(false);
                                    setSeatDialogOpen(false);
                                  }
                                  return nextItems;
                                });
                              }}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <Card className="p-6 sticky top-8">
                <h2 className="text-lg font-semibold text-slate-900 mb-4">Resumo da Venda</h2>

                <div className="space-y-4">
                  <div className="space-y-3 pb-4 border-b">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Valor Unitário:</span>
                      <span className="font-semibold">{formatPrice(baseValue)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Quantidade:</span>
                      <span className="font-semibold">{totalQuantity}</span>
                    </div>
                    <div className="flex justify-between text-base font-semibold bg-slate-50 p-2 rounded">
                      <span>Subtotal:</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                  </div>

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

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">Total:</span>
                      <span className="font-bold text-lg text-blue-600">{formatPrice(finalValue)}</span>
                    </div>
                  </div>
                </div>
              </Card>

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

              <Button className="w-full h-12 text-lg gap-2" disabled={isProcessing || serviceItems.length === 0 || primarySaleTravelers.length === 0 || !selectedCustomer} onClick={handleCreateSale}>
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

      <TravelersDialog
        open={travelerDialogOpen}
        onOpenChange={setTravelerDialogOpen}
        selectedTravelers={activeServiceItem?.selectedTravelers || []}
        editingTravelerId={editingTravelerId}
        editingTravelerForm={editingTravelerForm}
        onEditFieldChange={(field, value) => setEditingTravelerForm((prev) => ({ ...prev, [field]: value }))}
        onEditFieldUpdate={handleTravelerFieldUpdate}
        onSelectTraveler={handleSelectTraveler}
        onRemoveTraveler={(travelerId) => {
          if (!activeServiceItemId) {
            return;
          }
          setServiceItems((prev) =>
            prev.map((item) => {
              if (item.id !== activeServiceItemId) {
                return item;
              }
              return {
                ...item,
                selectedTravelers: item.selectedTravelers.filter((traveler) => traveler.id !== travelerId),
                saleTravelers: item.saleTravelers.filter((traveler) => traveler.id !== travelerId),
              };
            }),
          );
          if (editingTravelerId === travelerId) {
            resetEditingTraveler();
          }
        }}
        onOpenCreate={() => setTravelerCreateDialogOpen(true)}
        onOpenList={() => {
          setTravelersPage(1);
          setTravelerListDialogOpen(true);
        }}
        isListDisabled={!activeServiceItem}
      />

      <TravelersListDialog
        open={travelerListDialogOpen}
        onOpenChange={setTravelerListDialogOpen}
        filterField={travelersFilterField}
        filterValue={travelersFilterValue}
        onFilterFieldChange={handleTravelerFilterFieldChange}
        onFilterValueChange={handleTravelerFilterValueChange}
        travelers={travelersList.filter((traveler) =>
          (activeServiceItem?.selectedTravelers || []).every((selected) => {
            if (selected.companyId === traveler.companyId && selected.code !== undefined && selected.code !== null && traveler.code !== undefined && traveler.code !== null) {
              return String(selected.code) !== String(traveler.code);
            }
            return selected.id !== traveler.id;
          }),
        )}
        isLoading={travelersLoading}
        pagination={travelersPagination}
        onPageChange={handleTravelersPageChange}
        isSelected={(travelerId) => (activeServiceItem?.selectedTravelers || []).some((item) => item.id === travelerId)}
        onSelect={(traveler) => {
          if (!activeServiceItemId) {
            return;
          }
          setSeatSelectionTraveler(traveler);
          setTravelerListDialogOpen(false);
          setSeatDialogOpen(true);
        }}
      />

      <TravelerFormDialog
        open={travelerCreateDialogOpen}
        onOpenChange={setTravelerCreateDialogOpen}
        form={travelerCreateForm}
        onFormChange={handleTravelerCreateFormChange}
        onSubmit={handleCreateTravelerSubmit}
        onReset={resetCreateTraveler}
        error={travelerCreateError}
        isLoading={travelerCreateSaving}
      />

      <SeatSelectionDialog
        open={seatDialogOpen}
        onOpenChange={setSeatDialogOpen}
        onSubmit={handleSeatSelected}
        isLoading={isProcessing}
        occupiedSeats={occupiedSeats}
        reservedSeats={activeServiceTrip?.reservedSeats ?? 0}
        totalSeats={activeServiceTrip?.bus?.totalSeats || 40}
        busType={activeServiceTrip?.bus?.type || "conventional"}
        hasBathroom={activeServiceTrip?.bus?.hasBathroom ?? false}
      />

      <Dialog open={duplicateServiceDialogOpen} onOpenChange={setDuplicateServiceDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Serviço já adicionado</DialogTitle>
            <DialogDescription>Este serviço já está na lista. Deseja adicionar mesmo assim?</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDuplicateServiceDialogOpen(false);
                setPendingServiceId("");
                clearServiceInputs();
              }}
            >
              Não
            </Button>
            <Button
              onClick={() => {
                if (pendingServiceId) {
                  addServiceToCart(pendingServiceId);
                }
                setDuplicateServiceDialogOpen(false);
                setPendingServiceId("");
              }}
            >
              Sim
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PDV;
