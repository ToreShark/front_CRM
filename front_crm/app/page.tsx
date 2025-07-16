"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './contexts/AuthContext';
import TelegramLoginButton from './components/TelegramLoginButton';

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    // Если пользователь уже авторизован, перенаправляем на success
    if (user && !loading) {
      router.push('/success');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-600">Проверка авторизации...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Авторизация через Telegram</h1>
        <p className="text-gray-600 text-center mb-6">
          Для входа в систему используйте свой аккаунт Telegram
        </p>
        <TelegramLoginButton />
      </div>
    </div>
  );
}
