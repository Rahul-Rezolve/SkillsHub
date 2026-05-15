"use client";

import { useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import {
  Upload,
  FileText,
  Loader2,
  CheckCircle,
  Brain,
  Sparkles,
  X,
} from "lucide-react";

export default function UploadPage() {
  useSession();
  const { addToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<any>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (selected && selected.type === "application/pdf") {
      setFile(selected);
      setResult(null);
    } else {
      addToast({
        title: "Invalid file",
        description: "Please select a PDF file",
        variant: "destructive",
      });
    }
  }

  async function handleUpload() {
    if (!file) return;
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("resume", file);

      const res = await fetch("/api/extract", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setResult(data);
      addToast({
        title: "Resume Processed",
        description: "Your profile has been extracted and sent for review.",
        variant: "success",
      });
    } catch (error: any) {
      addToast({
        title: "Extraction Failed",
        description: error.message || "Could not process the resume",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Upload Resume</h1>
        <p className="text-muted-foreground mt-1">
          Upload a PDF resume and AI will extract your skills profile
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div
            className={`relative rounded-lg border-2 border-dashed p-12 text-center transition-colors ${
              file
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-muted-foreground/50"
            }`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.stopPropagation();
              const dropped = e.dataTransfer.files?.[0];
              if (dropped && dropped.type === "application/pdf") {
                setFile(dropped);
                setResult(null);
              }
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
            />

            {file ? (
              <div className="space-y-2">
                <FileText className="mx-auto h-12 w-12 text-primary" />
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                    setResult(null);
                  }}
                >
                  <X className="h-4 w-4 mr-1" /> Remove
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground/50" />
                <p className="font-medium">
                  Drop your resume here or click to browse
                </p>
                <p className="text-sm text-muted-foreground">PDF files only</p>
              </div>
            )}
          </div>

          {file && !result && (
            <Button
              className="mt-4 w-full gap-2"
              size="lg"
              onClick={handleUpload}
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Extracting with AI...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4" />
                  Extract Profile
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>

      {uploading && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <div>
                <p className="font-medium">Processing resume...</p>
                <p className="text-sm text-muted-foreground">
                  Gemini AI is extracting skills, projects, and certifications
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-emerald-500" />
              Extraction Complete
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="rounded-md bg-muted p-3 text-sm">
              <p>
                Draft ID: <span className="font-mono">{result.draftId}</span>
              </p>
              <p>
                Status:{" "}
                <Badge variant="secondary">{result.status}</Badge>
              </p>
              <p className="text-muted-foreground mt-1">
                An HR admin will review and approve your profile.
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2">
                {result.profile.name} — {result.profile.title}
              </h4>
              <p className="text-sm text-muted-foreground">
                {result.profile.email}{" "}
                {result.profile.location && `| ${result.profile.location}`}
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2">
                Skills ({result.profile.skills?.length || 0})
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {result.profile.skills?.map((skill: any, i: number) => (
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
                    {skill.inferred && <Sparkles className="h-3 w-3 mr-1" />}
                    {skill.name} ({skill.proficiency}, {skill.yearsExp}y)
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">
                Projects ({result.profile.projects?.length || 0})
              </h4>
              <div className="space-y-2">
                {result.profile.projects?.map((p: any, i: number) => (
                  <div key={i} className="rounded border p-3 text-sm">
                    <p className="font-medium">{p.name}</p>
                    <p className="text-muted-foreground">
                      {p.role} | {p.startDate} - {p.endDate || "Present"}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {p.techStack?.map((t: string) => (
                        <Badge key={t} variant="outline" className="text-xs">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
