"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, MapPin, Briefcase, Search } from "lucide-react";
import Link from "next/link";

interface Employee {
  id: string;
  name: string;
  email: string;
  title: string | null;
  location: string | null;
  currentAllocation: string | null;
  skills: {
    skill: { name: string; category: string };
    proficiency: string;
    yearsExp: number;
    inferred: boolean;
  }[];
  _count: { projects: number };
}

export default function EmployeesPage() {
  useSession();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    async function fetch_() {
      try {
        const res = await fetch("/api/profiles");
        const data = await res.json();
        setEmployees(Array.isArray(data) ? data : []);
      } catch {
        setEmployees([]);
      } finally {
        setLoading(false);
      }
    }
    fetch_();
  }, []);

  const filtered = employees.filter(
    (e) =>
      e.name.toLowerCase().includes(filter.toLowerCase()) ||
      e.email.toLowerCase().includes(filter.toLowerCase()) ||
      e.skills.some((s) =>
        s.skill.name.toLowerCase().includes(filter.toLowerCase())
      )
  );

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-full max-w-md" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Employees</h1>
          <p className="text-muted-foreground mt-1">
            {employees.length} employee profiles
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter by name, email, or skill..."
            className="pl-10"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-lg font-medium">No employees found</p>
            <p className="text-muted-foreground mt-1">
              {filter
                ? "Try a different filter"
                : "Upload resumes to populate the directory"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((emp) => (
            <Link key={emp.id} href={`/employees/${emp.id}`}>
              <Card className="h-full cursor-pointer transition-shadow hover:shadow-md">
                <CardContent className="p-5 space-y-3">
                  <div>
                    <h3 className="font-semibold">{emp.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {emp.title || emp.email}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    {emp.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {emp.location}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Briefcase className="h-3 w-3" />
                      {emp.currentAllocation || "Unallocated"}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {emp.skills.slice(0, 6).map((s) => (
                      <Badge
                        key={s.skill.name}
                        variant={
                          s.inferred
                            ? "inferred"
                            : s.proficiency === "EXPERT"
                              ? "expert"
                              : s.proficiency === "INTERMEDIATE"
                                ? "intermediate"
                                : "novice"
                        }
                        className="text-xs"
                      >
                        {s.skill.name}
                      </Badge>
                    ))}
                    {emp.skills.length > 6 && (
                      <Badge variant="outline" className="text-xs">
                        +{emp.skills.length - 6}
                      </Badge>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground">
                    {emp._count.projects} project{emp._count.projects !== 1 ? "s" : ""}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
