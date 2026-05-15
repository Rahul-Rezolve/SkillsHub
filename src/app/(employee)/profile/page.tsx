"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  User,
  MapPin,
  Mail,
  Award,
  Upload,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [employee, setEmployee] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    async function fetch_() {
      if (!session?.user.employeeId) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(
          `/api/profiles?id=${session.user.employeeId}`
        );
        const data = await res.json();
        if (!data.error) setEmployee(data);
      } catch {
      } finally {
        setLoading(false);
      }
    }
    if (session) fetch_();
  }, [session]);

  if (status === "loading" || loading) {
    return (
      <div className="mx-auto max-w-4xl p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-48" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!employee || !employee.skills?.length) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <Card>
          <CardContent className="p-12 text-center">
            <User className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-lg font-medium">No profile data yet</p>
            <p className="text-muted-foreground mt-1">
              Upload your resume to create your skills profile
            </p>
            <Link href="/upload">
              <Button className="mt-4 gap-2">
                <Upload className="h-4 w-4" />
                Upload Resume
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const skillsByCategory = employee.skills.reduce(
    (acc: any, es: any) => {
      const cat = es.skill.category;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(es);
      return acc;
    },
    {} as Record<string, any[]>
  );

  return (
    <div className="mx-auto max-w-4xl p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-muted-foreground mt-1">
          Your AI-extracted skills profile
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold flex-shrink-0">
              {employee.name
                .split(" ")
                .map((n: string) => n[0])
                .join("")
                .slice(0, 2)}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{employee.name}</h2>
              {employee.title && (
                <p className="text-muted-foreground">{employee.title}</p>
              )}
              <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Mail className="h-3.5 w-3.5" />
                  {employee.email}
                </span>
                {employee.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {employee.location}
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Skills ({employee.skills.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(skillsByCategory).map(([category, skills]: [string, any]) => (
            <div key={category}>
              <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                {category}
              </p>
              <div className="flex flex-wrap gap-2">
                {skills.map((es: any) => (
                  <div key={es.id} className="group relative">
                    <Badge
                      variant={
                        es.inferred
                          ? "inferred"
                          : es.proficiency === "EXPERT"
                            ? "expert"
                            : es.proficiency === "INTERMEDIATE"
                              ? "intermediate"
                              : "novice"
                      }
                    >
                      {es.inferred && <Sparkles className="h-3 w-3 mr-1" />}
                      {es.skill.name} ({es.yearsExp}y)
                    </Badge>
                    {es.inferred && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                        <div className="rounded-md bg-popover border px-3 py-2 text-xs shadow-md whitespace-nowrap">
                          Inferred ({Math.round(es.confidence * 100)}%
                          confidence)
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {employee.projects?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {employee.projects.map((project: any) => (
                <div
                  key={project.id}
                  className="relative border-l-2 border-primary/20 pl-4 pb-4 last:pb-0"
                >
                  <div className="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full bg-primary" />
                  <h4 className="font-medium">{project.name}</h4>
                  {project.role && (
                    <p className="text-sm text-muted-foreground">
                      {project.role}
                    </p>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {new Date(project.startDate).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                    {" - "}
                    {project.endDate
                      ? new Date(project.endDate).toLocaleDateString("en-US", {
                          month: "short",
                          year: "numeric",
                        })
                      : "Present"}
                  </span>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {project.techStack?.map((tech: string) => (
                      <Badge key={tech} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {employee.certifications?.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="h-5 w-5" />
              Certifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {employee.certifications.map((cert: any) => (
                <div key={cert.id}>
                  <p className="font-medium text-sm">{cert.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {cert.issuer}
                    {cert.date &&
                      ` | ${new Date(cert.date).toLocaleDateString()}`}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
