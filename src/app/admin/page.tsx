import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import DashboardLayout from "@/components/DashboardLayout";
import { IconShieldLock, IconUsers } from "@tabler/icons-react";

export default async function AdminPanelPage() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;

  if (!sessionToken) {
    redirect("/admin/login");
  }

  // Fetch full details of the current logged-in user
  const adminUser = await prisma.user.findUnique({
    where: { id: sessionToken },
    select: {
      fullName: true,
      email: true,
      profileImage: true,
    },
  });

  // Strict Server-Side Access Control: Check if logged-in user is adminUser and email is webstrixx@gmail.com
  if (!adminUser || adminUser.email.trim().toLowerCase() !== "webstrixx@gmail.com") {
    redirect("/dashboard");
  }

  // Retrieve all registered users to show in the table
  const allUsers = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      fullName: true,
      email: true,
      selectedRole: true,
      collegeStudying: true,
      branch: true,
      year: true,
      createdAt: true,
    },
  });

  return (
    <DashboardLayout user={adminUser}>
      <div className="flex h-fit w-full flex-col rounded-2xl border border-slate-300 bg-white p-6 md:p-10 shadow-sm animate-fadeIn">
        
        {/* Header Block */}
        <div className="pb-6 border-b border-slate-300 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md flex items-center gap-1">
                <IconShieldLock className="w-3.5 h-3.5" />
                Root Authority
              </span>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mt-2">
              System Admin Console
            </h3>
            <p className="text-sm text-slate-600 mt-1">
              Authorized access only. View and inspect active user training accounts.
            </p>
          </div>
          
          <div className="bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 flex items-center gap-3">
            <span className="bg-amber-100 text-amber-800 p-2 rounded-lg">
              <IconUsers className="w-5 h-5" />
            </span>
            <div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Registers</p>
              <p className="text-lg font-extrabold text-slate-800 leading-none mt-0.5">{allUsers.length}</p>
            </div>
          </div>
        </div>

        {/* Database Table Section */}
        <div className="mt-8 w-full overflow-x-auto pb-4">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-300 bg-slate-50/50">
                <th className="py-3.5 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Full Name</th>
                <th className="py-3.5 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Email Address</th>
                <th className="py-3.5 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Role Track</th>
                <th className="py-3.5 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">College</th>
                <th className="py-3.5 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Branch</th>
                <th className="py-3.5 px-4 text-xs font-bold text-slate-600 uppercase tracking-wider">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-300">
              {allUsers.length > 0 ? (
                allUsers.map((u: { id: string; fullName: string; email: string; selectedRole: string; collegeStudying: string | null; branch: string | null; year: string | null; createdAt: Date }) => (
                  <tr key={u.id} className="hover:bg-slate-50/40 transition duration-150">
                    <td className="py-4 px-4 text-sm font-bold text-slate-800">{u.fullName}</td>
                    <td className="py-4 px-4 text-sm text-slate-700">{u.email}</td>
                    <td className="py-4 px-4 text-sm">
                      <span className="inline-block bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-blue-100">
                        {u.selectedRole}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-slate-600 font-medium">{u.collegeStudying || "—"}</td>
                    <td className="py-4 px-4 text-sm text-slate-600">{u.branch || "—"}</td>
                    <td className="py-4 px-4 text-xs text-slate-500 font-mono">
                      {new Date(u.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-sm text-slate-500 font-medium">
                    No users registered in database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
