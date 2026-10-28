import React, { useState, useEffect } from 'react';
import { Enquiry } from '../../types/index.ts';
import { Search, Download, Trash2, Edit3, Eye, X, Filter, CheckCircle } from 'lucide-react';

interface AdminEnquiriesProps {
  token: string;
}

export const AdminEnquiries: React.FC<AdminEnquiriesProps> = ({ token }) => {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [editStatus, setEditStatus] = useState<string>('');
  const [editNotes, setEditNotes] = useState<string>('');
  const [saving, setSaving] = useState(false);

  const statuses = [
    'NEW',
    'CONTACTED',
    'IN DISCUSSION',
    'SAMPLE REQUESTED',
    'QUOTATION SENT',
    'CONVERTED',
    'CLOSED',
  ];

  const fetchEnquiries = () => {
    setLoading(true);
    fetch('/api/admin/enquiries', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setEnquiries(Array.isArray(data) ? data : []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEnquiries();
  }, [token]);

  const handleOpenDetail = (enq: Enquiry) => {
    setSelectedEnquiry(enq);
    setEditStatus(enq.status);
    setEditNotes(enq.internalNotes || '');
  };

  const handleUpdateStatus = async () => {
    if (!selectedEnquiry) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/enquiries/${selectedEnquiry.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: editStatus,
          internalNotes: editNotes,
        }),
      });

      if (!res.ok) throw new Error('Failed to update enquiry');
      const updated = await res.json();
      setSelectedEnquiry(null);
      fetchEnquiries();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`/api/admin/enquiries/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeleteConfirmId(null);
      if (selectedEnquiry?.id === id) setSelectedEnquiry(null);
      fetchEnquiries();
    } catch (err: any) {
      console.error(err);
    }
  };

  const exportCSV = () => {
    if (!enquiries.length) return;
    const headers = ['Enquiry ID', 'Date', 'Name', 'Company', 'Email', 'Phone', 'Country', 'Fabric', 'Quantity', 'Sample', 'Status', 'Notes'];
    const rows = enquiries.map((e) => [
      e.enquiryNumber,
      new Date(e.createdAt).toLocaleDateString(),
      `"${e.name}"`,
      `"${e.companyName}"`,
      e.businessEmail,
      e.phone,
      `"${e.country}"`,
      `"${e.fabricOrCollection || ''}"`,
      `"${e.requiredQuantity}"`,
      e.sampleRequired ? 'YES' : 'NO',
      e.status,
      `"${(e.internalNotes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SRI_Fabrics_Enquiries_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = enquiries.filter((e) => {
    const matchesSearch =
      e.enquiryNumber.toLowerCase().includes(search.toLowerCase()) ||
      e.companyName.toLowerCase().includes(search.toLowerCase()) ||
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.businessEmail.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || e.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'NEW':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'SAMPLE REQUESTED':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'QUOTATION SENT':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'CONVERTED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'CLOSED':
        return 'bg-stone-200 text-stone-700 border-stone-300';
      default:
        return 'bg-stone-100 text-stone-700 border-stone-200';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-[#4a1122]">
            B2B LEAD PIPELINE
          </span>
          <h1 className="font-serif text-3xl font-bold text-stone-900 mt-0.5">
            Enquiries & Sample Requests
          </h1>
        </div>

        <button
          onClick={exportCSV}
          className="px-4 py-2 bg-stone-900 hover:bg-black text-white text-xs font-semibold rounded flex items-center gap-2 shadow cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-[#dfb15b]" />
          <span>Export Enquiries to CSV</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-lg border border-stone-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ID, company, name, email..."
            className="w-full bg-stone-50 border border-stone-200 rounded px-3 py-2 pl-9 text-xs focus:outline-none focus:border-[#4a1122]"
          />
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 text-xs">
          <span className="text-stone-400 font-medium shrink-0">Filter Status:</span>
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1 rounded font-medium shrink-0 transition-colors ${
              statusFilter === 'ALL' ? 'bg-[#4a1122] text-white' : 'bg-stone-100 text-stone-700'
            }`}
          >
            All
          </button>
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded text-[11px] font-medium shrink-0 transition-colors ${
                statusFilter === st ? 'bg-[#4a1122] text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Enquiries Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs divide-y divide-stone-200">
            <thead className="bg-stone-50 text-stone-600 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Ref Number</th>
                <th className="py-3.5 px-4">Client / Company</th>
                <th className="py-3.5 px-4">Fabric / Yardage</th>
                <th className="py-3.5 px-4">Sample?</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-400">
                    Loading inquiries...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-400">
                    No enquiries match criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((enq) => (
                  <tr key={enq.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#4a1122]">
                      {enq.enquiryNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-stone-900">{enq.companyName}</p>
                      <p className="text-[11px] text-stone-500">{enq.name} ({enq.country})</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-medium text-stone-800">{enq.fabricOrCollection || 'Wholesale'}</p>
                      <p className="text-[11px] text-stone-500">Qty: {enq.requiredQuantity}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      {enq.sampleRequired ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">
                          Swatch Requested
                        </span>
                      ) : (
                        <span className="text-stone-400 text-[11px]">Quote Only</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${getStatusBadge(enq.status)}`}>
                        {enq.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-stone-500">
                      {new Date(enq.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => handleOpenDetail(enq)}
                        className="px-2.5 py-1 bg-stone-100 hover:bg-[#4a1122] hover:text-[#f7eedf] text-stone-700 rounded font-semibold transition-colors cursor-pointer"
                      >
                        Manage
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(enq.id)}
                        className="p-1 text-red-500 hover:text-red-700 rounded cursor-pointer"
                        title="Delete record"
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

      {/* Enquiry Detail & Status Updater Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl bg-[#faf7f2] rounded-xl shadow-2xl overflow-hidden border border-stone-300">
            <div className="bg-[#24060d] text-white px-6 py-4 flex items-center justify-between border-b border-[#dfb15b]/30">
              <div>
                <span className="text-[10px] text-[#dfb15b] font-mono tracking-widest uppercase">ENQUIRY DOSSIER</span>
                <h3 className="font-serif text-lg font-bold text-[#f7eedf]">
                  {selectedEnquiry.enquiryNumber} — {selectedEnquiry.companyName}
                </h3>
              </div>
              <button onClick={() => setSelectedEnquiry(null)} className="text-white/70 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4 bg-white p-4 rounded-lg border border-stone-200">
                <div>
                  <p className="text-stone-400">Contact Person:</p>
                  <p className="font-semibold text-stone-900 text-sm">{selectedEnquiry.name}</p>
                </div>
                <div>
                  <p className="text-stone-400">Company Name:</p>
                  <p className="font-semibold text-stone-900 text-sm">{selectedEnquiry.companyName}</p>
                </div>
                <div>
                  <p className="text-stone-400">Email Address:</p>
                  <a href={`mailto:${selectedEnquiry.businessEmail}`} className="font-semibold text-[#4a1122] hover:underline">
                    {selectedEnquiry.businessEmail}
                  </a>
                </div>
                <div>
                  <p className="text-stone-400">Phone / WhatsApp:</p>
                  <a href={`tel:${selectedEnquiry.phone}`} className="font-semibold text-stone-900">
                    {selectedEnquiry.phone}
                  </a>
                </div>
                <div>
                  <p className="text-stone-400">Country / City:</p>
                  <p className="font-semibold text-stone-900">{selectedEnquiry.country} {selectedEnquiry.city ? `(${selectedEnquiry.city})` : ''}</p>
                </div>
                <div>
                  <p className="text-stone-400">Quantity Needed:</p>
                  <p className="font-bold text-[#4a1122] text-sm">{selectedEnquiry.requiredQuantity}</p>
                </div>
              </div>

              <div>
                <p className="font-semibold text-stone-800 mb-1">Fabric Sourcing Interest:</p>
                <div className="p-3 bg-white rounded border border-stone-200 font-medium text-stone-900">
                  {selectedEnquiry.fabricOrCollection || 'General Wholesale Enquiry'}
                </div>
              </div>

              <div>
                <p className="font-semibold text-stone-800 mb-1">Client Message & Specifications:</p>
                <div className="p-3 bg-white rounded border border-stone-200 text-stone-700 whitespace-pre-line leading-relaxed">
                  {selectedEnquiry.message}
                </div>
              </div>

              {/* Status & Internal Notes Update Form */}
              <div className="bg-[#f2ece1] p-4 rounded-lg border border-[#dfb15b]/40 space-y-3">
                <h4 className="font-bold text-[#4a1122] uppercase tracking-wider text-[11px]">
                  Internal Status & Progress Notes
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-stone-800 mb-1">Update Pipeline Status</label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value)}
                      className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-900 focus:outline-none focus:border-[#4a1122]"
                    >
                      {statuses.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-800 mb-1">Assigned Account Manager</label>
                    <input
                      type="text"
                      disabled
                      value="Technical Directorate, Surat Mills"
                      className="w-full bg-stone-100 border border-stone-300 rounded px-3 py-2 text-stone-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-800 mb-1">Internal Notes & DHL Tracking Number</label>
                  <textarea
                    rows={3}
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="e.g. Swatch dispatched via DHL Express AWB #94829312. Awaiting buyer color approvals."
                    className="w-full bg-white border border-stone-300 rounded px-3 py-2 text-stone-900 focus:outline-none focus:border-[#4a1122]"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedEnquiry(null)}
                  className="px-4 py-2 text-stone-600 hover:text-stone-900 font-semibold"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleUpdateStatus}
                  disabled={saving}
                  className="px-6 py-2.5 bg-[#4a1122] hover:bg-[#60192e] text-[#f7eedf] font-semibold uppercase tracking-wider rounded shadow cursor-pointer disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Update Enquiry Dossier'}
                </button>
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
              <h3 className="font-serif text-lg font-bold text-stone-900">Delete Enquiry Record?</h3>
            </div>
            <p className="text-xs text-stone-600">
              Are you sure you want to permanently delete this customer enquiry record?
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
                <span>Delete Enquiry</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
