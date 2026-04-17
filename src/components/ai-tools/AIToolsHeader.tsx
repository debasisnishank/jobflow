"use client";

import { CardHeader, CardTitle } from "../ui/card";

export function AIToolsHeader() {
  return (
    <CardHeader className="border-b border-border/50 bg-gradient-to-r from-background to-muted/20 pb-4">
      <div>
        <CardTitle className="text-2xl font-bold tracking-tight">
          AI Tools
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Enhance your resume and job applications with AI-powered tools
        </p>
      </div>
    </CardHeader>
  );
}



