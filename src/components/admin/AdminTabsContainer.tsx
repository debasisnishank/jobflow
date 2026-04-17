"use client";
import CompaniesContainer from "@/components/admin/CompaniesContainer";
import JobLocationsContainer from "@/components/admin/JobLocationsContainer";
import JobTitlesContainer from "@/components/admin/JobTitlesContainer";
import JobSourcesContainer from "@/components/admin/JobSourcesContainer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

function AdminTabsContainer() {
  const router = useRouter();
  const pathname = usePathname();
  const queryParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(queryParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [queryParams]
  );

  const onTabChange = (tab: string) => {
    router.push(pathname + "?" + createQueryString("tab", tab));
  };
  return (
    <div className="space-y-4">
      <Tabs
        defaultValue={queryParams.get("tab") || "companies"}
        onValueChange={(e) => onTabChange(e)}
      >
        <TabsList className="border border-border/50 bg-muted/30 flex-wrap">
          <TabsTrigger value="companies">Companies</TabsTrigger>
          <TabsTrigger value="job-titles">Job Titles</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="job-sources">Job Sources</TabsTrigger>
        </TabsList>
        <TabsContent value="companies" className="mt-6">
          <CompaniesContainer />
        </TabsContent>
        <TabsContent value="job-titles" className="mt-6">
          <JobTitlesContainer />
        </TabsContent>
        <TabsContent value="locations" className="mt-6">
          <JobLocationsContainer />
        </TabsContent>
        <TabsContent value="job-sources" className="mt-6">
          <JobSourcesContainer />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default AdminTabsContainer;
