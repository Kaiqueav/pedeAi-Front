export type Role = 'admin' | 'garcom';
export type CategoriaProduto = "prato" | "bebida" | "sobremesa" | "entrada";
export type StatusPedido = "recebido" | "em_preparo" | "pronto" | "cancelado";
export type StatusComanda = "aberta" | "fechada" | "paga";

// --- INTERFACES QUE REPRESENTAM AS ENTIDADES DO BACKEND ---

export interface User { 
  id: number; 
  nome: string; 
  email: string; 
  role: Role; 
}

export interface Mesa { 
  id: number;
  numero: number; 
}

export interface Produto { 
  id: string;
  nome: string; 
  descricao: string; 
  preco: number; 
  categoria: CategoriaProduto; 
  disponivel: boolean;
}


export interface ItemPedido { 
  id: string; //
  quantidade: number; 
  precoUnitario: number;
  observacao: string;
  produto: Produto; 
}

export interface Comanda { 
  id: string; 
  status: StatusComanda;
  dataAbertura: Date;
  mesa: Mesa; 
  pedidos: Pedido[]; 
}

export interface Pedido {
  id: string;
  status: StatusPedido; 
  dataPedido: Date;

  itensPedido: ItemPedido[]; 
  comanda: Comanda;
}

// --- TIPO ESPECÍFICO PARA O CARRINHO NO FRONTEND ---
export interface ItemCarrinho extends Produto {
  quantidade: number;
  observacao?: string;
}