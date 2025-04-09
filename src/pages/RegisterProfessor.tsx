
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ChevronLeft, Eye, EyeOff, GraduationCap } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

// Definindo o esquema de validação
const registerSchema = z.object({
  name: z.string().min(3, "O nome completo deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  registration: z.string().min(5, "Matrícula inválida"),
  phone: z.string().min(10, "Telefone inválido"),
  department: z.string().min(3, "Departamento inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterProfessor = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirecionar se já estiver logado
  React.useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      registration: "",
      phone: "",
      department: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Simular um atraso de requisição
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Aqui seria a integração com a API real
      console.log("Dados de registro:", values);
      
      toast.success("Cadastro enviado com sucesso! Aguarde aprovação do administrador.");
      navigate("/login");
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      toast.error("Erro ao processar cadastro. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => setIsPasswordVisible(prev => !prev);
  const toggleConfirmPasswordVisibility = () => setIsConfirmPasswordVisible(prev => !prev);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <GraduationCap className="h-12 w-12 mx-auto text-npj-blue" />
          <h1 className="text-2xl font-bold text-npj-blue mt-2">Cadastro de Professor</h1>
          <p className="text-gray-600 mt-1">Preencha seus dados para solicitar acesso</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Informações acadêmicas</CardTitle>
            <CardDescription>
              Seus dados serão verificados pelo administrador do NPJ
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite seu nome completo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email institucional</FormLabel>
                      <FormControl>
                        <Input placeholder="seu@universidade.edu.br" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="registration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Matrícula/Registro</FormLabel>
                      <FormControl>
                        <Input placeholder="Seu número de matrícula" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Departamento</FormLabel>
                      <FormControl>
                        <Input placeholder="Departamento/Faculdade" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input placeholder="(00) 00000-0000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type={isPasswordVisible ? "text" : "password"} 
                            placeholder="Digite sua senha" 
                            {...field} 
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full"
                            onClick={togglePasswordVisibility}
                          >
                            {isPasswordVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar Senha</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type={isConfirmPasswordVisible ? "text" : "password"} 
                            placeholder="Confirme sua senha" 
                            {...field} 
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full"
                            onClick={toggleConfirmPasswordVisibility}
                          >
                            {isConfirmPasswordVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button
                  type="submit"
                  className="w-full mt-6"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Enviando..." : "Solicitar cadastro"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm text-gray-500 mt-2">
              Após o cadastro, seu acesso será analisado e aprovado pela coordenação do NPJ.
            </div>
            <div className="flex justify-between w-full">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/register" className="flex items-center">
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Voltar
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Já tenho uma conta</Link>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default RegisterProfessor;
