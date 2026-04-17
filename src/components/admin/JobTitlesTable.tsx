"use client";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { JobTitle } from "@/models/job.model";
import { DeleteAlertDialog } from "../DeleteAlertDialog";
import { useJobTitleDelete } from "./hooks/useJobTitleDelete";
import { JobTitlesTableRow } from "./JobTitlesTableRow";

type JobTitlesTableProps = {
  jobTitles: JobTitle[];
  reloadJobTitles: () => void;
};

function JobTitlesTable({ jobTitles, reloadJobTitles }: JobTitlesTableProps) {
  const { alert, setAlert, onDeleteJobTitle, deleteJobTitle } =
    useJobTitleDelete(reloadJobTitles);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Job Title</TableHead>
            <TableHead>Jobs Applied</TableHead>
            <TableHead>Actions</TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobTitles.map((title: JobTitle) => (
            <JobTitlesTableRow
              key={title.id}
              title={title}
              onDeleteJobTitle={onDeleteJobTitle}
            />
          ))}
        </TableBody>
      </Table>
      <DeleteAlertDialog
        pageTitle="title"
        open={alert.openState}
        onOpenChange={() => setAlert({ openState: false, deleteAction: false })}
        onDelete={() => deleteJobTitle(alert.itemId!)}
        alertTitle={alert.title}
        alertDescription={alert.description}
        deleteAction={alert.deleteAction}
      />
    </>
  );
}

export default JobTitlesTable;
