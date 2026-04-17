"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Shield,
} from "lucide-react";

interface CheatingAnalysisProps {
  analysis: {
    overallRiskLevel: "low" | "medium" | "high";
    confidenceScore: number;
    detectedIssues: Array<{
      category: string;
      severity: "low" | "medium" | "high";
      description: string;
      timestamp?: string;
      evidence?: string;
    }>;
    legitimateExplanations: string[];
    recommendations: string[];
    summary: string;
  };
}

export function CheatingAnalysis({ analysis }: CheatingAnalysisProps) {
  const getRiskIcon = () => {
    switch (analysis.overallRiskLevel) {
      case "low":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "medium":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "high":
        return <XCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getRiskBadge = () => {
    const variants = {
      low: "bg-green-100 text-green-800 border-green-200",
      medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
      high: "bg-red-100 text-red-800 border-red-200",
    };

    return (
      <Badge className={variants[analysis.overallRiskLevel]}>
        {analysis.overallRiskLevel.toUpperCase()} RISK
      </Badge>
    );
  };

  const getSeverityBadge = (severity: "low" | "medium" | "high") => {
    const variants = {
      low: "bg-blue-100 text-blue-800 border-blue-200",
      medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
      high: "bg-red-100 text-red-800 border-red-200",
    };

    return <Badge className={variants[severity]}>{severity}</Badge>;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <CardTitle>Integrity Analysis</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {getRiskIcon()}
            {getRiskBadge()}
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Confidence Score: {analysis.confidenceScore}%
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>{analysis.summary}</AlertDescription>
        </Alert>

        {/* Detected Issues */}
        {analysis.detectedIssues.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Detected Issues</h3>
            {analysis.detectedIssues.map((issue, index) => (
              <Card key={index} className="border-l-4 border-l-orange-400">
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-sm">{issue.category}</h4>
                      {issue.timestamp && (
                        <p className="text-xs text-muted-foreground">
                          {issue.timestamp}
                        </p>
                      )}
                    </div>
                    {getSeverityBadge(issue.severity)}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {issue.description}
                  </p>
                  {issue.evidence && (
                    <div className="bg-muted p-2 rounded text-xs mt-2">
                      <strong>Evidence:</strong> {issue.evidence}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Legitimate Explanations */}
        {analysis.legitimateExplanations.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">
              Possible Legitimate Explanations
            </h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              {analysis.legitimateExplanations.map((explanation, index) => (
                <li key={index}>{explanation}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Recommendations */}
        {analysis.recommendations.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold">Recommendations</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              {analysis.recommendations.map((recommendation, index) => (
                <li key={index}>{recommendation}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


