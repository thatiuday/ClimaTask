"use client";
import { useEffect, useState, useCallback, useMemo } from "react";
import type React from "react";

import { Trash2, Plus, GripVertical } from "lucide-react";

type Todo = {
  task: string;
  completed: boolean;
  id: string;
};

export default function TodoPage() {
  const [getName, setGetName] = useState("");
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [showInput, setShowInput] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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

  const handleAdd = useCallback(() => {
    if (task.trim() === "") return;

    const newTodo: Todo = {
      task: task.trim(),
      completed: false,
      id: Date.now().toString(),
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
        const todosWithIds = parsedTodos.map((todo: any, index: number) => ({
          ...todo,
          id: todo.id || `${Date.now()}-${index}`,
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
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-gray-50 p-4 sm:p-6 lg:p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto h-full">
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 h-full min-h-[calc(100vh-4rem)] flex flex-col">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4 flex-shrink-0">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-2 mb-2">
                {greeting}, {getName || "Guest"}! <span>👋</span>
              </h1>
              <p className="text-gray-500 text-sm sm:text-base">
                {currentDate}
              </p>
            </div>
            <select className="border border-gray-300 rounded-lg px-4 py-2 text-gray-700 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
              <option>Today</option>
              <option>Tomorrow</option>
              <option>This weekend</option>
            </select>
          </div>

          {/* Todo List */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto mb-6">
              {todos.length === 0 ? (
                <div className="text-center py-12 text-gray-500 h-full flex flex-col justify-center">
                  <div className="text-4xl mb-4">📝</div>
                  <p className="text-lg mb-2">No tasks yet</p>
                  <p className="text-sm">
                    Create your first task to get started!
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {todos.map((todo) => (
                    <div
                      key={todo.id}
                      className="group flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-200 border border-transparent hover:border-gray-200"
                    >
                      <div className="cursor-grab transition-opacity sm:opacity-0 sm:group-hover:opacity-100 opacity-100">
                        <GripVertical className="w-4 h-4 text-gray-400" />
                      </div>

                      <input
                        type="checkbox"
                        aria-label={`Toggle ${todo.task}`}
                        className="w-5 h-5 accent-blue-500 rounded cursor-pointer"
                        checked={todo.completed}
                        onChange={() => handleToggleComplete(todo.id)}
                      />

                      <span
                        className={`flex-1 transition-all duration-200 ${
                          todo.completed
                            ? "line-through text-gray-400"
                            : "text-gray-800"
                        }`}
                      >
                        {todo.task}
                      </span>

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
                      className="flex-1 sm:flex-none sm:w-32 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 focus:ring-4 focus:ring-green-300"
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
                  className="flex items-center justify-center gap-2 w-full sm:w-auto sm:self-start bg-black hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 focus:ring-4 focus:ring-gray-300"
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
  );
}
