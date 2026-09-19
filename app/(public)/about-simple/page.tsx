import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AboutSimplePage() {
  try {
    console.log('[About Simple] Starting...');
    
    const profile = await prisma.profile.findFirst();
    
    console.log('[About Simple] Profile found:', profile !== null);
    
    if (!profile) {
      return (
        <div className="p-8">
          <h1 className="text-2xl font-bold text-red-600">Profile Not Found</h1>
          <p>No profile data in database</p>
        </div>
      );
    }
    
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">About (Simple Test)</h1>
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <p><strong>Name:</strong> {profile.fullName}</p>
          <p><strong>Title:</strong> {profile.title}</p>
          <p><strong>Email:</strong> {profile.email}</p>
        </div>
        <p className="mt-4 text-green-600">✅ Database connection works!</p>
      </div>
    );
  } catch (error) {
    console.error('[About Simple] Error:', error);
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-red-600">Error</h1>
        <pre className="mt-4 p-4 bg-red-50 rounded overflow-auto">
          {error instanceof Error ? error.message : String(error)}
        </pre>
        <pre className="mt-2 p-4 bg-gray-100 rounded overflow-auto text-xs">
          {error instanceof Error ? error.stack : 'No stack trace'}
        </pre>
      </div>
    );
  }
}
