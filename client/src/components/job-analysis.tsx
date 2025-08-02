import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Bot, Sparkles, ExternalLink, Github } from "lucide-react";

interface JobAnalysisProps {
  userId: string;
}

interface JobAnalysisResult {
  id: string;
  matchScore: number;
  missingSkills: string[];
  atsKeywords: string[];
  recommendedProjects: Array<{
    name: string;
    description: string;
    url: string;
  }>;
}

export default function JobAnalysis({ userId }: JobAnalysisProps) {
  const [jobTitle, setJobTitle] = useState("");
  const [jobRequirements, setJobRequirements] = useState("");
  const { toast } = useToast();

  const { data: analyses = [] } = useQuery({
    queryKey: ['/api/users', userId, 'job-analyses'],
  });

  const analyzeJobMutation = useMutation({
    mutationFn: (data: { jobTitle: string; jobRequirements: string }) =>
      apiRequest('POST', `/api/users/${userId}/analyze-job`, data),
    onSuccess: () => {
      toast({
        title: "Analysis Complete",
        description: "Job requirements analyzed successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/users', userId, 'job-analyses'] });
      setJobTitle("");
      setJobRequirements("");
    },
    onError: () => {
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze job requirements. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAnalyze = () => {
    if (!jobTitle.trim() || !jobRequirements.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both job title and requirements.",
        variant: "destructive",
      });
      return;
    }

    analyzeJobMutation.mutate({ jobTitle, jobRequirements });
  };

  const latestAnalysis: JobAnalysisResult | null = (analyses as JobAnalysisResult[])[0] || null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bot className="text-primary mr-3" />
          AI-Powered Job Analysis
        </CardTitle>
        <p className="text-slate-600">Paste job requirements to get personalized resume optimization</p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="jobTitle">Job Title</Label>
            <Input
              id="jobTitle"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g., Senior Frontend Developer"
            />
          </div>
          
          <div>
            <Label htmlFor="jobRequirements">Job Requirements</Label>
            <Textarea
              id="jobRequirements"
              value={jobRequirements}
              onChange={(e) => setJobRequirements(e.target.value)}
              placeholder="Paste the job description or requirements here..."
              rows={6}
              className="resize-none"
            />
          </div>
          
          <Button 
            onClick={handleAnalyze}
            disabled={analyzeJobMutation.isPending}
            className="w-full bg-primary text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            {analyzeJobMutation.isPending ? 'Analyzing...' : 'Analyze Job & Optimize Resume'}
          </Button>
        </div>
        
        {/* Analysis Results */}
        {latestAnalysis && (
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <h4 className="font-medium text-slate-900 mb-4">Analysis Results</h4>
            
            {/* Match Score */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-slate-700">Job Match Score</span>
                <span className="text-sm font-bold text-secondary">{latestAnalysis.matchScore}%</span>
              </div>
              <Progress value={latestAnalysis.matchScore} className="w-full" />
            </div>
            
            {/* Missing Skills */}
            {latestAnalysis.missingSkills && latestAnalysis.missingSkills.length > 0 && (
              <div className="mb-6">
                <h5 className="font-medium text-slate-900 mb-3">Skills to Acquire</h5>
                <div className="flex flex-wrap gap-2">
                  {latestAnalysis.missingSkills.map((skill) => (
                    <Badge key={skill} variant="destructive" className="bg-red-100 text-red-800">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {/* ATS Keywords */}
            {latestAnalysis.atsKeywords && latestAnalysis.atsKeywords.length > 0 && (
              <div className="mb-6">
                <h5 className="font-medium text-slate-900 mb-3">Important ATS Keywords</h5>
                <div className="flex flex-wrap gap-2">
                  {latestAnalysis.atsKeywords.map((keyword) => (
                    <Badge key={keyword} variant="secondary" className="bg-blue-100 text-blue-800">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {/* Recommended Projects */}
            {latestAnalysis.recommendedProjects && latestAnalysis.recommendedProjects.length > 0 && (
              <div>
                <h5 className="font-medium text-slate-900 mb-3">Learning Resources</h5>
                <div className="space-y-2">
                  {latestAnalysis.recommendedProjects.map((project, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200"
                    >
                      <div className="flex items-center">
                        <Github className="text-slate-400 mr-3 h-4 w-4" />
                        <div>
                          <div className="font-medium text-slate-900">{project.name}</div>
                          <div className="text-sm text-slate-500">{project.description}</div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(project.url, '_blank')}
                        className="text-primary hover:text-blue-700"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!latestAnalysis && !analyzeJobMutation.isPending && (
          <div className="text-center py-8 text-slate-500">
            <Bot className="h-12 w-12 mx-auto mb-4 text-slate-300" />
            <p>Enter job requirements above to get AI-powered analysis and recommendations.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
