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
import { insertUserSchema, type User, type InsertUser } from "@shared/schema";
import { UserCircle, Linkedin, Github, Globe, X, Plus } from "lucide-react";

interface ProfileFormProps {
  userId: string;
}

export default function ProfileForm({ userId }: ProfileFormProps) {
  const [newSkill, setNewSkill] = useState("");
  const { toast } = useToast();

  const { data: user, isLoading } = useQuery<User>({
    queryKey: ['/api/users', userId],
    enabled: false, // We'll start without an existing user
  });

  const form = useForm<InsertUser>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      location: user?.location || "",
      linkedin: user?.linkedin || "",
      github: user?.github || "",
      website: user?.website || "",
      summary: user?.summary || "",
      skills: user?.skills || [],
    },
  });

  const createUserMutation = useMutation({
    mutationFn: (data: InsertUser) => apiRequest('POST', '/api/users', data),
    onSuccess: () => {
      toast({
        title: "Profile Created",
        description: "Your profile has been created successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: (data: Partial<InsertUser>) => 
      apiRequest('PATCH', `/api/users/${userId}`, data),
    onSuccess: () => {
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/users', userId] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertUser) => {
    if (user) {
      updateUserMutation.mutate(data);
    } else {
      createUserMutation.mutate(data);
    }
  };

  const addSkill = () => {
    if (!newSkill.trim()) return;
    
    const currentSkills = form.getValues('skills') || [];
    if (!currentSkills.includes(newSkill.trim())) {
      form.setValue('skills', [...currentSkills, newSkill.trim()]);
    }
    setNewSkill("");
  };

  const removeSkill = (skillToRemove: string) => {
    const currentSkills = form.getValues('skills') || [];
    form.setValue('skills', (currentSkills as string[]).filter(skill => skill !== skillToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <UserCircle className="text-primary mr-3" />
          Profile Information
        </CardTitle>
        <p className="text-slate-600">Complete your profile to get better resume recommendations</p>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h4 className="font-medium text-slate-900">Personal Details</h4>
              
              <div>
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  placeholder="John Doe"
                  {...form.register('fullName')}
                />
                {form.formState.errors.fullName && (
                  <p className="text-sm text-red-600 mt-1">
                    {form.formState.errors.fullName.message}
                  </p>
                )}
              </div>
              
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john.doe@example.com"
                  {...form.register('email')}
                />
                {form.formState.errors.email && (
                  <p className="text-sm text-red-600 mt-1">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>
              
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  {...form.register('phone')}
                />
              </div>
              
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="San Francisco, CA"
                  {...form.register('location')}
                />
              </div>
            </div>
            
            {/* Professional Links */}
            <div className="space-y-4">
              <h4 className="font-medium text-slate-900">Professional Links</h4>
              
              <div>
                <Label htmlFor="linkedin">LinkedIn Profile</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Linkedin className="text-slate-400 h-4 w-4" />
                  </div>
                  <Input
                    id="linkedin"
                    type="url"
                    placeholder="linkedin.com/in/johndoe"
                    className="pl-10"
                    {...form.register('linkedin')}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="github">GitHub Profile</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Github className="text-slate-400 h-4 w-4" />
                  </div>
                  <Input
                    id="github"
                    type="url"
                    placeholder="github.com/johndoe"
                    className="pl-10"
                    {...form.register('github')}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="website">Portfolio Website</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Globe className="text-slate-400 h-4 w-4" />
                  </div>
                  <Input
                    id="website"
                    type="url"
                    placeholder="johndoe.dev"
                    className="pl-10"
                    {...form.register('website')}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="summary">Professional Summary</Label>
                <Textarea
                  id="summary"
                  placeholder="Brief professional summary..."
                  rows={3}
                  className="resize-none"
                  {...form.register('summary')}
                />
              </div>
            </div>
          </div>
          
          {/* Skills Section */}
          <div>
            <h4 className="font-medium text-slate-900 mb-4">Technical Skills</h4>
            <div className="space-y-4">
              <div>
                <Label>Add Skills</Label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {(form.watch('skills') as string[] || []).map((skill: string) => (
                    <Badge key={skill} variant="secondary" className="flex items-center gap-1">
                      {skill}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-transparent"
                        onClick={() => removeSkill(skill)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a skill and press Enter"
                    className="flex-1"
                  />
                  <Button type="button" onClick={addSkill}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={createUserMutation.isPending || updateUserMutation.isPending}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {createUserMutation.isPending || updateUserMutation.isPending ? 'Saving...' : 'Save Profile'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
