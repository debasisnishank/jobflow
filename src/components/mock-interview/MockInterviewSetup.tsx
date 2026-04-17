"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Loader2, Sparkles, Search } from "lucide-react";
import { JobResponse } from "@/models/job.model";
import { Resume } from "@/models/profile.model";
import { MockInterviewSession } from "@/models/interview.model";
import { createMockInterviewSession } from "@/actions/interviews.actions";
import { toast } from "@/components/ui/use-toast";
import { INTERVIEW_SCENARIOS, SCENARIO_CATEGORIES, getScenariosByCategory, InterviewScenario } from "@/lib/interview-scenarios";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface MockInterviewSetupProps {
  jobs: JobResponse[];
  resumes: Resume[];
  onSessionStart: (session: MockInterviewSession) => void;
}

export function MockInterviewSetup({
  jobs,
  resumes,
  onSessionStart,
}: MockInterviewSetupProps) {
  const [jobId, setJobId] = useState<string>("");
  const [resumeId, setResumeId] = useState<string>("");
  const [interviewType, setInterviewType] = useState<"technical" | "behavioral" | "mixed">("mixed");
  const [scenarioId, setScenarioId] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All Scenario");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [isCreating, setIsCreating] = useState(false);
  
  const filteredScenarios = INTERVIEW_SCENARIOS.filter((scenario) => {
    const matchesCategory = selectedCategory === "All Scenario" || scenario.category === selectedCategory;
    const matchesSearch = searchQuery === "" || 
      scenario.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      scenario.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  
  const selectedScenario = scenarioId ? INTERVIEW_SCENARIOS.find(s => s.id === scenarioId) : null;

  const handleStart = async () => {
    if (!resumeId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a resume",
      });
      return;
    }

    setIsCreating(true);
    try {
      const sessionTitle = title.trim() || 
        (jobId 
          ? jobs.find(j => j.id === jobId)?.JobTitle.label + " Interview"
          : "Mock Interview");

      const result = await createMockInterviewSession({
        jobId: jobId || undefined,
        resumeId: resumeId,
        title: sessionTitle,
        interviewType,
        scenarioId: scenarioId || undefined,
      });

      if (result.success && result.data) {
        onSessionStart(result.data);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.message || "Failed to create interview session",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create interview session",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const selectedJob = jobs.find(j => j.id === jobId);

  return (
    <div className="space-y-6">
      

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="resume-select">
            Select Resume <span className="text-red-500">*</span>
          </Label>
          <Select value={resumeId} onValueChange={setResumeId}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a resume" />
            </SelectTrigger>
            <SelectContent>
              {resumes
                .filter((resume) => resume.id)
                .map((resume) => (
                  <SelectItem key={resume.id} value={resume.id!}>
                    {resume.title}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            Your resume will be used to generate relevant interview questions
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="job-select">Select Job (Optional)</Label>
          <Select value={jobId || "none"} onValueChange={(value) => setJobId(value === "none" ? "" : value)}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a job application (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None - General Interview</SelectItem>
              {jobs
                .filter((job) => job.id)
                .map((job) => (
                  <SelectItem key={job.id} value={job.id!}>
                    {job.JobTitle?.label} at {job.Company?.label}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            Selecting a job will tailor questions to that specific role
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="interview-type">Interview Type</Label>
          <Select value={interviewType} onValueChange={(value: any) => setInterviewType(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="technical">Technical</SelectItem>
              <SelectItem value="behavioral">Behavioral</SelectItem>
              <SelectItem value="mixed">Mixed (Technical + Behavioral)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Practice Scenarios Section */}
        <div className="space-y-4 border-t pt-4">
          <div>
            <Label className="text-base font-semibold">Practice Scenarios</Label>
            <p className="text-sm text-muted-foreground mt-1">
              Explore real-world interview challenges, designed to help you sharpen your skills & build confidence.
            </p>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search scenarios..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2">
            {SCENARIO_CATEGORIES.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Scenario Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
            {filteredScenarios.map((scenario) => (
              <Card
                key={scenario.id}
                className={`cursor-pointer transition-all hover:border-primary ${
                  scenarioId === scenario.id ? "border-primary border-2" : ""
                }`}
                onClick={() => setScenarioId(scenario.id)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-sm font-semibold">{scenario.title}</CardTitle>
                    <span className="text-xs text-muted-foreground">{scenario.duration} Mins</span>
                  </div>
                  <CardDescription className="text-xs line-clamp-2">
                    {scenario.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">Session Title (Optional)</Label>
          <Input
            id="title"
            placeholder={selectedJob 
              ? `${selectedJob.JobTitle?.label} Interview`
              : "Mock Interview Session"}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <p className="text-sm text-muted-foreground">
            Leave empty to auto-generate from job title
          </p>
        </div>

        <Button
          onClick={handleStart}
          disabled={!resumeId || isCreating}
          className="w-full"
          size="lg"
        >
          {isCreating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Starting Interview...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Start Mock Interview
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

