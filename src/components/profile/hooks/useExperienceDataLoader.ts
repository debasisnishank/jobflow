"use strict";

import { useCallback, useState } from "react";
import { Company, JobLocation, JobTitle } from "@/models/job.model";
import { getAllCompanies } from "@/actions/company.actions";
import { getAllJobTitles } from "@/actions/jobtitle.actions";
import { getAllJobLocations } from "@/actions/jobLocation.actions";

export function useExperienceDataLoader() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [locations, setLocations] = useState<JobLocation[]>([]);
  const [jobTitles, setJobTitles] = useState<JobTitle[]>([]);

  const getTitleCompanyAndLocationData = useCallback(async () => {
    const [_companies, _titles, _locations] = await Promise.all([
      getAllCompanies(),
      getAllJobTitles(),
      getAllJobLocations(),
    ]);
    setCompanies(_companies);
    setLocations(_locations);
    setJobTitles(_titles);
  }, []);

  return {
    companies,
    locations,
    jobTitles,
    getTitleCompanyAndLocationData,
  };
}

















