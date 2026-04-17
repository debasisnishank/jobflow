"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { Card, CardContent } from "@/components/ui/card";

interface SubscriptionPieChartProps {
  data: { plan: string; count: number }[];
}

const COLORS = ["#3B82F6", "#F59E0B", "#8B5CF6"];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          backgroundColor: "#1e293b",
          border: "none",
          borderRadius: "6px",
          padding: "8px 12px",
        }}
      >
        <p style={{ color: "#fff", margin: 0, fontWeight: 600 }}>
          {`${payload[0].name}: ${payload[0].value}`}
        </p>
      </div>
    );
  }
  return null;
};

export default function SubscriptionPieChart({ data }: SubscriptionPieChartProps) {
  const chartData = data.map((item) => ({
    name: item.plan,
    value: item.count,
  }));

  return (
    <Card className="border border-border/70 shadow-sm">
      <CardContent className="h-[240px] p-3">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ percent }) => {
                if (percent < 0.05) return "";
                return `${(percent * 100).toFixed(0)}%`;
              }}
              outerRadius={65}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{
                fontSize: "12px",
                color: "#9ca3af",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
