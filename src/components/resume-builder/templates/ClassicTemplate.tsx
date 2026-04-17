"use client";

import { ResumeFormData } from "../types";

interface ClassicTemplateProps {
  data: ResumeFormData;
  primaryColor: string;
}

export function ClassicTemplate({ data, primaryColor }: ClassicTemplateProps) {
  return (
    <div className="w-full h-full p-12 flex items-center justify-center">
      <div className="text-center text-gray-500">
        <h3 className="text-xl font-semibold mb-2">Classic Template</h3>
        <p className="text-sm">Coming Soon</p>
      </div>
    </div>
  );
}

