import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import CommunityClient from "@/components/sections/CommunityClient";

export const revalidate = 0;

async function getCommunityData() {
  try {
    const [posts, faqs, testimonials] = await Promise.all([
      prisma.communityPost.findMany({
        where: { published: true, isApproved: true },
        include: { replies: { where: { isApproved: true }, orderBy: { createdAt: "desc" } } },
        orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
        take: 50,
      }),
      prisma.fAQ.findMany({
        where: { published: true },
        orderBy: { order: "asc" },
      }),
      prisma.testimonial.findMany({
        where: { published: true },
        orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
        take: 20,
      }),
    ]);
    return { posts, faqs, testimonials };
  } catch {
    return { posts: [], faqs: [], testimonials: [] };
  }
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Community",
    description: "Join the academic community - discussions, Q&A, testimonials, and connections.",
    openGraph: {
      title: "Community",
      description: "Connect with students, researchers, and collaborators in our academic community.",
    },
  };
}

export default async function CommunityPage() {
  const data = await getCommunityData();

  return <CommunityClient {...data} />;
}
