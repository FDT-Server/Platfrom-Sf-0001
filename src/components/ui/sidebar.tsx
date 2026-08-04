"use client";
import { cn } from "@/lib/utils";
import React, { useState, useEffect, createContext, useContext } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { IconMenu2, IconX } from "@tabler/icons-react";

interface Links {
  label: string;
  href?: string;
  icon: React.JSX.Element | React.ReactNode;
  subLinks?: { label: string; href: string; icon: React.JSX.Element | React.ReactNode }[];
}

interface SidebarContextProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  animate: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined
);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate: animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  animate?: boolean;
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

type SidebarMotionProps = Omit<React.ComponentProps<typeof motion.div>, "children"> & {
  children?: React.ReactNode;
};

export const SidebarBody = (props: SidebarMotionProps) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...(props as React.ComponentProps<"div">)} />
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: SidebarMotionProps) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <>
      <motion.div
        className={cn(
          "h-full px-4 py-4 hidden md:flex md:flex-col bg-blue-600 dark:bg-blue-600 shrink-0 border-r border-blue-700/50 relative overflow-hidden select-none",
          className
        )}
        animate={{
          width: animate ? (open ? "300px" : "85px") : "300px",
        }}
        transition={{
          duration: 0.32,
          ease: [0.16, 1, 0.3, 1],
        }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        {...props}
      >
        {children}
      </motion.div>
    </>
  );
};

export const MobileSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) => {
  const { open, setOpen } = useSidebar();
  return (
    <>
      <div
        className={cn(
          "h-14 px-4 py-3 flex flex-row md:hidden items-center justify-between bg-blue-600 dark:bg-blue-600 w-full border-b border-blue-700/50"
        )}
        {...props}
      >
        <div className="flex items-center gap-2 z-20">
          <span className="text-lg font-bold tracking-tight text-white select-none">Platform</span>
          <div className="h-4 w-[1px] bg-white/20"></div>
          <img
            src="https://ik.imagekit.io/dypkhqxip/temp_logo.png"
            className="h-7 w-auto object-contain"
            alt="Studentforge Logo"
          />
        </div>
        <div className="flex justify-end z-20">
          <IconMenu2
            className="text-white dark:text-white cursor-pointer"
            onClick={() => setOpen(!open)}
          />
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{
                duration: 0.25,
                ease: [0.32, 0.72, 0, 1],
              }}
              className={cn(
                "fixed h-full w-full inset-0 bg-blue-600 dark:bg-blue-600 p-10 z-[100] flex flex-col justify-between",
                className
              )}
            >
              <div
                className="absolute right-10 top-10 z-50 text-white dark:text-white cursor-pointer"
                onClick={() => setOpen(!open)}
              >
                <IconX />
              </div>
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export const SidebarLink = ({
  link,
  className,
  ...props
}: {
  link: Links;
  className?: string;
} & React.ComponentPropsWithoutRef<"a">) => {
  const { open, setOpen, animate } = useSidebar();
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);

  const isActive = link.href ? (pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(link.href))) : false;
  const hasSubLinks = link.subLinks && link.subLinks.length > 0;
  
  const isChildActive = hasSubLinks ? link.subLinks!.some(sub => pathname === sub.href || pathname.startsWith(sub.href)) : false;
  const isEffectivelyActive = isActive || isChildActive;

  useEffect(() => {
    if (isChildActive && !expanded) {
      setExpanded(true);
    }
  }, [isChildActive]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (hasSubLinks) {
      e.preventDefault();
      setExpanded(!expanded);
      if (!open) {
        setOpen(true);
      }
    }
  };

  return (
    <div className="flex flex-col gap-1 w-full">
      <a
        href={link.href || "#"}
        onClick={handleClick}
        className={cn(
          "flex items-center gap-3 group/sidebar py-2.5 px-3 rounded-xl transition-all duration-200 hover:bg-white/10 active:scale-98",
          isEffectivelyActive ? "text-white font-semibold" : "text-blue-100",
          open ? "justify-start" : "justify-center w-full",
          className
        )}
        {...props}
      >
        <span className={cn(
          "transition-colors duration-150 shrink-0 flex items-center justify-center w-6 h-6",
          isEffectivelyActive ? "text-white [&>span]:text-white [&>svg]:text-white [&>img]:border-white" : "text-blue-100 group-hover/sidebar:text-white [&>span]:text-blue-100 [&>span]:group-hover/sidebar:text-white [&>svg]:text-blue-100 [&>svg]:group-hover/sidebar:text-white"
        )}>
          {link.icon}
        </span>

        <motion.span
          initial={false}
          animate={{
            display: animate ? (open ? "flex" : "none") : "flex",
            opacity: animate ? (open ? 1 : 0) : 1,
            x: animate ? (open ? 0 : -8) : 0,
          }}
          transition={{
            duration: 0.25,
            ease: [0.16, 1, 0.3, 1],
          }}
          className={cn(
            "text-sm group-hover/sidebar:translate-x-1 transition-transform duration-150 whitespace-nowrap items-center justify-between w-full font-medium select-none",
            isEffectivelyActive ? "text-white font-semibold" : "text-blue-100 group-hover/sidebar:text-white"
          )}
        >
          <span>{link.label}</span>
          {hasSubLinks && (
            <span className={cn("material-symbols-outlined text-[18px] transition-transform duration-200", expanded ? "rotate-180" : "")}>
              expand_more
            </span>
          )}
        </motion.span>
      </a>

      {/* SubLinks */}
      <AnimatePresence>
        {hasSubLinks && expanded && open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-col gap-1 pl-11 pr-2 overflow-hidden"
          >
            {link.subLinks!.map((subLink, idx) => {
              const isSubActive = pathname === subLink.href || pathname.startsWith(subLink.href);
              return (
                <a
                  key={idx}
                  href={subLink.href}
                  className={cn(
                    "flex items-center gap-2 py-2 px-3 rounded-xl transition-all duration-200 hover:bg-white/10 active:scale-98",
                    isSubActive ? "text-white font-semibold" : "text-blue-200"
                  )}
                >
                  <span className={cn(
                    "shrink-0 flex items-center justify-center",
                    isSubActive ? "text-white" : "text-blue-200"
                  )}>
                    {subLink.icon}
                  </span>
                  <span className="text-xs whitespace-nowrap">{subLink.label}</span>
                </a>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
