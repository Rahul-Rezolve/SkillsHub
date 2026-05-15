"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import {
  CheckCircle,
  XCircle,
  Loader2,
  ClipboardCheck,
  User,
  Briefcase,
  Award,
} from "lucide-react";

interface ProfileDraft {
  id: string;
  employeeEmail: string | null;
  extractedJson: any;
  status: string;
  createdAt: string;
}

export default function ReviewQueuePage() {
  useSession();
  const { addToast } = useToast();
  const [drafts, setDrafts] = useState<ProfileDraft[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDraft, setSelectedDraft] = useState<ProfileDraft | null>(null);
  const [editedJson, setEditedJson] = useState<any>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchDrafts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchDrafts() {
    try {
      const res = await fetch("/api/review?status=PENDING");
      const data = await res.json();
      setDrafts(Array.isArray(data) ? data : []);
      if (data.length > 0 && !selectedDraft) {
        setSelectedDraft(data[0]);
        setEditedJson(data[0].extractedJson);
      }
    } catch {
      setDrafts([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleAction(action: "APPROVED" | "REJECTED") {
    if (!selectedDraft) return;
    setActionLoading(action);

    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          draftId: selectedDraft.id,
          action,
          editedJson: action === "APPROVED" ? editedJson : undefined,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      addToast({
        title: action === "APPROVED" ? "Profile Approved" : "Profile Rejected",
        description:
          action === "APPROVED"
            ? "Employee profile has been committed to the database."
            : "Draft has been rejected.",
        variant: action === "APPROVED" ? "success" : "default",
      });

      setDrafts((prev) => prev.filter((d) => d.id !== selectedDraft.id));
      setSelectedDraft(null);
      setEditedJson(null);
      fetchDrafts();
    } catch (error: any) {
      addToast({
        title: "Error",
        description: error.message || "Action failed",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  }

  function updateField(path: string, value: any) {
    setEditedJson((prev: any) => {
      const updated = { ...prev };
      const keys = path.split(".");
      let current = updated;
      for (let i = 0; i < keys.length - 1; i++) {
        if (Array.isArray(current[keys[i]])) {
          current[keys[i]] = [...current[keys[i]]];
        } else {
          current[keys[i]] = { ...current[keys[i]] };
        }
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return updated;
    });
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl p-6 space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 lg:grid-cols-2">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Review Queue</h1>
          <p className="text-muted-foreground mt-1">
            {drafts.length} pending profile{drafts.length !== 1 ? "s" : ""} to review
          </p>
        </div>
      </div>

      {drafts.length === 0 && !selectedDraft ? (
        <Card>
          <CardContent className="p-12 text-center">
            <ClipboardCheck className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-lg font-medium">No pending reviews</p>
            <p className="text-muted-foreground mt-1">
              Upload a resume to create a new profile draft
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-5">
          {/* Draft List */}
          <div className="lg:col-span-2 space-y-2">
            <p className="text-sm font-medium text-muted-foreground mb-2">
              Pending Drafts
            </p>
            {drafts.map((draft) => (
              <Card
                key={draft.id}
                className={`cursor-pointer transition-all ${
                  selectedDraft?.id === draft.id
                    ? "ring-2 ring-primary"
                    : "hover:shadow-md"
                }`}
                onClick={() => {
                  setSelectedDraft(draft);
                  setEditedJson(draft.extractedJson);
                }}
              >
                <CardContent className="p-4">
                  <p className="font-medium">
                    {draft.extractedJson?.name || "Unknown"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {draft.extractedJson?.email || draft.employeeEmail}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {draft.extractedJson?.skills?.length || 0} skills,{" "}
                    {draft.extractedJson?.projects?.length || 0} projects
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(draft.createdAt).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Detail View */}
          {selectedDraft && editedJson && (
            <div className="lg:col-span-3 space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Profile Details
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleAction("REJECTED")}
                        disabled={!!actionLoading}
                      >
                        {actionLoading === "REJECTED" ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-1" />
                        ) : (
                          <XCircle className="h-4 w-4 mr-1" />
                        )}
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleAction("APPROVED")}
                        disabled={!!actionLoading}
                      >
                        {actionLoading === "APPROVED" ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-1" />
                        ) : (
                          <CheckCircle className="h-4 w-4 mr-1" />
                        )}
                        Approve
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Basic Info */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">
                        Name
                      </label>
                      <Input
                        value={editedJson.name || ""}
                        onChange={(e) => updateField("name", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">
                        Email
                      </label>
                      <Input
                        value={editedJson.email || ""}
                        onChange={(e) => updateField("email", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">
                        Title
                      </label>
                      <Input
                        value={editedJson.title || ""}
                        onChange={(e) => updateField("title", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">
                        Location
                      </label>
                      <Input
                        value={editedJson.location || ""}
                        onChange={(e) => updateField("location", e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <h4 className="font-medium flex items-center gap-2 mb-3">
                      <Briefcase className="h-4 w-4" />
                      Skills ({editedJson.skills?.length || 0})
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {editedJson.skills?.map((skill: any, i: number) => (
                        <Badge
                          key={i}
                          variant={
                            skill.inferred
                              ? "inferred"
                              : skill.proficiency === "EXPERT"
                                ? "expert"
                                : skill.proficiency === "INTERMEDIATE"
                                  ? "intermediate"
                                  : "novice"
                          }
                          className="text-xs"
                        >
                          {skill.name} ({skill.proficiency}, {skill.yearsExp}y)
                          {skill.inferred && (
                            <span className="ml-1 opacity-70">
                              [{Math.round((skill.confidence || 0) * 100)}%]
                            </span>
                          )}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Projects */}
                  <div>
                    <h4 className="font-medium flex items-center gap-2 mb-3">
                      <Briefcase className="h-4 w-4" />
                      Projects ({editedJson.projects?.length || 0})
                    </h4>
                    <div className="space-y-3">
                      {editedJson.projects?.map((project: any, i: number) => (
                        <div
                          key={i}
                          className="rounded-lg border p-3 text-sm space-y-1"
                        >
                          <p className="font-medium">{project.name}</p>
                          <p className="text-muted-foreground">
                            {project.role} | {project.startDate} -{" "}
                            {project.endDate || "Present"}
                          </p>
                          {project.description && (
                            <p className="text-muted-foreground text-xs">
                              {project.description}
                            </p>
                          )}
                          <div className="flex flex-wrap gap-1 mt-1">
                            {project.techStack?.map((tech: string) => (
                              <Badge key={tech} variant="outline" className="text-xs">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Certifications */}
                  {editedJson.certifications?.length > 0 && (
                    <div>
                      <h4 className="font-medium flex items-center gap-2 mb-3">
                        <Award className="h-4 w-4" />
                        Certifications
                      </h4>
                      <div className="space-y-2">
                        {editedJson.certifications.map(
                          (cert: any, i: number) => (
                            <div key={i} className="text-sm">
                              <p className="font-medium">{cert.name}</p>
                              <p className="text-muted-foreground">
                                {cert.issuer}
                                {cert.date && ` | ${cert.date}`}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
