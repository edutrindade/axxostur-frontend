import { useState, useMemo } from "react";
import { Plus, DollarSign, Percent, Tag, AlertCircle } from "lucide-react";
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
import { SaleTravelerCard } from "@/components/SaleTravelerCard";
import { formatPrice, formatDate } from "@/utils/format";
import { getCustomerByCode } from "@/services/customers";

interface SaleTravelerTemp {
  id: string;
  name: string;
  seatNumber: number;
}

const POS = () => {
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
  const [saleTravelers, setSaleTravelers] = useState<SaleTravelerTemp[]>([]);
  const [seatDialogOpen, setSeatDialogOpen] = useState(false);
  const [selectedTravelerId, setSelectedTravelerId] = useState<string>("");
  const [saleCreated, setSaleCreated] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [customerCodeInput, setCustomerCodeInput] = useState<string>("");
  const [customerCodeError, setCustomerCodeError] = useState<string>("");
  const [customerCodeLoading, setCustomerCodeLoading] = useState(false);

  // Queries
  const { data: customersResponse } = useCustomersByCompanyQuery(company?.id || "", 1, 1000);
  const { data: packageTripsResponse } = usePackageTripsQuery(1, 1000, company?.id);

  // Mutations
  const createSaleMutation = useCreateSaleMutation();
  const updateSaleMutation = useUpdateSaleMutation();
  const createSaleTravelerMutation = useCreateSaleTravelerMutation();

  const customers = customersResponse?.data || [];
  const packageTrips = packageTripsResponse?.data || [];

  const selectedCustomerData = customers.find((c) => c.id === selectedCustomer);
  const selectedPackageTripData = packageTrips.find((p) => p.id === selectedPackageTrip);

  const baseValue = selectedPackageTripData ? Number(selectedPackageTripData.price) : 0;

  const discountValue = useMemo(() => {
    if (discountType === "percent") {
      return (baseValue * discount) / 100;
    }
    return discount;
  }, [baseValue, discount, discountType]);

  const additionValue = useMemo(() => {
    if (additionType === "percent") {
      return (baseValue * addition) / 100;
    }
    return addition;
  }, [baseValue, addition, additionType]);

  const subtotal = baseValue * saleTravelers.length;
  const finalValue = Math.max(0, subtotal - discountValue + additionValue);
  const installmentValue = finalValue / Math.max(1, installments);

  const occupiedSeats = saleTravelers.map((t) => t.seatNumber);

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
      setCustomerCodeInput("");
    } catch (error: any) {
      setCustomerCodeError("Cliente não encontrado");
      console.error("Erro ao buscar cliente por código:", error);
    } finally {
      setCustomerCodeLoading(false);
    }
  };

  const handleAddTraveler = (travelerId: string) => {
    setSelectedTravelerId(travelerId);
    setSeatDialogOpen(true);
  };

  const handleSeatSelected = (seatNumber: number) => {
    const traveler = customers.find((c) => c.id === selectedTravelerId);
    if (traveler) {
      setSaleTravelers([
        ...saleTravelers,
        {
          id: traveler.id,
          name: traveler.name,
          seatNumber,
        },
      ]);
      setSeatDialogOpen(false);
      setSelectedTravelerId("");
    }
  };

  const handleRemoveTraveler = (travelerId: string) => {
    setSaleTravelers(saleTravelers.filter((t) => t.id !== travelerId));
  };

  const handleCreateSale = async () => {
    if (!selectedCustomer || !selectedPackageTrip || saleTravelers.length === 0 || !user?.id) {
      alert("Preencha todos os campos e adicione pelo menos um viajante");
      return;
    }

    setIsProcessing(true);

    try {
      // Step 1: Create sale
      const saleResponse = await createSaleMutation.mutateAsync({
        companyId: company?.id || "",
        clientId: selectedCustomer,
        userId: user.id,
        packageTripId: selectedPackageTrip,
        status: "reserved",
        totalValue: baseValue * saleTravelers.length,
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
      setDiscount(0);
      setAddition(0);
      setDiscountType("fixed");
      setAdditionType("fixed");
      setPaymentMethod("credit_card");
      setInstallments(1);
      setInterestRate(0);
      setSaleTravelers([]);
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Form - Left Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Selection */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Icon name="users" size={20} />
                Cliente
              </h2>

              {/* Customer Code Search */}
              <div className="mb-4 space-y-2">
                <Label htmlFor="customer-code">Buscar por Código</Label>
                <Input
                  id="customer-code"
                  type="text"
                  inputMode="numeric"
                  placeholder="Digite o código e pressione ENTER"
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
                  <div className="flex items-center gap-2 text-sm text-red-600">
                    <AlertCircle size={16} />
                    {customerCodeError}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="customer-select">Selecione o Cliente</Label>
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

              {selectedCustomerData && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-slate-600">
                    <span className="font-semibold">Email:</span> {selectedCustomerData.email || "Não informado"}
                  </p>
                  <p className="text-sm text-slate-600">
                    <span className="font-semibold">CPF:</span> {selectedCustomerData.cpf || "Não informado"}
                  </p>
                </div>
              )}
            </Card>

            {/* Package Trip Selection */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Icon name="map" size={20} />
                Pacote e Viagem
              </h2>
              <div className="space-y-2">
                <Label htmlFor="trip-select">Selecione a Viagem</Label>
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

              {selectedPackageTripData && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg space-y-2">
                  <p className="text-sm text-slate-600">
                    <span className="font-semibold">Partida:</span> {formatDate(selectedPackageTripData.departureDate)}
                  </p>
                  <p className="text-sm text-slate-600">
                    <span className="font-semibold">Retorno:</span> {formatDate(selectedPackageTripData.returnDate)}
                  </p>
                  <p className="text-sm text-slate-600">
                    <span className="font-semibold">Valor por Pessoa:</span> {formatPrice(selectedPackageTripData.price)}
                  </p>
                </div>
              )}
            </Card>

            {/* Travelers */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <Icon name="users" size={20} />
                  Viajantes ({saleTravelers.length})
                </h2>
                <Button size="sm" onClick={() => handleAddTraveler(selectedCustomer)} disabled={!selectedCustomer || !selectedPackageTrip} className="gap-2">
                  <Plus size={16} />
                  Adicionar
                </Button>
              </div>

              <div className="space-y-3">
                {saleTravelers.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    <p>Nenhum viajante adicionado</p>
                  </div>
                ) : (
                  saleTravelers.map((traveler) => <SaleTravelerCard key={`${traveler.id}-${traveler.seatNumber}`} traveler={traveler} onRemove={handleRemoveTraveler} isLoading={isProcessing} />)
                )}
              </div>
            </Card>
          </div>

          {/* Summary & Payment - Right Section */}
          <div className="lg:col-span-2 space-y-6">
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
                    <span className="font-semibold">{saleTravelers.length}</span>
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

      {/* Seat Selection Dialog */}
      <SeatSelectionDialog open={seatDialogOpen} onOpenChange={setSeatDialogOpen} onSubmit={handleSeatSelected} isLoading={isProcessing} occupiedSeats={occupiedSeats} totalSeats={selectedPackageTripData?.bus?.totalSeats || 40} />
    </div>
  );
};

export default POS;
