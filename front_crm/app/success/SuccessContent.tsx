"use client";

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import CasesList from '../CasesList';
import PendingCheckCases from '../PendingCheckCases';
import AcceptedCases from '../AcceptedCases';
import ReturnedCases from '../ReturnedCases';
import DecisionMadeCases from '../DecisionMadeCases';
import AppealCases from '../components/AppealCases';
import CreateCaseModal from '../CreateCaseModal';

export default function SuccessContent() {
  const router = useRouter();
  const { user, logout, loading } = useAuth();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeView, setActiveView] = useState<'submitted' | 'pending_check' | 'accepted' | 'returned' | 'decision_made' | 'appeal'>('submitted');

  useEffect(() => {
    // Если пользователь не авторизован, перенаправляем на главную
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const handleLogout = () => {
    logout();
  };

  const createCase = async (caseData: {
    number: string;
    title: string;
    description: string;
    filing_date: string;
    responsible_id: number;
  }) => {
    try {
      const token = sessionStorage.getItem('authToken');
      const response = await fetch('/api/cases', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(caseData),
      });

      if (response.ok) {
        setRefreshKey(prev => prev + 1);
      } else {
        console.error('Ошибка при создании дела');
        alert('Ошибка при создании дела');
      }
    } catch (error) {
      console.error('Ошибка сети:', error);
      alert('Ошибка сети при создании дела');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                <span className="text-green-600">✓</span> Добро пожаловать, {user?.name || 'Пользователь'}!
              </h1>
              <p className="text-gray-600">Вы успешно авторизованы в системе</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setCreateModalOpen(true)}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span>Создать дело</span>
              </button>
              <button
                onClick={handleLogout}
                className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
              >
                Выйти из системы
              </button>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveView('submitted')}
              className={`px-6 py-3 font-medium rounded-lg transition-colors ${
                activeView === 'submitted'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Подан
            </button>
            <button
              onClick={() => setActiveView('pending_check')}
              className={`px-6 py-3 font-medium rounded-lg transition-colors ${
                activeView === 'pending_check'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              На проверке
            </button>
            <button
              onClick={() => setActiveView('accepted')}
              className={`px-6 py-3 font-medium rounded-lg transition-colors ${
                activeView === 'accepted'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Принятые
            </button>
            <button
              onClick={() => setActiveView('returned')}
              className={`px-6 py-3 font-medium rounded-lg transition-colors ${
                activeView === 'returned'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Возвращенные
            </button>
            <button
              onClick={() => setActiveView('decision_made')}
              className={`px-6 py-3 font-medium rounded-lg transition-colors ${
                activeView === 'decision_made'
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Решение принято
            </button>
            <button
              onClick={() => setActiveView('appeal')}
              className={`px-6 py-3 font-medium rounded-lg transition-colors ${
                activeView === 'appeal'
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Апелляция
            </button>
          </div>
        </div>
        
        {activeView === 'submitted' ? (
          <CasesList key={refreshKey} />
        ) : activeView === 'pending_check' ? (
          <PendingCheckCases key={refreshKey} />
        ) : activeView === 'accepted' ? (
          <AcceptedCases key={refreshKey} />
        ) : activeView === 'returned' ? (
          <ReturnedCases key={refreshKey} />
        ) : activeView === 'decision_made' ? (
          <DecisionMadeCases key={refreshKey} />
        ) : (
          <AppealCases key={refreshKey} />
        )}
        
        <CreateCaseModal
          isOpen={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onSave={createCase}
        />
      </div>
    </div>
  );
}