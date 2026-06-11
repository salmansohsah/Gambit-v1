"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Users, 
  PenTool, 
  FolderOpen, 
  Zap, 
  LayoutTemplate, 
  Image as ImageIcon, 
  UserCheck, 
  Settings,
  LogOut,
  Trash2
} from 'lucide-react';
import { Typography } from '@/components/ui/Typography';
import { createClient } from '@/lib/supabase/client';

const MENU_GROUPS = [
  {
    title: 'Operations',
    items: [
      { label: 'Dashboard', icon: Home, href: '/admin/dashboard' },
      { label: 'Leads', icon: Users, href: '/admin/leads', badge: 0 },
    ]
  },
  {
    title: 'Content Strategy',
    items: [
      { label: 'Insights', icon: PenTool, href: '/admin/insights' },
      { label: 'Portfolio', icon: FolderOpen, href: '/admin/portfolio' },
      { label: 'Capabilities', icon: Zap, href: '/admin/capabilities' },
    ]
  },
  {
    title: 'Platform',
    items: [
      { label: 'Page Content', icon: LayoutTemplate, href: '/admin/page-content' },
      { label: 'Media Library', icon: ImageIcon, href: '/admin/media' },
      { label: 'Team', icon: UserCheck, href: '/admin/team' },
      { label: 'Site Settings', icon: Settings, href: '/admin/settings' },
      { label: 'Trash', icon: Trash2, href: '/admin/trash' },
    ]
  }
];

export function Sidebar() {
  const pathname = usePathname();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/admin/login';
  };

  return (
    <aside className="w-64 h-screen bg-surface-base border-r border-surface-elevated flex flex-col fixed left-0 top-0 overflow-y-auto z-50">
      <div className="p-6 border-b border-surface-elevated">
        <Typography variant="h4" className="tracking-widest uppercase">GAMBIT <span className="text-accent-gold">OS</span></Typography>
      </div>
      
      <div className="flex-1 py-6 px-4 space-y-8">
        {MENU_GROUPS.map((group, i) => (
          <div key={i}>
            <Typography variant="label" className="text-text-secondary uppercase tracking-widest px-2 mb-4 block">
              {group.title}
            </Typography>
            <nav className="space-y-1">
              {group.items.map((item, j) => {
                const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
                const Icon = item.icon;
                return (
                  <Link 
                    key={j} 
                    href={item.href}
                    className={`flex items-center justify-between px-2 py-2 rounded-md transition-colors group ${
                      isActive 
                        ? 'bg-surface-panel text-accent-gold border-l-2 border-accent-gold' 
                        : 'text-text-primary hover:bg-surface-elevated border-l-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-accent-gold' : 'text-text-muted group-hover:text-text-primary transition-colors'}`} />
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="bg-accent-gold text-obsidian text-xs font-bold px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-surface-elevated">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-2 py-2 w-full text-left text-text-muted hover:text-text-primary hover:bg-surface-elevated rounded-md transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">Log Out</span>
        </button>
      </div>
    </aside>
  );
}
