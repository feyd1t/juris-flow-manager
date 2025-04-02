
import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { UserCircle, LogOut } from "lucide-react";

const ClientLayout = () => {
  const { user, logout, isLoading } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    } else if (!isLoading && user && user.role !== 'client') {
      navigate("/");
    }
  }, [user, isLoading, navigate]);

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse text-npj-blue font-bold text-xl">Carregando...</div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="h-16 border-b flex items-center justify-between px-4 bg-white">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-npj-blue">NPJ - Área do Cliente</h1>
        </div>
        <div className="flex items-center gap-4">
          <nav>
            <ul className="flex gap-4">
              <li>
                <Link to="/client/request" className="text-npj-blue hover:text-npj-lightBlue transition-colors">
                  Nova Solicitação
                </Link>
              </li>
              <li>
                <Link to="/client/status" className="text-npj-blue hover:text-npj-lightBlue transition-colors">
                  Minhas Solicitações
                </Link>
              </li>
            </ul>
          </nav>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-npj-gray">
              <UserCircle className="h-5 w-5 text-npj-blue" />
              <span className="text-sm font-medium">{user.name}</span>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleLogout}
              className="text-red-500"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1 p-6 bg-gray-50">
        <Outlet />
      </main>
      <footer className="bg-white p-4 border-t text-center text-sm text-gray-500">
        NPJ Flow Manager © {new Date().getFullYear()} - Todos os direitos reservados
      </footer>
    </div>
  );
};

export default ClientLayout;
