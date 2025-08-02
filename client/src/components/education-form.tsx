import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { insertEducationSchema, type Education, type InsertEducation } from "@shared/schema";
import { GraduationCap } from "lucide-react";

interface EducationFormProps {
  userId: string;
}

export default function EducationForm({ userId }: EducationFormProps) {
  const { toast } = useToast();

  const { data: education = [] } = useQuery({
    queryKey: ['/api/users', userId, 'education'],
  });

  const form = useForm<InsertEducation>({
    resolver: zodResolver(insertEducationSchema),
    defaultValues: {
      userId,
      institution: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      gpa: "",
      description: "",
    },
  });

  const createEducationMutation = useMutation({
    mutationFn: (data: InsertEducation) => 
      apiRequest('POST', `/api/users/${userId}/education`, data),
    onSuccess: () => {
      toast({
        title: "Education Added",
        description: "Education record has been added successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/users', userId, 'education'] });
      form.reset({
        userId,
        institution: "",
        degree: "",
        field: "",
        startDate: "",
        endDate: "",
        gpa: "",
        description: "",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add education. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertEducation) => {
    createEducationMutation.mutate(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <GraduationCap className="text-primary mr-3" />
          Education
        </CardTitle>
        <p className="text-slate-600">Add your educational background</p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Existing Education */}
        {(education as Education[]).length > 0 && (
          <div className="space-y-4">
            <h4 className="font-medium text-slate-900">Your Education</h4>
            {(education as Education[]).map((edu) => (
              <div key={edu.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <h5 className="font-medium text-slate-900">
                  {edu.degree} {edu.field && `in ${edu.field}`}
                </h5>
                <p className="text-sm text-slate-600">{edu.institution}</p>
                <p className="text-xs text-slate-500">
                  {edu.startDate} - {edu.endDate}
                </p>
                {edu.gpa && <p className="text-sm text-slate-700">GPA: {edu.gpa}</p>}
                {edu.description && <p className="text-sm text-slate-700 mt-2">{edu.description}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Add New Education Form */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <h4 className="font-medium text-slate-900">Add New Education</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="degree">Degree *</Label>
              <Input
                id="degree"
                placeholder="Bachelor's Degree"
                {...form.register('degree')}
              />
            </div>
            
            <div>
              <Label htmlFor="field">Field of Study</Label>
              <Input
                id="field"
                placeholder="Computer Science"
                {...form.register('field')}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="institution">Institution *</Label>
            <Input
              id="institution"
              placeholder="University of Technology"
              {...form.register('institution')}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="month"
                {...form.register('startDate')}
              />
            </div>
            
            <div>
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="month"
                {...form.register('endDate')}
              />
            </div>
            
            <div>
              <Label htmlFor="gpa">GPA</Label>
              <Input
                id="gpa"
                placeholder="3.8"
                {...form.register('gpa')}
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Relevant coursework, honors, etc."
              rows={3}
              {...form.register('description')}
            />
          </div>
          
          <Button 
            type="submit" 
            disabled={createEducationMutation.isPending}
            className="bg-primary text-white hover:bg-blue-700 transition-colors"
          >
            {createEducationMutation.isPending ? 'Adding...' : 'Add Education'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}