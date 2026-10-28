import React, { useState, useEffect } from 'react';
import { Testimonial } from '../../types/index.ts';
import { Plus, Edit2, Trash2, X, Star, AlertCircle } from 'lucide-react';

interface AdminTestimonialsProps {
  token: string;
}

export const AdminTestimonials: React.FC<AdminTestimonialsProps> = ({ token }) => {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Testimonial>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = () => {
    setLoading(true);
    fetch('/api/admin/testimonials', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setItems(Array.isArray(data) ? data : []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchItems();
  }, [token]);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      clientName: '',
      company: '',
      designation: 'Fashion Designer',
      country: 'India',
      testimonial: '',
      rating: 5,
      featured: true,
      status: 'ACTIVE',
      sortOrder: items.length + 1,
    });
    setError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Testimonial) => {
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
    const url = isEdit ? `/api/admin/testimonials/${editingItem.id}` : '/api/admin/testimonials';
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
      if (!res.ok) throw new Error(data.error || 'Failed to save testimonial');

      setIsModalOpen(false);
      fetchItems();
    } catch (err: any) {
      setError(err.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`/api/admin/testimonials/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeleteConfirmId(null);
      fetchItems();
    } catch (err: any) {
      setError(err.message || 'Failed to delete testimonial');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-[#4a1122]">
            CLIENT REPUTATION
          </span>
          <h1 className="font-serif text-3xl font-bold text-stone-900 mt-0.5">
            Testimonials Manager
          </h1>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-[#4a1122] hover:bg-[#60192e] text-[#f7eedf] text-xs font-semibold uppercase tracking-wider rounded flex items-center gap-2 shadow cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#dfb15b]" />
          <span>New Testimonial</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-stone-200">
            <thead className="bg-stone-50 text-stone-600 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Client</th>
                <th className="py-3.5 px-4">Company / Country</th>
                <th className="py-3.5 px-4">Rating</th>
                <th className="py-3.5 px-4">Testimonial Quote</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-stone-400">Loading testimonials...</td>
                </tr>
              ) : items.map((t) => (
                <tr key={t.id} className="hover:bg-stone-50/70">
                  <td className="py-3.5 px-4 font-semibold text-stone-900">{t.clientName}</td>
                  <td className="py-3.5 px-4 text-stone-600">{t.company} ({t.country})</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center text-[#dfb15b]">
                      {[...Array(t.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-stone-600 italic truncate max-w-sm">{t.testimonial}</td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(t)}
                      className="p-1.5 text-stone-600 hover:text-[#4a1122] rounded cursor-pointer"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(t.id)}
                      className="p-1.5 text-red-600 hover:text-red-800 rounded cursor-pointer"
                      title="Delete Testimonial"
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
                {editingItem ? 'Edit Testimonial' : 'Create New Testimonial'}
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
                <label className="block font-semibold text-stone-800 mb-1">Client Name *</label>
                <input
                  type="text"
                  required
                  value={formData.clientName || ''}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-900 focus:outline-none focus:border-[#4a1122]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-800 mb-1">Company / Label *</label>
                  <input
                    type="text"
                    required
                    value={formData.company || ''}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-900 focus:outline-none focus:border-[#4a1122]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-800 mb-1">Country *</label>
                  <input
                    type="text"
                    required
                    value={formData.country || ''}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-900 focus:outline-none focus:border-[#4a1122]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-800 mb-1">Testimonial Quote *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.testimonial || ''}
                  onChange={(e) => setFormData({ ...formData, testimonial: e.target.value })}
                  className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-900 focus:outline-none focus:border-[#4a1122]"
                />
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
                  {submitting ? 'Saving...' : 'Save Testimonial'}
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
              <h3 className="font-serif text-lg font-bold text-stone-900">Delete Testimonial?</h3>
            </div>
            <p className="text-xs text-stone-600">
              Are you sure you want to permanently delete this client testimonial?
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
                <span>Delete Testimonial</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
