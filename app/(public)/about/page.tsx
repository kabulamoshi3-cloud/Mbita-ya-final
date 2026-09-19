import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";

// Force dynamic rendering
export const dynamic = "force-dynamic";
export const revalidate = 0;

interface AcademicProfile {
  label: string;
  url: string;
}

async function getProfile() {
  try {
    return await prisma.profile.findFirst();
  } catch (error) {
    console.error("Profile fetch error:", error);
    return null;
  }
}

async function getAwards() {
  try {
    return await prisma.award.findMany({
      where: { published: true },
      orderBy: { year: "desc" },
      take: 12,
    });
  } catch (error) {
    console.error("Awards fetch error:", error);
    return [];
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getProfile();
  if (!profile) return { title: "About", description: "About the professor" };
  return {
    title: "About",
    description: `Learn more about ${profile.fullName}, ${profile.title} at ${profile.institution}.`,
    openGraph: {
      title: `About — ${profile.fullName}`,
      description: `${profile.fullName} is ${profile.title} at ${profile.institution}.`,
      images: profile.photoUrl ? [{ url: profile.photoUrl }] : [],
    },
  };
}

export default async function AboutPage() {
  const [profile, awards] = await Promise.all([getProfile(), getAwards()]);

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-8 text-center">
          <h1 className="text-2xl font-bold text-yellow-900 mb-2">Profile Not Available</h1>
          <p className="text-yellow-700">Profile information could not be loaded. Please contact the administrator.</p>
          <Link href="/" className="inline-block mt-4 px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  // Safely parse JSON fields
  const academicProfiles = Array.isArray(profile.academicProfiles) 
    ? (profile.academicProfiles as unknown as AcademicProfile[]) 
    : [];
  
  const education = Array.isArray(profile.education) ? profile.education : [];
  const skills = Array.isArray(profile.skills) ? profile.skills : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Profile Photo */}
            <div className="flex-shrink-0">
              {profile.photoUrl ? (
                <Image
                  src={profile.photoUrl}
                  alt={profile.fullName}
                  width={200}
                  height={200}
                  className="rounded-full border-4 border-white shadow-2xl object-cover"
                />
              ) : (
                <div className="w-48 h-48 rounded-full bg-blue-700 border-4 border-white shadow-2xl flex items-center justify-center text-6xl">
                  👨‍🎓
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold mb-2">{profile.fullName}</h1>
              <p className="text-xl text-blue-100 mb-1">{profile.title}</p>
              <p className="text-lg text-blue-200 mb-1">{profile.department}</p>
              <p className="text-lg text-blue-200">{profile.institution}</p>
              
              {/* Download CV */}
              {profile.cvUrl && (
                <a
                  href={profile.cvUrl}
                  download
                  className="inline-flex items-center gap-2 mt-4 px-6 py-3 bg-white text-blue-900 font-semibold rounded-lg hover:bg-blue-50 transition-colors shadow-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download CV
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        
        {/* Biography */}
        <section className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">About Me</h2>
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
            {profile.bio.split('\n').map((paragraph, i) => (
              paragraph.trim() && <p key={i} className="mb-4">{paragraph}</p>
            ))}
          </div>
        </section>

        {/* Vision & Mission */}
        {(profile.vision || profile.mission) && (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {profile.vision && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl">🎯</span> Vision
                </h3>
                <p className="text-gray-700 leading-relaxed">{profile.vision}</p>
              </div>
            )}
            {profile.mission && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <span className="text-2xl">🚀</span> Mission
                </h3>
                <p className="text-gray-700 leading-relaxed">{profile.mission}</p>
              </div>
            )}
          </div>
        )}

        {/* Academic Profiles */}
        {academicProfiles.length > 0 && (
          <section className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Academic Profiles</h2>
            <div className="flex flex-wrap gap-3">
              {academicProfiles.map((ap, i) => (
                <a
                  key={i}
                  href={ap.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  🔗 {ap.label}
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Contact Information */}
        <section className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📧</span>
              <a href={`mailto:${profile.email}`} className="text-blue-600 hover:underline">
                {profile.email}
              </a>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">📍</span>
              <span className="text-gray-700">{profile.officeLocation}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">🕐</span>
              <span className="text-gray-700">{profile.officeHours}</span>
            </div>
            {profile.whatsapp && (
              <div className="flex items-center gap-3">
                <span className="text-2xl">💬</span>
                <a href={`https://wa.me/${profile.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  WhatsApp: {profile.whatsapp}
                </a>
              </div>
            )}
          </div>
        </section>

        {/* Education */}
        {education.length > 0 && (
          <section className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Education</h2>
            <div className="space-y-6">
              {(education as any[]).map((edu: any, i: number) => (
                <div key={i} className="border-l-4 border-blue-600 pl-4">
                  <h3 className="text-lg font-bold text-gray-900">{edu.degree}</h3>
                  <p className="text-gray-700">{edu.institution}</p>
                  <p className="text-sm text-gray-500">{edu.year}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <section className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Skills & Expertise</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {(skills as any[]).map((skill: any, i: number) => (
                <div key={i}>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-gray-900">{skill.name}</span>
                    <span className="text-gray-600">{skill.level}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Awards */}
        {awards.length > 0 && (
          <section className="bg-white rounded-xl shadow-sm p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Awards & Recognition</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {awards.map((award) => (
                <div key={award.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  {award.imageUrl ? (
                    <Image src={award.imageUrl} alt={award.name} width={300} height={150} className="w-full h-32 object-cover rounded mb-3" />
                  ) : (
                    <div className="w-full h-32 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded mb-3 flex items-center justify-center">
                      <span className="text-5xl">🏆</span>
                    </div>
                  )}
                  <h3 className="font-bold text-gray-900 mb-1">{award.name}</h3>
                  <p className="text-sm text-gray-600">{award.organization}</p>
                  <p className="text-sm text-gray-500">{award.year}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Back to Home */}
        <div className="text-center">
          <Link href="/" className="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
