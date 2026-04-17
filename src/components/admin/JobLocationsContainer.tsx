"use client";
import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { APP_CONSTANTS } from "@/lib/constants";
import { JobLocation } from "@/models/job.model";
import JobLocationsTable from "./JobLocationsTable";
import { getJobLocationsList } from "@/actions/jobLocation.actions";
import Loading from "../Loading";
import { Button } from "../ui/button";
import { MapPin } from "lucide-react";
import AddJobLocation from "./AddJobLocation";

function JobLocationsContainer() {
  const [locations, setLocations] = useState<JobLocation[]>([]);
  const [totalJobLocations, setTotalJobLocations] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [editJobLocation, setEditJobLocation] = useState<JobLocation | null>(null);

  const recordsPerPage = APP_CONSTANTS.RECORDS_PER_PAGE;

  const loadJobLocations = useCallback(
    async (page: number) => {
      setLoading(true);
      const { data, total } = await getJobLocationsList(
        page,
        recordsPerPage,
        "applied"
      );
      if (data) {
        setLocations((prev) => (page === 1 ? data : [...prev, ...data]));
        setTotalJobLocations(total);
        setPage(page);
        setLoading(false);
      }
    },
    [recordsPerPage]
  );

  const reloadJobLocations = useCallback(async () => {
    await loadJobLocations(1);
  }, [loadJobLocations]);

  const resetEditJobLocation = () => {
    setEditJobLocation(null);
  };

  useEffect(() => {
    (async () => await loadJobLocations(1))();
  }, [loadJobLocations]);

  return (
    <Card className="border border-border/70 shadow-lg">
      <CardHeader className="border-b border-border/50 bg-gradient-to-r from-background to-muted/20 pb-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-2xl font-bold tracking-tight">
              Job Locations
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Manage location database
            </p>
          </div>
          <div className="flex items-center">
            <AddJobLocation
              editJobLocation={editJobLocation}
              reloadJobLocations={reloadJobLocations}
              resetEditJobLocation={resetEditJobLocation}
              dialogOpen={dialogOpen}
              setDialogOpen={setDialogOpen}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        {loading && <Loading />}
        {locations.length > 0 ? (
          <>
            <div className="rounded-lg border border-border/50 overflow-hidden">
              <JobLocationsTable
                jobLocations={locations}
                reloadJobLocations={reloadJobLocations}
              />
            </div>
            <div className="mt-4 text-sm text-muted-foreground flex items-center justify-between">
              <span>
                Showing{" "}
                <strong className="text-foreground">
                  {1} to {locations.length}
                </strong>{" "}
                of{" "}
                <strong className="text-foreground">{totalJobLocations}</strong>{" "}
                job locations
              </span>
            </div>
            {locations.length < totalJobLocations && (
              <div className="flex justify-center pt-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => loadJobLocations(page + 1)}
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
              <MapPin className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              No job locations yet
            </h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Job locations will appear here as you add jobs.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default JobLocationsContainer;
