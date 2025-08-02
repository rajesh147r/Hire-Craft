import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  User as UserIcon, 
  Bot, 
  Download,
  Github,
  Linkedin,
  Globe,
  Search,
  TrendingUp,
  Clock
} from "lucide-react";
import ProfileForm from "@/components/profile-form";
import ExperienceForm from "@/components/experience-form";
import EducationForm from "@/components/education-form";
import ProjectsForm from "@/components/projects-form";
import JobAnalysis from "@/components/job-analysis";
import TemplateGallery from "@/components/template-gallery";
import ATSScore from "@/components/ats-score";
import PDFGenerator from "@/components/pdf-generator";
import { type User } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState<'profile' | 'experience' | 'education' | 'projects' | 'analysis' | 'templates'>('profile');
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  
  const { user, logout } = useAuth();
  const userId = user?.id;

  // Remove duplicate user query since we get user from auth hook

  const { data: templates } = useQuery({
    queryKey: ['/api/templates'],
  });

  const profileCompletion = user ? calculateProfileCompletion(user) : 0;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <FileText className="text-primary text-2xl mr-3" />
              <h1 className="text-xl font-bold text-slate-900">ResumeAI</h1>
            </div>
            <nav className="hidden md:flex space-x-6">
              <button 
                onClick={() => setActiveSection('profile')}
                className={`text-slate-600 hover:text-primary transition-colors text-sm ${activeSection === 'profile' ? 'text-primary font-medium' : ''}`}
              >
                Profile
              </button>
              <button 
                onClick={() => setActiveSection('experience')}
                className={`text-slate-600 hover:text-primary transition-colors text-sm ${activeSection === 'experience' ? 'text-primary font-medium' : ''}`}
              >
                Experience
              </button>
              <button 
                onClick={() => setActiveSection('education')}
                className={`text-slate-600 hover:text-primary transition-colors text-sm ${activeSection === 'education' ? 'text-primary font-medium' : ''}`}
              >
                Education
              </button>
              <button 
                onClick={() => setActiveSection('projects')}
                className={`text-slate-600 hover:text-primary transition-colors text-sm ${activeSection === 'projects' ? 'text-primary font-medium' : ''}`}
              >
                Projects
              </button>
              <button 
                onClick={() => setActiveSection('templates')}
                className={`text-slate-600 hover:text-primary transition-colors text-sm ${activeSection === 'templates' ? 'text-primary font-medium' : ''}`}
              >
                Templates
              </button>
              <button 
                onClick={() => setActiveSection('analysis')}
                className={`text-slate-600 hover:text-primary transition-colors text-sm ${activeSection === 'analysis' ? 'text-primary font-medium' : ''}`}
              >
                AI Analysis
              </button>
            </nav>
            <div className="flex items-center space-x-4">
              {userId && <PDFGenerator userId={userId} />}
              <div className="flex items-center space-x-2">
                {user?.profileImageUrl ? (
                  <img 
                    src={user.profileImageUrl} 
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-slate-300 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium text-slate-600">
                      {user?.fullName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </span>
                  </div>
                )}
                <button
                  onClick={logout}
                  className="text-sm text-slate-600 hover:text-red-600 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Welcome Section */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                      Welcome back, {user?.fullName || "Job Seeker"}
                    </h2>
                    <p className="text-slate-600 mt-1">Build your perfect ATS-optimized resume</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-500">Profile Completion</div>
                    <div className="flex items-center mt-1">
                      <Progress value={profileCompletion} className="w-32 mr-3" />
                      <span className="text-sm font-medium text-slate-700">{profileCompletion}%</span>
                    </div>
                  </div>
                </div>
                
                {/* Quick Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setActiveSection('profile')}
                    className="flex items-center p-4 h-auto border border-slate-200 hover:border-primary hover:bg-blue-50"
                  >
                    <UserIcon className="text-primary text-xl mr-3" />
                    <div className="text-left">
                      <div className="font-medium text-slate-900">Update Profile</div>
                      <div className="text-sm text-slate-500">Personal & contact info</div>
                    </div>
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => setActiveSection('analysis')}
                    className="flex items-center p-4 h-auto border border-slate-200 hover:border-primary hover:bg-blue-50"
                  >
                    <Bot className="text-primary text-xl mr-3" />
                    <div className="text-left">
                      <div className="font-medium text-slate-900">AI Analysis</div>
                      <div className="text-sm text-slate-500">Job matching & skills</div>
                    </div>
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => setActiveSection('templates')}
                    className="flex items-center p-4 h-auto border border-slate-200 hover:border-primary hover:bg-blue-50"
                  >
                    <FileText className="text-primary text-xl mr-3" />
                    <div className="text-left">
                      <div className="font-medium text-slate-900">Templates</div>
                      <div className="text-sm text-slate-500">8 ATS-friendly designs</div>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Dynamic Content Based on Active Section */}
            {activeSection === 'profile' && <ProfileForm userId={userId} />}
            {activeSection === 'experience' && <ExperienceForm userId={userId} />}
            {activeSection === 'education' && <EducationForm userId={userId} />}
            {activeSection === 'projects' && <ProjectsForm userId={userId} />}
            {activeSection === 'analysis' && <JobAnalysis userId={userId} />}
            {activeSection === 'templates' && <TemplateGallery onClose={() => setActiveSection('profile')} />}

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Resume Templates Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="text-primary mr-3" />
                  Resume Templates
                </CardTitle>
                <p className="text-slate-600">8 ATS-friendly designs</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {(templates as any[])?.slice(0, 4).map((template: any) => (
                    <div 
                      key={template.id}
                      className="border border-slate-200 rounded-lg p-3 hover:border-primary cursor-pointer transition-colors"
                    >
                      <div className="bg-slate-100 h-24 rounded mb-2 flex items-center justify-center">
                        <FileText className="text-slate-400 text-2xl" />
                      </div>
                      <div className="text-xs font-medium text-slate-900">{template.name}</div>
                      <div className="text-xs text-slate-500">{template.description}</div>
                    </div>
                  ))}
                </div>
                
                <Button
                  variant="outline"
                  onClick={() => setActiveSection('templates')}
                  className="w-full mt-4"
                >
                  View All Templates
                </Button>
              </CardContent>
            </Card>

            {/* ATS Score */}
            <ATSScore />

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="text-sm text-slate-900">Profile created</div>
                      <div className="text-xs text-slate-500">Just now</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-secondary rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="text-sm text-slate-900">Ready to add experience</div>
                      <div className="text-xs text-slate-500">Complete your profile</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
                    <div className="flex-1">
                      <div className="text-sm text-slate-900">8 templates available</div>
                      <div className="text-xs text-slate-500">Choose your style</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}

function calculateProfileCompletion(user: any): number {
  let completed = 0;
  const total = 8;
  
  if (user.fullName) completed++;
  if (user.email) completed++;
  if (user.phone) completed++;
  if (user.location) completed++;
  if (user.linkedin) completed++;
  if (user.github) completed++;
  if (user.summary) completed++;
  if (user.skills && user.skills.length > 0) completed++;
  
  return Math.round((completed / total) * 100);
}
