import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { PackageFormDialog } from "@/components/PackageFormDialog";
import { PackageTripFormDialog } from "@/components/PackageTripFormDialog";
import { PackagesDataTable } from "@/components/PackagesDataTable";
import { PackageTripsDataTable } from "@/components/PackageTripsDataTable";
import type { Package } from "@/types/package";
import type { PackageTrip } from "@/types/packageTrip";

const PackagesTrips = () => {
  const [packageDialogOpen, setPackageDialogOpen] = useState(false);
  const [packageTripDialogOpen, setPackageTripDialogOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<Package | undefined>();
  const [selectedPackageTrip, setSelectedPackageTrip] = useState<PackageTrip | undefined>();

  const handleEditPackage = (pkg: Package) => {
    setSelectedPackage(pkg);
    setPackageDialogOpen(true);
  };

  const handleEditPackageTrip = (trip: PackageTrip) => {
    setSelectedPackageTrip(trip);
    setPackageTripDialogOpen(true);
  };

  const handleClosePackageDialog = (open: boolean) => {
    if (!open) {
      setSelectedPackage(undefined);
    }
    setPackageDialogOpen(open);
  };

  const handleClosePackageTripDialog = (open: boolean) => {
    if (!open) {
      setSelectedPackageTrip(undefined);
    }
    setPackageTripDialogOpen(open);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Pacotes & Viagens</h1>
          <p className="text-slate-600 mt-2">Gerencie pacotes de viagem e viagens agendadas</p>
        </div>
      </div>

      <Tabs defaultValue="packages" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="packages">Pacotes</TabsTrigger>
          <TabsTrigger value="trips">Viagens</TabsTrigger>
        </TabsList>

        <TabsContent value="packages" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">Pacotes de Viagem</h2>
            <Button onClick={() => setPackageDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Pacote
            </Button>
          </div>
          <PackagesDataTable onEdit={handleEditPackage} />
        </TabsContent>

        <TabsContent value="trips" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">Viagens Agendadas</h2>
            <Button onClick={() => setPackageTripDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Viagem
            </Button>
          </div>
          <PackageTripsDataTable onEdit={handleEditPackageTrip} />
        </TabsContent>
      </Tabs>

      <PackageFormDialog open={packageDialogOpen} onOpenChange={handleClosePackageDialog} packageData={selectedPackage} />

      <PackageTripFormDialog open={packageTripDialogOpen} onOpenChange={handleClosePackageTripDialog} packageTripData={selectedPackageTrip} />
    </div>
  );
};

export default PackagesTrips;
