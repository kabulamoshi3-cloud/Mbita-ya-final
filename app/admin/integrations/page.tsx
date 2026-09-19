'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';

interface Platform {
  id: string;
  name: string;
  icon: string;
  description: string;
  status: 'connected' | 'disconnected' | 'syncing' | 'error';
  profileUrl?: string;
  lastSyncedAt?: string;
  syncedCount?: number;
  category: 'academic' | 'social';
}

interface DeduplicationStats {
  totalSynced: number;
  imported: number;
  pending: number;
  byPlatform: Record<string, { total: number; imported: number }>;
}

export default function IntegrationsPage() {
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);
  const [deduplicationStats, setDeduplicationStats] = useState<DeduplicationStats | null>(null);

  useEffect(() => {
    fetchPlatforms();
    fetchDeduplicationStats();
  }, []);

  const fetchPlatforms = async () => {
    try {
      const response = await fetch('/api/integrations/status');
      const data = await response.json();
      setPlatforms(data.platforms || getDefaultPlatforms());
    } catch (error) {
      console.error('Failed to fetch platforms:', error);
      setPlatforms(getDefaultPlatforms());
    } finally {
      setLoading(false);
    }
  };

  const fetchDeduplicationStats = async () => {
    try {
      const response = await fetch('/api/import-publications');
      const data = await response.json();
      if (data.success) {
        setDeduplicationStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch deduplication stats:', error);
    }
  };

  const getDefaultPlatforms = (): Platform[] => [
    {
      id: 'google_scholar',
      name: 'Google Scholar',
      icon: '🎓',
      description: 'Sync publications, citations, and h-index',
      status: 'connected',
      profileUrl: 'https://scholar.google.com/citations?user=JEeMxH0AAAAJ',
      category: 'academic',
    },
    {
      id: 'orcid',
      name: 'ORCID',
      icon: '🆔',
      description: 'Sync publications with DOI and career information',
      status: 'connected',
      profileUrl: 'https://orcid.org/0000-0000-0000-0000',
      category: 'academic',
    },
    {
      id: 'researchgate',
      name: 'ResearchGate',
      icon: '🔬',
      description: 'Sync papers, projects, and Q&A',
      status: 'connected',
      profileUrl: 'https://www.researchgate.net/profile/Emmanuel-Deogratias',
      category: 'academic',
    },
    {
      id: 'scopus',
      name: 'Scopus',
      icon: '📊',
      description: 'Sync citation metrics and author metrics',
      status: 'connected',
      profileUrl: 'https://www.scopus.com/authid/detail.uri?authorId=0000000000',
      category: 'academic',
    },
    {
      id: 'academia',
      name: 'Academia.edu',
      icon: '🏛️',
      description: 'Sync papers and research interests',
      status: 'connected',
      profileUrl: 'https://sua.academia.edu/EmmanuelMbita',
      category: 'academic',
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: '💼',
      description: 'Sync professional experience and posts',
      status: 'connected',
      profileUrl: 'https://www.linkedin.com/in/emmanuel-deogratias-mbita',
      category: 'social',
    },
    {
      id: 'github',
      name: 'GitHub',
      icon: '💻',
      description: 'Sync code repositories and contributions',
      status: 'connected',
      profileUrl: 'https://github.com/mbita-deo',
      category: 'social',
    },
  ];

  const handleSync = async (platformId: string) => {
    setSyncing(platformId);
    try {
      const response = await fetch(`/api/sync/${platformId}`, {
        method: 'POST',
      });
      const result = await response.json();
      
      if (result.success) {
        alert(`✅ Synced ${result.count} items from ${platformId}`);
        await fetchPlatforms();
      } else {
        alert(`❌ Sync failed: ${result.error}`);
      }
    } catch (error) {
      alert(`❌ Sync failed: ${error}`);
    } finally {
      setSyncing(null);
    }
  };

  const handleSyncAll = async () => {
    for (const platform of platforms.filter(p => p.status === 'connected')) {
      await handleSync(platform.id);
    }
  };

  const handleImportPublications = async () => {
    if (!confirm('Import synced publications to the Publications database with automatic deduplication?')) {
      return;
    }

    setImporting(true);
    try {
      const response = await fetch('/api/import-publications', {
        method: 'POST',
      });
      const result = await response.json();
      
      if (result.success) {
        alert(`✅ ${result.summary}\n\nDetails:\n${result.details.slice(0, 5).map((d: any) => `• ${d.title}: ${d.action}`).join('\n')}`);
        await fetchDeduplicationStats();
      } else {
        alert(`❌ Import failed: ${result.error}`);
      }
    } catch (error) {
      alert(`❌ Import failed: ${error}`);
    } finally {
      setImporting(false);
    }
  };

  const academicPlatforms = platforms.filter(p => p.category === 'academic');
  const socialPlatforms = platforms.filter(p => p.category === 'social');

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Platform Integrations</h1>
            <p className="mt-2 text-gray-600">
              Manage connections to academic and social platforms for automatic content syncing
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleImportPublications}
              disabled={importing || syncing !== null}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {importing ? (
                <>
                  <span className="animate-spin">⟳</span>
                  Importing...
                </>
              ) : (
                <>
                  <span>📥</span>
                  Import to Database
                </>
              )}
            </button>
            <button
              onClick={handleSyncAll}
              disabled={syncing !== null || importing}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {syncing ? (
                <>
                  <span className="animate-spin">⟳</span>
                  Syncing...
                </>
              ) : (
                <>
                  <span>🔄</span>
                  Sync All
                </>
              )}
            </button>
          </div>
        </div>

        {/* Deduplication Stats */}
        {deduplicationStats && deduplicationStats.totalSynced > 0 && (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
            <h3 className="text-lg font-bold text-gray-900 mb-4">📊 Deduplication Status</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-3xl font-bold text-blue-600">
                  {deduplicationStats.totalSynced}
                </div>
                <div className="text-sm text-gray-600 mt-1">Total Synced</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-3xl font-bold text-green-600">
                  {deduplicationStats.imported}
                </div>
                <div className="text-sm text-gray-600 mt-1">Already Imported</div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <div className="text-3xl font-bold text-orange-600">
                  {deduplicationStats.pending}
                </div>
                <div className="text-sm text-gray-600 mt-1">Pending Import</div>
              </div>
            </div>
            
            {/* Per-platform breakdown */}
            {Object.keys(deduplicationStats.byPlatform).length > 0 && (
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-2">By Platform:</h4>
                <div className="space-y-2">
                  {Object.entries(deduplicationStats.byPlatform).map(([platform, stats]) => (
                    <div key={platform} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700 capitalize">{platform.replace('_', ' ')}</span>
                      <span className="text-gray-600">
                        {stats.imported} / {stats.total} imported
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {deduplicationStats.pending > 0 && (
              <div className="mt-4 p-3 bg-orange-100 border border-orange-300 rounded-lg text-sm text-orange-800">
                💡 <strong>{deduplicationStats.pending} publications</strong> are ready to be imported. 
                Click "Import to Database" to add them with automatic deduplication.
              </div>
            )}
          </div>
        )}

        {/* Academic Platforms */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            🎓 Academic Platforms
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {academicPlatforms.map((platform) => (
              <PlatformCard
                key={platform.id}
                platform={platform}
                onSync={handleSync}
                syncing={syncing === platform.id}
              />
            ))}
          </div>
        </div>

        {/* Social Platforms */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            📱 Social Platforms
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {socialPlatforms.map((platform) => (
              <PlatformCard
                key={platform.id}
                platform={platform}
                onSync={handleSync}
                syncing={syncing === platform.id}
              />
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border border-blue-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Sync Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-3xl font-bold text-blue-600">
                {platforms.filter(p => p.status === 'connected').length}
              </div>
              <div className="text-sm text-gray-600 mt-1">Connected</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-3xl font-bold text-green-600">
                {platforms.reduce((sum, p) => sum + (p.syncedCount || 0), 0)}
              </div>
              <div className="text-sm text-gray-600 mt-1">Items Synced</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-3xl font-bold text-purple-600">
                {academicPlatforms.length}
              </div>
              <div className="text-sm text-gray-600 mt-1">Academic</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <div className="text-3xl font-bold text-pink-600">
                {socialPlatforms.length}
              </div>
              <div className="text-sm text-gray-600 mt-1">Social</div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function PlatformCard({ 
  platform, 
  onSync, 
  syncing 
}: { 
  platform: Platform; 
  onSync: (id: string) => void; 
  syncing: boolean;
}) {
  const statusColors = {
    connected: 'bg-green-100 text-green-800 border-green-300',
    disconnected: 'bg-gray-100 text-gray-800 border-gray-300',
    syncing: 'bg-blue-100 text-blue-800 border-blue-300',
    error: 'bg-red-100 text-red-800 border-red-300',
  };

  const statusIcons = {
    connected: '✅',
    disconnected: '⭕',
    syncing: '⟳',
    error: '❌',
  };

  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-4xl">{platform.icon}</div>
          <div>
            <h3 className="font-bold text-lg text-gray-900">{platform.name}</h3>
            <p className="text-sm text-gray-600 mt-1">{platform.description}</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {/* Status */}
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-medium ${statusColors[platform.status]}`}>
          <span>{statusIcons[platform.status]}</span>
          <span>{platform.status.charAt(0).toUpperCase() + platform.status.slice(1)}</span>
        </div>

        {/* Profile URL */}
        {platform.profileUrl && (
          <div className="text-sm">
            <span className="text-gray-600">Profile: </span>
            <a 
              href={platform.profileUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline break-all"
            >
              {platform.profileUrl.replace(/https?:\/\//,

 '')}
            </a>
          </div>
        )}

        {/* Last Synced */}
        {platform.lastSyncedAt && (
          <div className="text-sm text-gray-600">
            Last synced: {new Date(platform.lastSyncedAt).toLocaleString()}
          </div>
        )}

        {/* Synced Count */}
        {platform.syncedCount !== undefined && (
          <div className="text-sm text-gray-600">
            Items synced: {platform.syncedCount}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <button
            onClick={() => onSync(platform.id)}
            disabled={syncing || platform.status === 'disconnected'}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {syncing ? 'Syncing...' : 'Sync Now'}
          </button>
          <button
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Settings
          </button>
        </div>
      </div>
    </div>
  );
}
