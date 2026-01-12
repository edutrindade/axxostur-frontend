import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Icon, type IconName } from "@/components/ui/icon";

interface ActionItem {
  label: string;
  iconName: string;
  color: string;
}

interface ActionCardProps {
  title: string;
  description: string;
  actions: ActionItem[];
  onActionClick?: (actionLabel: string) => void;
}

export const ActionCard = ({ title, description, actions, onActionClick }: ActionCardProps) => {
  return (
    <Card className="lg:col-span-2 hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {actions.map((action) => (
            <button key={action.label} onClick={() => onActionClick?.(action.label)} className="p-4 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group flex flex-col items-center gap-3">
              <div className={`${action.color} p-3 rounded-lg`}>
                <Icon name={action.iconName as IconName} size={20} className="text-white" />
              </div>
              <span className="text-sm font-medium text-slate-700 group-hover:text-blue-600">{action.label}</span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
