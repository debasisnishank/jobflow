import {
  LayoutDashboard,
  BriefcaseBusiness,
  CalendarClock,
  UserRound,
  FileText,
  Sheet,
  Tag,
  CreditCard,
  Users,
  Sparkles,
  MessageSquare,
  Mail,
  Mic,
  Type,
  FileText as FileTextIcon,
  PenTool,
  Shield,
} from "lucide-react";

export enum APP_CONSTANTS {
  RECORDS_PER_PAGE = 10,
  ACTIVITY_MAX_DURATION_MINUTES = 8 * 60, // 8 Hours
  ACTIVITY_MAX_DURATION_MS = 8 * 60 * 60 * 1000, // 8 hours in milliseconds
  WEEKLY_JOB_GOAL = 10, // Default weekly job application goal
}

import { LucideIcon } from "lucide-react";

export interface SidebarLink {
  icon: LucideIcon;
  route?: string;
  label: string;
  match?: "exact" | "prefix";
  badge?: string;
  children?: SidebarLink[];
}

export interface SidebarGroup {
  label?: string;
  items: SidebarLink[];
}

export const SIDEBAR_GROUPS: SidebarGroup[] = [
  {
    items: [
      {
        icon: LayoutDashboard,
        route: "/dashboard",
        label: "Dashboard",
      },
      {
        icon: BriefcaseBusiness,
        route: "/dashboard/myjobs",
        label: "My Jobs",
      },
      {
        icon: CalendarClock,
        route: "/dashboard/activities",
        label: "Activities",
      },
    ],
  },
  {
    label: "Profile & Documents",
    items: [
      {
        icon: UserRound,
        route: "/dashboard/profile",
        label: "Profile",
      },
      {
        icon: FileText,
        label: "Resume Builder",
        children: [
          {
            icon: FileText,
            route: "/dashboard/resume-builder",
            label: "My Resumes",
            match: "exact",
          },
          {
            icon: FileTextIcon,
            route: "/dashboard/resume-builder/ai-tools?tool=analysis",
            label: "Resume Analysis",
          },
          {
            icon: Sparkles,
            route: "/dashboard/resume-builder/ai-tools?tool=summary",
            label: "Summary Writer",
          },
          {
            icon: PenTool,
            route: "/dashboard/resume-builder/ai-tools?tool=cover-letter",
            label: "Cover Letter",
          },
          {
            icon: FileTextIcon,
            route: "/dashboard/resume-builder/ai-tools?tool=guidance",
            label: "Guidance",
          },
        ],
      },
    ],
  },
  {
    label: "Networking",
    items: [
      {
        icon: Users,
        route: "/dashboard/contacts",
        label: "Contacts",
      },
    ],
  },
  {
    label: "AI Tools",
    items: [
      {
        icon: Sparkles,
        label: "AI Toolbox",
        children: [
          {
            icon: FileTextIcon,
            route: "/dashboard/ai-toolbox/personal-brand-statement",
            label: "Personal Brand Statement",
          },
          {
            icon: Mail,
            route: "/dashboard/ai-toolbox/email-writer",
            label: "Email Writer",
          },
          {
            icon: Mic,
            route: "/dashboard/ai-toolbox/elevator-pitch",
            label: "Elevator Pitch",
          },
          {
            icon: Type,
            route: "/dashboard/ai-toolbox/linkedin-headline",
            label: "LinkedIn Headline",
          },
          {
            icon: FileTextIcon,
            route: "/dashboard/ai-toolbox/linkedin-about",
            label: "LinkedIn About",
          },
          {
            icon: PenTool,
            route: "/dashboard/ai-toolbox/linkedin-post",
            label: "LinkedIn Post",
          },
        ],
      },
      {
        icon: MessageSquare,
        route: "/dashboard/mock-interview",
        label: "Mock Interview",
        badge: "Beta",
      },
    ],
  },
  {
    label: "Settings",
    items: [
      {
        icon: Sheet,
        route: "/dashboard/admin",
        label: "Administration",
      },
      {
        icon: Tag,
        route: "/dashboard/pricing",
        label: "Pricing",
      },
      {
        icon: CreditCard,
        route: "/dashboard/billing",
        label: "Billing",
      },
    ],
  },
];

// Flattened version for backward compatibility
export const SIDEBAR_LINKS: SidebarLink[] = SIDEBAR_GROUPS.flatMap(group => group.items);
