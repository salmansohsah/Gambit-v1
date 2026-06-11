"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '../ui/Button';

interface NavigationProps {
  settings?: any;
  navItems?: { label: string; href: string; is_external?: boolean; target?: string | null }[];
}

export function Navigation({ settings, navItems = [] }: NavigationProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const fallbackLinks = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'About', href: '/about' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Insights', href: '/insights' },
    { label: 'Contact', href: '/contact' },
  ];

  const links = navItems && navItems.length > 0 ? navItems : fallbackLinks;

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
        scrolled || mobileMenuOpen
          ? 'bg-surface-panel/95 backdrop-blur-sm border-b border-surface-elevated shadow-[0_4px_24px_rgba(0,0,0,0.02)]' 
          : 'bg-surface-panel/40 backdrop-blur-sm border-b border-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 h-20 flex items-center justify-between">
          
          {/* Left: Minimalist Text Logo */}
          <div className="flex-1 flex items-center justify-start">
            <Link href="/" onClick={() => setMobileMenuOpen(false)}>
              <span className="font-bold text-xl tracking-[0.2em] uppercase text-text-primary">
                {settings?.company_name || 'GAMBIT'}
              </span>
            </Link>
          </div>

          {/* Center: Primary Navigation Links */}
          <div className="flex-none hidden md:flex items-center justify-center gap-8 lg:gap-12">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link 
                  key={link.label} 
                  href={link.href}
                  className={`text-sm font-medium tracking-wide transition-colors duration-300 hover:text-[#111111] ${isActive ? 'text-accent-gold' : 'text-text-muted'}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
          
          {/* Right: Primary CTA & Mobile Toggle */}
          <div className="flex-1 flex items-center justify-end">
            <Button 
              variant="outline" 
              className="hidden md:inline-flex py-2 px-5 text-xs"
              onClick={() => router.push('/contact')}
            >
              Start The Conversation
            </Button>
            
            {/* Mobile Menu Icon */}
            <button 
              className="md:hidden p-2 text-text-primary ml-auto relative z-[60]"
              onClick={toggleMobileMenu}
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {mobileMenuOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </>
                ) : (
                  <>
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                  </>
                )}
              </svg>
            </button>
          </div>
          
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div 
        className={`fixed inset-0 z-40 bg-surface-panel transform transition-transform duration-500 ease-in-out md:hidden flex flex-col pt-24 px-6 pb-6 ${
          mobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="flex-1 flex flex-col items-center justify-center gap-8">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.label} 
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-2xl font-bold tracking-wide transition-colors duration-300 ${isActive ? 'text-accent-gold' : 'text-text-primary'}`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
        
        <div className="w-full pt-8 border-t border-surface-elevated mt-auto">
          <Button 
            variant="outline" 
            className="w-full py-4 text-sm"
            onClick={() => {
              setMobileMenuOpen(false);
              router.push('/contact');
            }}
          >
            Start The Conversation
          </Button>
        </div>
      </div>
    </>
  );
}
