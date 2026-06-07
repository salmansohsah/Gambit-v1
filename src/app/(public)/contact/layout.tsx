import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Discovery | GAMBIT",
  description: "Clarity Before Commitment. A structured strategic intake process.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
