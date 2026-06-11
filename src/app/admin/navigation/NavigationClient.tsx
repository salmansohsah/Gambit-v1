'use client'

import { useState } from 'react'
import { NavigationItem, MenuType } from '@/lib/dal/navigation'
import { saveNavigationItem, removeNavigationItem } from './actions'
import { PlusIcon, PencilIcon, TrashIcon } from 'lucide-react'

interface NavigationClientProps {
  headerItems: NavigationItem[]
  footerItems: NavigationItem[]
  legalItems: NavigationItem[]
  socialItems: NavigationItem[]
}

export function NavigationClient({
  headerItems,
  footerItems,
  legalItems,
  socialItems,
}: NavigationClientProps) {
  const [activeTab, setActiveTab] = useState<MenuType>('header')
  const [isEditing, setIsEditing] = useState(false)
  const [editingItem, setEditingItem] = useState<Partial<NavigationItem> | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const itemsMap = {
    header: headerItems,
    footer: footerItems,
    legal: legalItems,
    social: socialItems,
  }

  const currentItems = itemsMap[activeTab]

  const handleEdit = (item: NavigationItem) => {
    setEditingItem(item)
    setIsEditing(true)
  }

  const handleCreate = () => {
    setEditingItem({
      menu_type: activeTab,
      label: '',
      href: '',
      display_order: currentItems.length > 0 ? Math.max(...currentItems.map(i => i.display_order)) + 10 : 10,
      is_active: true,
      is_external: activeTab === 'social',
      target: activeTab === 'social' ? '_blank' : '_self'
    })
    setIsEditing(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this navigation item?')) return
    setIsLoading(true)
    await removeNavigationItem(id)
    setIsLoading(false)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingItem) return
    setIsLoading(true)
    await saveNavigationItem(editingItem)
    setIsEditing(false)
    setEditingItem(null)
    setIsLoading(false)
  }

  return (
    <div className="bg-surface-panel border border-surface-elevated rounded-lg shadow-sm">
      {/* Tabs */}
      <div className="border-b border-surface-elevated flex gap-6 px-6">
        {(['header', 'footer', 'legal', 'social'] as MenuType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab)
              setIsEditing(false)
            }}
            className={`py-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? 'border-accent-gold text-white'
                : 'border-transparent text-gray-400 hover:text-gray-300'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="p-6">
        {isEditing && editingItem ? (
          <form onSubmit={handleSave} className="space-y-6 max-w-2xl bg-surface-deep p-6 rounded border border-surface-elevated">
            <h3 className="text-lg font-medium text-white">
              {editingItem.id ? 'Edit Item' : 'New Item'}
            </h3>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-400 mb-2">Label</label>
                <input
                  type="text"
                  required
                  value={editingItem.label || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, label: e.target.value })}
                  className="w-full bg-surface-panel border border-surface-elevated rounded px-3 py-2 text-white focus:outline-none focus:border-accent-gold transition-colors"
                />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-400 mb-2">URL / Href</label>
                <input
                  type="text"
                  required
                  value={editingItem.href || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, href: e.target.value })}
                  className="w-full bg-surface-panel border border-surface-elevated rounded px-3 py-2 text-white focus:outline-none focus:border-accent-gold transition-colors"
                />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-400 mb-2">Display Order</label>
                <input
                  type="number"
                  required
                  value={editingItem.display_order || 0}
                  onChange={(e) => setEditingItem({ ...editingItem, display_order: parseInt(e.target.value) })}
                  className="w-full bg-surface-panel border border-surface-elevated rounded px-3 py-2 text-white focus:outline-none focus:border-accent-gold transition-colors"
                />
              </div>

              {activeTab === 'social' && (
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-medium text-gray-400 mb-2">Icon Name</label>
                  <input
                    type="text"
                    value={editingItem.icon_name || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, icon_name: e.target.value })}
                    placeholder="e.g. twitter, linkedin"
                    className="w-full bg-surface-panel border border-surface-elevated rounded px-3 py-2 text-white focus:outline-none focus:border-accent-gold transition-colors"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingItem.is_active ?? true}
                  onChange={(e) => setEditingItem({ ...editingItem, is_active: e.target.checked })}
                  className="rounded border-surface-elevated bg-surface-panel text-accent-gold focus:ring-accent-gold"
                />
                <span className="text-sm text-gray-300">Active</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingItem.is_external ?? false}
                  onChange={(e) => setEditingItem({ ...editingItem, is_external: e.target.checked })}
                  className="rounded border-surface-elevated bg-surface-panel text-accent-gold focus:ring-accent-gold"
                />
                <span className="text-sm text-gray-300">External Link</span>
              </label>
            </div>

            <div className="flex gap-4 pt-4 border-t border-surface-elevated">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-accent-gold text-black px-4 py-2 text-sm font-medium rounded hover:bg-[#e6c170] transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : 'Save Item'}
              </button>
            </div>
          </form>
        ) : (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium text-white">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Links</h2>
              <button
                onClick={handleCreate}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded text-sm font-medium transition-colors border border-surface-elevated"
              >
                <PlusIcon size={16} /> Add Item
              </button>
            </div>

            {currentItems.length === 0 ? (
              <div className="text-center py-12 text-gray-500 border border-dashed border-surface-elevated rounded">
                No items found. Create one to get started.
              </div>
            ) : (
              <div className="border border-surface-elevated rounded overflow-hidden">
                <table className="w-full text-left text-sm text-gray-300">
                  <thead className="bg-surface-deep text-gray-500 uppercase text-xs">
                    <tr>
                      <th className="px-6 py-3 font-medium">Order</th>
                      <th className="px-6 py-3 font-medium">Label</th>
                      <th className="px-6 py-3 font-medium">URL</th>
                      <th className="px-6 py-3 font-medium">Status</th>
                      <th className="px-6 py-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-elevated">
                    {currentItems.map((item) => (
                      <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4">{item.display_order}</td>
                        <td className="px-6 py-4 font-medium text-white">{item.label}</td>
                        <td className="px-6 py-4 font-mono text-xs text-gray-500">{item.href}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${item.is_active ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                            {item.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <button
                              onClick={() => handleEdit(item)}
                              className="text-gray-400 hover:text-white transition-colors p-1"
                              title="Edit"
                            >
                              <PencilIcon size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="text-gray-400 hover:text-red-400 transition-colors p-1"
                              title="Delete"
                              disabled={isLoading}
                            >
                              <TrashIcon size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
