"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Loader2, MapPin, Briefcase, Sparkles } from "lucide-react";
import Link from "next/link";

interface SearchResult {
  employee: {
    id: string;
    name: string;
    email: string;
    title: string | null;
    location: string | null;
    currentAllocation: string | null;
  };
  skills: {
    name: string;
    category: string;
    proficiency: string;
    yearsExp: number;
    inferred: boolean;
    confidence: number;
  }[];
  projects: any[];
  score: number;
  reasoning: string;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [filters, setFilters] = useState<any>(null);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResults(data.results || []);
      setFilters(data.filters || null);
    } catch (error: any) {
      console.error("Search failed:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  function getScoreColor(score: number) {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 60) return "bg-blue-500";
    if (score >= 40) return "bg-amber-500";
    return "bg-slate-400";
  }

  function getProficiencyVariant(p: string) {
    switch (p) {
      case "EXPERT": return "expert" as const;
      case "INTERMEDIATE": return "intermediate" as const;
      case "NOVICE": return "novice" as const;
      default: return "secondary" as const;
    }
  }

  const exampleQueries = [
    "React developer in Pune with 5+ years",
    "Available ML engineer with Python experience",
    "Java developer with payment gateway work",
    "Senior frontend developer on bench",
    "Full-stack mobile developer",
  ];

  return (
    <div className="mx-auto max-w-5xl p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Semantic Search</h1>
        <p className="text-muted-foreground mt-1">
          Find the right talent using natural language
        </p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., React developer in Pune with 5+ years experience"
            className="pl-10 h-12 text-base"
          />
        </div>
        <Button type="submit" size="lg" disabled={loading || !query.trim()}>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            "Search"
          )}
        </Button>
      </form>

      {!searched && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">Try these examples:</p>
          <div className="flex flex-wrap gap-2">
            {exampleQueries.map((eq) => (
              <Button
                key={eq}
                variant="outline"
                size="sm"
                onClick={() => {
                  setQuery(eq);
                }}
              >
                {eq}
              </Button>
            ))}
          </div>
        </div>
      )}

      {filters && (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-muted-foreground">Parsed filters:</span>
          {filters.requiredSkills?.map((s: string) => (
            <Badge key={s} variant="secondary">{s}</Badge>
          ))}
          {filters.minYears && (
            <Badge variant="outline">{filters.minYears}+ years</Badge>
          )}
          {filters.location && (
            <Badge variant="outline">{filters.location}</Badge>
          )}
          {filters.availability && (
            <Badge variant="outline">{filters.availability}</Badge>
          )}
        </div>
      )}

      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-64" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                  <Skeleton className="h-10 w-10 rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {searched && !loading && results.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Search className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-lg font-medium">No matching candidates found</p>
            <p className="text-muted-foreground mt-1">
              Try broadening your search criteria
            </p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {results.map((result, index) => (
          <Card key={result.employee.id} className="transition-shadow hover:shadow-md">
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">
                          {result.employee.name}
                        </h3>
                        <span className="text-xs text-muted-foreground">
                          #{index + 1}
                        </span>
                      </div>
                      {result.employee.title && (
                        <p className="text-sm text-muted-foreground">
                          {result.employee.title}
                        </p>
                      )}
                    </div>
                    <div
                      className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full text-white font-bold text-sm ${getScoreColor(result.score)}`}
                    >
                      {result.score}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    {result.employee.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5" />
                        {result.employee.location}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Briefcase className="h-3.5 w-3.5" />
                      {result.employee.currentAllocation || "Unallocated"}
                    </span>
                  </div>

                  <p className="text-sm italic text-muted-foreground border-l-2 border-primary/20 pl-3">
                    <Sparkles className="inline h-3.5 w-3.5 mr-1 text-primary" />
                    {result.reasoning}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {result.skills.slice(0, 10).map((skill) => (
                      <Badge
                        key={skill.name}
                        variant={
                          skill.inferred
                            ? "inferred"
                            : getProficiencyVariant(skill.proficiency)
                        }
                        className="text-xs"
                      >
                        {skill.name}
                        {skill.yearsExp > 0 && (
                          <span className="ml-1 opacity-70">
                            {skill.yearsExp}y
                          </span>
                        )}
                      </Badge>
                    ))}
                    {result.skills.length > 10 && (
                      <Badge variant="outline" className="text-xs">
                        +{result.skills.length - 10} more
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <Link href={`/employees/${result.employee.id}`}>
                  <Button variant="outline" size="sm">
                    View Profile
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
