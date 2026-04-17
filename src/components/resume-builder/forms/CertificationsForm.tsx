"use client";

import { Plus, Trash2, GripVertical, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

interface Certification {
  id?: string;
  title: string;
  organization: string;
  issueDate?: string;
  expirationDate?: string;
  credentialUrl?: string;
}

interface CertificationsFormProps {
  data: Certification[];
  onChange: (data: Certification[]) => void;
}

export function CertificationsForm({ data, onChange }: CertificationsFormProps) {
  const addCertification = () => {
    onChange([
      ...data,
      {
        title: "",
        organization: "",
        issueDate: "",
        expirationDate: "",
        credentialUrl: "",
      },
    ]);
  };

  const removeCertification = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const updateCertification = (index: number, field: keyof Certification, value: any) => {
    const newData = [...data];
    newData[index] = { ...newData[index], [field]: value };
    onChange(newData);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Certifications & Licenses</h3>
          <p className="text-sm text-gray-600">
            Add professional certifications, licenses, or credentials that enhance your qualifications.
          </p>
        </div>
        <Button
          onClick={addCertification}
          size="sm"
          variant="outline"
          className="border-[#3B82F6]/30 hover:bg-[#3B82F6]/10 hover:text-[#3B82F6] shrink-0"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Certification
        </Button>
      </div>

      {data.length === 0 && (
        <Card className="border-2 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <GripVertical className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-sm text-gray-600 mb-2">No certifications added yet</p>
            <p className="text-xs text-gray-500 mb-4">
              Add relevant certifications to showcase your expertise
            </p>
            <Button onClick={addCertification} size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Certification
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {data.map((certification, index) => (
          <Card key={index} className="border-gray-200">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <h4 className="text-sm font-semibold text-gray-900">
                  Certification #{index + 1}
                </h4>
                <Button
                  onClick={() => removeCertification(index)}
                  size="sm"
                  variant="ghost"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-sm font-medium">
                    Certification Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={certification.title}
                    onChange={(e) => updateCertification(index, "title", e.target.value)}
                    placeholder="AWS Certified Solutions Architect"
                    className="bg-white border-gray-300"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label className="text-sm font-medium">
                    Issuing Organization <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={certification.organization}
                    onChange={(e) => updateCertification(index, "organization", e.target.value)}
                    placeholder="Amazon Web Services (AWS)"
                    className="bg-white border-gray-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Issue Date</Label>
                  <Input
                    type="month"
                    value={certification.issueDate || ""}
                    onChange={(e) => updateCertification(index, "issueDate", e.target.value)}
                    className="bg-white border-gray-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Expiration Date (Optional)</Label>
                  <Input
                    type="month"
                    value={certification.expirationDate || ""}
                    onChange={(e) => updateCertification(index, "expirationDate", e.target.value)}
                    className="bg-white border-gray-300"
                  />
                  <p className="text-xs text-gray-500">Leave blank if it doesn't expire</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Credential URL (Optional)</Label>
                <div className="relative">
                  <Input
                    type="url"
                    value={certification.credentialUrl || ""}
                    onChange={(e) => updateCertification(index, "credentialUrl", e.target.value)}
                    placeholder="https://..."
                    className="bg-white border-gray-300 pr-10"
                  />
                  {certification.credentialUrl && (
                    <a
                      href={certification.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3B82F6] hover:text-[#2563EB]"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  Link to your credential or certificate verification page
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">Certification Tips:</h4>
        <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
          <li>Include industry-recognized certifications relevant to your field</li>
          <li>Add credential URLs for verification when available</li>
          <li>Keep expired certifications only if they're still relevant</li>
          <li>List certifications in order of relevance or recency</li>
        </ul>
      </div>
    </div>
  );
}

