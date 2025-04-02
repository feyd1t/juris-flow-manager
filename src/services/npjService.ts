
// Mock data service for NPJ management system

export type CaseStatus = 'pending' | 'active' | 'completed' | 'archived' | 'urgent';
export type CaseType = 'civil' | 'criminal' | 'family' | 'labor' | 'administrative' | 'other';

export interface Case {
  id: string;
  title: string;
  clientName: string;
  clientId: string;
  description: string;
  status: CaseStatus;
  type: CaseType;
  assignedTo: string[];
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  documents?: string[];
}

export interface ClientRequest {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  subject: string;
  description: string;
  status: 'new' | 'reviewed' | 'accepted' | 'rejected';
  createdAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  comments?: string;
}

// Mock cases
const mockCases: Case[] = [
  {
    id: '1',
    title: 'Ação de Pensão Alimentícia',
    clientName: 'Maria Silva',
    clientId: '101',
    description: 'Cliente busca ajuda para estabelecer pensão alimentícia para dois filhos menores.',
    status: 'active',
    type: 'family',
    assignedTo: ['2', '3'], // IDs of students/lawyers
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-03-10'),
    dueDate: new Date('2023-04-20'),
  },
  {
    id: '2',
    title: 'Rescisão Contratual Trabalhista',
    clientName: 'João Pereira',
    clientId: '102',
    description: 'Ex-funcionário buscando indenização por demissão sem justa causa.',
    status: 'pending',
    type: 'labor',
    assignedTo: ['2'],
    createdAt: new Date('2023-02-05'),
    updatedAt: new Date('2023-02-06'),
    dueDate: new Date('2023-05-10'),
  },
  {
    id: '3',
    title: 'Defesa Consumidor - Produto Defeituoso',
    clientName: 'Ana Oliveira',
    clientId: '103',
    description: 'Cliente comprou um produto eletrônico com defeito e a loja recusa substituição.',
    status: 'completed',
    type: 'civil',
    assignedTo: ['3'],
    createdAt: new Date('2023-01-25'),
    updatedAt: new Date('2023-03-15'),
  },
  {
    id: '4',
    title: 'Ação de Despejo',
    clientName: 'Carlos Santos',
    clientId: '104',
    description: 'Cliente não consegue obter devolução de imóvel alugado após término do contrato.',
    status: 'urgent',
    type: 'civil',
    assignedTo: ['2', '3'],
    createdAt: new Date('2023-03-01'),
    updatedAt: new Date('2023-03-18'),
    dueDate: new Date('2023-04-05'),
  },
];

// Mock client requests
const mockClientRequests: ClientRequest[] = [
  {
    id: '101',
    clientName: 'Roberto Almeida',
    clientEmail: 'roberto@email.com',
    clientPhone: '(11) 98765-4321',
    subject: 'Consulta sobre Pensão',
    description: 'Gostaria de saber meus direitos sobre pensão alimentícia para meus filhos.',
    status: 'new',
    createdAt: new Date('2023-03-18'),
  },
  {
    id: '102',
    clientName: 'Lucia Mendes',
    clientEmail: 'lucia@email.com',
    clientPhone: '(11) 91234-5678',
    subject: 'Problema com Vizinho',
    description: 'Estou tendo problemas com barulho excessivo do meu vizinho durante a noite.',
    status: 'reviewed',
    createdAt: new Date('2023-03-15'),
    reviewedAt: new Date('2023-03-17'),
    reviewedBy: 'Advogado Orientador',
    comments: 'Caso potencial para mediação.',
  },
  {
    id: '103',
    clientName: 'Pedro Costa',
    clientEmail: 'pedro@email.com',
    clientPhone: '(11) 92345-6789',
    subject: 'Dúvida sobre Herança',
    description: 'Meu pai faleceu e deixou bens. Como proceder para abertura de inventário?',
    status: 'accepted',
    createdAt: new Date('2023-03-10'),
    reviewedAt: new Date('2023-03-12'),
    reviewedBy: 'Admin NPJ',
    comments: 'Caso aceito. Marcar entrevista inicial.',
  },
  {
    id: '104',
    clientName: 'Sandra Vieira',
    clientEmail: 'sandra@email.com',
    clientPhone: '(11) 93456-7890',
    subject: 'Acidente de Trânsito',
    description: 'Sofri um acidente de trânsito onde não tive culpa e quero processar o causador.',
    status: 'rejected',
    createdAt: new Date('2023-03-05'),
    reviewedAt: new Date('2023-03-08'),
    reviewedBy: 'Advogado Orientador',
    comments: 'Caso não se enquadra nos critérios de atendimento do NPJ.',
  },
];

// Statistics for dashboard
export interface DashboardStats {
  totalCases: number;
  activeCases: number;
  pendingRequests: number;
  casesThisMonth: number;
  requestsThisMonth: number;
  casesByType: Record<CaseType, number>;
  casesByStatus: Record<CaseStatus, number>;
}

// Service functions
export const npjService = {
  // Case management
  getCases: (): Promise<Case[]> => {
    return Promise.resolve(mockCases);
  },
  
  getCaseById: (id: string): Promise<Case | undefined> => {
    const foundCase = mockCases.find(c => c.id === id);
    return Promise.resolve(foundCase);
  },
  
  createCase: (newCase: Omit<Case, 'id' | 'createdAt' | 'updatedAt'>): Promise<Case> => {
    const createdCase: Case = {
      ...newCase,
      id: (mockCases.length + 1).toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    mockCases.push(createdCase);
    return Promise.resolve(createdCase);
  },
  
  updateCase: (id: string, updates: Partial<Case>): Promise<Case | undefined> => {
    const index = mockCases.findIndex(c => c.id === id);
    if (index >= 0) {
      mockCases[index] = {
        ...mockCases[index],
        ...updates,
        updatedAt: new Date(),
      };
      return Promise.resolve(mockCases[index]);
    }
    return Promise.resolve(undefined);
  },
  
  // Client request management
  getClientRequests: (): Promise<ClientRequest[]> => {
    return Promise.resolve(mockClientRequests);
  },
  
  getClientRequestById: (id: string): Promise<ClientRequest | undefined> => {
    const foundRequest = mockClientRequests.find(r => r.id === id);
    return Promise.resolve(foundRequest);
  },
  
  createClientRequest: (newRequest: Omit<ClientRequest, 'id' | 'createdAt' | 'status'>): Promise<ClientRequest> => {
    const createdRequest: ClientRequest = {
      ...newRequest,
      id: (100 + mockClientRequests.length + 1).toString(),
      createdAt: new Date(),
      status: 'new',
    };
    mockClientRequests.push(createdRequest);
    return Promise.resolve(createdRequest);
  },
  
  updateClientRequest: (id: string, updates: Partial<ClientRequest>): Promise<ClientRequest | undefined> => {
    const index = mockClientRequests.findIndex(r => r.id === id);
    if (index >= 0) {
      mockClientRequests[index] = {
        ...mockClientRequests[index],
        ...updates,
      };
      return Promise.resolve(mockClientRequests[index]);
    }
    return Promise.resolve(undefined);
  },
  
  // Dashboard statistics
  getDashboardStats: (): Promise<DashboardStats> => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    const casesThisMonth = mockCases.filter(c => c.createdAt >= firstDayOfMonth).length;
    const requestsThisMonth = mockClientRequests.filter(r => r.createdAt >= firstDayOfMonth).length;
    
    const casesByType = mockCases.reduce((acc, c) => {
      acc[c.type] = (acc[c.type] || 0) + 1;
      return acc;
    }, {} as Record<CaseType, number>);
    
    const casesByStatus = mockCases.reduce((acc, c) => {
      acc[c.status] = (acc[c.status] || 0) + 1;
      return acc;
    }, {} as Record<CaseStatus, number>);
    
    return Promise.resolve({
      totalCases: mockCases.length,
      activeCases: mockCases.filter(c => c.status === 'active').length,
      pendingRequests: mockClientRequests.filter(r => r.status === 'new').length,
      casesThisMonth,
      requestsThisMonth,
      casesByType,
      casesByStatus,
    });
  }
};
