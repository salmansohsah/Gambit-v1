import React from 'react';
import Link from 'next/link';
import { Typography } from '../ui/Typography';

interface NavItem {
  label: string;
  href: string;
  is_external?: boolean;
  target?: string | null;
}

interface FooterProps {
  settings?: any;
  footerNav?: NavItem[];
  legalNav?: NavItem[];
  socialNav?: NavItem[];
}

export function Footer({ settings, footerNav = [], legalNav = [], socialNav = [] }: FooterProps) {
  const fallbackFooterLinks = [
    { label: 'Home', href: '/' },
    { label: 'Services', href: '/services' },
    { label: 'About', href: '/about' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Insights', href: '/insights' },
    { label: 'Contact', href: '/contact' },
  ];

  const footerLinks = footerNav && footerNav.length > 0 ? footerNav : fallbackFooterLinks;

  return (
    <footer className="bg-surface-panel border-t border-surface-elevated py-16 mt-auto">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          
          <div className="md:col-span-1">
            <Link href="/">
              <span className="font-bold text-xl tracking-[0.2em] uppercase text-text-primary block mb-6">
                {settings?.company_name || 'GAMBIT'}
              </span>
            </Link>
            <Typography variant="body-sm">
              {settings?.footer_text || 'Strategic Digital Agency.\nCreate positions. Defend advantages. Scale intelligently.'}
            </Typography>
          </div>

          <div className="md:col-span-1">
            <Typography variant="label" className="mb-6 block text-text-secondary uppercase">Navigation</Typography>
            <ul className="space-y-4">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm font-medium text-text-muted hover:text-accent-gold transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-1">
            <Typography variant="label" className="mb-6 block text-text-secondary uppercase">Contact</Typography>
            <ul className="space-y-4">
              {settings?.contact_email && (
                <li>
                  <Link href={`mailto:${settings.contact_email}`} className="text-sm font-medium text-text-muted hover:text-accent-gold transition-colors break-all">
                    {settings.contact_email}
                  </Link>
                </li>
              )}
              <li>
                <span className="text-sm font-medium text-text-muted opacity-50 cursor-not-allowed">HQ Location (Coming Soon)</span>
              </li>
            </ul>
          </div>

          <div className="md:col-span-1">
            <Typography variant="label" className="mb-6 block text-text-secondary uppercase">Social</Typography>
            <ul className="space-y-4">
              {socialNav && socialNav.length > 0 ? (
                socialNav.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} target={link.target || "_blank"} rel="noopener noreferrer" className="text-sm font-medium text-text-muted hover:text-accent-gold transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))
              ) : (
                <>
                  {settings?.linkedin_url ? (
                    <li>
                      <Link href={settings.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-text-muted hover:text-accent-gold transition-colors">
                        LinkedIn
                      </Link>
                    </li>
                  ) : (
                    <li>
                      <span className="text-sm font-medium text-text-muted opacity-50 cursor-not-allowed">LinkedIn (Coming Soon)</span>
                    </li>
                  )}
                  
                  {settings?.twitter_url ? (
                    <li>
                      <Link href={settings.twitter_url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-text-muted hover:text-accent-gold transition-colors">
                        Twitter
                      </Link>
                    </li>
                  ) : (
                    <li>
                      <span className="text-sm font-medium text-text-muted opacity-50 cursor-not-allowed">Twitter (Coming Soon)</span>
                    </li>
                  )}
                </>
              )}
            </ul>
          </div>

        </div>

        <div className="mt-16 pt-8 border-t border-surface-elevated flex flex-col md:flex-row justify-between items-center gap-4">
          <Typography variant="body" className="text-xs text-text-muted">
            &copy; {new Date().getFullYear()} {settings?.company_name || 'GAMBIT'}. All rights reserved.
          </Typography>
          <div className="flex gap-6">
            {legalNav && legalNav.length > 0 ? (
              legalNav.map((link) => (
                <Link key={link.label} href={link.href} target={link.target || "_self"} className="text-xs text-text-muted hover:text-accent-gold transition-colors">
                  {link.label}
                </Link>
              ))
            ) : (
              <>
                <span className="text-xs text-text-muted opacity-50 cursor-not-allowed">Privacy Policy (Coming Soon)</span>
                <span className="text-xs text-text-muted opacity-50 cursor-not-allowed">Terms of Service (Coming Soon)</span>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
