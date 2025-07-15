"use client";

import { useState } from 'react';

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

interface EditCaseModalProps {
  case: Case;
  isOpen: boolean;
  onClose: () => void;
  onSave: (caseId: number, updates: { status: string; hearingDate?: string; acceptanceDate?: string }) => void;
}

function getAvailableStatuses(currentStatus: string) {
  const transitions = {
    'submitted': ['pending_check', 'accepted', 'returned'],
    'pending_check': ['accepted', 'returned'],
    'accepted': ['decision_made'],
    'decision_made': ['appeal', 'closed'],
    'returned': ['submitted'],
    'appeal': ['closed'],
    'closed': []
  };

  return transitions[currentStatus as keyof typeof transitions] || [];
}

const statusLabels = {
  'submitted': 'Подано в суд',
  'pending_check': 'На проверке',
  'accepted': 'Принято',
  'returned': 'Возвращено',
  'closed': 'Дело закрыто',
  'decision_made': 'Решение принято',
  'appeal': 'Обжалование'
};

export default function EditCaseModal({ case: caseItem, isOpen, onClose, onSave }: EditCaseModalProps) {
  const [status, setStatus] = useState(caseItem.status);
  const [hearingDate, setHearingDate] = useState('');
  const [hearingTime, setHearingTime] = useState('');
  const [acceptanceDate, setAcceptanceDate] = useState('');

  if (!isOpen) return null;

  const availableStatuses = getAvailableStatuses(caseItem.status);

  const handleSave = () => {
    if (!hearingDate || !hearingTime) {
      alert('Дата и время заседания обязательны для заполнения');
      return;
    }
    
    const updates = {
      status,
      hearingDate: hearingDate && hearingTime ? `${hearingDate}T${hearingTime}` : undefined,
      acceptanceDate: acceptanceDate || undefined
    };
    onSave(caseItem.id, updates);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Изменить дело {caseItem.number}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Статус дела</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={caseItem.status}>
                {statusLabels[caseItem.status as keyof typeof statusLabels]} (текущий)
              </option>
              {availableStatuses.map((statusOption) => (
                <option key={statusOption} value={statusOption}>
                  {statusLabels[statusOption as keyof typeof statusLabels]}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Дата заседания *
            </label>
            <input
              type="date"
              value={hearingDate}
              onChange={(e) => setHearingDate(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Время заседания *
            </label>
            <input
              type="time"
              value={hearingTime}
              onChange={(e) => setHearingTime(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Дата принятия дела</label>
            <input
              type="date"
              value={acceptanceDate}
              onChange={(e) => setAcceptanceDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            Отмена
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium transition-colors"
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
}