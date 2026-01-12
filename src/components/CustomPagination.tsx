import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

interface CustomPaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  disabled?: boolean;
}

export const CustomPagination = ({ page, totalPages, onPageChange, hasNextPage, hasPreviousPage, disabled = false }: CustomPaginationProps) => {
  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-slate-600">
        Página <span className="font-semibold">{page}</span> de <span className="font-semibold">{totalPages}</span>
      </p>
      <div className="flex gap-2">
        <Button onClick={() => onPageChange(page - 1)} disabled={!hasPreviousPage || disabled} variant="outline" size="sm">
          <Icon name="chevronLeft" size={16} />
        </Button>
        <Button onClick={() => onPageChange(page + 1)} disabled={!hasNextPage || disabled} variant="outline" size="sm">
          <Icon name="chevronRight" size={16} />
        </Button>
      </div>
    </div>
  );
};
