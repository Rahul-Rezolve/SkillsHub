"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  User,
  MapPin,
  Briefcase,
  Mail,
  Award,
  Calendar,
  ArrowLeft,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

interface EmployeeDetail {
  id: string;
  name: string;
  email: string;
  title: string | null;
  location: string | null;
  currentAllocation: string | null;
  lastProjectEndDate: string | null;
  skills: {
    id: string;
    proficiency: string;
    yearsExp: number;
    inferred: boolean;
    confidence: number;
    skill: { name: string; category: string };
  }[];
  projects: {
    id: string;
    name: string;
    description: string | null;
    role: string | null;
    startDate: string;
    endDate: string | null;
    techStack: string[];
  }[];
  certifications: {
    id: string;
    name: string;
    issuer: string | null;
    date: string | null;
  }[];
}

export default function EmployeeDetailPage() {
  const params = useParams();
  const [employee, setEmployee] = useState<EmployeeDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetch_() {
      try {
        const res = await fetch(`/api/profiles?id=${params.id}`);
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setEmployee(data);
      } catch {
        setEmployee(null);
      } finally {
        setLoading(false);
      }
    }
    fetch_();
  }, [params.id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl p-6 space-y-4">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-48" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <Card>
          <CardContent className="p-12 text-center">
            <User className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-lg font-medium">Employee not found</p>
            <Link href="/employees">
              <Button variant="outline" className="mt-4">
                Back to Employees
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const skillsByCategory = employee.skills.reduce(
    (acc, es) => {
      const cat = es.skill.category;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(es);
      return acc;
    },
    {} as Record<string, typeof employee.skills>
  );

  return (
    <div className="mx-auto max-w-4xl p-6 space-y-6">
      <Link href="/employees">
        <Button variant="ghost" size="sm" className="gap-1">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
      </Link>

      {/* Header Card */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold flex-shrink-0">
              {employee.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{employee.name}</h1>
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
                <span className="flex items-center gap-1">
                  <Briefcase className="h-3.5 w-3.5" />
                  {employee.currentAllocation || "Unallocated"}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Skills ({employee.skills.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(skillsByCategory).map(([category, skills]) => (
            <div key={category}>
              <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                {category}
              </p>
              <div className="flex flex-wrap gap-2">
                {skills.map((es) => (
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
                      className="cursor-default"
                    >
                      {es.inferred && (
                        <Sparkles className="h-3 w-3 mr-1" />
                      )}
                      {es.skill.name}
                      <span className="ml-1.5 opacity-70">
                        {es.proficiency.charAt(0) +
                          es.proficiency.slice(1).toLowerCase()}
                      </span>
                      {es.yearsExp > 0 && (
                        <span className="ml-1 opacity-60">
                          {es.yearsExp}y
                        </span>
                      )}
                    </Badge>
                    {es.inferred && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
                        <div className="rounded-md bg-popover border px-3 py-2 text-xs shadow-md whitespace-nowrap">
                          Inferred skill (
                          {Math.round(es.confidence * 100)}% confidence)
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

      {/* Projects Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Projects ({employee.projects.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {employee.projects.map((project) => (
              <div
                key={project.id}
                className="relative border-l-2 border-primary/20 pl-4 pb-4 last:pb-0"
              >
                <div className="absolute -left-[5px] top-1.5 h-2 w-2 rounded-full bg-primary" />
                <div className="space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-medium">{project.name}</h4>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                      <Calendar className="h-3 w-3" />
                      {new Date(project.startDate).toLocaleDateString(
                        "en-US",
                        { month: "short", year: "numeric" }
                      )}
                      {" - "}
                      {project.endDate
                        ? new Date(project.endDate).toLocaleDateString(
                            "en-US",
                            { month: "short", year: "numeric" }
                          )
                        : "Present"}
                    </span>
                  </div>
                  {project.role && (
                    <p className="text-sm text-muted-foreground">
                      {project.role}
                    </p>
                  )}
                  {project.description && (
                    <p className="text-sm text-muted-foreground">
                      {project.description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-1 mt-1">
                    {project.techStack.map((tech) => (
                      <Badge
                        key={tech}
                        variant="outline"
                        className="text-xs"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Certifications */}
      {employee.certifications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="h-5 w-5" />
              Certifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {employee.certifications.map((cert) => (
                <div key={cert.id} className="flex items-start gap-3">
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                    <Award className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{cert.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {cert.issuer}
                      {cert.date &&
                        ` | ${new Date(cert.date).toLocaleDateString()}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
