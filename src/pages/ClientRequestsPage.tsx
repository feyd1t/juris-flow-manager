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
import { npjService, ClientRequest } from "@/services/npjService";
import { Search, Users, Check, X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

type RequestStatus = 'new' | 'reviewed' | 'accepted' | 'rejected';

const ClientRequestsPage = () => {
  const [requests, setRequests] = useState<ClientRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<ClientRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<RequestStatus | "all">("all");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await npjService.getClientRequests();
        setRequests(data);
        setFilteredRequests(data);
      } catch (error) {
        console.error("Error fetching client requests:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, []);

  useEffect(() => {
    let result = requests;

    if (searchTerm) {
      result = result.filter(
        (r) =>
          r.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.id.toString().includes(searchTerm)
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((r) => r.status === statusFilter);
    }

    setFilteredRequests(result);
  }, [requests, searchTerm, statusFilter]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  const handleStatusUpdate = async (requestId: string, newStatus: RequestStatus) => {
    try {
      const updatedRequest = await npjService.updateClientRequest(requestId, {
        status: newStatus,
        reviewedAt: new Date(),
        reviewedBy: "Admin NPJ",
      });

      if (updatedRequest) {
        setRequests(requests.map(r => 
          r.id === requestId ? updatedRequest : r
        ));

        let message = "";
        switch (newStatus) {
          case "accepted":
            message = "Solicitação aceita com sucesso!";
            break;
          case "rejected":
            message = "Solicitação rejeitada!";
            break;
          case "reviewed":
            message = "Solicitação marcada como revisada!";
            break;
        }
        toast({
          title: message,
          description: `ID: ${requestId}`,
        });
      }
    } catch (error) {
      console.error("Error updating request status:", error);
      toast({
        title: "Erro ao atualizar o status da solicitação",
        variant: "destructive",
      });
    }
  };

  const statusOptions: Array<{ label: string; value: RequestStatus | "all" }> = [
    { label: "Todos os Status", value: "all" },
    { label: "Novos", value: "new" },
    { label: "Revisados", value: "reviewed" },
    { label: "Aceitos", value: "accepted" },
    { label: "Rejeitados", value: "rejected" },
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
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por cliente, assunto ou ID..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-1/4">
              <Select
                value={statusFilter}
                onValueChange={(value) => setStatusFilter(value as RequestStatus | "all")}
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

          {filteredRequests.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-500">
                Nenhuma solicitação encontrada
              </h3>
              <p className="text-gray-400">
                Tente ajustar seus filtros para ver mais resultados.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b">
                    <th className="py-3 px-4">ID</th>
                    <th className="py-3 px-4">Cliente</th>
                    <th className="py-3 px-4">Assunto</th>
                    <th className="py-3 px-4">Data</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((request) => (
                    <tr key={request.id} className="border-b hover:bg-gray-50">
                      <td className="py-4 px-4">{request.id}</td>
                      <td className="py-4 px-4">
                        <div>
                          <div className="font-medium">{request.clientName}</div>
                          <div className="text-sm text-gray-500">{request.clientEmail}</div>
                        </div>
                      </td>
                      <td className="py-4 px-4">{request.subject}</td>
                      <td className="py-4 px-4">{formatDate(request.createdAt)}</td>
                      <td className="py-4 px-4">
                        <StatusBadge status={request.status} />
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Detalhes
                          </Button>
                          {request.status === "new" && (
                            <>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="border-blue-500 text-blue-500 hover:bg-blue-50"
                                onClick={() => handleStatusUpdate(request.id, "reviewed")}
                              >
                                Revisar
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="border-green-500 text-green-500 hover:bg-green-50"
                                onClick={() => handleStatusUpdate(request.id, "accepted")}
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Aceitar
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="border-red-500 text-red-500 hover:bg-red-50"
                                onClick={() => handleStatusUpdate(request.id, "rejected")}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Rejeitar
                              </Button>
                            </>
                          )}
                        </div>
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

export default ClientRequestsPage;
