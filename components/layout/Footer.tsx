"use client";

import Link from "next/link";
import ProfessorAvatar from "@/components/ui/ProfessorAvatar";

interface FooterProfile {
  fullName: string;
  title: string;
  email: string;
  photoUrl?: string | null;
  institution?: string;
  academicProfiles?: Array<{ label: string; url: string }>;
}

interface FooterProps {
  profile?: FooterProfile | null;
}

const quickLinks = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/about", label: "About", icon: "👤" },
  { href: "/research", label: "Research", icon: "🔬" },
  { href: "/publications", label: "Publications", icon: "📚" },
  { href: "/teaching", label: "Teaching", icon: "🎓" },
  { href: "/contact", label: "Contact", icon: "📧" },
];

const resources = [
  { href: "/blog", label: "Blog" },
  { href: "/events", label: "Events" },
  { href: "/gallery", label: "Gallery" },
  { href: "/cv", label: "CV" },
  { href: "/students", label: "Students" },
  { href: "/collaborations", label: "Collaborations" },
];

export default function Footer({ profile }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 text-white mt-auto border-t border-navy-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Column 1: Professor Info */}
          <div className="lg:col-span-1">
            <div className="flex items-start gap-3 mb-4">
              <ProfessorAvatar
                photoUrl={profile?.photoUrl}
                alt={profile?.fullName ?? "Professor"}
                width={56}
                height={56}
                className="flex-shrink-0 ring-2 ring-white/20 rounded-full"
              />
              <div>
                <h3 className="font-bold text-lg text-white mb-1">
                  {profile?.fullName ?? "Professor"}
                </h3>
                <p className="text-sm text-navy-200">
                  {profile?.title ?? "Academic Title"}
                </p>
                {profile?.institution && (
                  <p className="text-xs text-navy-300 mt-1">
                    {profile.institution}
                  </p>
                )}
              </div>
            </div>
            
            {profile?.email && (
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center gap-2 text-sm text-navy-200 hover:text-white transition-colors group"
              >
                <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {profile.email}
              </a>
            )}

            {/* Social/Academic Links */}
            {profile?.academicProfiles && profile.academicProfiles.length > 0 && (
              <div className="mt-4">
                <p className="text-xs font-semibold text-navy-300 uppercase tracking-wide mb-2">
                  Academic Profiles
                </p>
                <div className="flex flex-wrap gap-2">
                  {profile.academicProfiles.slice(0, 5).map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs px-2 py-1 bg-navy-800 hover:bg-navy-700 rounded-md transition-colors hover:scale-105 transform"
                      title={link.label}
                    >
                      {link.label.split(' ')[0]}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-bold text-base mb-4 text-white flex items-center gap-2">
              <span className="w-1 h-5 bg-primary rounded-full"></span>
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-navy-200 hover:text-white hover:translate-x-1 transition-all inline-flex items-center gap-2 group"
                  >
                    <span className="text-base group-hover:scale-110 transition-transform">{link.icon}</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div>
            <h3 className="font-bold text-base mb-4 text-white flex items-center gap-2">
              <span className="w-1 h-5 bg-primary rounded-full"></span>
              Resources
            </h3>
            <ul className="space-y-2.5">
              {resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-navy-200 hover:text-white hover:translate-x-1 transition-all inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter & Info */}
          <div>
            <h3 className="font-bold text-base mb-4 text-white flex items-center gap-2">
              <span className="w-1 h-5 bg-primary rounded-full"></span>
              Stay Connected
            </h3>
            <p className="text-sm text-navy-200 mb-4">
              Get updates on new publications, research, and academic activities.
            </p>
            
            {/* Quick Contact Button */}
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-lg transition-all hover:scale-105 transform shadow-lg hover:shadow-xl text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Get in Touch
            </Link>

            {/* Accessibility Info */}
            <div className="mt-4 pt-4 border-t border-navy-700">
              <Link
                href="/accessibility"
                className="text-xs text-navy-300 hover:text-white transition-colors inline-flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Accessibility Statement
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-navy-700 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-navy-300 text-center md:text-left">
              © {currentYear} {profile?.fullName ?? "Professor"}. All rights reserved.
            </p>
            
            <div className="flex items-center gap-6">
              <Link
                href="/accessibility"
                className="text-xs text-navy-300 hover:text-white transition-colors"
              >
                Accessibility
              </Link>
              <span className="text-navy-700">•</span>
              <a
                href="#"
                className="text-xs text-navy-300 hover:text-white transition-colors"
              >
                Privacy Policy
              </a>
              <span className="text-navy-700">•</span>
              <a
                href="#"
                className="text-xs text-navy-300 hover:text-white transition-colors"
              >
                Terms of Use
              </a>
            </div>

            {/* Scroll to Top Button */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-xs text-navy-300 hover:text-white transition-colors inline-flex items-center gap-1 hover:scale-105 transform"
              aria-label="Scroll to top"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              Back to Top
            </button>
          </div>
        </div>
      </div>

      {/* Decorative Bottom Accent */}
      <div className="h-1 bg-gradient-to-r from-primary via-blue-500 to-primary"></div>
    </footer>
  );
}
