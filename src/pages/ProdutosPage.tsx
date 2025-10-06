import React, { useState, useEffect } from 'react';
import api from '../services/api';
import type { Produto } from '../types';
import ProdutoFormModal from '../components/ProdutoFormModal'; 

const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>;
const DeleteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>;

const ProdutosPage: React.FC = () => {
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [loading, setLoading] = useState(true);
    
    // 2. Es
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [produtoParaEditar, setProdutoParaEditar] = useState<Produto | null>(null);

    const fetchProdutos = () => {
        setLoading(true);
        api.get<Produto[]>('/produto')
            .then(response => setProdutos(response.data))
            .catch(err => console.error("Erro ao buscar produtos", err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchProdutos();
    }, []);
    
  
    const handleOpenModal = (produto: Produto | null = null) => {
        setProdutoParaEditar(produto);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setProdutoParaEditar(null);
    };

 
    const handleSave = () => {
        fetchProdutos();
    };

    const handleDelete = async (produtoId: string) => {
        if (window.confirm("Tem a certeza que deseja apagar este produto?")) {
            try {
                await api.delete(`/produto/${produtoId}`);
                fetchProdutos(); 
            } catch (error) {
                console.error("Erro ao apagar produto:", error);
                alert("Não foi possível apagar o produto.");
            }
        }
    };

    if (loading) return <p>A carregar produtos...</p>;

    return (
        <div>
    
            {isModalOpen && (
                <ProdutoFormModal 
                    produto={produtoParaEditar}
                    onClose={handleCloseModal}
                    onSave={handleSave}
                />
            )}

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Gerenciamento de Produtos</h1>
              
                <button onClick={() => handleOpenModal()} className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 flex items-center">
                    <PlusIcon /> Adicionar Produto
                </button>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b">
                            <th className="p-3">Nome</th>
                            <th className="p-3">Preço</th>
                            <th className="p-3">Categoria</th>
                            <th className="p-3">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {produtos.map(p => (
                            <tr key={p.id} className="border-b hover:bg-gray-50">
                                <td className="p-3">{p.nome}</td>
                                <td className="p-3">{p.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
                                <td className="p-3 capitalize">{p.categoria}</td>
                                <td className="p-3 flex space-x-2">
                                    <button onClick={() => handleOpenModal(p)} className="text-blue-600 hover:text-blue-800"><EditIcon /></button>
                                    <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:text-red-800"><DeleteIcon /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProdutosPage;