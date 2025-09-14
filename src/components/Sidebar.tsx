import type { User } from "../types";

interface SideBarProps{
    user: User,
    navigate: (page: string)=> void;
}

const Sidebar: React.FC<SideBarProps> = ({user, navigate})=>( <aside className="w-64 bg-gray-800 text-white flex-col hidden md:flex">
        <div className="p-4 text-2xl font-bold border-b border-gray-700">PedeAí</div>
        <nav className="flex-grow p-4 space-y-2">
            {user.role === 'ADMIN' && <a onClick={() => navigate('dashboard')} className="block py-2 px-3 rounded hover:bg-gray-700 cursor-pointer">Dashboard</a>}
            {user.role === 'ADMIN' && <a onClick={() => navigate('produtos')} className="block py-2 px-3 rounded hover:bg-gray-700 cursor-pointer">Produtos</a>}
            {user.role === 'ADMIN' && <a onClick={() => navigate('usuarios')} className="block py-2 px-3 rounded hover:bg-gray-700 cursor-pointer">Usuários</a>}
            <a onClick={() => navigate('mesas')} className="block py-2 px-3 rounded hover:bg-gray-700 cursor-pointer">Mesas</a>
            <a onClick={() => navigate('cozinha')} className="block py-2 px-3 rounded hover:bg-gray-700 cursor-pointer">Cozinha (KDS)</a>
        </nav>
        <div className="p-4 border-t border-gray-700">
            <p>{user.nome}</p>
            <p className="text-sm text-gray-400">{user.role}</p>
        </div>
    </aside>)

    export default Sidebar;