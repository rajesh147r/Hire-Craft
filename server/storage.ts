import { 
  type User, 
  type InsertUser, 
  type Education,
  type InsertEducation,
  type Experience,
  type InsertExperience,
  type Project,
  type InsertProject,
  type JobAnalysis,
  type InsertJobAnalysis,
  type ResumeTemplate
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined>;
  
  // Education operations
  getEducationByUserId(userId: string): Promise<Education[]>;
  createEducation(education: InsertEducation): Promise<Education>;
  updateEducation(id: string, education: Partial<InsertEducation>): Promise<Education | undefined>;
  deleteEducation(id: string): Promise<boolean>;
  
  // Experience operations
  getExperienceByUserId(userId: string): Promise<Experience[]>;
  createExperience(experience: InsertExperience): Promise<Experience>;
  updateExperience(id: string, experience: Partial<InsertExperience>): Promise<Experience | undefined>;
  deleteExperience(id: string): Promise<boolean>;
  
  // Project operations
  getProjectsByUserId(userId: string): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, project: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: string): Promise<boolean>;
  
  // Job analysis operations
  getJobAnalysesByUserId(userId: string): Promise<JobAnalysis[]>;
  createJobAnalysis(analysis: InsertJobAnalysis): Promise<JobAnalysis>;
  
  // Template operations
  getAllTemplates(): Promise<ResumeTemplate[]>;
  getTemplate(id: string): Promise<ResumeTemplate | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private education: Map<string, Education>;
  private experience: Map<string, Experience>;
  private projects: Map<string, Project>;
  private jobAnalyses: Map<string, JobAnalysis>;
  private templates: Map<string, ResumeTemplate>;

  constructor() {
    this.users = new Map();
    this.education = new Map();
    this.experience = new Map();
    this.projects = new Map();
    this.jobAnalyses = new Map();
    this.templates = new Map();
    
    // Initialize with sample templates
    this.initializeTemplates();
  }

  private initializeTemplates() {
    const templates: ResumeTemplate[] = [
      {
        id: "modern",
        name: "Modern Professional",
        description: "Clean single-column layout with modern typography. Perfect for tech and business roles.",
        category: "professional",
        templateData: {},
        isAts: true,
      },
      {
        id: "classic",
        name: "Classic ATS",
        description: "Traditional format guaranteed to pass all ATS systems. Conservative and reliable.",
        category: "traditional",
        templateData: {},
        isAts: true,
      },
      {
        id: "creative",
        name: "Creative ATS",
        description: "Balanced design with subtle creative elements while maintaining ATS compatibility.",
        category: "creative",
        templateData: {},
        isAts: true,
      },
      {
        id: "minimal",
        name: "Minimalist",
        description: "Ultra-clean design that lets your content shine. Great for any industry.",
        category: "minimal",
        templateData: {},
        isAts: true,
      },
      {
        id: "executive",
        name: "Executive",
        description: "Sophisticated design for senior leadership positions. Emphasizes achievements and metrics.",
        category: "executive",
        templateData: {},
        isAts: true,
      },
      {
        id: "tech",
        name: "Tech Focused",
        description: "Optimized for software engineers and tech professionals. Highlights technical skills.",
        category: "technology",
        templateData: {},
        isAts: true,
      },
      {
        id: "academic",
        name: "Academic",
        description: "Structured format for researchers, professors, and academic professionals.",
        category: "academic",
        templateData: {},
        isAts: true,
      },
      {
        id: "international",
        name: "Consultant",
        description: "Professional layout ideal for consultants and business analysts. Results-focused.",
        category: "international",
        templateData: {},
        isAts: true,
      },
    ];

    templates.forEach(template => {
      this.templates.set(template.id, template);
    });
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      createdAt: new Date().toISOString(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, userData: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Education operations
  async getEducationByUserId(userId: string): Promise<Education[]> {
    return Array.from(this.education.values()).filter(edu => edu.userId === userId);
  }

  async createEducation(insertEducation: InsertEducation): Promise<Education> {
    const id = randomUUID();
    const education: Education = { ...insertEducation, id };
    this.education.set(id, education);
    return education;
  }

  async updateEducation(id: string, educationData: Partial<InsertEducation>): Promise<Education | undefined> {
    const education = this.education.get(id);
    if (!education) return undefined;
    
    const updatedEducation = { ...education, ...educationData };
    this.education.set(id, updatedEducation);
    return updatedEducation;
  }

  async deleteEducation(id: string): Promise<boolean> {
    return this.education.delete(id);
  }

  // Experience operations
  async getExperienceByUserId(userId: string): Promise<Experience[]> {
    return Array.from(this.experience.values()).filter(exp => exp.userId === userId);
  }

  async createExperience(insertExperience: InsertExperience): Promise<Experience> {
    const id = randomUUID();
    const experience: Experience = { ...insertExperience, id };
    this.experience.set(id, experience);
    return experience;
  }

  async updateExperience(id: string, experienceData: Partial<InsertExperience>): Promise<Experience | undefined> {
    const experience = this.experience.get(id);
    if (!experience) return undefined;
    
    const updatedExperience = { ...experience, ...experienceData };
    this.experience.set(id, updatedExperience);
    return updatedExperience;
  }

  async deleteExperience(id: string): Promise<boolean> {
    return this.experience.delete(id);
  }

  // Project operations
  async getProjectsByUserId(userId: string): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(project => project.userId === userId);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = randomUUID();
    const project: Project = { ...insertProject, id };
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: string, projectData: Partial<InsertProject>): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) return undefined;
    
    const updatedProject = { ...project, ...projectData };
    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async deleteProject(id: string): Promise<boolean> {
    return this.projects.delete(id);
  }

  // Job analysis operations
  async getJobAnalysesByUserId(userId: string): Promise<JobAnalysis[]> {
    return Array.from(this.jobAnalyses.values()).filter(analysis => analysis.userId === userId);
  }

  async createJobAnalysis(insertAnalysis: InsertJobAnalysis): Promise<JobAnalysis> {
    const id = randomUUID();
    const analysis: JobAnalysis = { 
      ...insertAnalysis, 
      id,
      matchScore: 0,
      missingSkills: [],
      recommendedProjects: [],
      atsKeywords: [],
      createdAt: new Date().toISOString(),
    };
    this.jobAnalyses.set(id, analysis);
    return analysis;
  }

  // Template operations
  async getAllTemplates(): Promise<ResumeTemplate[]> {
    return Array.from(this.templates.values());
  }

  async getTemplate(id: string): Promise<ResumeTemplate | undefined> {
    return this.templates.get(id);
  }
}

export const storage = new MemStorage();
