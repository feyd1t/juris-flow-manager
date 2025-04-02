
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useClientRequests } from "@/hooks/useClientRequests";
import { SearchAndFilter } from "@/components/client-requests/SearchAndFilter";
import { RequestsTable } from "@/components/client-requests/RequestsTable";

const ClientRequestsPage = () => {
  const {
    filteredRequests,
    isLoading,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    formatDate,
    handleStatusUpdate
  } = useClientRequests();

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
          <h1 className="text-2xl font-bold">Solicitações de Clientes</h1>
          <p className="text-gray-500">
            Gerenciar e responder às solicitações dos clientes
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Solicitações</CardTitle>
          <CardDescription>
            Listagem de todas as solicitações registradas no sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SearchAndFilter 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
          />
          
          <RequestsTable 
            requests={filteredRequests}
            formatDate={formatDate}
            onStatusUpdate={handleStatusUpdate}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientRequestsPage;
