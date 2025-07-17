"use client";

import { Cloudy, House, Volleyball } from "lucide-react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const sideBarArray = [
    {
      name: "Home",
      activeName: "Home",
      icon: <House className="w-5 h-5" />,
      path: "/info",
    },
    {
      name: "Weather",
      activeName: "Weather",
      icon: <Cloudy className="w-5 h-5" />,
      path: "/weather",
    },
    {
      name: "Sports and Fitness",
      activeName: "info",
      icon: <Volleyball className="w-5 h-5" />,
      path: "/info",
    },
  ];

  const router = useRouter();
  const [active, setActive] = useState("Home");

  return (
    <div className="max-h-screen h-screen bg-gradient-to-br from-gray-100 to-white-100 flex w-full flex-row">
      <div className="flex">
        <div className="text-lg font-semibold whitespace-nowrap p-6">
          <h1 className="text-lg font-semibold text-gray-800 mb-6">Private</h1>
          <div>
            {sideBarArray.map((item, index) => (
              <div
                key={index}
                onClick={() => {
                  setActive(item.activeName);
                  router.push(item.path);
                }}
                className={`flex items-center rounded-lg gap-2 px-3 py-2 cursor-pointer mb-1 ${
                  active === item.activeName
                    ? "bg-yellow-500 font-bold"
                    : "hover:bg-blue-300"
                }`}
              >
                <span>{item.icon}</span>
                <span className="flex-1 hidden md:flex">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="h-screen max-h-screen w-full overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
