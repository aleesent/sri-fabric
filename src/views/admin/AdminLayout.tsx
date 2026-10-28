import React, { useState } from 'react';
import { Logo } from '../../components/Logo.tsx';
import {
  LayoutDashboard,
  Layers,
  FolderTree,
  Sliders,
  FileQuestion,
  Mail,
  Quote,
  BookOpen,
  Factory,
  Globe2,
  Users,
  Image as ImageIcon,
  Settings,
  LogOut,
  Film,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react';

interface AdminLayoutProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onLogout: () => void;
  adminUser: { name: string; email: string };
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onTabChange,
  onLogout,
  adminUser,
  children,
}) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'enquiries', label: 'Enquiries', icon: FileQuestion },
    { id: 'fabrics', label: 'Fabrics Catalogue', icon: Layers },
    { id: 'collections', label: 'Collections', icon: FolderTree },
    { id: 'categories', label: 'Categories', icon: FolderTree },
    { id: 'hero-slides', label: 'Hero Slides', icon: Sliders },
    { id: 'shop-the-look', label: 'Shop The Look (Videos)', icon: Film },
    { id: 'contacts', label: 'Contacts', icon: Mail },
    { id: 'blog', label: 'Blog & Articles', icon: BookOpen },
    { id: 'testimonials', label: 'Testimonials', icon: Quote },
    { id: 'manufacturing', label: 'Manufacturing', icon: Factory },
    { id: 'subscribers', label: 'Subscribers', icon: Users },
    { id: 'media', label: 'Media Library', icon: ImageIcon },
    { id: 'settings', label: 'Site & SEO Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col md:flex-row text-stone-800">
      {/* Mobile Header Bar */}
      <div className="md:hidden bg-[#1c050d] text-white p-4 flex items-center justify-between border-b border-[#dfb15b]/20">
        <Logo variant="gold" showTagline={false} />
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-1 text-[#dfb15b]"
        >
          {mobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Desktop & Mobile */}
      <aside
        className={`fixed md:sticky top-0 h-screen w-64 bg-[#1e050c] text-[#f7eedf] flex flex-col justify-between z-40 transition-transform duration-300 border-r border-[#dfb15b]/20 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Logo Brand Header */}
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <Logo variant="gold" showTagline={true} />
          </div>

          {/* Nav Items */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-170px)]">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                    active
                      ? 'bg-[#4a1122] text-[#dfb15b] font-semibold border-l-3 border-[#dfb15b]'
                      : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-[#dfb15b]' : 'text-white/50'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User profile & actions */}
        <div className="p-4 border-t border-white/10 bg-[#160308] space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="truncate">
              <p className="font-semibold text-white truncate">{adminUser.name}</p>
              <p className="text-[10px] text-white/50 truncate">{adminUser.email}</p>
            </div>
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="p-1 text-[#dfb15b] hover:text-white"
              title="View Public Site"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-2 bg-red-950/60 hover:bg-red-900 text-red-200 rounded text-xs font-semibold cursor-pointer border border-red-800/40"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-h-screen overflow-x-hidden p-4 sm:p-8">
        {children}
      </main>
    </div>
  );
};
