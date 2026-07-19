import { z } from "zod";

export const personalDetailsSchema = z.object({
  name: z.string().min(1, "Name is required"),
  title: z.string().optional(),
  email: z.string().email("Invalid email address").or(z.literal("")),
  phone: z.string().optional(),
  address: z.string().optional(),
  portfolio: z.string().url("Invalid URL").or(z.literal("")),
  linkedin: z.string().url("Invalid URL").or(z.literal("")),
  github: z.string().url("Invalid URL").or(z.literal("")),
});

export const summarySchema = z.object({
  summary: z.string().max(1000, "Summary must be under 1000 characters").optional().or(z.literal("")),
});

export const workExperienceSchema = z.object({
  company: z.string().min(1, "Company is required"),
  role: z.string().min(1, "Role is required"),
  duration: z.string().min(1, "Duration is required"),
  location: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  achievements: z.array(z.string()).default([]),
});

export const educationSchema = z.object({
  school: z.string().min(1, "Institution is required"),
  degree: z.string().min(1, "Degree is required"),
  fieldOfStudy: z.string().min(1, "Field of study is required"),
  branch: z.string().optional(),
  duration: z.string().min(1, "Duration is required"),
  grade: z.string().optional(),
  description: z.string().optional(),
});

export const projectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().min(1, "Description is required"),
  technologies: z.array(z.string()).min(1, "At least one technology is required"),
  githubUrl: z.string().url("Invalid URL").or(z.literal("")),
  liveUrl: z.string().url("Invalid URL").or(z.literal("")),
});

export const skillSchema = z.object({
  name: z.string().min(1, "Skill name is required"),
  level: z.number().min(0).max(100),
  group: z.string().optional(),
});

export const languageSchema = z.object({
  name: z.string().min(1, "Language is required"),
  level: z.string().min(1, "Proficiency is required"),
});

export const certificationSchema = z.object({
  title: z.string().min(1, "Certificate name is required"),
  issuer: z.string().min(1, "Organization is required"),
  date: z.string().min(1, "Date is required"),
  link: z.string().url("Invalid URL").or(z.literal("")),
  credentialUrl: z.string().url("Invalid URL").or(z.literal("")),
});

export const awardSchema = z.object({
  title: z.string().min(1, "Award title is required"),
  issuer: z.string().min(1, "Issuer is required"),
  date: z.string().min(1, "Date is required"),
  description: z.string().optional(),
});

export const referenceSchema = z.object({
  name: z.string().min(1, "Reference name is required"),
  relationship: z.string().min(1, "Relationship / Title is required"),
  company: z.string().min(1, "Company is required"),
  email: z.string().email("Invalid email").or(z.literal("")),
  phone: z.string().optional(),
});

export const customSectionItemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
});

export const customSectionSchema = z.object({
  title: z.string().min(1, "Section Title is required"),
  items: z.array(customSectionItemSchema).min(1),
});
