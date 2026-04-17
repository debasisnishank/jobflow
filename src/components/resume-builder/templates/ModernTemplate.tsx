"use client";

import { ResumeFormData } from "../types";
import { StyleSettings, DEFAULT_SETTINGS } from "../StyleSettings";
import { Mail, Phone, MapPin, Calendar, ExternalLink } from "lucide-react";

interface ModernTemplateProps {
  data: ResumeFormData;
  primaryColor: string;
  styleSettings?: StyleSettings;
}

export function ModernTemplate({ data, primaryColor, styleSettings }: ModernTemplateProps) {
  const settings: StyleSettings = styleSettings || {
    ...DEFAULT_SETTINGS,
    accentColor: primaryColor,
  };
  const { contactInfo, summary, workExperiences, educations, skills, certifications, customSections } = data;

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

  const groupedSkills = skills.reduce((acc, skill) => {
    const category = skill.category || "Other";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);

  const formatName = (firstName: string, lastName: string) => {
    const fullName = `${firstName} ${lastName}`;
    switch (settings.nameFormat) {
      case "uppercase":
        return fullName.toUpperCase();
      case "lowercase":
        return fullName.toLowerCase();
      case "capitalize":
      default:
        return fullName
          .split(" ")
          .map((n) => n.charAt(0).toUpperCase() + n.slice(1).toLowerCase())
          .join(" ");
    }
  };


  return (
    <div
      className="w-full h-full min-h-[1100px] font-sans"
      style={{
        fontFamily: settings.font,
        fontSize: `${settings.fontSize}pt`,
        lineHeight: settings.lineHeight,
        color: settings.accentColor,
      }}
    >
      <div className="grid grid-cols-[3.5fr_6.5fr] gap-6 md:gap-8 min-h-full" style={{ gap: `${settings.sectionGap}in` }}>

        {/* Left Column - Sidebar */}
        <div
          className="p-6 rounded-lg text-white"
          style={{ backgroundColor: settings.accentColor || primaryColor }}
        >
          <div className="space-y-6" style={{ gap: `${settings.sectionGap}in` }}>
            {/* Contact Info */}
            <div>
              <h1 className="text-3xl font-bold mb-1">
                {formatName(contactInfo.firstName, contactInfo.lastName)}
              </h1>
              <p className="text-sm opacity-90 font-medium">{contactInfo.headline}</p>
            </div>

            {/* Contact Details */}
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-0.5 shrink-0" />
                <span className="break-all">{contactInfo.email}</span>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="h-4 w-4 mt-0.5 shrink-0" />
                <span>{contactInfo.phone}</span>
              </div>
              {contactInfo.address && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>{contactInfo.address}</span>
                </div>
              )}
            </div>

            {/* Skills */}
            {skills.length > 0 && (
              <div>
                <h2 className="text-lg font-bold mb-3 pb-2 border-b-2 border-white/30">
                  SKILLS
                </h2>
                <div className="space-y-4">
                  {Object.entries(groupedSkills).map(([category, categorySkills]) => (
                    <div key={category}>
                      <h3 className="text-xs font-semibold uppercase opacity-75 mb-2">
                        {category}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {categorySkills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-white/20 rounded text-xs font-medium"
                          >
                            {skill.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {certifications.length > 0 && (
              <div>
                <h2 className="text-lg font-bold mb-3 pb-2 border-b-2 border-white/30">
                  CERTIFICATIONS
                </h2>
                <div className="space-y-3 text-sm">
                  {certifications.map((cert, idx) => (
                    <div key={idx}>
                      <p className="font-semibold">{cert.title}</p>
                      <p className="text-xs opacity-90">{cert.organization}</p>
                      {cert.issueDate && (
                        <p className="text-xs opacity-75 mt-1">
                          {formatDate(cert.issueDate)}
                          {cert.expirationDate && ` - ${formatDate(cert.expirationDate)}`}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Main Content */}
        <div className="space-y-6">
          {/* Summary */}
          {summary && (
            <div style={{ marginBottom: `${settings.sectionGap}in` }}>
              <h2
                className="text-xl font-bold mb-3 pb-2 border-b-2"
                style={{ borderColor: settings.accentColor || primaryColor }}
              >
                PROFESSIONAL SUMMARY {settings.headerDelimiter}
              </h2>
              <p className="text-gray-700 text-sm leading-relaxed">{summary}</p>
            </div>
          )}

          {/* Work Experience */}
          {workExperiences.length > 0 && (
            <div style={{ marginBottom: `${settings.sectionGap}in` }}>
              <h2
                className="text-xl font-bold mb-4 pb-2 border-b-2"
                style={{ borderColor: settings.accentColor || primaryColor }}
              >
                WORK EXPERIENCE {settings.headerDelimiter}
              </h2>
              <div className="space-y-4">
                {workExperiences.map((exp, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h3 className="text-base font-bold text-gray-900">{exp.jobTitle}</h3>
                        <p className="text-sm font-semibold" style={{ color: settings.accentColor || primaryColor }}>
                          {exp.company}
                        </p>
                      </div>
                      <div className="text-right text-xs text-gray-600 shrink-0 ml-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}
                        </div>
                        {exp.location && <div className="mt-1">{exp.location}</div>}
                      </div>
                    </div>
                    {exp.description && (
                      <div className="text-sm text-gray-700 leading-relaxed mt-2 whitespace-pre-line">
                        {exp.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {educations.length > 0 && (
            <div style={{ marginBottom: `${settings.sectionGap}in` }}>
              <h2
                className="text-xl font-bold mb-4 pb-2 border-b-2"
                style={{ borderColor: settings.accentColor || primaryColor }}
              >
                EDUCATION {settings.headerDelimiter}
              </h2>
              <div className="space-y-4">
                {educations.map((edu, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between items-start mb-1">
                      <div>
                        <h3 className="text-base font-bold text-gray-900">{edu.degree}</h3>
                        <p className="text-sm font-semibold" style={{ color: settings.accentColor || primaryColor }}>
                          {edu.institution}
                        </p>
                        <p className="text-sm text-gray-600">{edu.fieldOfStudy}</p>
                      </div>
                      <div className="text-right text-xs text-gray-600 shrink-0 ml-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                        </div>
                        {edu.location && <div className="mt-1">{edu.location}</div>}
                      </div>
                    </div>
                    {edu.description && (
                      <div className="text-sm text-gray-700 leading-relaxed mt-2 whitespace-pre-line">
                        {edu.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Custom Sections */}
          {customSections && customSections.length > 0 && customSections.map((section, idx) => (
            section.title && section.content && (
              <div key={idx} style={{ marginBottom: `${settings.sectionGap}in` }}>
                <h2
                  className="text-xl font-bold mb-4 pb-2 border-b-2"
                  style={{ borderColor: settings.accentColor || primaryColor }}
                >
                  {section.title.toUpperCase()} {settings.headerDelimiter}
                </h2>
                <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {section.content}
                </div>
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
}

