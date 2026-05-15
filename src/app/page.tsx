import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";
import Image from "next/image";
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
    <div className="relative min-h-[calc(100vh-3.5rem)]">
      {/* Background image */}
      <Image
        src="/hero-bg.jpg"
        alt=""
        fill
        priority
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-slate-900/10" />

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-[calc(100vh-3.5rem)]">
        {/* Hero */}
        <section className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto mb-8 inline-flex items-center justify-center rounded-2xl bg-white/20 p-4 backdrop-blur-md shadow-lg ring-1 ring-white/30">
              <Brain className="h-7 w-7 text-slate-700" />
            </div>

            {/* Glass hero card */}
            <div className="rounded-2xl border border-white/40 bg-white/30 px-8 py-10 backdrop-blur-xl shadow-xl">
              <h1 className="text-2xl font-semibold tracking-tight text-slate-800 sm:text-3xl">
                AI-Powered Skills Intelligence
              </h1>
              <p className="mt-3 text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
                Upload resumes and let AI extract structured skill profiles.
                Search your talent pool with natural language.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/login"
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-slate-800 px-6 text-xs font-medium text-white shadow hover:bg-slate-700 transition-colors"
                >
                  Get Started
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-white/50 bg-white/40 px-6 text-xs font-medium text-slate-700 backdrop-blur-sm hover:bg-white/60 transition-colors"
                >
                  Create Account
                </Link>
              </div>
            </div>

            {/* Feature pills */}
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <FeaturePill
                icon={<FileText className="h-3.5 w-3.5" />}
                title="Resume Extraction"
                description="AI parses PDFs into structured profiles"
              />
              <FeaturePill
                icon={<Sparkles className="h-3.5 w-3.5" />}
                title="Skill Inference"
                description="Automatically discovers related skills"
              />
              <FeaturePill
                icon={<Search className="h-3.5 w-3.5" />}
                title="Semantic Search"
                description="Natural language talent queries"
              />
              <FeaturePill
                icon={<Users className="h-3.5 w-3.5" />}
                title="Talent Directory"
                description="Browse and filter your talent pool"
              />
              <FeaturePill
                icon={<Shield className="h-3.5 w-3.5" />}
                title="HR Review Queue"
                description="Quality-checked before committing"
              />
              <FeaturePill
                icon={<CheckCircle className="h-3.5 w-3.5" />}
                title="Role-Based Access"
                description="Separate HR and employee views"
              />
            </div>

            {/* Demo credentials */}
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/25 px-4 py-2 backdrop-blur-md">
              <span className="text-[11px] text-slate-500">Demo:</span>
              <span className="text-[11px] font-mono text-slate-600">
                hr@demo.com / demo1234
              </span>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/30 bg-white/20 backdrop-blur-sm px-4 py-4">
          <div className="mx-auto max-w-6xl flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <Brain className="h-3.5 w-3.5" />
              <span>SkillsHub</span>
            </div>
            <span>Hackathon 2026</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

function FeaturePill({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-white/40 bg-white/30 px-4 py-3 backdrop-blur-md text-left">
      <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-white/50 text-slate-600">
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium text-slate-700">{title}</p>
        <p className="text-[11px] text-slate-500 leading-snug">{description}</p>
      </div>
    </div>
  );
}
