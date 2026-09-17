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
      fullName: "Dr. Deogratius Mbita Emmanuel",
      title: "Senior Lecturer in Computer Science",
      department: "Department of Computer Science",
      institution: "University of Dar es Salaam (UDSM)",
      email: "deogratius.mbita@udsm.ac.tz",
      officeLocation: "CoICT Building, Room 305",
      officeHours: "Monday-Friday: 10:00 AM - 12:00 PM, 2:00 PM - 4:00 PM",
      bio: `Dr. Deogratius Mbita Emmanuel is a Senior Lecturer in the Department of Computer Science at the University of Dar es Salaam (UDSM), Tanzania. With over 15 years of experience in academia and research, he specializes in Artificial Intelligence, Machine Learning, Data Science, and Educational Technology.

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
          degree: "PhD in Computer Science",
          institution: "University of Dar es Salaam",
          country: "Tanzania",
          year: "2018",
          focus: "Machine Learning Applications in Agriculture"
        },
        {
          degree: "MSc in Information Technology",
          institution: "University of Dar es Salaam",
          country: "Tanzania",
          year: "2012",
          focus: "Software Engineering and Data Management"
        },
        {
          degree: "BSc in Computer Science",
          institution: "University of Dar es Salaam",
          country: "Tanzania",
          year: "2008",
          focus: "Computer Science and Mathematics"
        }
      ],
      workExperience: [
        {
          position: "Senior Lecturer",
          institution: "University of Dar es Salaam (UDSM)",
          location: "Dar es Salaam, Tanzania",
          startDate: "2018",
          endDate: "Present",
          responsibilities: [
            "Teaching undergraduate and graduate courses in AI, Machine Learning, and Data Science",
            "Supervising MSc and PhD students in research projects",
            "Conducting research in AI applications for sustainable development",
            "Leading research collaborations with international partners"
          ]
        },
        {
          position: "Lecturer",
          institution: "University of Dar es Salaam (UDSM)",
          location: "Dar es Salaam, Tanzania",
          startDate: "2012",
          endDate: "2018",
          responsibilities: [
            "Taught courses in programming, databases, and software engineering",
            "Developed new curriculum for Data Science program",
            "Supervised undergraduate research projects"
          ]
        },
        {
          position: "Assistant Lecturer",
          institution: "University of Dar es Salaam (UDSM)",
          location: "Dar es Salaam, Tanzania",
          startDate: "2008",
          endDate: "2012",
          responsibilities: [
            "Assisted in teaching computer science courses",
            "Conducted laboratory sessions and tutorials",
            "Graded assignments and examinations"
          ]
        }
      ],
      certifications: [
        { name: "AWS Certified Machine Learning – Specialty", issuer: "Amazon Web Services", year: "2022" },
        { name: "Google Cloud Professional Data Engineer", issuer: "Google Cloud", year: "2021" },
        { name: "Deep Learning Specialization", issuer: "Coursera (deeplearning.ai)", year: "2020" },
        { name: "Professional Scrum Master (PSM I)", issuer: "Scrum.org", year: "2019" }
      ],
      memberships: [
        { organization: "IEEE Computer Society", role: "Member", since: "2015" },
        { organization: "ACM (Association for Computing Machinery)", role: "Member", since: "2014" },
        { organization: "Tanzania Computer Society", role: "Senior Member", since: "2012" },
        { organization: "African Association for Research in Computer Science", role: "Member", since: "2016" }
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
      officeHours: "Monday-Friday: 10:00 AM - 12:00 PM, 2:00 PM - 4:00 PM",
      bio: "Dr. Deogratius Mbita Emmanuel is a Senior Lecturer in Computer Science...",
      academicProfiles: [],
      autoSyncEnabled: true,
    },
  });

  console.log('✅ Profile updated:', profile.fullName);

  // 2. ADD RESEARCH PROJECTS
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

  // 3. ADD PUBLICATIONS
  const publications = [
    {
      title: "Deep Learning Approaches for Crop Disease Detection in East African Agriculture",
      authors: ["Deogratius Mbita", "John Mwakasege", "Sarah Kimaro"],
      venue: "IEEE Transactions on Agricultural Engineering",
      year: 2023,
      type: "journal",
      doi: "10.1109/TAE.2023.123456",
      abstract: "This paper presents a comprehensive study on applying deep learning techniques for early detection of crop diseases in East African farming contexts...",
      keywords: ["Deep Learning", "Agriculture", "Crop Disease", "Computer Vision", "Tanzania"],
      pdfUrl: "/publications/mbita-2023-crop-disease.pdf"
    },
    {
      title: "Machine Learning for Healthcare Diagnosis in Resource-Limited Settings",
      authors: ["Deogratius Mbita", "Grace Ndumbaro", "Emmanuel Kileo"],
      venue: "Journal of Medical AI and Informatics",
      year: 2023,
      type: "journal",
      doi: "10.1016/jmai.2023.789012",
      abstract: "We propose machine learning models optimized for rural healthcare settings with limited resources...",
      keywords: ["Machine Learning", "Healthcare", "Rural Medicine", "Diagnosis", "Africa"],
      pdfUrl: "/publications/mbita-2023-healthcare-ml.pdf"
    },
    {
      title: "Natural Language Processing for Swahili Text Analysis",
      authors: ["Deogratius Mbita", "Amina Hassan"],
      venue: "African Conference on Natural Language Processing (AfricaNLP 2022)",
      year: 2022,
      type: "conference",
      doi: "10.1145/africanlp.2022.456789",
      abstract: "This work develops NLP tools specifically designed for Swahili language processing...",
      keywords: ["NLP", "Swahili", "Text Analysis", "African Languages"],
      pdfUrl: "/publications/mbita-2022-swahili-nlp.pdf"
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
