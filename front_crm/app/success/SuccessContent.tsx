"use client";

import { useRouter } from 'next/navigation';
import CasesList from '../CasesList';

export default function SuccessContent() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    sessionStorage.clear();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            <span className="text-green-600">✓</span> Успешная авторизация!
          </h1>
          <p className="text-gray-600 mb-6">Вы успешно авторизованы в системе</p>
          <button
            onClick={handleLogout}
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
          >
            Выйти из системы
          </button>
        </div>
        <CasesList />
      </div>
    </div>
  );
}