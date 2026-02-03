import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Icon } from "@/components/ui/icon";
import { TimePicker } from "@/components/ui/time-picker";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import type { Hotel, CreateHotelRequest, UpdateHotelRequest } from "@/services/hotels";
import type { Address } from "@/services/addresses";
import { fetchAddressFromViaCEP } from "@/services/addresses";
import { useCreateAddressMutation, useUpdateAddressMutation } from "@/hooks/useAddressesMutations";
import { formatPhone, cleanPhone } from "@/utils/format";

const STATES = ["AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"];

interface HotelFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateHotelRequest | UpdateHotelRequest) => void;
  isLoading: boolean;
  hotel?: Hotel;
  title: string;
  description: string;
  companyId: string;
}

export const HotelFormDialog = ({ open, onOpenChange, onSubmit, isLoading, hotel, title, description, companyId }: HotelFormDialogProps) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    email: "",
    phone: "",
    website: "",
    checkInTime: "14:00",
    checkOutTime: "12:00",
    internalNotes: "",
    totalRooms: "",
    stars: "",
  });

  const [addressData, setAddressData] = useState({
    zipCode: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
  });

  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [previousAddress, setPreviousAddress] = useState<Address | null>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [fetchingAddress, setFetchingAddress] = useState(false);
  const createAddressMutation = useCreateAddressMutation();
  const updateAddressMutation = useUpdateAddressMutation();

  useEffect(() => {
    if (hotel) {
      setFormData({
        name: hotel.name || "",
        description: hotel.description || "",
        email: hotel.email || "",
        phone: hotel.phone ? formatPhone(hotel.phone) : "",
        website: hotel.website || "",
        checkInTime: hotel.checkInTime || "14:00",
        checkOutTime: hotel.checkOutTime || "12:00",
        internalNotes: hotel.internalNotes || "",
        totalRooms: hotel.totalRooms?.toString() || "",
        stars: hotel.stars?.toString() || "",
      });

      if (hotel.address) {
        setSelectedAddress(hotel.address as Address);
        setAddressData({
          zipCode: hotel.address.zipCode || "",
          street: hotel.address.street || "",
          number: hotel.address.number || "",
          complement: hotel.address.complement || "",
          neighborhood: hotel.address.neighborhood || "",
          city: hotel.address.city || "",
          state: hotel.address.state || "",
        });
      } else {
        setSelectedAddress(null);
        setAddressData({
          zipCode: "",
          street: "",
          number: "",
          complement: "",
          neighborhood: "",
          city: "",
          state: "",
        });
      }
    } else {
      setFormData({
        name: "",
        description: "",
        email: "",
        phone: "",
        website: "",
        checkInTime: "14:00",
        checkOutTime: "12:00",
        internalNotes: "",
        totalRooms: "",
        stars: "",
      });
      setSelectedAddress(null);
      setAddressData({
        zipCode: "",
        street: "",
        number: "",
        complement: "",
        neighborhood: "",
        city: "",
        state: "",
      });
    }
  }, [hotel, open]);

  const handleFetchAddress = async () => {
    if (!addressData.zipCode) {
      toast.error("Digite um CEP válido");
      return;
    }

    setFetchingAddress(true);
    try {
      const result = await fetchAddressFromViaCEP(addressData.zipCode);
      setAddressData({
        ...addressData,
        street: result.logradouro,
        neighborhood: result.bairro,
        city: result.localidade,
        state: result.uf,
      });
    } catch (error) {
      toast.error("CEP não encontrado");
    } finally {
      setFetchingAddress(false);
    }
  };

  const handleCreateAddress = async () => {
    if (!addressData.street || !addressData.number || !addressData.neighborhood || !addressData.city || !addressData.state || !addressData.zipCode) {
      toast.error("Preencha todos os campos do endereço");
      return;
    }

    try {
      if (selectedAddress && selectedAddress.id) {
        const updatedAddress = await updateAddressMutation.mutateAsync({
          id: selectedAddress.id,
          data: {
            street: addressData.street,
            number: addressData.number,
            complement: addressData.complement || undefined,
            neighborhood: addressData.neighborhood,
            city: addressData.city,
            state: addressData.state,
            zipCode: addressData.zipCode,
          },
        });
        setSelectedAddress(updatedAddress);
      } else {
        const address = await createAddressMutation.mutateAsync({
          street: addressData.street,
          number: addressData.number,
          complement: addressData.complement || undefined,
          neighborhood: addressData.neighborhood,
          city: addressData.city,
          state: addressData.state,
          zipCode: addressData.zipCode,
          companyId: companyId,
        });
        setSelectedAddress(address);
      }
      setShowAddressForm(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Evitar submissão acidental quando formulário de endereço está aberto
    if (showAddressForm) {
      return;
    }

    if (!formData.name) {
      toast.error("Nome do hotel é obrigatório");
      return;
    }

    if (hotel) {
      const updateData: UpdateHotelRequest = {
        name: formData.name,
        description: formData.description || undefined,
        email: formData.email || undefined,
        phone: cleanPhone(formData.phone),
        website: formData.website || undefined,
        checkInTime: formData.checkInTime || undefined,
        checkOutTime: formData.checkOutTime || undefined,
        internalNotes: formData.internalNotes || undefined,
        totalRooms: formData.totalRooms ? parseInt(formData.totalRooms) : undefined,
        stars: formData.stars ? parseInt(formData.stars) : undefined,
        ...(selectedAddress && { addressId: selectedAddress.id }),
      };
      onSubmit(updateData);
    } else {
      const createData: CreateHotelRequest = {
        name: formData.name,
        companyId: companyId,
        description: formData.description || undefined,
        email: formData.email || undefined,
        phone: cleanPhone(formData.phone),
        website: formData.website || undefined,
        checkInTime: formData.checkInTime || undefined,
        checkOutTime: formData.checkOutTime || undefined,
        internalNotes: formData.internalNotes || undefined,
        totalRooms: formData.totalRooms ? parseInt(formData.totalRooms) : undefined,
        stars: formData.stars ? parseInt(formData.stars) : undefined,
        ...(selectedAddress && { addressId: selectedAddress.id }),
      };
      onSubmit(createData);
    }

    setFormData({
      name: "",
      description: "",
      email: "",
      phone: "",
      website: "",
      checkInTime: "14:00",
      checkOutTime: "12:00",
      internalNotes: "",
      totalRooms: "",
      stars: "",
    });
    setSelectedAddress(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-2xl sm:max-w-3xl md:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-slate-900">{title}</DialogTitle>
          <DialogDescription className="text-slate-600">{description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4 md:border-r md:pr-6">
              <h3 className="text-base font-semibold text-slate-900">Informações Básicas</h3>

              <div className="space-y-2">
                <label className="text-base font-medium text-slate-700">
                  Nome do Hotel <span className="text-red-500">*</span>
                </label>
                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="Ex: Hotel Paradise Resort" disabled={isLoading} />
              </div>

              <div className="space-y-2">
                <label className="text-base font-medium text-slate-700">Classificação (Estrelas)</label>
                <Select value={formData.stars} onValueChange={(value) => setFormData({ ...formData, stars: value })} disabled={isLoading}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a classificação" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Estrela</SelectItem>
                    <SelectItem value="2">2 Estrelas</SelectItem>
                    <SelectItem value="3">3 Estrelas</SelectItem>
                    <SelectItem value="4">4 Estrelas</SelectItem>
                    <SelectItem value="5">5 Estrelas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-base font-medium text-slate-700">Total de Quartos</label>
                <Input type="text" value={formData.totalRooms} onChange={(e) => setFormData({ ...formData, totalRooms: e.target.value })} placeholder="Ex: 20" disabled={isLoading} min="0" />
              </div>

              <div className="space-y-2">
                <label className="text-base font-medium text-slate-700">Descrição</label>
                <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Descreva o hotel..." disabled={isLoading} className="resize-none" rows={4} />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-base font-semibold text-slate-900">Contato</h3>

              <div className="space-y-2">
                <label className="text-base font-medium text-slate-700">Email</label>
                <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="contato@hotel.com.br" disabled={isLoading} />
              </div>

              <div className="space-y-2">
                <label className="text-base font-medium text-slate-700">Telefone</label>
                <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: formatPhone(e.target.value) })} placeholder="(85) 3366-1234" disabled={isLoading} maxLength={15} />
              </div>

              <div className="space-y-2">
                <label className="text-base font-medium text-slate-700">Website</label>
                <Input type="url" value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} placeholder="https://www.hotel.com.br" disabled={isLoading} />
              </div>

              <div className="space-y-2">
                <label className="text-base font-medium text-slate-700">Horário de Check-in</label>
                <TimePicker value={formData.checkInTime} onChange={(time) => setFormData({ ...formData, checkInTime: time })} disabled={isLoading} />
              </div>

              <div className="space-y-2">
                <label className="text-base font-medium text-slate-700">Horário de Check-out</label>
                <TimePicker value={formData.checkOutTime} onChange={(time) => setFormData({ ...formData, checkOutTime: time })} disabled={isLoading} />
              </div>
            </div>
          </div>

          <div className="border-t" />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-900">Endereço</h3>
              {!showAddressForm && !selectedAddress && (
                <Button type="button" variant="secondary" size="sm" onClick={() => setShowAddressForm(true)} disabled={isLoading}>
                  <Icon name="plus" size={16} className="mr-1" />
                  Adicionar
                </Button>
              )}
            </div>

            {showAddressForm ? (
              <div className="border border-slate-200 rounded-lg p-4 space-y-4 bg-slate-50">
                <div className="space-y-2">
                  <label className="text-base font-medium text-slate-700">
                    CEP <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <Input
                      value={addressData.zipCode}
                      onChange={(e) => setAddressData({ ...addressData, zipCode: e.target.value.replace(/\D/g, "").slice(0, 8) })}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleFetchAddress();
                        }
                      }}
                      placeholder="00000-000"
                      disabled={fetchingAddress || createAddressMutation.isPending}
                      maxLength={8}
                    />
                    <Button size="default" variant="outline" type="button" onClick={handleFetchAddress} disabled={fetchingAddress || createAddressMutation.isPending || !addressData.zipCode}>
                      {fetchingAddress ? "Buscando..." : "Buscar"}
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-base font-medium text-slate-700">
                      Rua, Avenida, Praça, etc <span className="text-red-500">*</span>
                    </label>
                    <Input value={addressData.street} onChange={(e) => setAddressData({ ...addressData, street: e.target.value })} placeholder="Logradouro" disabled={createAddressMutation.isPending} />
                  </div>

                  <div className="space-y-2">
                    <label className="text-base font-medium text-slate-700">
                      Número <span className="text-red-500">*</span>
                    </label>
                    <Input value={addressData.number} onChange={(e) => setAddressData({ ...addressData, number: e.target.value })} placeholder="Ex: 123" disabled={createAddressMutation.isPending} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-base font-medium text-slate-700">Complemento</label>
                    <Input value={addressData.complement} onChange={(e) => setAddressData({ ...addressData, complement: e.target.value })} placeholder="Ex: Apto 42, Bloco A" disabled={createAddressMutation.isPending} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-base font-medium text-slate-700">
                      Bairro <span className="text-red-500">*</span>
                    </label>
                    <Input value={addressData.neighborhood} onChange={(e) => setAddressData({ ...addressData, neighborhood: e.target.value })} placeholder="Nome do bairro" disabled={createAddressMutation.isPending} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-base font-medium text-slate-700">
                      Cidade <span className="text-red-500">*</span>
                    </label>
                    <Input value={addressData.city} disabled={true} placeholder="Preenchido automaticamente" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-base font-medium text-slate-700">
                      Estado <span className="text-red-500">*</span>
                    </label>
                    <Select value={addressData.state} onValueChange={(value) => setAddressData({ ...addressData, state: value })} disabled={true}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {STATES.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowAddressForm(false);
                      if (previousAddress) {
                        setSelectedAddress(previousAddress);
                        setPreviousAddress(null);
                      }
                      setAddressData({
                        zipCode: "",
                        street: "",
                        number: "",
                        complement: "",
                        neighborhood: "",
                        city: "",
                        state: "",
                      });
                    }}
                    disabled={createAddressMutation.isPending || updateAddressMutation.isPending}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button type="button" onClick={handleCreateAddress} disabled={createAddressMutation.isPending || updateAddressMutation.isPending} className="flex-1">
                    {createAddressMutation.isPending || updateAddressMutation.isPending ? "Salvando..." : selectedAddress?.id ? "Atualizar Endereço" : "Salvar Endereço"}
                  </Button>
                </div>
              </div>
            ) : selectedAddress ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-slate-900">
                      {selectedAddress.street}, {selectedAddress.number}
                    </p>
                    <p className="text-sm text-slate-600">
                      {selectedAddress.complement && `${selectedAddress.complement}, `}
                      {selectedAddress.neighborhood} - {selectedAddress.city}, {selectedAddress.state}
                    </p>
                    <p className="text-sm text-slate-600">CEP: {selectedAddress.zipCode}</p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setPreviousAddress(selectedAddress);
                      setAddressData({
                        zipCode: selectedAddress.zipCode || "",
                        street: selectedAddress.street || "",
                        number: selectedAddress.number || "",
                        complement: selectedAddress.complement || "",
                        neighborhood: selectedAddress.neighborhood || "",
                        city: selectedAddress.city || "",
                        state: selectedAddress.state || "",
                      });
                      setShowAddressForm(true);
                    }}
                    disabled={isLoading}
                  >
                    <Icon name="edit" size={16} />
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-500 italic">Nenhum endereço selecionado</p>
            )}
          </div>

          <div className="border-t" />

          <div className="space-y-4">
            <h3 className="text-base font-semibold text-slate-900">Notas Internas</h3>
            <Textarea value={formData.internalNotes} onChange={(e) => setFormData({ ...formData, internalNotes: e.target.value })} placeholder="Informações internas sobre o hotel..." disabled={isLoading} className="resize-none" rows={3} />
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading || showAddressForm}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading || showAddressForm}>
              {isLoading ? "Salvando..." : hotel ? "Atualizar" : "Criar Hotel"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
