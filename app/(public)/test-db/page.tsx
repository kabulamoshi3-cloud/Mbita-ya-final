import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function TestDBPage() {
  try {
    // Try to connect to database
    const profile = await prisma.profile.findFirst({
      select: {
        id: true,
        fullName: true,
        title: true,
        institution: true,
      }
    });

    if (!profile) {
      return (
        <div className="max-w-4xl mx-auto p-8">
          <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6">
            <h1 className="text-2xl font-bold text-yellow-900 mb-2">⚠️ Database Connected - No Profile</h1>
            <p className="text-yellow-700">Database connection successful, but no profile record found.</p>
            <p className="text-sm text-yellow-600 mt-4">Run: <code className="bg-yellow-100 px-2 py-1 rounded">node scripts/fix-profile-real-data.mjs</code></p>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-green-50 border-2 border-green-400 rounded-lg p-6">
          <h1 className="text-2xl font-bold text-green-900 mb-4">✅ Database Connection Successful!</h1>
          
          <div className="space-y-2 text-green-800">
            <p><strong>Profile ID:</strong> {profile.id}</p>
            <p><strong>Name:</strong> {profile.fullName}</p>
            <p><strong>Title:</strong> {profile.title}</p>
            <p><strong>Institution:</strong> {profile.institution}</p>
          </div>

          <div className="mt-6 p-4 bg-green-100 rounded">
            <p className="text-sm text-green-700">
              ✅ If you see this, the database is working correctly.
              <br />
              The About page should also work now.
            </p>
          </div>
          
          <div className="mt-4">
            <a 
              href="/about" 
              className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Test About Page →
            </a>
          </div>
        </div>
      </div>
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : '';
    
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-red-50 border-2 border-red-400 rounded-lg p-6">
          <h1 className="text-2xl font-bold text-red-900 mb-4">❌ Database Connection Failed</h1>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-red-800">Error Message:</p>
              <pre className="mt-1 p-3 bg-red-100 rounded text-xs text-red-900 overflow-auto">
                {errorMessage}
              </pre>
            </div>

            {errorStack && (
              <div>
                <p className="text-sm font-semibold text-red-800">Stack Trace:</p>
                <pre className="mt-1 p-3 bg-red-100 rounded text-xs text-red-900 overflow-auto max-h-64">
                  {errorStack}
                </pre>
              </div>
            )}

            <div className="mt-6 p-4 bg-red-100 rounded">
              <p className="text-sm font-semibold text-red-800 mb-2">Possible Causes:</p>
              <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                <li>DATABASE_URL environment variable not set correctly</li>
                <li>Database server is not accessible</li>
                <li>Database credentials are incorrect</li>
                <li>Network/firewall blocking connection</li>
                <li>Render database has spun down (free tier)</li>
              </ul>
            </div>

            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-300 rounded">
              <p className="text-sm font-semibold text-yellow-900 mb-2">How to Fix:</p>
              <ol className="list-decimal list-inside text-sm text-yellow-800 space-y-1">
                <li>Check Render dashboard → Environment variables</li>
                <li>Verify DATABASE_URL is correct</li>
                <li>Check database service is running</li>
                <li>Test connection from Render shell</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
