
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { UserRole } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { LoginForm } from "@/components/login/LoginForm";
import { DemoLoginHelper } from "@/components/login/DemoLoginHelper";
import { WelcomeHeader } from "@/components/login/WelcomeHeader";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user && profile) {
      redirectBasedOnRole(profile.role);
    }
  }, [user, profile]);

  const redirectBasedOnRole = (role: UserRole) => {
    if (role === 'client') {
      navigate('/client/status');
    } else {
      navigate('/');
    }
  };

  // Display login helper
  const fillLoginForm = (userType: string) => {
    switch (userType) {
      case 'admin':
        setEmail('admin@npj.edu.br');
        setPassword('admin123');
        break;
      case 'student':
        setEmail('estudante@npj.edu.br');
        setPassword('student123');
        break;
      case 'lawyer':
        setEmail('advogado@npj.edu.br');
        setPassword('lawyer123');
        break;
      case 'client':
        setEmail('cliente@email.com');
        setPassword('client123');
        break;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <div className="w-full max-w-md">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center justify-center space-y-8"
        >
          <WelcomeHeader />
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="w-full"
          >
            <Card className="w-full shadow-lg border-t-4 border-t-npj-blue transition-all duration-300 hover:shadow-xl">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-center">Login</CardTitle>
                <CardDescription className="text-center">
                  Entre com suas credenciais para acessar o sistema.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LoginForm />
              </CardContent>
              <CardFooter>
                <DemoLoginHelper fillLoginForm={fillLoginForm} />
              </CardFooter>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
