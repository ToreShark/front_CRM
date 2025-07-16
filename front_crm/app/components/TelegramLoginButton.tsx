"use client";

import { useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

declare global {
  interface Window {
    onTelegramAuth: (user: TelegramUser) => void;
  }
}

export default function TelegramLoginButton() {
  const { login } = useAuth();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Глобальная функция для обработки авторизации
    window.onTelegramAuth = async (user: TelegramUser) => {
      console.log('Telegram auth received:', user);
      try {
        await login(user);
      } catch (error) {
        console.error('Login failed:', error);
        alert('Ошибка авторизации. Пожалуйста, попробуйте снова.');
      }
    };

    // Загружаем скрипт Telegram Widget
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.async = true;
    script.setAttribute('data-telegram-login', 'lawyer_tore_crm_bot');
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-onauth', 'onTelegramAuth(user)');
    script.setAttribute('data-request-access', 'write');

    // Добавляем скрипт в контейнер
    if (containerRef.current) {
      containerRef.current.appendChild(script);
    }

    // Cleanup
    return () => {
      if (containerRef.current && script.parentNode === containerRef.current) {
        containerRef.current.removeChild(script);
      }
      // Удаляем глобальную функцию
      delete window.onTelegramAuth;
    };
  }, [login]);

  return <div ref={containerRef} className="flex justify-center" />;
}