import api from './api';
import { type User } from '../types';


interface LoginResponse {
  user: User;
  access_token: string;
}


const login = async (email: string, senha: string): Promise<User> => {
  try {
 
    const response = await api.post<LoginResponse>('/auth/login', { email, senha });

    if (response.data.access_token) {
     
      localStorage.setItem('user_token', response.data.access_token);
      localStorage.setItem('user_data', JSON.stringify(response.data.user));
  
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
      return response.data.user;
    }
    throw new Error('Token não recebido');
  } catch (error) {
    console.error("Erro no login:", error);
 
    localStorage.removeItem('user_token');
    localStorage.removeItem('user_data');
    throw error; 
  }
};

const logout = () => {
  localStorage.removeItem('user_token');
  localStorage.removeItem('user_data');
  delete api.defaults.headers.common['Authorization'];
};

const getAuthenticatedUser = (): User | null => {
    const userData = localStorage.getItem('user_data');
    const token = localStorage.getItem('user_token');

    if (userData && token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        return JSON.parse(userData);
    }
    return null;
};


export const authService = {
  login,
  logout,
  getAuthenticatedUser,
};