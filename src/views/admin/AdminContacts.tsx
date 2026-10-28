import React, { useState, useEffect } from 'react';
import { ContactSubmission } from '../../types/index.ts';
import { Mail, Trash2, Search, X, CheckCircle, AlertCircle } from 'lucide-react';

interface AdminContactsProps {
  token: string;
}

export const AdminContacts: React.FC<AdminContactsProps> = ({ token }) => {
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const fetchContacts = () => {
    setLoading(true);
    fetch('/api/admin/contacts', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setContacts(Array.isArray(data) ? data : []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchContacts();
  }, [token]);

  const handleDelete = async (id: number) => {
    try {
      await fetch(`/api/admin/contacts/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeleteConfirmId(null);
      if (selectedContact?.id === id) setSelectedContact(null);
      fetchContacts();
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await fetch(`/api/admin/contacts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      fetchContacts();
      if (selectedContact) setSelectedContact({ ...selectedContact, status: status as any });
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filtered = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase()) ||
      c.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="border-b border-stone-200 pb-4">
        <span className="text-xs uppercase font-bold tracking-wider text-[#4a1122]">
          INBOX
        </span>
        <h1 className="font-serif text-3xl font-bold text-stone-900 mt-0.5">
          Contact Messages
        </h1>
      </div>

      <div className="bg-white p-4 rounded-lg border border-stone-200 shadow-2xs flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search contact submissions..."
            className="w-full bg-stone-50 border border-stone-200 rounded px-3 py-2 pl-9 text-xs focus:outline-none focus:border-[#4a1122]"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
        </div>
        <span className="text-xs text-stone-500 font-medium">Total: {filtered.length} messages</span>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-stone-200">
            <thead className="bg-stone-50 text-stone-600 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Sender</th>
                <th className="py-3.5 px-4">Subject</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-stone-400">Loading messages...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-stone-400">No contact messages received yet.</td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-stone-50/70">
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-stone-900">{item.name}</p>
                      <p className="text-[11px] text-stone-500">{item.email} • {item.phone || item.country || ''}</p>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-stone-800 truncate max-w-xs">{item.subject}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.status === 'NEW' ? 'bg-blue-100 text-blue-800' : 'bg-stone-100 text-stone-700'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-stone-500">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => setSelectedContact(item)}
                        className="px-2.5 py-1 bg-stone-100 hover:bg-[#4a1122] hover:text-[#f7eedf] rounded font-semibold transition-colors cursor-pointer"
                      >
                        View
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(item.id)}
                        className="p-1 text-red-500 hover:text-red-700 rounded cursor-pointer"
                        title="Delete Message"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-[#faf7f2] rounded-xl shadow-2xl overflow-hidden border border-stone-300">
            <div className="bg-[#24060d] text-white px-6 py-4 flex items-center justify-between border-b border-[#dfb15b]/30">
              <h3 className="font-serif text-lg font-bold text-[#f7eedf]">Message from {selectedContact.name}</h3>
              <button onClick={() => setSelectedContact(null)} className="text-white/70 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="bg-white p-4 rounded-lg border border-stone-200 space-y-1">
                <p><strong>From:</strong> {selectedContact.name} &lt;{selectedContact.email}&gt;</p>
                {selectedContact.company && <p><strong>Company:</strong> {selectedContact.company}</p>}
                {selectedContact.phone && <p><strong>Phone:</strong> {selectedContact.phone}</p>}
                {selectedContact.country && <p><strong>Country:</strong> {selectedContact.country}</p>}
                <p><strong>Date:</strong> {new Date(selectedContact.createdAt).toLocaleString()}</p>
                <p className="pt-2"><strong>Subject:</strong> {selectedContact.subject}</p>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Message Body:</label>
                <div className="bg-white p-4 rounded-lg border border-stone-200 whitespace-pre-line leading-relaxed text-stone-800">
                  {selectedContact.message}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-stone-200">
                <div className="flex items-center gap-2">
                  <span className="text-stone-500">Mark Status:</span>
                  <button
                    onClick={() => handleUpdateStatus(selectedContact.id, 'REPLIED')}
                    className="px-2.5 py-1 bg-emerald-50 text-emerald-800 font-semibold rounded border border-emerald-200"
                  >
                    Mark Replied
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedContact.id, 'ARCHIVED')}
                    className="px-2.5 py-1 bg-stone-100 text-stone-700 font-semibold rounded border border-stone-300"
                  >
                    Archive
                  </button>
                </div>

                <a
                  href={`mailto:${selectedContact.email}?subject=Re: ${encodeURIComponent(selectedContact.subject)}`}
                  className="px-4 py-2 bg-[#4a1122] hover:bg-[#60192e] text-[#f7eedf] font-semibold rounded uppercase tracking-wider"
                >
                  Reply via Email
                </a>
              </div>
            </div>
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
              <h3 className="font-serif text-lg font-bold text-stone-900">Delete Message?</h3>
            </div>
            <p className="text-xs text-stone-600">
              Are you sure you want to permanently delete this contact message?
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
                <span>Delete Message</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
