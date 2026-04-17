export interface Contact {
  id: string;
  firstName: string;
  lastName?: string | null;
  email?: string | null;
  phone?: string | null;
  title?: string | null;
  company?: string | null;
  linkedInUrl?: string | null;
  notes?: string | null;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  Interactions?: ContactInteraction[];
  linkedJobs?: JobContact[];
}

export interface ContactInteraction {
  id: string;
  contactId: string;
  type: string;
  title: string;
  description?: string | null;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface JobContact {
  id: string;
  jobId: string;
  contactId: string;
  role?: string | null;
  createdAt: Date;
  contact?: Contact;
  job?: {
    id: string;
    JobTitle?: { label: string };
    Company?: { label: string };
  };
}

export interface ContactFormData {
  firstName: string;
  lastName?: string;
  email?: string;
  phone?: string;
  title?: string;
  company?: string;
  linkedInUrl?: string;
  notes?: string;
  tags?: string[];
}

export interface ContactInteractionFormData {
  type: string;
  title: string;
  description?: string;
  date: Date;
}



