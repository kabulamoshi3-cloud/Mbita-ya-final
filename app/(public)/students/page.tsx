import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import StudentCard from "@/components/sections/StudentCard";
import SlideGrid from "@/components/SlideGrid";
import PageHeader from "@/components/PageHeader";
import SlideCard from "@/components/SlideCard";
import { separateStudents } from "@/lib/students";

export const revalidate = 0;

async function getStudents() {
  try {
    return await prisma.student.findMany({ where: { published: true }, orderBy: { createdAt: "desc" } });
  } catch {
    return [];
  }
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Students & Supervision",
    description: "Current PhD and Master's students under supervision, and alumni.",
    openGraph: { title: "Students & Supervision", description: "Current students and alumni." },
  };
}

export default async function StudentsPage() {
  const students = await getStudents();
  const { current, alumni } = separateStudents(students);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <PageHeader 
        title="Students & Supervision"
        subtitle="Mentoring Future Researchers"
        description="Meet my current PhD and Master's students, and explore the success stories of alumni"
        icon="🎓"
        gradient={true}
      />

      {/* Current students */}
      <section className="mb-12">
        <SlideCard direction="up" delay={0.2}>
          <h2 className="text-2xl font-semibold text-navy-900 mb-6">
            Current Students
            {current.length > 0 && (
              <span className="ml-2 text-sm font-normal text-navy-500">({current.length})</span>
            )}
          </h2>
        </SlideCard>
        {current.length > 0 ? (
          <SlideGrid columns={3} direction="wave" staggerDelay={0.1}>
            {current.map((student) => (
              <StudentCard
                key={student.id}
                id={student.id}
                name={student.name}
                degreeLevel={student.degreeLevel}
                researchTopic={student.researchTopic}
                status={student.status}
                profileUrl={student.profileUrl}
                photoUrl={student.photoUrl}
                achievements={student.achievements}
              />
            ))}
          </SlideGrid>
        ) : (
          <p className="text-navy-600 bg-navy-50 rounded-xl p-6 text-center">
            No current students listed at this time.
          </p>
        )}
      </section>

      {/* Alumni */}
      {alumni.length > 0 && (
        <section>
          <SlideCard direction="up" delay={0.3}>
            <h2 className="text-2xl font-semibold text-navy-900 mb-6">
              Alumni
              <span className="ml-2 text-sm font-normal text-navy-500">({alumni.length})</span>
            </h2>
          </SlideCard>
          <SlideGrid columns={3} direction="wave" staggerDelay={0.1}>
            {alumni.map((student) => (
              <StudentCard
                key={student.id}
                id={student.id}
                name={student.name}
                degreeLevel={student.degreeLevel}
                researchTopic={student.researchTopic}
                status={student.status}
                thesisTitle={student.thesisTitle}
                graduationYear={student.graduationYear}
                currentPosition={student.currentPosition}
                profileUrl={student.profileUrl}
                photoUrl={student.photoUrl}
                achievements={student.achievements}
              />
            ))}
          </SlideGrid>
        </section>
      )}
    </div>
  );
}
