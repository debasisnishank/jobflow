"use client";
import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { APP_CONSTANTS } from "@/lib/constants";
import { JobTitle } from "@prisma/client";
import JobTitlesTable from "./JobTitlesTable";
import { getJobTitleList } from "@/actions/jobtitle.actions";
import Loading from "../Loading";
import { Button } from "../ui/button";
import { Briefcase } from "lucide-react";
import AddJobTitle from "./AddJobTitle";

function JobTitlesContainer() {
  const [titles, setTitles] = useState<JobTitle[]>([]);
  const [totalJobTitles, setTotalJobTitles] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [editJobTitle, setEditJobTitle] = useState<JobTitle | null>(null);

  const recordsPerPage = APP_CONSTANTS.RECORDS_PER_PAGE;

  const loadJobTitles = useCallback(
    async (page: number) => {
      setLoading(true);
      const { data, total } = await getJobTitleList(
        page,
        recordsPerPage,
        "applied"
      );
      if (data) {
        setTitles((prev) => (page === 1 ? data : [...prev, ...data]));
        setTotalJobTitles(total);
        setPage(page);
        setLoading(false);
      }
    },
    [recordsPerPage]
  );

  const reloadJobTitles = useCallback(async () => {
    await loadJobTitles(1);
  }, [loadJobTitles]);

  const resetEditJobTitle = () => {
    setEditJobTitle(null);
  };

  useEffect(() => {
    (async () => await loadJobTitles(1))();
  }, [loadJobTitles]);

  return (
    <Card className="border border-border/70 shadow-lg">
      <CardHeader className="border-b border-border/50 bg-gradient-to-r from-background to-muted/20 pb-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-2xl font-bold tracking-tight">
              Job Titles
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Manage job title database
            </p>
          </div>
          <div className="flex items-center">
            <AddJobTitle
              editJobTitle={editJobTitle}
              reloadJobTitles={reloadJobTitles}
              resetEditJobTitle={resetEditJobTitle}
              dialogOpen={dialogOpen}
              setDialogOpen={setDialogOpen}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {loading && <Loading />}
        {titles.length > 0 ? (
          <>
            <div className="rounded-lg border border-border/50 overflow-hidden">
              <JobTitlesTable
                jobTitles={titles}
                reloadJobTitles={reloadJobTitles}
              />
            </div>
            <div className="mt-4 text-sm text-muted-foreground flex items-center justify-between">
              <span>
                Showing{" "}
                <strong className="text-foreground">
                  {1} to {titles.length}
                </strong>{" "}
                of{" "}
                <strong className="text-foreground">{totalJobTitles}</strong>{" "}
                job titles
              </span>
            </div>
            {titles.length < totalJobTitles && (
              <div className="flex justify-center pt-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => loadJobTitles(page + 1)}
                  disabled={loading}
                  className="min-w-[120px] border-[#3B82F6]/30 hover:bg-[#3B82F6] hover:text-white hover:border-[#3B82F6]"
                >
                  {loading ? "Loading..." : "Load More"}
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="rounded-full bg-muted/50 p-6 mb-4">
              <Briefcase className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No job titles yet</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Job titles will appear here as you add jobs.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default JobTitlesContainer;
