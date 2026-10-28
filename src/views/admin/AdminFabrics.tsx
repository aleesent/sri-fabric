import React, { useState, useEffect } from 'react';
import { Fabric, Category, Collection } from '../../types/index.ts';
import { Plus, Edit2, Trash2, Search, X, Check, AlertCircle, FileSpreadsheet } from 'lucide-react';

interface AdminFabricsProps {
  token: string;
}

export const AdminFabrics: React.FC<AdminFabricsProps> = ({ token }) => {
  const [fabrics, setFabrics] = useState<Fabric[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [syncingExcel, setSyncingExcel] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFabric, setEditingFabric] = useState<Fabric | null>(null);
  const [formData, setFormData] = useState<Partial<Fabric>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const fetchFabrics = () => {
    setLoading(true);
    fetch('/api/admin/fabrics', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setFabrics(Array.isArray(data) ? data : []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchFabrics();
    fetch('/api/admin/categories', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => Array.isArray(d) && setCategories(d));
    fetch('/api/admin/collections', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => Array.isArray(d) && setCollections(d));
  }, [token]);

  const handleOpenCreate = () => {
    setEditingFabric(null);
    setFormData({
      name: '',
      slug: '',
      fabricType: 'Chinon',
      categoryId: categories[0]?.id || null,
      collectionId: collections[0]?.id || null,
      description: '',
      longDescription: '',
      composition: '100% Viscose Chinon',
      gsm: '85 GSM',
      width: '44 inches',
      finish: 'Soft Silk Crepe',
      pattern: 'Plain Dyed',
      availableColours: 'Dusty Rose, Wine Burgundy, Emerald Green, Royal Navy',
      applications: 'Bridal Sarees, Gowns, Dupattas',
      moq: '100 Metres',
      primaryImageUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400"><rect width="100%" height="100%" fill="%234a1122"/><text x="50%" y="50%" fill="%23dfb15b" font-family="serif" font-size="24" text-anchor="middle">SRI FABRICS</text></svg>',
      featured: false,
      isActive: true,
    });
    setError(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (fabric: Fabric) => {
    setEditingFabric(fabric);
    setFormData({ ...fabric });
    setError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const isEdit = !!editingFabric;
    const url = isEdit ? `/api/admin/fabrics/${editingFabric.id}` : '/api/admin/fabrics';
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
      if (!res.ok) throw new Error(data.error || 'Failed to save fabric');

      setIsModalOpen(false);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('store-data-updated'));
        localStorage.setItem('sri_store_updated', Date.now().toString());
      }
      fetchFabrics();
    } catch (err: any) {
      setError(err.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/fabrics/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete');
      setDeleteConfirmId(null);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('store-data-updated'));
        localStorage.setItem('sri_store_updated', Date.now().toString());
      }
      fetchFabrics();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSyncExcelCatalog = async () => {
    setSyncingExcel(true);
    setSyncMessage(null);
    try {
      const res = await fetch('/api/admin/import-excel-catalog', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Sync failed');
      setSyncMessage(`Published ${data.totalRows} products from Excel template (${data.inserted} new, ${data.updated} refreshed).`);
      if (typeof window !== 'undefined') {
        localStorage.setItem('sri_store_updated', Date.now().toString());
      }
      fetchFabrics();
      setTimeout(() => setSyncMessage(null), 6000);
    } catch (err: any) {
      setSyncMessage(`Sync Error: ${err.message}`);
    } finally {
      setSyncingExcel(false);
    }
  };

  const filtered = fabrics.filter((f) =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.fabricType.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-[#4a1122]">
            CATALOGUE MANAGEMENT
          </span>
          <h1 className="font-serif text-3xl font-bold text-stone-900 mt-0.5">
            Fabrics Catalogue
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleSyncExcelCatalog}
            disabled={syncingExcel}
            className="px-3.5 py-2.5 bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 hover:text-stone-900 text-xs font-semibold rounded flex items-center gap-2 shadow-2xs cursor-pointer transition-colors disabled:opacity-50"
            title="Import and sync all products from public/SRI_FABRIC_Product_Catalog_Template.xlsx"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>{syncingExcel ? 'Syncing Catalog...' : 'Sync Excel Catalog'}</span>
          </button>

          <button
            onClick={handleOpenCreate}
            className="px-4 py-2.5 bg-[#4a1122] hover:bg-[#60192e] text-[#f7eedf] text-xs font-semibold uppercase tracking-wider rounded flex items-center gap-2 shadow cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#dfb15b]" />
            <span>Add New Fabric</span>
          </button>
        </div>
      </div>

      {syncMessage && (
        <div className={`p-3.5 rounded-lg text-xs font-medium flex items-center gap-2 ${
          syncMessage.startsWith('Sync Error') ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
        }`}>
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{syncMessage}</span>
        </div>
      )}

      {/* Search Filter */}
      <div className="bg-white p-4 rounded-lg border border-stone-200 shadow-2xs flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter fabrics by name, material, or weave..."
            className="w-full bg-stone-50 border border-stone-200 rounded px-3 py-2 pl-9 text-xs focus:outline-none focus:border-[#4a1122]"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
        </div>

        <span className="text-xs text-stone-500 font-medium">
          Total: {filtered.length} fabrics
        </span>
      </div>

      {/* Fabrics Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-stone-200">
            <thead className="bg-stone-50 text-stone-600 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Fabric</th>
                <th className="py-3.5 px-4">Type</th>
                <th className="py-3.5 px-4">MOQ</th>
                <th className="py-3.5 px-4">Weight / Width</th>
                <th className="py-3.5 px-4">Featured</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-400">
                    Loading fabrics...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-400">
                    No fabrics found in catalog. Click "Add New Fabric" to create one.
                  </td>
                </tr>
              ) : (
                filtered.map((fabric) => (
                  <tr key={fabric.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img
                        src={fabric.primaryImageUrl}
                        alt={fabric.name}
                        className="w-10 h-10 rounded object-cover border border-stone-200 shrink-0 bg-stone-100"
                      />
                      <div>
                        <p className="font-semibold text-stone-900">{fabric.name}</p>
                        <p className="text-[11px] text-stone-400 font-mono">{fabric.slug}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-stone-700">{fabric.fabricType}</td>
                    <td className="py-3 px-4 font-bold text-[#4a1122]">{fabric.moq || '100m'}</td>
                    <td className="py-3 px-4 text-stone-600">{fabric.gsm || '—'} / {fabric.width || '—'}</td>
                    <td className="py-3 px-4">
                      {fabric.featured ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                          Featured
                        </span>
                      ) : (
                        <span className="text-stone-400 text-[11px]">Standard</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(fabric)}
                        className="p-1.5 text-stone-600 hover:text-[#4a1122] hover:bg-stone-100 rounded"
                        title="Edit Fabric"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirmId(fabric.id)}
                        className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                        title="Delete Fabric"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full space-y-4 shadow-xl border border-stone-200">
            <h3 className="font-serif text-lg font-bold text-stone-900">Confirm Fabric Deletion</h3>
            <p className="text-xs text-stone-600">
              Are you sure you want to permanently remove this fabric and all its related image records from the catalogue?
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-stone-600 hover:text-stone-900 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-xs" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-3xl bg-[#faf7f2] rounded-xl shadow-2xl overflow-hidden border border-stone-300 my-8 z-10">
            <div className="bg-[#24060d] text-white px-6 py-4 flex items-center justify-between border-b border-[#dfb15b]/30">
              <h3 className="font-serif text-lg font-bold text-[#f7eedf]">
                {editingFabric ? `Edit Fabric: ${editingFabric.name}` : 'Create New Fabric Specification'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-white/70 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-800 mb-1">Fabric Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => {
                      const name = e.target.value;
                      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                      setFormData({ ...formData, name, slug: formData.slug || slug });
                    }}
                    placeholder="e.g. Royal Chinon Fabric"
                    className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-900 focus:outline-none focus:border-[#4a1122]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-800 mb-1">Slug *</label>
                  <input
                    type="text"
                    required
                    value={formData.slug || ''}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-900 focus:outline-none focus:border-[#4a1122]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-800 mb-1">Fabric Type *</label>
                  <input
                    type="text"
                    required
                    value={formData.fabricType || ''}
                    onChange={(e) => setFormData({ ...formData, fabricType: e.target.value })}
                    placeholder="e.g. Chinon, Pure Silk, Organza, Banarasi"
                    className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-900 focus:outline-none focus:border-[#4a1122]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-800 mb-1">Category</label>
                  <select
                    value={formData.categoryId || ''}
                    onChange={(e) => setFormData({ ...formData, categoryId: Number(e.target.value) || null })}
                    className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-900 focus:outline-none focus:border-[#4a1122]"
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-800 mb-1">Collection</label>
                  <select
                    value={formData.collectionId || ''}
                    onChange={(e) => setFormData({ ...formData, collectionId: Number(e.target.value) || null })}
                    className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-900 focus:outline-none focus:border-[#4a1122]"
                  >
                    <option value="">Select Collection</option>
                    {collections.map((col) => (
                      <option key={col.id} value={col.id}>{col.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-800 mb-1">Minimum Order Quantity (MOQ) *</label>
                  <input
                    type="text"
                    required
                    value={formData.moq || ''}
                    onChange={(e) => setFormData({ ...formData, moq: e.target.value })}
                    placeholder="e.g. 100 Metres"
                    className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-900 focus:outline-none focus:border-[#4a1122]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-800 mb-1">Composition</label>
                  <input
                    type="text"
                    value={formData.composition || ''}
                    onChange={(e) => setFormData({ ...formData, composition: e.target.value })}
                    placeholder="e.g. 100% Mulberry Silk"
                    className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-900 focus:outline-none focus:border-[#4a1122]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-800 mb-1">GSM</label>
                  <input
                    type="text"
                    value={formData.gsm || ''}
                    onChange={(e) => setFormData({ ...formData, gsm: e.target.value })}
                    placeholder="e.g. 85 GSM"
                    className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-900 focus:outline-none focus:border-[#4a1122]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-800 mb-1">Usable Width</label>
                  <input
                    type="text"
                    value={formData.width || ''}
                    onChange={(e) => setFormData({ ...formData, width: e.target.value })}
                    placeholder="e.g. 44 inches (112 cm)"
                    className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-900 focus:outline-none focus:border-[#4a1122]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-800 mb-1">Finish / Feel</label>
                  <input
                    type="text"
                    value={formData.finish || ''}
                    onChange={(e) => setFormData({ ...formData, finish: e.target.value })}
                    placeholder="e.g. Soft Crepe, Lustrous Calendered"
                    className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-900 focus:outline-none focus:border-[#4a1122]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-800 mb-1">Short Description *</label>
                <textarea
                  required
                  rows={2}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Concise overview for catalogue card..."
                  className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-900 focus:outline-none focus:border-[#4a1122]"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-800 mb-1">Long / Technical Description</label>
                <textarea
                  rows={3}
                  value={formData.longDescription || ''}
                  onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                  placeholder="Detailed weaving notes, yarn twist, dye compatibility..."
                  className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-900 focus:outline-none focus:border-[#4a1122]"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-800 mb-1">Available Colours (comma separated)</label>
                <input
                  type="text"
                  value={formData.availableColours || ''}
                  onChange={(e) => setFormData({ ...formData, availableColours: e.target.value })}
                  placeholder="Dusty Rose, Wine Burgundy, Emerald Green, Royal Navy"
                  className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-900 focus:outline-none focus:border-[#4a1122]"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-800 mb-1">Recommended Applications</label>
                <input
                  type="text"
                  value={formData.applications || ''}
                  onChange={(e) => setFormData({ ...formData, applications: e.target.value })}
                  placeholder="Bridal Sarees, Lehengas, Haute Couture Gowns, Dupattas"
                  className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-900 focus:outline-none focus:border-[#4a1122]"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-800 mb-1">Primary Image URL / Data URI *</label>
                <input
                  type="text"
                  required
                  value={formData.primaryImageUrl || ''}
                  onChange={(e) => setFormData({ ...formData, primaryImageUrl: e.target.value })}
                  placeholder="Paste URL or SVG data URI"
                  className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-900 focus:outline-none focus:border-[#4a1122]"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-stone-800">
                  <input
                    type="checkbox"
                    checked={formData.featured || false}
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
                  <span>Active in Catalogue</span>
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
                  {submitting ? 'Saving...' : 'Save Fabric'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
