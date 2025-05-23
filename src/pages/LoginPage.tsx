import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { UserRole } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const { login, user, profile } = useAuth();
  const navigate = useNavigate();

  // Welcome message typing effect
  useEffect(() => {
    const messages = [
      "Bem-vindo ao NPJ Flow Manager",
      "Gerenciamento de Casos Jurídicos",
      "Sistema de Núcleo de Prática Jurídica"
    ];
    let currentMessageIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    let typingSpeed = 150;

    const typeWriter = () => {
      const currentMessage = messages[currentMessageIndex];
      
      if (isDeleting) {
        setWelcomeMessage(currentMessage.substring(0, currentCharIndex - 1));
        currentCharIndex--;
        typingSpeed = 50;
      } else {
        setWelcomeMessage(currentMessage.substring(0, currentCharIndex + 1));
        currentCharIndex++;
        typingSpeed = 150;
      }
      
      if (!isDeleting && currentCharIndex === currentMessage.length) {
        // Pause at end of typing
        isDeleting = true;
        typingSpeed = 2000;
      } else if (isDeleting && currentCharIndex === 0) {
        isDeleting = false;
        currentMessageIndex = (currentMessageIndex + 1) % messages.length;
        typingSpeed = 500;
      }
      
      setTimeout(typeWriter, typingSpeed);
    };
    
    const timer = setTimeout(typeWriter, 1000);
    return () => clearTimeout(timer);
  }, []);

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }
    
    setIsLoggingIn(true);
    
    try {
      const success = await login(email, password);
      
      if (!success) {
        toast.error("Email ou senha incorretos");
      }
    } catch (error) {
      toast.error("Ocorreu um erro ao fazer login");
      console.error(error);
    } finally {
      setIsLoggingIn(false);
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

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
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
          <motion.div 
            className="text-center"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-npj-blue">NPJ Flow Manager</h1>
            <p className="text-gray-600 mt-2 h-6 overflow-hidden">{welcomeMessage}</p>
          </motion.div>
          
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
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  <motion.div 
                    className="space-y-2"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <label className="text-sm font-medium" htmlFor="email">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="transition-all duration-300 focus:border-npj-blue focus:ring-2 focus:ring-npj-blue/20"
                      required
                    />
                  </motion.div>
                  <motion.div 
                    className="space-y-2"
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <label className="text-sm font-medium" htmlFor="password">
                      Senha
                    </label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="********"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="transition-all duration-300 focus:border-npj-blue focus:ring-2 focus:ring-npj-blue/20"
                        required
                      />
                      <button
                        type="button"
                        onClick={toggleShowPassword}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-npj-blue"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </motion.div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <motion.div 
                    className="w-full"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      className="w-full bg-npj-blue hover:bg-blue-700 transition-all duration-300"
                      disabled={isLoggingIn}
                    >
                      {isLoggingIn ? (
                        <>
                          <span className="animate-pulse">Entrando</span>
                          <span className="inline-block animate-bounce">.</span>
                          <span className="inline-block animate-bounce delay-100">.</span>
                          <span className="inline-block animate-bounce delay-200">.</span>
                        </>
                      ) : (
                        "Entrar"
                      )}
                    </Button>
                  </motion.div>
                  
                  <motion.div 
                    className="text-center text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    Ainda não tem uma conta?{" "}
                    <Link to="/register" className="text-npj-blue hover:underline font-medium transition-all duration-300 hover:text-blue-700">
                      Cadastre-se
                    </Link>
                  </motion.div>
                  
                  <motion.div 
                    className="w-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    <p className="text-xs text-gray-500 text-center mb-2">
                      Para fins de demonstração, você pode usar:
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {['admin', 'student', 'lawyer', 'client'].map((type) => (
                        <motion.div
                          key={type}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => fillLoginForm(type)}
                            className="text-xs transition-all duration-300 hover:bg-npj-blue/10"
                          >
                            {type === 'admin' ? 'Admin' : 
                             type === 'student' ? 'Estudante' : 
                             type === 'lawyer' ? 'Advogado' : 'Cliente'}
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </CardFooter>
              </form>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
