export interface PersonalDetails {
  name: string;
  title?: string;
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
  location?: string;
  description: string;
  achievements: string[];
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  fieldOfStudy: string;
  branch?: string;
  duration: string;
  grade?: string;
  description?: string;
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
  level: number;
  group?: string;
}

export interface Language {
  id: string;
  name: string;
  level: string;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string;
  link?: string;
  credentialUrl?: string;
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
  relationship: string;
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
  achievements?: string[];
  interests?: string[];
  references?: Reference[];
  customSections: CustomSection[];
}
