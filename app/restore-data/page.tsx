'use client';

import { useState } from 'react';

export default function RestoreDataPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRestore = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/restore-backup', {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        setResult(data);
      } else {
        setError(data.error || 'Restore failed');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to restore data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          🔄 Restore Database from Backup
        </h1>
        <p className="text-gray-600 mb-6">
          Click the button below to restore all your data (11 publications, profile, admin account, etc.) from the backup to your new Supabase database.
        </p>

        {!result && !error && (
          <button
            onClick={handleRestore}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-lg"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Restoring Data...
              </span>
            ) : (
              '🚀 Restore All Data Now'
            )}
          </button>
        )}

        {result && (
          <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-green-800 mb-4 flex items-center gap-2">
              ✅ Data Restored Successfully!
            </h2>
            <div className="space-y-2 text-green-900">
              <p className="font-semibold">Restored:</p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Admin Users: {result.restored.adminUsers}</li>
                <li>Profiles: {result.restored.profiles}</li>
                <li>Publications: {result.restored.publications} 📚</li>
                <li>Courses: {result.restored.courses}</li>
                <li>Students: {result.restored.students}</li>
                <li>Awards: {result.restored.awards}</li>
                <li>Events: {result.restored.events}</li>
              </ul>
              <div className="mt-6 pt-4 border-t border-green-300">
                <a
                  href="/login"
                  className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Go to Admin Panel →
                </a>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border-2 border-red-500 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-red-800 mb-2">
              ❌ Error
            </h2>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={handleRestore}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> This will restore data from <code className="bg-blue-100 px-2 py-1 rounded">backup-2026-09-19.json</code> which contains all your publications, profile, and settings from September 19, 2026.
          </p>
        </div>
      </div>
    </div>
  );
}
