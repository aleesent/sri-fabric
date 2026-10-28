import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Copy, Check, Search, Image as ImageIcon, X, AlertCircle } from 'lucide-react';

interface AdminMediaProps {
  token: string;
}

export const AdminMedia: React.FC<AdminMediaProps> = ({ token }) => {
  const [mediaItems, setMediaItems] = useState<{ id: number; fileName: string; url: string; mimeType?: string; caption?: string; createdAt: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const [fileName, setFileName] = useState('');
  const [url, setUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchMedia = () => {
    setLoading(true);
    fetch('/api/admin/media', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setMediaItems(Array.isArray(data) ? data : []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMedia();
  }, [token]);

  const handleAddMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/media', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ fileName, url, caption }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add media');
      setIsModalOpen(false);
      setFileName('');
      setUrl('');
      setCaption('');
      fetchMedia();
    } catch (err: any) {
      setError(err.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`/api/admin/media/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeleteConfirmId(null);
      fetchMedia();
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleCopy = (id: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = mediaItems.filter(
    (m) => m.fileName.toLowerCase().includes(search.toLowerCase()) || (m.caption && m.caption.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-[#4a1122]">
            ASSET REPOSITORY
          </span>
          <h1 className="font-serif text-3xl font-bold text-stone-900 mt-0.5">
            Media & Textile Images Library
          </h1>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-[#4a1122] hover:bg-[#60192e] text-[#f7eedf] text-xs font-semibold uppercase tracking-wider rounded flex items-center gap-2 shadow cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#dfb15b]" />
          <span>Add Media Asset</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg border border-stone-200 shadow-2xs flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search media files by name or caption..."
            className="w-full bg-stone-50 border border-stone-200 rounded px-3 py-2 pl-9 text-xs focus:outline-none focus:border-[#4a1122]"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
        </div>
        <span className="text-xs text-stone-500 font-medium">Total: {filtered.length} assets</span>
      </div>

      {loading ? (
        <div className="py-20 text-center text-stone-400">Loading media library...</div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-xl border border-stone-200 p-8 space-y-3">
          <ImageIcon className="w-12 h-12 text-stone-300 mx-auto" />
          <h3 className="font-serif text-lg font-bold text-stone-700">Media Library is Empty</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Store reusable textile photography, factory tour photos, and swatch scans to reference across fabrics and articles.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2 bg-[#4a1122] text-[#f7eedf] text-xs font-semibold rounded"
          >
            Add First Asset
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-lg border border-stone-200 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="aspect-square bg-stone-100 overflow-hidden relative">
                <img
                  src={item.url}
                  alt={item.fileName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="p-3 space-y-2">
                <p className="font-semibold text-stone-900 text-xs truncate" title={item.fileName}>
                  {item.fileName}
                </p>
                {item.caption && (
                  <p className="text-[11px] text-stone-500 truncate">{item.caption}</p>
                )}

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                  <button
                    onClick={() => handleCopy(item.id, item.url)}
                    className="flex items-center gap-1 text-[#4a1122] hover:underline font-semibold"
                    title="Copy URL"
                  >
                    {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === item.id ? 'Copied' : 'Copy URL'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeleteConfirmId(item.id)}
                    className="p-1 text-red-500 hover:text-red-700 cursor-pointer"
                    title="Delete Media"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Media Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-[#faf7f2] rounded-xl shadow-2xl overflow-hidden border border-stone-300">
            <div className="bg-[#24060d] text-white px-6 py-4 flex items-center justify-between border-b border-[#dfb15b]/30">
              <h3 className="font-serif text-lg font-bold text-[#f7eedf]">Add Media Asset</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-white/70 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMedia} className="p-6 space-y-4 text-xs">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block font-semibold text-stone-800 mb-1">File / Asset Name *</label>
                <input
                  type="text"
                  required
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="e.g. Mulberry-Silk-Emerald-Swatch.jpg"
                  className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-900 focus:outline-none focus:border-[#4a1122]"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-800 mb-1">Image URL / Data URI *</label>
                <input
                  type="text"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://... or data:image/..."
                  className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-900 focus:outline-none focus:border-[#4a1122]"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-800 mb-1">Caption / Description</label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="e.g. Zari Kadwa Brocade Fabric Macro"
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
                  {submitting ? 'Adding...' : 'Add to Media Library'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
