import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Portfolio | GAMBIT",
  description: "Strategic Moves. Measurable Outcomes.",
};

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
