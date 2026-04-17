"use client";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Company } from "@/models/job.model";
import { DeleteAlertDialog } from "../DeleteAlertDialog";
import { CompaniesTableRow } from "./CompaniesTableRow";
import { useCompanyDelete } from "./hooks/useCompanyDelete";

type CompaniesTableProps = {
  companies: Company[];
  reloadCompanies: () => void;
  editCompany: (id: string) => void;
};

function CompaniesTable({
  companies,
  reloadCompanies,
  editCompany,
}: CompaniesTableProps) {
  const { alert, setAlert, onDeleteCompany, deleteCompany } =
    useCompanyDelete(reloadCompanies);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="hidden w-[100px] sm:table-cell">
              <span className="sr-only">Company Logo</span>
            </TableHead>
            <TableHead>Company Name</TableHead>
            <TableHead>Jobs Applied</TableHead>
            <TableHead>Actions</TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies.map((company: Company) => (
            <CompaniesTableRow
              key={company.id}
              company={company}
              onEditCompany={editCompany}
              onDeleteCompany={onDeleteCompany}
            />
          ))}
        </TableBody>
      </Table>
      <DeleteAlertDialog
        pageTitle="company"
        open={alert.openState}
        onOpenChange={() => setAlert({ openState: false, deleteAction: false })}
        onDelete={() => deleteCompany(alert.itemId)}
        alertTitle={alert.title}
        alertDescription={alert.description}
        deleteAction={alert.deleteAction}
      />
    </>
  );
}

export default CompaniesTable;
