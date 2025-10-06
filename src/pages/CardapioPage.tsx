import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import type { Produto, CategoriaProduto, ItemCarrinho, Mesa, Pedido, StatusPedido, ItemPedido } from '../types';
import CarrinhoModal from '../components/CarrinhoModal';


interface ItemPedidoDto {
  produtoId: string;
  quantidade: number;
  observacao?: string;
}

interface CreatePedidoDto {
  mesaId: number;
  itens: ItemPedidoDto[];
}


const ShoppingCartIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

const StatusTracker: React.FC<{ pedido: Pedido, onNovoPedido: () => void }> = ({ pedido, onNovoPedido }) => {
    const getStatusInfo = (status: StatusPedido) => {
        switch (status) {
            case 'recebido':
                return { text: 'Recebido pela cozinha', color: 'bg-blue-500' };
            case 'em_preparo':
                return { text: 'Em preparo', color: 'bg-yellow-500' };
            case 'pronto':
                return { text: 'Pronto! A caminho da sua mesa.', color: 'bg-green-500' };
            default:
                return { text: 'Aguardando', color: 'bg-gray-500' };
        }
    };
    
    const statusInfo = getStatusInfo(pedido.status);

    return (
        <div className="text-center p-6 md:p-10 flex flex-col items-center justify-center h-screen bg-gray-50">
            <h2 className="text-3xl font-bold text-gray-800">O seu pedido está a ser preparado!</h2>
            <p className="mt-2 text-gray-600">Pode acompanhar o estado do seu pedido abaixo.</p>

            <div className="mt-8 w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <span className="font-semibold text-lg">Status Atual:</span>
                    <span className={`px-3 py-1 text-white text-sm font-bold rounded-full ${statusInfo.color}`}>
                        {statusInfo.text}
                    </span>
                </div>
                <ul className="list-disc list-inside mt-4 text-left text-sm text-gray-700">
                  
                    {pedido.itensPedido.map((item: ItemPedido, index: number) => (
                        <li key={index}>{item.quantidade}x {item.produto.nome}</li>
                    ))}
                </ul>
            </div>

            <button onClick={onNovoPedido} className="mt-8 bg-orange-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-orange-600">
                + Fazer Novo Pedido
            </button>
        </div>
    );
};



const CardapioPage: React.FC = () => {
    const { numeroMesa } = useParams<{ numeroMesa: string }>();
    
    // Estados
    const [mesa, setMesa] = useState<Mesa | null>(null);
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [pedidoRecente, setPedidoRecente] = useState<Pedido | null>(() => {
        const pedidoGuardado = localStorage.getItem(`pedido_mesa_${numeroMesa}`);
        return pedidoGuardado ? JSON.parse(pedidoGuardado) : null;
    });

   
    useEffect(() => {
        const fetchInitialData = async () => {
            if (!numeroMesa) {
                setError("Número da mesa não fornecido na URL.");
                setLoading(false);
                return;
            }
            try {
                const mesaResponse = await api.get<Mesa>(`/mesa/numero/${numeroMesa}`);
                setMesa(mesaResponse.data);
                const produtosResponse = await api.get<Produto[]>('/produto');
                setProdutos(produtosResponse.data.filter(p => p.disponivel));
            } catch (err) {
                setError('Cardápio indisponível ou mesa inválida.');
            } finally {
                setLoading(false);
            }
        };

        if (!pedidoRecente) {
            fetchInitialData();
        } else {
            setLoading(false);
        }
    }, [numeroMesa, pedidoRecente]);


    useEffect(() => {
        if (!pedidoRecente || pedidoRecente.status === 'pronto') return;
        const intervalId = setInterval(async () => {
            try {
                const response = await api.get<Pedido>(`/pedidos/${pedidoRecente.id}`);
                setPedidoRecente(response.data);
                localStorage.setItem(`pedido_mesa_${numeroMesa}`, JSON.stringify(response.data));
                if (response.data.status === 'pronto') {
                    clearInterval(intervalId);
                }
            } catch (err) {
                console.error("Erro ao buscar status do pedido:", err);
                clearInterval(intervalId);
            }
        }, 15000);
        return () => clearInterval(intervalId);
    }, [pedidoRecente?.id, numeroMesa]);

    
    const adicionarAoCarrinho = (produto: Produto) => {
        setCarrinho(prev => {
            const itemExistente = prev.find(item => item.id === produto.id);
            if (itemExistente) {
                return prev.map(item =>
                    item.id === produto.id ? { ...item, quantidade: item.quantidade + 1 } : item
                );
            }
            return [...prev, { ...produto, quantidade: 1 }];
        });
    };
    
    const handleUpdateQuantidade = (produtoId: string, novaQuantidade: number) => {
        if (novaQuantidade <= 0) {
            setCarrinho(prev => prev.filter(item => item.id !== produtoId));
        } else {
            setCarrinho(prev => prev.map(item =>
                item.id === produtoId ? { ...item, quantidade: novaQuantidade } : item
            ));
        }
    };

    // Lógica de submissão do pedido
    const enviarPedido = async () => {
        if (!mesa || carrinho.length === 0) return;
        setIsSubmitting(true);
        setError(null);
        
        const pedidoDto: CreatePedidoDto = {
            mesaId: mesa.id,
            itens: carrinho.map(item => ({
                produtoId: item.id,
                quantidade: item.quantidade,
                observacao: item.observacao,
            })),
        };

        try {
            const response = await api.post<Pedido>('/pedidos', pedidoDto);
            setPedidoRecente(response.data);
            localStorage.setItem(`pedido_mesa_${numeroMesa}`, JSON.stringify(response.data));
            setCarrinho([]);
            setIsCartOpen(false);
        } catch (err) {
            setError("Não foi possível enviar o seu pedido.");
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleNovoPedido = () => {
        localStorage.removeItem(`pedido_mesa_${numeroMesa}`);
        setPedidoRecente(null);
    };

    const totalItensCarrinho = carrinho.reduce((total, item) => total + item.quantidade, 0);

    const produtosAgrupados = produtos.reduce((acc, product) => {
        (acc[product.categoria] = acc[product.categoria] || []).push(product);
        return acc;
    }, {} as Record<CategoriaProduto, Produto[]>);
    
    if (loading) return <div className="text-center p-10">A carregar...</div>;
    if (error) return <div className="text-center p-10 text-red-500">{error}</div>;

    if (pedidoRecente) {
        return <StatusTracker pedido={pedidoRecente} onNovoPedido={handleNovoPedido} />;
    }

    return (
        <div className="container mx-auto p-4 font-sans">
            <CarrinhoModal 
                isOpen={isCartOpen}
                itens={carrinho}
                onClose={() => setIsCartOpen(false)}
                onFinalizar={enviarPedido}
                onUpdateQuantidade={handleUpdateQuantidade}
                isSubmitting={isSubmitting}
            />

            <header className="text-center my-4 md:my-8">
                <h1 className="text-4xl md:text-5xl font-bold text-orange-600">PedeAí</h1>
                <p className="text-lg md:text-xl text-gray-600 mt-2">Cardápio - Mesa {numeroMesa}</p>
            </header>

            <main>
                {Object.keys(produtosAgrupados).map((categoria) => (
                    <section key={categoria} className="mb-12">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 border-b-2 border-orange-500 pb-2 mb-6 capitalize">{categoria}</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      
                            {produtosAgrupados[categoria as CategoriaProduto].map((produto: Produto) => (
                                <div key={produto.id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
                                    <div className="p-4 md:p-6 flex-grow">
                                        <h3 className="text-lg md:text-xl font-semibold text-gray-900">{produto.nome}</h3>
                                        <p className="text-gray-600 mt-2 text-sm">{produto.descricao}</p>
                                    </div>
                                    <div className="p-4 md:p-6 bg-gray-50 flex justify-between items-center">
                                        <p className="text-md md:text-lg font-bold text-green-600">{produto.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                                        <button onClick={() => adicionarAoCarrinho(produto)} className="bg-orange-500 text-white font-bold py-2 px-3 md:px-4 rounded-lg hover:bg-orange-600 transition-colors text-sm">
                                            Adicionar
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                ))}
            </main>
            
            {totalItensCarrinho > 0 && (
                <div className="fixed bottom-6 right-6 z-30">
                    <button 
                        onClick={() => setIsCartOpen(true)} 
                        className="bg-orange-500 text-white font-bold rounded-full p-4 shadow-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 flex items-center animate-pulse"
                    >
                        <ShoppingCartIcon />
                        <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {totalItensCarrinho}
                        </span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default CardapioPage;