"use client";

import { forwardRef } from "react";

import { ResumeFormData } from "./types";
import { ModernTemplate } from "./templates/ModernTemplate";
import { ProfessionalTemplate } from "./templates/ProfessionalTemplate";
import { MinimalTemplate } from "./templates/MinimalTemplate";
import { CreativeTemplate } from "./templates/CreativeTemplate";
import { ClassicTemplate } from "./templates/ClassicTemplate";
import { StyleSettings, DEFAULT_SETTINGS } from "./StyleSettings";

interface ResumePreviewProps {
  formData: ResumeFormData;
  template: string;
  primaryColor: string;
  styleSettings?: StyleSettings;
}

export const ResumePreview = forwardRef<HTMLDivElement, ResumePreviewProps>(({ formData, template, primaryColor, styleSettings }, ref) => {
  const settings = styleSettings || DEFAULT_SETTINGS;

  const renderTemplate = () => {
    const templateProps = { data: formData, primaryColor, styleSettings: settings };

    switch (template) {
      case "modern":
        return <ModernTemplate {...templateProps} />;
      case "professional":
        return <ProfessionalTemplate {...templateProps} />;
      case "minimal":
        return <MinimalTemplate {...templateProps} />;
      case "creative":
        return <CreativeTemplate {...templateProps} />;
      case "classic":
        return <ClassicTemplate {...templateProps} />;
      default:
        return <ModernTemplate {...templateProps} />;
    }
  };

  const paperSizeStylesMap: Record<string, { width: string; height: string }> = {
    a4: { width: "8.27in", height: "11.69in" },
    letter: { width: "8.5in", height: "11in" },
    legal: { width: "8.5in", height: "14in" },
  };
  const paperSizeStyles = paperSizeStylesMap[settings.paperSize as keyof typeof paperSizeStylesMap] || paperSizeStylesMap.a4;

  const printStyles = `
      @media print {
        @page {
          margin: ${settings.topBottomMargins}in ${settings.leftRightMargins}in;
        }
        body {
          padding: 0;
          margin: 0;
        }
        #resume-preview {
          padding: 0 !important;
          margin: 0 !important;
          box-shadow: none !important;
          width: 100% !important;
          min-height: auto !important;
        }
        /* Ensure background colors print correctly */
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
      }
    `;

  return (
    <div className="w-full h-full flex items-start justify-center overflow-auto pb-8 print:pb-0 print:p-0 print:block print:w-full print:h-auto print:overflow-visible">
      <style>{printStyles}</style>
      <div
        ref={ref}
        id="resume-preview"
        className="bg-white shadow-2xl rounded-lg overflow-visible print:shadow-none print:rounded-none"
        style={{
          ...paperSizeStyles,
          width: "100%",
          maxWidth: "850px",
          height: "auto",
          minHeight: paperSizeStyles.height,
          fontFamily: settings.font,
          fontSize: `${settings.fontSize}pt`,
          lineHeight: settings.lineHeight,
          padding: `${settings.topBottomMargins}in ${settings.leftRightMargins}in`,
        }}
      >
        <div className="w-full h-full">
          {renderTemplate()}
        </div>
      </div>
    </div>
  );
});

ResumePreview.displayName = "ResumePreview";

