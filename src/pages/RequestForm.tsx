
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/context/AuthContext";
import { npjService } from "@/services/npjService";
import { toast } from "sonner";

const RequestForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    clientName: user?.name || "",
    clientEmail: user?.email || "",
    clientPhone: "",
    subject: "",
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const requiredFields = ["clientName", "clientEmail", "clientPhone", "subject", "description"];
      const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
      
      if (missingFields.length > 0) {
        toast.error("Por favor, preencha todos os campos obrigatórios.");
        return;
      }

      await npjService.createClientRequest({
        ...formData,
      });

      toast.success("Solicitação enviada com sucesso!");
      navigate("/client/status");
    } catch (error) {
      console.error("Error submitting request:", error);
      toast.error("Ocorreu um erro ao enviar a solicitação. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-3xl py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-npj-blue">Nova Solicitação de Atendimento</h1>
        <p className="text-gray-500">
          Preencha o formulário abaixo para solicitar atendimento jurídico
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Formulário de Solicitação</CardTitle>
          <CardDescription>
            Todos os campos marcados com * são obrigatórios.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="clientName">
                Nome Completo *
              </label>
              <Input
                id="clientName"
                name="clientName"
                value={formData.clientName}
                onChange={handleChange}
                placeholder="Seu nome completo"
                required
                disabled={!!user?.name}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="clientEmail">
                Email *
              </label>
              <Input
                id="clientEmail"
                name="clientEmail"
                type="email"
                value={formData.clientEmail}
                onChange={handleChange}
                placeholder="seu@email.com"
                required
                disabled={!!user?.email}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="clientPhone">
                Telefone *
              </label>
              <Input
                id="clientPhone"
                name="clientPhone"
                value={formData.clientPhone}
                onChange={handleChange}
                placeholder="(XX) XXXXX-XXXX"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="subject">
                Assunto *
              </label>
              <Input
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Ex: Direito de Família, Direito do Consumidor, etc."
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="description">
                Descrição do Problema *
              </label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Descreva detalhadamente sua situação..."
                rows={5}
                required
              />
              <p className="text-xs text-gray-500">
                Informe detalhes importantes para que possamos avaliar seu caso adequadamente.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <p className="text-xs text-gray-500 w-full mb-2">
              Ao enviar este formulário, você concorda com os termos de serviço e
              política de privacidade do NPJ.
            </p>
            <div className="flex w-full justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/client/status")}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-npj-blue hover:bg-blue-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Enviando..." : "Enviar Solicitação"}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default RequestForm;
