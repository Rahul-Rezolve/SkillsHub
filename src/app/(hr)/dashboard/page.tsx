"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Search, ClipboardCheck, Upload, Brain, TrendingUp } from "lucide-react";
import Link from "next/link";

interface Stats {
  totalEmployees: number;
  pendingReviews: number;
  totalSkills: number;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [employeesRes, reviewsRes] = await Promise.all([
          fetch("/api/profiles"),
          fetch("/api/review?status=PENDING"),
        ]);
        const employees = await employeesRes.json();
        const reviews = await reviewsRes.json();

        setStats({
          totalEmployees: Array.isArray(employees) ? employees.length : 0,
          pendingReviews: Array.isArray(reviews) ? reviews.length : 0,
          totalSkills: Array.isArray(employees)
            ? new Set(
                employees.flatMap((e: any) =>
                  e.skills?.map((s: any) => s.skill?.name) || []
                )
              ).size
            : 0,
        });
      } catch {
        setStats({ totalEmployees: 0, pendingReviews: 0, totalSkills: 0 });
      } finally {
        setLoading(false);
      }
    }

    if (session?.user.role === "HR") {
      fetchStats();
    }
  }, [session]);

  if (status === "loading" || !session) {
    return (
      <div className="mx-auto max-w-7xl p-6 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back, {session.user.name}
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-none border-0 stat-card-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <Skeleton className="h-8 w-16" /> : stats?.totalEmployees}
            </div>
            <p className="text-xs text-muted-foreground">Profiles in the system</p>
          </CardContent>
        </Card>

        <Card className="shadow-none border-0 stat-card-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <Skeleton className="h-8 w-16" /> : stats?.pendingReviews}
            </div>
            <p className="text-xs text-muted-foreground">Extracted profiles awaiting review</p>
          </CardContent>
        </Card>

        <Card className="shadow-none border-0 stat-card-border">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Unique Skills</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <Skeleton className="h-8 w-16" /> : stats?.totalSkills}
            </div>
            <p className="text-xs text-muted-foreground">Skills across all employees</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Link href="/search">
          <Card className="cursor-pointer transition-shadow hover:shadow-md">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Search className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base text-[#0485DA]">Semantic Search</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Find talent with natural language
                  </p>
                </div>
              </div>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/review-queue">
          <Card className="cursor-pointer transition-shadow hover:shadow-md">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <ClipboardCheck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base text-[#0485DA]">Review Queue</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Review AI-extracted profiles
                  </p>
                </div>
              </div>
            </CardHeader>
          </Card>
        </Link>

        <Link href="/upload">
          <Card className="cursor-pointer transition-shadow hover:shadow-md">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-primary/10 p-2">
                  <Upload className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base text-[#0485DA]">Upload Resume</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Extract skills from a PDF
                  </p>
                </div>
              </div>
            </CardHeader>
          </Card>
        </Link>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-4">
          <Brain className="h-5 w-5 text-primary" />
          <h2 className="font-semibold leading-none tracking-tight">How SkillsHub Works</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-3 text-sm">
          <div className="space-y-1">
            <p className="font-medium">1. Upload Resumes</p>
            <p className="text-muted-foreground">
              Upload PDF resumes and AI extracts structured skill profiles with inferred related skills.
            </p>
          </div>
          <div className="space-y-1">
            <p className="font-medium">2. Review & Approve</p>
            <p className="text-muted-foreground">
              HR reviews extracted profiles, edits if needed, and approves to commit to the employee database.
            </p>
          </div>
          <div className="space-y-1">
            <p className="font-medium">3. Smart Search</p>
            <p className="text-muted-foreground">
              Search for talent using natural language. AI understands context and ranks candidates with explanations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
