import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Student Resources",
  description: "Access student portal, courses, assignments, grades, and academic resources.",
};

export default function StudentResourcesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-navy-900 mb-4">Student Resources</h1>
        <p className="text-lg text-navy-600 mb-8">
          Access the student portal, course materials, and academic resources
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
                  Course Listings
                </h2>
                <p className="text-navy-600 text-sm">
                  Browse available courses and lecture materials
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
                  Access lecture videos and tutorials
                </p>
              </div>
            </div>
          </Link>

          {/* Blog & Articles */}
          <Link
            href="/blog"
            className="bg-white border-2 border-border rounded-xl p-6 hover:border-primary hover:shadow-lg transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-green-200 transition-colors">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-navy-900 mb-2 group-hover:text-primary transition-colors">
                  Blog & Articles
                </h2>
                <p className="text-navy-600 text-sm">
                  Read latest articles and updates
                </p>
              </div>
            </div>
          </Link>

          {/* Research Publications */}
          <Link
            href="/publications"
            className="bg-white border-2 border-border rounded-xl p-6 hover:border-primary hover:shadow-lg transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-yellow-200 transition-colors">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-navy-900 mb-2 group-hover:text-primary transition-colors">
                  Research Publications
                </h2>
                <p className="text-navy-600 text-sm">
                  Explore research papers and publications
                </p>
              </div>
            </div>
          </Link>

          {/* Events */}
          <Link
            href="/events"
            className="bg-white border-2 border-border rounded-xl p-6 hover:border-primary hover:shadow-lg transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-200 transition-colors">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-navy-900 mb-2 group-hover:text-primary transition-colors">
                  Upcoming Events
                </h2>
                <p className="text-navy-600 text-sm">
                  View academic events and schedules
                </p>
              </div>
            </div>
          </Link>

          {/* Contact */}
          <Link
            href="/contact"
            className="bg-white border-2 border-border rounded-xl p-6 hover:border-primary hover:shadow-lg transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-red-200 transition-colors">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-navy-900 mb-2 group-hover:text-primary transition-colors">
                  Contact
                </h2>
                <p className="text-navy-600 text-sm">
                  Get in touch for inquiries
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Student Portal Access</h3>
              <p className="text-blue-800 text-sm mb-4">
                To access the full student portal with personalized content, assignments, grades, and exclusive resources, you need to log in with your student account.
              </p>
              <div className="flex gap-3">
                <Link 
                  href="/student-login"
                  className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium text-sm"
                >
                  Login to Portal
                </Link>
                <Link 
                  href="/student-register"
                  className="inline-flex items-center px-4 py-2 bg-white text-primary border-2 border-primary rounded-lg hover:bg-primary-light transition-colors font-medium text-sm"
                >
                  Register Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
