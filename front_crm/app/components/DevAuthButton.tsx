"use client";

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function DevAuthButton() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleDevLogin = async (role: 'lawyer' | 'assistant') => {
    setLoading(true);
    try {
      const endpoint = role === 'lawyer' 
        ? '/api/auth/dev-token-lawyer' 
        : '/api/auth/dev-token-assistant';
        
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Dev auth failed');
      }

      const data = await response.json();
      
      // Сохраняем токен напрямую как в AuthContext
      if (data.access_token) {
        sessionStorage.setItem('authToken', data.access_token);
        // Перезагружаем страницу для применения токена
        window.location.reload();
      }
    } catch (error) {
      console.error('Dev login failed:', error);
      alert('Ошибка dev авторизации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
      <p className="text-sm text-yellow-800 mb-3 font-semibold">
        ⚠️ DEV Mode - Тестовая авторизация
      </p>
      <div className="space-y-2">
        <button
          onClick={() => handleDevLogin('lawyer')}
          disabled={loading}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Загрузка...' : 'Войти как Юрист'}
        </button>
        <button
          onClick={() => handleDevLogin('assistant')}
          disabled={loading}
          className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Загрузка...' : 'Войти как Ассистент'}
        </button>
      </div>
    </div>
  );
}