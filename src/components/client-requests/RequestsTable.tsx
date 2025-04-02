
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { ClientRequest } from "@/services/npjService";
import { RequestStatus } from "@/hooks/useClientRequests";
import { EmptyState } from "./EmptyState";

interface RequestsTableProps {
  requests: ClientRequest[];
  formatDate: (date: Date) => string;
  onStatusUpdate: (requestId: string, newStatus: RequestStatus) => void;
}

export function RequestsTable({
  requests,
  formatDate,
  onStatusUpdate,
}: RequestsTableProps) {
  if (requests.length === 0) {
    return <EmptyState />;
  }

  return (
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
          {requests.map((request) => (
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
                        onClick={() => onStatusUpdate(request.id, "reviewed")}
                      >
                        Revisar
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-green-500 text-green-500 hover:bg-green-50"
                        onClick={() => onStatusUpdate(request.id, "accepted")}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Aceitar
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="border-red-500 text-red-500 hover:bg-red-50"
                        onClick={() => onStatusUpdate(request.id, "rejected")}
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
  );
}
