"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent } from "@/components/ui/card";

interface GrowthLineChartProps {
  data: { day: string; value: number }[];
  title: string;
  color?: string;
}

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
          {`${payload[0].value}`}
        </p>
      </div>
    );
  }
  return null;
};

export default function GrowthLineChart({ data, title, color = "#3B82F6" }: GrowthLineChartProps) {
  return (
    <Card className="border border-border/70 shadow-sm">
      <CardContent className="h-[300px] p-4">
        <div className="mb-4">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{title}</h3>
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
            <XAxis
              dataKey="day"
              stroke="#9ca3af"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#9ca3af"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              dot={{ fill: color, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
