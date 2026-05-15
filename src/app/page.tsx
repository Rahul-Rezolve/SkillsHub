import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import {
  Brain,
  Search,
  FileText,
  Users,
  Sparkles,
  Shield,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    if (session.user.role === "HR") {
      redirect("/dashboard");
    }
    redirect("/profile");
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-3.5rem)]">
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-20 pb-24 sm:pt-28 sm:pb-32">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100 via-transparent to-transparent" />
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary shadow-lg">
            <Brain className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            AI-Powered{" "}
            <span className="text-blue-600">Skills Intelligence</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Upload resumes and let AI extract structured skill profiles.
            Search your talent pool with natural language.
            Make smarter staffing decisions, faster.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-8 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/signup"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border bg-white px-8 text-sm font-medium shadow-sm hover:bg-gray-50 transition-colors"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">
            Everything you need to manage talent
          </h2>
          <p className="mt-3 text-center text-muted-foreground">
            From resume parsing to intelligent search — all powered by AI
          </p>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<FileText className="h-6 w-6" />}
              title="Smart Resume Extraction"
              description="Upload a PDF and AI extracts skills, projects, certifications, and experience — structured and ready to use."
            />
            <FeatureCard
              icon={<Sparkles className="h-6 w-6" />}
              title="Skill Inference"
              description="AI infers related skills from a candidate's profile. React developer? Likely knows JavaScript, Node.js, and more."
            />
            <FeatureCard
              icon={<Search className="h-6 w-6" />}
              title="Semantic Search"
              description="Search with natural language like 'senior Python developer in Pune with cloud experience' and get ranked results."
            />
            <FeatureCard
              icon={<Users className="h-6 w-6" />}
              title="Talent Directory"
              description="Browse your entire talent pool with filters for skills, proficiency levels, and availability."
            />
            <FeatureCard
              icon={<Shield className="h-6 w-6" />}
              title="HR Review Queue"
              description="AI-extracted profiles go through an HR review before being committed — ensuring quality and accuracy."
            />
            <FeatureCard
              icon={<CheckCircle className="h-6 w-6" />}
              title="Role-Based Access"
              description="HR managers search and manage. Employees upload and view their own profiles. Clean separation of concerns."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-16">
        <div className="mx-auto max-w-2xl rounded-2xl bg-primary p-10 text-center text-primary-foreground shadow-lg">
          <h2 className="text-2xl font-bold sm:text-3xl">Ready to try it?</h2>
          <p className="mt-3 text-primary-foreground/80">
            Use the demo accounts to explore all features instantly.
          </p>
          <div className="mt-4 inline-block rounded-lg bg-white/10 px-4 py-2 text-sm font-mono">
            HR: hr@demo.com &nbsp;|&nbsp; Employee: dev@demo.com &nbsp;|&nbsp; Password: demo1234
          </div>
          <div className="mt-6">
            <Link
              href="/login"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-white px-8 text-sm font-medium text-primary shadow hover:bg-gray-100 transition-colors"
            >
              Sign In Now
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t px-4 py-6">
        <div className="mx-auto max-w-6xl flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            <span>SkillsHub</span>
          </div>
          <span>Built for Hackathon 2026</span>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
        {icon}
      </div>
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}
