"use client";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Activity } from "@/models/activity.model";
import { DeleteAlertDialog } from "../DeleteAlertDialog";
import { ActivitiesTableRow } from "./ActivitiesTableRow";
import { useActivityDelete } from "./hooks/useActivityDelete";

interface ActivitiesTableProps {
  activities: Activity[];
  reloadActivities: () => void;
  onStartActivity: (activityId: string) => void;
  activityExist: boolean;
}

function ActivitiesTable({
  activities,
  reloadActivities,
  onStartActivity,
  activityExist,
}: ActivitiesTableProps) {
  const { alertOpen, setAlertOpen, onDeleteActivity, deleteActivity } =
    useActivityDelete(reloadActivities);

  const calculateDuration = (totalMinutes: number) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return totalMinutes === 0 ? "0min" : `${hours}h ${minutes}min`;
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow className="border-border/50 hover:bg-[#3B82F6]/5">
            <TableHead className="hidden md:table-cell font-semibold">
              Date
            </TableHead>
            <TableHead className="font-semibold">Activity</TableHead>
            <TableHead className="font-semibold">Activity Type</TableHead>
            <TableHead className="hidden md:table-cell font-semibold">
              Start Time
            </TableHead>
            <TableHead className="hidden md:table-cell font-semibold">
              End Time
            </TableHead>
            <TableHead className="font-semibold">Duration</TableHead>
            <TableHead className="w-[50px]">
              <span>Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activities?.map((activity: Activity) => (
            <ActivitiesTableRow
              key={activity.id}
              activity={activity}
              activityExist={activityExist}
              onStartActivity={onStartActivity}
              onDeleteActivity={onDeleteActivity}
              calculateDuration={calculateDuration}
            />
          ))}
        </TableBody>
      </Table>
      <DeleteAlertDialog
        pageTitle="activity"
        open={alertOpen}
        onOpenChange={setAlertOpen}
        onDelete={deleteActivity}
      />
    </>
  );
}

export default ActivitiesTable;
export { ActivitiesTable };
