"use client";

import {
  TableCell,
  TableRow,
} from "../ui/table";
import { Company } from "@/models/job.model";
import { CompaniesTableRowActions } from "./CompaniesTableRowActions";
import { CompanyLogo } from "../ui/CompanyLogo";

interface CompaniesTableRowProps {
  company: Company;
  onEditCompany: (id: string) => void;
  onDeleteCompany: (company: Company) => void;
}

export function CompaniesTableRow({
  company,
  onEditCompany,
  onDeleteCompany,
}: CompaniesTableRowProps) {
  return (
    <TableRow key={company.id}>
      <TableCell className="hidden sm:table-cell">
        <CompanyLogo
          alt="Company logo"
          className="aspect-square rounded-md object-cover"
          height={32}
          src={company.logoUrl}
          width={32}
        />
      </TableCell>
      <TableCell className="font-medium">{company.label}</TableCell>
      <TableCell className="font-medium">
        {company._count?.jobsApplied}
      </TableCell>
      <TableCell>
        <CompaniesTableRowActions
          company={company}
          onEditCompany={onEditCompany}
          onDeleteCompany={onDeleteCompany}
        />
      </TableCell>
    </TableRow>
  );
}

