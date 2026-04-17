"use strict";

import { useCallback, useEffect, useState } from "react";
import { Company } from "@/models/job.model";
import { getCompanyById, getCompanyList } from "@/actions/company.actions";
import { APP_CONSTANTS } from "@/lib/constants";

export function useCompaniesContainer() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [totalCompanies, setTotalCompanies] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editCompany, setEditCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const recordsPerPage = APP_CONSTANTS.RECORDS_PER_PAGE;

  const loadCompanies = useCallback(
    async (page: number) => {
      setLoading(true);
      const { data, total } = await getCompanyList(
        page,
        recordsPerPage,
        "applied"
      );
      if (data) {
        setCompanies((prev) => (page === 1 ? data : [...prev, ...data]));
        setTotalCompanies(total);
        setPage(page);
        setLoading(false);
      }
    },
    [recordsPerPage]
  );

  const reloadCompanies = useCallback(async () => {
    await loadCompanies(1);
  }, [loadCompanies]);

  const resetEditCompany = () => {
    setEditCompany(null);
  };

  const onEditCompany = async (companyId: string) => {
    const company = await getCompanyById(companyId);
    setEditCompany(company);
    setDialogOpen(true);
  };

  useEffect(() => {
    (async () => await loadCompanies(1))();
  }, [loadCompanies]);

  return {
    companies,
    totalCompanies,
    page,
    dialogOpen,
    setDialogOpen,
    editCompany,
    loading,
    loadCompanies,
    reloadCompanies,
    resetEditCompany,
    onEditCompany,
  };
}

















