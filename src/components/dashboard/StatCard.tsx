import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: string | number;
  image?: string;
  iconName?: never;
  iconColor?: never;
  bgColor?: never;
}

export const StatCard = ({ label, value, image }: StatCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-600 font-medium">{label}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
          </div>
          {image && (
            <div className=" h-16 rounded-lg overflow-hidden">
              <img src={image} alt={label} className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
