"use client";
import type React from "react";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

export default function WelcomePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!name.trim()) return;

      setIsLoading(true);

      // Simulate async operation and optimize localStorage
      await new Promise((resolve) => setTimeout(resolve, 100));

      try {
        localStorage.setItem("gretingName", name.trim());
        router.push("/info");
      } catch (error) {
        console.error("Failed to save name:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [name, router]
  );

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 p-4 overflow-hidden">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-8 space-y-6">
          <h1 className="text-center text-3xl sm:text-4xl font-bold bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
            Welcome Back
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-lg sm:text-xl font-semibold text-gray-800 mb-2"
              >
                Enter Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent shadow-sm transition-all duration-200"
                placeholder="Your name"
                required
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || !name.trim()}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold text-lg hover:brightness-110 focus:ring-4 focus:ring-violet-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
