
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "@/components/StatusBadge";
import { npjService, Case, CaseStatus, CaseType } from "@/services/npjService";
import { Search, FileText, Plus } from "lucide-react";

const CasesPage = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const [filteredCases, setFilteredCases] = useState<Case[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<CaseStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<CaseType | "all">("all");

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const data = await npjService.getCases();
        setCases(data);
        setFilteredCases(data);
      } catch (error) {
        console.error("Error fetching cases:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCases();
  }, []);

  useEffect(() => {
    let result = cases;

    // Apply search term filter
    if (searchTerm) {
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.id.toString().includes(searchTerm)
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      result = result.filter((c) => c.status === statusFilter);
    }

    // Apply type filter
    if (typeFilter !== "all") {
      result = result.filter((c) => c.type === typeFilter);
    }

    setFilteredCases(result);
  }, [cases, searchTerm, statusFilter, typeFilter]);

  // Format date for display
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const statusOptions: Array<{ label: string; value: CaseStatus | "all" }> = [
    { label: "Todos os Status", value: "all" },
    { label: "Ativos", value: "active" },
    { label: "Pendentes", value: "pending" },
    { label: "Concluídos", value: "completed" },
    { label: "Arquivados", value: "archived" },
    { label: "Urgentes", value: "urgent" },
  ];

  const typeOptions: Array<{ label: string; value: CaseType | "all" }> = [
    { label: "Todos os Tipos", value: "all" },
    { label: "Civil", value: "civil" },
    { label: "Criminal", value: "criminal" },
    { label: "Família", value: "family" },
    { label: "Trabalhista", value: "labor" },
    { label: "Administrativo", value: "administrative" },
    { label: "Outros", value: "other" },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-npj-blue font-bold text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Gestão de Casos</h1>
          <p className="text-gray-500">
            Gerenciar e acompanhar todos os casos do NPJ
          </p>
        </div>
        <Button className="bg-npj-blue hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" /> Novo Caso
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Casos</CardTitle>
          <CardDescription>
            Listagem de todos os casos registrados no sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search and filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por título, cliente ou ID..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-1/5">
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value as CaseStatus | "all")}
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
            <div className="w-full md:w-1/5">
              <Select
                value={typeFilter}
                onValueChange={(value) => setTypeFilter(value as CaseType | "all")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent>
                  {typeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Cases table */}
          {filteredCases.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-500">
                Nenhum caso encontrado
              </h3>
              <p className="text-gray-400">
                Tente ajustar seus filtros ou criar um novo caso.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-3 px-4">ID</th>
                    <th className="py-3 px-4">Título</th>
                    <th className="py-3 px-4">Cliente</th>
                    <th className="py-3 px-4">Tipo</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Criado</th>
                    <th className="py-3 px-4">Prazo</th>
                    <th className="py-3 px-4">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCases.map((caseItem) => (
                    <tr key={caseItem.id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-4">{caseItem.id}</td>
                      <td className="py-4 px-4 font-medium">{caseItem.title}</td>
                      <td className="py-4 px-4">{caseItem.clientName}</td>
                      <td className="py-4 px-4 capitalize">{caseItem.type}</td>
                      <td className="py-4 px-4">
                        <StatusBadge status={caseItem.status} />
                      </td>
                      <td className="py-4 px-4">{formatDate(caseItem.createdAt)}</td>
                      <td className="py-4 px-4">
                        {caseItem.dueDate ? formatDate(caseItem.dueDate) : "-"}
                      </td>
                      <td className="py-4 px-4">
                        <Button variant="outline" size="sm">
                          Detalhes
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CasesPage;
