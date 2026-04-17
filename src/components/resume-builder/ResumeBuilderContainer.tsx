"use client";

import { Card, CardContent } from "../ui/card";
import { ResumeBuilderHeader } from "./ResumeBuilderHeader";
import { ResumeBuilderList } from "./ResumeBuilderList";
import { useState } from "react";

export function ResumeBuilderContainer() {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleCreateResume = () => {
    setDialogOpen(true);
  };

  return (
    <Card className="border border-border/70 shadow-lg">
      <ResumeBuilderHeader onCreateResume={handleCreateResume} />
      <CardContent className="p-6">
        <ResumeBuilderList onCreateResume={handleCreateResume} dialogOpen={dialogOpen} setDialogOpen={setDialogOpen} />
      </CardContent>
    </Card>
  );
}

