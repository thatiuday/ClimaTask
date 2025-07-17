"use client";

import {
  Cloudy,
  HomeIcon as House,
  VibrateIcon as Volleyball,
  Menu,
  X,
} from "lucide-react";
import type React from "react";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

const sideBarArray = [
  {
    name: "Home",
    activeName: "info",
    icon: <House className="w-5 h-5" />,
    path: "/info",
  },
  {
    name: "Weather",
    activeName: "weather",
    icon: <Cloudy className="w-5 h-5" />,
    path: "/weather",
  },
  {
    name: "Sports",
    activeName: "sports",
    icon: <Volleyball className="w-5 h-5" />,
    path: "/sports",
  },
];

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();
  const [active, setActive] = useState("info");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const currentPath = pathname.split("/").pop() || "info";
    setActive(currentPath);
  }, [pathname]);

  const handleNavigation = (item: (typeof sideBarArray)[0]) => {
    setActive(item.activeName);
    router.push(item.path);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col lg:flex-row overflow-hidden">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm border-b px-4 py-3 flex items-center justify-between flex-shrink-0">
        <h1 className="text-xl font-bold text-gray-800">Private</h1>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`
      lg:flex lg:flex-col lg:w-64 bg-white shadow-lg flex-shrink-0
      ${
        isMobileMenuOpen
          ? "block absolute inset-y-0 left-0 z-50 w-64"
          : "hidden"
      }
      lg:block lg:relative lg:z-auto
    `}
      >
        <div className="p-6 h-full overflow-y-auto">
          <h1 className="text-xl font-bold text-gray-800 mb-6 hidden lg:block">
            Private
          </h1>
          <nav className="space-y-1">
            {sideBarArray.map((item, index) => (
              <button
                key={index}
                onClick={() => handleNavigation(item)}
                className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-left
                ${
                  active === item.activeName
                    ? "bg-yellow-500 text-white font-semibold shadow-md"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                }
              `}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                <span className="truncate">{item.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full w-full overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
