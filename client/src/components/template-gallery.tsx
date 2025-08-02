import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { FileText, Download, Eye } from "lucide-react";
import { type ResumeTemplate } from "@shared/schema";

interface TemplateGalleryProps {
  onClose: () => void;
}

export default function TemplateGallery({ onClose }: TemplateGalleryProps) {
  const { toast } = useToast();
  
  const { data: templates = [], isLoading } = useQuery<ResumeTemplate[]>({
    queryKey: ['/api/templates'],
  });

  const handleUseTemplate = (template: ResumeTemplate) => {
    toast({
      title: "Template Selected",
      description: `Using ${template.name} template for your resume.`,
    });
    // In a real app, this would trigger resume generation
    onClose();
  };

  const handlePreview = (template: ResumeTemplate) => {
    toast({
      title: "Preview",
      description: `Previewing ${template.name} template.`,
    });
    // In a real app, this would open a preview modal
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-slate-200 h-40 rounded mb-3"></div>
                <div className="bg-slate-200 h-4 rounded mb-2"></div>
                <div className="bg-slate-200 h-3 rounded mb-3"></div>
                <div className="bg-slate-200 h-8 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <FileText className="text-primary mr-3" />
            Choose Your Resume Template
          </span>
          <Button variant="ghost" onClick={onClose}>
            ✕
          </Button>
        </CardTitle>
        <p className="text-slate-600">Select from our collection of ATS-optimized resume templates</p>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {templates.map((template) => (
            <div 
              key={template.id}
              className="border border-slate-200 rounded-lg p-4 hover:border-primary hover:shadow-md transition-all"
            >
              <div className="bg-slate-100 h-40 rounded mb-3 flex items-center justify-center relative group">
                <FileText className="text-slate-400 text-4xl" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handlePreview(template)}
                    className="mr-2"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="text-center space-y-2">
                <div className="font-medium text-slate-900">{template.name}</div>
                <div className="text-sm text-slate-500">{template.description}</div>
                
                <div className="flex justify-center gap-1 mb-3">
                  {template.isAts && (
                    <Badge variant="secondary" className="text-xs">
                      ATS-Friendly
                    </Badge>
                  )}
                  {template.category && (
                    <Badge variant="outline" className="text-xs">
                      {template.category}
                    </Badge>
                  )}
                </div>
                
                <Button 
                  onClick={() => handleUseTemplate(template)}
                  className="w-full bg-primary text-white hover:bg-blue-700 transition-colors"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Use Template
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        {templates.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            <FileText className="h-12 w-12 mx-auto mb-4 text-slate-300" />
            <p>No templates available at the moment.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
