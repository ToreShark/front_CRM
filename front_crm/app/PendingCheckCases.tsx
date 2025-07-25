"use client";

import { useState, useEffect } from 'react';
import EditCaseModal from './EditCaseModal';

interface Case {
  id: number;
  number: string;
  title: string;
  description: string;
  status: string;
  filing_date?: string;
  check_deadline?: string;
  created_at?: string;
  updated_at?: string;
  responsible: {
    id: number;
    telegram_id: string;
    role: string;
    name: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    username: string;
  };
}

export default function PendingCheckCases() {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);

  const fetchCases = async () => {
    setLoading(true);
    try {
      const token = sessionStorage.getItem('authToken');
      const response = await fetch('/api/cases/pending-check-full', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setCases(Array.isArray(data) ? data : []);
      } else {
        console.error('Ошибка при получении дел на проверке');
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

  const updateCaseStatus = async (caseId: number, updates: { status: string; hearingDate?: string; acceptanceDate?: string; returnDate?: string; decisionDate?: string; appealHearingDate?: string }) => {
    try {
      const token = sessionStorage.getItem('authToken');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      // Найти текущее дело для сравнения
      const currentCase = cases.find(c => c.id === caseId);
      if (!currentCase) {
        console.error('Дело не найдено');
        return;
      }

      const requests = [];

      // 1. Обновить статус если он изменился
      if (updates.status !== currentCase.status) {
        if (updates.status === 'accepted') {
          // Использовать составной эндпоинт для перехода в статус "accepted"
          const acceptPayload: Record<string, string> = {};
          if (updates.acceptanceDate) acceptPayload.accepted_date = updates.acceptanceDate;
          if (updates.hearingDate) acceptPayload.hearing_date = updates.hearingDate;
          
          requests.push(
            fetch(`/api/cases/${caseId}/accept`, {
              method: 'PATCH',
              headers,
              body: JSON.stringify(acceptPayload),
            })
          );
        } else if (updates.status === 'returned') {
          // Использовать специальный эндпоинт для статуса "returned"
          const returnPayload: Record<string, string> = {
            'status': 'returned'
          };
          if (updates.returnDate) {
            returnPayload['return_date'] = updates.returnDate;
          }
          
          requests.push(
            fetch(`/api/cases/${caseId}/status`, {
              method: 'PATCH',
              headers,
              body: JSON.stringify(returnPayload),
            })
          );
        } else if (updates.status === 'appeal') {
          // Для статуса appeal добавляем дату апелляционного заседания
          const statusPayload: Record<string, string> = {
            'status': 'appeal'
          };
          if (updates.appealHearingDate) {
            statusPayload.appeal_hearing_date = updates.appealHearingDate;
          }
          
          requests.push(
            fetch(`/api/cases/${caseId}/status`, {
              method: 'PATCH',
              headers,
              body: JSON.stringify(statusPayload),
            })
          );
        } else {
          // Использовать обычный эндпоинт для других статусов
          requests.push(
            fetch(`/api/cases/${caseId}/status`, {
              method: 'PATCH',
              headers,
              body: JSON.stringify({ status: updates.status }),
            })
          );
        }
      }

      // 2. Обновить дату заседания если она изменилась (только если статус не меняется на accepted)
      if (updates.hearingDate !== undefined && updates.status !== 'accepted') {
        requests.push(
          fetch(`/api/cases/${caseId}/hearing`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify({ hearing_date: updates.hearingDate }),
          })
        );
      }

      // 3. Обновить дату принятия если она изменилась (только если статус не меняется на accepted)
      if (updates.acceptanceDate !== undefined && updates.status !== 'accepted') {
        requests.push(
          fetch(`/api/cases/${caseId}/accepted-date`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify({ accepted_date: updates.acceptanceDate }),
          })
        );
      }

      // Выполнить все необходимые запросы
      const responses = await Promise.all(requests);
      
      // Проверить, что все запросы успешны
      const allSuccessful = responses.every(response => response.ok);
      
      if (allSuccessful) {
        fetchCases();
      } else {
        console.error('Ошибка при обновлении дела');
        responses.forEach((response, index) => {
          if (!response.ok) {
            console.error(`Ошибка в запросе ${index + 1}:`, response.status, response.statusText);
          }
        });
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
      const token = sessionStorage.getItem('authToken');
      const response = await fetch(`/api/cases/${caseId}`, {
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

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Не указано';
    return new Date(dateString).toLocaleDateString('ru-RU');
  };

  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        <p className="mt-2 text-gray-600">Загрузка дел на проверке...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Дела на проверке</h2>
        <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
          На проверке
        </button>
      </div>
      {cases.length === 0 ? (
        <p className="text-gray-600">Дела на проверке не найдены</p>
      ) : (
        <div className="space-y-4">
          {cases.map((caseItem, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <span className="bg-orange-100 text-orange-800 text-sm font-medium px-3 py-1 rounded-full">
                  {caseItem.number}
                </span>
                <span className="text-sm text-gray-600">
                  Ответственный: {caseItem.responsible.name} ({caseItem.responsible.username})
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{caseItem.title}</h3>
              <p className="text-gray-600 mb-2">{caseItem.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Дата подачи:</span> {formatDate(caseItem.filing_date)}
                </div>
                <div>
                  <span className="font-medium">Срок проверки:</span> {formatDate(caseItem.check_deadline)}
                </div>
                <div>
                  <span className="font-medium">Роль ответственного:</span> {caseItem.responsible.role === 'lawyer' ? 'Юрист' : 'Ассистент'}
                </div>
                <div>
                  <span className="font-medium">Статус:</span> 
                  <span className="ml-1 px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">
                    На проверке
                  </span>
                </div>
              </div>
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