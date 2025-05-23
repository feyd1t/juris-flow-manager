
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

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

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <form onSubmit={handleLogin}>
      <div className="space-y-4">
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
      </div>
      
      <div className="flex flex-col space-y-4 mt-6">
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
      </div>
    </form>
  );
};
