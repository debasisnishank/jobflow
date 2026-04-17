"use client";

import { ResumeFormData } from "../types";

interface MinimalTemplateProps {
  data: ResumeFormData;
  primaryColor: string;
}

export function MinimalTemplate({ data, primaryColor }: MinimalTemplateProps) {
  const { contactInfo, summary, workExperiences, educations, skills, certifications } = data;

  const formatDate = (date?: string) => {
    if (!date) return "";
    try {
      const dateStr = date.length <= 7 ? date + "-01" : date;
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return date;
      return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    } catch (e) {
      return date || "";
    }
  };

  return (
    <div className="w-full h-full p-16 font-sans">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-5xl font-light tracking-tight">{contactInfo.firstName} {contactInfo.lastName}</h1>
          <p className="text-lg text-gray-600">{contactInfo.headline}</p>
          <div className="text-sm text-gray-500 space-x-3">
            <span>{contactInfo.email}</span>
            <span>•</span>
            <span>{contactInfo.phone}</span>
            {contactInfo.address && (
              <>
                <span>•</span>
                <span>{contactInfo.address}</span>
              </>
            )}
          </div>
        </div>

        {summary && (
          <div>
            <p className="text-gray-700 leading-relaxed">{summary}</p>
          </div>
        )}

        {workExperiences.length > 0 && (
          <div>
            <h2 className="text-xs uppercase tracking-widest mb-4 font-semibold" style={{ color: primaryColor }}>
              Experience
            </h2>
            <div className="space-y-6">
              {workExperiences.map((exp, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-semibold">{exp.jobTitle}</h3>
                    <span className="text-xs text-gray-500">{formatDate(exp.startDate)} — {exp.current ? "Present" : formatDate(exp.endDate)}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{exp.company}</p>
                  {exp.description && <div className="text-sm text-gray-700 whitespace-pre-line">{exp.description}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {educations.length > 0 && (
          <div>
            <h2 className="text-xs uppercase tracking-widest mb-4 font-semibold" style={{ color: primaryColor }}>
              Education
            </h2>
            <div className="space-y-4">
              {educations.map((edu, idx) => (
                <div key={idx}>
                  <div className="flex justify-between items-baseline">
                    <div>
                      <h3 className="font-semibold">{edu.degree}</h3>
                      <p className="text-sm text-gray-600">{edu.institution}</p>
                    </div>
                    <span className="text-xs text-gray-500">{formatDate(edu.endDate)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {skills.length > 0 && (
          <div>
            <h2 className="text-xs uppercase tracking-widest mb-4 font-semibold" style={{ color: primaryColor }}>
              Skills
            </h2>
            <div className="flex flex-wrap gap-3 text-sm text-gray-700">
              {skills.map((skill, idx) => (
                <span key={idx}>{skill.name}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

