import React, { useState, useEffect } from 'react';
import api from '../services/api'; 
import { type Produto } from '../types'; 


const PlusIcon = () => <svg>{/*...*/}</svg>;
const EditIcon = () => <svg>{/*...*/}</svg>;
const DeleteIcon = () => <svg>{/*...*/}</svg>;

const ProdutosPage: React.FC = () => {
    
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProdutos = async () => {
            try {
           
                const response = await api.get<Produto[]>('/produto');
                setProdutos(response.data); 
            } catch (err) {
                setError('Falha ao carregar os produtos.');
                console.error(err);
            } finally {
                setLoading(false); 
            }
        };

        fetchProdutos();
    }, []); 

    if (loading) {
        return <p>A carregar produtos...</p>;
    }

    if (error) {
        return <p className="text-red-500">{error}</p>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Gerenciamento de Produtos</h1>
                <button className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600 flex items-center">
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
                                <td className="p-3">{p.categoria}</td>
                                <td className="p-3 flex space-x-2">
                                    <button className="text-blue-600 hover:text-blue-800"><EditIcon /></button>
                                    <button className="text-red-600 hover:text-red-800"><DeleteIcon /></button>
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