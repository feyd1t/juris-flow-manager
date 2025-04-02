
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { npjService, ClientRequest } from "@/services/npjService";
import { useAuth } from "@/context/AuthContext";
import { Plus, FileText } from "lucide-react";

const RequestStatus = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState<ClientRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        // In a real app, this would filter by the current user's email
        const allRequests = await npjService.getClientRequests();
        
        // Filter requests for the current client
        const filteredRequests = user?.email
          ? allRequests.filter(req => req.clientEmail === user.email)
          : [];
          
        setRequests(filteredRequests);
      } catch (error) {
        console.error("Error fetching requests:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchRequests();
    }
  }, [user]);

  // Format date for display
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  // Get status message for the client
  const getStatusMessage = (status: string) => {
    switch (status) {
      case "new":
        return "Sua solicitação foi recebida e está aguardando análise pela equipe do NPJ.";
      case "reviewed":
        return "Sua solicitação foi analisada e está em processo de avaliação.";
      case "accepted":
        return "Sua solicitação foi aceita! Entraremos em contato em breve para agendar um atendimento.";
      case "rejected":
        return "Infelizmente sua solicitação não pôde ser atendida pelo NPJ. Verifique os comentários para mais informações.";
      default:
        return "";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-npj-blue font-bold text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-npj-blue">Minhas Solicitações</h1>
          <p className="text-gray-500">
            Acompanhe o status das suas solicitações de atendimento
          </p>
        </div>
        <Button 
          className="bg-npj-blue hover:bg-blue-700"
          onClick={() => navigate("/client/request")}
        >
          <Plus className="mr-2 h-4 w-4" /> Nova Solicitação
        </Button>
      </div>

      {requests.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">
              Nenhuma solicitação encontrada
            </h3>
            <p className="text-gray-500 mb-6 text-center max-w-md">
              Você ainda não tem solicitações registradas. Clique no botão abaixo para
              criar uma nova solicitação de atendimento.
            </p>
            <Button 
              className="bg-npj-blue hover:bg-blue-700"
              onClick={() => navigate("/client/request")}
            >
              <Plus className="mr-2 h-4 w-4" /> Nova Solicitação
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {requests.map((request) => (
            <Card key={request.id} className="overflow-hidden">
              <CardHeader className="bg-gray-50 border-b">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <CardTitle className="text-lg">
                    Solicitação #{request.id} - {request.subject}
                  </CardTitle>
                  <StatusBadge status={request.status} />
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Data da Solicitação</p>
                      <p className="font-medium">{formatDate(request.createdAt)}</p>
                    </div>
                    {request.reviewedAt && (
                      <div>
                        <p className="text-sm text-gray-500">Data de Análise</p>
                        <p className="font-medium">{formatDate(request.reviewedAt)}</p>
                      </div>
                    )}
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="mt-1 text-npj-blue font-medium">
                      {getStatusMessage(request.status)}
                    </p>
                  </div>

                  {request.comments && (
                    <div>
                      <p className="text-sm text-gray-500">Comentários</p>
                      <p className="p-3 bg-gray-50 rounded-md mt-1">
                        {request.comments}
                      </p>
                    </div>
                  )}

                  <div>
                    <p className="text-sm text-gray-500">Descrição da Solicitação</p>
                    <p className="p-3 bg-gray-50 rounded-md mt-1">
                      {request.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default RequestStatus;
