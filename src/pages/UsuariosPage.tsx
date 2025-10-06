import React, { useState, useEffect } from 'react';
import api from '../services/api';
import type { User } from '../types';

const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>;
const DeleteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>;

const UsuariosPage: React.FC = () => {
    const [usuarios, setUsuarios] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get<User[]>('/usuario').then(response => {
            setUsuarios(response.data);
        }).catch(err => {
            console.error("Erro ao buscar usuários", err);
        }).finally(() => setLoading(false));
    }, []);

    if (loading) return <p>A carregar usuários...</p>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Gerenciamento de Usuários</h1>
            
            </div>

            <div className="bg-white rounded-lg shadow-md">
               
                <div className="hidden md:grid md:grid-cols-4 p-4 border-b font-bold text-left">
                    <div className="px-3">Nome</div>
                    <div className="px-3">Email</div>
                    <div className="px-3">Cargo</div>
                    <div className="px-3">Ações</div>
                </div>
             
                <div>
                    {usuarios.map(u => (
                        <div key={u.id} className="grid grid-cols-2 md:grid-cols-4 p-4 border-b last:border-b-0 hover:bg-gray-50 items-center">
                            <div className="px-3"><span className="md:hidden font-bold">Nome: </span>{u.nome}</div>
                            <div className="px-3 text-right md:text-left"><span className="md:hidden font-bold">Email: </span>{u.email}</div>
                            <div className="px-3 mt-2 col-span-1 md:mt-0"><span className="md:hidden font-bold">Cargo: </span><span className="capitalize">{u.role}</span></div>
                            <div className="px-3 mt-2 col-span-1 text-right md:text-left md:mt-0">
                                <div className="flex space-x-2 justify-end md:justify-start">
                                    <button className="text-blue-600 hover:text-blue-800"><EditIcon /></button>
                                    <button className="text-red-600 hover:text-red-800"><DeleteIcon /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UsuariosPage;