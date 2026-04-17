"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import GrowthLineChart from "./GrowthLineChart";
import { Loader2 } from "lucide-react";

interface GrowthChartsSectionProps {
  initialStats: {
    userGrowthData: { day: string; value: number }[];
    resumeGrowthData: { day: string; value: number }[];
    subscriptionDistribution: { plan: string; count: number }[];
  };
}

export default function GrowthChartsSection({ initialStats }: GrowthChartsSectionProps) {
  const [duration, setDuration] = useState<number>(7);
  const [activeTab, setActiveTab] = useState<string>("users");
  const [userData, setUserData] = useState(initialStats.userGrowthData);
  const [resumeData, setResumeData] = useState(initialStats.resumeGrowthData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/admin/stats?duration=${duration}`);
        if (!response.ok) throw new Error("Failed to fetch stats");
        const data = await response.json();
        setUserData(data.userGrowthData);
        setResumeData(data.resumeGrowthData);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    if (duration !== 7) {
      fetchData();
    } else {
      setUserData(initialStats.userGrowthData);
      setResumeData(initialStats.resumeGrowthData);
    }
  }, [duration, initialStats]);

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="users">User Growth</TabsTrigger>
              <TabsTrigger value="resumes">Resume Generation</TabsTrigger>
            </TabsList>
            <Select value={duration.toString()} onValueChange={(value) => setDuration(parseInt(value))}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <TabsContent value="users">
            {loading ? (
              <div className="flex items-center justify-center h-[300px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <GrowthLineChart data={userData} title="User Growth" color="#3B82F6" />
            )}
          </TabsContent>
          <TabsContent value="resumes">
            {loading ? (
              <div className="flex items-center justify-center h-[300px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : (
              <GrowthLineChart data={resumeData} title="Resume Generation" color="#10B981" />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
