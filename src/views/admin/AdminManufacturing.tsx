import React, { useState, useEffect } from 'react';
import { ManufacturingProcess } from '../../types/index.ts';
import { Plus, Edit2, Trash2, X, AlertCircle } from 'lucide-react';

interface AdminManufacturingProps {
  token: string;
}

export const AdminManufacturing: React.FC<AdminManufacturingProps> = ({ token }) => {
  const [processes, setProcesses] = useState<ManufacturingProcess[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ManufacturingProcess | null>(null);
  const [formData, setFormData] = useState<Partial<ManufacturingProcess>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = () => {
    setLoading(true);
    fetch('/api/manufacturing/processes')
      .then((r) => r.json())
      .then((data) => setProcesses(Array.isArray(data) ? data : []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      stepNumber: processes.length + 1,
      description: '',
      highlight: '',
      sortOrder: processes.length + 1,
      isActive: true,
    });
    setError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: ManufacturingProcess) => {
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
    const url = isEdit ? `/api/admin/manufacturing/processes/${editingItem.id}` : '/api/admin/manufacturing/processes';
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
      if (!res.ok) throw new Error(data.error || 'Failed to save process');

      setIsModalOpen(false);
      fetchItems();
    } catch (err: any) {
      setError(err.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this manufacturing step?')) return;
    try {
      await fetch(`/api/admin/manufacturing/processes/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchItems();
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-[#4a1122]">
            MANUFACTURING CMS
          </span>
          <h1 className="font-serif text-3xl font-bold text-stone-900 mt-0.5">
            Production Processes Manager
          </h1>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2.5 bg-[#4a1122] hover:bg-[#60192e] text-[#f7eedf] text-xs font-semibold uppercase tracking-wider rounded flex items-center gap-2 shadow cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#dfb15b]" />
          <span>New Process Step</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-stone-200">
            <thead className="bg-stone-50 text-stone-600 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Stage #</th>
                <th className="py-3.5 px-4">Title</th>
                <th className="py-3.5 px-4">Highlight Tag</th>
                <th className="py-3.5 px-4">Description</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-stone-400">Loading processes...</td>
                </tr>
              ) : processes.map((p) => (
                <tr key={p.id} className="hover:bg-stone-50/70">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#4a1122] text-sm">Stage {p.stepNumber}</td>
                  <td className="py-3.5 px-4 font-semibold text-stone-900">{p.title}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#dfb15b]/20 text-[#4a1122]">
                      {p.highlight || 'Standard'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-stone-600 truncate max-w-sm">{p.description}</td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(p)}
                      className="p-1.5 text-stone-600 hover:text-[#4a1122] rounded"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="p-1.5 text-red-600 hover:text-red-800 rounded"
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
                {editingItem ? 'Edit Production Step' : 'New Manufacturing Process Step'}
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-800 mb-1">Step Number *</label>
                  <input
                    type="number"
                    required
                    value={formData.stepNumber || 1}
                    onChange={(e) => setFormData({ ...formData, stepNumber: Number(e.target.value) })}
                    className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-900 focus:outline-none focus:border-[#4a1122]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-800 mb-1">Highlight Tag</label>
                  <input
                    type="text"
                    value={formData.highlight || ''}
                    onChange={(e) => setFormData({ ...formData, highlight: e.target.value })}
                    placeholder="e.g. 100% Tested Yarn Batches"
                    className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-900 focus:outline-none focus:border-[#4a1122]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-800 mb-1">Step Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Warping & Precision Weaving"
                  className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-900 focus:outline-none focus:border-[#4a1122]"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-800 mb-1">Description *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                  {submitting ? 'Saving...' : 'Save Step'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
