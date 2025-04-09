
import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { UserRole } from "@/context/AuthContext";

const LoginPage = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoggingIn, setIsLoggingIn] = React.useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      redirectBasedOnRole(user.role);
    }
  }, [user]);

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
      
      if (success) {
        toast.success("Login realizado com sucesso!");
      } else {
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-npj-blue">NPJ Flow Manager</h1>
          <p className="text-gray-600 mt-2">Sistema de Gestão do Núcleo de Prática Jurídica</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Entre com suas credenciais para acessar o sistema.</CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="email">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="password">
                  Senha
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <Button
                type="submit"
                className="w-full bg-npj-blue hover:bg-blue-700"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? "Entrando..." : "Entrar"}
              </Button>
              
              <div className="text-center mt-4 text-sm">
                Ainda não tem uma conta?{" "}
                <Link to="/register" className="text-npj-blue hover:underline font-medium">
                  Cadastre-se
                </Link>
              </div>
              
              <p className="text-xs text-gray-500 text-center mt-4 mb-2">
                Para fins de demonstração, você pode usar:
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fillLoginForm('admin')}
                  className="text-xs"
                >
                  Admin
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fillLoginForm('student')}
                  className="text-xs"
                >
                  Estudante
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fillLoginForm('lawyer')}
                  className="text-xs"
                >
                  Advogado
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fillLoginForm('client')}
                  className="text-xs"
                >
                  Cliente
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
