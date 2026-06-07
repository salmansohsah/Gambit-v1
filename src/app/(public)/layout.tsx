import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { getSiteSettings } from "@/lib/dal/site";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  return (
    <div className="flex-1 flex flex-col pt-20">
      <Navigation settings={settings} />
      <div className="flex-1 flex flex-col">{children}</div>
      <Footer settings={settings} />
    </div>
  );
}
