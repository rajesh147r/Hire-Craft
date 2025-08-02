import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Search, TrendingUp } from "lucide-react";

export default function ATSScore() {
  const [scores, setScores] = useState({
    keywordMatch: 85,
    formatScore: 92,
    readabilityScore: 78,
    overallScore: 85,
  });

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Search className="text-primary mr-3" />
          ATS Optimization
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-600">Keyword Match</span>
            <span className={`text-sm font-medium ${getScoreColor(scores.keywordMatch)}`}>
              {scores.keywordMatch}%
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-600">Format Score</span>
            <span className={`text-sm font-medium ${getScoreColor(scores.formatScore)}`}>
              {scores.formatScore}%
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-600">Readability</span>
            <span className={`text-sm font-medium ${getScoreColor(scores.readabilityScore)}`}>
              {scores.readabilityScore}%
            </span>
          </div>
          
          <div className="pt-4 border-t border-slate-200">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-slate-900">Overall ATS Score</span>
              <span className={`text-lg font-bold ${getScoreColor(scores.overallScore)}`}>
                {scores.overallScore}%
              </span>
            </div>
            <Progress 
              value={scores.overallScore} 
              className="w-full"
            />
          </div>
        </div>
        
        <Button 
          variant="outline"
          className="w-full mt-4 border-secondary text-secondary hover:bg-secondary hover:text-white transition-colors"
        >
          <TrendingUp className="mr-2 h-4 w-4" />
          Improve ATS Score
        </Button>
      </CardContent>
    </Card>
  );
}
