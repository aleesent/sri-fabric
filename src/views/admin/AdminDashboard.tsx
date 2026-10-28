import React, { useState, useEffect } from 'react';
import {
  Layers,
  FolderTree,
  FileQuestion,
  Mail,
  BookOpen,
  Users,
  Quote,
  TrendingUp,
  ArrowRight,
  Clock,
  Sparkles,
  AlertCircle,
} from 'lucide-react';

interface AdminDashboardProps {
  token: string;
  onNavigateTab: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ token, onNavigateTab }) => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-8 h-8 border-2 border-[#dfb15b] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-stone-500 mt-2">Loading administrative statistics...</p>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Enquiries', value: stats?.totalEnquiries || 0, icon: FileQuestion, color: 'text-purple-700 bg-purple-50', link: 'enquiries' },
    { label: 'New / Unhandled', value: stats?.newEnquiries || 0, icon: AlertCircle, color: 'text-amber-700 bg-amber-50', link: 'enquiries' },
    { label: 'Active Fabrics', value: stats?.totalFabrics || 0, icon: Layers, color: 'text-blue-700 bg-blue-50', link: 'fabrics' },
    { label: 'Collections', value: stats?.totalCollections || 0, icon: FolderTree, color: 'text-emerald-700 bg-emerald-50', link: 'collections' },
    { label: 'Contact Messages', value: stats?.totalContacts || 0, icon: Mail, color: 'text-rose-700 bg-rose-50', link: 'contacts' },
    { label: 'Blog Posts', value: stats?.totalBlogPosts || 0, icon: BookOpen, color: 'text-indigo-700 bg-indigo-50', link: 'blog' },
    { label: 'Newsletter Subscribers', value: stats?.totalSubscribers || 0, icon: Users, color: 'text-teal-700 bg-teal-50', link: 'subscribers' },
    { label: 'Testimonials', value: stats?.totalTestimonials || 0, icon: Quote, color: 'text-orange-700 bg-orange-50', link: 'testimonials' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <span className="text-xs uppercase font-bold tracking-wider text-[#4a1122]">
            ADMINISTRATIVE DASHBOARD
          </span>
          <h1 className="font-serif text-3xl font-bold text-stone-900 mt-0.5">
            SRI Fabrics Overview
          </h1>
        </div>

        {/* Quick action shortcuts */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateTab('fabrics')}
            className="px-4 py-2 bg-[#4a1122] hover:bg-[#5e162b] text-[#f7eedf] text-xs font-semibold rounded shadow transition-colors cursor-pointer"
          >
            + Add New Fabric
          </button>
          <button
            onClick={() => onNavigateTab('enquiries')}
            className="px-4 py-2 bg-[#dfb15b] hover:bg-[#edd08f] text-[#24060d] text-xs font-bold rounded shadow transition-colors cursor-pointer"
          >
            View Enquiries
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              onClick={() => onNavigateTab(card.link)}
              className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-medium text-stone-500">{card.label}</p>
                <p className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
                  {card.value}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Split Section: Recent Enquiries + Recent Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Enquiries (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-stone-200 shadow-2xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2">
              <FileQuestion className="w-5 h-5 text-[#4a1122]" />
              <h3 className="font-serif text-lg font-bold text-stone-900">Recent B2B Enquiries</h3>
            </div>
            <button
              onClick={() => onNavigateTab('enquiries')}
              className="text-xs font-semibold text-[#4a1122] hover:underline"
            >
              View All →
            </button>
          </div>

          {!stats?.recentEnquiries?.length ? (
            <p className="text-xs text-stone-400 py-6 text-center">No inquiries logged yet.</p>
          ) : (
            <div className="divide-y divide-stone-100 text-xs">
              {stats.recentEnquiries.map((enq: any) => (
                <div key={enq.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="space-y-0.5 truncate">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#4a1122]">{enq.enquiryNumber}</span>
                      <span className="font-semibold text-stone-900">{enq.companyName}</span>
                    </div>
                    <p className="text-stone-500 truncate">
                      {enq.fabricOrCollection || 'General Wholesale'} • {enq.requiredQuantity}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      {enq.status}
                    </span>
                    <button
                      onClick={() => onNavigateTab('enquiries')}
                      className="p-1 hover:text-[#4a1122]"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Contacts (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-stone-200 shadow-2xs p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-[#4a1122]" />
              <h3 className="font-serif text-lg font-bold text-stone-900">Recent Contacts</h3>
            </div>
            <button
              onClick={() => onNavigateTab('contacts')}
              className="text-xs font-semibold text-[#4a1122] hover:underline"
            >
              View All →
            </button>
          </div>

          {!stats?.recentContacts?.length ? (
            <p className="text-xs text-stone-400 py-6 text-center">No messages submitted yet.</p>
          ) : (
            <div className="divide-y divide-stone-100 text-xs">
              {stats.recentContacts.map((cnt: any) => (
                <div key={cnt.id} className="py-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-stone-900">{cnt.name}</span>
                    <span className="text-[10px] text-stone-400">{new Date(cnt.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-stone-600 font-medium truncate">{cnt.subject}</p>
                  <p className="text-stone-400 text-[11px] truncate">{cnt.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
