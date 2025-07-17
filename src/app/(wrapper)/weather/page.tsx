"use client";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Cloud, CloudRain, Search, Settings, Sun } from "lucide-react";

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

export default function Weather() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [cityName, setCityName] = useState("");
  const [activeTab, setActiveTab] = useState(0);

  const week = [
    { day: "Sun", icon: <Sun />, temp: "15°-3°" },
    { day: "Mon", icon: <CloudRain />, temp: "12°-7°" },
    { day: "Tue", icon: <Cloud />, temp: "9°-7°" },
    { day: "Wed", icon: <CloudRain />, temp: "8°-1°" },
    { day: "Thurs", icon: <Cloud />, temp: "5°-2°" },
    { day: "Fri", icon: <Sun />, temp: "4°-4°" },
    { day: "Sat", icon: <Sun />, temp: "3°-3°" },
  ];
  const tabs = ["Today", "Week"];

  const getWeather = useCallback(
    async (city = cityName) => {
      if (!city) return;
      try {
        const response = await axios.get(
          "http://api.weatherapi.com/v1/current.json",
          {
            params: {
              key: "770fc41b657f485f8c160300250107",
              q: city,
              api: "yes",
            },
          }
        );
        if (response.status === 200) {
          setWeatherData(response.data);
        }
      } catch (error) {
        console.error("Error fetching weather:", error);
      }
    },
    [cityName]
  );

  useEffect(() => {
    getWeather();
  }, [getWeather]);

  const temp = weatherData?.current?.temp_c ?? 12;
  const condition = weatherData?.current?.condition?.text ?? "Mostly Cloudy";
  const rain = weatherData?.current?.precip_mm
    ? `${weatherData.current.precip_mm}%`
    : "30%";
  const city = weatherData?.location?.name ?? "New York";
  const time = weatherData?.location?.localtime ?? "Monday, 16:00";

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 md:p-10">
      <div className="flex flex-col md:flex-row h-full">
        {/* Left Panel */}
        <div className="bg-white w-full md:w-auto md:flex-shrink-0">
          <div className="bg-gradient-to-br from-yellow-100 to-blue-100 min-h-full p-6 rounded-lg md:rounded-l-lg md:rounded-r-none flex flex-col">
            {/* Search Bar */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center bg-white rounded-xl px-3 py-2 shadow-sm w-full">
                <Search className="text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search for places..."
                  className="w-full bg-transparent outline-none"
                  value={cityName}
                  onChange={(e) => setCityName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      getWeather(e.currentTarget.value);
                    }
                  }}
                />
              </div>
              <button className="ml-3 p-2 rounded-full hover:bg-gray-200 transition">
                <Settings className="text-gray-500" />
              </button>
            </div>
            {/* Weather Info */}
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                <span className="absolute left-0 top-0 w-24 h-24 bg-yellow-300 rounded-full opacity-40 blur-2xl"></span>
                <CloudRain className="text-yellow-400 text-[90px] drop-shadow-lg" />
              </div>
              <div className="text-5xl font-bold text-gray-800 mb-2">
                {temp}°C
              </div>
              <div className="text-gray-500 mb-6">{time}</div>
              <div className="flex items-center gap-2 mb-2">
                <Cloud className="text-gray-400" />
                <span className="text-gray-600 text-sm">{condition}</span>
              </div>
              <div className="flex items-center gap-2">
                <CloudRain className="text-blue-400" />
                <span className="text-blue-700 text-sm">Rain - {rain}</span>
              </div>
            </div>
            {/* City Image */}
            <div className="rounded-xl overflow-hidden mt-8">
              <Image
                src="https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80"
                alt="city"
                width={400}
                height={80}
                className="w-full h-20 object-cover"
              />
              <div className="bg-white text-gray-700 text-center py-2 font-semibold">
                {city}
              </div>
            </div>
          </div>
        </div>
        {/* Right Panel */}
        <div className="bg-gray-100 p-4 sm:p-6 flex-1 space-y-8 md:space-y-10 mt-4 md:mt-0 md:rounded-r-lg md:rounded-l-none rounded-lg">
          {/* Tabs */}
          <div className="flex space-x-4 sm:space-x-6 justify-center md:justify-start">
            {tabs.map((tab, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`text-base font-semibold transition duration-200 ${
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-2">
            {week.map((w, index) => (
              <div
                key={index}
                className="flex bg-white rounded-xl flex-col items-center px-2 py-4 sm:px-4 sm:py-6 space-y-2"
              >
                <div className="text-xl sm:text-2xl mb-1">{w.icon}</div>
                <div className="font-semibold text-sm sm:text-base">
                  {w.day}
                </div>
                <div className="text-gray-500 text-xs sm:text-sm">{w.temp}</div>
              </div>
            ))}
          </div>
          {/* Today's Highlights */}
          <div className="space-y-6 sm:space-y-8">
            <p className="font-bold text-lg">Today&apos;s Highlights</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-white p-4 sm:p-6 rounded-2xl">
                <div className="text-gray-500 mb-2">UV Index</div>
                <div className="text-2xl sm:text-3xl font-bold text-yellow-500 mb-1">
                  5
                </div>
                <div className="w-full h-2 bg-yellow-200 rounded-full">
                  <div className="h-2 bg-yellow-400 rounded-full w-1/2"></div>
                </div>
              </div>
              <div className="bg-white p-4 sm:p-6 rounded-2xl">
                <div className="text-gray-500 mb-2">Wind Status</div>
                <div className="text-2xl sm:text-3xl font-bold mb-1">
                  7.70{" "}
                  <span className="text-base sm:text-lg font-normal">km/h</span>
                </div>
                <div className="text-gray-600">WSW</div>
              </div>
              <div className="bg-white p-4 sm:p-6 rounded-2xl">
                <div className="text-gray-500 mb-2">Sunrise & Sunset</div>
                <div className="flex gap-2 text-yellow-300 text-sm sm:text-base">
                  <span>↑</span>
                  <span className="font-semibold text-gray-700">6:35 AM</span>
                  <span className="text-gray-400">1m 46s</span>
                </div>
                <div className="flex gap-2 text-yellow-300 text-sm sm:text-base">
                  <span>↓</span>
                  <span className="font-semibold text-gray-700">5:42 PM</span>
                  <span className="text-gray-400">1m 46s</span>
                </div>
              </div>
              <div className="bg-white p-4 sm:p-6 rounded-2xl flex flex-col items-center">
                <div className="text-gray-500 mb-2">Humidity</div>
                <div className="text-2xl sm:text-3xl font-bold text-blue-400 mb-1">
                  12%
                </div>
                <div className="text-gray-600">Normal 👍🏻</div>
              </div>
              <div className="bg-white p-4 sm:p-6 rounded-2xl flex flex-col items-center">
                <div className="text-gray-500 mb-2">Visibility</div>
                <div className="text-2xl sm:text-3xl font-bold text-blue-400 mb-1">
                  5.2{" "}
                  <span className="text-base sm:text-lg font-normal">km</span>
                </div>
                <div className="text-gray-600">Average 😌</div>
              </div>
              <div className="bg-white p-4 sm:p-6 rounded-2xl flex flex-col items-center">
                <div className="text-gray-500 mb-2">Air Quality</div>
                <div className="text-2xl sm:text-3xl font-bold text-red-400 mb-1">
                  105
                </div>
                <div className="text-gray-600">Unhealthy 👎🏻</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
