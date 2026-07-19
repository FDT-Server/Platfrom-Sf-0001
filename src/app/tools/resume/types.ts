export interface PersonalDetails {
  name: string;
  title?: string; // e.g. Software Engineer / Student
  email: string;
  phone?: string;
  address?: string;
  portfolio?: string;
  linkedin?: string;
  github?: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  duration: string;
  location?: string; // e.g. San Francisco, CA / Remote
  description: string;
  achievements: string[];
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  fieldOfStudy: string;
  branch?: string; // e.g. Computer Science
  duration: string;
  grade?: string; // CGPA or GPA
  description?: string; // Optional description
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
}

export interface Skill {
  id: string;
  name: string;
  level: number; // 0 to 100
  group?: string; // e.g. Frontend, Backend, etc.
}

export interface Language {
  id: string;
  name: string;
  level: string; // e.g. Native, Fluent, Intermediate
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string;
  link?: string; // Link or credential URL
  credentialUrl?: string; // Credential URL
}

export interface Award {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description?: string;
}

export interface Reference {
  id: string;
  name: string;
  relationship: string; // Title / relationship
  company: string;
  email: string;
  phone: string;
}

export interface CustomSectionItem {
  id: string;
  title: string;
  description: string;
}

export interface CustomSection {
  title: string;
  items: CustomSectionItem[];
}

export interface ResumeData {
  title: string;
  template: "modern" | "professional" | "minimal" | "executive";
  personalDetails: PersonalDetails;
  summary: string;
  experience: WorkExperience[];
  education: Education[];
  projects: Project[];
  skills: Skill[];
  languages: Language[];
  certifications: Certification[];
  awards: Award[];
  achievements?: string[]; // Stand-alone achievements tag/list input
  interests?: string[]; // Stand-alone interests tag/list input
  references?: Reference[]; // Optional list of references
  customSections: CustomSection[];
}
