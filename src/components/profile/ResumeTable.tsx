"use client";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Resume } from "@/models/profile.model";
import { DeleteAlertDialog } from "../DeleteAlertDialog";
import { ResumeTableRow } from "./ResumeTableRow";
import { useResumeDelete } from "./hooks/useResumeDelete";

type ResumeTableProps = {
  resumes: Resume[];
  editResume: (resume: Resume) => void;
  reloadResumes: () => void;
};

function ResumeTable({ resumes, editResume, reloadResumes }: ResumeTableProps) {
  const {
    alertOpen,
    setAlertOpen,
    resumeToDelete,
    onDeleteResume,
    deleteResume,
  } = useResumeDelete(reloadResumes);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow className="border-border/50 hover:bg-[#3B82F6]/5">
            <TableHead className="font-semibold">Resume Title</TableHead>
            <TableHead className="font-semibold">Created</TableHead>
            <TableHead className="hidden md:table-cell font-semibold">
              Updated
            </TableHead>
            <TableHead className="font-semibold">Jobs</TableHead>
            <TableHead className="w-[50px]">
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {resumes.map((resume: Resume) => (
            <ResumeTableRow
              key={resume.id}
              resume={resume}
              onEditResume={editResume}
              onDeleteResume={onDeleteResume}
            />
          ))}
        </TableBody>
      </Table>
      <DeleteAlertDialog
        pageTitle="resume"
        open={alertOpen}
        onOpenChange={setAlertOpen}
        onDelete={() => deleteResume(resumeToDelete!)}
      />
    </>
  );
}

export default ResumeTable;
