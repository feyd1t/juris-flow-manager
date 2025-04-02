
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { npjService, DashboardStats, Case, ClientRequest } from "@/services/npjService";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentCases, setRecentCases] = useState<Case[]>([]);
  const [recentRequests, setRecentRequests] = useState<ClientRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashboardStats, cases, requests] = await Promise.all([
          npjService.getDashboardStats(),
          npjService.getCases(),
          npjService.getClientRequests(),
        ]);

        setStats(dashboardStats);
        setRecentCases(cases.slice(0, 3));
        setRecentRequests(requests.slice(0, 3));
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Prepare chart data
  const getTypeChartData = () => {
    if (!stats) return [];
    return Object.entries(stats.casesByType).map(([type, count]) => ({
      name: type,
      value: count,
    }));
  };

  const getStatusChartData = () => {
    if (!stats) return [];
    return Object.entries(stats.casesByStatus).map(([status, count]) => ({
      name: status,
      value: count,
    }));
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  // Format date for display
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-npj-blue font-bold text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Painel de Controle</h1>
        <p className="text-gray-500">Bem-vindo ao NPJ Flow Manager</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Total de Casos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.totalCases}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Casos Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-status-active">{stats?.activeCases}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Novas Solicitações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-status-pending">{stats?.pendingRequests}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-500">Casos no Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-npj-blue">{stats?.casesThisMonth}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Casos por Tipo</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={getTypeChartData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {getTypeChartData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Casos por Status</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={getStatusChartData()}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#0F52BA" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Cases */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Casos Recentes</CardTitle>
          <Button variant="outline" size="sm" onClick={() => navigate("/cases")}>
            Ver Todos
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-3 px-2">ID</th>
                  <th className="py-3 px-2">Título</th>
                  <th className="py-3 px-2">Cliente</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2">Criado</th>
                </tr>
              </thead>
              <tbody>
                {recentCases.map((caseItem) => (
                  <tr key={caseItem.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-2">{caseItem.id}</td>
                    <td className="py-2 px-2">{caseItem.title}</td>
                    <td className="py-2 px-2">{caseItem.clientName}</td>
                    <td className="py-2 px-2">
                      <StatusBadge status={caseItem.status} />
                    </td>
                    <td className="py-2 px-2">{formatDate(caseItem.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Recent Requests */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Solicitações Recentes</CardTitle>
          <Button variant="outline" size="sm" onClick={() => navigate("/requests")}>
            Ver Todas
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-3 px-2">ID</th>
                  <th className="py-3 px-2">Cliente</th>
                  <th className="py-3 px-2">Assunto</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2">Criado</th>
                </tr>
              </thead>
              <tbody>
                {recentRequests.map((request) => (
                  <tr key={request.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-2">{request.id}</td>
                    <td className="py-2 px-2">{request.clientName}</td>
                    <td className="py-2 px-2">{request.subject}</td>
                    <td className="py-2 px-2">
                      <StatusBadge status={request.status} />
                    </td>
                    <td className="py-2 px-2">{formatDate(request.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
