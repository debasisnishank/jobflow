"use client";

import { Building2 } from "lucide-react";
import AddCompany from "./AddCompany";
import { Company } from "@/models/job.model";

interface CompaniesContainerEmptyStateProps {
  editCompany: Company | null;
  reloadCompanies: () => void;
  resetEditCompany: () => void;
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
}

export function CompaniesContainerEmptyState({
  editCompany,
  reloadCompanies,
  resetEditCompany,
  dialogOpen,
  setDialogOpen,
}: CompaniesContainerEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="rounded-full bg-muted/50 p-6 mb-4">
        <Building2 className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No companies yet</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">
        Add your first company to start building your database.
      </p>
      <AddCompany
        editCompany={editCompany}
        reloadCompanies={reloadCompanies}
        resetEditCompany={resetEditCompany}
        dialogOpen={dialogOpen}
        setDialogOpen={setDialogOpen}
      />
    </div>
  );
}

















