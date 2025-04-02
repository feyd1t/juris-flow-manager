
import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type StatusType = 'pending' | 'active' | 'completed' | 'archived' | 'urgent' | 'new' | 'reviewed' | 'accepted' | 'rejected';

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const getStatusStyle = (status: StatusType) => {
    switch (status) {
      case 'active':
        return 'bg-status-active text-white';
      case 'pending':
      case 'new':
        return 'bg-status-pending text-white';
      case 'urgent':
      case 'rejected':
        return 'bg-status-urgent text-white';
      case 'completed':
      case 'accepted':
        return 'bg-green-600 text-white';
      case 'archived':
        return 'bg-gray-500 text-white';
      case 'reviewed':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-400 text-white';
    }
  };

  const getStatusLabel = (status: StatusType) => {
    switch (status) {
      case 'active':
        return 'Ativo';
      case 'pending':
        return 'Pendente';
      case 'urgent':
        return 'Urgente';
      case 'completed':
        return 'Concluído';
      case 'archived':
        return 'Arquivado';
      case 'new':
        return 'Nova';
      case 'reviewed':
        return 'Revisada';
      case 'accepted':
        return 'Aceita';
      case 'rejected':
        return 'Rejeitada';
      default:
        return status;
    }
  };

  return (
    <Badge className={cn(getStatusStyle(status), className)}>
      {getStatusLabel(status)}
    </Badge>
  );
};
