"use client";

import { ResumeFormData } from "../types";
import { Mail, Phone, MapPin, Calendar } from "lucide-react";

interface ProfessionalTemplateProps {
  data: ResumeFormData;
  primaryColor: string;
}

export function ProfessionalTemplate({ data, primaryColor }: ProfessionalTemplateProps) {
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
    <div className="w-full h-full p-12 font-serif">
      {/* Header */}
      <div className="text-center border-b-4 pb-6 mb-6" style={{ borderColor: primaryColor }}>
        <h1 className="text-4xl font-bold mb-2 text-gray-900">
          {contactInfo.firstName} {contactInfo.lastName}
        </h1>
        <p className="text-lg font-semibold mb-3" style={{ color: primaryColor }}>
          {contactInfo.headline}
        </p>
        <div className="flex justify-center gap-4 text-sm text-gray-600">
          {contactInfo.email && (
            <span className="flex items-center gap-1">
              <Mail className="h-4 w-4" /> {contactInfo.email}
            </span>
          )}
          {contactInfo.phone && (
            <span className="flex items-center gap-1">
              <Phone className="h-4 w-4" /> {contactInfo.phone}
            </span>
          )}
          {contactInfo.address && (
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" /> {contactInfo.address}
            </span>
          )}
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3 uppercase tracking-wide" style={{ color: primaryColor }}>
            Professional Summary
          </h2>
          <p className="text-gray-700 leading-relaxed">{summary}</p>
        </div>
      )}

      {/* Work Experience */}
      {workExperiences.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4 uppercase tracking-wide" style={{ color: primaryColor }}>
            Work Experience
          </h2>
          {workExperiences.map((exp, idx) => (
            <div key={idx} className="mb-4">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="text-lg font-bold">{exp.jobTitle}</h3>
                <span className="text-sm text-gray-600">
                  {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}
                </span>
              </div>
              <p className="font-semibold text-gray-800 mb-2">{exp.company} {exp.location && `• ${exp.location}`}</p>
              {exp.description && <div className="text-sm text-gray-700 whitespace-pre-line">{exp.description}</div>}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {educations.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4 uppercase tracking-wide" style={{ color: primaryColor }}>
            Education
          </h2>
          {educations.map((edu, idx) => (
            <div key={idx} className="mb-4">
              <div className="flex justify-between items-baseline">
                <div>
                  <h3 className="text-lg font-bold">{edu.degree} in {edu.fieldOfStudy}</h3>
                  <p className="font-semibold text-gray-800">{edu.institution}</p>
                </div>
                <span className="text-sm text-gray-600">
                  {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                </span>
              </div>
              {edu.description && <div className="text-sm text-gray-700 mt-2 whitespace-pre-line">{edu.description}</div>}
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3 uppercase tracking-wide" style={{ color: primaryColor }}>
            Skills
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, idx) => (
              <span key={idx} className="text-sm text-gray-700">
                {skill.name}{idx < skills.length - 1 && " •"}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {certifications.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-3 uppercase tracking-wide" style={{ color: primaryColor }}>
            Certifications
          </h2>
          {certifications.map((cert, idx) => (
            <div key={idx} className="mb-2">
              <p className="font-bold">{cert.title}</p>
              <p className="text-sm text-gray-700">{cert.organization} {cert.issueDate && `• ${formatDate(cert.issueDate)}`}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

