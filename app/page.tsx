'use client';

import { useState } from 'react';
import ConnectionStatus from '@/components/ConnectionStatus';
import EmailForm from '@/components/EmailForm';
import BulkEmailUpload from '@/components/BulkEmailUpload';
import EmailLogs from '@/components/EmailLogs';
import ChatWidget from '@/components/ChatWidget';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'single' | 'bulk' | 'logs'>('single');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                BulkEmail Pro
              </h1>
            </div>
            <div className="flex items-center space-x-4 text-sm font-medium">
              <a href="#workspace" className="text-gray-700 hover:text-blue-600 transition-colors">
                Live Demo
              </a>
              <a
                href="#workspace"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                Launch App
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Workspace Section */}
      <section id="workspace" className="bg-white py-16 border-y">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <p className="text-sm uppercase tracking-wide text-blue-600 font-semibold">Live Demo</p>
            <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-4">Bulk Email Workspace</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Connect your SMTP server, send single emails, upload CSVs for campaigns, and monitor delivery logs.
            </p>
          </div>

          <ConnectionStatus />

          <div className="bg-gray-50 border border-gray-200 rounded-2xl shadow-lg">
            <div className="px-6 pt-6">
              <div className="flex flex-wrap items-center space-x-4 border-b pb-4">
                <button
                  onClick={() => setActiveTab('single')}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                    activeTab === 'single'
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-white'
                  }`}
                >
                  Single Email
                </button>
                <button
                  onClick={() => setActiveTab('bulk')}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                    activeTab === 'bulk'
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-white'
                  }`}
                >
                  Bulk Email (CSV)
                </button>
                <button
                  onClick={() => setActiveTab('logs')}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                    activeTab === 'logs'
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-white'
                  }`}
                >
                  Email Logs
                </button>
              </div>
            </div>

            <div className="p-6">
              {activeTab === 'single' && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Send a Single Email</h3>
                  <p className="text-gray-600 mb-6">
                    Use this form to test your SMTP setup or send a one-off message.
                  </p>
                  <EmailForm />
                </div>
              )}
              {activeTab === 'bulk' && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Bulk Email Campaign</h3>
                  <p className="text-gray-600 mb-6">
                    Upload a CSV file with recipient details and use dynamic placeholders inside your templates.
                  </p>
                  <BulkEmailUpload />
                </div>
              )}
              {activeTab === 'logs' && (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Recent Activity</h3>
                  <p className="text-gray-600 mb-6">Monitor sent emails, failures, and delivery performance.</p>
                  <EmailLogs />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* AI Chat Widget */}
      <ChatWidget />
    </div>
  );
}
