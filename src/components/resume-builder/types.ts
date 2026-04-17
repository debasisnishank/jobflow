import { StyleSettings } from "./StyleSettings";

export interface ResumeFormData {
    id?: string;
    title: string;
    template: string;
    primaryColor: string;
    styleSettings?: StyleSettings;
    jobDescription?: string;
    contactInfo: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        address?: string;
        headline: string;
    };
    summary: string;
    workExperiences: Array<{
        id?: string;
        company: string;
        jobTitle: string;
        location: string;
        startDate: string;
        endDate?: string;
        description: string;
        current: boolean;
    }>;
    educations: Array<{
        id?: string;
        institution: string;
        degree: string;
        fieldOfStudy: string;
        location: string;
        startDate: string;
        endDate?: string;
        description?: string;
    }>;
    skills: Array<{
        id?: string;
        name: string;
        level?: string;
        category?: string;
    }>;
    certifications: Array<{
        id?: string;
        title: string;
        organization: string;
        issueDate?: string;
        expirationDate?: string;
        credentialUrl?: string;
    }>;
    customSections: Array<{
        id?: string;
        sectionId?: string;
        title: string;
        content: string;
    }>;
}
