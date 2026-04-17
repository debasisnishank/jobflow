"use client";

import { Card, CardContent } from "../ui/card";
import { Lightbulb } from "lucide-react";

export function ActivityInfoCard() {
  return (
    <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
      <CardContent className="p-4">
        <div className="flex gap-3">
          <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-100">
              What are Activities?
            </h4>
            <p className="text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
              Activities help you track time spent on job search tasks like networking,
              skill learning, resume writing, or interview prep. This data appears on your
              dashboard to show productivity trends.{" "}
              <strong className="font-semibold">Tip:</strong> Break long sessions
              into multiple activities (max 8 hours each) for better insights.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

















