"use client";
import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export default function Page() {
  const [getName, setGetName] = useState("");
  const [task, setTask] = useState("");
  const [date, setDate] = useState("");
  const [todos, setTodos] = useState([]);
  const [showInput, setshowInput] = useState(false);

  function handleAdd() {
    if (task.trim() === "") {
      console.log("No Tasks");
      return;
    }
    setTodos([{ task, completed: false }, ...todos]);
    setTask("");
    setshowInput(false);
  }

  function handleDelete(id) {
    const updatedTodos = todos.filter((item, index) => index !== id);
    setTodos(updatedTodos);
  }

  function handleDragEnd(result) {
    if (!result.destination) return;
    const items = Array.from(todos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setTodos(items);
  }

  useEffect(() => {
    const nameFromStorage = localStorage.getItem("gretingName");
    setGetName(nameFromStorage || "");
    const storedTodos = JSON.parse(localStorage.getItem("todos") || "[]");
    setTodos(storedTodos);

    const today = new Date();
    const options = {
      weekday: "short",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    const formattedDate = `Today, ${today.toLocaleDateString(
      "en-US",
      options
    )}`;
    setDate(formattedDate);
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const hour = new Date().getHours();
  let greet = "";
  if (hour < 12) greet = "Good Morning";
  else if (hour < 18) greet = "Good Afternoon";
  else greet = "Good Evening";

  function handleToggleComplete(idx) {
    setTodos((prev) =>
      prev.map((todo, i) =>
        i === idx ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }

  return (
    <div className="w-full min-h-screen bg-white p-4 sm:p-6 md:p-10">
      <div className="h-full flex flex-col">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4 sm:gap-0">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              {greet}, {getName || "no name to greet"}! <span>👋</span>
            </h1>
            <p className="text-gray-500">{date}</p>
          </div>
          <select className="border rounded-lg px-4 py-2 text-gray-700 bg-white shadow-sm mt-2 sm:mt-0">
            <option>Today</option>
            <option>Tomorrow</option>
            <option>This weekend</option>
          </select>
        </div>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="todos">
            {(provided) => (
              <ul
                className="my-4 space-y-4 flex-1 overflow-y-auto"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {todos.map((todo, idx) => (
                  <Draggable key={idx} draggableId={String(idx)} index={idx}>
                    {(provided, snapshot) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`px-4 py-2 w-full bg-gray-200 rounded text-gray-800 flex items-center justify-between ${
                          snapshot.isDragging ? "bg-gray-300" : ""
                        }`}
                      >
                        <input
                          type="checkbox"
                          aria-label={`Toggle ${todo.task}`}
                          className="mr-3 w-5 h-5 accent-blue-500 rounded"
                          checked={todo.completed}
                          onChange={() => handleToggleComplete(idx)}
                        />
                        <span
                          className={`flex-1 ${
                            todo.completed ? "line-through text-gray-400" : ""
                          }`}
                        >
                          {todo.task}
                        </span>
                        <div onClick={() => handleDelete(idx)}>
                          <Trash2
                            color="red"
                            className="hover:cursor-pointer"
                          />
                        </div>
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
        {showInput ? (
          <div className="flex flex-col sm:flex-row items-center gap-2 justify-start w-full mt-auto text-gray-700 rounded-lg">
            <input
              className="w-full shadow mb-2 sm:mb-4 bg-white h-10 border border-gray-200 p-4 rounded-lg"
              type="text"
              placeholder="Enter tasks here"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAdd();
              }}
            />
            <button
              className="rounded-lg mb-4 text-white w-full sm:w-[150px] h-[40px] cursor-pointer flex justify-center items-center border border-[#34974d] bg-[#3aa856] p-2"
              onClick={handleAdd}
            >
              + Add Task
            </button>
          </div>
        ) : (
          <button
            onClick={() => setshowInput(true)}
            className="flex items-center mb-4 justify-center sm:justify-start w-full sm:w-1/2 cursor-pointer py-2 text-white px-4 mt-auto rounded-full bg-black transition"
          >
            + Create new task
          </button>
        )}
      </div>
    </div>
  );
}
