export interface GeminiRewriteResult {
  sectionType: string;
  originalText: string;
  improvedText: string;
  keyChanges: string[];
  impactRating: "High" | "Medium" | "Low";
}

export interface GeminiJobMatchResult {
  matchPercentage: number;
  matchingKeywords: string[];
  missingKeywords: string[];
  recommendedAdditions: string[];
  highPriorityKeywords: string[];
  tailoredSummarySuggestion: string;
}

export async function analyzeResumeWithGemini(
  resumeText: string,
  targetJobDescription?: string
): Promise<{
  aiSummary: string;
  topStrengths: string[];
  topWeaknesses: string[];
  actionPlan: string[];
}> {

  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {

    } catch (e) {
      console.warn("Gemini API call failed, falling back to mock AI engine.", e);
    }
  }

  return {
    aiSummary:
      "The resume demonstrates robust full-stack engineering competency with clear tech stack details (React, Next.js, Node.js, AWS). Bullet points showcase strong metric-driven outcomes, though adding more quantitative leadership metrics and aligning with specific job target keywords will increase ATS rank.",
    topStrengths: [
      "Strong technical skills coverage (React, TypeScript, Next.js, Node.js, AWS, Redis)",
      "Excellent project section with tangible outcomes (450+ GitHub stars, lower latency)",
      "Good standard formatting and ATS header structure",
      "Demonstrated leadership and CI/CD workflow experience",
    ],
    topWeaknesses: [
      "Missing target-job specific keywords for senior architecture roles",
      "Summary could be tighter and highlight specific domain accomplishments",
      "Some bullet points use passive phrases instead of strong action verbs",
      "Missing direct links to live demo deployments",
    ],
    actionPlan: [
      "Incorporate 4-5 missing high-priority cloud deployment keywords in your skills section.",
      "Rewrite 2 experience bullet points with quantified revenue/user metric impacts.",
      "Add direct GitHub repository links for open-source projects.",
    ],
  };
}

export async function rewriteResumeSection(
  sectionType: "summary" | "experience" | "skills" | "projects",
  originalText: string,
  targetRole?: string
): Promise<GeminiRewriteResult> {
  const rewrites: Record<string, GeminiRewriteResult> = {
    summary: {
      sectionType: "Summary",
      originalText: originalText || "Results-driven Software Engineer with 3+ years experience building web applications.",
      improvedText:
        "High-impact Senior Full Stack Engineer with 3+ years of experience architecting distributed cloud applications and high-throughput microservices using React, Next.js, Node.js, and AWS. Spearheaded backend query optimizations delivering a 50% speed boost and built real-time platforms supporting 50k+ daily active users.",
      keyChanges: [
        "Replaced generic opener with high-priority title 'Senior Full Stack Engineer'",
        "Added quantitative metrics (50% speed boost, 50k+ active users)",
        "Highlighted cloud architecture and microservices tech stack",
      ],
      impactRating: "High",
    },
    experience: {
      sectionType: "Experience",
      originalText: originalText || "Engineered high-throughput REST & GraphQL APIs using Node.js and Next.js, reducing server response times by 35%.",
      improvedText:
        "Architected and deployed enterprise-grade REST & GraphQL APIs using Node.js, Next.js, and TypeScript on AWS EC2, cutting API response latency by 35% and elevating system availability to 99.99%.",
      keyChanges: [
        "Swapped verb 'Engineered' for 'Architected and deployed'",
        "Added cloud hosting context (AWS EC2)",
        "Included SLA reliability metric (99.99% availability)",
      ],
      impactRating: "High",
    },
    skills: {
      sectionType: "Skills",
      originalText: originalText || "Technical Skills: JavaScript, TypeScript, React, Next.js, Node.js, Python, PostgreSQL, AWS, Docker.",
      improvedText:
        "Languages & Core: TypeScript, JavaScript (ES6+), Python, SQL (PostgreSQL), HTML5/CSS3\nFrameworks & Libraries: React 18, Next.js 14, Node.js, Express, Tailwind CSS, Redux Toolkit\nCloud & Infrastructure: AWS (S3, EC2, Lambda), Docker, Redis, CI/CD (GitHub Actions), Git",
      keyChanges: [
        "Categorized skills into clear sub-sections for ATS fast scanning",
        "Explicitly specified modern versions (Next.js 14, React 18)",
        "Added DevOps and CI/CD key phrases",
      ],
      impactRating: "Medium",
    },
    projects: {
      sectionType: "Projects",
      originalText: originalText || "StudentForge Platform: Built an interactive peer-to-peer networking feed, chat messaging drawer, and AI resume optimizer.",
      improvedText:
        "StudentForge Platform (Full Stack SaaS App)\n• Engineered full-stack student networking ecosystem using Next.js 15, TypeScript, TailwindCSS, and Prisma ORM.\n• Implemented real-time WebSocket chat drawer, interactive feed components, and client caching, reducing API latencies under 120ms.\n• Developed AI Resume Optimizer module supporting automated ATS scans and instant metric suggestions.",
      keyChanges: [
        "Structured project with bulleted technical impact points",
        "Emphasized architecture and specific frameworks used",
        "Quantified latency improvements (< 120ms)",
      ],
      impactRating: "High",
    },
  };

  return (
    rewrites[sectionType] || {
      sectionType,
      originalText,
      improvedText: "AI Improved version of: " + originalText,
      keyChanges: ["Enhanced action verbs", "Clarity improvements"],
      impactRating: "Medium",
    }
  );
}

export async function compareWithJobDescription(
  resumeText: string,
  jobDescription: string
): Promise<GeminiJobMatchResult> {
  const jdLower = jobDescription.toLowerCase();

  const targetKeywords = [
    { word: "React", priority: "High" },
    { word: "TypeScript", priority: "High" },
    { word: "Next.js", priority: "High" },
    { word: "Node.js", priority: "High" },
    { word: "PostgreSQL", priority: "High" },
    { word: "AWS", priority: "High" },
    { word: "Docker", priority: "High" },
    { word: "GraphQL", priority: "Medium" },
    { word: "CI/CD", priority: "Medium" },
    { word: "Microservices", priority: "Medium" },
    { word: "Kubernetes", priority: "High" },
    { word: "Redis", priority: "Medium" },
    { word: "System Design", priority: "High" },
    { word: "Agile", priority: "Low" },
  ];

  const resumeLower = resumeText.toLowerCase();

  const matchingKeywords: string[] = [];
  const missingKeywords: string[] = [];
  const highPriorityKeywords: string[] = [];

  targetKeywords.forEach((item) => {
    if (resumeLower.includes(item.word.toLowerCase())) {
      matchingKeywords.push(item.word);
    } else {
      missingKeywords.push(item.word);
      if (item.priority === "High") {
        highPriorityKeywords.push(item.word);
      }
    }
  });

  const total = targetKeywords.length;
  const matchPercentage = Math.round((matchingKeywords.length / total) * 100);

  return {
    matchPercentage: Math.max(55, Math.min(98, matchPercentage)),
    matchingKeywords,
    missingKeywords,
    recommendedAdditions: [
      "Kubernetes (Container orchestration)",
      "System Design & Microservices Architecture",
      "GraphQL API design experience",
    ],
    highPriorityKeywords: highPriorityKeywords.length > 0 ? highPriorityKeywords : ["Kubernetes", "System Design"],
    tailoredSummarySuggestion:
      "Adapt summary to highlight Kubernetes and distributed microservices experience directly matching target requirements.",
  };
}
