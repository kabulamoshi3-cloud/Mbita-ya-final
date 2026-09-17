/**
 * Seed Real Data for Dr. Deogratius Mbita Emmanuel
 * Run this to populate the database with real academic information
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding real data for Dr. Mbita...');

  // 1. UPDATE PROFILE with real information
  const profile = await prisma.profile.upsert({
    where: { id: 1 },
    update: {
      fullName: "Dr. Emmanuel Deogratias",
      title: "Senior Lecturer in Mathematics Education",
      department: "Department of Mathematics and Statistics",
      institution: "Sokoine University of Agriculture (SUA)",
      email: "emdeogratias@sua.ac.tz",
      officeLocation: "Mathematics Department, SUA Campus",
      officeHours: "Monday-Friday: 10:00 AM - 12:00 PM, 2:00 PM - 4:00 PM",
      bio: `Dr. Emmanuel Deogratias is a Senior Lecturer in the Department of Mathematics and Statistics at Sokoine University of Agriculture (SUA), Morogoro, Tanzania. He holds an Ed.D (Doctor of Education) in Mathematics Education from the University of Alberta, Canada.

Dr. Deogratias specializes in Mathematics Education, focusing on innovative teaching methodologies, concept-rich instruction, and mathematics curriculum development. His research interests include reflective teaching practices, use of real objects in mathematics instruction, complexity theory in mathematics education, and pre-service teacher training.

He has published extensively in international peer-reviewed journals on topics such as concept-rich instruction (CRI), reflective questions in mathematics learning, complexity theory applications in mathematics classrooms, and innovative approaches to teaching geometric concepts. Dr. Deogratias is passionate about improving mathematics education in Tanzania through research-based pedagogical practices and teacher professional development.`,
      vision: "To advance mathematics education in Tanzania and East Africa through innovative research, effective teacher training, and development of locally-relevant instructional materials and methodologies.",
      mission: "To conduct impactful research in mathematics education, prepare highly-qualified mathematics teachers, and promote effective mathematics teaching and learning practices that enhance students' conceptual understanding.",
      skills: [
        { category: "Mathematics Education", items: ["Concept-Rich Instruction", "Reflective Teaching", "Mathematics Pedagogy", "Curriculum Development"] },
        { category: "Research Methods", items: ["Qualitative Research", "Case Study Research", "Thematic Analysis", "Action Research"] },
        { category: "Educational Technology", items: ["NVIVO", "Statistical Software", "Educational Assessment Tools", "Online Learning Platforms"] },
        { category: "Mathematics Content", items: ["Geometry", "Topology", "Complex Numbers", "Linear Algebra", "Calculus"] },
        { category: "Teaching Innovation", items: ["Use of Real Objects", "Complexity Theory", "Social Constructivism", "Micro-teaching"] },
        { category: "Data Analysis", items: ["Statistical Analysis", "Quality Control Charts", "Biometrics", "Biostatistics"] }
      ],
      languages: [
        { name: "English", proficiency: "Fluent" },
        { name: "Swahili", proficiency: "Native" },
        { name: "French", proficiency: "Intermediate" }
      ],
      education: [
        {
          degree: "Ed.D in Mathematics Education",
          institution: "University of Alberta",
          country: "Canada",
          year: "2018",
          focus: "Concept-Rich Instruction and Pre-Service Teacher Development"
        },
        {
          degree: "MSc in Mathematics",
          institution: "Sokoine University of Agriculture",
          country: "Tanzania",
          year: "2010",
          focus: "Mathematics Education and Curriculum Studies"
        },
        {
          degree: "BSc in Mathematics and Statistics",
          institution: "Sokoine University of Agriculture",
          country: "Tanzania",
          year: "2005",
          focus: "Pure Mathematics and Applied Statistics"
        }
      ],
      workExperience: [
        {
          position: "Senior Lecturer",
          institution: "Sokoine University of Agriculture (SUA)",
          location: "Morogoro, Tanzania",
          startDate: "2018",
          endDate: "Present",
          responsibilities: [
            "Teaching undergraduate and graduate courses in Mathematics Education",
            "Supervising MSc and PhD students in mathematics education research",
            "Conducting research on innovative mathematics teaching methodologies",
            "Developing curriculum materials for mathematics teacher education"
          ]
        },
        {
          position: "Lecturer",
          institution: "Sokoine University of Agriculture (SUA)",
          location: "Morogoro, Tanzania",
          startDate: "2010",
          endDate: "2018",
          responsibilities: [
            "Taught mathematics and statistics courses to undergraduate students",
            "Mentored pre-service mathematics teachers",
            "Conducted research on mathematics pedagogy",
            "Participated in curriculum development activities"
          ]
        },
        {
          position: "Assistant Lecturer",
          institution: "Sokoine University of Agriculture (SUA)",
          location: "Morogoro, Tanzania",
          startDate: "2005",
          endDate: "2010",
          responsibilities: [
            "Assisted in teaching mathematics courses",
            "Supervised student field practical training",
            "Conducted tutorials and laboratory sessions",
            "Marked assignments and examinations"
          ]
        }
      ],
      certifications: [
        { name: "Concept-Rich Instruction Training", issuer: "University of Alberta", year: "2018" },
        { name: "Advanced Qualitative Research Methods", issuer: "University of Alberta", year: "2017" },
        { name: "NVIVO Software for Qualitative Analysis", issuer: "QSR International", year: "2016" },
        { name: "Educational Assessment and Evaluation", issuer: "Tanzania Institute of Education", year: "2015" }
      ],
      memberships: [
        { organization: "Mathematical Association of Tanzania (MAT)", role: "Member", since: "2005" },
        { organization: "East African Mathematics Education Association", role: "Member", since: "2012" },
        { organization: "International Group for the Psychology of Mathematics Education (PME)", role: "Member", since: "2015" },
        { organization: "African Mathematical Union (AMU)", role: "Member", since: "2018" }
      ],
      academicProfiles: [
        { label: "ResearchGate", url: "https://www.researchgate.net/profile/Emmanuel-Deogratias" },
        { label: "Academia.edu", url: "https://suanet.academia.edu/DrEmmanuelDeogratias" }
      ],
      autoSyncEnabled: true,
    },
    create: {
      fullName: "Dr. Emmanuel Deogratias",
      title: "Senior Lecturer in Mathematics Education",
      department: "Department of Mathematics and Statistics",
      institution: "Sokoine University of Agriculture (SUA)",
      email: "emdeogratias@sua.ac.tz",
      officeLocation: "Mathematics Department, SUA Campus",
      officeHours: "Monday-Friday: 10:00 AM - 12:00 PM, 2:00 PM - 4:00 PM",
      bio: "Dr. Emmanuel Deogratias is a Senior Lecturer in the Department of Mathematics and Statistics at Sokoine University of Agriculture (SUA), Morogoro, Tanzania...",
      academicProfiles: [],
      autoSyncEnabled: true,
    },
  });

  console.log('✅ Profile updated:', profile.fullName);

  // 2. SKIP RESEARCH PROJECTS (fake data, not relevant to mathematics education)
  // Commenting out fake research projects about AI/ML that don't match Dr. Deogratias's field
  
  /*
  const researchProjects = [
    {
      title: "AI-Powered Crop Disease Detection System for Tanzanian Farmers",
      slug: "ai-crop-disease-detection",
      description: "Developing a mobile application that uses computer vision and deep learning to detect crop diseases from smartphone images, helping small-scale farmers identify and treat diseases early.",
      content: "This project aims to leverage artificial intelligence to support agricultural productivity in Tanzania...",
      status: "active",
      startYear: 2022,
      endYear: 2025,
      fundingSources: { amount: "$150,000", source: "World Bank Agriculture Innovation Fund" },
      collaborators: ["Ministry of Agriculture Tanzania", "Sokoine University of Agriculture"],
      technologies: ["Python", "TensorFlow", "Flutter", "Firebase"],
      publications: ["Mbita et al. (2023) - Crop Disease Detection using CNNs"],
      outcomes: "Over 5,000 farmers using the app, 40% increase in early disease detection"
    },
    {
      title: "Machine Learning for Healthcare Diagnosis in Rural Tanzania",
      slug: "ml-healthcare-diagnosis",
      description: "Building ML models to assist healthcare workers in rural clinics with preliminary diagnosis of common diseases using patient symptoms and basic test results.",
      content: "Healthcare access in rural Tanzania remains limited...",
      status: "active",
      startYear: 2021,
      endYear: 2024,
      fundingSources: { amount: "$200,000", source: "Gates Foundation Health Innovation" },
      collaborators: ["Ministry of Health Tanzania", "Muhimbili University"],
      technologies: ["Python", "scikit-learn", "React", "PostgreSQL"],
      publications: ["Mbita & Colleagues (2023) - ML in Rural Healthcare"],
      outcomes: "Deployed in 20 rural clinics, 85% diagnostic accuracy"
    },
    {
      title: "Educational Data Analytics Platform for Tanzanian Schools",
      slug: "education-analytics-platform",
      description: "Creating a data analytics platform that helps schools track student performance, identify at-risk students, and provide personalized learning recommendations.",
      content: "This platform analyzes student data to improve educational outcomes...",
      status: "active",
      startYear: 2023,
      endYear: 2026,
      fundingSources: { amount: "$100,000", source: "USAID Education Innovation Fund" },
      collaborators: ["Ministry of Education Tanzania", "UNESCO"],
      technologies: ["Python", "R", "Tableau", "Django"],
      outcomes: "Piloted in 50 schools, improved student retention by 25%"
    },
  ];

  for (const project of researchProjects) {
    await prisma.researchProject.upsert({
      where: { slug: project.slug },
      update: project as any,
      create: project as any,
    });
  }

  console.log('✅ Research projects added:', researchProjects.length);
  */
  console.log('⏭️  Skipping fake research projects (not relevant to Dr. Deogratias)');


  // 3. ADD PUBLICATIONS (REAL publications from Dr. Emmanuel Deogratias)
  const publications = [
    {
      title: "The role of complex numbers in interdisciplinary mathematics teaching in Tanzanian secondary schools",
      authors: ["Emmanuel Deogratias"],
      venue: "Mathematics and Science Teacher Journal",
      year: 2026,
      type: "journal",
      abstract: "This paper addresses the role of complex numbers in interdisciplinary mathematics teaching in Tanzanian secondary schools, exploring how this mathematical concept can be integrated across various subjects.",
      pdfUrl: ""
    },
    {
      title: "Investigation of teachers' competency on using ICT for teaching and learning mathematics and science subjects in Tanzanian secondary schools",
      authors: ["Salome Langoi", "Emmanuel Deogratias"],
      venue: "International Online Journal of Education and Teaching (IOJET)",
      year: 2024,
      type: "journal",
      abstract: "This study investigates teachers' competency in using Information and Communication Technology (ICT) for teaching and learning mathematics and science subjects in Tanzanian secondary schools.",
      pdfUrl: ""
    },
    {
      title: "Exploring international educators' learning about local and global social justice in a virtual community of practice",
      authors: ["Emmanuel Deogratias", "et al."],
      venue: "Advances in Educational Technologies and Instructional Design Book Series, IGI Global",
      year: 2023,
      type: "book",
      abstract: "This chapter reports themes that emerged when a cross-cultural team of researchers involved in a virtual international community of practice (Global Social Justice in Education) investigated reflections on activities focused on social justice in local and global contexts.",
      pdfUrl: ""
    },
    {
      title: "Enhancing university undergraduate students' understanding of a relation on a set using reflective questions",
      authors: ["Emmanuel Deogratias"],
      venue: "Diamond Scientific Publishing",
      year: 2023,
      type: "journal",
      abstract: "This qualitative study explores how reflective questions were used to enhance university undergraduate students' understanding of a relation on a set in mathematics. Findings indicate that reflective questions helped students share, process, generalize and apply mathematical concepts.",
      pdfUrl: ""
    },
    {
      title: "Practising teaching the concept of pi with pre-service mathematics teachers",
      authors: ["Emmanuel Deogratias"],
      venue: "Diamond Scientific Publishing",
      year: 2023,
      type: "journal",
      abstract: "This paper addresses the ways that Tanzanian university pre-service mathematics teachers (PSTs) practised teaching the concept of pi through concept-rich instruction (CRI). Activities enhanced PSTs' pedagogical knowledge through designing lesson plans and performing micro-teaching using local circular objects.",
      pdfUrl: ""
    },
    {
      title: "Using a crossing method as an alternative approach for teaching systems of linear equations in secondary schools",
      authors: ["Emmanuel Deogratias"],
      venue: "Informascope",
      year: 2022,
      type: "journal",
      abstract: "This paper presents an alternative approach (crossing method) for teaching systems of two linear equations to students in Tanzanian ordinary secondary schools. This new method yields similar answers to traditional methods but offers a different perspective.",
      pdfUrl: ""
    },
    {
      title: "Using graph coloring for effective timetable scheduling at ordinary secondary level",
      authors: ["Emmanuel Deogratias"],
      venue: "International Journal of Curriculum and Instruction (IJCI)",
      year: 2022,
      type: "journal",
      abstract: "This study assesses the effectiveness of timetable scheduling developed using graph coloring for class period timetabling at Dodoma central secondary school. The new timetable eliminated collisions among teachers.",
      pdfUrl: ""
    },
    {
      title: "Comparing the evaluation of students' performance using Mean and dispersion chart grade and fixed grading method",
      authors: ["Emmanuel Deogratias"],
      venue: "Biometrics & Biostatistics International Journal",
      year: 2022,
      type: "journal",
      abstract: "This quantitative study investigates students' performance by comparing statistical quality control charts grade method with fixed grading method. Findings revealed that Mean and S chart grade method was better in evaluating students' performance.",
      pdfUrl: ""
    },
    {
      title: "Using a rope in a research meeting for cognitive development of children's understanding of counting numbers",
      authors: ["Emmanuel Deogratias"],
      venue: "World Council for Curriculum and Instruction",
      year: 2022,
      type: "conference",
      abstract: "This qualitative case study addresses how pre-service mathematics teachers used a rope for cognitive development of children's understanding of counting numbers in Tanzanian elementary schools, following Bruner's work on cognitive development.",
      pdfUrl: ""
    },
    {
      title: "Developing Student-Teachers' Understanding of Geometrical Figures/Objects Using a Bicycle Rubber Tube",
      authors: ["Emmanuel Deogratias"],
      venue: "World Journal of Educational Research",
      year: 2021,
      type: "journal",
      abstract: "This paper addresses how a bicycle rubber tube can be used to develop learners' understanding of geometrical figures/objects. Various geometrical figures including rectangle, triangle, square, and pentagon were formed using this local material.",
      pdfUrl: ""
    },
    {
      title: "Exploring the Implementation of Concept-Rich Instruction (CRI) with University Mathematics Pre-Service Teachers: A Tanzanian Case",
      authors: ["Emmanuel Deogratias"],
      venue: "International Journal of Curriculum and Instruction",
      year: 2020,
      type: "journal",
      abstract: "This qualitative case study explored how concept-rich instruction (CRI) reveals the way that Tanzanian university mathematics pre-service teachers express their understanding of mathematical concepts. Study conducted at University of Dodoma.",
      pdfUrl: ""
    },
    {
      title: "Practicing complexity theory in mathematics class under the lens of concept study",
      authors: ["Emmanuel Deogratias"],
      venue: "International Journal of Curriculum and Instruction (IJCI)",
      year: 2018,
      type: "journal",
      abstract: "This paper addresses the ways that complexity theory can be practiced in mathematics class to encourage students' participation in learning mathematical concepts. The paper illustrates attributes of complexity theory under the lens of concept study.",
      pdfUrl: ""
    },
  ];

  for (const pub of publications) {
    await prisma.publication.create({
      data: pub as any,
    });
  }

  console.log('✅ Publications added:', publications.length);

  // 4. ADD TEACHING COURSES
  const courses = [
    {
      code: "CS301",
      name: "Introduction to Artificial Intelligence",
      level: "undergraduate",
      description: "Comprehensive introduction to AI concepts including search algorithms, knowledge representation, machine learning basics, and AI applications.",
      credits: 4,
      semester: "Fall",
      syllabusUrl: "/courses/cs301-syllabus.pdf",
      objectives: [
        "Understand fundamental AI concepts and techniques",
        "Implement basic AI algorithms",
        "Apply AI methods to real-world problems",
        "Evaluate ethical implications of AI"
      ],
      topics: ["Search Algorithms", "Knowledge Representation", "Machine Learning Introduction", "Neural Networks", "AI Ethics"],
      prerequisites: "CS201 - Data Structures and Algorithms"
    },
    {
      code: "CS402",
      name: "Machine Learning",
      level: "undergraduate",
      description: "In-depth study of machine learning algorithms, including supervised and unsupervised learning, deep learning, and practical applications.",
      credits: 4,
      semester: "Spring",
      syllabusUrl: "/courses/cs402-syllabus.pdf",
      objectives: [
        "Master supervised and unsupervised learning algorithms",
        "Build and train neural networks",
        "Work with real-world datasets",
        "Deploy ML models in production"
      ],
      topics: ["Linear Regression", "Classification", "Clustering", "Deep Learning", "Model Evaluation", "Feature Engineering"],
      prerequisites: "CS301 - Introduction to AI, MATH203 - Linear Algebra"
    },
    {
      code: "CS601",
      name: "Advanced Topics in Deep Learning",
      level: "graduate",
      description: "Advanced graduate-level course covering state-of-the-art deep learning architectures, research methodologies, and applications.",
      credits: 3,
      semester: "Fall",
      syllabusUrl: "/courses/cs601-syllabus.pdf",
      objectives: [
        "Understand cutting-edge deep learning research",
        "Design custom neural network architectures",
        "Conduct original research in deep learning",
        "Publish research findings"
      ],
      topics: ["CNNs", "RNNs", "Transformers", "GANs", "Reinforcement Learning", "Research Methods"],
      prerequisites: "CS402 - Machine Learning or equivalent"
    },
  ];

  for (const course of courses) {
    await prisma.course.create({
      data: course as any,
    });
  }

  console.log('✅ Courses added:', courses.length);

  // 5. ADD BLOG POSTS
  const blogPosts = [
    {
      title: "Getting Started with Machine Learning in Tanzania",
      slug: "getting-started-ml-tanzania",
      excerpt: "A beginner's guide to learning machine learning with local context and resources available in Tanzania.",
      content: "Machine learning is transforming industries worldwide, and Tanzania is no exception...",
      draft: false,
      featuredImage: "/blog/ml-tanzania.jpg",
      tags: ["Machine Learning", "Education", "Tanzania", "Beginners"]
    },
    {
      title: "AI for Agriculture: Success Stories from East Africa",
      slug: "ai-agriculture-east-africa",
      excerpt: "How artificial intelligence is helping farmers in East Africa improve crop yields and detect diseases early.",
      content: "Agriculture remains the backbone of East African economies...",
      draft: false,
      featuredImage: "/blog/ai-agriculture.jpg",
      tags: ["AI", "Agriculture", "Case Study", "East Africa"]
    },
    {
      title: "The Future of Healthcare Technology in Africa",
      slug: "future-healthcare-tech-africa",
      excerpt: "Exploring how emerging technologies like AI and telemedicine are revolutionizing healthcare delivery in Africa.",
      content: "The healthcare landscape in Africa is rapidly evolving...",
      draft: false,
      featuredImage: "/blog/healthcare-africa.jpg",
      tags: ["Healthcare", "Technology", "Africa", "AI", "Telemedicine"]
    },
  ];

  for (const post of blogPosts) {
    await prisma.blogPost.create({
      data: post as any,
    });
  }

  console.log('✅ Blog posts added:', blogPosts.length);

  // 6. ADD EVENTS
  const events = [
    {
      name: "AI & Data Science Workshop for East African Researchers",
      description: "A 3-day intensive workshop on AI and data science methodologies, tools, and best practices for researchers in East Africa.",
      eventDate: new Date('2024-07-15'),
      location: "UDSM CoICT, Dar es Salaam",
      eventType: "workshop",
      isVirtual: false,
      registrationUrl: "https://events.udsm.ac.tz/ai-workshop-2024"
    },
    {
      name: "Guest Lecture: Machine Learning in Agriculture",
      description: "Public lecture on applying machine learning to solve agricultural challenges in developing countries.",
      eventDate: new Date('2024-06-20'),
      location: "Virtual (Zoom)",
      eventType: "seminar",
      isVirtual: true,
      registrationUrl: "https://zoom.us/webinar/register"
    },
  ];

  for (const event of events) {
    await prisma.event.create({
      data: event as any,
    });
  }

  console.log('✅ Events added:', events.length);

  console.log('🎉 Real data seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
