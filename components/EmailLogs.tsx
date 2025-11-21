'use client';

import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';

interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
  service?: string;
  [key: string]: any;
}

export default function EmailLogs() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [logType, setLogType] = useState<'emails' | 'error' | 'combined'>('emails');
  const [limit, setLimit] = useState(100);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/logs?type=${logType}&limit=${limit}`);
      const data = await response.json();
      setLogs(data.logs || []);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
    } finally {
      setLoading(false);
    }
  }, [logType, limit]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'error':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'warn':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'info':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const formatError = (error: any): string => {
    if (!error) return '';
    if (typeof error === 'string') return error;
    if (typeof error === 'object') {
      // Try to extract the most useful error message
      if (error.message) return error.message;
      if (error.response) return error.response;
      if (error.code) return `${error.code}: ${error.response || 'Unknown error'}`;
      // Fallback to JSON stringify for complex objects
      return JSON.stringify(error, null, 2);
    }
    return String(error);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Email Logs</h2>
        <button
          onClick={fetchLogs}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Refresh
        </button>
      </div>

      <div className="flex items-center space-x-4">
        <div>
          <label htmlFor="logType" className="block text-sm font-medium text-gray-700 mb-1">
            Log Type
          </label>
          <select
            id="logType"
            value={logType}
            onChange={(e) => setLogType(e.target.value as 'emails' | 'error' | 'combined')}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="emails">Email Logs</option>
            <option value="error">Error Logs</option>
            <option value="combined">All Logs</option>
          </select>
        </div>

        <div>
          <label htmlFor="limit" className="block text-sm font-medium text-gray-700 mb-1">
            Limit
          </label>
          <select
            id="limit"
            value={limit}
            onChange={(e) => setLimit(parseInt(e.target.value))}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="200">200</option>
            <option value="500">500</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-600">Loading logs...</p>
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-600">No logs found</p>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
          <div className="max-h-96 overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Level
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Message
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {logs.map((log, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                      {log.timestamp
                        ? format(new Date(log.timestamp), 'yyyy-MM-dd HH:mm:ss')
                        : '-'}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded border ${getLevelColor(
                          log.level
                        )}`}
                      >
                        {log.level?.toUpperCase() || 'INFO'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">{log.message || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {log.to && (
                        <div>
                          <strong>To:</strong> {log.to}
                        </div>
                      )}
                      {log.subject && (
                        <div>
                          <strong>Subject:</strong> {log.subject}
                        </div>
                      )}
                      {log.messageId && (
                        <div>
                          <strong>Message ID:</strong> {log.messageId}
                        </div>
                      )}
                      {log.error && (
                        <div className="text-red-600">
                          <strong>Error:</strong> {formatError(log.error)}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

