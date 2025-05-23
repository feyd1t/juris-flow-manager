import React, { useState } from 'react';
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const RequestForm = () => {
  const { user, profile } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'FAMILY',
    urgency: 'MEDIUM',
    attachments: [] as File[],
    clientName: profile?.name || '',
    clientEmail: user?.email || '',
    clientPhone: '',
    clientAddress: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prevData => ({
        ...prevData,
        attachments: [...e.target.files],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description) {
      toast.error("Por favor, preencha o título e a descrição da solicitação.");
      return;
    }

    const form = new FormData();
    form.append('title', formData.title);
    form.append('description', formData.description);
    form.append('type', formData.type);
    form.append('urgency', formData.urgency);
    form.append('clientName', formData.clientName);
    form.append('clientEmail', formData.clientEmail);
    form.append('clientPhone', formData.clientPhone);
    form.append('clientAddress', formData.clientAddress);

    formData.attachments.forEach(file => {
      form.append('attachments', file);
    });

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Solicitação enviada com sucesso!");
      setFormData({
        title: '',
        description: '',
        type: 'FAMILY',
        urgency: 'MEDIUM',
        attachments: [] as File[],
        clientName: profile?.name || '',
        clientEmail: user?.email || '',
        clientPhone: '',
        clientAddress: '',
      });
    } catch (error) {
      console.error("Erro ao enviar solicitação:", error);
      toast.error("Erro ao enviar solicitação. Tente novamente.");
    }
  };

  return (
    <div className="container max-w-3xl mx-auto">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold text-npj-blue mb-6">Nova Solicitação de Atendimento</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-6">
            <Label htmlFor="title" className="block text-sm font-medium text-gray-700">Título da Solicitação</Label>
            <Input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          <div className="mb-6">
            <Label htmlFor="description" className="block text-sm font-medium text-gray-700">Descrição Detalhada</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-4 text-npj-blue">Detalhes da Solicitação</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="type" className="block text-sm font-medium text-gray-700">Tipo de Caso</Label>
                <Select onValueChange={(value) => handleSelectChange('type', value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FAMILY">Família</SelectItem>
                    <SelectItem value="CIVIL">Civil</SelectItem>
                    <SelectItem value="CRIMINAL">Criminal</SelectItem>
                    <SelectItem value="LABOR">Trabalhista</SelectItem>
                    <SelectItem value="OTHER">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="urgency" className="block text-sm font-medium text-gray-700">Nível de Urgência</Label>
                <Select onValueChange={(value) => handleSelectChange('urgency', value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione a urgência" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOW">Baixa</SelectItem>
                    <SelectItem value="MEDIUM">Média</SelectItem>
                    <SelectItem value="HIGH">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <Label htmlFor="attachments" className="block text-sm font-medium text-gray-700">Anexos (opcional)</Label>
            <Input
              type="file"
              id="attachments"
              name="attachments"
              multiple
              onChange={handleFileChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div className="mb-6">
            <h2 className="text-lg font-medium mb-4 text-npj-blue">Dados do Cliente</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="clientName" className="block text-sm font-medium text-gray-700">Nome Completo</label>
                <input
                  type="text"
                  id="clientName"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="clientEmail" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  id="clientEmail"
                  name="clientEmail"
                  value={formData.clientEmail}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="clientPhone" className="block text-sm font-medium text-gray-700">Telefone</label>
                <input
                  type="tel"
                  id="clientPhone"
                  name="clientPhone"
                  value={formData.clientPhone}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="clientAddress" className="block text-sm font-medium text-gray-700">Endereço</label>
                <input
                  type="text"
                  id="clientAddress"
                  name="clientAddress"
                  value={formData.clientAddress}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
          
          <div>
            <Button type="submit" className="bg-npj-blue text-white font-semibold rounded-md py-2 px-4 hover:bg-blue-700">
              Enviar Solicitação
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestForm;
