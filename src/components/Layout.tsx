
import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserCircle, LogOut } from "lucide-react";

const Layout = () => {
  const { user, profile, logout, isLoading } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
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
    <div className="min-h-screen flex w-full">
      <AppSidebar />
      <div className="flex flex-col flex-1">
        <header className="h-16 border-b flex items-center justify-between px-4 bg-white">
          <div className="flex items-center">
            <SidebarTrigger />
            <h1 className="text-xl font-bold text-npj-blue ml-4">NPJ Flow Manager</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-npj-gray">
              <UserCircle className="h-5 w-5 text-npj-blue" />
              <span className="text-sm font-medium">{profile?.name || 'Usuário'}</span>
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
        </header>
        <main className="flex-1 p-6 bg-gray-50 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
