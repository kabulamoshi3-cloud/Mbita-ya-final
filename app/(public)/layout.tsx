import { prisma } from "@/lib/prisma";
import dynamic from "next/dynamic";
import DynamicNavbar from "@/components/layout/DynamicNavbar";
import Footer from "@/components/layout/Footer";
import { getPhotoForSlot } from "@/lib/profilePhotos";

export const fetchCache = "force-no-store";

// Lazy-load the chatbot — it's not needed for initial render
const AIChatbot = dynamic(() => import("@/components/sections/AIChatbot"), {
  ssr: false,
});

async function getProfile() {
  try {
    return await prisma.profile.findFirst({
      select: {
        fullName: true,
        title: true,
        email: true,
        photoUrl: true,
        navbarPhotoUrl: true,
        footerPhotoUrl: true,
        cvUrl: true,
        institution: true,
        academicProfiles: true,
      },
    });
  } catch {
    return null;
  }
}

async function getNavigationMenu() {
  try {
    // Get all visible menu items with their children
    const menuItems = await prisma.navigationMenu.findMany({
      where: {
        isVisible: true,
        parentId: null, // Only top-level items
      },
      include: {
        children: {
          where: { isVisible: true },
          orderBy: { order: "asc" },
        },
      },
      orderBy: { order: "asc" },
    });
    return menuItems;
  } catch (error) {
    console.error("Error fetching navigation menu:", error);
    return [];
  }
}

async function getSiteSettings() {
  try {
    return await prisma.siteSettings.findFirst({
      select: { hiddenSections: true, maintenanceMode: true },
    });
  } catch {
    return null;
  }
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [profile, menuItems, settings] = await Promise.all([
    getProfile(),
    getNavigationMenu(),
    getSiteSettings(),
  ]);

  // Use slot-specific photos with fallback to main photoUrl
  const navbarPhoto = getPhotoForSlot(profile, "navbar");
  const footerPhoto = getPhotoForSlot(profile, "footer");

  const navbarProfile = profile
    ? { fullName: profile.fullName, title: profile.title, photoUrl: navbarPhoto || null }
    : null;

  const footerProfile = profile
    ? { 
        fullName: profile.fullName, 
        title: profile.title, 
        email: profile.email, 
        photoUrl: footerPhoto || null,
        institution: profile.institution || undefined,
        academicProfiles: profile.academicProfiles as Array<{ label: string; url: string }> || undefined
      }
    : null;

  return (
    <>
      <a href="#main-content" className="skip-to-content">
        Skip to main content
      </a>

      <DynamicNavbar profile={navbarProfile} menuItems={menuItems} />

      <main id="main-content" className="flex-1 dark:bg-slate-900">
        {children}
      </main>

      <Footer profile={footerProfile} />

      <AIChatbot />
    </>
  );
}
