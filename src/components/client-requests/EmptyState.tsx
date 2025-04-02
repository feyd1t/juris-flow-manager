
import { Users } from "lucide-react";

export function EmptyState() {
  return (
    <div className="text-center py-8">
      <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
      <h3 className="text-lg font-medium text-gray-500">
        Nenhuma solicitação encontrada
      </h3>
      <p className="text-gray-400">
        Tente ajustar seus filtros para ver mais resultados.
      </p>
    </div>
  );
}
