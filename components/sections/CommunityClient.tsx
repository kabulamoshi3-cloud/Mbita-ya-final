"use client";

import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import SlideGrid from "@/components/SlideGrid";
import SlideCard from "@/components/SlideCard";
import type { CommunityPost, CommunityReply, FAQ, Testimonial } from "@prisma/client";

interface CommunityClientProps {
  posts: (CommunityPost & { replies: CommunityReply[] })[];
  faqs: FAQ[];
  testimonials: Testimonial[];
}

export default function CommunityClient({ posts, faqs, testimonials }: CommunityClientProps) {
  const [activeTab, setActiveTab] = useState<"discussions" | "faq" | "testimonials">("discussions");
  const [selectedCategory, setSelectedCategory] = useState("");

  const categories = ["discussion", "question", "announcement", "opportunity"];
  const faqCategories = Array.from(new Set(faqs.map((f) => f.category)));

  const filteredPosts = selectedCategory
    ? posts.filter((p) => p.category === selectedCategory)
    : posts;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <PageHeader
        title="Community"
        subtitle="Connect & Collaborate"
        description="Join discussions, ask questions, share experiences, and connect with fellow researchers and students"
        icon="👥"
        gradient={true}
      />

      {/* Stats */}
      <SlideCard direction="up" delay={0.2}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-blue-900">{posts.length}</p>
            <p className="text-sm font-medium text-blue-700">Discussions</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-green-900">{posts.reduce((sum, p) => sum + p.replies.length, 0)}</p>
            <p className="text-sm font-medium text-green-700">Replies</p>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-purple-900">{faqs.length}</p>
            <p className="text-sm font-medium text-purple-700">FAQs</p>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-center">
            <p className="text-3xl font-bold text-orange-900">{testimonials.length}</p>
            <p className="text-sm font-medium text-orange-700">Testimonials</p>
          </div>
        </div>
      </SlideCard>

      {/* Tabs */}
      <SlideCard direction="up" delay={0.3}>
        <div className="flex gap-2 mb-8 border-b border-border pb-2">
          <button
            onClick={() => setActiveTab("discussions")}
            className={`px-6 py-3 font-semibold rounded-t-lg transition-colors ${
              activeTab === "discussions"
                ? "bg-primary text-white"
                : "text-navy-600 hover:bg-navy-50"
            }`}
          >
            💬 Discussions ({posts.length})
          </button>
          <button
            onClick={() => setActiveTab("faq")}
            className={`px-6 py-3 font-semibold rounded-t-lg transition-colors ${
              activeTab === "faq"
                ? "bg-primary text-white"
                : "text-navy-600 hover:bg-navy-50"
            }`}
          >
            ❓ FAQ ({faqs.length})
          </button>
          <button
            onClick={() => setActiveTab("testimonials")}
            className={`px-6 py-3 font-semibold rounded-t-lg transition-colors ${
              activeTab === "testimonials"
                ? "bg-primary text-white"
                : "text-navy-600 hover:bg-navy-50"
            }`}
          >
            ⭐ Testimonials ({testimonials.length})
          </button>
        </div>
      </SlideCard>

      {/* DISCUSSIONS TAB */}
      {activeTab === "discussions" && (
        <>
          {/* Category Filters */}
          <SlideCard direction="up" delay={0.4}>
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => setSelectedCategory("")}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
                  selectedCategory === ""
                    ? "bg-primary text-white border-primary"
                    : "border-border text-navy-600 hover:border-primary"
                }`}
              >
                All ({posts.length})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat === selectedCategory ? "" : cat)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold border transition-colors ${
                    selectedCategory === cat
                      ? "bg-primary text-white border-primary"
                      : "border-border text-navy-600 hover:border-primary"
                  }`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)} ({posts.filter(p => p.category === cat).length})
                </button>
              ))}
            </div>
          </SlideCard>

          {/* Posts */}
          {filteredPosts.length > 0 ? (
            <SlideGrid columns={1} direction="up" staggerDelay={0.1}>
              {filteredPosts.map((post) => (
                <div key={post.id} className="bg-white border border-border rounded-xl p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-primary-light rounded-full flex items-center justify-center text-xl">
                      {post.authorName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-navy-900 text-lg">{post.title}</h3>
                        <span className="px-2.5 py-0.5 bg-primary-light text-primary text-xs font-semibold rounded-full">
                          {post.category}
                        </span>
                        {post.isPinned && (
                          <span className="px-2.5 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                            📌 Pinned
                          </span>
                        )}
                      </div>
                      <p className="text-navy-700 mb-3">{post.content}</p>
                      {post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {post.tags.map((tag, i) => (
                            <span key={i} className="px-2 py-0.5 bg-navy-50 text-navy-600 text-xs rounded">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center gap-4 text-sm text-navy-500">
                        <span className="font-medium">{post.authorName}</span>
                        <span>•</span>
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          👁️ {post.views} views
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          👍 {post.likes} likes
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          💬 {post.replies.length} replies
                        </span>
                      </div>

                      {/* Replies */}
                      {post.replies.length > 0 && (
                        <div className="mt-4 pl-4 border-l-2 border-navy-100 space-y-3">
                          {post.replies.slice(0, 3).map((reply) => (
                            <div key={reply.id} className="bg-navy-50 rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-navy-900 text-sm">{reply.authorName}</span>
                                <span className="text-xs text-navy-500">
                                  {new Date(reply.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-navy-700 text-sm">{reply.content}</p>
                            </div>
                          ))}
                          {post.replies.length > 3 && (
                            <p className="text-sm text-navy-500 italic">
                              +{post.replies.length - 3} more replies
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </SlideGrid>
          ) : (
            <div className="text-center py-16 bg-navy-50 rounded-2xl">
              <p className="text-6xl mb-4">💬</p>
              <p className="text-xl font-semibold text-navy-900 mb-2">No discussions yet</p>
              <p className="text-navy-600">Be the first to start a conversation!</p>
            </div>
          )}
        </>
      )}

      {/* FAQ TAB */}
      {activeTab === "faq" && (
        <>
          {/* FAQ Categories */}
          <SlideCard direction="up" delay={0.4}>
            <div className="flex flex-wrap gap-2 mb-6">
              {faqCategories.map((cat) => (
                <button
                  key={cat}
                  className="px-4 py-2 rounded-full text-sm font-semibold bg-primary-light text-primary border border-primary/20"
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)} ({faqs.filter(f => f.category === cat).length})
                </button>
              ))}
            </div>
          </SlideCard>

          {faqs.length > 0 ? (
            <div className="space-y-4">
              {faqCategories.map((category) => {
                const categoryFaqs = faqs.filter((f) => f.category === category);
                if (categoryFaqs.length === 0) return null;

                return (
                  <div key={category}>
                    <SlideCard direction="up" delay={0.5}>
                      <h3 className="text-xl font-bold text-navy-900 mb-4 capitalize">{category}</h3>
                    </SlideCard>
                    <SlideGrid columns={1} direction="up" staggerDelay={0.05}>
                      {categoryFaqs.map((faq) => (
                        <details key={faq.id} className="group bg-white border border-border rounded-xl overflow-hidden">
                          <summary className="cursor-pointer p-5 font-semibold text-navy-900 hover:bg-navy-50 transition-colors flex justify-between items-center">
                            <span>{faq.question}</span>
                            <span className="text-primary group-open:rotate-180 transition-transform">▼</span>
                          </summary>
                          <div className="p-5 pt-0 text-navy-700 border-t border-border">
                            <p className="whitespace-pre-line">{faq.answer}</p>
                            <div className="flex items-center gap-4 mt-4 text-sm text-navy-500">
                              <span>Was this helpful?</span>
                              <button className="flex items-center gap-1 hover:text-green-600">
                                👍 {faq.helpful}
                              </button>
                              <button className="flex items-center gap-1 hover:text-red-600">
                                👎 {faq.notHelpful}
                              </button>
                            </div>
                          </div>
                        </details>
                      ))}
                    </SlideGrid>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-navy-50 rounded-2xl">
              <p className="text-6xl mb-4">❓</p>
              <p className="text-xl font-semibold text-navy-900 mb-2">No FAQs available</p>
            </div>
          )}
        </>
      )}

      {/* TESTIMONIALS TAB */}
      {activeTab === "testimonials" && (
        <>
          {testimonials.length > 0 ? (
            <SlideGrid columns={3} direction="wave" staggerDelay={0.08}>
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="bg-white border border-border rounded-xl p-6 hover:shadow-lg transition-shadow"
                >
                  {/* Photo */}
                  <div className="flex items-center gap-4 mb-4">
                    {testimonial.photoUrl ? (
                      <img
                        src={testimonial.photoUrl}
                        alt={testimonial.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-primary"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center text-2xl font-bold text-primary">
                        {testimonial.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <h3 className="font-bold text-navy-900">{testimonial.name}</h3>
                      <p className="text-sm text-navy-600">{testimonial.role}</p>
                      {testimonial.institution && (
                        <p className="text-xs text-navy-500">{testimonial.institution}</p>
                      )}
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex gap-0.5 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={i < testimonial.rating ? "text-yellow-400" : "text-gray-300"}>
                        ⭐
                      </span>
                    ))}
                  </div>

                  {/* Content */}
                  <p className="text-navy-700 italic mb-3">"{testimonial.content}"</p>

                  {testimonial.featured && (
                    <span className="inline-block px-2.5 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                      ⭐ Featured
                    </span>
                  )}
                </div>
              ))}
            </SlideGrid>
          ) : (
            <div className="text-center py-16 bg-navy-50 rounded-2xl">
              <p className="text-6xl mb-4">⭐</p>
              <p className="text-xl font-semibold text-navy-900 mb-2">No testimonials yet</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
