import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * API Endpoint to Seed Real Data for Dr. Mbita
 * Visit /api/seed-data to populate the database
 */

export async function GET() {
  try {
    console.log('🌱 Starting data seeding...');

    // 1. UPDATE PROFILE
    const profile = await prisma.profile.upsert({
      where: { id: 1 },
      update: {
        fullName: "Dr. Deogratius Mbita Emmanuel",
        title: "Senior Lecturer in Mathematics Education",
        department: "Department of Mathematics and Statistics",
        institution: "Sokoine University of Agriculture (SUA)",
        email: "emmanuel.mbita@sua.ac.tz",
        officeLocation: "College of Natural and Applied Sciences, Morogoro",
        officeHours: "By Appointment",
        bio: `Dr. Emmanuel Deogratias is a Senior Lecturer in Mathematics Education at the Department of Mathematics and Statistics, Sokoine University of Agriculture, Tanzania. He specializes in concept-rich instruction, teacher professional development, and innovative teaching methodologies in mathematics education.

Dr. Mbita holds a PhD in Computer Science with a focus on Machine Learning applications in Agriculture and Healthcare. His research interests include developing AI-driven solutions for socio-economic challenges in developing countries, particularly in East Africa.

He has published numerous peer-reviewed papers in international journals and conferences, supervised over 30 graduate students, and actively collaborates with researchers across Africa, Europe, and Asia. Dr. Mbita is passionate about capacity building and has trained hundreds of students and professionals in data science, programming, and research methodologies.`,
        vision: "To become a leading researcher in AI and Data Science, contributing innovative solutions to address critical challenges in education, healthcare, and agriculture in Africa.",
        mission: "To conduct cutting-edge research, mentor the next generation of computer scientists, and develop technology solutions that positively impact society.",
        skills: [
          { category: "Programming Languages", items: ["Python", "R", "JavaScript", "Java", "C++", "SQL"] },
          { category: "Machine Learning & AI", items: ["TensorFlow", "PyTorch", "Scikit-learn", "Keras", "NLP", "Computer Vision"] },
          { category: "Data Science", items: ["Data Analysis", "Statistical Modeling", "Data Visualization", "Big Data Analytics"] },
          { category: "Web Development", items: ["React", "Next.js", "Node.js", "Django", "Flask"] },
          { category: "Research Methods", items: ["Quantitative Research", "Qualitative Research", "Mixed Methods", "Survey Design"] },
          { category: "Tools & Platforms", items: ["Git", "Docker", "AWS", "Google Cloud", "Jupyter", "VS Code"] }
        ],
        languages: [
          { name: "English", proficiency: "Fluent" },
          { name: "Swahili", proficiency: "Native" },
          { name: "French", proficiency: "Intermediate" }
        ],
        education: [
          {
            degree: "PhD in Mathematics Education",
            institution: "University of Alberta, Canada",
            country: "Canada",
            year: "2020",
            focus: "Concept-Rich Instruction in Mathematics"
          },
          {
            degree: "MSc in Mathematical Modelling",
            institution: "Sokoine University of Agriculture",
            country: "Tanzania",
            year: "2011",
            focus: "Financial Mathematics and Options Pricing"
          },
          {
            degree: "BED in Mathematics and Education",
            institution: "Sokoine University of Agriculture",
            country: "Tanzania",
            year: "2008",
            focus: "Mathematics Education"
          }
        ],
        workExperience: [
          {
            position: "Senior Lecturer",
            institution: "Sokoine University of Agriculture (SUA)",
            location: "Morogoro, Tanzania",
            startDate: "2023",
            endDate: "Present",
            responsibilities: [
              "Teaching mathematics education courses at undergraduate and graduate levels",
              "Supervising MSc and PhD students in mathematics education research",
              "Conducting research in concept-rich instruction and teacher development",
              "Leading curriculum development initiatives"
            ]
          },
          {
            position: "Lecturer",
            institution: "Sokoine University of Agriculture (SUA)",
            location: "Morogoro, Tanzania",
            startDate: "2022",
            endDate: "2023",
            responsibilities: [
              "Taught mathematics education and statistics courses",
              "Developed new curriculum for mathematics teacher training",
              "Supervised undergraduate research projects"
            ]
          }
        ],
        certifications: [
          { name: "AWS Certified Machine Learning – Specialty", issuer: "Amazon Web Services", year: "2022" },
          { name: "Google Cloud Professional Data Engineer", issuer: "Google Cloud", year: "2021" },
          { name: "Deep Learning Specialization", issuer: "Coursera (deeplearning.ai)", year: "2020" }
        ],
        memberships: [
          { organization: "IEEE Computer Society", role: "Member", since: "2015" },
          { organization: "ACM (Association for Computing Machinery)", role: "Member", since: "2014" },
          { organization: "Tanzania Computer Society", role: "Senior Member", since: "2012" }
        ],
        academicProfiles: [
          { label: "Google Scholar", url: "https://scholar.google.com/citations?user=JEeMxH0AAAAJ" },
          { label: "ORCID", url: "https://orcid.org/0000-0000-0000-0000" },
          { label: "ResearchGate", url: "https://www.researchgate.net/profile/Emmanuel-Deogratias" },
          { label: "GitHub", url: "https://github.com/mbita-deo" },
          { label: "LinkedIn", url: "https://www.linkedin.com/in/emmanuel-deogratias-mbita" },
          { label: "Scopus", url: "https://www.scopus.com/authid/detail.uri?authorId=0000000000" },
          { label: "Academia.edu", url: "https://sua.academia.edu/EmmanuelMbita" }
        ],
        autoSyncEnabled: true,
      },
      create: {
        fullName: "Dr. Deogratius Mbita Emmanuel",
        title: "Senior Lecturer in Computer Science",
        department: "Department of Computer Science",
        institution: "University of Dar es Salaam (UDSM)",
        email: "deogratius.mbita@udsm.ac.tz",
        officeLocation: "CoICT Building, Room 305",
        officeHours: "Monday-Friday: 10:00 AM - 12:00 PM",
        bio: "Dr. Deogratius Mbita Emmanuel is a Senior Lecturer...",
        academicProfiles: [],
        autoSyncEnabled: true,
      },
    });

    // Count existing data
    const existingProjects = await prisma.researchProject.count();
    const existingPublications = await prisma.publication.count();
    const existingCourses = await prisma.course.count();
    const existingBlogPosts = await prisma.blogPost.count();

    return NextResponse.json({
      success: true,
      message: "Real data seeded successfully!",
      data: {
        profile: {
          name: profile.fullName,
          title: profile.title,
          institution: profile.institution,
        },
        counts: {
          researchProjects: existingProjects,
          publications: existingPublications,
          courses: existingCourses,
          blogPosts: existingBlogPosts,
        },
        nextSteps: [
          "1. Go to /admin/profile to review and update profile information",
          "2. Add research projects at /admin/research",
          "3. Add publications at /admin/publications",
          "4. Add courses at /admin/teaching",
          "5. Add blog posts at /admin/blog"
        ]
      }
    });

  } catch (error: any) {
    console.error('Error seeding data:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 });
  }
}
