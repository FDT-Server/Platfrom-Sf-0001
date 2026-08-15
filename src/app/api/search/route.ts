import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || query.trim() === "") {
      return NextResponse.json({ 
        users: [], courses: [], posts: [], events: [], 
        resources: [], studyPods: [], opportunities: [], certificates: [] 
      });
    }

    const searchQuery = query.trim();
    const cookieStore = await cookies();
    const userId = cookieStore.get("session")?.value;

    let isPremium = false;
    if (userId) {
      const user = await prisma.user.findUnique({ where: { id: userId }, select: { isPremium: true } });
      if (user) isPremium = user.isPremium;
    }

    // Run searches in parallel for maximum performance
    const [
      users, rawCourses, posts, events, resources, studyPods, opportunities, certificates
    ] = await Promise.all([
      // 1. Search Users
      prisma.user.findMany({
        where: {
          OR: [
            { fullName: { contains: searchQuery, mode: "insensitive" } },
            { email: { contains: searchQuery, mode: "insensitive" } },
            { selectedRole: { contains: searchQuery, mode: "insensitive" } }
          ],
        },
        select: { id: true, fullName: true, selectedRole: true, profileImage: true },
        take: 5,
      }),

      // 2. Search Courses
      prisma.course.findMany({
        where: {
          OR: [
            { title: { contains: searchQuery, mode: "insensitive" } },
            { description: { contains: searchQuery, mode: "insensitive" } },
            { instructor: { contains: searchQuery, mode: "insensitive" } }
          ],
        },
        select: { id: true, title: true, instructor: true, imageUrl: true },
        take: 5,
      }),

      // 3. Search Posts
      prisma.post.findMany({
        where: {
          OR: [
            { title: { contains: searchQuery, mode: "insensitive" } },
            { content: { contains: searchQuery, mode: "insensitive" } },
            { category: { contains: searchQuery, mode: "insensitive" } },
            { userName: { contains: searchQuery, mode: "insensitive" } }
          ],
        },
        select: { id: true, title: true, content: true, userName: true, userImage: true, category: true },
        take: 5,
      }),

      // 4. Search Events
      prisma.event.findMany({
        where: {
          OR: [
            { title: { contains: searchQuery, mode: "insensitive" } },
            { description: { contains: searchQuery, mode: "insensitive" } },
            { speakerName: { contains: searchQuery, mode: "insensitive" } },
            { category: { contains: searchQuery, mode: "insensitive" } }
          ],
        },
        select: { id: true, title: true, speakerName: true, category: true, imageUrl: true },
        take: 5,
      }),

      // 5. Search Resources
      prisma.resource.findMany({
        where: {
          OR: [
            { title: { contains: searchQuery, mode: "insensitive" } },
            { publisher: { contains: searchQuery, mode: "insensitive" } },
            { category: { contains: searchQuery, mode: "insensitive" } }
          ],
        },
        select: { id: true, title: true, category: true, link: true, imageUrl: true },
        take: 5,
      }),

      // 6. Search Study Pods
      prisma.studyPod.findMany({
        where: {
          OR: [
            { name: { contains: searchQuery, mode: "insensitive" } },
            { creatorName: { contains: searchQuery, mode: "insensitive" } }
          ],
        },
        select: { id: true, name: true, creatorName: true },
        take: 5,
      }),

      // 7. Search Opportunities
      prisma.opportunity.findMany({
        where: {
          OR: [
            { title: { contains: searchQuery, mode: "insensitive" } },
            { company: { contains: searchQuery, mode: "insensitive" } },
            { location: { contains: searchQuery, mode: "insensitive" } },
            { type: { contains: searchQuery, mode: "insensitive" } }
          ],
        },
        select: { id: true, title: true, company: true, type: true, imageUrl: true },
        take: 5,
      }),

      // 8. Search Certificates
      prisma.certificate.findMany({
        where: {
          OR: [
            { title: { contains: searchQuery, mode: "insensitive" } },
            { description: { contains: searchQuery, mode: "insensitive" } },
            { issuedBy: { contains: searchQuery, mode: "insensitive" } }
          ],
        },
        select: { id: true, title: true, issuedBy: true, imageUrl: true },
        take: 5,
      })
    ]);

    // Check Enrollments for Courses
    let enrolledCourseIds = new Set<string>();
    if (userId && rawCourses.length > 0) {
      const courseIds = rawCourses.map(c => c.id);
      const enrollments = await prisma.courseEnrollment.findMany({
        where: {
          userId,
          courseId: { in: courseIds }
        },
        select: { courseId: true }
      });
      enrollments.forEach(e => enrolledCourseIds.add(e.courseId));
    }

    const courses = rawCourses.map(c => ({
      ...c,
      isEnrolled: enrolledCourseIds.has(c.id)
    }));

    return NextResponse.json({
      users,
      courses,
      posts,
      events,
      resources,
      studyPods,
      opportunities,
      certificates,
      isPremium
    });
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json(
      { error: "Failed to perform search" },
      { status: 500 }
    );
  }
}
