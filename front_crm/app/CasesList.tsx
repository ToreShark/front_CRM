"use client";

import { useState, useEffect } from 'react';
import EditCaseModal from './EditCaseModal';

interface Case {
  id: number;
  number: string;
  title: string;
  description: string;
  status: string;
  responsible: {
    name: string;
  };
}

export default function CasesList() {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);

  const fetchCases = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:3000/cases/submitted', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCases(data);
      } else {
        console.error('Ошибка при получении дел');
      }
    } catch (error) {
      console.error('Ошибка сети:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const updateCaseStatus = async (caseId: number, updates: { status: string; hearingDate?: string; acceptanceDate?: string }) => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://localhost:3000/cases/${caseId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: updates.status }),
      });

      if (response.ok) {
        fetchCases();
      } else {
        console.error('Ошибка при обновлении статуса дела');
      }
    } catch (error) {
      console.error('Ошибка сети:', error);
    }
  };

  const deleteCase = async (caseId: number) => {
    if (!confirm('Вы уверены, что хотите удалить это дело? Это действие нельзя отменить.')) {
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://localhost:3000/cases/${caseId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchCases();
      } else if (response.status === 403) {
        alert('Только юристы могут удалять дела');
      } else if (response.status === 404) {
        alert('Дело не найдено');
      } else {
        alert('Ошибка при удалении дела');
      }
    } catch (error) {
      console.error('Ошибка сети:', error);
      alert('Ошибка сети при удалении дела');
    }
  };

  const handleEditCase = (caseItem: Case) => {
    setSelectedCase(caseItem);
    setEditModalOpen(true);
  };

  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <p className="mt-2 text-gray-600">Загрузка дел...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Список дел</h2>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
          Подан
        </button>
      </div>
      {cases.length === 0 ? (
        <p className="text-gray-600">Дела не найдены</p>
      ) : (
        <div className="space-y-4">
          {cases.map((caseItem, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                  {caseItem.number}
                </span>
                <span className="text-sm text-gray-600">
                  Ответственный: {caseItem.responsible.name}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{caseItem.title}</h3>
              <p className="text-gray-600 mb-4">{caseItem.description}</p>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => handleEditCase(caseItem)}
                  className="px-3 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600 transition-colors"
                >
                  Изменить
                </button>
                <button
                  onClick={() => deleteCase(caseItem.id)}
                  className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                >
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {selectedCase && (
        <EditCaseModal
          case={selectedCase}
          isOpen={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setSelectedCase(null);
          }}
          onSave={updateCaseStatus}
        />
      )}
    </div>
  );
}