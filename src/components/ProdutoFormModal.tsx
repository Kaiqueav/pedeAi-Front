import React, { useState } from 'react';
import type { CategoriaProduto, Produto } from '../types';
import api from '../services/api';

interface ProdutoFormModalProps {
  produto?: Produto | null; 
  onClose: () => void;
  onSave: () => void;
}


type FormData = {
  nome: string;
  descricao: string;
  preco: number;
  categoria: CategoriaProduto;
};

const ProdutoFormModal: React.FC<ProdutoFormModalProps> = ({ produto, onClose, onSave }) => {
  const [formData, setFormData] = useState<FormData>({
    nome: produto?.nome || '',
    descricao: produto?.descricao || '',
    preco: produto?.preco || 0,
    categoria: produto?.categoria || 'prato',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'preco' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

  
    if (!formData.nome || formData.preco <= 0) {
        setError("Nome e Preço (maior que zero) são obrigatórios.");
        setIsSubmitting(false);
        return;
    }

    try {
        if (produto) {
           
            await api.patch(`/produto/${produto.id}`, formData);
        } else {
            
            await api.post('/produto', formData);
        }
        onSave(); 
        onClose(); 
    } catch (err: any) {
        console.error("Erro ao salvar produto:", err);
        setError(err.response?.data?.message || "Ocorreu um erro ao salvar o produto.");
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
   
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
     
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">{produto ? 'Editar Produto' : 'Criar Novo Produto'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="nome" className="block text-gray-700 font-semibold mb-2">Nome do Produto</label>
            <input type="text" id="nome" name="nome" value={formData.nome} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" required />
          </div>
          <div className="mb-4">
            <label htmlFor="descricao" className="block text-gray-700 font-semibold mb-2">Descrição (Opcional)</label>
            <textarea id="descricao" name="descricao" value={formData.descricao} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" rows={3}></textarea>
          </div>
          <div className="mb-4">
            <label htmlFor="preco" className="block text-gray-700 font-semibold mb-2">Preço (R$)</label>
            <input type="number" id="preco" name="preco" value={formData.preco} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" required step="0.01" min="0" />
          </div>
          <div className="mb-6">
            <label htmlFor="categoria" className="block text-gray-700 font-semibold mb-2">Categoria</label>
            <select id="categoria" name="categoria" value={formData.categoria} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500">
              <option value="prato">Prato</option>
              <option value="bebida">Bebida</option>
              <option value="sobremesa">Sobremesa</option>
              <option value="entrada">Entrada</option>
            </select>
          </div>
          
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <div className="flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300">Cancelar</button>
            <button type="submit" disabled={isSubmitting} className="px-6 py-2 rounded-lg text-white bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300">
              {isSubmitting ? 'A salvar...' : 'Salvar Produto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProdutoFormModal;