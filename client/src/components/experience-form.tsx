import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { insertExperienceSchema, type Experience, type InsertExperience } from "@shared/schema";
import { Briefcase, Plus, Trash2, X } from "lucide-react";

interface ExperienceFormProps {
  userId: string;
}

export default function ExperienceForm({ userId }: ExperienceFormProps) {
  const [newAchievement, setNewAchievement] = useState("");
  const { toast } = useToast();

  const { data: experiences = [] } = useQuery({
    queryKey: ['/api/users', userId, 'experience'],
  });

  const form = useForm<InsertExperience>({
    resolver: zodResolver(insertExperienceSchema),
    defaultValues: {
      userId,
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
      achievements: [],
    },
  });

  const createExperienceMutation = useMutation({
    mutationFn: (data: InsertExperience) => 
      apiRequest('POST', `/api/users/${userId}/experience`, data),
    onSuccess: () => {
      toast({
        title: "Experience Added",
        description: "Work experience has been added successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/users', userId, 'experience'] });
      form.reset({
        userId,
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        current: false,
        description: "",
        achievements: [],
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add experience. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertExperience) => {
    createExperienceMutation.mutate(data);
  };

  const addAchievement = () => {
    if (!newAchievement.trim()) return;
    
    const currentAchievements = form.getValues('achievements') as string[] || [];
    form.setValue('achievements', [...currentAchievements, newAchievement.trim()]);
    setNewAchievement("");
  };

  const removeAchievement = (achievementToRemove: string) => {
    const currentAchievements = form.getValues('achievements') as string[] || [];
    form.setValue('achievements', currentAchievements.filter(achievement => achievement !== achievementToRemove));
  };

  const handleCurrentToggle = (checked: boolean) => {
    form.setValue('current', checked);
    if (checked) {
      form.setValue('endDate', "");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Briefcase className="text-primary mr-3" />
          Work Experience
        </CardTitle>
        <p className="text-slate-600">Add your professional work experience</p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Existing Experiences */}
        {(experiences as Experience[]).length > 0 && (
          <div className="space-y-4">
            <h4 className="font-medium text-slate-900">Your Experience</h4>
            {(experiences as Experience[]).map((exp) => (
              <div key={exp.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h5 className="font-medium text-slate-900">{exp.position}</h5>
                    <p className="text-sm text-slate-600">{exp.company}</p>
                    <p className="text-xs text-slate-500">
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </p>
                    {exp.description && <p className="text-sm text-slate-700 mt-2">{exp.description}</p>}
                    {exp.achievements && (exp.achievements as string[]).length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {(exp.achievements as string[]).map((achievement, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {achievement}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add New Experience Form */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <h4 className="font-medium text-slate-900">Add New Experience</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="position">Job Title *</Label>
              <Input
                id="position"
                placeholder="Senior Software Engineer"
                {...form.register('position')}
              />
            </div>
            
            <div>
              <Label htmlFor="company">Company *</Label>
              <Input
                id="company"
                placeholder="Tech Company Inc."
                {...form.register('company')}
              />
            </div>
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
                disabled={form.watch('current')}
                {...form.register('endDate')}
              />
            </div>
            
            <div className="flex items-center space-x-2 pt-6">
              <Checkbox
                id="current"
                checked={form.watch('current')}
                onCheckedChange={handleCurrentToggle}
              />
              <Label htmlFor="current" className="text-sm">Currently working here</Label>
            </div>
          </div>
          
          <div>
            <Label htmlFor="description">Job Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your role and responsibilities..."
              rows={3}
              {...form.register('description')}
            />
          </div>
          
          {/* Achievements */}
          <div>
            <Label>Key Achievements</Label>
            <div className="flex flex-wrap gap-2 mb-3">
              {(form.watch('achievements') as string[] || []).map((achievement: string) => (
                <Badge key={achievement} variant="secondary" className="flex items-center gap-1">
                  {achievement}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => removeAchievement(achievement)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newAchievement}
                onChange={(e) => setNewAchievement(e.target.value)}
                placeholder="Add an achievement"
                className="flex-1"
              />
              <Button type="button" onClick={addAchievement}>
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          </div>
          
          <Button 
            type="submit" 
            disabled={createExperienceMutation.isPending}
            className="bg-primary text-white hover:bg-blue-700 transition-colors"
          >
            {createExperienceMutation.isPending ? 'Adding...' : 'Add Experience'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}