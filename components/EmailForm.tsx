'use client';

import { useState } from 'react';

export default function EmailForm() {
  const [formData, setFormData] = useState({
    to: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [showAiAssistant, setShowAiAssistant] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiTone, setAiTone] = useState<'professional' | 'casual' | 'friendly' | 'formal' | 'persuasive'>('professional');
  const [aiFormat, setAiFormat] = useState<'html' | 'plain'>('html');
  const [subjectSuggestions, setSubjectSuggestions] = useState<string[]>([]);

  const handleGenerateEmail = async () => {
    if (!aiPrompt.trim()) {
      alert('Please enter a prompt to generate email content');
      return;
    }

    setAiLoading(true);
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: aiPrompt,
          tone: aiTone,
          recipient: formData.to,
          format: aiFormat,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setFormData({ ...formData, message: data.content });
        setAiPrompt('');
      } else {
        alert(data.error || 'Failed to generate email');
      }
    } catch (error: any) {
      alert(error.message || 'An error occurred');
    } finally {
      setAiLoading(false);
    }
  };

  const handleImproveEmail = async () => {
    if (!formData.message.trim()) {
      alert('Please enter some email content first');
      return;
    }

    setAiLoading(true);
    try {
      const response = await fetch('/api/ai/improve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: formData.message,
          improvement: 'clarity',
        }),
      });

      const data = await response.json();
      if (data.success) {
        setFormData({ ...formData, message: data.content });
      } else {
        alert(data.error || 'Failed to improve email');
      }
    } catch (error: any) {
      alert(error.message || 'An error occurred');
    } finally {
      setAiLoading(false);
    }
  };

  const handleSuggestSubject = async () => {
    if (!formData.message.trim()) {
      alert('Please enter some email content first');
      return;
    }

    setAiLoading(true);
    try {
      const response = await fetch('/api/ai/subject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailContent: formData.message,
          count: 3,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSubjectSuggestions(data.subjectLines);
      } else {
        alert(data.error || 'Failed to generate subject lines');
      }
    } catch (error: any) {
      alert(error.message || 'An error occurred');
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: formData.to,
          subject: formData.subject,
          html: formData.message,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResult({
          success: true,
          message: `Email sent successfully! Message ID: ${data.messageId}`,
        });
        setFormData({
          to: '',
          subject: '',
          message: '',
        });
        setSubjectSuggestions([]);
      } else {
        setResult({
          success: false,
          message: data.error || 'Failed to send email',
        });
      }
    } catch (error: any) {
      setResult({
        success: false,
        message: error.message || 'An error occurred',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* AI Assistant Section */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">✨</span>
            <h3 className="font-semibold text-gray-900">AI Assistant</h3>
          </div>
          <button
            type="button"
            onClick={() => setShowAiAssistant(!showAiAssistant)}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            {showAiAssistant ? 'Hide' : 'Show'} AI Tools
          </button>
        </div>

        {showAiAssistant && (
          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Generate Email from Prompt
              </label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleGenerateEmail()}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., Welcome email for new customers..."
                  />
                  <select
                    value={aiTone}
                    onChange={(e) => setAiTone(e.target.value as any)}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="professional">Professional</option>
                    <option value="casual">Casual</option>
                    <option value="friendly">Friendly</option>
                    <option value="formal">Formal</option>
                    <option value="persuasive">Persuasive</option>
                  </select>
                  <select
                    value={aiFormat}
                    onChange={(e) => setAiFormat(e.target.value as 'html' | 'plain')}
                    className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
                    title="Choose HTML for formatted emails or Plain Text for simple text"
                  >
                    <option value="html">HTML</option>
                    <option value="plain">Plain Text</option>
                  </select>
                  <button
                    type="button"
                    onClick={handleGenerateEmail}
                    disabled={aiLoading}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    {aiLoading ? 'Generating...' : 'Generate'}
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  {aiFormat === 'html' 
                    ? 'Will generate simple HTML (like <p>Hello</p>)' 
                    : 'Will generate plain text without HTML tags'}
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleImproveEmail}
                disabled={aiLoading || !formData.message.trim()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {aiLoading ? 'Improving...' : '✨ Improve Content'}
              </button>
              <button
                type="button"
                onClick={handleSuggestSubject}
                disabled={aiLoading || !formData.message.trim()}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {aiLoading ? 'Generating...' : '💡 Suggest Subject'}
              </button>
            </div>

            {subjectSuggestions.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-md p-3">
                <p className="text-sm font-medium text-gray-700 mb-2">Suggested Subjects:</p>
                <div className="space-y-2">
                  {subjectSuggestions.map((suggestion, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setFormData({ ...formData, subject: suggestion });
                        setSubjectSuggestions([]);
                      }}
                      className="w-full text-left px-3 py-2 bg-gray-50 hover:bg-blue-50 border border-gray-200 rounded-md transition-colors text-sm"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div>
        <label htmlFor="to" className="block text-sm font-medium text-gray-700 mb-2">
          To <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="to"
          required
          value={formData.to}
          onChange={(e) => setFormData({ ...formData, to: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="recipient@example.com"
        />
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
          Subject <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="subject"
          required
          value={formData.subject}
          onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Email subject"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          required
          rows={10}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Type your email content here..."
        />
      </div>

      {result && (
        <div
          className={`p-4 rounded-md ${
            result.success
              ? 'bg-green-100 text-green-800 border border-green-300'
              : 'bg-red-100 text-red-800 border border-red-300'
          }`}
        >
          {result.message}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
      >
        {loading ? 'Sending...' : 'Send Email'}
      </button>
    </form>
  );
}

