"use client";
import { Card, CardContent, CardHeader } from "../ui/card";
import Loading from "../Loading";
import { useCompaniesContainer } from "./hooks/useCompaniesContainer";
import { CompaniesContainerHeader } from "./CompaniesContainerHeader";
import { CompaniesContainerContent } from "./CompaniesContainerContent";
import { CompaniesContainerEmptyState } from "./CompaniesContainerEmptyState";

function CompaniesContainer() {
  const {
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
  } = useCompaniesContainer();

  const handleLoadMore = () => {
    loadCompanies(page + 1);
  };

  return (
    <Card className="border border-border/70 shadow-lg">
      <CardHeader className="border-b border-border/50 bg-gradient-to-r from-background to-muted/20 pb-4">
        <CompaniesContainerHeader
          editCompany={editCompany}
          reloadCompanies={reloadCompanies}
          resetEditCompany={resetEditCompany}
          dialogOpen={dialogOpen}
          setDialogOpen={setDialogOpen}
        />
      </CardHeader>
      <CardContent className="p-6">
        {loading && <Loading />}
        {companies.length > 0 ? (
          <CompaniesContainerContent
            companies={companies}
            totalCompanies={totalCompanies}
            page={page}
            loading={loading}
            reloadCompanies={reloadCompanies}
            editCompany={onEditCompany}
            onLoadMore={handleLoadMore}
          />
        ) : (
          <CompaniesContainerEmptyState
            editCompany={editCompany}
            reloadCompanies={reloadCompanies}
            resetEditCompany={resetEditCompany}
            dialogOpen={dialogOpen}
            setDialogOpen={setDialogOpen}
          />
        )}
      </CardContent>
    </Card>
  );
}

export default CompaniesContainer;
