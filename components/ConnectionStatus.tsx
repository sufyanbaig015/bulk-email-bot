'use client';

import { useState, useEffect } from 'react';

export default function ConnectionStatus() {
  const [status, setStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [message, setMessage] = useState('Checking connection...');

  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    setStatus('checking');
    setMessage('Checking connection...');

    try {
      const response = await fetch('/api/email/verify');
      const data = await response.json();

      if (data.success) {
        setStatus('connected');
        setMessage('SMTP connection verified');
      } else {
        setStatus('disconnected');
        setMessage('SMTP connection failed. Please check your configuration.');
      }
    } catch (error) {
      setStatus('disconnected');
      setMessage('Failed to verify connection');
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'connected':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'disconnected':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'connected':
        return '✓';
      case 'disconnected':
        return '✗';
      default:
        return '⟳';
    }
  };

  return (
    <div className={`mb-8 p-4 rounded-lg border-2 ${getStatusColor()}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-2xl">{getStatusIcon()}</span>
          <div>
            <p className="font-semibold">Connection Status</p>
            <p className="text-sm">{message}</p>
          </div>
        </div>
        <button
          onClick={checkConnection}
          className="px-4 py-2 bg-white rounded-md hover:bg-gray-50 transition-colors text-sm font-medium"
        >
          Refresh
        </button>
      </div>
    </div>
  );
}

