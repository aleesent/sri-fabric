import React, { useState, useEffect } from 'react';
import { Download, Trash2, Search, Mail, Users } from 'lucide-react';

interface AdminSubscribersProps {
  token: string;
}

export const AdminSubscribers: React.FC<AdminSubscribersProps> = ({ token }) => {
  const [subscribers, setSubscribers] = useState<{ id: number; email: string; status: string; subscribedAt: string }[]>([]);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchSubscribers = () => {
    setLoading(true);
    fetch('/api/admin/subscribers', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setSubscribers(Array.isArray(data) ? data : []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSubscribers();
  }, [token]);

  const handleDelete = async (id: number) => {
    try {
      await fetch(`/api/admin/subscribers/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeleteConfirmId(null);
      fetchSubscribers();
    } catch (err: any) {
      console.error(err);
    }
  };

  const exportCSV = () => {
    if (!subscribers.length) return;
    const headers = ['ID', 'Email Address', 'Status', 'Date Subscribed'];
    const rows = subscribers.map((s) => [s.id, s.email, s.status, new Date(s.subscribedAt).toISOString()]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `SRI_Fabrics_Subscribers_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = subscribers.filter((s) => s.email.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-[#4a1122]">
            AUDIENCE MANAGEMENT
          </span>
          <h1 className="font-serif text-3xl font-bold text-stone-900 mt-0.5">
            Newsletter Subscribers
          </h1>
        </div>

        <button
          onClick={exportCSV}
          className="px-4 py-2 bg-stone-900 hover:bg-black text-white text-xs font-semibold rounded flex items-center gap-2 shadow cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-[#dfb15b]" />
          <span>Export Subscribers to CSV</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg border border-stone-200 shadow-2xs flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search subscriber email..."
            className="w-full bg-stone-50 border border-stone-200 rounded px-3 py-2 pl-9 text-xs focus:outline-none focus:border-[#4a1122]"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
        </div>
        <span className="text-xs text-stone-500 font-medium">Total: {filtered.length} subscribers</span>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-stone-200">
            <thead className="bg-stone-50 text-stone-600 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Email Address</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Subscribed Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-stone-400">Loading subscribers...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-stone-400">No subscribers found.</td>
                </tr>
              ) : (
                filtered.map((sub) => (
                  <tr key={sub.id} className="hover:bg-stone-50/70">
                    <td className="py-3.5 px-4 font-semibold text-stone-900 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[#dfb15b]" />
                      <span>{sub.email}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {sub.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-stone-500">
                      {new Date(sub.subscribedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(sub.id)}
                        className="p-1.5 text-red-600 hover:text-red-800 rounded cursor-pointer"
                        title="Delete subscriber"
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
          <div className="bg-[#faf7f2] rounded-xl p-6 max-w-sm w-full space-y-4 shadow-2xl border border-stone-300">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-bold text-stone-900">Remove Subscriber?</h3>
            </div>
            <p className="text-xs text-stone-600">
              Are you sure you want to permanently remove this email from your subscriber list?
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
                <span>Remove Subscriber</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
