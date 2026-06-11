import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { getSiteSettings } from "@/lib/dal/site";
import { getNavigation } from "@/lib/dal/navigation";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();
  
  // Fetch navigation items
  const headerNav = await getNavigation('header');
  const footerNav = await getNavigation('footer');
  const legalNav = await getNavigation('legal');
  const socialNav = await getNavigation('social');

  return (
    <div className="flex-1 flex flex-col pt-20">
      <Navigation settings={settings} navItems={headerNav} />
      <div className="flex-1 flex flex-col">{children}</div>
      <Footer 
        settings={settings} 
        footerNav={footerNav} 
        legalNav={legalNav} 
        socialNav={socialNav} 
      />
    </div>
  );
}
