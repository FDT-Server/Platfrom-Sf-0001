import React from "react";
import { ResumeData } from "./types";

export const initialResumeData: ResumeData = {
  title: "My Professional Resume",
  template: "modern",
  personalDetails: {
    name: "John Doe",
    title: "Software Engineer",
    email: "john.doe@example.com",
    phone: "+1 (555) 019-2834",
    address: "San Francisco, CA",
    portfolio: "https://johndoe.dev",
    linkedin: "https://linkedin.com/in/johndoe",
    github: "https://github.com/johndoe",
  },
  summary: "A passionate Software Engineer with 3+ years of experience building modern web applications. Specialized in TypeScript, React, Next.js, and serverless architectures. Proven track record of delivering clean, scalable, and user-centric features.",
  experience: [
    {
      id: "exp-1",
      company: "TechForge Solutions",
      role: "Software Engineer",
      duration: "2024 - Present",
      location: "San Francisco, CA",
      description: "Designed and implemented several high-traffic features using Next.js 15, React 19, and TailwindCSS. Optimized database queries using Prisma, leading to a 35% reduction in API response times.",
      achievements: [
        "Led a team of 3 developers to migrate a legacy app to App Router.",
        "Introduced automated unit testing reducing production bugs by 20%.",
      ],
    },
    {
      id: "exp-2",
      company: "Devlabs Agency",
      role: "Junior Developer",
      duration: "2023 - 2024",
      location: "Remote",
      description: "Collaborated on building bespoke e-commerce and dashboard applications. Maintained databases and developed custom REST APIs using Node.js and Express.",
      achievements: [
        "Developed a real-time analytics module used by 50+ enterprise clients.",
      ],
    },
  ],
  education: [
    {
      id: "edu-1",
      school: "State University of Technology",
      degree: "Bachelor of Science",
      fieldOfStudy: "Computer Science & Engineering",
      branch: "Software Systems",
      duration: "2019 - 2023",
      grade: "GPA: 3.8/4.0",
      description: "Specialized in Distributed Computing, Algorithms, and Frontend Systems.",
    },
  ],
  projects: [
    {
      id: "proj-1",
      name: "Serverless E-Commerce Platform",
      description: "A fast, fully-functional e-commerce application powered by Next.js, Stripe, and serverless Postgres. Features instant checkout and real-time inventory tracking.",
      technologies: ["Next.js", "TailwindCSS", "Prisma", "PostgreSQL", "Stripe"],
      githubUrl: "https://github.com/johndoe/ecommerce",
      liveUrl: "https://shop.johndoe.dev",
    },
  ],
  skills: [
    { id: "skill-1", name: "TypeScript", level: 90, group: "Languages" },
    { id: "skill-2", name: "React / Next.js", level: 95, group: "Frontend" },
    { id: "skill-3", name: "Node.js", level: 85, group: "Backend" },
    { id: "skill-4", name: "Prisma / PostgreSQL", level: 80, group: "Database" },
    { id: "skill-5", name: "Tailwind CSS", level: 95, group: "Design" },
  ],
  languages: [
    { id: "lang-1", name: "English", level: "Native" },
    { id: "lang-2", name: "Spanish", level: "Intermediate" },
  ],
  certifications: [
    {
      id: "cert-1",
      title: "AWS Certified Developer – Associate",
      issuer: "Amazon Web Services",
      date: "2025",
      credentialUrl: "https://aws.amazon.com/verify/123",
    },
  ],
  awards: [
    {
      id: "award-1",
      title: "First Place - Hackathon SUT",
      issuer: "State University",
      date: "2022",
      description: "Won first prize for designing a decentralised campus tutoring hub.",
    },
  ],
  achievements: [
    "Dean's list for academic excellence during all undergraduate years.",
    "Contributed to 5+ major open source repositories including Next.js documentation.",
  ],
  interests: ["Open Source", "Web Perf", "Hiking", "Reading"],
  references: [
    {
      id: "ref-1",
      name: "Jane Smith",
      relationship: "Engineering Director",
      company: "TechForge Solutions",
      email: "jane.smith@techforge.com",
      phone: "+1 (555) 019-9999",
    },
  ],
  customSections: [],
};

export const ModernTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { personalDetails, summary, experience, education, projects, skills, languages, certifications, awards, achievements, interests, references, customSections } = data;

  return (
    <div className="w-full text-slate-800 font-sans p-8 flex flex-col md:flex-row gap-6 bg-white min-h-[29.7cm] box-border text-[11px] leading-relaxed">
      {/* Left Sidebar */}
      <div className="w-full md:w-[35%] flex flex-col gap-5 border-b md:border-b-0 md:border-r border-slate-200 md:pr-6 shrink-0 print:w-[35%] print:border-r print:border-b-0 print:pr-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 uppercase">{personalDetails.name || "Your Name"}</h1>
          <p className="text-xs text-indigo-650 font-bold mt-1">{personalDetails.title || "Software Engineer"}</p>
        </div>

        {/* Contact info */}
        <div className="flex flex-col gap-2.5 text-[10px] text-slate-655">
          <h3 className="text-xs font-bold text-slate-900 border-b border-slate-200 pb-1 uppercase tracking-wider">Contact</h3>
          {personalDetails.email && <div className="flex items-center gap-1.5 break-all"><span>✉</span> {personalDetails.email}</div>}
          {personalDetails.phone && <div className="flex items-center gap-1.5"><span>📞</span> {personalDetails.phone}</div>}
          {personalDetails.address && <div className="flex items-center gap-1.5"><span>📍</span> {personalDetails.address}</div>}
          {personalDetails.portfolio && <div className="flex items-center gap-1.5 break-all"><span>🌐</span> <a href={personalDetails.portfolio} target="_blank" className="hover:underline">{personalDetails.portfolio.replace(/^https?:\/\//, "")}</a></div>}
          {personalDetails.linkedin && <div className="flex items-center gap-1.5 break-all"><span>💼</span> <a href={personalDetails.linkedin} target="_blank" className="hover:underline">LinkedIn</a></div>}
          {personalDetails.github && <div className="flex items-center gap-1.5 break-all"><span>💻</span> <a href={personalDetails.github} target="_blank" className="hover:underline">GitHub</a></div>}
        </div>

        {/* Skills */}
        {skills && skills.length > 0 && (
          <div className="flex flex-col gap-2.5">
            <h3 className="text-xs font-bold text-slate-900 border-b border-slate-200 pb-1 uppercase tracking-wider">Skills</h3>
            <div className="flex flex-col gap-2.5">
              {skills.map((skill) => (
                <div key={skill.id} className="flex flex-col gap-1">
                  <div className="flex justify-between font-bold text-slate-750">
                    <span>{skill.name}</span>
                    <span className="text-slate-400 font-normal">{skill.level}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full w-full overflow-hidden">
                    <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${skill.level}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {languages && languages.length > 0 && (
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-bold text-slate-900 border-b border-slate-200 pb-1 uppercase tracking-wider">Languages</h3>
            <div className="flex flex-col gap-1.5">
              {languages.map((lang) => (
                <div key={lang.id} className="flex justify-between">
                  <span className="font-semibold">{lang.name}</span>
                  <span className="text-slate-500 text-[10px]">{lang.level}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Interests */}
        {interests && interests.length > 0 && (
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-bold text-slate-900 border-b border-slate-200 pb-1 uppercase tracking-wider">Interests</h3>
            <div className="flex flex-wrap gap-1 text-[10px] text-slate-600 font-medium">
              {interests.join(", ")}
            </div>
          </div>
        )}

        {/* References */}
        {references && references.length > 0 && (
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-bold text-slate-900 border-b border-slate-200 pb-1 uppercase tracking-wider">References</h3>
            <div className="flex flex-col gap-2.5 text-[9.5px] text-slate-655">
              {references.map((ref) => (
                <div key={ref.id} className="flex flex-col">
                  <span className="font-bold text-slate-800">{ref.name}</span>
                  <span>{ref.relationship} at {ref.company}</span>
                  {ref.email && <span className="text-indigo-650 truncate">{ref.email}</span>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Panel */}
      <div className="flex-1 flex flex-col gap-5 print:flex-1">
        {/* Profile Summary */}
        {summary && (
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-bold text-slate-900 border-b border-slate-200 pb-1 uppercase tracking-wider">Summary</h3>
            <p className="text-slate-650 whitespace-pre-line text-justify">{summary}</p>
          </div>
        )}

        {/* Work Experience */}
        {experience && experience.length > 0 && (
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-bold text-slate-900 border-b border-slate-200 pb-1 uppercase tracking-wider">Experience</h3>
            <div className="flex flex-col gap-4">
              {experience.map((exp) => (
                <div key={exp.id} className="flex flex-col gap-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-extrabold text-slate-800 text-[11px]">{exp.company} {exp.location && `— ${exp.location}`}</h4>
                    <span className="text-slate-500 text-[10px]">{exp.duration}</span>
                  </div>
                  <p className="font-semibold text-indigo-650 text-[10.5px]">{exp.role}</p>
                  <p className="text-slate-655 mt-1 whitespace-pre-line text-justify">{exp.description}</p>
                  {exp.achievements && exp.achievements.length > 0 && (
                    <ul className="list-disc pl-4 mt-1 text-slate-650 flex flex-col gap-0.5">
                      {exp.achievements.map((ach, idx) => (
                        <li key={idx} className="pl-0.5">{ach}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && (
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-bold text-slate-900 border-b border-slate-200 pb-1 uppercase tracking-wider">Projects</h3>
            <div className="flex flex-col gap-3">
              {projects.map((proj) => (
                <div key={proj.id} className="flex flex-col gap-1">
                  <div className="flex justify-between items-center">
                    <h4 className="font-extrabold text-slate-800 text-[11px]">{proj.name}</h4>
                    <div className="flex gap-2 text-[9px] text-indigo-600">
                      {proj.githubUrl && <a href={proj.githubUrl} target="_blank" className="hover:underline">GitHub</a>}
                      {proj.liveUrl && <a href={proj.liveUrl} target="_blank" className="hover:underline">Live URL</a>}
                    </div>
                  </div>
                  <p className="text-slate-655 whitespace-pre-line text-justify">{proj.description}</p>
                  {proj.technologies && proj.technologies.length > 0 && (
                    <p className="text-[10px] text-slate-500 font-semibold mt-1">
                      Technologies: {proj.technologies.join(", ")}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-bold text-slate-900 border-b border-slate-200 pb-1 uppercase tracking-wider">Education</h3>
            <div className="flex flex-col gap-3">
              {education.map((edu) => (
                <div key={edu.id} className="flex flex-col gap-0.5">
                  <div className="flex justify-between">
                    <h4 className="font-extrabold text-slate-800 text-[11px]">{edu.school}</h4>
                    <span className="text-slate-500 text-[10px]">{edu.duration}</span>
                  </div>
                  <p className="font-medium text-slate-700">{edu.degree} in {edu.fieldOfStudy} {edu.branch && `(${edu.branch})`}</p>
                  {edu.grade && <p className="text-[10px] text-slate-500 font-semibold">{edu.grade}</p>}
                  {edu.description && <p className="text-[10px] text-slate-600 mt-1 whitespace-pre-line">{edu.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {certifications && certifications.length > 0 && (
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-bold text-slate-900 border-b border-slate-200 pb-1 uppercase tracking-wider">Certifications</h3>
            <div className="flex flex-col gap-1.5">
              {certifications.map((cert) => (
                <div key={cert.id} className="flex justify-between">
                  <div>
                    <span className="font-bold">{cert.title}</span>
                    <span className="text-slate-550 text-[10px]"> — {cert.issuer}</span>
                    {(cert.credentialUrl || cert.link) && (
                      <a href={cert.credentialUrl || cert.link} target="_blank" className="text-indigo-600 hover:underline text-[9px] ml-2">Verify</a>
                    )}
                  </div>
                  <span className="text-slate-500 text-[10px]">{cert.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements */}
        {achievements && achievements.length > 0 && (
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-bold text-slate-900 border-b border-slate-200 pb-1 uppercase tracking-wider">Key Achievements</h3>
            <ul className="list-disc pl-4 text-slate-650 flex flex-col gap-1 text-[10.5px]">
              {achievements.map((ach, idx) => (
                <li key={idx} className="pl-0.5 text-justify">{ach}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Awards */}
        {awards && awards.length > 0 && (
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-bold text-slate-900 border-b border-slate-200 pb-1 uppercase tracking-wider">Honors & Awards</h3>
            <div className="flex flex-col gap-2">
              {awards.map((award) => (
                <div key={award.id} className="flex flex-col gap-0.5">
                  <div className="flex justify-between">
                    <span className="font-bold text-slate-850">{award.title}</span>
                    <span className="text-slate-500 text-[10px]">{award.date}</span>
                  </div>
                  <p className="text-[10px] text-slate-550">{award.issuer} {award.description && ` — ${award.description}`}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Custom Sections */}
        {customSections.map((sec, idx) => (
          <div key={idx} className="flex flex-col gap-2">
            <h3 className="text-xs font-bold text-slate-900 border-b border-slate-200 pb-1 uppercase tracking-wider">{sec.title}</h3>
            <div className="flex flex-col gap-2">
              {sec.items.map((item) => (
                <div key={item.id} className="flex flex-col gap-0.5">
                  <span className="font-bold">{item.title}</span>
                  <p className="text-slate-655 text-[10px] whitespace-pre-line text-justify">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ProfessionalTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { personalDetails, summary, experience, education, projects, skills, languages, certifications, awards, achievements, interests, references, customSections } = data;

  return (
    <div className="w-full text-slate-900 font-sans p-10 bg-white min-h-[29.7cm] box-border text-[11px] leading-relaxed">
      {/* Header */}
      <div className="text-center pb-4 border-b-2 border-slate-900">
        <h1 className="text-2xl font-black tracking-wider text-slate-900 uppercase">{personalDetails.name || "Your Name"}</h1>
        <p className="text-xs text-indigo-650 font-bold mt-1 uppercase tracking-widest">{personalDetails.title || "Software Engineer"}</p>
        
        {/* Contact links bar */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-2 text-[10px] text-slate-655 font-medium">
          {personalDetails.email && <span>{personalDetails.email}</span>}
          {personalDetails.phone && <span>• {personalDetails.phone}</span>}
          {personalDetails.address && <span>• {personalDetails.address}</span>}
          {personalDetails.portfolio && <span>• <a href={personalDetails.portfolio} target="_blank" className="hover:underline">{personalDetails.portfolio.replace(/^https?:\/\//, "")}</a></span>}
          {personalDetails.linkedin && <span>• <a href={personalDetails.linkedin} target="_blank" className="hover:underline">LinkedIn</a></span>}
          {personalDetails.github && <span>• <a href={personalDetails.github} target="_blank" className="hover:underline">GitHub</a></span>}
        </div>
      </div>

      {/* Main Body */}
      <div className="mt-5 flex flex-col gap-5">
        {/* Profile Summary */}
        {summary && (
          <div className="flex flex-col gap-1">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest border-b border-slate-400 pb-0.5">Summary</h3>
            <p className="text-slate-700 whitespace-pre-line text-justify mt-1">{summary}</p>
          </div>
        )}

        {/* Work Experience */}
        {experience && experience.length > 0 && (
          <div className="flex flex-col gap-1">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest border-b border-slate-400 pb-0.5">Professional Experience</h3>
            <div className="flex flex-col gap-4 mt-1.5">
              {experience.map((exp) => (
                <div key={exp.id} className="flex flex-col gap-0.5">
                  <div className="flex justify-between items-start font-extrabold text-slate-900">
                    <div>
                      <span>{exp.company} {exp.location && `(${exp.location})`}</span>
                      <span className="font-normal text-slate-600"> — {exp.role}</span>
                    </div>
                    <span className="font-semibold text-slate-550 text-[10px]">{exp.duration}</span>
                  </div>
                  <p className="text-slate-700 mt-1 whitespace-pre-line text-justify">{exp.description}</p>
                  {exp.achievements && exp.achievements.length > 0 && (
                    <ul className="list-disc pl-4 mt-1 text-slate-700 flex flex-col gap-0.5">
                      {exp.achievements.map((ach, idx) => (
                        <li key={idx} className="pl-0.5">{ach}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && (
          <div className="flex flex-col gap-1">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest border-b border-slate-400 pb-0.5">Projects</h3>
            <div className="flex flex-col gap-3 mt-1.5">
              {projects.map((proj) => (
                <div key={proj.id} className="flex flex-col gap-0.5">
                  <div className="flex justify-between items-center font-extrabold text-slate-900">
                    <div>
                      <span>{proj.name}</span>
                      {proj.technologies && proj.technologies.length > 0 && (
                        <span className="font-normal text-slate-550 text-[10px]"> ({proj.technologies.join(", ")})</span>
                      )}
                    </div>
                    <div className="flex gap-2 text-[9px] font-semibold text-slate-550">
                      {proj.githubUrl && <a href={proj.githubUrl} target="_blank" className="hover:underline">Code</a>}
                      {proj.liveUrl && <a href={proj.liveUrl} target="_blank" className="hover:underline">Demo</a>}
                    </div>
                  </div>
                  <p className="text-slate-700 whitespace-pre-line text-justify">{proj.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <div className="flex flex-col gap-1">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest border-b border-slate-400 pb-0.5">Education</h3>
            <div className="flex flex-col gap-3 mt-1.5">
              {education.map((edu) => (
                <div key={edu.id} className="flex flex-col gap-0.5">
                  <div className="flex justify-between font-extrabold text-slate-900">
                    <div>
                      <span>{edu.school}</span>
                      <span className="font-normal text-slate-600"> — {edu.degree} in {edu.fieldOfStudy} {edu.branch && `(${edu.branch})`}</span>
                    </div>
                    <span className="font-semibold text-slate-555 text-[10px]">{edu.duration}</span>
                  </div>
                  {(edu.grade || edu.description) && (
                    <p className="text-[10px] text-slate-655 mt-0.5">
                      {edu.grade && <span className="font-semibold">{edu.grade}</span>}
                      {edu.grade && edu.description && " • "}
                      {edu.description && <span>{edu.description}</span>}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {skills && skills.length > 0 && (
          <div className="flex flex-col gap-1">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest border-b border-slate-400 pb-0.5">Core Competencies</h3>
            <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1.5 text-slate-800">
              {skills.map((skill) => (
                <div key={skill.id} className="flex items-center gap-1.5">
                  <span className="font-extrabold">{skill.name}</span>
                  <span className="text-[10px] text-slate-400">({skill.level >= 85 ? "Expert" : skill.level >= 70 ? "Advanced" : "Intermediate"})</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stand-alone Achievements */}
        {achievements && achievements.length > 0 && (
          <div className="flex flex-col gap-1">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest border-b border-slate-400 pb-0.5">Key Achievements</h3>
            <ul className="list-disc pl-4 mt-1.5 text-slate-700 flex flex-col gap-1 text-[10.5px]">
              {achievements.map((ach, idx) => (
                <li key={idx} className="pl-0.5 text-justify">{ach}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Certifications & Languages & Awards & References */}
        {(certifications.length > 0 || languages.length > 0 || awards.length > 0 || (interests && interests.length > 0) || (references && references.length > 0)) && (
          <div className="flex flex-col gap-1">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest border-b border-slate-400 pb-0.5">Additional Information</h3>
            <div className="mt-2 flex flex-col gap-2">
              {certifications.map((cert) => (
                <div key={cert.id} className="flex justify-between">
                  <span><strong>Certification:</strong> {cert.title} issued by {cert.issuer} {(cert.credentialUrl || cert.link) && <a href={cert.credentialUrl || cert.link} target="_blank" className="text-indigo-650 hover:underline text-[9px] ml-1">(Verify)</a>}</span>
                  <span className="text-slate-500 font-sans text-[10px]">{cert.date}</span>
                </div>
              ))}
              {awards.map((award) => (
                <div key={award.id} className="flex justify-between">
                  <span><strong>Award:</strong> {award.title} by {award.issuer} {award.description && `(${award.description})`}</span>
                  <span className="text-slate-500 font-sans text-[10px]">{award.date}</span>
                </div>
              ))}
              {languages.length > 0 && (
                <div>
                  <strong>Languages:</strong> {languages.map((l) => `${l.name} (${l.level})`).join(", ")}
                </div>
              )}
              {interests && interests.length > 0 && (
                <div>
                  <strong>Interests:</strong> {interests.join(", ")}
                </div>
              )}
              {references && references.length > 0 && (
                <div className="mt-1">
                  <strong>References:</strong> {references.map((r) => `${r.name} (${r.relationship}, ${r.company})`).join(" • ")}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Custom Sections */}
        {customSections.map((sec, idx) => (
          <div key={idx} className="flex flex-col gap-1">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest border-b border-slate-400 pb-0.5">{sec.title}</h3>
            <div className="flex flex-col gap-2.5 mt-1.5">
              {sec.items.map((item) => (
                <div key={item.id} className="flex flex-col gap-0.5">
                  <span className="font-bold">{item.title}</span>
                  <p className="text-slate-700 text-[10px] whitespace-pre-line text-justify">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const MinimalTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { personalDetails, summary, experience, education, projects, skills, languages, certifications, awards, achievements, interests, references, customSections } = data;

  return (
    <div className="w-full text-slate-800 font-sans p-10 bg-white min-h-[29.7cm] box-border text-[10.5px] leading-relaxed">
      {/* Contact header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end pb-5 border-b border-slate-100">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900 uppercase">{personalDetails.name || "Your Name"}</h1>
          <p className="text-xs text-slate-500 mt-0.5">{personalDetails.title || "Software Engineer"}</p>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-slate-500 text-[9.5px] mt-2 md:mt-0 max-w-sm">
          {personalDetails.email && <span>{personalDetails.email}</span>}
          {personalDetails.phone && <span>{personalDetails.phone}</span>}
          {personalDetails.address && <span>{personalDetails.address}</span>}
          {personalDetails.portfolio && <span><a href={personalDetails.portfolio} target="_blank" className="hover:underline">{personalDetails.portfolio.replace(/^https?:\/\//, "")}</a></span>}
          {personalDetails.linkedin && <span><a href={personalDetails.linkedin} target="_blank" className="hover:underline">LinkedIn</a></span>}
          {personalDetails.github && <span><a href={personalDetails.github} target="_blank" className="hover:underline">GitHub</a></span>}
        </div>
      </div>

      {/* Main grid */}
      <div className="mt-5 flex flex-col gap-5">
        {/* Profile Summary */}
        {summary && (
          <p className="text-slate-655 text-[11px] text-justify leading-relaxed">{summary}</p>
        )}

        {/* Work Experience */}
        {experience && experience.length > 0 && (
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-bold text-slate-900 border-l-2 border-slate-955 pl-2 uppercase tracking-wide">Work Experience</h3>
            <div className="flex flex-col gap-3 mt-1">
              {experience.map((exp) => (
                <div key={exp.id} className="flex flex-col gap-0.5">
                  <div className="flex justify-between items-center font-bold text-slate-800">
                    <span>{exp.company} {exp.location && `(${exp.location})`} — <span className="font-semibold text-slate-500">{exp.role}</span></span>
                    <span className="text-slate-404 font-normal text-[9.5px]">{exp.duration}</span>
                  </div>
                  <p className="text-slate-655 mt-1 whitespace-pre-line text-justify">{exp.description}</p>
                  {exp.achievements && exp.achievements.length > 0 && (
                    <ul className="list-disc pl-4 mt-1 text-slate-655 flex flex-col gap-0.5">
                      {exp.achievements.map((ach, idx) => (
                        <li key={idx} className="pl-0.5">{ach}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && (
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-bold text-slate-900 border-l-2 border-slate-955 pl-2 uppercase tracking-wide">Projects</h3>
            <div className="flex flex-col gap-2.5 mt-1">
              {projects.map((proj) => (
                <div key={proj.id} className="flex flex-col gap-0.5">
                  <div className="flex justify-between items-center font-bold text-slate-805">
                    <span>{proj.name} {proj.technologies && proj.technologies.length > 0 && <span className="text-slate-404 font-normal text-[9px]"> — {proj.technologies.join(", ")}</span>}</span>
                    <div className="flex gap-2 text-[9px] font-normal text-slate-404">
                      {proj.githubUrl && <a href={proj.githubUrl} target="_blank" className="hover:underline">Source</a>}
                      {proj.liveUrl && <a href={proj.liveUrl} target="_blank" className="hover:underline">Demo</a>}
                    </div>
                  </div>
                  <p className="text-slate-600 text-justify">{proj.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-bold text-slate-900 border-l-2 border-slate-955 pl-2 uppercase tracking-wide">Education</h3>
            <div className="flex flex-col gap-2 mt-1">
              {education.map((edu) => (
                <div key={edu.id} className="flex flex-col gap-0.5">
                  <div className="flex justify-between font-bold text-slate-850">
                    <span>{edu.school} — <span className="font-semibold text-slate-500">{edu.degree} in {edu.fieldOfStudy} {edu.branch && `(${edu.branch})`}</span></span>
                    <span className="text-slate-404 font-normal text-[9.5px]">{edu.duration}</span>
                  </div>
                  {(edu.grade || edu.description) && (
                    <p className="text-[9.5px] text-slate-450 mt-0.5">
                      {edu.grade && <span className="font-semibold">{edu.grade}</span>}
                      {edu.grade && edu.description && " • "}
                      {edu.description && <span>{edu.description}</span>}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {skills && skills.length > 0 && (
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-bold text-slate-900 border-l-2 border-slate-955 pl-2 uppercase tracking-wide">Skills</h3>
            <div className="mt-1 flex flex-wrap gap-2 text-slate-700 text-[10px]">
              {skills.map((skill) => (
                <span key={skill.id} className="bg-slate-50 border border-slate-200/50 px-2 py-0.5 rounded font-medium">
                  {skill.name} ({skill.level}%)
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Stand-alone Achievements */}
        {achievements && achievements.length > 0 && (
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-bold text-slate-900 border-l-2 border-slate-955 pl-2 uppercase tracking-wide">Achievements</h3>
            <ul className="list-disc pl-4 mt-1 text-slate-655 flex flex-col gap-1 text-[10.5px]">
              {achievements.map((ach, idx) => (
                <li key={idx} className="text-justify">{ach}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Certifications & Languages & Interests & References */}
        {(certifications.length > 0 || languages.length > 0 || (interests && interests.length > 0) || (references && references.length > 0)) && (
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-bold text-slate-900 border-l-2 border-slate-955 pl-2 uppercase tracking-wide">Additional Information</h3>
            <div className="mt-1 flex flex-col gap-1.5 text-[10px] text-slate-700">
              {certifications.map((cert) => (
                <div key={cert.id} className="flex justify-between">
                  <span>Certification: {cert.title} ({cert.issuer}) {(cert.credentialUrl || cert.link) && <a href={cert.credentialUrl || cert.link} target="_blank" className="text-indigo-650 hover:underline font-semibold ml-1">Verify</a>}</span>
                  <span className="text-slate-400">{cert.date}</span>
                </div>
              ))}
              {languages.length > 0 && (
                <div>
                  <strong>Languages:</strong> {languages.map((l) => `${l.name} (${l.level})`).join(", ")}
                </div>
              )}
              {interests && interests.length > 0 && (
                <div>
                  <strong>Interests:</strong> {interests.join(", ")}
                </div>
              )}
              {references && references.length > 0 && (
                <div className="mt-0.5">
                  <strong>References:</strong> {references.map((r) => `${r.name} (${r.relationship}, ${r.company} - ${r.email || r.phone})`).join(" • ")}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const ExecutiveTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { personalDetails, summary, experience, education, projects, skills, languages, certifications, awards, achievements, interests, references, customSections } = data;

  return (
    <div className="w-full text-[#1e293b] font-serif p-12 bg-white min-h-[29.7cm] box-border text-[11px] leading-relaxed">
      {/* Header */}
      <div className="border-b-4 border-double border-[#0f172a] pb-4 text-center font-sans">
        <h1 className="text-2xl font-bold tracking-tight text-[#0f172a] uppercase font-serif">{personalDetails.name || "Your Name"}</h1>
        <p className="text-[10px] tracking-widest text-slate-550 uppercase font-sans mt-1">{personalDetails.title || "Executive Curriculum Vitae"}</p>

        {/* Contact info info */}
        <div className="flex flex-wrap justify-center items-center gap-3 mt-3 text-[10px] text-slate-655 font-sans">
          {personalDetails.email && <span>{personalDetails.email}</span>}
          {personalDetails.phone && <span>| {personalDetails.phone}</span>}
          {personalDetails.address && <span>| {personalDetails.address}</span>}
          {personalDetails.portfolio && <span>| <a href={personalDetails.portfolio} target="_blank" className="hover:underline">{personalDetails.portfolio.replace(/^https?:\/\//, "")}</a></span>}
          {personalDetails.linkedin && <span>| <a href={personalDetails.linkedin} target="_blank" className="hover:underline">LinkedIn</a></span>}
        </div>
      </div>

      {/* Profile Summary */}
      {summary && (
        <div className="mt-6">
          <p className="text-justify font-medium text-slate-700 leading-relaxed italic">
            "{summary}"
          </p>
        </div>
      )}

      {/* Main panel sections */}
      <div className="mt-6 flex flex-col gap-6">
        {/* Work Experience */}
        {experience && experience.length > 0 && (
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-bold text-[#0f172a] uppercase tracking-wider border-b border-slate-300 pb-0.5 font-sans">Executive Leadership Experience</h3>
            <div className="flex flex-col gap-4 mt-1">
              {experience.map((exp) => (
                <div key={exp.id} className="flex flex-col gap-0.5">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>{exp.role.toUpperCase()} — <span className="italic font-normal">{exp.company} {exp.location && `(${exp.location})`}</span></span>
                    <span className="font-semibold text-slate-500 font-sans text-[9.5px]">{exp.duration}</span>
                  </div>
                  <p className="text-slate-700 mt-1 whitespace-pre-line text-justify">{exp.description}</p>
                  {exp.achievements && exp.achievements.length > 0 && (
                    <ul className="list-disc pl-4 mt-1 text-slate-750 flex flex-col gap-0.5 font-sans text-[10px]">
                      {exp.achievements.map((ach, idx) => (
                        <li key={idx} className="pl-0.5 text-justify">{ach}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education && education.length > 0 && (
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-bold text-[#0f172a] uppercase tracking-wider border-b border-slate-300 pb-0.5 font-sans">Academic Qualifications</h3>
            <div className="flex flex-col gap-3 mt-1">
              {education.map((edu) => (
                <div key={edu.id} className="flex flex-col gap-0.5">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>{edu.degree} in {edu.fieldOfStudy} {edu.branch && `(${edu.branch})`}</span>
                    <span className="font-semibold text-slate-500 font-sans text-[9.5px]">{edu.duration}</span>
                  </div>
                  <p className="italic text-slate-650">{edu.school}</p>
                  {(edu.grade || edu.description) && (
                    <p className="text-[9.5px] text-slate-500 font-sans mt-0.5">
                      {edu.grade && <span>Grade: {edu.grade}</span>}
                      {edu.grade && edu.description && " | "}
                      {edu.description && <span>{edu.description}</span>}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && (
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-bold text-[#0f172a] uppercase tracking-wider border-b border-slate-300 pb-0.5 font-sans">Key Initiatives & Projects</h3>
            <div className="flex flex-col gap-3 mt-1">
              {projects.map((proj) => (
                <div key={proj.id} className="flex flex-col gap-0.5">
                  <div className="flex justify-between items-center font-bold text-slate-900">
                    <span>{proj.name}</span>
                    <span className="text-[9.5px] text-slate-500 font-sans">Tech Stack: {proj.technologies.join(", ")}</span>
                  </div>
                  <p className="text-slate-700 text-justify">{proj.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {skills && skills.length > 0 && (
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-bold text-[#0f172a] uppercase tracking-wider border-b border-slate-300 pb-0.5 font-sans">Expertise & Skills</h3>
            <div className="mt-1 grid grid-cols-2 gap-x-6 gap-y-1">
              {skills.map((skill) => (
                <div key={skill.id} className="flex justify-between items-center border-b border-slate-100 py-0.5">
                  <span className="font-semibold">{skill.name}</span>
                  <span className="text-[9.5px] text-slate-404 font-sans">{skill.level}% Expertise</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stand-alone Achievements */}
        {achievements && achievements.length > 0 && (
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-bold text-[#0f172a] uppercase tracking-wider border-b border-slate-300 pb-0.5 font-sans">Key Accomplishments</h3>
            <ul className="list-disc pl-4 mt-1 text-slate-700 flex flex-col gap-1 text-[10px] font-sans">
              {achievements.map((ach, idx) => (
                <li key={idx} className="text-justify">{ach}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Languages & Awards & Certifications & References */}
        {(languages.length > 0 || awards.length > 0 || certifications.length > 0 || (interests && interests.length > 0) || (references && references.length > 0)) && (
          <div className="flex flex-col gap-2">
            <h3 className="text-xs font-bold text-[#0f172a] uppercase tracking-wider border-b border-slate-300 pb-0.5 font-sans">Additional Details</h3>
            <div className="mt-1 flex flex-col gap-1.5">
              {certifications.map((c) => (
                <div key={c.id} className="flex justify-between">
                  <span>Certification: {c.title} — {c.issuer}</span>
                  <span className="text-slate-500 font-sans text-[9.5px]">{c.date}</span>
                </div>
              ))}
              {awards.map((award) => (
                <div key={award.id} className="flex justify-between">
                  <span>Awarded: {award.title} by {award.issuer}</span>
                  <span className="text-slate-500 font-sans text-[9.5px]">{award.date}</span>
                </div>
              ))}
              {languages.length > 0 && (
                <div className="text-slate-700">
                  <strong>Language Proficiencies:</strong> {languages.map((l) => `${l.name} (${l.level})`).join(", ")}
                </div>
              )}
              {interests && interests.length > 0 && (
                <div className="text-slate-700">
                  <strong>Personal Interests:</strong> {interests.join(", ")}
                </div>
              )}
              {references && references.length > 0 && (
                <div className="text-slate-700 mt-1 font-sans text-[10px]">
                  <strong>References:</strong> {references.map((r) => `${r.name} (${r.relationship}, ${r.company} — ${r.email})`).join(" • ")}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
