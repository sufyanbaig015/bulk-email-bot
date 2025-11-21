'use client';

import { useState } from 'react';

export default function BulkEmailUpload() {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [subject, setSubject] = useState('');
  const [htmlTemplate, setHtmlTemplate] = useState('');
  const [textTemplate, setTextTemplate] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    total?: number;
    sent?: number;
    failed?: number;
    results?: Array<{ email: string; success: boolean; error?: string }>;
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'text/csv') {
      setCsvFile(file);
    } else {
      alert('Please select a valid CSV file');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvFile || !subject || !htmlTemplate) {
      alert('Please fill in all required fields and upload a CSV file');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('csv', csvFile);
      formData.append('subject', subject);
      formData.append('html', htmlTemplate);
      if (textTemplate) {
        formData.append('text', textTemplate);
      }

      const response = await fetch('/api/email/bulk', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setResult({
          success: true,
          total: data.total,
          sent: data.sent,
          failed: data.failed,
          results: data.results,
        });
      } else {
        setResult({
          success: false,
        });
        alert(data.error || 'Failed to send bulk emails');
      }
    } catch (error: any) {
      setResult({
        success: false,
      });
      alert(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-blue-900 mb-2">CSV Format Instructions</h3>
        <p className="text-sm text-blue-800 mb-2">
          Your CSV file should include the following columns:
        </p>
        <ul className="text-sm text-blue-800 list-disc list-inside space-y-1">
          <li><strong>email</strong> (required) - Recipient email address</li>
          <li><strong>name</strong> (optional) - Recipient name</li>
          <li><strong>subject</strong> (optional) - Override default subject</li>
          <li>Any other columns can be used as custom fields in templates</li>
        </ul>
        <p className="text-sm text-blue-800 mt-2">
          Use placeholders in your templates: <code className="bg-blue-100 px-1 rounded">{'{{email}}'}</code>, <code className="bg-blue-100 px-1 rounded">{'{{name}}'}</code>, or <code className="bg-blue-100 px-1 rounded">{'{{yourColumnName}}'}</code>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="csv" className="block text-sm font-medium text-gray-700 mb-2">
            CSV File <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            id="csv"
            accept=".csv"
            required
            onChange={handleFileChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {csvFile && (
            <p className="mt-2 text-sm text-gray-600">Selected: {csvFile.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
            Subject Template <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="subject"
            required
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Hello {{name}}, welcome to our service!"
          />
        </div>

        <div>
          <label htmlFor="htmlTemplate" className="block text-sm font-medium text-gray-700 mb-2">
            HTML Template <span className="text-red-500">*</span>
          </label>
          <textarea
            id="htmlTemplate"
            required
            rows={12}
            value={htmlTemplate}
            onChange={(e) => setHtmlTemplate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
            placeholder="<h1>Hello {{name}}!</h1><p>Your email is {{email}}</p>"
          />
        </div>

        <div>
          <label htmlFor="textTemplate" className="block text-sm font-medium text-gray-700 mb-2">
            Plain Text Template (optional)
          </label>
          <textarea
            id="textTemplate"
            rows={8}
            value={textTemplate}
            onChange={(e) => setTextTemplate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Hello {{name}}! Your email is {{email}}"
          />
        </div>

        {result && result.success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-900 mb-2">Bulk Email Results</h3>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-sm text-green-700">Total</p>
                <p className="text-2xl font-bold text-green-900">{result.total}</p>
              </div>
              <div>
                <p className="text-sm text-green-700">Sent</p>
                <p className="text-2xl font-bold text-green-900">{result.sent}</p>
              </div>
              <div>
                <p className="text-sm text-red-700">Failed</p>
                <p className="text-2xl font-bold text-red-900">{result.failed}</p>
              </div>
            </div>
            {result.results && result.results.length > 0 && (
              <details className="mt-4">
                <summary className="cursor-pointer text-sm font-medium text-green-800 hover:text-green-900">
                  View Detailed Results
                </summary>
                <div className="mt-2 max-h-60 overflow-y-auto">
                  <table className="min-w-full text-sm">
                    <thead className="bg-green-100">
                      <tr>
                        <th className="px-3 py-2 text-left">Email</th>
                        <th className="px-3 py-2 text-left">Status</th>
                        <th className="px-3 py-2 text-left">Error</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.results.map((r, idx) => (
                        <tr key={idx} className="border-t">
                          <td className="px-3 py-2">{r.email}</td>
                          <td className="px-3 py-2">
                            <span
                              className={`px-2 py-1 rounded text-xs ${
                                r.success
                                  ? 'bg-green-200 text-green-800'
                                  : 'bg-red-200 text-red-800'
                              }`}
                            >
                              {r.success ? 'Sent' : 'Failed'}
                            </span>
                          </td>
                          <td className="px-3 py-2 text-red-600 text-xs">{r.error || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </details>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
        >
          {loading ? 'Sending Bulk Emails...' : 'Send Bulk Emails'}
        </button>
      </form>
    </div>
  );
}

