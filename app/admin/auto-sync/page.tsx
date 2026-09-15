"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";

interface ConnectedAccount {
  id: string;
  platform: string;
  accountId: string;
  isActive: boolean;
  lastSyncedAt: string | null;
  syncStatus: string;
  syncError: string | null;
}

interface SyncedContent {
  id: string;
  platform: string;
  contentType: string;
  title: string;
  publishedDate: string | null;
  importedToDb: boolean;
}

export default function AutoSyncPage() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);
  const [syncedContent, setSyncedContent] = useState<SyncedContent[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [syncResult, setSyncResult] = useState<any>(null);
  const [importResult, setImportResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch current status
  async function fetchStatus() {
    try {
      const res = await fetch("/api/sync/now");
      const data = await res.json();
      setIsEnabled(data.autoSyncEnabled || false);
      setLastSync(data.lastSync);
      setAccounts(data.accounts || []);
    } catch (error) {
      console.error("Error fetching sync status:", error);
    }
  }

  // Fetch synced content
  async function fetchSyncedContent() {
    try {
      const res = await fetch("/api/sync/content?limit=50");
      const data = await res.json();
      setSyncedContent(data.content || []);
    } catch (error) {
      console.error("Error fetching synced content:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStatus();
    fetchSyncedContent();
  }, []);

  // Trigger manual sync
  async function handleSync() {
    setIsSyncing(true);
    setSyncResult(null);
    try {
      const res = await fetch("/api/sync/trigger", { method: "POST" });
      const data = await res.json();
      setSyncResult(data);
      await fetchStatus();
      await fetchSyncedContent();
    } catch (error: any) {
      setSyncResult({ error: error.message });
    } finally {
      setIsSyncing(false);
    }
  }

  // Import synced content
  async function handleImport() {
    setIsImporting(true);
    setImportResult(null);
    try {
      const res = await fetch("/api/sync/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ limit: 100 }),
      });
      const data = await res.json();
      setImportResult(data);
      await fetchSyncedContent();
    } catch (error: any) {
      setImportResult({ error: error.message });
    } finally {
      setIsImporting(false);
    }
  }

  // Run full sync + import (using academic profile URLs)
  async function handleFullSync() {
    setIsSyncing(true);
    setIsImporting(true);
    setSyncResult(null);
    setImportResult(null);
    try {
      const res = await fetch("/api/sync/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({ importToDb: true }),
      });
      const data = await res.json();
      
      if (data.success) {
        setSyncResult({ success: true, ...data.sync });
        setImportResult(data.import);
      } else {
        setSyncResult({ success: false, error: data.message || "Sync failed" });
      }
      
      await fetchStatus();
      await fetchSyncedContent();
    } catch (error: any) {
      setSyncResult({ success: false, error: error.message });
    } finally {
      setIsSyncing(false);
      setIsImporting(false);
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-navy-900 mb-2">Auto-Sync Manager</h1>
        <p className="text-gray-600">
          Automatically fetch and import content from connected academic accounts
        </p>
      </div>

      {/* Status Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-navy-900 mb-1">Sync Status</h2>
            <p className="text-sm text-gray-600">
              Auto-sync is currently{" "}
              <span className={isEnabled ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                {isEnabled ? "ENABLED" : "DISABLED"}
              </span>
            </p>
            {lastSync && (
              <p className="text-sm text-gray-500 mt-1">
                Last synced: {new Date(lastSync).toLocaleString()}
              </p>
            )}
          </div>
          <div className="flex gap-3">
            <Button
              variant="primary"
              onClick={handleFullSync}
              isLoading={isSyncing || isImporting}
              disabled={!isEnabled}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Sync Now
            </Button>
          </div>
        </div>

        {!isEnabled && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              ⚠️ Auto-sync is disabled. Enable it in Profile Settings → Academic Links tab to start syncing content automatically.
            </p>
          </div>
        )}

        {isEnabled && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              ℹ️ Sync uses academic profile URLs from Profile Settings (Google Scholar, ORCID, GitHub, etc.). Make sure you've added them in Profile → Academic Links.
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <button
          onClick={handleSync}
          disabled={isSyncing || !isEnabled || accounts.length === 0}
          className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-primary hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-navy-900">Fetch Content</h3>
              <p className="text-sm text-gray-600">Sync from accounts</p>
            </div>
          </div>
        </button>

        <button
          onClick={handleImport}
          disabled={isImporting || syncedContent.filter(c => !c.importedToDb).length === 0}
          className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-primary hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-navy-900">Import to DB</h3>
              <p className="text-sm text-gray-600">
                {syncedContent.filter(c => !c.importedToDb).length} pending
              </p>
            </div>
          </div>
        </button>

        <button
          onClick={() => window.location.href = "/integrations/connect"}
          className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:border-primary hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-navy-900">Add Account</h3>
              <p className="text-sm text-gray-600">Connect platforms</p>
            </div>
          </div>
        </button>
      </div>

      {/* Results */}
      {syncResult && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-navy-900 mb-4">Sync Results</h3>
          {syncResult.error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
              Error: {syncResult.error}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{syncResult.successful || 0}</div>
                <div className="text-sm text-gray-600">Successful</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{syncResult.failed || 0}</div>
                <div className="text-sm text-gray-600">Failed</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{syncResult.total || 0}</div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
            </div>
          )}
        </div>
      )}

      {importResult && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-semibold text-navy-900 mb-4">Import Results</h3>
          {importResult.error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
              Error: {importResult.error}
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{importResult.imported || 0}</div>
                  <div className="text-sm text-gray-600">Imported</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{importResult.skipped || 0}</div>
                  <div className="text-sm text-gray-600">Skipped</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{importResult.errors || 0}</div>
                  <div className="text-sm text-gray-600">Errors</div>
                </div>
              </div>
              {importResult.details && importResult.details.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold text-sm text-gray-700 mb-2">Details:</h4>
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {importResult.details.map((detail: any, idx: number) => (
                      <div
                        key={idx}
                        className={`text-sm p-2 rounded ${
                          detail.status === "imported"
                            ? "bg-green-50 text-green-800"
                            : detail.status === "skipped"
                            ? "bg-yellow-50 text-yellow-800"
                            : "bg-red-50 text-red-800"
                        }`}
                      >
                        <span className="font-medium">{detail.type}:</span> {detail.title}
                        {detail.error && <span className="ml-2 text-xs">({detail.error})</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Connected Accounts */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-navy-900 mb-4">Connected Accounts ({accounts.length})</h3>
        {accounts.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No connected accounts yet</p>
        ) : (
          <div className="space-y-3">
            {accounts.map((account) => (
              <div
                key={account.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${account.isActive ? "bg-green-500" : "bg-gray-400"}`}></div>
                  <div>
                    <div className="font-medium text-navy-900">{account.platform}</div>
                    <div className="text-sm text-gray-600">{account.accountId}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium ${
                    account.syncStatus === "success" ? "text-green-600" :
                    account.syncStatus === "error" ? "text-red-600" :
                    account.syncStatus === "syncing" ? "text-blue-600" :
                    "text-gray-600"
                  }`}>
                    {account.syncStatus}
                  </div>
                  {account.lastSyncedAt && (
                    <div className="text-xs text-gray-500">
                      {new Date(account.lastSyncedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Synced Content Preview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-navy-900 mb-4">
          Recent Synced Content ({syncedContent.length})
        </h3>
        {syncedContent.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No synced content yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Platform</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {syncedContent.slice(0, 20).map((content) => (
                  <tr key={content.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-navy-900">{content.title}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      <span className="px-2 py-1 bg-gray-100 rounded text-xs">{content.contentType}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{content.platform}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {content.publishedDate ? new Date(content.publishedDate).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {content.importedToDb ? (
                        <span className="text-green-600 font-medium">✓ Imported</span>
                      ) : (
                        <span className="text-yellow-600 font-medium">⏳ Pending</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
