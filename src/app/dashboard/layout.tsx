import Sidebar from "@/components/Sidebar";
import { Toaster } from "@/components/ui/toaster";
import { DashboardContent } from "@/components/DashboardContent";
import { getCurrentUser } from "@/utils/user.utils";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-50/50">
      <Sidebar user={user} />
      <DashboardContent>
        {/* Header removed as it overlaps with new fixed sidebar toggle */}
        <main className="md:block lg:grid flex-1 items-start gap-4 p-4 sm:p-6 sm:pt-0 sm:pb-0 md:gap-4 lg:grid-cols-3 xl:grid-cols-3">
          {children}
        </main>
        <Toaster />
      </DashboardContent>
    </div>
  );
}
