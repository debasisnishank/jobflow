import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, ArrowLeft, Database } from "lucide-react";

export default function PricingPlanNotFound() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md w-full border-dashed">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <AlertCircle className="h-8 w-8 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl">Pricing Plan Not Found</CardTitle>
          <CardDescription className="mt-2">
            The pricing plan you're looking for doesn't exist in the database.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted/50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground text-center">
              This plan hasn't been seeded yet. Please seed the default pricing plans from the pricing page.
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/admin/pricing" className="flex-1">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Pricing
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
