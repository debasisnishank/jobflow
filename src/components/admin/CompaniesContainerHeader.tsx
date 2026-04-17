"use client";

import AddCompany from "./AddCompany";
import { Company } from "@/models/job.model";

interface CompaniesContainerHeaderProps {
  editCompany: Company | null;
  reloadCompanies: () => void;
  resetEditCompany: () => void;
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
}

export function CompaniesContainerHeader({
  editCompany,
  reloadCompanies,
  resetEditCompany,
  dialogOpen,
  setDialogOpen,
}: CompaniesContainerHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Companies</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Manage company database
        </p>
      </div>
      <div className="flex items-center">
        <AddCompany
          editCompany={editCompany}
          reloadCompanies={reloadCompanies}
          resetEditCompany={resetEditCompany}
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
        />
      </div>
    </div>
  );
}

















