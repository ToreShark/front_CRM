"use client";

import dynamic from 'next/dynamic';

const SuccessContent = dynamic(() => import('./SuccessContent'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-600">Загрузка...</p>
      </div>
    </div>
  )
});

export default function Success() {
  return <SuccessContent />;
}