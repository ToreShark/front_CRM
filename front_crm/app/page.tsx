"use client";

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:3000/auth/dev-token-lawyer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        router.push('/success');
      } else {
        console.error('Ошибка при получении токена');
      }
    } catch (error) {
      console.error('Ошибка сети:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Авторизация</h1>
        <button
          onClick={handleLogin}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Войти
        </button>
      </div>
    </div>
  );
}
