"use client";
import { useEffect, useState, useCallback, useMemo } from "react";
import type React from "react";
import {
  Trash2,
  Plus,
  GripVertical,
  CheckCircle2,
  Circle,
  Clock,
} from "lucide-react";

type Todo = {
  task: string;
  completed: boolean;
  id: string;
  createdAt: string;
};

export default function TodoPage() {
  const [getName, setGetName] = useState("");
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [showInput, setShowInput] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  const tabs = ["All Tasks", "Completed", "Pending"];

  const currentDate = useMemo(() => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    return `Today, ${today.toLocaleDateString("en-US", options)}`;
  }, []);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  }, []);

  const filteredTodos = useMemo(() => {
    switch (activeTab) {
      case 1:
        return todos.filter((todo) => todo.completed);
      case 2:
        return todos.filter((todo) => !todo.completed);
      default:
        return todos;
    }
  }, [todos, activeTab]);

  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter((todo) => todo.completed).length;
    const pending = total - completed;
    const completionRate =
      total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, pending, completionRate };
  }, [todos]);

  const handleAdd = useCallback(() => {
    if (task.trim() === "") return;

    const newTodo: Todo = {
      task: task.trim(),
      completed: false,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    setTodos((prev) => [newTodo, ...prev]);
    setTask("");
    setShowInput(false);
  }, [task]);

  const handleDelete = useCallback((id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }, []);

  const handleToggleComplete = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        handleAdd();
      }
    },
    [handleAdd]
  );

  // Load data from localStorage
  useEffect(() => {
    try {
      const nameFromStorage = localStorage.getItem("gretingName");
      setGetName(nameFromStorage || "");

      const storedTodos = localStorage.getItem("todos");
      if (storedTodos) {
        const parsedTodos = JSON.parse(storedTodos);
        // Add IDs to existing todos if they don't have them
        const todosWithIds = parsedTodos.map((todo: Todo, index: number) => ({
          // Change 'any' to 'Todo' here
          ...todo,
          id: todo.id || `${Date.now()}-${index}`,
          createdAt: todo.createdAt || new Date().toISOString(),
        }));
        setTodos(todosWithIds);
      }
    } catch (error) {
      console.error("Error loading data from localStorage:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save todos to localStorage
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem("todos", JSON.stringify(todos));
      } catch (error) {
        console.error("Error saving todos to localStorage:", error);
      }
    }
  }, [todos, isLoading]);

  if (isLoading) {
    return (
      <div className="h-full w-full bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-gray-50 p-3 sm:p-4 lg:p-6 overflow-y-auto">
      <div className="max-w-7xl mx-auto h-full">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full min-h-[calc(100vh-3rem)]">
          {/* Left Panel - Task Overview */}
          <div className="xl:col-span-1">
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 h-full min-h-[500px] xl:min-h-full p-4 sm:p-6 rounded-2xl flex flex-col shadow-lg">
              {/* Header */}
              <div className="mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
                  {greeting}, {getName || "Guest"}! 👋
                </h1>
                <p className="text-gray-600 text-sm sm:text-base">
                  {currentDate}
                </p>
              </div>

              {/* Stats Display */}
              <div className="flex flex-col items-center flex-1 justify-center">
                <div className="relative mb-4 sm:mb-6">
                  <span className="absolute left-0 top-0 w-16 h-16 sm:w-24 sm:h-24 bg-blue-300 rounded-full opacity-40 blur-2xl"></span>
                  <div className="relative z-10 bg-white rounded-full p-4 sm:p-6 shadow-lg">
                    <CheckCircle2 className="text-blue-500 w-12 h-12 sm:w-16 sm:h-16" />
                  </div>
                </div>

                <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 mb-2">
                  {stats.completionRate}%
                </div>
                <div className="text-gray-500 mb-4 sm:mb-6 text-sm sm:text-base text-center">
                  Tasks Completed
                </div>

                <div className="space-y-2 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Circle className="text-gray-400 w-4 h-4" />
                    <span className="text-gray-600 text-sm">
                      Total: {stats.total} tasks
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle2 className="text-green-500 w-4 h-4" />
                    <span className="text-green-700 text-sm">
                      Completed: {stats.completed}
                    </span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Clock className="text-orange-500 w-4 h-4" />
                    <span className="text-orange-700 text-sm">
                      Pending: {stats.pending}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4 sm:mt-8">
                <div className="bg-white rounded-xl p-4 shadow-md">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Progress
                    </span>
                    <span className="text-sm font-bold text-blue-600">
                      {stats.completionRate}%
                    </span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full">
                    <div
                      className="h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                      style={{ width: `${stats.completionRate}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Task Management */}
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

              {/* Task List */}
              <div className="flex-1 flex flex-col min-h-0">
                <div className="flex-1 overflow-y-auto mb-6">
                  {filteredTodos.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 h-full flex flex-col justify-center">
                      <div className="text-4xl mb-4">📝</div>
                      <p className="text-lg mb-2">
                        {activeTab === 1
                          ? "No completed tasks"
                          : activeTab === 2
                          ? "No pending tasks"
                          : "No tasks yet"}
                      </p>
                      <p className="text-sm">
                        {activeTab === 0 &&
                          "Create your first task to get started!"}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredTodos.map((todo) => (
                        <div
                          key={todo.id}
                          className="group flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200 border border-transparent hover:border-gray-200"
                        >
                          <div className="cursor-grab transition-opacity sm:opacity-0 sm:group-hover:opacity-100 opacity-100">
                            <GripVertical className="w-4 h-4 text-gray-400" />
                          </div>

                          <button
                            onClick={() => handleToggleComplete(todo.id)}
                            className="flex-shrink-0"
                          >
                            {todo.completed ? (
                              <CheckCircle2 className="w-5 h-5 text-green-500" />
                            ) : (
                              <Circle className="w-5 h-5 text-gray-400 hover:text-blue-500 transition-colors" />
                            )}
                          </button>

                          <div className="flex-1">
                            <span
                              className={`block transition-all duration-200 ${
                                todo.completed
                                  ? "line-through text-gray-400"
                                  : "text-gray-800"
                              }`}
                            >
                              {todo.task}
                            </span>
                            <span className="text-xs text-gray-400">
                              {new Date(todo.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          <button
                            onClick={() => handleDelete(todo.id)}
                            className="p-2 rounded-lg hover:bg-red-50 text-red-500 hover:text-red-600 transition-all duration-200 sm:opacity-0 sm:group-hover:opacity-100 opacity-100"
                            aria-label={`Delete ${todo.task}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Add Task Section */}
                <div className="flex-shrink-0">
                  {showInput ? (
                    <div className="space-y-3">
                      <input
                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        type="text"
                        placeholder="Enter your task here..."
                        value={task}
                        onChange={(e) => setTask(e.target.value)}
                        onKeyDown={handleKeyDown}
                        autoFocus
                      />
                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          onClick={handleAdd}
                          disabled={!task.trim()}
                          className="flex-1 sm:flex-none sm:w-32 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 focus:ring-4 focus:ring-blue-300"
                        >
                          Add Task
                        </button>
                        <button
                          onClick={() => {
                            setShowInput(false);
                            setTask("");
                          }}
                          className="flex-1 sm:flex-none sm:w-24 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-xl transition-all duration-200"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowInput(true)}
                      className="flex items-center justify-center gap-2 w-full sm:w-auto sm:self-start bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 focus:ring-4 focus:ring-blue-300"
                    >
                      <Plus className="w-5 h-5" />
                      Create new task
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
