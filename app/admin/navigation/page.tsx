"use client";

import { useState, useEffect } from "react";
import Button from "@/components/ui/Button";

interface NavigationItem {
  id: string;
  label: string;
  href: string | null;
  icon: string | null;
  description: string | null;
  order: number;
  parentId: string | null;
  isVisible: boolean;
  openInNewTab: boolean;
  badge: string | null;
  badgeColor: string | null;
  isMegaMenu: boolean;
  columns: number | null;
  children?: NavigationItem[];
}

export default function NavigationManagementPage() {
  const [menuItems, setMenuItems] = useState<NavigationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingItem, setEditingItem] = useState<NavigationItem | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Fetch navigation items
  useEffect(() => {
    fetchMenuItems();
  }, []);

  async function fetchMenuItems() {
    try {
      const res = await fetch("/api/admin/navigation");
      const data = await res.json();
      setMenuItems(data.menuItems || []);
    } catch (error) {
      console.error("Error fetching menu items:", error);
    } finally {
      setLoading(false);
    }
  }

  // Save or update menu item
  async function saveMenuItem(item: Partial<NavigationItem>) {
    setSaving(true);
    try {
      const method = item.id ? "PUT" : "POST";
      const res = await fetch("/api/admin/navigation", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });

      if (res.ok) {
        await fetchMenuItems();
        setEditingItem(null);
        setIsAddingNew(false);
      } else {
        alert("Failed to save menu item");
      }
    } catch (error) {
      console.error("Error saving menu item:", error);
      alert("Error saving menu item");
    } finally {
      setSaving(false);
    }
  }

  // Delete menu item
  async function deleteMenuItem(id: string) {
    if (!confirm("Are you sure you want to delete this menu item?")) return;

    try {
      const res = await fetch(`/api/admin/navigation?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        await fetchMenuItems();
      } else {
        alert("Failed to delete menu item");
      }
    } catch (error) {
      console.error("Error deleting menu item:", error);
    }
  }

  // Initialize default navigation
  async function initializeDefaultNav() {
    if (!confirm("This will create default navigation items. Continue?")) return;

    setSaving(true);
    try {
      const res = await fetch("/api/admin/navigation/init", { method: "POST" });
      if (res.ok) {
        await fetchMenuItems();
        alert("Default navigation initialized!");
      }
    } catch (error) {
      console.error("Error initializing navigation:", error);
    } finally {
      setSaving(false);
    }
  }

  // Render menu tree
  function renderMenuTree(items: NavigationItem[], level = 0) {
    const topLevelItems = items.filter((item) => item.parentId === null);
    
    return topLevelItems.sort((a, b) => a.order - b.order).map((item) => {
      const children = items.filter((child) => child.parentId === item.id);
      
      return (
        <div key={item.id} className={`${level > 0 ? 'ml-8 border-l-2 border-gray-200 pl-4' : ''} mb-3`}>
          <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  {item.icon && <span className="text-2xl">{item.icon}</span>}
                  <div>
                    <h3 className="font-semibold text-navy-900">{item.label}</h3>
                    {item.href && (
                      <p className="text-sm text-gray-500">{item.href}</p>
                    )}
                    {item.description && (
                      <p className="text-xs text-gray-400 mt-1">{item.description}</p>
                    )}
                  </div>
                  {!item.isVisible && (
                    <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded">
                      Hidden
                    </span>
                  )}
                  {item.badge && (
                    <span className={`px-2 py-1 text-xs rounded ${
                      item.badgeColor === 'red' ? 'bg-red-100 text-red-700' :
                      item.badgeColor === 'green' ? 'bg-green-100 text-green-700' :
                      item.badgeColor === 'blue' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditingItem(item)}
                  className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteMenuItem(item.id)}
                  className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
          
          {children.length > 0 && (
            <div className="mt-2">
              {renderMenuTree(children, level + 1)}
            </div>
          )}
        </div>
      );
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-navy-900">Navigation Management</h1>
          <p className="text-gray-600 mt-1">
            Manage your website navigation menu and sub-menus
          </p>
        </div>
        <div className="flex gap-3">
          {menuItems.length === 0 && (
            <Button onClick={initializeDefaultNav} variant="secondary" isLoading={saving}>
              Initialize Default
            </Button>
          )}
          <Button onClick={() => setIsAddingNew(true)} variant="primary">
            + Add Menu Item
          </Button>
        </div>
      </div>

      {/* Menu Tree */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-navy-900 mb-4">Current Navigation</h2>
        {menuItems.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No navigation items yet</p>
            <Button onClick={initializeDefaultNav} variant="primary" isLoading={saving}>
              Initialize Default Navigation
            </Button>
          </div>
        ) : (
          renderMenuTree(menuItems)
        )}
      </div>

      {/* Edit/Add Form Modal */}
      {(editingItem || isAddingNew) && (
        <MenuItemForm
          item={editingItem}
          parentOptions={menuItems.filter((item) => item.parentId === null)}
          onSave={saveMenuItem}
          onCancel={() => {
            setEditingItem(null);
            setIsAddingNew(false);
          }}
          isSaving={saving}
        />
      )}
    </div>
  );
}

// Menu Item Form Component
function MenuItemForm({
  item,
  parentOptions,
  onSave,
  onCancel,
  isSaving,
}: {
  item: NavigationItem | null;
  parentOptions: NavigationItem[];
  onSave: (item: Partial<NavigationItem>) => void;
  onCancel: () => void;
  isSaving: boolean;
}) {
  const [formData, setFormData] = useState<Partial<NavigationItem>>(
    item || {
      label: "",
      href: "",
      icon: "",
      description: "",
      order: 0,
      parentId: null,
      isVisible: true,
      openInNewTab: false,
      badge: "",
      badgeColor: "blue",
      isMegaMenu: false,
      columns: 1,
    }
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave(formData);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="p-6">
          <h2 className="text-2xl font-bold text-navy-900 mb-6">
            {item ? "Edit Menu Item" : "Add New Menu Item"}
          </h2>

          <div className="space-y-4">
            {/* Label */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Label *
              </label>
              <input
                type="text"
                value={formData.label || ""}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="e.g., Research, Publications"
                required
              />
            </div>

            {/* URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL Path
              </label>
              <input
                type="text"
                value={formData.href || ""}
                onChange={(e) => setFormData({ ...formData, href: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="e.g., /research, /publications"
              />
              <p className="text-xs text-gray-500 mt-1">
                Leave empty for dropdown-only items
              </p>
            </div>

            {/* Icon */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Icon (Emoji or Icon Name)
              </label>
              <input
                type="text"
                value={formData.icon || ""}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="e.g., 🔬, 📚, research"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                rows={2}
                placeholder="Brief description for mega menu"
              />
            </div>

            {/* Parent Menu */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Parent Menu
              </label>
              <select
                value={formData.parentId || ""}
                onChange={(e) =>
                  setFormData({ ...formData, parentId: e.target.value || null })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="">Top Level (No Parent)</option>
                {parentOptions.map((parent) => (
                  <option key={parent.id} value={parent.id}>
                    {parent.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Order */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Display Order
              </label>
              <input
                type="number"
                value={formData.order || 0}
                onChange={(e) =>
                  setFormData({ ...formData, order: parseInt(e.target.value) })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            {/* Badge */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Badge Text
                </label>
                <input
                  type="text"
                  value={formData.badge || ""}
                  onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="e.g., New, Hot"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Badge Color
                </label>
                <select
                  value={formData.badgeColor || "blue"}
                  onChange={(e) =>
                    setFormData({ ...formData, badgeColor: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="blue">Blue</option>
                  <option value="green">Green</option>
                  <option value="red">Red</option>
                  <option value="yellow">Yellow</option>
                </select>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isVisible ?? true}
                  onChange={(e) =>
                    setFormData({ ...formData, isVisible: e.target.checked })
                  }
                  className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">Visible in navigation</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.openInNewTab ?? false}
                  onChange={(e) =>
                    setFormData({ ...formData, openInNewTab: e.target.checked })
                  }
                  className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">Open in new tab</span>
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isMegaMenu ?? false}
                  onChange={(e) =>
                    setFormData({ ...formData, isMegaMenu: e.target.checked })
                  }
                  className="w-4 h-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">Enable mega menu dropdown</span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
            <Button type="button" onClick={onCancel} variant="secondary">
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isSaving}>
              {isSaving ? "Saving..." : "Save Menu Item"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
