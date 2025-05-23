
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AuthProvider } from "@/context/AuthContext";

import Dashboard from "./pages/Dashboard";
import CasesPage from "./pages/CasesPage";
import ClientRequestsPage from "./pages/ClientRequestsPage";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import ClientLayout from "./components/ClientLayout";
import RequestForm from "./pages/RequestForm";
import RequestStatus from "./pages/RequestStatus";
import RegisterSelect from "./pages/RegisterSelect";
import RegisterLawyer from "./pages/RegisterLawyer";
import RegisterClient from "./pages/RegisterClient";
import RegisterProfessor from "./pages/RegisterProfessor";
import { useEffect, useState } from "react";

const queryClient = new QueryClient();

// Detecta se está em dispositivo móvel para configurações iniciais
const detectMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

const App = () => {
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  
  useEffect(() => {
    setIsMobileDevice(detectMobileDevice());
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider delayDuration={isMobileDevice ? 700 : 400}>
        <Toaster />
        <SidebarProvider defaultOpen={!isMobileDevice}>
          <BrowserRouter>
            <AuthProvider>
              <Routes>
                {/* Auth Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterSelect />} />
                <Route path="/register/lawyer" element={<RegisterLawyer />} />
                <Route path="/register/client" element={<RegisterClient />} />
                <Route path="/register/professor" element={<RegisterProfessor />} />
                
                {/* Protected NPJ Staff/Student Routes */}
                <Route path="/" element={<Layout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="cases" element={<CasesPage />} />
                  <Route path="requests" element={<ClientRequestsPage />} />
                </Route>
                
                {/* Client Routes */}
                <Route path="/client" element={<ClientLayout />}>
                  <Route path="request" element={<RequestForm />} />
                  <Route path="status" element={<RequestStatus />} />
                </Route>
                
                {/* Catch-all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </SidebarProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
