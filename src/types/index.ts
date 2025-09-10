export type Role = 'ADMIN' | 'GARCOM';
export type CategoriaProduto = "PRATO" | "BEBIDA" | "SOBREMESA" | "ENTRADA";
export type StatusPedido = "Recebido" | "Em Preparo" | "Pronto";
export type StatusComanda = "aberta" | "fechada" | "paga" | "livre";

export interface User { 
  id: number; 
  nome: string; 
  email: string; 
  role: Role; 
}

export interface Produto { 
  id: number; 
  nome: string; 
  descricao: string; 
  preco: number; 
  categoria: CategoriaProduto; 
}

export interface PedidoItem { 
  produtoId: number; 
  nomeProduto: string; 
  quantidade: number; 
  observacao: string; 
}

export interface Pedido { 
  id: number; 
  comandaId: number; 
  status: StatusPedido; 
  itens: PedidoItem[]; 
  timestamp: Date; 
}

export interface Comanda { 
  id: number; 
  mesaId: number; 
  status: StatusComanda; 
}

export interface Mesa { 
  id: number; 
}