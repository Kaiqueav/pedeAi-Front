export type Role = 'admin' | 'garcom';
export type CategoriaProduto = 'prato' | 'bebida' | 'sobremesa' | 'entrada';
export type StatusPedido = 'recebido' | 'em_preparo' | 'pronto' | 'cancelado';
export type StatusComanda = 'aberta' | 'fechada' | 'paga';
export type Page = 'login' | 'dashboard' | 'produtos' | 'usuarios' | 'mesas' | 'cozinha' | 'comanda' | 'cardapio';

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  role: Role;
  senha?: string;
}

export interface Produto {
  id: string;
  nome: string;
  descricao?: string;
  preco: number;
  categoria: CategoriaProduto;
  disponivel: boolean;
}

export interface ItemPedido {
  id: string;
  produto: Produto;
  quantidade: number;
  observacao?: string;
  precoUnitario: number;
}

export interface Pedido {
  id: string;
  status: StatusPedido;
  dataPedido: string;
  itensPedido: ItemPedido[];
  comanda: Comanda;
}

export interface Comanda {
  id: string;
  status: StatusComanda;
  mesa: Mesa;
  pedidos: Pedido[];
  total?: number;
}

export interface Mesa {
  id: number;
  numero: number;
  comandaAtiva?: Comanda | null;
}

export type CarrinhoItem = {
    produtoId: string;
    nome: string;
    quantidade: number;
    precoUnitario: number;
    observacao: string;
}