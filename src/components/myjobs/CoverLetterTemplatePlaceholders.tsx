"use client";

interface CoverLetterTemplatePlaceholdersProps {
  className?: string;
}

export function CoverLetterTemplatePlaceholders({
  className = "",
}: CoverLetterTemplatePlaceholdersProps) {
  return (
    <div className={`p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-900 ${className}`}>
      <p className="text-xs font-medium text-amber-900 dark:text-amber-100 mb-2">
        Available Placeholders:
      </p>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-1">
          <code className="bg-amber-100 dark:bg-amber-900/50 px-1.5 py-0.5 rounded text-amber-900 dark:text-amber-100">
            [COMPANY_NAME]
          </code>
          <span className="text-amber-700 dark:text-amber-300">Company name</span>
        </div>
        <div className="flex items-center gap-1">
          <code className="bg-amber-100 dark:bg-amber-900/50 px-1.5 py-0.5 rounded text-amber-900 dark:text-amber-100">
            [JOB_TITLE]
          </code>
          <span className="text-amber-700 dark:text-amber-300">Job position</span>
        </div>
        <div className="flex items-center gap-1">
          <code className="bg-amber-100 dark:bg-amber-900/50 px-1.5 py-0.5 rounded text-amber-900 dark:text-amber-100">
            [YOUR_NAME]
          </code>
          <span className="text-amber-700 dark:text-amber-300">Your name</span>
        </div>
        <div className="flex items-center gap-1">
          <code className="bg-amber-100 dark:bg-amber-900/50 px-1.5 py-0.5 rounded text-amber-900 dark:text-amber-100">
            [RELEVANT_SKILL]
          </code>
          <span className="text-amber-700 dark:text-amber-300">Key skill</span>
        </div>
      </div>
      <p className="text-xs text-amber-700 dark:text-amber-300 mt-2">
        💡 Tip: You can also write free-form text. The AI will adapt your template
        style to each job.
      </p>
    </div>
  );
}

















