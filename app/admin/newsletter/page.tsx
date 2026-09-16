"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";

interface Campaign {
  id: string;
  subject: string;
  content: string;
  status: string;
  scheduledFor: string | null;
  sentAt: string | null;
  recipients: number | null;
  opens: number;
  clicks: number;
  createdAt: string;
}

export default function NewsletterAdminPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [subscriberCount, setSubscriberCount] = useState(0);

  const [formData, setFormData] = useState({
    subject: "",
    content: "",
    status: "draft" as string,
    scheduledFor: "",
  });

  useEffect(() => {
    fetchCampaigns();
    fetchSubscriberCount();
  }, []);

  async function fetchCampaigns() {
    try {
      const res = await fetch("/api/newsletter/campaigns");
      if (res.ok) {
        const data = await res.json();
        setCampaigns(data);
      }
    } catch (error) {
      console.error("Failed to fetch campaigns", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchSubscriberCount() {
    try {
      const res = await fetch("/api/newsletter/subscribe");
      if (res.ok) {
        const data = await res.json();
        setSubscriberCount(data.count);
      }
    } catch (error) {
      console.error("Failed to fetch subscriber count", error);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      const url = "/api/newsletter/campaigns";
      const method = editingCampaign ? "PUT" : "POST";
      const body = editingCampaign 
        ? { ...formData, id: editingCampaign.id }
        : formData;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        await fetchCampaigns();
        setShowForm(false);
        setEditingCampaign(null);
        setFormData({ subject: "", content: "", status: "draft", scheduledFor: "" });
      } else {
        const error = await res.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error("Failed to save campaign", error);
      alert("Failed to save campaign");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this campaign?")) return;
    
    try {
      const res = await fetch(`/api/newsletter/campaigns?id=${id}`, {
        method: "DELETE",
      });
      
      if (res.ok) {
        await fetchCampaigns();
      }
    } catch (error) {
      console.error("Failed to delete campaign", error);
    }
  }

  function handleEdit(campaign: Campaign) {
    setEditingCampaign(campaign);
    setFormData({
      subject: campaign.subject,
      content: campaign.content,
      status: campaign.status,
      scheduledFor: campaign.scheduledFor || "",
    });
    setShowForm(true);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg text-navy-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-navy-900">Newsletter Management</h1>
          <p className="text-navy-600 mt-1">Manage campaigns and subscribers</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancel" : "+ Create Campaign"}
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-3xl font-bold text-navy-900">{subscriberCount}</div>
          <div className="text-sm text-navy-600">Total Subscribers</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-3xl font-bold text-navy-900">{campaigns.length}</div>
          <div className="text-sm text-navy-600">Total Campaigns</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-3xl font-bold text-navy-900">
            {campaigns.filter(c => c.status === 'sent').length}
          </div>
          <div className="text-sm text-navy-600">Sent Campaigns</div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-3xl font-bold text-navy-900">
            {campaigns.reduce((sum, c) => sum + c.opens, 0)}
          </div>
          <div className="text-sm text-navy-600">Total Opens</div>
        </div>
      </div>

      {/* Campaign Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-navy-900 mb-4">
            {editingCampaign ? "Edit Campaign" : "Create New Campaign"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1">
                Subject Line
              </label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                placeholder="Enter email subject..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-navy-700 mb-1">
                Content
              </label>
              <textarea
                required
                rows={8}
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                placeholder="Enter email content..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-navy-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                >
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="sent">Send Now</option>
                </select>
              </div>

              {formData.status === 'scheduled' && (
                <div>
                  <label className="block text-sm font-medium text-navy-700 mb-1">
                    Schedule For
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.scheduledFor}
                    onChange={(e) => setFormData({ ...formData, scheduledFor: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button type="submit">{editingCampaign ? "Update" : "Create"} Campaign</Button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingCampaign(null);
                  setFormData({ subject: "", content: "", status: "draft", scheduledFor: "" });
                }}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Campaigns List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-navy-600 uppercase tracking-wider">
                Subject
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-navy-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-navy-600 uppercase tracking-wider">
                Recipients
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-navy-600 uppercase tracking-wider">
                Opens / Clicks
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-navy-600 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-navy-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {campaigns.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-navy-500">
                  No campaigns yet. Create your first campaign!
                </td>
              </tr>
            ) : (
              campaigns.map((campaign) => (
                <tr key={campaign.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-navy-900">{campaign.subject}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        campaign.status === "sent"
                          ? "bg-green-100 text-green-800"
                          : campaign.status === "scheduled"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {campaign.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-navy-600">
                    {campaign.recipients || "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-navy-600">
                    {campaign.opens} / {campaign.clicks}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-navy-600">
                    {campaign.sentAt
                      ? new Date(campaign.sentAt).toLocaleDateString()
                      : new Date(campaign.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button
                      onClick={() => handleEdit(campaign)}
                      className="text-primary hover:text-primary-hover mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(campaign.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
