"use client";

import { Button } from "../ui/button";
import CompaniesTable from "./CompaniesTable";
import { Company } from "@/models/job.model";

interface CompaniesContainerContentProps {
  companies: Company[];
  totalCompanies: number;
  page: number;
  loading: boolean;
  reloadCompanies: () => void;
  editCompany: (companyId: string) => void;
  onLoadMore: () => void;
}

export function CompaniesContainerContent({
  companies,
  totalCompanies,
  page,
  loading,
  reloadCompanies,
  editCompany,
  onLoadMore,
}: CompaniesContainerContentProps) {
  return (
    <>
      <div className="rounded-lg border border-border/50 overflow-hidden">
        <CompaniesTable
          companies={companies}
          reloadCompanies={reloadCompanies}
          editCompany={editCompany}
        />
      </div>
      <div className="mt-4 text-sm text-muted-foreground flex items-center justify-between">
        <span>
          Showing{" "}
          <strong className="text-foreground">
            {1} to {companies.length}
          </strong>{" "}
          of <strong className="text-foreground">{totalCompanies}</strong>{" "}
          companies
        </span>
      </div>
      {companies.length < totalCompanies && (
        <div className="flex justify-center pt-4">
          <Button
            size="sm"
            variant="outline"
            onClick={onLoadMore}
            disabled={loading}
            className="min-w-[120px] border-[#3B82F6]/30 hover:bg-[#3B82F6] hover:text-white hover:border-[#3B82F6]"
          >
            {loading ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </>
  );
}

















