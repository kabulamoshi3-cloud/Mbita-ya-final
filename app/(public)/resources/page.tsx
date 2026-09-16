import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import ResourcesClient from "@/components/sections/ResourcesClient";

export const revalidate = 0;

async function getResources() {
  try {
    return await prisma.resource.findMany({
      where: { published: true },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    });
  } catch {
    return [];
  }
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Resources",
    description: "Academic resources, datasets, software tools, templates, and tutorials for research and learning.",
    openGraph: {
      title: "Resources",
      description: "Access academic resources, research datasets, and educational materials.",
    },
  };
}

export default async function ResourcesPage() {
  const resources = await getResources();

  return <ResourcesClient resources={resources} />;
}
