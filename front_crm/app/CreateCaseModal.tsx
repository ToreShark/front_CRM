"use client";

import { useState, useEffect } from 'react';

interface Lawyer {
  id: number;
  name: string;
  role: string;
}

interface CreateCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (caseData: {
    number: string;
    title: string;
    description: string;
    filing_date: string;
    responsible_id: number;
  }) => void;
}

export default function CreateCaseModal({ isOpen, onClose, onSave }: CreateCaseModalProps) {
  const [number, setNumber] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [filingDate, setFilingDate] = useState('');
  const [responsibleId, setResponsibleId] = useState<number | ''>('');
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [loading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchLawyers();
    }
  }, [isOpen]);

  const fetchLawyers = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://localhost:3000/users?role=lawyer', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setLawyers(data);
      } else {
        console.error('Ошибка при получении списка юристов');
      }
    } catch (error) {
      console.error('Ошибка сети:', error);
    }
  };

  const handleSave = () => {
    if (!number || !title || !filingDate || !responsibleId) {
      alert('Заполните все обязательные поля');
      return;
    }

    const caseData = {
      number,
      title,
      description,
      filing_date: filingDate,
      responsible_id: Number(responsibleId)
    };

    onSave(caseData);
    handleClose();
  };

  const handleClose = () => {
    setNumber('');
    setTitle('');
    setDescription('');
    setFilingDate('');
    setResponsibleId('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Создать новое дело</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Номер дела *
            </label>
            <input
              type="text"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder="A1-2025-001"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Название дела *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Иванов против ООО «Ромашка»"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Описание дела
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Спор о взыскании задолженности"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Дата подачи *
            </label>
            <input
              type="date"
              value={filingDate}
              onChange={(e) => setFilingDate(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ответственный юрист *
            </label>
            <select
              value={responsibleId}
              onChange={(e) => setResponsibleId(e.target.value ? Number(e.target.value) : '')}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
            >
              <option value="">Выберите юриста</option>
              {lawyers.map((lawyer) => (
                <option key={lawyer.id} value={lawyer.id}>
                  {lawyer.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            Отмена
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-medium transition-colors disabled:opacity-50"
          >
            {loading ? 'Создание...' : 'Создать дело'}
          </button>
        </div>
      </div>
    </div>
  );
}