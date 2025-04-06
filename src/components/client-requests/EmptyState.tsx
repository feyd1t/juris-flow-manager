
import { useIsMobile } from "@/hooks/use-mobile";
import { FileQuestion, Users } from "lucide-react";
import { Button } from "../ui/button";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: "users" | "file";
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  title = "Nenhuma solicitação encontrada",
  description = "Tente ajustar seus filtros para ver mais resultados.",
  icon = "users",
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const isMobile = useIsMobile();
  
  return (
    <div className="text-center py-8 px-4">
      {icon === "users" ? (
        <Users className={`${isMobile ? "h-10 w-10" : "h-12 w-12"} text-gray-300 mx-auto mb-3`} />
      ) : (
        <FileQuestion className={`${isMobile ? "h-10 w-10" : "h-12 w-12"} text-gray-300 mx-auto mb-3`} />
      )}
      
      <h3 className={`${isMobile ? "text-base" : "text-lg"} font-medium text-gray-500`}>
        {title}
      </h3>
      
      <p className="text-gray-400 mt-1 max-w-md mx-auto">
        {description}
      </p>
      
      {actionLabel && onAction && (
        <Button 
          variant="outline" 
          onClick={onAction} 
          className="mt-4"
          size={isMobile ? "sm" : "default"}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
