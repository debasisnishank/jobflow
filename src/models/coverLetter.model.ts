"use strict";

export interface CoverLetter {
  id?: string;
  jobId: string;
  templateId?: string;
  title: string;
  content: string;
  version: number;
  isCurrent: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  template?: CoverLetterTemplate;
}

export interface CoverLetterTemplate {
  id?: string;
  userId: string;
  title: string;
  content: string;
  isDefault: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CoverLetterFormData {
  title: string;
  content: string;
  templateId?: string;
}

















