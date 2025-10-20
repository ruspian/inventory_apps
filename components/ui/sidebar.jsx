"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { LogOut, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { signOut } from "next-auth/react";
import { ClipboardList, FileCheck, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { IoAlbumsOutline, IoCartOutline } from "react-icons/io5";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import {
  CiBank,
  CiBarcode,
  CiBoxes,
  CiBoxList,
  CiDeliveryTruck,
  CiGrid31,
  CiShop,
  CiShoppingTag,
  CiSignpostDuo1,
  CiSquareChevLeft,
  CiUser,
  CiViewList,
} from "react-icons/ci";
import { FaRegBuilding } from "react-icons/fa";

const SidebarContext = createContext(undefined);

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
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({ children, open, setOpen, animate }) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...props} />
    </>
  );
};

export const DesktopSidebar = ({ className, children, ...props }) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <motion.div
      className={cn(
        "h-full px-4 py-4 hidden md:flex md:flex-col bg-neutral-100 dark:bg-neutral-800 w-[300px] flex-shrink-0",
        className
      )}
      animate={{
        width: animate ? (open ? "300px" : "60px") : "300px",
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const MobileSidebar = ({ className, children, ...props }) => {
  const { open, setOpen } = useSidebar();
  return (
    <>
      <div
        className={cn(
          "h-10 px-4 py-4 flex flex-col md:hidden items-center justify-between dark:bg-neutral-800"
        )}
        {...props}
      >
        <div className="absolute flex justify-start z-20">
          <Menu
            className="text-neutral-800 dark:text-neutral-200 cursor-pointer"
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
                duration: 0.3,
                ease: "easeInOut",
              }}
              className={cn(
                "fixed h-full w-full inset-0 bg-white dark:bg-neutral-900 p-10 z-[100] flex flex-col justify-between",
                className
              )}
            >
              <div
                className="absolute right-10 top-10 z-50 text-neutral-800 dark:text-neutral-200 cursor-pointer"
                onClick={() => setOpen(!open)}
              >
                <X />
              </div>

              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export const SidebarLink = ({ className, ...props }) => {
  const { open, animate } = useSidebar();

  const links = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <CiGrid31 size={30} />,
    },
    {
      label: "Kasir",
      href: "/kasir",
      icon: <CiBarcode size={30} />,
    },
    {
      label: "Data Barang",
      href: "/barang",
      icon: <CiBoxes size={30} />,
    },
    {
      label: "Data Category",
      href: "/kategori",
      icon: <CiShoppingTag size={30} />,
    },
    {
      label: "Data Pemasok",
      href: "/pemasok",
      icon: <CiShop size={30} />,
    },
    {
      label: "Stok Masuk",
      href: "/stok-masuk",
      icon: <CiDeliveryTruck size={30} />,
    },

    {
      label: "Stok Opname",
      href: "/opname",
      icon: <CiBoxList size={30} />,
    },
    {
      label: "Laporan Penjualan",
      href: "/laporan",
      icon: <CiViewList size={30} />,
    },
    {
      label: "Riwayat Stok",
      href: "/riwayat",
      icon: <CiSignpostDuo1 size={30} />,
    },
    {
      label: "Manajemen User",
      href: "/user",
      icon: <CiUser size={30} />,
    },
  ];
  return (
    <div className="flex flex-col justify-between h-[550px] md:h-[650px]">
      <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        {open ? (
          <div
            className={cn(
              "flex items-center text-neutral-900 dark:text-neutral-50 justify-start gap-2 group/sidebar py-2  mb-4 border-b border-neutral-400 dark:border-neutral-700",
              className
            )}
            {...props}
          >
            <Image
              src="/logo.png"
              alt="logo"
              width={30}
              height={30}
              className="object-contain"
            />
            <motion.h1
              animate={{
                display: animate
                  ? open
                    ? "inline-block"
                    : "none"
                  : "inline-block",
                opacity: animate ? (open ? 1 : 0) : 1,
              }}
              className="text-slate-900 dark:text-slate-50 text-xl font-bold"
            >
              UsahaKu
            </motion.h1>
          </div>
        ) : (
          <div
            className={cn(
              "flex items-center text-neutral-900 dark:text-neutral-50 justify-start gap-2 group/sidebar py-2  mb-4 border-b border-neutral-400 dark:border-neutral-700",
              className
            )}
            {...props}
          >
            <Image
              src="/logo.png"
              alt="logo"
              width={30}
              height={30}
              className="object-contain"
            />
          </div>
        )}

        <div>
          {links.map((link) => (
            <Link
              href={link.href}
              key={link.href}
              className={cn(
                "flex items-center text-neutral-900 dark:text-neutral-50 justify-start gap-2 group/sidebar py-2 rounded-sm",
                className
              )}
              {...props}
            >
              {link.icon}
              <motion.span
                animate={{
                  display: animate
                    ? open
                      ? "inline-block"
                      : "none"
                    : "inline-block",
                  opacity: animate ? (open ? 1 : 0) : 1,
                }}
                className={`text-slate-900 dark:text-slate-50 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0`}
              >
                {link.label}
              </motion.span>
            </Link>
          ))}
        </div>
      </div>

      <Button
        onClick={() => signOut({ callbackUrl: "/" })}
        variant="ghost"
        className={cn(
          "flex items-center text-neutral-900 dark:text-neutral-50 justify-start gap-2 group/sidebar py-2 rounded-sm",
          className
        )}
        {...props}
      >
        <CiSquareChevLeft size={26} />
        <motion.span
          animate={{
            display: animate
              ? open
                ? "inline-block"
                : "none"
              : "inline-block",
            opacity: animate ? (open ? 1 : 0) : 1,
          }}
          className={`text-slate-900 dark:text-slate-50 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0`}
        >
          Keluar
        </motion.span>
      </Button>
    </div>
  );
};

// jangan tampilkan sidebar di halaman tertentu
export const SidebarWrapper = ({ children }) => {
  const pathname = usePathname();
  const noSidebarRoutes = ["/", "/signin", "/signup"];
  const showSidebar = !noSidebarRoutes.includes(pathname);

  if (!showSidebar) {
    return null; // sembunyikan sidebar
  }

  return <Sidebar>{children}</Sidebar>;
};
