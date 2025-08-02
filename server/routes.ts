import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertEducationSchema, 
  insertExperienceSchema, 
  insertProjectSchema, 
  insertJobAnalysisSchema 
} from "@shared/schema";
import { analyzeJobRequirements, optimizeResumeForJob } from "./services/openai";
import { searchProjectsBySkills, getUserGitHubStats } from "./services/github";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // User routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.patch("/api/users/:id", async (req, res) => {
    try {
      const userData = insertUserSchema.partial().parse(req.body);
      const user = await storage.updateUser(req.params.id, userData);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Education routes
  app.get("/api/users/:userId/education", async (req, res) => {
    try {
      const education = await storage.getEducationByUserId(req.params.userId);
      res.json(education);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch education" });
    }
  });

  app.post("/api/users/:userId/education", async (req, res) => {
    try {
      const educationData = insertEducationSchema.parse({
        ...req.body,
        userId: req.params.userId,
      });
      const education = await storage.createEducation(educationData);
      res.status(201).json(education);
    } catch (error) {
      res.status(400).json({ message: "Invalid education data", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Experience routes
  app.get("/api/users/:userId/experience", async (req, res) => {
    try {
      const experience = await storage.getExperienceByUserId(req.params.userId);
      res.json(experience);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch experience" });
    }
  });

  app.post("/api/users/:userId/experience", async (req, res) => {
    try {
      const experienceData = insertExperienceSchema.parse({
        ...req.body,
        userId: req.params.userId,
      });
      const experience = await storage.createExperience(experienceData);
      res.status(201).json(experience);
    } catch (error) {
      res.status(400).json({ message: "Invalid experience data", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Project routes
  app.get("/api/users/:userId/projects", async (req, res) => {
    try {
      const projects = await storage.getProjectsByUserId(req.params.userId);
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.post("/api/users/:userId/projects", async (req, res) => {
    try {
      const projectData = insertProjectSchema.parse({
        ...req.body,
        userId: req.params.userId,
      });
      const project = await storage.createProject(projectData);
      res.status(201).json(project);
    } catch (error) {
      res.status(400).json({ message: "Invalid project data", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Job analysis routes
  app.post("/api/users/:userId/analyze-job", async (req, res) => {
    try {
      const { jobTitle, jobRequirements } = req.body;
      
      if (!jobTitle || !jobRequirements) {
        return res.status(400).json({ message: "Job title and requirements are required" });
      }

      // Get user data
      const user = await storage.getUser(req.params.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Analyze job requirements
      const analysis = await analyzeJobRequirements(
        user.skills || [],
        jobTitle,
        jobRequirements
      );

      // Get GitHub project recommendations for missing skills
      const recommendedProjects = await searchProjectsBySkills(analysis.missingSkills);

      // Save analysis
      const jobAnalysisData = {
        userId: req.params.userId,
        jobTitle,
        jobRequirements,
      };

      const savedAnalysis = await storage.createJobAnalysis(jobAnalysisData);
      
      // Update with AI results (in a real app, you'd update the database)
      const fullAnalysis = {
        ...savedAnalysis,
        matchScore: analysis.matchScore,
        missingSkills: analysis.missingSkills,
        atsKeywords: analysis.atsKeywords,
        recommendedProjects: recommendedProjects.map(project => ({
          name: project.name,
          description: project.description,
          url: project.url,
        })),
      };

      res.json(fullAnalysis);
    } catch (error) {
      console.error("Job analysis error:", error);
      res.status(500).json({ message: "Failed to analyze job requirements" });
    }
  });

  app.get("/api/users/:userId/job-analyses", async (req, res) => {
    try {
      const analyses = await storage.getJobAnalysesByUserId(req.params.userId);
      res.json(analyses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch job analyses" });
    }
  });

  // Template routes
  app.get("/api/templates", async (req, res) => {
    try {
      const templates = await storage.getAllTemplates();
      res.json(templates);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch templates" });
    }
  });

  app.get("/api/templates/:id", async (req, res) => {
    try {
      const template = await storage.getTemplate(req.params.id);
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      res.json(template);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch template" });
    }
  });

  // Resume optimization
  app.post("/api/users/:userId/optimize-resume", async (req, res) => {
    try {
      const { jobRequirements } = req.body;
      
      if (!jobRequirements) {
        return res.status(400).json({ message: "Job requirements are required" });
      }

      const user = await storage.getUser(req.params.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const experience = await storage.getExperienceByUserId(req.params.userId);
      
      const optimization = await optimizeResumeForJob(
        { ...user, experience },
        jobRequirements
      );

      res.json(optimization);
    } catch (error) {
      console.error("Resume optimization error:", error);
      res.status(500).json({ message: "Failed to optimize resume" });
    }
  });

  // GitHub integration
  app.get("/api/github/:username", async (req, res) => {
    try {
      const stats = await getUserGitHubStats(req.params.username);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch GitHub profile" });
    }
  });

  // Calculate ATS score
  app.post("/api/calculate-ats-score", async (req, res) => {
    try {
      const { resumeContent, jobRequirements } = req.body;
      
      // Simple ATS scoring algorithm
      const keywords = jobRequirements.toLowerCase().split(/\s+/);
      const resumeText = resumeContent.toLowerCase();
      
      const matchedKeywords = keywords.filter((keyword: string) => 
        keyword.length > 3 && resumeText.includes(keyword)
      );
      
      const keywordScore = Math.round((matchedKeywords.length / keywords.length) * 100);
      const formatScore = 92; // Assume good format
      const readabilityScore = 85; // Assume good readability
      
      const overallScore = Math.round((keywordScore + formatScore + readabilityScore) / 3);
      
      res.json({
        keywordMatch: keywordScore,
        formatScore,
        readabilityScore,
        overallScore,
        matchedKeywords: matchedKeywords.length,
        totalKeywords: keywords.length,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to calculate ATS score" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
