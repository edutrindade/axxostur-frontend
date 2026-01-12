import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon, type IconName } from "@/components/ui/icon";

interface FeatureStat {
  label: string;
  value: string | number;
}

interface FeatureCardProps {
  title: string;
  description: string;
  iconName: IconName;
  iconColor: string;
  bgColor: string;
  stats: FeatureStat[];
}

export const FeatureCard = ({ title, description, iconName, iconColor, bgColor, stats }: FeatureCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <div className={`${bgColor} p-3 rounded-lg flex-shrink-0`}>
            <Icon name={iconName} size={24} className={iconColor} />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {stats.map((stat, index) => (
            <div key={index} className="flex justify-between items-center py-1">
              <span className="text-sm text-slate-600">{stat.label}</span>
              <span className="text-lg font-semibold text-slate-900">{stat.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
