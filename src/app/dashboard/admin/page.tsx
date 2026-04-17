import AdminTabsContainer from "@/components/admin/AdminTabsContainer";

async function AdminPage() {
  return (
    <div className="flex flex-col col-span-3">
      <div className="mb-6">
        <h3 className="text-2xl font-bold leading-none tracking-tight mb-2">
          Administration
        </h3>
        <p className="text-sm text-muted-foreground">
          Manage companies, job titles, and locations
        </p>
      </div>
      <AdminTabsContainer />
    </div>
  );
}

export default AdminPage;
