"use client";
import { useState, useMemo } from "react";
import {
  Activity,
  Target,
  Zap,
  Trophy,
  Calendar,
  Clock,
  Flame,
  Heart,
} from "lucide-react";

export default function SportsPage() {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = ["Today", "Week", "Month"];

  const workoutData = useMemo(
    () => [
      { name: "Mon", activity: "Running", duration: 45, calories: 320 },
      { name: "Tue", activity: "Cycling", duration: 60, calories: 450 },
      { name: "Wed", activity: "Yoga", duration: 30, calories: 150 },
      { name: "Thu", activity: "Swimming", duration: 40, calories: 380 },
      { name: "Fri", activity: "Gym", duration: 75, calories: 520 },
      { name: "Sat", activity: "Hiking", duration: 120, calories: 680 },
      { name: "Sun", activity: "Rest", duration: 0, calories: 0 },
    ],
    []
  );

  const stats = useMemo(
    () => ({
      totalWorkouts: 6,
      totalCalories: 2500,
      totalMinutes: 370,
      avgHeartRate: 142,
      weeklyGoal: 85, // percentage
    }),
    []
  );

  const activities = [
    {
      icon: <Activity className="w-6 h-6" />,
      name: "Running",
      color: "text-red-500",
    },
    {
      icon: <Target className="w-6 h-6" />,
      name: "Cycling",
      color: "text-blue-500",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      name: "Yoga",
      color: "text-green-500",
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      name: "Swimming",
      color: "text-cyan-500",
    },
  ];

  return (
    <div className="h-full w-full bg-gray-50 p-3 sm:p-4 lg:p-6 overflow-y-auto">
      <div className="max-w-7xl mx-auto h-full">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full min-h-[calc(100vh-3rem)]">
          {/* Left Panel - Fitness Overview */}
          <div className="xl:col-span-1">
            <div className="bg-gradient-to-br from-orange-100 to-red-100 h-full min-h-[500px] xl:min-h-full p-4 sm:p-6 rounded-2xl flex flex-col shadow-lg">
              {/* Header */}
              <div className="mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                  Fitness Tracker 💪
                </h1>
                <p className="text-gray-600 text-sm sm:text-base">
                  Keep pushing your limits!
                </p>
              </div>

              {/* Main Stats Display */}
              <div className="flex flex-col items-center flex-1 justify-center">
                <div className="relative mb-4 sm:mb-6">
                  <span className="absolute left-0 top-0 w-16 h-16 sm:w-24 sm:h-24 bg-orange-300 rounded-full opacity-40 blur-2xl"></span>
                  <div className="relative z-10 bg-white rounded-full p-4 sm:p-6 shadow-lg">
                    <Flame className="text-orange-500 w-12 h-12 sm:w-16 sm:h-16" />
                  </div>
                </div>

                <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 mb-2">
                  {stats.totalCalories}
                </div>
                <div className="text-gray-500 mb-4 sm:mb-6 text-sm sm:text-base text-center">
                  Calories Burned This Week
                </div>

                <div className="space-y-2 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Activity className="text-blue-500 w-4 h-4" />
                    <span className="text-gray-600 text-sm">
                      Workouts: {stats.totalWorkouts}
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Clock className="text-green-500 w-4 h-4" />
                    <span className="text-green-700 text-sm">
                      Time: {stats.totalMinutes} min
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Heart className="text-red-500 w-4 h-4" />
                    <span className="text-red-700 text-sm">
                      Avg HR: {stats.avgHeartRate} bpm
                    </span>
                  </div>
                </div>
              </div>

              {/* Weekly Goal Progress */}
              <div className="mt-4 sm:mt-8">
                <div className="bg-white rounded-xl p-4 shadow-md">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Weekly Goal
                    </span>
                    <span className="text-sm font-bold text-orange-600">
                      {stats.weeklyGoal}%
                    </span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full">
                    <div
                      className="h-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-500"
                      style={{ width: `${stats.weeklyGoal}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Great progress! Keep it up!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Activity Details */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-2xl p-4 sm:p-6 h-full shadow-lg flex flex-col">
              {/* Tabs */}
              <div className="flex space-x-6 sm:space-x-8 justify-center sm:justify-start mb-6 sm:mb-8">
                {tabs.map((tab, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTab(index)}
                    className={`text-base sm:text-lg font-semibold transition-all duration-200 pb-2 ${
                      activeTab === index
                        ? "border-b-2 border-orange-600 text-orange-600"
                        : "text-gray-600 hover:text-orange-500"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Weekly Activity Chart */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-4 mb-8 sm:mb-10">
                {workoutData.map((day, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-xl flex flex-col items-center p-3 sm:p-4 space-y-2 hover:bg-gray-100 transition-colors"
                  >
                    <div className="text-gray-600">
                      {day.duration > 0 ? (
                        <Activity className="w-6 h-6 text-orange-500" />
                      ) : (
                        <Calendar className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    <div className="font-semibold text-sm sm:text-base text-gray-800">
                      {day.name}
                    </div>
                    <div className="text-gray-500 text-xs sm:text-sm">
                      {day.duration > 0 ? `${day.duration}min` : "Rest"}
                    </div>
                    <div className="text-orange-600 text-xs font-medium">
                      {day.calories > 0 ? `${day.calories} cal` : ""}
                    </div>
                  </div>
                ))}
              </div>

              {/* Activity Types & Stats */}
              <div className="flex-1 space-y-6">
                <h2 className="font-bold text-lg sm:text-xl text-gray-800">
                  Activity Overview
                </h2>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  <div className="bg-gray-50 p-4 sm:p-6 rounded-2xl hover:bg-gray-100 transition-colors">
                    <div className="text-gray-500 mb-2 text-sm sm:text-base">
                      Steps Today
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-blue-500 mb-1">
                      8,547
                    </div>
                    <div className="text-gray-600 text-sm">Goal: 10,000</div>
                  </div>

                  <div className="bg-gray-50 p-4 sm:p-6 rounded-2xl hover:bg-gray-100 transition-colors">
                    <div className="text-gray-500 mb-2 text-sm sm:text-base">
                      Distance
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-green-500 mb-1">
                      6.2{" "}
                      <span className="text-base sm:text-lg font-normal">
                        km
                      </span>
                    </div>
                    <div className="text-gray-600 text-sm">This week</div>
                  </div>

                  <div className="bg-gray-50 p-4 sm:p-6 rounded-2xl hover:bg-gray-100 transition-colors">
                    <div className="text-gray-500 mb-2 text-sm sm:text-base">
                      Active Minutes
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-purple-500 mb-1">
                      127
                    </div>
                    <div className="text-gray-600 text-sm">Today</div>
                  </div>

                  <div className="bg-gray-50 p-4 sm:p-6 rounded-2xl hover:bg-gray-100 transition-colors">
                    <div className="text-gray-500 mb-2 text-sm sm:text-base">
                      Streak
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-orange-500 mb-1">
                      12
                    </div>
                    <div className="text-gray-600 text-sm">Days 🔥</div>
                  </div>
                </div>

                {/* Favorite Activities */}
                <div className="bg-gray-50 rounded-2xl p-4 sm:p-6">
                  <h3 className="font-semibold text-gray-800 mb-4">
                    Favorite Activities
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {activities.map((activity, index) => (
                      <div
                        key={index}
                        className="flex flex-col items-center p-3 bg-white rounded-xl hover:shadow-md transition-all"
                      >
                        <div className={`mb-2 ${activity.color}`}>
                          {activity.icon}
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          {activity.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
