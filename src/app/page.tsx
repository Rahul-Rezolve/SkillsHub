import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Image from "next/image";

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
        <div className="px-4 pb-10 sm:px-8 sm:pb-14">
          <div className="mx-auto max-w-xl rounded-2xl border border-white/40 bg-white/30 px-6 py-6 backdrop-blur-xl shadow-lg sm:px-8 sm:py-8">
            <h1 className="text-lg font-semibold tracking-tight text-slate-800 sm:text-xl">
              AI-Powered Skills Intelligence
            </h1>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed sm:text-sm">
              Upload resumes and let AI extract structured skill profiles.
              Search your talent pool with natural language.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
