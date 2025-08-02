import jsPDF from 'jspdf';
import { type User, type Experience, type Education, type Project } from "@shared/schema";

interface GenerateResumeParams {
  user: User;
  experience?: Experience[];
  education?: Education[];
  projects?: Project[];
  templateId: string;
}

export async function generateResumePDF({
  user,
  experience = [],
  education = [],
  projects = [],
  templateId
}: GenerateResumeParams): Promise<void> {
  const pdf = new jsPDF();
  
  // Set font
  pdf.setFont('helvetica');
  
  let yPosition = 20;
  const margin = 20;
  const pageWidth = pdf.internal.pageSize.getWidth();
  const contentWidth = pageWidth - (margin * 2);
  
  // Helper function to add text with word wrapping
  const addText = (text: string, fontSize: number, fontStyle: string = 'normal', color: string = '#000000') => {
    pdf.setFontSize(fontSize);
    pdf.setFont('helvetica', fontStyle);
    pdf.setTextColor(color);
    
    const lines = pdf.splitTextToSize(text, contentWidth);
    pdf.text(lines, margin, yPosition);
    yPosition += (lines.length * (fontSize * 0.4)) + 5;
  };
  
  // Helper function to add section divider
  const addSectionDivider = () => {
    pdf.setDrawColor(37, 99, 235); // Primary blue color
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;
  };
  
  // Header - Name and contact info
  addText(user.fullName || 'Resume', 20, 'bold', '#1f2937');
  
  // Contact information
  const contactInfo = [];
  if (user.email) contactInfo.push(`Email: ${user.email}`);
  if (user.phone) contactInfo.push(`Phone: ${user.phone}`);
  if (user.location) contactInfo.push(`Location: ${user.location}`);
  if (user.linkedin) contactInfo.push(`LinkedIn: ${user.linkedin}`);
  if (user.github) contactInfo.push(`GitHub: ${user.github}`);
  if (user.website) contactInfo.push(`Website: ${user.website}`);
  
  if (contactInfo.length > 0) {
    addText(contactInfo.join(' | '), 10, 'normal', '#6b7280');
  }
  
  addSectionDivider();
  
  // Professional Summary
  if (user.summary) {
    addText('PROFESSIONAL SUMMARY', 14, 'bold', '#2563eb');
    addText(user.summary, 11);
    yPosition += 5;
  }
  
  // Skills
  if (user.skills && user.skills.length > 0) {
    addText('TECHNICAL SKILLS', 14, 'bold', '#2563eb');
    addText(user.skills.join(' • '), 11);
    yPosition += 5;
  }
  
  // Professional Experience
  if (experience.length > 0) {
    addText('PROFESSIONAL EXPERIENCE', 14, 'bold', '#2563eb');
    
    experience.forEach((exp) => {
      // Check if we need a new page
      if (yPosition > 250) {
        pdf.addPage();
        yPosition = 20;
      }
      
      addText(`${exp.position} at ${exp.company}`, 12, 'bold');
      
      const dateRange = `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`;
      addText(dateRange, 10, 'normal', '#6b7280');
      
      if (exp.description) {
        addText(exp.description, 11);
      }
      
      if (exp.achievements && exp.achievements.length > 0) {
        exp.achievements.forEach((achievement) => {
          addText(`• ${achievement}`, 11);
        });
      }
      
      yPosition += 8;
    });
  }
  
  // Education
  if (education.length > 0) {
    // Check if we need a new page
    if (yPosition > 230) {
      pdf.addPage();
      yPosition = 20;
    }
    
    addText('EDUCATION', 14, 'bold', '#2563eb');
    
    education.forEach((edu) => {
      const degreeText = `${edu.degree}${edu.field ? ` in ${edu.field}` : ''}`;
      addText(degreeText, 12, 'bold');
      addText(edu.institution, 11);
      
      if (edu.startDate && edu.endDate) {
        addText(`${edu.startDate} - ${edu.endDate}`, 10, 'normal', '#6b7280');
      }
      
      if (edu.gpa) {
        addText(`GPA: ${edu.gpa}`, 10);
      }
      
      if (edu.description) {
        addText(edu.description, 11);
      }
      
      yPosition += 5;
    });
  }
  
  // Projects
  if (projects.length > 0) {
    // Check if we need a new page
    if (yPosition > 230) {
      pdf.addPage();
      yPosition = 20;
    }
    
    addText('PROJECTS', 14, 'bold', '#2563eb');
    
    projects.forEach((project) => {
      addText(project.name, 12, 'bold');
      
      if (project.description) {
        addText(project.description, 11);
      }
      
      if (project.technologies && project.technologies.length > 0) {
        addText(`Technologies: ${project.technologies.join(', ')}`, 10, 'normal', '#6b7280');
      }
      
      const projectLinks = [];
      if (project.githubUrl) projectLinks.push(`GitHub: ${project.githubUrl}`);
      if (project.liveUrl) projectLinks.push(`Live: ${project.liveUrl}`);
      
      if (projectLinks.length > 0) {
        addText(projectLinks.join(' | '), 10, 'normal', '#2563eb');
      }
      
      yPosition += 8;
    });
  }
  
  // Generate filename
  const fileName = `${user.fullName?.replace(/\s+/g, '_') || 'Resume'}_${templateId}.pdf`;
  
  // Save the PDF
  pdf.save(fileName);
}

export function calculateATSScore(resumeText: string, jobKeywords: string[]): {
  keywordMatch: number;
  formatScore: number;
  readabilityScore: number;
  overallScore: number;
} {
  const resumeLower = resumeText.toLowerCase();
  
  // Calculate keyword match score
  const matchedKeywords = jobKeywords.filter(keyword => 
    resumeLower.includes(keyword.toLowerCase())
  );
  const keywordMatch = jobKeywords.length > 0 
    ? Math.round((matchedKeywords.length / jobKeywords.length) * 100)
    : 100;
  
  // Calculate format score (simple heuristics)
  let formatScore = 100;
  if (resumeText.length < 500) formatScore -= 20; // Too short
  if (resumeText.length > 5000) formatScore -= 10; // Too long
  if (!resumeText.includes('@')) formatScore -= 15; // No email
  
  // Calculate readability score (based on sentence length and complexity)
  const sentences = resumeText.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const avgSentenceLength = sentences.reduce((sum, sentence) => 
    sum + sentence.split(' ').length, 0) / sentences.length;
  
  let readabilityScore = 100;
  if (avgSentenceLength > 25) readabilityScore -= 20; // Too complex
  if (avgSentenceLength < 8) readabilityScore -= 10; // Too simple
  
  const overallScore = Math.round((keywordMatch + formatScore + readabilityScore) / 3);
  
  return {
    keywordMatch,
    formatScore: Math.max(0, Math.min(100, formatScore)),
    readabilityScore: Math.max(0, Math.min(100, readabilityScore)),
    overallScore: Math.max(0, Math.min(100, overallScore)),
  };
}
