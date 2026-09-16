import { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import SlideGrid from "@/components/SlideGrid";
import SlideCard from "@/components/SlideCard";

export const metadata: Metadata = {
  title: "More",
  description: "Explore additional features, tools, and resources",
};

const features = [
  {
    title: "Blog",
    description: "Read latest articles, insights, and research updates",
    icon: "📝",
    href: "/blog",
    color: "from-blue-50 to-blue-100",
    border: "border-blue-200",
  },
  {
    title: "Newsletter",
    description: "Subscribe to receive updates and announcements",
    icon: "📧",
    href: "/newsletter",
    color: "from-green-50 to-green-100",
    border: "border-green-200",
  },
  {
    title: "Collaborations",
    description: "Explore collaboration opportunities and partnerships",
    icon: "🤝",
    href: "/collaborations",
    color: "from-purple-50 to-purple-100",
    border: "border-purple-200",
  },
  {
    title: "Alumni Network",
    description: "Connect with alumni and track their achievements",
    icon: "🎓",
    href: "/alumni",
    color: "from-orange-50 to-orange-100",
    border: "border-orange-200",
  },
  {
    title: "Certificates",
    description: "Verify academic certificates and credentials",
    icon: "📜",
    href: "/certificates",
    color: "from-pink-50 to-pink-100",
    border: "border-pink-200",
  },
  {
    title: "Video Library",
    description: "Watch lectures, presentations, and tutorials",
    icon: "🎬",
    href: "/video-library",
    color: "from-red-50 to-red-100",
    border: "border-red-200",
  },
  {
    title: "Student Resources",
    description: "Access study materials and academic resources",
    icon: "📚",
    href: "/student-resources",
    color: "from-indigo-50 to-indigo-100",
    border: "border-indigo-200",
  },
  {
    title: "Research Network",
    description: "Join our research network and collaborations",
    icon: "🔬",
    href: "/research-network",
    color: "from-teal-50 to-teal-100",
    border: "border-teal-200",
  },
  {
    title: "Virtual Lab",
    description: "Access virtual laboratory and simulations",
    icon: "🧪",
    href: "/virtual-lab",
    color: "from-cyan-50 to-cyan-100",
    border: "border-cyan-200",
  },
  {
    title: "AI Assistant",
    description: "Get help from our AI-powered academic assistant",
    icon: "🤖",
    href: "/ai-assistant",
    color: "from-violet-50 to-violet-100",
    border: "border-violet-200",
  },
  {
    title: "Scheduling",
    description: "Book appointments and schedule consultations",
    icon: "📅",
    href: "/scheduling",
    color: "from-amber-50 to-amber-100",
    border: "border-amber-200",
  },
  {
    title: "Analytics Dashboard",
    description: "View research impact and publication metrics",
    icon: "📊",
    href: "/analytics",
    color: "from-lime-50 to-lime-100",
    border: "border-lime-200",
  },
];

export default function MorePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <PageHeader
        title="More"
        subtitle="Additional Features & Tools"
        description="Explore all the features, tools, and resources available on this platform"
        icon="✨"
        gradient={true}
      />

      {/* Quick Stats */}
      <SlideCard direction="up" delay={0.2}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-5 text-center">
            <p className="text-4xl font-bold text-blue-900">{features.length}</p>
            <p className="text-sm font-medium text-blue-700 mt-1">Features Available</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-5 text-center">
            <p className="text-4xl font-bold text-green-900">24/7</p>
            <p className="text-sm font-medium text-green-700 mt-1">Access Anytime</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-5 text-center">
            <p className="text-4xl font-bold text-purple-900">100%</p>
            <p className="text-sm font-medium text-purple-700 mt-1">Free to Use</p>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-5 text-center">
            <p className="text-4xl font-bold text-orange-900">∞</p>
            <p className="text-sm font-medium text-orange-700 mt-1">Unlimited Access</p>
          </div>
        </div>
      </SlideCard>

      {/* Features Grid */}
      <SlideGrid columns={3} direction="wave" staggerDelay={0.08}>
        {features.map((feature) => (
          <Link
            key={feature.href}
            href={feature.href}
            className="group block bg-white border-2 border-border rounded-2xl overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            <div className={`h-32 bg-gradient-to-br ${feature.color} ${feature.border} border-b-2 flex items-center justify-center`}>
              <span className="text-7xl group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </span>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-navy-900 mb-2 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-navy-600 text-sm mb-4">{feature.description}</p>
              <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                <span>Explore</span>
                <span className="group-hover:translate-x-2 transition-transform">→</span>
              </div>
            </div>
          </Link>
        ))}
      </SlideGrid>

      {/* Additional Info */}
      <SlideCard direction="up" delay={0.4}>
        <div className="mt-12 bg-gradient-to-br from-primary-light to-blue-50 border-2 border-primary/20 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-navy-900 mb-3">Need Help?</h2>
          <p className="text-navy-700 mb-6 max-w-2xl mx-auto">
            If you can't find what you're looking for or need assistance with any feature, feel free to reach out to us.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/contact"
              className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-hover transition-colors"
            >
              Contact Us
            </Link>
            <Link
              href="/community"
              className="px-6 py-3 bg-white text-primary font-semibold rounded-lg border-2 border-primary hover:bg-primary hover:text-white transition-colors"
            >
              Join Community
            </Link>
          </div>
        </div>
      </SlideCard>
    </div>
  );
}
