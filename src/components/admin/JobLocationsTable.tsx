"use client";
import { DeleteAlertDialog } from "../DeleteAlertDialog";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { JobLocation } from "@/models/job.model";
import { useJobLocationDelete } from "./hooks/useJobLocationDelete";
import { JobLocationsTableRow } from "./JobLocationsTableRow";

type JobLocationsTableProps = {
  jobLocations: JobLocation[];
  reloadJobLocations: () => void;
};

function JobLocationsTable({
  jobLocations,
  reloadJobLocations,
}: JobLocationsTableProps) {
  const { alert, setAlert, onDeleteJobLocation, deleteJobLocation } =
    useJobLocationDelete(reloadJobLocations);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Location</TableHead>
            <TableHead>Jobs Applied</TableHead>
            <TableHead>Actions</TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobLocations.map((location: JobLocation) => (
            <JobLocationsTableRow
              key={location.id}
              location={location}
              onDeleteJobLocation={onDeleteJobLocation}
            />
          ))}
        </TableBody>
      </Table>
      <DeleteAlertDialog
        pageTitle="location"
        open={alert.openState}
        onOpenChange={() => setAlert({ openState: false, deleteAction: false })}
        onDelete={() => deleteJobLocation(alert.itemId!)}
        alertTitle={alert.title}
        alertDescription={alert.description}
        deleteAction={alert.deleteAction}
      />
    </>
  );
}

export default JobLocationsTable;
