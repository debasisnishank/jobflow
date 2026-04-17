"use client";

import { Plus, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

interface Education {
  id?: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  location: string;
  startDate: string;
  endDate?: string;
  description?: string;
}

interface EducationFormProps {
  data: Education[];
  onChange: (data: Education[]) => void;
}

export function EducationForm({ data, onChange }: EducationFormProps) {
  const addEducation = () => {
    onChange([
      ...data,
      {
        institution: "",
        degree: "",
        fieldOfStudy: "",
        location: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ]);
  };

  const removeEducation = (index: number) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const updateEducation = (index: number, field: keyof Education, value: any) => {
    const newData = [...data];
    newData[index] = { ...newData[index], [field]: value };
    onChange(newData);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Education</h3>
          <p className="text-sm text-gray-600">
            Add your educational background, starting with the most recent degree.
          </p>
        </div>
        <Button
          onClick={addEducation}
          size="sm"
          variant="outline"
          className="border-[#3B82F6]/30 hover:bg-[#3B82F6]/10 hover:text-[#3B82F6] shrink-0"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Education
        </Button>
      </div>

      {data.length === 0 && (
        <Card className="border-2 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <GripVertical className="h-6 w-6 text-gray-400" />
            </div>
            <p className="text-sm text-gray-600 mb-4">No education added yet</p>
            <Button onClick={addEducation} size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Education
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {data.map((education, index) => (
          <Card key={index} className="border-gray-200">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <h4 className="text-sm font-semibold text-gray-900">
                  Education #{index + 1}
                </h4>
                <Button
                  onClick={() => removeEducation(index)}
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
                    Institution <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={education.institution}
                    onChange={(e) => updateEducation(index, "institution", e.target.value)}
                    placeholder="University of California, Berkeley"
                    className="bg-white border-gray-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Degree <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={education.degree}
                    onChange={(e) => updateEducation(index, "degree", e.target.value)}
                    placeholder="Bachelor of Science"
                    className="bg-white border-gray-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Field of Study <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    value={education.fieldOfStudy}
                    onChange={(e) => updateEducation(index, "fieldOfStudy", e.target.value)}
                    placeholder="Computer Science"
                    className="bg-white border-gray-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Location</Label>
                <Input
                  value={education.location}
                  onChange={(e) => updateEducation(index, "location", e.target.value)}
                  placeholder="Berkeley, CA"
                  className="bg-white border-gray-300"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Start Date</Label>
                  <Input
                    type="month"
                    value={education.startDate}
                    onChange={(e) => updateEducation(index, "startDate", e.target.value)}
                    className="bg-white border-gray-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">End Date (or Expected)</Label>
                  <Input
                    type="month"
                    value={education.endDate || ""}
                    onChange={(e) => updateEducation(index, "endDate", e.target.value)}
                    className="bg-white border-gray-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Additional Details (Optional)</Label>
                <Textarea
                  value={education.description || ""}
                  onChange={(e) => updateEducation(index, "description", e.target.value)}
                  placeholder="GPA: 3.8/4.0&#10;Honors: Dean's List&#10;Relevant coursework: Data Structures, Algorithms, Machine Learning"
                  rows={4}
                  className="bg-white border-gray-300"
                />
                <p className="text-xs text-gray-500">
                  Include GPA, honors, relevant coursework, or achievements
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

