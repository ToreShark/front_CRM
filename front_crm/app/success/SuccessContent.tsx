"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import CasesList from '../CasesList';
import PendingCheckCases from '../PendingCheckCases';
import AcceptedCases from '../AcceptedCases';
import CreateCaseModal from '../CreateCaseModal';

export default function SuccessContent() {
  const router = useRouter();
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeView, setActiveView] = useState<'submitted' | 'pending_check' | 'accepted'>('submitted');

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    sessionStorage.clear();
    router.push('/');
  };

  const createCase = async (caseData: {
    number: string;
    title: string;
    description: string;
    filing_date: string;
    responsible_id: number;
  }) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:3000/cases', {
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
                <span className="text-green-600">✓</span> Успешная авторизация!
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
          </div>
        </div>
        
        {activeView === 'submitted' ? (
          <CasesList key={refreshKey} />
        ) : activeView === 'pending_check' ? (
          <PendingCheckCases key={refreshKey} />
        ) : (
          <AcceptedCases key={refreshKey} />
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