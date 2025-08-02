import { useState } from "react";
import { useLocation } from "wouter";
import LoginForm from "@/components/auth/login-form";
import SignupForm from "@/components/auth/signup-form";
import { FileText, Sparkles, Target, Zap } from "lucide-react";

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const [isLogin, setIsLogin] = useState(true);

  const handleAuthSuccess = (user: any) => {
    // Redirect to dashboard after successful authentication
    setLocation("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding & Features */}
        <div className="hidden lg:block space-y-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-slate-900">ResumeAI</h1>
            </div>
            <p className="text-xl text-slate-600 leading-relaxed">
              Create ATS-optimized resumes with AI-powered job analysis and personalized recommendations.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">AI-Powered Analysis</h3>
                <p className="text-slate-600">Get instant feedback on how well your skills match job requirements</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Target className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">ATS-Friendly Templates</h3>
                <p className="text-slate-600">8 professional templates optimized to pass automated screening</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">Skill Gap Analysis</h3>
                <p className="text-slate-600">Discover missing skills and get GitHub project recommendations</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-slate-50 rounded-xl border border-slate-200">
            <p className="text-sm text-slate-600 italic">
              "This tool helped me identify key skills I was missing and land my dream job at a Fortune 500 company!"
            </p>
            <div className="mt-3 flex items-center space-x-2">
              <div className="w-8 h-8 bg-slate-300 rounded-full"></div>
              <div>
                <p className="font-medium text-slate-900 text-sm">Sarah Chen</p>
                <p className="text-xs text-slate-500">Software Engineer at Google</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Auth Form */}
        <div className="w-full">
          {isLogin ? (
            <LoginForm
              onSuccess={handleAuthSuccess}
              onSwitchToSignup={() => setIsLogin(false)}
            />
          ) : (
            <SignupForm
              onSuccess={handleAuthSuccess}
              onSwitchToLogin={() => setIsLogin(true)}
            />
          )}
        </div>
      </div>
    </div>
  );
}