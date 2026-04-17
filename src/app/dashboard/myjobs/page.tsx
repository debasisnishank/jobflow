import { Metadata } from "next";

import { getJobSourceList, getStatusList } from "@/actions/job.actions";
import JobsContainer from "@/components/myjobs/JobsContainer";
import { getAllCompanies } from "@/actions/company.actions";
import { getAllJobTitles } from "@/actions/jobtitle.actions";
import { getAllJobLocations } from "@/actions/jobLocation.actions";

import { appConfig } from "@/lib/config/app.config";

export const metadata: Metadata = {
  title: `My Jobs | ${appConfig.brandName}`,
};

async function MyJobs() {
  const [statuses, companies, titles, locations, sources] = await Promise.all([
    getStatusList(),
    getAllCompanies(),
    getAllJobTitles(),
    getAllJobLocations(),
    getJobSourceList(),
  ]);
  
  // Ensure all values are arrays, default to empty array if error
  const statusesArray = Array.isArray(statuses) ? statuses : [];
  const companiesArray = Array.isArray(companies) ? companies : [];
  const titlesArray = Array.isArray(titles) ? titles : [];
  const locationsArray = Array.isArray(locations) ? locations : [];
  const sourcesArray = Array.isArray(sources) ? sources : [];
  
  return (
    <div className="col-span-3">
      <JobsContainer
        companies={companiesArray}
        titles={titlesArray}
        locations={locationsArray}
        sources={sourcesArray}
        statuses={statusesArray}
      />
    </div>
  );
}

export default MyJobs;
