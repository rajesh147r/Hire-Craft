import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || ""
});

export interface JobAnalysisResult {
  matchScore: number;
  missingSkills: string[];
  atsKeywords: string[];
  recommendations: string[];
}

export async function analyzeJobRequirements(
  userSkills: string[],
  jobTitle: string,
  jobRequirements: string
): Promise<JobAnalysisResult> {
  try {
    const prompt = `
You are an expert ATS (Applicant Tracking System) analyst and career advisor. 
Analyze the following job requirements against the candidate's current skills and provide a comprehensive analysis.

Candidate's Current Skills: ${userSkills.join(", ")}

Job Title: ${jobTitle}
Job Requirements: ${jobRequirements}

Please provide your analysis in the following JSON format:
{
  "matchScore": number (0-100),
  "missingSkills": ["skill1", "skill2"],
  "atsKeywords": ["keyword1", "keyword2"],
  "recommendations": ["recommendation1", "recommendation2"]
}

Focus on:
1. Calculate a realistic match score based on skill overlap
2. Identify specific skills the candidate is missing
3. Extract important ATS keywords from the job description
4. Provide actionable recommendations for improvement
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert ATS analyst. Respond with valid JSON only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 1000,
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      matchScore: Math.max(0, Math.min(100, result.matchScore || 0)),
      missingSkills: Array.isArray(result.missingSkills) ? result.missingSkills : [],
      atsKeywords: Array.isArray(result.atsKeywords) ? result.atsKeywords : [],
      recommendations: Array.isArray(result.recommendations) ? result.recommendations : [],
    };
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to analyze job requirements");
  }
}

export async function optimizeResumeForJob(
  userProfile: any,
  jobRequirements: string
): Promise<{ optimizedSummary: string; suggestedChanges: string[] }> {
  try {
    const prompt = `
As an expert resume writer, optimize the following profile for the given job requirements:

User Profile:
- Name: ${userProfile.fullName}
- Current Summary: ${userProfile.summary || "No summary provided"}
- Skills: ${userProfile.skills?.join(", ") || "No skills listed"}
- Experience: ${JSON.stringify(userProfile.experience || [])}

Job Requirements: ${jobRequirements}

Provide optimization suggestions in JSON format:
{
  "optimizedSummary": "Rewritten professional summary optimized for this role",
  "suggestedChanges": ["change1", "change2", "change3"]
}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert resume writer. Respond with valid JSON only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content || "{}");
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to optimize resume");
  }
}
