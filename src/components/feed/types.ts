export type ReactionType = "like" | "celebrate" | "support" | "insightful" | "love";

export interface PostAuthor {
  id: string;
  name: string;
  role: string;
  college?: string;
  branch?: string;
  year?: string;
  image?: string | null;
  isVerified?: boolean;
  isFollowing?: boolean;
}

export interface PostMedia {
  id: string;
  type: "image" | "video" | "pdf";
  url: string;
  title?: string;
  size?: string;
}

export interface CommentReply {
  id: string;
  author: PostAuthor;
  content: string;
  createdAt: string;
  likes: number;
  liked?: boolean;
}

export interface PostComment {
  id: string;
  author: PostAuthor;
  content: string;
  createdAt: string;
  likes: number;
  liked?: boolean;
  replies: CommentReply[];
}

export interface PostReactionSummary {
  like: number;
  celebrate: number;
  support: number;
  insightful: number;
  love: number;
}

export interface FeedPost {
  id: string;
  title?: string;
  author: PostAuthor;
  createdAt: string;
  visibility?: "Public" | "Connections" | "Pod";
  category: "Achievement" | "Project" | "Question" | "General" | "Opportunity";
  content: string;
  codeSnippet?: {
    language: string;
    code: string;
  };
  tags: string[];
  media: PostMedia[];
  projectUrl?: string;
  reactions: PostReactionSummary;
  userReaction?: ReactionType | null;
  comments: PostComment[];
  sharesCount: number;
  bookmarksCount: number;
  viewsCount: number;
  bookmarked?: boolean;
}

export const mockDetailedPosts: FeedPost[] = [
  {
    id: "post-aws-cert",
    title: "AWS Certified Solutions Architect Associate Achieved! ☁️",
    author: {
      id: "user-aarav",
      name: "Aarav Sharma",
      role: "Cloud Computing Track",
      college: "IIT Bombay",
      branch: "Computer Science",
      year: "3rd Year",
      image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150&h=150",
      isVerified: true,
      isFollowing: false,
    },
    createdAt: "July 19, 2026 at 2:30 PM",
    visibility: "Public",
    category: "Achievement",
    content: `Super excited to share that I just passed the **AWS Certified Solutions Architect Associate** exam with a score of 890/1000! ☁️🏆

Key areas I focused on during preparation:
- Designing resilient serverless architectures using AWS Lambda, S3, and DynamoDB.
- High Availability & Fault Tolerance across Multi-AZ deployments with Auto Scaling & ALB.
- IAM Security Policies, KMS Encryption at rest and in transit.

Big thanks to Student Forge mentors and cloud study group members for the mock exam sessions and architectural review practice. Next goal: AWS DevOps Engineer Professional!`,
    codeSnippet: {
      language: "typescript",
      code: `import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const client = new S3Client({ region: "ap-south-1" });
export async function uploadCert(fileBuffer: Buffer, fileName: string) {
  const command = new PutObjectCommand({
    Bucket: "student-forge-certs",
    Key: fileName,
    Body: fileBuffer,
    ContentType: "application/pdf",
  });
  return await client.send(command);
}`,
    },
    tags: ["AWS", "CloudComputing", "Serverless", "Certification", "StudentForge"],
    media: [
      {
        id: "m-1",
        type: "image",
        url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200&h=600",
        title: "AWS Certification Badge",
      },
      {
        id: "m-2",
        type: "pdf",
        url: "#",
        title: "AWS_Solutions_Architect_Certificate.pdf",
        size: "1.4 MB",
      },
    ],
    projectUrl: "https://aws.amazon.com/verification",
    reactions: {
      like: 42,
      celebrate: 28,
      support: 15,
      insightful: 9,
      love: 18,
    },
    userReaction: "celebrate",
    comments: [
      {
        id: "c-1",
        author: {
          id: "u-neha",
          name: "Neha Verma",
          role: "DevOps Engineer · B.Tech CSE",
          college: "NIT Trichy",
          image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100",
        },
        content: "Huge congratulations Aarav! Which practice test platform did you find most close to the actual exam difficulty?",
        createdAt: "1 hour ago",
        likes: 5,
        liked: true,
        replies: [
          {
            id: "r-1",
            author: {
              id: "user-aarav",
              name: "Aarav Sharma",
              role: "Cloud Computing Track",
              image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150&h=150",
            },
            content: "Thanks Neha! Stephane Maarek's practice exams on Udemy combined with Jon Bonso's tutorials were 100% accurate for scenario questions.",
            createdAt: "45 minutes ago",
            likes: 3,
          },
        ],
      },
      {
        id: "c-2",
        author: {
          id: "u-kunal",
          name: "Kunal Shah",
          role: "Backend Lead · ECE 4th Year",
          college: "BITS Pilani",
          image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100",
        },
        content: "Outstanding achievement! Serverless architecture is indeed the future.",
        createdAt: "2 hours ago",
        likes: 2,
        replies: [],
      },
    ],
    sharesCount: 14,
    bookmarksCount: 22,
    viewsCount: 1420,
    bookmarked: false,
  },
  {
    id: "post-hackathon-win",
    title: "First Place Winners at National Smart Campus Hackathon 2026 🏆",
    author: {
      id: "user-rohan",
      name: "Rohan Gupta & Ananya",
      role: "Full Stack Developers",
      college: "DTU Delhi",
      branch: "Information Technology",
      year: "4th Year",
      image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=150&h=150",
      isVerified: true,
      isFollowing: true,
    },
    createdAt: "July 19, 2026 at 11:00 AM",
    visibility: "Public",
    category: "Achievement",
    content: `We took **1st Place** out of 350+ participating university teams! 🚀

Our project: **CampusFlow AI** - an intelligent automated attendance, classroom environment optimization, and student engagement platform built in 36 non-stop hours.

Key technical stack used:
- Next.js 15 App Router & Server Actions
- OpenCV Python face detection & biometric validation
- TailwindCSS & shadcn UI design token system
- Prisma ORM with PostgreSQL database

Check out our demo video and GitHub repo below!`,
    tags: ["Hackathon", "NextJS", "ArtificialIntelligence", "WebDevelopment", "Winners"],
    media: [
      {
        id: "m-h1",
        type: "image",
        url: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&q=80&w=1200&h=600",
        title: "Hackathon Award Ceremony",
      },
    ],
    projectUrl: "https://github.com/studentforge/campusflow-ai",
    reactions: {
      like: 65,
      celebrate: 48,
      support: 22,
      insightful: 14,
      love: 31,
    },
    userReaction: "like",
    comments: [
      {
        id: "c-h1",
        author: {
          id: "u-vikram",
          name: "Vikram Tech Lead",
          role: "Senior Engineering Manager",
          image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100&h=100",
        },
        content: "Loved watching your live demo presentation! The OpenCV fallback handling was executed flawlessly.",
        createdAt: "3 hours ago",
        likes: 8,
        replies: [],
      },
    ],
    sharesCount: 35,
    bookmarksCount: 45,
    viewsCount: 2890,
    bookmarked: true,
  },
];

export function getPostById(id: string): FeedPost {
  const found = mockDetailedPosts.find((p) => p.id === id);
  if (found) return found;

  return {
    id: id,
    title: `Student Forge Community Post #${id}`,
    author: {
      id: "user-default",
      name: "Priya Sharma",
      role: "UI/UX & Product Design Specialist",
      college: "VJT Mumbai",
      branch: "Computer Engineering",
      year: "3rd Year",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150",
      isVerified: true,
      isFollowing: false,
    },
    createdAt: "2 hours ago",
    visibility: "Public",
    category: "Project",
    content: `Published a comprehensive case study on **"Redesigning Platform Dashboard & Student Networking UI"**. Focused on horizontal opportunities, circular progress metrics, and integrated real-time student chats.\n\nFeedback and thoughts are welcome!`,
    tags: ["UIUX", "ProductDesign", "Figma", "NextJS", "StudentForge"],
    media: [
      {
        id: "m-def",
        type: "image",
        url: "https://images.unsplash.com/photo-1541462608143-67571c6738dd?auto=format&fit=crop&q=80&w=1200&h=600",
        title: "Design System Showcase",
      },
    ],
    projectUrl: "https://figma.com/@studentforge",
    reactions: {
      like: 25,
      celebrate: 14,
      support: 8,
      insightful: 12,
      love: 10,
    },
    userReaction: "like",
    comments: [],
    sharesCount: 12,
    bookmarksCount: 19,
    viewsCount: 890,
    bookmarked: false,
  };
}
