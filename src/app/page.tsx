import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

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
      <Image
        src="/hero-bg.jpg"
        alt=""
        fill
        priority
        className="object-cover object-center"
      />

      <div className="relative z-10 flex flex-col min-h-[calc(100vh-3.5rem)] justify-end">
        <div className="px-4 pb-6 sm:px-6 sm:pb-8">
          <div className="mx-auto max-w-4xl rounded-xl border border-white/40 bg-white/30 px-8 py-8 backdrop-blur-xl shadow-lg text-center sm:px-10 sm:py-10">
            <h1 className="text-lg font-bold tracking-tight text-slate-800 sm:text-xl">
              AI-Powered Skills Intelligence
            </h1>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed sm:text-sm">
              Upload resumes and let AI extract structured skill profiles. Search your talent pool with natural language.
            </p>
            <Link
              href="/login"
              className="mt-5 inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-slate-800 px-5 text-xs font-medium text-white shadow hover:bg-slate-700 transition-colors"
            >
              Get Started
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
