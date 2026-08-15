import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/db';

const ADMIN_EMAILS = ["webstrixx@gmail.com", "hrstudentforge@gmail.com"];

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;
    
    if (!sessionToken) {
      return NextResponse.json({ notifications: [] });
    }

    const user = await prisma.user.findUnique({
      where: { id: sessionToken },
    });

    if (!user) return NextResponse.json({ notifications: [] });

    const notifications: any[] = [];
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const lastRead = user.lastNotificationReadAt ? new Date(user.lastNotificationReadAt) : new Date(0);

    // 0. Welcome Notification
    notifications.push({
      id: `welcome_${user.id}`,
      type: "EVENT",
      message: `<b>Welcome to Studentforge Platform!</b><br/>We are excited to have you here. Explore your dashboard to get started.`,
      createdAt: user.createdAt,
      read: new Date(user.createdAt) <= lastRead,
    });

    // 1. Connection Requests
    const connRequests = await prisma.connectionRequest.findMany({
      where: {
        toUserId: user.id,
        status: "PENDING",
        createdAt: { gte: sevenDaysAgo }
      }
    });

    if (connRequests.length > 0) {
      const fromUserIds = connRequests.map(c => c.fromUserId);
      const fromUsers = await prisma.user.findMany({
        where: { id: { in: fromUserIds } },
        select: { id: true, fullName: true }
      });
      const userMap = new Map(fromUsers.map(u => [u.id, u.fullName]));

      for (const req of connRequests) {
        const name = userMap.get(req.fromUserId) || "Someone";
        notifications.push({
          id: `conn_${req.id}`,
          type: "DEFAULT",
          message: `<b>${name}</b> sent you a connection request.`,
          createdAt: req.createdAt,
          read: new Date(req.createdAt) <= lastRead,
        });
      }
    }

    // 2. Private Messages
    const privateMessages = await prisma.message.findMany({
      where: {
        recipientId: user.id,
        createdAt: { gte: sevenDaysAgo }
      },
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    for (const msg of privateMessages) {
      const seenBy = (msg.seenBy as any) || {};
      const isRead = !!seenBy[user.id] || new Date(msg.createdAt) <= lastRead;
      if (!isRead) {
        notifications.push({
          id: `msg_${msg.id}`,
          type: "DEFAULT",
          message: `<b>${msg.fullName}</b> sent you a new message.`,
          createdAt: msg.createdAt,
          read: false,
        });
      } else {
        notifications.push({
          id: `msg_${msg.id}`,
          type: "DEFAULT",
          message: `<b>${msg.fullName}</b> sent you a new message.`,
          createdAt: msg.createdAt,
          read: true,
        });
      }
    }

    // 3. Admin Community Hub Announcements
    const adminMessages = await prisma.message.findMany({
      where: {
        recipientId: null, // Community Hub
        email: { in: ADMIN_EMAILS },
        createdAt: { gte: sevenDaysAgo }
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    for (const msg of adminMessages) {
      const seenBy = (msg.seenBy as any) || {};
      const isRead = !!seenBy[user.id] || new Date(msg.createdAt) <= lastRead;
      notifications.push({
        id: `admin_msg_${msg.id}`,
        type: "EVENT",
        message: `<b>Admin Announcement</b>: ${msg.content.length > 50 ? msg.content.substring(0, 50) + "..." : msg.content}`,
        createdAt: msg.createdAt,
        read: isRead,
      });
    }

    // 4. New Course Launches
    const newCourses = await prisma.course.findMany({
      where: {
        createdAt: { gte: sevenDaysAgo }
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    for (const course of newCourses) {
      notifications.push({
        id: `course_${course.id}`,
        type: "COURSE",
        message: `New Course Launched: <b>${course.title}</b>`,
        createdAt: course.createdAt,
        read: new Date(course.createdAt) <= lastRead,
      });
    }

    // Sort by createdAt descending
    notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Make sure we have a mix of read and unread logic handled properly in DashboardLayout
    return NextResponse.json({ notifications: notifications.slice(0, 50) });

  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json({ notifications: [] });
  }
}