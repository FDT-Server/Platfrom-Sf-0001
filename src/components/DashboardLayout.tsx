"use client";

import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

// Logo Components
export const Logo = () => (
  <a href="/dashboard" className="relative z-20 flex items-center py-1">
    <img
      src="https://ik.imagekit.io/dypkhqxip/logotraining"
      className="h-8 w-auto object-contain"
      alt="Full Logo"
    />
  </a>
);

export const LogoIcon = () => (
  <a href="/dashboard" className="relative z-20 flex items-center py-1">
    <img
      src="https://ik.imagekit.io/dypkhqxip/dashside"
      className="h-8 w-auto object-contain"
      alt="Logo Icon"
    />
  </a>
);

interface DashboardLayoutProps {
  children: React.ReactNode;
  user: {
    fullName: string;
    email: string;
    profileImage?: string | null;
  };
}

export default function DashboardLayout({ children, user }: DashboardLayoutProps) {
  const [open, setOpen] = useState(false);

  const links = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: (
        <span className="material-symbols-outlined shrink-0 text-[20px] text-blue-100 group-hover/sidebar:text-white transition-colors duration-150 select-none">
          team_dashboard
        </span>
      ),
    },
    {
      label: "Video Lectures",
      href: "/lectures",
      icon: (
        <span className="material-symbols-outlined shrink-0 text-[20px] text-blue-100 group-hover/sidebar:text-white transition-colors duration-150 select-none">
          books_movies_and_music
        </span>
      ),
    },
    {
      label: "Resources",
      href: "/resources",
      icon: (
        <span className="material-symbols-outlined shrink-0 text-[20px] text-blue-100 group-hover/sidebar:text-white transition-colors duration-150 select-none">
          library_books
        </span>
      ),
    },
  ];

  // If the logged-in email matches webstrixx@gmail.com, dynamically add the Admin Panel route
  if (user.email === "webstrixx@gmail.com") {
    links.push({
      label: "Admin Panel",
      href: "/admin",
      icon: (
        <span className="material-symbols-outlined shrink-0 text-[20px] text-amber-200 group-hover/sidebar:text-amber-100 transition-colors duration-150 select-none">
          shield_person
        </span>
      ),
    });
  }

  // Profile link appended at the very end to ensure it is always last
  links.push({
    label: "Profile",
    href: "/profile",
    icon: user.profileImage ? (
      <img
        src={user.profileImage}
        alt="Profile"
        className="h-5 w-5 rounded-full object-cover border border-blue-200/50 shrink-0"
      />
    ) : (
      <span className="material-symbols-outlined shrink-0 text-[20px] text-blue-100 group-hover/sidebar:text-white transition-colors duration-150 select-none">
        recent_patient
      </span>
    ),
  });

  return (
    <div className="flex h-screen w-screen bg-slate-50 overflow-hidden md:flex-row flex-col">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            <div className={cn("flex w-full items-center transition-all duration-150", open ? "justify-start px-2" : "justify-center")}>
              {open ? <Logo /> : <LogoIcon />}
            </div>
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: user.fullName,
                href: "/profile",
                icon: user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt={user.fullName}
                    className="h-6 w-6 rounded-full object-cover border border-blue-200/50 shrink-0"
                  />
                ) : (
                  <span className="material-symbols-outlined shrink-0 text-[20px] text-blue-100 group-hover/sidebar:text-white transition-colors duration-150 select-none">
                    recent_patient
                  </span>
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>

      {/* Main Dashboard Panel Content */}
      <div className="flex flex-1 overflow-y-auto bg-slate-50 p-4 md:p-8">
        {children}
      </div>
    </div>
  );
}
