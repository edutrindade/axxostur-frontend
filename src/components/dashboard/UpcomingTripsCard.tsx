import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";

interface UpcomingTrip {
  date: string;
  packageName: string;
  passengers: number;
}

interface UpcomingTripsCardProps {
  trips: UpcomingTrip[];
}

export const UpcomingTripsCard = ({ trips }: UpcomingTripsCardProps) => {
  return (
    <Card className="lg:col-span-2 hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle>Próximas Viagens</CardTitle>
        <CardDescription>Viagens que começam em breve</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {trips.length > 0 ? (
            trips.map((trip, index) => (
              <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-slate-50 hover:bg-blue-50 transition-colors">
                <div className="flex-shrink-0">
                  <Icon name="calendar" size={20} className="text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900">
                    {trip.date} - {trip.packageName}
                  </p>
                  <p className="text-xs text-slate-500">{trip.passengers} passageiros</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500 text-center py-4">Nenhuma viagem agendada</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
