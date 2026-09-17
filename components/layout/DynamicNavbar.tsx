"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ProfessorAvatar from "@/components/ui/ProfessorAvatar";
import ThemeToggle from "@/components/ui/ThemeToggle";
import Navbar from "./Navbar";

interface NavbarProfile {
  fullName: string;
  title: string;
  photoUrl?: string | null;
}

interface MenuItem {
  id: string;
  label: string;
  href: string | null;
  icon: string | null;
  description: string | null;
  order: number;
  isVisible: boolean;
  openInNewTab: boolean;
  requiresAuth: boolean;
  badge: string | null;
  badgeColor: string | null;
  isMegaMenu: boolean;
  columns: number | null;
  children?: MenuItem[];
}

interface DynamicNavbarProps {
  profile?: NavbarProfile | null;
  menuItems: MenuItem[];
}

// ── DROPDOWN COMPONENT ─────────────────────────────────────────────────────
interface DropdownProps {
  label: string;
  icon: string | null;
  items: MenuItem[];
  isGroupActive: boolean;
  onClose: () => void;
}

function DropdownMenu({ label, icon, items, isGroupActive, onClose }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  if (items.length === 0) return null;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        aria-expanded={open}
        aria-haspopup="true"
        className={[
          "flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
          isGroupActive
            ? "bg-primary-light dark:bg-navy-800 text-primary dark:text-navy-100 font-semibold"
            : "text-navy-700 dark:text-gray-200 hover:bg-navy-50 dark:hover:bg-navy-800 hover:text-navy-900 dark:hover:text-white",
        ].join(" ")}
      >
        {icon && (
          <span aria-hidden="true" className="text-base">
            {icon}
          </span>
        )}
        {label}
        <svg
          className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-72 bg-white dark:bg-navy-800 border border-border dark:border-navy-700 rounded-xl shadow-lg z-50 overflow-hidden">
          <div className="py-1 max-h-[70vh] overflow-y-auto">
            {items.map((item) => {
              const active = item.href && (pathname === item.href || pathname.startsWith(item.href + "/"));
              return (
                <Link
                  key={item.id}
                  href={item.href || "#"}
                  target={item.openInNewTab ? "_blank" : undefined}
                  rel={item.openInNewTab ? "noopener noreferrer" : undefined}
                  onClick={() => {
                    setOpen(false);
                    onClose();
                  }}
                  className={[
                    "flex items-start gap-3 px-4 py-3 hover:bg-navy-50 dark:hover:bg-navy-700 transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    active ? "bg-primary-light dark:bg-navy-700" : "",
                  ].join(" ")}
                >
                  {item.icon && (
                    <span className="text-lg mt-0.5 flex-shrink-0" aria-hidden="true">
                      {item.icon}
                    </span>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p
                        className={`text-sm font-medium truncate ${
                          active ? "text-primary dark:text-navy-100" : "text-navy-900 dark:text-gray-100"
                        }`}
                      >
                        {item.label}
                      </p>
                      {item.badge && (
                        <span
                          className={`px-1.5 py-0.5 text-xs font-semibold rounded ${
                            item.badgeColor === "red"
                              ? "bg-red-100 text-red-700"
                              : item.badgeColor === "green"
                              ? "bg-green-100 text-green-700"
                              : item.badgeColor === "blue"
                              ? "bg-blue-100 text-blue-700"
                              : item.badgeColor === "yellow"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                      {item.openInNewTab && (
                        <svg
                          className="w-3 h-3 text-navy-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                      )}
                    </div>
                    {item.description && (
                      <p className="text-xs text-navy-400 dark:text-navy-300 mt-0.5 line-clamp-2">
                        {item.description}
                      </p>
                    )}
                  </div>
                  {active && (
                    <span
                      className="ml-auto w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0"
                      aria-hidden="true"
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ── MAIN NAVBAR ────────────────────────────────────────────────────────────
export default function DynamicNavbar({ profile, menuItems }: DynamicNavbarProps) {
  // Fallback to hardcoded navbar if no menu items from database
  if (menuItems.length === 0) {
    return <Navbar profile={profile} hiddenSections={[]} />;
  }

  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openMobileGroup, setOpenMobileGroup] = useState<string | null>(null);

  const isActive = (href: string | null) => {
    if (!href) return false;
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  const isGroupActive = (items: MenuItem[]) =>
    items.some((item) => item.href && isActive(item.href));

  // Separate top-level items and groups
  const topLevelItems = menuItems.filter((item) => item.isVisible && !item.children?.length);
  const groupItems = menuItems.filter((item) => item.isVisible && item.children && item.children.length > 0);

  return (
    <nav
      aria-label="Main navigation"
      className="bg-white dark:bg-navy-900 border-b border-border dark:border-navy-800 shadow-sm sticky top-0 z-40"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* ── BRAND ── */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="relative group">
              <button
                onClick={() => (window.location.href = "/login")}
                className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-full"
                aria-label="Admin access"
                title="Admin Panel"
              >
                <ProfessorAvatar
                  photoUrl={profile?.photoUrl}
                  alt={profile?.fullName ?? "Professor"}
                  width={40}
                  height={40}
                  className="flex-shrink-0 cursor-pointer hover:ring-2 hover:ring-primary/50 rounded-full transition-all"
                />
              </button>
            </div>
            <Link
              href="/"
              className="text-navy-900 dark:text-gray-100 font-semibold text-base hover:text-primary dark:hover:text-navy-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded leading-tight"
            >
              <span className="block">{profile?.fullName ?? "Professor"}</span>
              {profile?.title && (
                <span className="block text-xs font-normal text-navy-500 dark:text-navy-300 truncate max-w-[180px]">
                  {profile.title}
                </span>
              )}
            </Link>

            {/* Hamburger on mobile */}
            <div className="lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen((p) => !p)}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                className="p-2 rounded-md text-navy-700 dark:text-gray-200 hover:bg-navy-100 dark:hover:bg-navy-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {mobileMenuOpen ? (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* ── DESKTOP NAV ── */}
          <div className="hidden lg:flex items-center gap-0.5">
            {/* Top-level links (no children) */}
            {topLevelItems.map((item) => (
              <Link
                key={item.id}
                href={item.href || "#"}
                target={item.openInNewTab ? "_blank" : undefined}
                rel={item.openInNewTab ? "noopener noreferrer" : undefined}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={[
                  "flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  isActive(item.href)
                    ? "bg-primary-light dark:bg-navy-800 text-primary dark:text-navy-100 font-semibold"
                    : "text-navy-700 dark:text-gray-200 hover:bg-navy-50 dark:hover:bg-navy-800 hover:text-navy-900 dark:hover:text-white",
                ].join(" ")}
              >
                {item.icon && <span aria-hidden="true">{item.icon}</span>}
                {item.label}
                {item.badge && (
                  <span
                    className={`ml-1 px-1.5 py-0.5 text-xs font-semibold rounded ${
                      item.badgeColor === "red"
                        ? "bg-red-100 text-red-700"
                        : item.badgeColor === "green"
                        ? "bg-green-100 text-green-700"
                        : item.badgeColor === "blue"
                        ? "bg-blue-100 text-blue-700"
                        : item.badgeColor === "yellow"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}

            {/* Dropdown groups (with children) */}
            {groupItems.map((group) => (
              <DropdownMenu
                key={group.id}
                label={group.label}
                icon={group.icon}
                items={group.children || []}
                isGroupActive={isGroupActive(group.children || [])}
                onClose={() => setMobileMenuOpen(false)}
              />
            ))}

            {/* Divider */}
            <div className="w-px h-5 bg-border dark:bg-navy-700 mx-1" aria-hidden="true" />

            {/* Theme */}
            <ThemeToggle />
          </div>

          {/* ── MOBILE EXTRAS ── */}
          <div className="lg:hidden flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* ── MOBILE MENU ── */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu"
          className="lg:hidden border-t border-border dark:border-navy-800 bg-white dark:bg-navy-900"
        >
          <div className="px-4 py-3 space-y-1 max-h-[calc(100vh-4rem)] overflow-y-auto">
            {/* Top-level links */}
            {topLevelItems.map((item) => (
              <Link
                key={item.id}
                href={item.href || "#"}
                target={item.openInNewTab ? "_blank" : undefined}
                rel={item.openInNewTab ? "noopener noreferrer" : undefined}
                onClick={() => setMobileMenuOpen(false)}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={[
                  "flex items-center gap-2 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                  isActive(item.href)
                    ? "bg-primary-light dark:bg-navy-800 text-primary dark:text-navy-100 font-semibold"
                    : "text-navy-700 dark:text-gray-200 hover:bg-navy-50 dark:hover:bg-navy-800",
                ].join(" ")}
              >
                {item.icon && <span aria-hidden="true">{item.icon}</span>}
                {item.label}
                {item.badge && (
                  <span
                    className={`ml-auto px-1.5 py-0.5 text-xs font-semibold rounded ${
                      item.badgeColor === "red"
                        ? "bg-red-100 text-red-700"
                        : item.badgeColor === "green"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}

            {/* Dropdown groups as accordions */}
            {groupItems.map((group) => {
              const groupActive = isGroupActive(group.children || []);
              const isOpen = openMobileGroup === group.id;

              return (
                <div key={group.id}>
                  <button
                    onClick={() => setOpenMobileGroup(isOpen ? null : group.id)}
                    aria-expanded={isOpen}
                    className={[
                      "w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                      groupActive
                        ? "text-primary dark:text-navy-200"
                        : "text-navy-700 dark:text-gray-200 hover:bg-navy-50 dark:hover:bg-navy-800",
                    ].join(" ")}
                  >
                    <span className="flex items-center gap-2">
                      {group.icon && <span aria-hidden="true">{group.icon}</span>}
                      {group.label}
                    </span>
                    <svg
                      className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {isOpen && (
                    <div className="ml-4 mt-1 space-y-1 border-l-2 border-primary-light dark:border-navy-700 pl-3">
                      {(group.children || []).map((item) => (
                        <Link
                          key={item.id}
                          href={item.href || "#"}
                          target={item.openInNewTab ? "_blank" : undefined}
                          rel={item.openInNewTab ? "noopener noreferrer" : undefined}
                          onClick={() => {
                            setMobileMenuOpen(false);
                            setOpenMobileGroup(null);
                          }}
                          className={[
                            "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
                            isActive(item.href)
                              ? "bg-primary-light dark:bg-navy-800 text-primary dark:text-navy-100 font-semibold"
                              : "text-navy-600 dark:text-gray-300 hover:bg-navy-50 dark:hover:bg-navy-800 hover:text-navy-900 dark:hover:text-white",
                          ].join(" ")}
                        >
                          {item.icon && <span aria-hidden="true">{item.icon}</span>}
                          <span className="flex-1">{item.label}</span>
                          {item.badge && (
                            <span
                              className={`px-1.5 py-0.5 text-xs font-semibold rounded ${
                                item.badgeColor === "red"
                                  ? "bg-red-100 text-red-700"
                                  : item.badgeColor === "green"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}
