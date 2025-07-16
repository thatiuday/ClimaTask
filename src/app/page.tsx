"use client";
import React, { useState } from "react";
import { useRouter } from "next/router";

export default function page() {
  const route = useRouter();
  const [name, setname] = useState("");
  function getsubmit() {
    console.log("Submitted Name:", name);
    localStorage.setItem("gretingName", name);
    route.push("/info");
  }

  console.log(name, "name--check");

  return (
    <div className="min-h-screen flex items-center  justify-center bg-gradient-to-br from-indigo-500 to-white p-4">
      <div className=" bg-white w-full rounded-2xl max-w-md p-8 space-y-6 ">
        <h1 className="bg-linear-to-bl from-violet-500 to-fuchsia-500 text-center text-4xl rounded-2xl ">
          Welcome Back
        </h1>

        <form
          className="space-y-6 bg-white p-6 rounded-2xl shadow-lg max-w-md mx-auto mt-10"
          onSubmit={(e) => {
            e.preventDefault(); 
            getsubmit(); // Call your custom function
          }}
        >
          <div>
            <label
              htmlFor="name"
              className="block text-xl font-semibold text-gray-800 mb-2"
            >
              Enter Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setname(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-violet-500 shadow-sm transition"
              placeholder="Your name"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl cursor-pointer bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold text-lg hover:brightness-110 transition"
          >
            Sign In
          </button>
        </form>
      </div>

      <div></div>
    </div>
  );
}
