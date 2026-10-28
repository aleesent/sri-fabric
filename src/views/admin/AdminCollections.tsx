import React, { useState, useEffect } from 'react';
import { Collection } from '../../types/index.ts';
import { Plus, Edit2, Trash2, X, AlertCircle } from 'lucide-react';

interface AdminCollectionsProps {
  token: string;
}

export const AdminCollections: React.FC<AdminCollectionsProps> = ({ token }) => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Collection | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Collection>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = () => {
    setLoading(true);
    fetch('/api/admin/collections', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setCollections(Array.isArray(data) ? data : []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchItems();
  }, [token]);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      slug: '',
      tagline: 'Premium Fabric',
      description: '',
      imageUrl: '',
      featured: true,
      sortOrder: collections.length + 1,
      isActive: true,
    });
    setError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Collection) => {
    setEditingItem(item);
    setFormData({ ...item });
    setError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const isEdit = !!editingItem;
    const url = isEdit ? `/api/admin/collections/${editingItem.id}` : '/api/admin/collections';
    const method = isEdit ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save collection');

      setIsModalOpen(false);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('store-data-updated'));
        localStorage.setItem('sri_store_updated', Date.now().toString());
      }
      fetchItems();
    } catch (err: any) {
      setError(err.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`/api/admin/collections/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeleteConfirmId(null);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('store-data-updated'));
        localStorage.setItem('sri_store_updated', Date.now().toString());
      }
      fetchItems();
    } catch (err: any) {
      setError(err.message || 'Failed to delete collection');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-[#4a1122]">
            COLLECTIONS CMS
          </span>
          <h1 className="font-serif text-3xl font-bold text-stone-900 mt-0.5">
            Curated Collections
          </h1>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-[#4a1122] hover:bg-[#60192e] text-[#f7eedf] text-xs font-semibold uppercase tracking-wider rounded flex items-center gap-2 shadow cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#dfb15b]" />
          <span>New Collection</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-stone-200">
            <thead className="bg-stone-50 text-stone-600 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Collection</th>
                <th className="py-3.5 px-4">Tagline</th>
                <th className="py-3.5 px-4">Featured</th>
                <th className="py-3.5 px-4">Order</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-stone-400">Loading collections...</td>
                </tr>
              ) : collections.map((col) => (
                <tr key={col.id} className="hover:bg-stone-50/70">
                  <td className="py-3.5 px-4 flex items-center gap-3">
                    <img
                      src={col.imageUrl}
                      alt={col.name}
                      className="w-10 h-10 rounded object-cover border border-stone-200 shrink-0 bg-stone-100"
                    />
                    <div>
                      <p className="font-semibold text-stone-900">{col.name}</p>
                      <p className="text-[11px] text-stone-400 font-mono">{col.slug}</p>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-stone-700">{col.tagline || '—'}</td>
                  <td className="py-3.5 px-4">
                    {col.featured ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                        Homepage
                      </span>
                    ) : (
                      <span className="text-stone-400">Standard</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-stone-600 font-mono">{col.sortOrder}</td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(col)}
                      className="p-1.5 text-stone-600 hover:text-[#4a1122] rounded cursor-pointer"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(col.id)}
                      className="p-1.5 text-red-600 hover:text-red-800 rounded cursor-pointer"
                      title="Delete Collection"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-[#faf7f2] rounded-xl shadow-2xl overflow-hidden border border-stone-300">
            <div className="bg-[#24060d] text-white px-6 py-4 flex items-center justify-between border-b border-[#dfb15b]/30">
              <h3 className="font-serif text-lg font-bold text-[#f7eedf]">
                {editingItem ? `Edit Collection: ${editingItem.name}` : 'New Curated Collection'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-white/70 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block font-semibold text-stone-800 mb-1">Collection Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={(e) => {
                    const name = e.target.value;
                    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
                    setFormData({ ...formData, name, slug: formData.slug || slug });
                  }}
                  className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-900 focus:outline-none focus:border-[#4a1122]"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-800 mb-1">Slug</label>
                <input
                  type="text"
                  required
                  value={formData.slug || ''}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-900 focus:outline-none focus:border-[#4a1122]"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-800 mb-1">Tagline</label>
                <input
                  type="text"
                  value={formData.tagline || ''}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="e.g. Premium Fabric / Luxury Collection"
                  className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-900 focus:outline-none focus:border-[#4a1122]"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-800 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-900 focus:outline-none focus:border-[#4a1122]"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-800 mb-1">Image URL / Data URI</label>
                <input
                  type="text"
                  value={formData.imageUrl || ''}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-900 focus:outline-none focus:border-[#4a1122]"
                />
              </div>

              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-stone-800">
                  <input
                    type="checkbox"
                    checked={formData.featured ?? true}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 text-[#4a1122]"
                  />
                  <span>Featured on Homepage</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-stone-800">
                  <input
                    type="checkbox"
                    checked={formData.isActive ?? true}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-[#4a1122]"
                  />
                  <span>Active</span>
                </label>
              </div>

              <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-stone-600 hover:text-stone-900 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-[#4a1122] hover:bg-[#60192e] text-[#f7eedf] font-semibold uppercase tracking-wider rounded shadow cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : 'Save Collection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-[#faf7f2] rounded-xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-stone-300">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-stone-900">Confirm Deletion</h3>
            </div>
            <p className="text-xs text-stone-600">
              Are you sure you want to permanently delete this collection? Any fabrics tagged with this collection will remain but lose the collection tag.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-stone-600 hover:text-stone-900 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded shadow cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Permanently</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
