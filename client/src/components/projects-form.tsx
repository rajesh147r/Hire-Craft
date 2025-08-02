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
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { insertProjectSchema, type Project, type InsertProject } from "@shared/schema";
import { Code, Plus, X, ExternalLink, Github } from "lucide-react";

interface ProjectsFormProps {
  userId: string;
}

export default function ProjectsForm({ userId }: ProjectsFormProps) {
  const [newTechnology, setNewTechnology] = useState("");
  const { toast } = useToast();

  const { data: projects = [] } = useQuery({
    queryKey: ['/api/users', userId, 'projects'],
  });

  const form = useForm<InsertProject>({
    resolver: zodResolver(insertProjectSchema),
    defaultValues: {
      userId,
      name: "",
      description: "",
      technologies: [],
      githubUrl: "",
      liveUrl: "",
      startDate: "",
      endDate: "",
    },
  });

  const createProjectMutation = useMutation({
    mutationFn: (data: InsertProject) => 
      apiRequest('POST', `/api/users/${userId}/projects`, data),
    onSuccess: () => {
      toast({
        title: "Project Added",
        description: "Project has been added successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/users', userId, 'projects'] });
      form.reset({
        userId,
        name: "",
        description: "",
        technologies: [],
        githubUrl: "",
        liveUrl: "",
        startDate: "",
        endDate: "",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add project. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertProject) => {
    createProjectMutation.mutate(data);
  };

  const addTechnology = () => {
    if (!newTechnology.trim()) return;
    
    const currentTechnologies = form.getValues('technologies') as string[] || [];
    if (!currentTechnologies.includes(newTechnology.trim())) {
      form.setValue('technologies', [...currentTechnologies, newTechnology.trim()]);
    }
    setNewTechnology("");
  };

  const removeTechnology = (techToRemove: string) => {
    const currentTechnologies = form.getValues('technologies') as string[] || [];
    form.setValue('technologies', currentTechnologies.filter(tech => tech !== techToRemove));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Code className="text-primary mr-3" />
          Projects
        </CardTitle>
        <p className="text-slate-600">Showcase your coding projects and portfolio</p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Existing Projects */}
        {(projects as Project[]).length > 0 && (
          <div className="space-y-4">
            <h4 className="font-medium text-slate-900">Your Projects</h4>
            {(projects as Project[]).map((project) => (
              <div key={project.id} className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h5 className="font-medium text-slate-900">{project.name}</h5>
                    {project.description && (
                      <p className="text-sm text-slate-700 mt-2">{project.description}</p>
                    )}
                    {project.technologies && (project.technologies as string[]).length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {(project.technologies as string[]).map((tech) => (
                          <Badge key={tech} variant="outline" className="text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-2 mt-2">
                      {project.githubUrl && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(project.githubUrl!, '_blank')}
                          className="text-slate-600 hover:text-primary"
                        >
                          <Github className="h-4 w-4 mr-1" />
                          Code
                        </Button>
                      )}
                      {project.liveUrl && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(project.liveUrl!, '_blank')}
                          className="text-slate-600 hover:text-primary"
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Live Demo
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add New Project Form */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <h4 className="font-medium text-slate-900">Add New Project</h4>
          
          <div>
            <Label htmlFor="name">Project Name *</Label>
            <Input
              id="name"
              placeholder="My Awesome Project"
              {...form.register('name')}
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe what this project does and your role in it..."
              rows={3}
              {...form.register('description')}
            />
          </div>
          
          {/* Technologies */}
          <div>
            <Label>Technologies Used</Label>
            <div className="flex flex-wrap gap-2 mb-3">
              {(form.watch('technologies') as string[] || []).map((tech: string) => (
                <Badge key={tech} variant="secondary" className="flex items-center gap-1">
                  {tech}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => removeTechnology(tech)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newTechnology}
                onChange={(e) => setNewTechnology(e.target.value)}
                placeholder="React, Node.js, Python..."
                className="flex-1"
              />
              <Button type="button" onClick={addTechnology}>
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="githubUrl">GitHub URL</Label>
              <Input
                id="githubUrl"
                type="url"
                placeholder="https://github.com/username/project"
                {...form.register('githubUrl')}
              />
            </div>
            
            <div>
              <Label htmlFor="liveUrl">Live Demo URL</Label>
              <Input
                id="liveUrl"
                type="url"
                placeholder="https://myproject.com"
                {...form.register('liveUrl')}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>
          
          <Button 
            type="submit" 
            disabled={createProjectMutation.isPending}
            className="bg-primary text-white hover:bg-blue-700 transition-colors"
          >
            {createProjectMutation.isPending ? 'Adding...' : 'Add Project'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}