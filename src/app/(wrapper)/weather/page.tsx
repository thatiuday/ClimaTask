"use client";
import Image from "next/image";
import type React from "react";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Cloud, CloudRain, Search, Settings, Sun, Loader2 } from "lucide-react";

type WeatherData = {
  current: {
    temp_c: number;
    condition: { text: string };
    precip_mm: number;
  };
  location: {
    name: string;
    localtime: string;
  };
};

export default function WeatherPage() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [cityName, setCityName] = useState("");
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const weekData = useMemo(
    () => [
      { day: "Sun", icon: <Sun className="w-6 h-6" />, temp: "15°-3°" },
      { day: "Mon", icon: <CloudRain className="w-6 h-6" />, temp: "12°-7°" },
      { day: "Tue", icon: <Cloud className="w-6 h-6" />, temp: "9°-7°" },
      { day: "Wed", icon: <CloudRain className="w-6 h-6" />, temp: "8°-1°" },
      { day: "Thu", icon: <Cloud className="w-6 h-6" />, temp: "5°-2°" },
      { day: "Fri", icon: <Sun className="w-6 h-6" />, temp: "4°-4°" },
      { day: "Sat", icon: <Sun className="w-6 h-6" />, temp: "3°-3°" },
    ],
    []
  );

  const tabs = ["Today", "Week"];

  const getWeather = useCallback(
    async (city = cityName) => {
      if (!city.trim()) return;

      setIsLoading(true);
      setError(null);

      try {
        // Use native fetch instead of axios for better performance
        const response = await fetch(
          `https://api.weatherapi.com/v1/current.json?key=770fc41b657f485f8c160300250107&q=${encodeURIComponent(
            city
          )}&aqi=yes`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Weather data not found for "${city}"`);
        }

        const data = await response.json();
        setWeatherData(data);
      } catch (error) {
        console.error("Error fetching weather:", error);
        setError(
          error instanceof Error
            ? error.message
            : "Failed to fetch weather data"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [cityName]
  );

  useEffect(() => {
    // Load default city weather
    if (!weatherData) {
      getWeather("New York");
    }
  }, [getWeather, weatherData]);

  const handleSearch = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        getWeather(e.currentTarget.value);
      }
    },
    [getWeather]
  );

  const temp = weatherData?.current?.temp_c ?? 12;
  const condition = weatherData?.current?.condition?.text ?? "Mostly Cloudy";
  const rain = weatherData?.current?.precip_mm
    ? `${weatherData.current.precip_mm}%`
    : "30%";
  const city = weatherData?.location?.name ?? "New York";
  const time = weatherData?.location?.localtime ?? "Monday, 16:00";

  return (
    <div className="h-full w-full bg-gray-50 p-3 sm:p-4 lg:p-6 overflow-y-auto">
      <div className="max-w-7xl mx-auto h-full">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full min-h-[calc(100vh-3rem)]">
          {/* Left Panel - Weather Info */}
          <div className="xl:col-span-1">
            <div className="bg-gradient-to-br from-yellow-100 to-blue-100 h-full min-h-[500px] xl:min-h-full p-4 sm:p-6 rounded-2xl flex flex-col shadow-lg">
              {/* Search Bar */}
              <div className="flex items-center gap-3 mb-6 sm:mb-8">
                <div className="flex items-center bg-white rounded-xl px-3 py-2 shadow-sm flex-1">
                  <Search className="text-gray-400 mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                  <input
                    type="text"
                    placeholder="Search for places..."
                    className="w-full bg-transparent outline-none text-sm sm:text-base"
                    value={cityName}
                    onChange={(e) => setCityName(e.target.value)}
                    onKeyDown={handleSearch}
                    disabled={isLoading}
                  />
                  {isLoading && (
                    <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                  )}
                </div>
                <button className="p-2 rounded-xl hover:bg-white/50 transition-colors">
                  <Settings className="text-gray-500 w-5 h-5" />
                </button>
              </div>

              {/* Weather Display */}
              <div className="flex flex-col items-center flex-1 justify-center">
                {error ? (
                  <div className="text-center text-red-600 mb-4">
                    <p className="text-sm">{error}</p>
                  </div>
                ) : (
                  <>
                    <div className="relative mb-4 sm:mb-6">
                      <span className="absolute left-0 top-0 w-16 h-16 sm:w-24 sm:h-24 bg-yellow-300 rounded-full opacity-40 blur-2xl"></span>
                      <CloudRain className="text-yellow-400 w-16 h-16 sm:w-20 sm:h-20 drop-shadow-lg relative z-10" />
                    </div>
                    <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 mb-2">
                      {temp}°C
                    </div>
                    <div className="text-gray-500 mb-4 sm:mb-6 text-sm sm:text-base text-center">
                      {time}
                    </div>
                    <div className="space-y-2 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Cloud className="text-gray-400 w-4 h-4" />
                        <span className="text-gray-600 text-sm">
                          {condition}
                        </span>
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <CloudRain className="text-blue-400 w-4 h-4" />
                        <span className="text-blue-700 text-sm">
                          Rain - {rain}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* City Image */}
              <div className="rounded-xl overflow-hidden mt-4 sm:mt-8 shadow-md">
                <div className="relative h-16 sm:h-20">
                  <Image
                    src="https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80"
                    alt={`${city} cityscape`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 400px"
                    priority={false}
                  />
                </div>
                <div className="bg-white text-gray-700 text-center py-2 sm:py-3 font-semibold text-sm sm:text-base">
                  {city}
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Details */}
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
                        ? "border-b-2 border-blue-600 text-blue-600"
                        : "text-gray-600 hover:text-blue-500"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Week Forecast */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 sm:gap-4 mb-8 sm:mb-10">
                {weekData.map((w, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-xl flex flex-col items-center p-3 sm:p-4 space-y-2 hover:bg-gray-100 transition-colors"
                  >
                    <div className="text-gray-600">{w.icon}</div>
                    <div className="font-semibold text-sm sm:text-base text-gray-800">
                      {w.day}
                    </div>
                    <div className="text-gray-500 text-xs sm:text-sm">
                      {w.temp}
                    </div>
                  </div>
                ))}
              </div>

              {/* Today's Highlights */}
              <div className="flex-1 space-y-6">
                <h2 className="font-bold text-lg sm:text-xl text-gray-800">
                  Today&apos;s Highlights
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {[
                    {
                      title: "UV Index",
                      value: "5",
                      color: "yellow",
                      progress: 50,
                    },
                    {
                      title: "Wind Status",
                      value: "7.70",
                      unit: "km/h",
                      subtitle: "WSW",
                    },
                    { title: "Sunrise & Sunset", isComplex: true },
                    {
                      title: "Humidity",
                      value: "12",
                      unit: "%",
                      subtitle: "Normal 👍🏻",
                      color: "blue",
                    },
                    {
                      title: "Visibility",
                      value: "5.2",
                      unit: "km",
                      subtitle: "Average 😌",
                      color: "blue",
                    },
                    {
                      title: "Air Quality",
                      value: "105",
                      subtitle: "Unhealthy 👎🏻",
                      color: "red",
                    },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 p-4 sm:p-6 rounded-2xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="text-gray-500 mb-2 text-sm sm:text-base">
                        {item.title}
                      </div>
                      {item.isComplex ? (
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm sm:text-base">
                            <span className="text-yellow-500">↑</span>
                            <span className="font-semibold text-gray-700">
                              6:35 AM
                            </span>
                            <span className="text-gray-400 text-xs sm:text-sm">
                              1m 46s
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm sm:text-base">
                            <span className="text-yellow-500">↓</span>
                            <span className="font-semibold text-gray-700">
                              5:42 PM
                            </span>
                            <span className="text-gray-400 text-xs sm:text-sm">
                              1m 46s
                            </span>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div
                            className={`text-2xl sm:text-3xl font-bold mb-1 ${
                              item.color === "yellow"
                                ? "text-yellow-500"
                                : item.color === "blue"
                                ? "text-blue-400"
                                : item.color === "red"
                                ? "text-red-400"
                                : "text-gray-800"
                            }`}
                          >
                            {item.value}
                            {item.unit && (
                              <span className="text-base sm:text-lg font-normal ml-1">
                                {item.unit}
                              </span>
                            )}
                          </div>
                          {item.progress && (
                            <div className="w-full h-2 bg-yellow-200 rounded-full">
                              <div
                                className="h-2 bg-yellow-400 rounded-full"
                                style={{ width: `${item.progress}%` }}
                              ></div>
                            </div>
                          )}
                          {item.subtitle && (
                            <div className="text-gray-600 text-sm">
                              {item.subtitle}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
