"use client";

import {
  TableCell,
  TableRow,
} from "../ui/table";
import { JobLocation } from "@/models/job.model";
import { JobLocationsTableRowActions } from "./JobLocationsTableRowActions";

interface JobLocationsTableRowProps {
  location: JobLocation;
  onDeleteJobLocation: (location: JobLocation) => void;
}

export function JobLocationsTableRow({
  location,
  onDeleteJobLocation,
}: JobLocationsTableRowProps) {
  return (
    <TableRow key={location.id}>
      <TableCell className="font-medium">{location.label}</TableCell>
      <TableCell className="font-medium">
        {location._count?.jobsApplied}
      </TableCell>
      <TableCell>
        <JobLocationsTableRowActions
          location={location}
          onDeleteJobLocation={onDeleteJobLocation}
        />
      </TableCell>
    </TableRow>
  );
}







