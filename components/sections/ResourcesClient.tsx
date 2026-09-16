"use client";

import { useState, useMemo } from "react";
import PageHeader from "@/components/PageHeader";
import SlideGrid from "@/components/SlideGrid";
import SlideCard from "@/components/SlideCard";
import { Resource } from "@prisma/client";

interface ResourcesClientProps {
  resources: Resource[];
}

export default function ResourcesClient({ resources }: ResourcesClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set(resources.map((r) => r.category));
    return Array.from(cats).sort();
  }, [resources]);

  // Filter resources
  const filtered = useMemo(() => {
    return resources.filter((resource) => {
      const matchesSearch =
        resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = !selectedCategory || resource.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [resources, searchQuery, selectedCategory]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    resources.forEach((r) => {
      counts[r.category] = (counts[r.category] || 0) + 1;
    });
    return counts;
  }, [resources]);

  const categoryIcons: Record<string, string> = {
    dataset: "📊",
    software: "💻",
    template: "📝",
    tutorial: "📚",
    paper: "📄",
    book: "📖",
    tool: "🛠️",
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <PageHeader
        title="Resources"
        subtitle="Academic Tools & Materials"
        description="Access datasets, software, templates, tutorials, and research materials"
        icon="📦"
        gradient={true}
      />

      {/* Stats */}
      <SlideCard direction="up" delay={0.2}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-blue-900">{resources.length}</p>
            <p className="text-sm font-medium text-blue-700">Total Resources</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-green-900">{resources.filter(r => r.featured).length}</p>
            <p className="text-sm font-medium text-green-700">Featured</p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-purple-900">{categories.length}</p>
            <p className="text-sm font-medium text-purple-700">Categories</p>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-orange-900">{resources.reduce((sum, r) => sum + r.downloads, 0)}</p>
            <p className="text-sm font-medium text-orange-700">Total Downloads</p>
          </div>
        </div>
      </SlideCard>

      {/* Search and Filters */}
      <SlideCard direction="up" delay={0.3}>
        <div className="mb-6 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2.5 border border-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {categoryIcons[cat] || "📦"} {cat.charAt(0).toUpperCase() + cat.slice(1)} ({categoryCounts[cat]})
              </option>
            ))}
          </select>
        </div>
      </SlideCard>

      {/* Category Quick Filters */}
      <SlideCard direction="up" delay={0.4}>
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSelectedCategory("")}
            className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
              selectedCategory === ""
                ? "bg-primary text-white border-primary"
                : "border-border text-navy-600 hover:border-primary hover:text-primary"
            }`}
          >
            All ({resources.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat === selectedCategory ? "" : cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
                selectedCategory === cat
                  ? "bg-primary text-white border-primary"
                  : "bg-white border-border text-navy-600 hover:border-primary hover:text-primary"
              }`}
            >
              {categoryIcons[cat] || "📦"} {cat.charAt(0).toUpperCase() + cat.slice(1)} ({categoryCounts[cat]})
            </button>
          ))}
        </div>
      </SlideCard>

      {/* Results */}
      <div className="mb-4">
        <p className="text-sm text-navy-500">
          Showing {filtered.length} of {resources.length} resources
        </p>
      </div>

      {filtered.length > 0 ? (
        <SlideGrid columns={3} direction="wave" staggerDelay={0.08}>
          {filtered.map((resource) => (
            <div
              key={resource.id}
              className="bg-white border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Thumbnail */}
              {resource.thumbnailUrl ? (
                <div className="h-40 bg-gradient-to-br from-navy-50 to-primary-light flex items-center justify-center overflow-hidden">
                  <img
                    src={resource.thumbnailUrl}
                    alt={resource.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="h-40 bg-gradient-to-br from-navy-50 to-primary-light flex items-center justify-center">
                  <span className="text-6xl">
                    {categoryIcons[resource.category] || "📦"}
                  </span>
                </div>
              )}

              <div className="p-5">
                {/* Category Badge */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2.5 py-1 bg-primary-light text-primary text-xs font-semibold rounded-full">
                    {categoryIcons[resource.category] || "📦"} {resource.category}
                  </span>
                  {resource.featured && (
                    <span className="px-2.5 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                      ⭐ Featured
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="font-bold text-navy-900 text-lg mb-2 line-clamp-2">
                  {resource.title}
                </h3>

                {/* Description */}
                <p className="text-navy-600 text-sm mb-4 line-clamp-3">
                  {resource.description}
                </p>

                {/* Tags */}
                {resource.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {resource.tags.slice(0, 3).map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-navy-50 text-navy-700 text-xs rounded"
                      >
                        {tag}
                      </span>
                    ))}
                    {resource.tags.length > 3 && (
                      <span className="px-2 py-0.5 bg-navy-50 text-navy-700 text-xs rounded">
                        +{resource.tags.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                {/* Meta Info */}
                <div className="flex items-center justify-between text-xs text-navy-500 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {resource.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      {resource.downloads}
                    </span>
                  </div>
                  {resource.fileSize && (
                    <span className="font-medium">{resource.fileSize}</span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-hover transition-colors text-center"
                  >
                    Access Resource
                  </a>
                  {resource.fileUrl && (
                    <a
                      href={resource.fileUrl}
                      download
                      className="px-4 py-2 bg-navy-100 text-navy-800 text-sm font-semibold rounded-lg hover:bg-navy-200 transition-colors"
                      title="Download"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </SlideGrid>
      ) : (
        <div className="text-center py-16 bg-navy-50 rounded-2xl">
          <p className="text-6xl mb-4">🔍</p>
          <p className="text-xl font-semibold text-navy-900 mb-2">No resources found</p>
          <p className="text-navy-600">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}
