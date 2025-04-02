
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RequestStatus } from "@/hooks/useClientRequests";

interface SearchAndFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: RequestStatus | "all";
  onStatusFilterChange: (value: RequestStatus | "all") => void;
}

export function SearchAndFilter({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: SearchAndFilterProps) {
  const statusOptions: Array<{ label: string; value: RequestStatus | "all" }> = [
    { label: "Todos os Status", value: "all" },
    { label: "Novos", value: "new" },
    { label: "Revisados", value: "reviewed" },
    { label: "Aceitos", value: "accepted" },
    { label: "Rejeitados", value: "rejected" },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Buscar por cliente, assunto ou ID..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <div className="w-full md:w-1/4">
        <Select
          value={statusFilter}
          onValueChange={(value) => onStatusFilterChange(value as RequestStatus | "all")}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
