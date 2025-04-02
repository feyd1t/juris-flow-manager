
import { useState, useEffect } from "react";
import { ClientRequest, npjService } from "@/services/npjService";
import { toast } from "@/components/ui/use-toast";

export type RequestStatus = 'new' | 'reviewed' | 'accepted' | 'rejected';

export function useClientRequests() {
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

  return {
    requests,
    filteredRequests,
    isLoading,
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    formatDate,
    handleStatusUpdate
  };
}
