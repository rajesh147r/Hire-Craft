import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { generateResumePDF } from "@/lib/pdf-utils";
import { type User } from "@shared/schema";

interface PDFGeneratorProps {
  userId: string;
  templateId?: string;
}

export default function PDFGenerator({ userId, templateId = "modern" }: PDFGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const { data: user } = useQuery<User>({
    queryKey: ['/api/users', userId],
  });

  const { data: experience = [] } = useQuery({
    queryKey: ['/api/users', userId, 'experience'],
  });

  const { data: education = [] } = useQuery({
    queryKey: ['/api/users', userId, 'education'],
  });

  const { data: projects = [] } = useQuery({
    queryKey: ['/api/users', userId, 'projects'],
  });

  const handleGeneratePDF = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "User profile not found. Please complete your profile first.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      await generateResumePDF({
        user,
        experience: experience as any[],
        education: education as any[],
        projects: projects as any[],
        templateId,
      });
      
      toast({
        title: "Success",
        description: "Resume PDF generated and downloaded successfully!",
      });
    } catch (error) {
      console.error("PDF generation error:", error);
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      onClick={handleGeneratePDF}
      disabled={isGenerating || !user}
      className="bg-primary text-white hover:bg-blue-700 transition-colors"
    >
      {isGenerating ? (
        <>
          <FileText className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Download className="mr-2 h-4 w-4" />
          Download Resume
        </>
      )}
    </Button>
  );
}
