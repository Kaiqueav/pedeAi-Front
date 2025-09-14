// --- TIPOS GLOBAIS DA APLICAÇÃO ---

export type Role = 'ADMIN' | 'GARCOM';
export type CategoriaProduto = "prato" | "bebida" | "sobremesa" | "entrada";

// CORREÇÃO AQUI: Alinhar com os valores do enum do backend
export type StatusPedido = "recebido" | "em_preparo" | "pronto" | "cancelado";
export type StatusComanda = "aberta" | "fechada" | "paga";

export interface User { 
  id: number; 
  nome: string; 
  email: string; 
  role: Role; 
}

export interface Produto { 
  id: string; // O backend usa UUID para produtos
  nome: string; 
  descricao: string; 
  preco: number; 
  categoria: CategoriaProduto; 
  disponivel: boolean;
}

export interface PedidoItem { 
  produtoId: string; 
  nomeProduto: string; 
  quantidade: number; 
  observacao: string;
}

export interface Pedido {
  itensPedido: any; 
  id: string; // O backend usa UUID para pedidos
  comandaId: string; 
  status: StatusPedido; 
  itens: PedidoItem[]; 
  timestamp: Date; 
}

export interface Comanda { 
  id: string; // O backend usa UUID para comandas
  mesaId: number; 
  status: StatusComanda;
  mesa?: Mesa; // Adicionado para corresponder aos dados da API
  pedidos: Pedido[]; // Adicionado para corresponder aos dados da API
}

export interface Mesa { 
  id: number;
  numero: number; // Adicionado para corresponder aos dados da API
}