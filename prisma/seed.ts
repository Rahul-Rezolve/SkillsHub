import { PrismaClient, SkillCategory, Proficiency, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clean existing data
  await prisma.employeeSkill.deleteMany();
  await prisma.certification.deleteMany();
  await prisma.project.deleteMany();
  await prisma.profileDraft.deleteMany();
  await prisma.user.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.skill.deleteMany();

  // Create skills
  const skillData: { name: string; category: SkillCategory }[] = [
    { name: "JavaScript", category: "LANGUAGE" },
    { name: "TypeScript", category: "LANGUAGE" },
    { name: "Python", category: "LANGUAGE" },
    { name: "Java", category: "LANGUAGE" },
    { name: "Go", category: "LANGUAGE" },
    { name: "Kotlin", category: "LANGUAGE" },
    { name: "Dart", category: "LANGUAGE" },
    { name: "SQL", category: "LANGUAGE" },
    { name: "HTML", category: "LANGUAGE" },
    { name: "CSS", category: "LANGUAGE" },
    { name: "Swift", category: "LANGUAGE" },
    { name: "C#", category: "LANGUAGE" },
    { name: "React", category: "FRAMEWORK" },
    { name: "Next.js", category: "FRAMEWORK" },
    { name: "Angular", category: "FRAMEWORK" },
    { name: "Vue.js", category: "FRAMEWORK" },
    { name: "Node.js", category: "FRAMEWORK" },
    { name: "Express.js", category: "FRAMEWORK" },
    { name: "Spring Boot", category: "FRAMEWORK" },
    { name: "Django", category: "FRAMEWORK" },
    { name: "Flask", category: "FRAMEWORK" },
    { name: "FastAPI", category: "FRAMEWORK" },
    { name: "Flutter", category: "FRAMEWORK" },
    { name: "React Native", category: "FRAMEWORK" },
    { name: "NestJS", category: "FRAMEWORK" },
    { name: "Tailwind CSS", category: "FRAMEWORK" },
    { name: "TensorFlow", category: "FRAMEWORK" },
    { name: "PyTorch", category: "FRAMEWORK" },
    { name: "Scikit-learn", category: "FRAMEWORK" },
    { name: "Pandas", category: "FRAMEWORK" },
    { name: "GraphQL", category: "FRAMEWORK" },
    { name: "AWS", category: "PLATFORM" },
    { name: "Azure", category: "PLATFORM" },
    { name: "Google Cloud", category: "PLATFORM" },
    { name: "Docker", category: "PLATFORM" },
    { name: "Kubernetes", category: "PLATFORM" },
    { name: "Firebase", category: "PLATFORM" },
    { name: "Android", category: "PLATFORM" },
    { name: "iOS", category: "PLATFORM" },
    { name: "Git", category: "TOOL" },
    { name: "Jenkins", category: "TOOL" },
    { name: "Redis", category: "TOOL" },
    { name: "PostgreSQL", category: "TOOL" },
    { name: "MongoDB", category: "TOOL" },
    { name: "Kafka", category: "TOOL" },
    { name: "Elasticsearch", category: "TOOL" },
    { name: "Terraform", category: "TOOL" },
    { name: "Grafana", category: "TOOL" },
    { name: "Machine Learning", category: "DOMAIN" },
    { name: "DevOps", category: "DOMAIN" },
    { name: "CI/CD", category: "DOMAIN" },
    { name: "Microservices", category: "DOMAIN" },
    { name: "REST API Design", category: "DOMAIN" },
    { name: "System Design", category: "DOMAIN" },
    { name: "Payment Gateway", category: "DOMAIN" },
    { name: "E-Commerce", category: "DOMAIN" },
    { name: "Real-time Systems", category: "DOMAIN" },
    { name: "WebSocket", category: "DOMAIN" },
    { name: "Mobile Development", category: "DOMAIN" },
    { name: "Cloud Architecture", category: "DOMAIN" },
    { name: "Database Design", category: "DOMAIN" },
    { name: "Security", category: "DOMAIN" },
    { name: "Natural Language Processing", category: "DOMAIN" },
    { name: "Computer Vision", category: "DOMAIN" },
    { name: "Agile/Scrum", category: "DOMAIN" },
  ];

  const skills: Record<string, string> = {};
  for (const s of skillData) {
    const created = await prisma.skill.create({ data: s });
    skills[s.name] = created.id;
  }

  const passwordHash = await bcrypt.hash("demo1234", 12);

  // ============ EMPLOYEE PROFILES ============

  // 1. Arjun Mehta — React + WebSocket lead
  const emp1 = await prisma.employee.create({
    data: {
      name: "Arjun Mehta",
      email: "arjun.mehta@company.com",
      title: "Senior Frontend Lead",
      location: "Bangalore",
      currentAllocation: "Project Phoenix",
      lastProjectEndDate: null,
    },
  });
  await createSkills(emp1.id, [
    { skill: "React", prof: "EXPERT", years: 7, inferred: false },
    { skill: "TypeScript", prof: "EXPERT", years: 5, inferred: false },
    { skill: "Next.js", prof: "EXPERT", years: 4, inferred: false },
    { skill: "WebSocket", prof: "EXPERT", years: 4, inferred: false },
    { skill: "Real-time Systems", prof: "EXPERT", years: 4, inferred: false },
    { skill: "JavaScript", prof: "EXPERT", years: 8, inferred: true, confidence: 0.95 },
    { skill: "Node.js", prof: "INTERMEDIATE", years: 3, inferred: true, confidence: 0.85 },
    { skill: "GraphQL", prof: "INTERMEDIATE", years: 3, inferred: false },
    { skill: "Tailwind CSS", prof: "EXPERT", years: 3, inferred: false },
    { skill: "Git", prof: "EXPERT", years: 7, inferred: true, confidence: 0.9 },
    { skill: "System Design", prof: "INTERMEDIATE", years: 3, inferred: false },
  ]);
  await createProjects(emp1.id, [
    {
      name: "Phoenix Real-time Dashboard",
      description: "Built a real-time analytics dashboard with live WebSocket feeds, handling 10k concurrent users",
      role: "Tech Lead",
      start: "2023-01-01",
      end: null,
      tech: ["React", "TypeScript", "WebSocket", "Next.js", "GraphQL"],
    },
    {
      name: "Customer Portal Redesign",
      description: "Led frontend modernization from Angular to React, improving load time by 60%",
      role: "Senior Developer",
      start: "2021-03-01",
      end: "2022-12-01",
      tech: ["React", "TypeScript", "Tailwind CSS", "REST API"],
    },
  ]);

  // 2. Priya Sharma — Java backend + Payment Gateway (Pune)
  const emp2 = await prisma.employee.create({
    data: {
      name: "Priya Sharma",
      email: "priya.sharma@company.com",
      title: "Senior Backend Engineer",
      location: "Pune",
      currentAllocation: "Project PayFlow",
    },
  });
  await createSkills(emp2.id, [
    { skill: "Java", prof: "EXPERT", years: 8, inferred: false },
    { skill: "Spring Boot", prof: "EXPERT", years: 6, inferred: false },
    { skill: "Payment Gateway", prof: "EXPERT", years: 5, inferred: false },
    { skill: "PostgreSQL", prof: "EXPERT", years: 7, inferred: false },
    { skill: "Microservices", prof: "EXPERT", years: 5, inferred: false },
    { skill: "Kafka", prof: "INTERMEDIATE", years: 3, inferred: false },
    { skill: "Docker", prof: "INTERMEDIATE", years: 4, inferred: false },
    { skill: "AWS", prof: "INTERMEDIATE", years: 3, inferred: false },
    { skill: "Redis", prof: "INTERMEDIATE", years: 3, inferred: true, confidence: 0.8 },
    { skill: "REST API Design", prof: "EXPERT", years: 6, inferred: true, confidence: 0.9 },
    { skill: "SQL", prof: "EXPERT", years: 8, inferred: true, confidence: 0.95 },
  ]);
  await createProjects(emp2.id, [
    {
      name: "PayFlow Integration Platform",
      description: "Designed and built payment processing microservices handling ₹50Cr monthly transactions",
      role: "Lead Backend Engineer",
      start: "2022-06-01",
      end: null,
      tech: ["Java", "Spring Boot", "Kafka", "PostgreSQL", "Razorpay", "Stripe"],
    },
    {
      name: "Merchant Onboarding System",
      description: "Built automated merchant verification and onboarding with KYC integration",
      role: "Senior Developer",
      start: "2020-01-01",
      end: "2022-05-01",
      tech: ["Java", "Spring Boot", "PostgreSQL", "AWS S3", "Redis"],
    },
    {
      name: "E-Commerce Backend",
      description: "Inventory management and order processing for retail platform",
      role: "Backend Developer",
      start: "2018-03-01",
      end: "2019-12-01",
      tech: ["Java", "MySQL", "REST API", "Docker"],
    },
  ]);
  await createCerts(emp2.id, [
    { name: "AWS Solutions Architect Associate", issuer: "Amazon Web Services", date: "2023-03-15" },
  ]);

  // 3. Kavitha Rajan — Senior Frontend, unallocated 3+ months
  const emp3 = await prisma.employee.create({
    data: {
      name: "Kavitha Rajan",
      email: "kavitha.rajan@company.com",
      title: "Senior Frontend Developer",
      location: "Hyderabad",
      currentAllocation: null,
      lastProjectEndDate: new Date("2026-01-15"),
    },
  });
  await createSkills(emp3.id, [
    { skill: "React", prof: "EXPERT", years: 6, inferred: false },
    { skill: "TypeScript", prof: "EXPERT", years: 5, inferred: false },
    { skill: "Angular", prof: "INTERMEDIATE", years: 3, inferred: false },
    { skill: "Vue.js", prof: "INTERMEDIATE", years: 2, inferred: false },
    { skill: "JavaScript", prof: "EXPERT", years: 8, inferred: false },
    { skill: "CSS", prof: "EXPERT", years: 8, inferred: false },
    { skill: "HTML", prof: "EXPERT", years: 8, inferred: true, confidence: 0.95 },
    { skill: "Next.js", prof: "INTERMEDIATE", years: 2, inferred: false },
    { skill: "Tailwind CSS", prof: "EXPERT", years: 3, inferred: false },
    { skill: "Node.js", prof: "NOVICE", years: 1, inferred: true, confidence: 0.7 },
    { skill: "Agile/Scrum", prof: "EXPERT", years: 5, inferred: true, confidence: 0.8 },
  ]);
  await createProjects(emp3.id, [
    {
      name: "Design System Library",
      description: "Created company-wide component library used by 8 product teams, 200+ components",
      role: "Lead Frontend Engineer",
      start: "2023-06-01",
      end: "2026-01-15",
      tech: ["React", "TypeScript", "Storybook", "Tailwind CSS"],
    },
    {
      name: "HR Portal",
      description: "Built internal HR management portal with leave tracking and performance reviews",
      role: "Senior Frontend Developer",
      start: "2021-01-01",
      end: "2023-05-01",
      tech: ["Angular", "TypeScript", "Material UI", "REST API"],
    },
  ]);

  // 4. Rahul Desai — Python/ML Engineer
  const emp4 = await prisma.employee.create({
    data: {
      name: "Rahul Desai",
      email: "rahul.desai@company.com",
      title: "ML Engineer",
      location: "Bangalore",
      currentAllocation: "Project Insight",
    },
  });
  await createSkills(emp4.id, [
    { skill: "Python", prof: "EXPERT", years: 6, inferred: false },
    { skill: "Machine Learning", prof: "EXPERT", years: 5, inferred: false },
    { skill: "TensorFlow", prof: "EXPERT", years: 4, inferred: false },
    { skill: "PyTorch", prof: "INTERMEDIATE", years: 2, inferred: false },
    { skill: "Scikit-learn", prof: "EXPERT", years: 5, inferred: false },
    { skill: "Pandas", prof: "EXPERT", years: 5, inferred: true, confidence: 0.95 },
    { skill: "Natural Language Processing", prof: "INTERMEDIATE", years: 3, inferred: false },
    { skill: "Computer Vision", prof: "INTERMEDIATE", years: 2, inferred: false },
    { skill: "Docker", prof: "INTERMEDIATE", years: 3, inferred: false },
    { skill: "AWS", prof: "INTERMEDIATE", years: 3, inferred: false },
    { skill: "SQL", prof: "INTERMEDIATE", years: 4, inferred: true, confidence: 0.85 },
    { skill: "FastAPI", prof: "INTERMEDIATE", years: 2, inferred: false },
  ]);
  await createProjects(emp4.id, [
    {
      name: "Insight NLP Pipeline",
      description: "Built document classification and entity extraction pipeline processing 100k docs/day",
      role: "ML Engineer",
      start: "2024-01-01",
      end: null,
      tech: ["Python", "TensorFlow", "FastAPI", "Docker", "AWS SageMaker"],
    },
    {
      name: "Fraud Detection Model",
      description: "Developed real-time fraud detection reducing false positives by 40%",
      role: "Data Scientist",
      start: "2022-03-01",
      end: "2023-12-01",
      tech: ["Python", "Scikit-learn", "XGBoost", "PostgreSQL", "Kafka"],
    },
  ]);
  await createCerts(emp4.id, [
    { name: "TensorFlow Developer Certificate", issuer: "Google", date: "2023-06-01" },
    { name: "AWS Machine Learning Specialty", issuer: "Amazon Web Services", date: "2024-01-15" },
  ]);

  // 5. Sneha Patil — Full-stack Mobile Dev
  const emp5 = await prisma.employee.create({
    data: {
      name: "Sneha Patil",
      email: "sneha.patil@company.com",
      title: "Full-stack Mobile Developer",
      location: "Pune",
      currentAllocation: null,
      lastProjectEndDate: new Date("2026-02-28"),
    },
  });
  await createSkills(emp5.id, [
    { skill: "Flutter", prof: "EXPERT", years: 4, inferred: false },
    { skill: "Dart", prof: "EXPERT", years: 4, inferred: false },
    { skill: "React Native", prof: "INTERMEDIATE", years: 2, inferred: false },
    { skill: "Node.js", prof: "INTERMEDIATE", years: 3, inferred: false },
    { skill: "TypeScript", prof: "INTERMEDIATE", years: 3, inferred: false },
    { skill: "Firebase", prof: "EXPERT", years: 4, inferred: false },
    { skill: "Android", prof: "INTERMEDIATE", years: 3, inferred: true, confidence: 0.85 },
    { skill: "iOS", prof: "INTERMEDIATE", years: 3, inferred: true, confidence: 0.85 },
    { skill: "Mobile Development", prof: "EXPERT", years: 5, inferred: false },
    { skill: "REST API Design", prof: "INTERMEDIATE", years: 3, inferred: false },
    { skill: "MongoDB", prof: "INTERMEDIATE", years: 2, inferred: false },
  ]);
  await createProjects(emp5.id, [
    {
      name: "HealthTrack Mobile App",
      description: "Built cross-platform health monitoring app with 50k+ downloads",
      role: "Lead Mobile Developer",
      start: "2024-01-01",
      end: "2026-02-28",
      tech: ["Flutter", "Dart", "Firebase", "Node.js", "MongoDB"],
    },
    {
      name: "Delivery Partner App",
      description: "Real-time delivery tracking app with route optimization",
      role: "Mobile Developer",
      start: "2022-06-01",
      end: "2023-12-01",
      tech: ["React Native", "TypeScript", "Google Maps API", "Node.js"],
    },
  ]);

  // 6. Vikram Singh — DevOps/Cloud Architect
  const emp6 = await prisma.employee.create({
    data: {
      name: "Vikram Singh",
      email: "vikram.singh@company.com",
      title: "Senior DevOps Engineer",
      location: "Remote",
      currentAllocation: "Platform Team",
    },
  });
  await createSkills(emp6.id, [
    { skill: "Kubernetes", prof: "EXPERT", years: 5, inferred: false },
    { skill: "Docker", prof: "EXPERT", years: 6, inferred: false },
    { skill: "AWS", prof: "EXPERT", years: 7, inferred: false },
    { skill: "Terraform", prof: "EXPERT", years: 4, inferred: false },
    { skill: "Jenkins", prof: "EXPERT", years: 5, inferred: false },
    { skill: "Go", prof: "INTERMEDIATE", years: 3, inferred: false },
    { skill: "Python", prof: "INTERMEDIATE", years: 4, inferred: false },
    { skill: "DevOps", prof: "EXPERT", years: 7, inferred: false },
    { skill: "CI/CD", prof: "EXPERT", years: 6, inferred: false },
    { skill: "Cloud Architecture", prof: "EXPERT", years: 5, inferred: false },
    { skill: "Grafana", prof: "INTERMEDIATE", years: 3, inferred: true, confidence: 0.8 },
    { skill: "Security", prof: "INTERMEDIATE", years: 3, inferred: false },
  ]);
  await createProjects(emp6.id, [
    {
      name: "Platform Migration to K8s",
      description: "Migrated 40+ microservices from EC2 to Kubernetes, reducing infra costs by 35%",
      role: "Lead DevOps Engineer",
      start: "2023-01-01",
      end: null,
      tech: ["Kubernetes", "Terraform", "AWS", "Docker", "Helm", "ArgoCD"],
    },
    {
      name: "CI/CD Pipeline Overhaul",
      description: "Rebuilt CI/CD from Jenkins to GitHub Actions, cutting build times from 45min to 8min",
      role: "DevOps Engineer",
      start: "2021-06-01",
      end: "2022-12-01",
      tech: ["Jenkins", "GitHub Actions", "Docker", "AWS", "Terraform"],
    },
  ]);
  await createCerts(emp6.id, [
    { name: "Certified Kubernetes Administrator (CKA)", issuer: "CNCF", date: "2023-08-01" },
    { name: "AWS Solutions Architect Professional", issuer: "Amazon Web Services", date: "2022-11-01" },
  ]);

  // 7. Meera Krishnan — Backend + Microservices
  const emp7 = await prisma.employee.create({
    data: {
      name: "Meera Krishnan",
      email: "meera.krishnan@company.com",
      title: "Backend Engineer",
      location: "Hyderabad",
      currentAllocation: "Project Atlas",
    },
  });
  await createSkills(emp7.id, [
    { skill: "Go", prof: "EXPERT", years: 4, inferred: false },
    { skill: "Python", prof: "INTERMEDIATE", years: 3, inferred: false },
    { skill: "Microservices", prof: "EXPERT", years: 5, inferred: false },
    { skill: "Kafka", prof: "INTERMEDIATE", years: 3, inferred: false },
    { skill: "PostgreSQL", prof: "EXPERT", years: 5, inferred: false },
    { skill: "Redis", prof: "INTERMEDIATE", years: 3, inferred: false },
    { skill: "Docker", prof: "INTERMEDIATE", years: 3, inferred: false },
    { skill: "REST API Design", prof: "EXPERT", years: 5, inferred: false },
    { skill: "System Design", prof: "INTERMEDIATE", years: 3, inferred: false },
    { skill: "Elasticsearch", prof: "INTERMEDIATE", years: 2, inferred: false },
    { skill: "Git", prof: "EXPERT", years: 5, inferred: true, confidence: 0.9 },
  ]);
  await createProjects(emp7.id, [
    {
      name: "Atlas Search Platform",
      description: "Built high-throughput search indexing service handling 1M+ queries/day",
      role: "Backend Engineer",
      start: "2024-03-01",
      end: null,
      tech: ["Go", "Elasticsearch", "Kafka", "PostgreSQL", "Docker"],
    },
    {
      name: "Notification Service",
      description: "Designed event-driven notification system supporting email, SMS, and push",
      role: "Backend Developer",
      start: "2022-01-01",
      end: "2024-02-01",
      tech: ["Go", "Kafka", "Redis", "PostgreSQL", "AWS SNS"],
    },
  ]);

  // 8. Amit Joshi — Junior Full-stack
  const emp8 = await prisma.employee.create({
    data: {
      name: "Amit Joshi",
      email: "amit.joshi@company.com",
      title: "Junior Full-stack Developer",
      location: "Pune",
      currentAllocation: null,
      lastProjectEndDate: new Date("2026-03-01"),
    },
  });
  await createSkills(emp8.id, [
    { skill: "JavaScript", prof: "INTERMEDIATE", years: 2, inferred: false },
    { skill: "React", prof: "INTERMEDIATE", years: 2, inferred: false },
    { skill: "Node.js", prof: "NOVICE", years: 1, inferred: false },
    { skill: "Express.js", prof: "NOVICE", years: 1, inferred: false },
    { skill: "MongoDB", prof: "NOVICE", years: 1, inferred: false },
    { skill: "HTML", prof: "INTERMEDIATE", years: 2, inferred: true, confidence: 0.9 },
    { skill: "CSS", prof: "INTERMEDIATE", years: 2, inferred: true, confidence: 0.9 },
    { skill: "Git", prof: "NOVICE", years: 1, inferred: true, confidence: 0.85 },
    { skill: "REST API Design", prof: "NOVICE", years: 1, inferred: true, confidence: 0.75 },
  ]);
  await createProjects(emp8.id, [
    {
      name: "Internal Task Manager",
      description: "Built MERN stack task management tool for internal teams",
      role: "Full-stack Developer",
      start: "2025-06-01",
      end: "2026-03-01",
      tech: ["React", "Node.js", "Express.js", "MongoDB"],
    },
  ]);

  // 9. Deepika Nair — Data Engineer
  const emp9 = await prisma.employee.create({
    data: {
      name: "Deepika Nair",
      email: "deepika.nair@company.com",
      title: "Senior Data Engineer",
      location: "Bangalore",
      currentAllocation: "Data Platform",
    },
  });
  await createSkills(emp9.id, [
    { skill: "Python", prof: "EXPERT", years: 7, inferred: false },
    { skill: "SQL", prof: "EXPERT", years: 8, inferred: false },
    { skill: "AWS", prof: "EXPERT", years: 5, inferred: false },
    { skill: "Kafka", prof: "EXPERT", years: 4, inferred: false },
    { skill: "PostgreSQL", prof: "EXPERT", years: 6, inferred: false },
    { skill: "Pandas", prof: "EXPERT", years: 5, inferred: true, confidence: 0.9 },
    { skill: "Docker", prof: "INTERMEDIATE", years: 3, inferred: false },
    { skill: "Terraform", prof: "INTERMEDIATE", years: 2, inferred: false },
    { skill: "Database Design", prof: "EXPERT", years: 6, inferred: false },
    { skill: "Elasticsearch", prof: "INTERMEDIATE", years: 3, inferred: false },
  ]);
  await createProjects(emp9.id, [
    {
      name: "Data Lake Architecture",
      description: "Designed enterprise data lake on AWS processing 5TB daily with real-time and batch pipelines",
      role: "Lead Data Engineer",
      start: "2023-06-01",
      end: null,
      tech: ["Python", "AWS Glue", "Kafka", "S3", "Redshift", "Terraform"],
    },
    {
      name: "ETL Modernization",
      description: "Migrated legacy ETL from stored procedures to Python-based pipelines",
      role: "Data Engineer",
      start: "2021-01-01",
      end: "2023-05-01",
      tech: ["Python", "PostgreSQL", "Airflow", "Docker"],
    },
  ]);
  await createCerts(emp9.id, [
    { name: "AWS Data Analytics Specialty", issuer: "Amazon Web Services", date: "2024-02-01" },
  ]);

  // 10. Sanjay Gupta — .NET / Azure
  const emp10 = await prisma.employee.create({
    data: {
      name: "Sanjay Gupta",
      email: "sanjay.gupta@company.com",
      title: "Senior Software Engineer",
      location: "Hyderabad",
      currentAllocation: null,
      lastProjectEndDate: new Date("2026-04-01"),
    },
  });
  await createSkills(emp10.id, [
    { skill: "C#", prof: "EXPERT", years: 10, inferred: false },
    { skill: "Azure", prof: "EXPERT", years: 6, inferred: false },
    { skill: "SQL", prof: "EXPERT", years: 10, inferred: false },
    { skill: "Microservices", prof: "INTERMEDIATE", years: 4, inferred: false },
    { skill: "Docker", prof: "INTERMEDIATE", years: 3, inferred: false },
    { skill: "Kubernetes", prof: "NOVICE", years: 1, inferred: false },
    { skill: "REST API Design", prof: "EXPERT", years: 7, inferred: true, confidence: 0.9 },
    { skill: "E-Commerce", prof: "INTERMEDIATE", years: 4, inferred: false },
    { skill: "System Design", prof: "EXPERT", years: 6, inferred: false },
    { skill: "Git", prof: "EXPERT", years: 8, inferred: true, confidence: 0.9 },
  ]);
  await createProjects(emp10.id, [
    {
      name: "Enterprise ERP System",
      description: "Built core modules for multi-tenant ERP handling 200+ enterprise clients",
      role: "Senior Developer",
      start: "2022-01-01",
      end: "2026-04-01",
      tech: ["C#", "ASP.NET", "Azure", "SQL Server", "Docker"],
    },
    {
      name: "B2B E-Commerce Platform",
      description: "Wholesale ordering platform with catalog management and pricing engine",
      role: "Lead Developer",
      start: "2019-06-01",
      end: "2021-12-01",
      tech: ["C#", "Azure Functions", "Cosmos DB", "Azure Service Bus"],
    },
  ]);

  // 11. Ananya Reddy — Frontend + Design Systems
  const emp11 = await prisma.employee.create({
    data: {
      name: "Ananya Reddy",
      email: "ananya.reddy@company.com",
      title: "UI/UX Developer",
      location: "Remote",
      currentAllocation: "Design System Team",
    },
  });
  await createSkills(emp11.id, [
    { skill: "React", prof: "EXPERT", years: 5, inferred: false },
    { skill: "TypeScript", prof: "INTERMEDIATE", years: 3, inferred: false },
    { skill: "CSS", prof: "EXPERT", years: 7, inferred: false },
    { skill: "HTML", prof: "EXPERT", years: 7, inferred: false },
    { skill: "Tailwind CSS", prof: "EXPERT", years: 3, inferred: false },
    { skill: "Next.js", prof: "INTERMEDIATE", years: 2, inferred: false },
    { skill: "JavaScript", prof: "EXPERT", years: 7, inferred: true, confidence: 0.95 },
    { skill: "Svelte", prof: "NOVICE", years: 1, inferred: false },
    { skill: "Vue.js", prof: "NOVICE", years: 1, inferred: false },
    { skill: "Agile/Scrum", prof: "INTERMEDIATE", years: 4, inferred: true, confidence: 0.8 },
  ]);
  await createProjects(emp11.id, [
    {
      name: "Unified Design System",
      description: "Built accessible component library with Storybook, adopted by all product teams",
      role: "UI/UX Developer",
      start: "2024-01-01",
      end: null,
      tech: ["React", "TypeScript", "Tailwind CSS", "Storybook", "Radix UI"],
    },
    {
      name: "Marketing Site Rebuild",
      description: "Complete redesign and rebuild of public-facing marketing website",
      role: "Frontend Developer",
      start: "2022-06-01",
      end: "2023-12-01",
      tech: ["Next.js", "React", "Tailwind CSS", "Vercel"],
    },
  ]);

  // 12. Karthik Iyer — Full-stack Java + Angular
  const emp12 = await prisma.employee.create({
    data: {
      name: "Karthik Iyer",
      email: "karthik.iyer@company.com",
      title: "Full-stack Developer",
      location: "Pune",
      currentAllocation: "Project Mercury",
    },
  });
  await createSkills(emp12.id, [
    { skill: "Java", prof: "EXPERT", years: 6, inferred: false },
    { skill: "Spring Boot", prof: "EXPERT", years: 5, inferred: false },
    { skill: "Angular", prof: "INTERMEDIATE", years: 4, inferred: false },
    { skill: "TypeScript", prof: "INTERMEDIATE", years: 4, inferred: false },
    { skill: "PostgreSQL", prof: "INTERMEDIATE", years: 4, inferred: false },
    { skill: "Docker", prof: "INTERMEDIATE", years: 3, inferred: false },
    { skill: "AWS", prof: "NOVICE", years: 2, inferred: false },
    { skill: "Jenkins", prof: "INTERMEDIATE", years: 3, inferred: true, confidence: 0.8 },
    { skill: "REST API Design", prof: "EXPERT", years: 5, inferred: true, confidence: 0.9 },
    { skill: "SQL", prof: "EXPERT", years: 6, inferred: true, confidence: 0.9 },
    { skill: "Agile/Scrum", prof: "INTERMEDIATE", years: 4, inferred: true, confidence: 0.8 },
  ]);
  await createProjects(emp12.id, [
    {
      name: "Mercury CRM Platform",
      description: "Full-stack CRM with customer analytics, pipeline management, and reporting",
      role: "Full-stack Developer",
      start: "2024-06-01",
      end: null,
      tech: ["Java", "Spring Boot", "Angular", "PostgreSQL", "Docker"],
    },
    {
      name: "Invoice Management System",
      description: "Automated invoicing with GST compliance and multi-currency support",
      role: "Backend Developer",
      start: "2022-01-01",
      end: "2024-05-01",
      tech: ["Java", "Spring Boot", "PostgreSQL", "REST API"],
    },
    {
      name: "Inventory Tracker",
      description: "Warehouse inventory tracking with barcode scanning integration",
      role: "Junior Developer",
      start: "2020-06-01",
      end: "2021-12-01",
      tech: ["Java", "Angular", "MySQL"],
    },
  ]);

  // Create demo users
  // dev@demo.com linked to Arjun Mehta
  await prisma.user.create({
    data: {
      email: "dev@demo.com",
      password: passwordHash,
      role: "EMPLOYEE",
      employeeId: emp1.id,
    },
  });

  await prisma.user.create({
    data: {
      email: "hr@demo.com",
      password: passwordHash,
      role: "HR",
    },
  });

  console.log("Seeded 12 employees, 2 demo users.");
}

async function createSkills(
  employeeId: string,
  items: {
    skill: string;
    prof: Proficiency;
    years: number;
    inferred: boolean;
    confidence?: number;
  }[]
) {
  for (const item of items) {
    const skill = await prisma.skill.findUnique({ where: { name: item.skill } });
    if (!skill) continue;
    await prisma.employeeSkill.create({
      data: {
        employeeId,
        skillId: skill.id,
        proficiency: item.prof,
        yearsExp: item.years,
        inferred: item.inferred,
        confidence: item.confidence ?? 1.0,
      },
    });
  }
}

async function createProjects(
  employeeId: string,
  items: {
    name: string;
    description: string;
    role: string;
    start: string;
    end: string | null;
    tech: string[];
  }[]
) {
  for (const item of items) {
    await prisma.project.create({
      data: {
        employeeId,
        name: item.name,
        description: item.description,
        role: item.role,
        startDate: new Date(item.start),
        endDate: item.end ? new Date(item.end) : null,
        techStack: item.tech,
      },
    });
  }
}

async function createCerts(
  employeeId: string,
  items: { name: string; issuer: string; date: string }[]
) {
  for (const item of items) {
    await prisma.certification.create({
      data: {
        employeeId,
        name: item.name,
        issuer: item.issuer,
        date: new Date(item.date),
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
