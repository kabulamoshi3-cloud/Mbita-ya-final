import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Student Portal",
  description: "Access your courses, assignments, grades, and academic resources.",
};

export default function StudentPortalPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-navy-900 mb-4">Student Portal</h1>
        <p className="text-lg text-navy-600 mb-8">
          Access your courses, assignments, grades, and academic resources
        </p>

        {/* Quick Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Courses */}
          <Link
            href="/teaching"
            className="bg-white border-2 border-border rounded-xl p-6 hover:border-primary hover:shadow-lg transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-200 transition-colors">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-navy-900 mb-2 group-hover:text-primary transition-colors">
                  My Courses
                </h2>
                <p className="text-navy-600 text-sm">
                  View enrolled courses, lecture materials, and schedules
                </p>
              </div>
            </div>
          </Link>

          {/* Video Library */}
          <Link
            href="/video-library"
            className="bg-white border-2 border-border rounded-xl p-6 hover:border-primary hover:shadow-lg transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-purple-200 transition-colors">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-navy-900 mb-2 group-hover:text-primary transition-colors">
                  Video Library
                </h2>
                <p className="text-navy-600 text-sm">
                  Access lecture videos, tutorials, and recorded sessions
                </p>
              </div>
            </div>
          </Link>

          {/* Certificates */}
          <Link
            href="/certificates"
            className="bg-white border-2 border-border rounded-xl p-6 hover:border-primary hover:shadow-lg transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-green-200 transition-colors">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-navy-900 mb-2 group-hover:text-primary transition-colors">
                  My Certificates
                </h2>
                <p className="text-navy-600 text-sm">
                  View and download your earned certificates
                </p>
              </div>
            </div>
          </Link>

          {/* Achievements */}
          <Link
            href="/gamification"
            className="bg-white border-2 border-border rounded-xl p-6 hover:border-primary hover:shadow-lg transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-yellow-200 transition-colors">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-navy-900 mb-2 group-hover:text-primary transition-colors">
                  Achievements & Badges
                </h2>
                <p className="text-navy-600 text-sm">
                  Track your progress and unlock achievements
                </p>
              </div>
            </div>
          </Link>

          {/* AI Assistant */}
          <Link
            href="/ai-assistant"
            className="bg-white border-2 border-border rounded-xl p-6 hover:border-primary hover:shadow-lg transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-200 transition-colors">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-navy-900 mb-2 group-hover:text-primary transition-colors">
                  AI Assistant
                </h2>
                <p className="text-navy-600 text-sm">
                  Get instant help with your studies and questions
                </p>
              </div>
            </div>
          </Link>

          {/* Office Hours */}
          <Link
            href="/scheduling"
            className="bg-white border-2 border-border rounded-xl p-6 hover:border-primary hover:shadow-lg transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-red-200 transition-colors">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-navy-900 mb-2 group-hover:text-primary transition-colors">
                  Book Office Hours
                </h2>
                <p className="text-navy-600 text-sm">
                  Schedule appointments with your professor
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* Login Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Student Login</h3>
              <p className="text-blue-800 text-sm mb-4">
                Student login functionality is currently being developed. In the meantime, you can browse course materials
                and resources through the links above.
              </p>
              <p className="text-blue-700 text-sm">
                For enrollment inquiries, please <Link href="/contact" className="font-semibold underline hover:text-blue-900">contact us</Link>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
