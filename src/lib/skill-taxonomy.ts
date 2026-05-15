export type SkillCategoryType =
  | "LANGUAGE"
  | "FRAMEWORK"
  | "PLATFORM"
  | "TOOL"
  | "DOMAIN";

export interface TaxonomySkill {
  name: string;
  category: SkillCategoryType;
}

export const SKILL_TAXONOMY: TaxonomySkill[] = [
  // Languages
  { name: "JavaScript", category: "LANGUAGE" },
  { name: "TypeScript", category: "LANGUAGE" },
  { name: "Python", category: "LANGUAGE" },
  { name: "Java", category: "LANGUAGE" },
  { name: "Go", category: "LANGUAGE" },
  { name: "Rust", category: "LANGUAGE" },
  { name: "C#", category: "LANGUAGE" },
  { name: "C++", category: "LANGUAGE" },
  { name: "Ruby", category: "LANGUAGE" },
  { name: "PHP", category: "LANGUAGE" },
  { name: "Swift", category: "LANGUAGE" },
  { name: "Kotlin", category: "LANGUAGE" },
  { name: "Dart", category: "LANGUAGE" },
  { name: "SQL", category: "LANGUAGE" },
  { name: "R", category: "LANGUAGE" },
  { name: "Scala", category: "LANGUAGE" },
  { name: "HTML", category: "LANGUAGE" },
  { name: "CSS", category: "LANGUAGE" },

  // Frameworks
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
  { name: "Ruby on Rails", category: "FRAMEWORK" },
  { name: "ASP.NET", category: "FRAMEWORK" },
  { name: "Flutter", category: "FRAMEWORK" },
  { name: "React Native", category: "FRAMEWORK" },
  { name: "Svelte", category: "FRAMEWORK" },
  { name: "NestJS", category: "FRAMEWORK" },
  { name: "Tailwind CSS", category: "FRAMEWORK" },
  { name: "Bootstrap", category: "FRAMEWORK" },
  { name: "TensorFlow", category: "FRAMEWORK" },
  { name: "PyTorch", category: "FRAMEWORK" },
  { name: "Scikit-learn", category: "FRAMEWORK" },
  { name: "Pandas", category: "FRAMEWORK" },
  { name: "GraphQL", category: "FRAMEWORK" },

  // Platforms
  { name: "AWS", category: "PLATFORM" },
  { name: "Azure", category: "PLATFORM" },
  { name: "Google Cloud", category: "PLATFORM" },
  { name: "Docker", category: "PLATFORM" },
  { name: "Kubernetes", category: "PLATFORM" },
  { name: "Linux", category: "PLATFORM" },
  { name: "Firebase", category: "PLATFORM" },
  { name: "Vercel", category: "PLATFORM" },
  { name: "Heroku", category: "PLATFORM" },
  { name: "Netlify", category: "PLATFORM" },
  { name: "Android", category: "PLATFORM" },
  { name: "iOS", category: "PLATFORM" },

  // Tools
  { name: "Git", category: "TOOL" },
  { name: "GitHub", category: "TOOL" },
  { name: "Jenkins", category: "TOOL" },
  { name: "CircleCI", category: "TOOL" },
  { name: "Terraform", category: "TOOL" },
  { name: "Ansible", category: "TOOL" },
  { name: "Jira", category: "TOOL" },
  { name: "Figma", category: "TOOL" },
  { name: "Webpack", category: "TOOL" },
  { name: "Redis", category: "TOOL" },
  { name: "PostgreSQL", category: "TOOL" },
  { name: "MongoDB", category: "TOOL" },
  { name: "MySQL", category: "TOOL" },
  { name: "Elasticsearch", category: "TOOL" },
  { name: "RabbitMQ", category: "TOOL" },
  { name: "Kafka", category: "TOOL" },
  { name: "Nginx", category: "TOOL" },
  { name: "Prometheus", category: "TOOL" },
  { name: "Grafana", category: "TOOL" },

  // Domains
  { name: "Machine Learning", category: "DOMAIN" },
  { name: "Data Engineering", category: "DOMAIN" },
  { name: "DevOps", category: "DOMAIN" },
  { name: "CI/CD", category: "DOMAIN" },
  { name: "Microservices", category: "DOMAIN" },
  { name: "REST API Design", category: "DOMAIN" },
  { name: "System Design", category: "DOMAIN" },
  { name: "Agile/Scrum", category: "DOMAIN" },
  { name: "Payment Gateway", category: "DOMAIN" },
  { name: "E-Commerce", category: "DOMAIN" },
  { name: "Real-time Systems", category: "DOMAIN" },
  { name: "WebSocket", category: "DOMAIN" },
  { name: "Mobile Development", category: "DOMAIN" },
  { name: "Cloud Architecture", category: "DOMAIN" },
  { name: "Database Design", category: "DOMAIN" },
  { name: "Security", category: "DOMAIN" },
  { name: "Performance Optimization", category: "DOMAIN" },
  { name: "Natural Language Processing", category: "DOMAIN" },
  { name: "Computer Vision", category: "DOMAIN" },
];

export const SKILL_MAP = new Map(
  SKILL_TAXONOMY.map((s) => [s.name.toLowerCase(), s])
);

export function findSkill(name: string): TaxonomySkill | undefined {
  return SKILL_MAP.get(name.toLowerCase());
}

export function getSkillsByCategory(
  category: SkillCategoryType
): TaxonomySkill[] {
  return SKILL_TAXONOMY.filter((s) => s.category === category);
}
