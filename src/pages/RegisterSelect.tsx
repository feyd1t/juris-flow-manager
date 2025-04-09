
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Building, GraduationCap } from "lucide-react";

const RegisterSelect = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-npj-blue">NPJ Flow Manager</h1>
          <p className="text-gray-600 mt-2">Selecione seu tipo de perfil para cadastro</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Advogado */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="text-center">
              <Briefcase className="h-12 w-12 mx-auto text-npj-blue" />
              <CardTitle className="mt-2">Advogado</CardTitle>
              <CardDescription>
                Cadastre-se como advogado orientador
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center text-sm">
              <p>Oriente os estudantes nos atendimentos e casos jurídicos</p>
            </CardContent>
            <CardFooter>
              <Link to="/register/lawyer" className="w-full">
                <Button className="w-full">Começar cadastro</Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Cliente */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="text-center">
              <Building className="h-12 w-12 mx-auto text-npj-blue" />
              <CardTitle className="mt-2">Cliente</CardTitle>
              <CardDescription>
                Cadastre-se como cliente do NPJ
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center text-sm">
              <p>Solicite assistência jurídica e acompanhe seus casos</p>
            </CardContent>
            <CardFooter>
              <Link to="/register/client" className="w-full">
                <Button className="w-full">Começar cadastro</Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Professor */}
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="text-center">
              <GraduationCap className="h-12 w-12 mx-auto text-npj-blue" />
              <CardTitle className="mt-2">Professor</CardTitle>
              <CardDescription>
                Cadastre-se como professor do NPJ
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center text-sm">
              <p>Coordene as atividades acadêmicas e supervisionamento jurídico</p>
            </CardContent>
            <CardFooter>
              <Link to="/register/professor" className="w-full">
                <Button className="w-full">Começar cadastro</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-600">
            Já possui uma conta?{" "}
            <Link to="/login" className="text-npj-blue hover:underline">
              Faça login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterSelect;
