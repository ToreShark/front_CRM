"use client";

import { useState } from 'react';

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
  hearing_date?: string;
  decision_date?: string;
  appeal_hearing_date?: string;
  appeal_deadline?: string;
  decision_deadline?: string;
  case_end_date?: string;
  accepted_date?: string;
  return_date?: string;
  return_reason?: string;
  notifications_sent?: {
    day_before?: boolean;
    hour_before?: boolean;
    check_reminder?: boolean;
    day_before_sent_at?: string;
    hour_before_sent_at?: string;
    check_reminder_sent_at?: string;
  };
  responsible: {
    id: number;
    telegram_id: string;
    role: string;
    name: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    username: string | null;
  };
}

interface EditCaseModalProps {
  case: Case;
  isOpen: boolean;
  onClose: () => void;
  onSave: (caseId: number, updates: { status: string; hearingDate?: string; acceptanceDate?: string; returnDate?: string }) => void;
}

function getAvailableStatuses(currentStatus: string) {
  const transitions = {
    'submitted': ['pending_check', 'accepted', 'returned'],
    'pending_check': ['accepted', 'returned'],
    'accepted': ['decision_made', 'closed', 'returned'],
    'decision_made': ['appeal', 'closed'],
    'returned': ['appeal', 'closed', 'submitted'],
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
  const [hearingDate, setHearingDate] = useState(
    caseItem.hearing_date ? caseItem.hearing_date.split('T')[0] : ''
  );
  const [hearingTime, setHearingTime] = useState(
    caseItem.hearing_date ? caseItem.hearing_date.split('T')[1]?.substring(0, 5) || '' : ''
  );
  const [acceptanceDate, setAcceptanceDate] = useState(
    caseItem.accepted_date ? caseItem.accepted_date.split('T')[0] : ''
  );

  if (!isOpen) return null;

  const availableStatuses = getAvailableStatuses(caseItem.status);

  const handleSave = () => {
    // Для статуса "Решение принято" требуется дата заседания
    const statusesRequiringHearing = ['decision_made'];
    
    if (statusesRequiringHearing.includes(status) && (!hearingDate || !hearingTime)) {
      alert('Дата и время заседания обязательны для заполнения');
      return;
    }
    
    const updates: any = {
      status,
    };
    
    if (status === 'returned') {
      // Для статуса "returned" отправляем дату возврата
      if (hearingDate) {
        updates.returnDate = hearingDate;
      }
    } else {
      // Для других статусов отправляем дату заседания
      if (hearingDate && hearingTime) {
        updates.hearingDate = `${hearingDate}T${hearingTime}`;
      }
    }
    
    if (acceptanceDate) {
      updates.acceptanceDate = acceptanceDate;
    }
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
              {status === 'returned' ? 'Дата возврата' : 'Дата заседания'} {['decision_made'].includes(status) ? '*' : ''}
            </label>
            <input
              type="date"
              value={hearingDate}
              onChange={(e) => setHearingDate(e.target.value)}
              required={['decision_made'].includes(status)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {status !== 'returned' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Время заседания {['decision_made'].includes(status) ? '*' : ''}
              </label>
              <input
                type="time"
                value={hearingTime}
                onChange={(e) => setHearingTime(e.target.value)}
                required={['decision_made'].includes(status)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}

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