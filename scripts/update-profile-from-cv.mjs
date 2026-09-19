import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateProfileFromCV() {
  try {
    console.log('Updating profile with accurate CV information...');

    const profileData = {
      fullName: "Dr. Emmanuel Deogratias",
      title: "Senior Lecturer",
      department: "Department of Mathematics and Statistics",
      institution: "Sokoine University of Agriculture",
      email: "emmanuel.mbita@sua.ac.tz",
      officeLocation: "College of Natural and Applied Sciences, P.O. Box 3038, Morogoro, Tanzania",
      officeHours: "By Appointment",
      
      bio: `Dr. Emmanuel Deogratias is a Senior Lecturer in Mathematics Education at the Department of Mathematics and Statistics, Sokoine University of Agriculture, Tanzania. He holds a Doctor of Education (EdD) in Mathematics Education from the University of Alberta, Canada (2014-2020), an MSc in Mathematical Modelling from the University of Dar es Salaam (2009-2011), and a BED in Mathematics and Education from the University of Dar es Salaam (2005-2008).

Dr. Deogratias specializes in mathematics education with a focus on concept-rich instruction, teacher professional development, and innovative teaching methodologies. His doctoral dissertation explored the implementation of concept-rich instruction with university mathematics pre-service teachers in Tanzania.

He has published extensively in international peer-reviewed journals, with over 40 publications focusing on mathematics education, teaching methodologies, and educational research. His research interests include 21st-century skills development, student engagement in mathematics, and the use of real-world contexts in mathematical instruction.

Dr. Deogratias serves as an Editorial Review Board Member for the International Journal of Teacher Education and Professional Development (IGI Global) and has reviewed papers for numerous international journals. He is also the Coordinator for the Outreach Program at his department and a member of the College Committee for Research and Publications.`,

      vision: "To advance mathematics education in Tanzania and East Africa through innovative teaching practices, research excellence, and community engagement.",
      
      mission: "To develop conceptual understanding of mathematics among students and teachers through research-informed pedagogical practices, fostering critical thinking and problem-solving skills that connect classroom learning to real-world applications.",
      
      whatsapp: "+255713293936",
      
      academicProfiles: [
        { label: "Google Scholar", url: "https://scholar.google.com/citations?user=emmanuel_deogratias" },
        { label: "ORCID", url: "https://orcid.org/0000-0002-xxxx-xxxx" }
      ],
      
      education: [
        {
          degree: "Doctor of Education (EdD) in Mathematics Education",
          institution: "University of Alberta, Canada",
          year: "2014-2020",
          description: "Dissertation: Exploring the Implementation of Concept-Rich Instruction with University Mathematics Pre-Service Teachers: A Tanzanian Case"
        },
        {
          degree: "MSc in Mathematical Modelling",
          institution: "University of Dar es Salaam, Tanzania",
          year: "2009-2011",
          description: "Dissertation: Methods for Pricing and Hedging Plain Vanilla Barrier Options"
        },
        {
          degree: "Bachelor of Education (BED) - Mathematics and Education",
          institution: "University of Dar es Salaam, Tanzania",
          year: "2005-2008"
        },
        {
          degree: "Advanced Secondary School Education",
          institution: "Musoma High School, Tanzania",
          year: "2002-2004",
          description: "Majoring: Mathematics, Chemistry and Physics"
        }
      ],
      
      workExperience: [
        {
          role: "Senior Lecturer",
          organization: "Sokoine University of Agriculture",
          period: "2023 - Present",
          description: "Department of Mathematics and Statistics"
        },
        {
          role: "Coordinator for Outreach Program",
          organization: "Department of Mathematics and Statistics, SUA",
          period: "2025 - Present"
        },
        {
          role: "Member of College Committee for Research and Publications",
          organization: "College of Natural and Applied Sciences, SUA",
          period: "2025 - Present"
        },
        {
          role: "Editorial Review Board Member",
          organization: "International Journal of Teacher Education and Professional Development, IGI Global",
          period: "2023 - Present"
        },
        {
          role: "Lecturer",
          organization: "Sokoine University of Agriculture",
          period: "2022 - 2023"
        },
        {
          role: "Best Worker at University Level",
          organization: "University of Dodoma",
          period: "2021 - 2022",
          description: "Recognized for outstanding performance and contributions"
        },
        {
          role: "Online Global Social Justice in Education Course Leader",
          organization: "College of Education, Purdue University, USA",
          period: "2021 - 2022"
        },
        {
          role: "Coordinator for Research and Publications",
          organization: "Department of Mathematics and Statistics, University of Dodoma",
          period: "2020 - 2022"
        },
        {
          role: "Lecturer",
          organization: "University of Dodoma",
          period: "2020 - 2022"
        },
        {
          role: "Graduate Research Assistant",
          organization: "Department of Secondary Education, University of Alberta, Canada",
          period: "2014 - 2018"
        },
        {
          role: "Acting Head of Department",
          organization: "Mathematics Department, University of Dodoma",
          period: "2013 - 2014"
        },
        {
          role: "Undergraduate Coordinator",
          organization: "School of Mathematical Sciences, University of Dodoma",
          period: "2012 - 2014"
        },
        {
          role: "Assistant Lecturer",
          organization: "Department of Mathematics, University of Dodoma",
          period: "2011 - 2020"
        }
      ],
      
      skills: [
        { name: "Qualitative Research Methods (NVivo)", level: 90 },
        { name: "Quantitative Research Methods (SPSS)", level: 85 },
        { name: "Mathematics Education", level: 95 },
        { name: "Curriculum Development", level: 88 },
        { name: "Teacher Professional Development", level: 92 },
        { name: "Statistical Analysis", level: 85 },
        { name: "Academic Writing & Publishing", level: 90 },
        { name: "Community Engagement", level: 85 }
      ],
      
      languages: [
        "English (Fluent)",
        "Kiswahili (Native)",
        "Jita (Native)"
      ],
      
      certifications: [
        {
          name: "Graduate Ethics Training Course",
          issuer: "University of Alberta",
          year: "2014",
          description: "5-hour course in Faculty of Graduate Studies and Research"
        },
        {
          name: "Transformative Teaching and Learning Facilitator",
          issuer: "TESCEA Project",
          year: "2021",
          description: "Six-week online training course for East Africa facilitators"
        },
        {
          name: "Entrepreneurial Teachers Training for Transformation",
          issuer: "SDG Agents Project - University of Vechta, Germany",
          year: "2021",
          description: "Focus on entrepreneurial thinking, sustainable development, and ICT skills"
        }
      ],
      
      memberships: [
        "Editorial Review Board Member - International Journal of Teacher Education and Professional Development (IGI Global)",
        "Member - College Committee for Research and Publications, SUA",
        "Member - College Academic Committee, SUA (2022)",
        "Coordinator - Outreach Program, Department of Mathematics and Statistics, SUA"
      ],
      
      leadershipPositions: [
        {
          role: "Coordinator for Outreach Program",
          organization: "Department of Mathematics and Statistics, Sokoine University of Agriculture",
          period: "2025 - Present",
          description: "Leading community engagement and extension activities"
        },
        {
          role: "Member of College Committee for Research and Publications",
          organization: "College of Natural and Applied Sciences, SUA",
          period: "2025 - Present"
        },
        {
          role: "Editorial Review Board Member",
          organization: "International Journal of Teacher Education and Professional Development, IGI Global",
          period: "2023 - Present",
          description: "Reviewing manuscripts in teacher education and professional development"
        },
        {
          role: "Online Global Social Justice in Education Course Leader",
          organization: "College of Education, Purdue University, United States",
          period: "2021 - 2022",
          description: "Led international collaboration on social justice in mathematics education"
        },
        {
          role: "Coordinator for Research and Publications",
          organization: "Department of Mathematics and Statistics, University of Dodoma",
          period: "2020 - 2022"
        },
        {
          role: "Acting Head of Department",
          organization: "Mathematics Department, University of Dodoma",
          period: "2013 - 2014"
        },
        {
          role: "Undergraduate Coordinator",
          organization: "School of Mathematical Sciences, University of Dodoma",
          period: "2012 - 2014"
        }
      ],
      
      faq: [
        {
          question: "What is your research focus?",
          answer: "My research focuses on mathematics education, particularly concept-rich instruction, teacher professional development, and innovative teaching methodologies that connect classroom mathematics to real-world applications."
        },
        {
          question: "Do you supervise postgraduate students?",
          answer: "Yes, I currently supervise PhD and Master's students in mathematics education, curriculum and instruction, and education foundation and management at Sokoine University of Agriculture."
        },
        {
          question: "How can I collaborate with you on research?",
          answer: "I welcome research collaborations in mathematics education, teacher training, and educational innovation. Please contact me via email to discuss potential research partnerships."
        },
        {
          question: "Do you offer consultancy services?",
          answer: "Yes, I provide consultancy services in curriculum development, mathematics education, teacher training, and educational research. I have experience editing mathematics textbooks for Tanzania Institute of Education."
        }
      ]
    };

    const updated = await prisma.profile.upsert({
      where: { id: 1 },
      update: profileData,
      create: { id: 1, ...profileData }
    });

    console.log('✅ Profile updated successfully!');
    console.log('Updated fields:', Object.keys(profileData).join(', '));
    console.log('\nProfile:', updated.fullName);
    console.log('Title:', updated.title);
    console.log('Institution:', updated.institution);
    
  } catch (error) {
    console.error('❌ Error updating profile:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

updateProfileFromCV();
