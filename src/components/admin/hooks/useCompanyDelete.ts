"use strict";

import { useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { deleteCompanyById } from "@/actions/company.actions";
import { Company } from "@/models/job.model";
import { AlertDialog } from "@/models/alertDialog.model";

export function useCompanyDelete(reloadCompanies: () => void) {
  const [alert, setAlert] = useState<AlertDialog>({
    openState: false,
    deleteAction: false,
  });

  const onDeleteCompany = (company: Company) => {
    if (company._count?.jobsApplied! > 0) {
      setAlert({
        openState: true,
        title: "Applied jobs exist!",
        description:
          "Associated jobs applied must be 0 to be able to delete this company",
        deleteAction: false,
      });
    } else {
      setAlert({
        openState: true,
        deleteAction: true,
        itemId: company.id,
      });
    }
  };

  const deleteCompany = async (companyId: string | undefined) => {
    if (companyId) {
      const { res, success, message } = await deleteCompanyById(companyId);
      if (success) {
        toast({
          variant: "success",
          description: `Company has been deleted successfully`,
        });
        reloadCompanies();
      } else {
        toast({
          variant: "destructive",
          title: "Error!",
          description: message,
        });
      }
    }
  };

  return {
    alert,
    setAlert,
    onDeleteCompany,
    deleteCompany,
  };
}

















