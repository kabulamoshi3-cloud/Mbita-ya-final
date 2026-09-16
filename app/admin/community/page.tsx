"use client";

import { useState, useEffect } from "react";
import { CommunityPost, FAQ, Testimonial } from "@prisma/client";

type TabType = "posts" | "faqs" | "testimonials";

export default function AdminCommunityPage() {
  const [activeTab, setActiveTab] = useState<TabType>("posts");
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [postsRes, faqsRes, testimonialsRes] = await Promise.all([
        fetch("/api/admin/community/posts"),
        fetch("/api/admin/community/faqs"),
        fetch("/api/admin/community/testimonials"),
      ]);

      if (postsRes.ok) setPosts(await postsRes.json());
      if (faqsRes.ok) setFaqs(await faqsRes.json());
      if (testimonialsRes.ok) setTestimonials(await testimonialsRes.json());
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const approvePost = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/community/posts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved: true }),
      });
      if (res.ok) {
        alert("Post approved!");
        fetchData();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const deletePost = async (id: string) => {
    if (!confirm("Delete this post?")) return;
    try {
      const res = await fetch(`/api/admin/community/posts/${id}`, { method: "DELETE" });
      if (res.ok) {
        alert("Post deleted!");
        fetchData();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const deleteFaq = async (id: string) => {
    if (!confirm("Delete this FAQ?")) return;
    try {
      const res = await fetch(`/api/admin/community/faqs/${id}`, { method: "DELETE" });
      if (res.ok) {
        alert("FAQ deleted!");
        fetchData();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const deleteTestimonial = async (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    try {
      const res = await fetch(`/api/admin/community/testimonials/${id}`, { method: "DELETE" });
      if (res.ok) {
        alert("Testimonial deleted!");
        fetchData();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-navy-900 mb-6">Manage Community</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveTab("posts")}
          className={`px-6 py-3 font-semibold rounded-t-lg transition-colors ${
            activeTab === "posts"
              ? "bg-blue-600 text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Posts ({posts.length})
        </button>
        <button
          onClick={() => setActiveTab("faqs")}
          className={`px-6 py-3 font-semibold rounded-t-lg transition-colors ${
            activeTab === "faqs"
              ? "bg-blue-600 text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          FAQs ({faqs.length})
        </button>
        <button
          onClick={() => setActiveTab("testimonials")}
          className={`px-6 py-3 font-semibold rounded-t-lg transition-colors ${
            activeTab === "testimonials"
              ? "bg-blue-600 text-white"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          Testimonials ({testimonials.length})
        </button>
      </div>

      {/* Posts Tab */}
      {activeTab === "posts" && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Author</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stats</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {posts.map((post) => (
                  <tr key={post.id}>
                    <td className="px-6 py-4 text-sm text-gray-900">{post.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{post.authorName}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{post.category}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      👁️ {post.views} | 👍 {post.likes}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {post.isApproved ? (
                          <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Approved</span>
                        ) : (
                          <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">Pending</span>
                        )}
                        {post.isPinned && (
                          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">Pinned</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      {!post.isApproved && (
                        <button
                          onClick={() => approvePost(post.id)}
                          className="text-green-600 hover:text-green-800"
                        >
                          Approve
                        </button>
                      )}
                      <button
                        onClick={() => deletePost(post.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* FAQs Tab */}
      {activeTab === "faqs" && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Question</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Feedback</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {faqs.map((faq) => (
                  <tr key={faq.id}>
                    <td className="px-6 py-4 text-sm text-gray-900">{faq.question}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{faq.category}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      👍 {faq.helpful} | 👎 {faq.notHelpful}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => deleteFaq(faq.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Testimonials Tab */}
      {activeTab === "testimonials" && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {testimonials.map((testimonial) => (
                  <tr key={testimonial.id}>
                    <td className="px-6 py-4 text-sm text-gray-900">{testimonial.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{testimonial.role}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">⭐ {testimonial.rating}/5</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {testimonial.published && (
                          <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded">Published</span>
                        )}
                        {testimonial.featured && (
                          <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">Featured</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => deleteTestimonial(testimonial.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
