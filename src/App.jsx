// App.jsx
import React, { useState, useEffect } from "react";
import { Sun, Moon, Star, StarOff } from "lucide-react";

function App() {
  const [task, setTask] = useState("");
  const [tag, setTag] = useState("");
  const [deadline, setDeadline] = useState("");
  const [tasks, setTasks] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [sortNewestFirst, setSortNewestFirst] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [search, setSearch] = useState("");
  const [filterIncompleteOnly, setFilterIncompleteOnly] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("tasks");
    if (saved) setTasks(JSON.parse(saved));
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks, isLoaded]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!task.trim()) return;
    const newTask = {
      text: task.trim(),
      tag: tag.trim(),
      deadline: deadline,
      createdAt: new Date().toISOString(),
      isDone: false,
      isPinned: false,
    };
    setTasks([...tasks, newTask]);
    setTask("");
    setTag("");
    setDeadline("");
  };

  const handleDelete = (index) => {
    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);
  };

  const handleDeleteCompleted = () => {
    const remaining = tasks.filter((t) => !t.isDone);
    setTasks(remaining);
  };

  const toggleDone = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].isDone = !updatedTasks[index].isDone;
    setTasks(updatedTasks);
  };

  const togglePin = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].isPinned = !updatedTasks[index].isPinned;
    setTasks(updatedTasks);
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.text.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterIncompleteOnly ? !task.isDone : true;
    return matchesSearch && matchesFilter;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
    const aTime = new Date(a.createdAt).getTime();
    const bTime = new Date(b.createdAt).getTime();
    return sortNewestFirst ? bTime - aTime : aTime - bTime;
  });

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.isDone).length;

  return (
    <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800"} min-h-screen py-8 px-4`}>
      <div className={`${darkMode ? "bg-gray-800" : "bg-white"} max-w-xl mx-auto rounded-2xl shadow-xl p-6`}>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-extrabold text-blue-600">
            📝 ChatGPT TODO App
          </h1>
          <div className="flex items-center gap-2">
            <Sun size={20} className={darkMode ? "opacity-50" : "text-yellow-400"} />
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${darkMode ? "bg-blue-600" : "bg-gray-300"}`}
              aria-label="テーマ切替"
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${darkMode ? "translate-x-6" : "translate-x-0"}`}
              ></div>
            </button>
            <Moon size={20} className={darkMode ? "text-yellow-300" : "opacity-50"} />
          </div>
        </div>

        {/* 統計と検索・フィルター */}
        <div className="mb-4 space-y-2 text-sm">
          <p>完了：{completedTasks} / {totalTasks} 件</p>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="タスク検索..."
            className="w-full px-3 py-1 border rounded"
          />
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={filterIncompleteOnly}
              onChange={() => setFilterIncompleteOnly(!filterIncompleteOnly)}
              className="accent-blue-500"
            />
            未完了のみ表示
          </label>
        </div>

        {/* タスク入力フォーム */}
        <form onSubmit={handleSubmit} className="space-y-3 mb-6">
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="タスクを入力..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            placeholder="タグ（任意）"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-600 transition"
          >
            追加
          </button>
        </form>

        {/* 並び順切替 & 完了一括削除 */}
        <div className="flex justify-between mb-4 text-sm">
          <button
            onClick={() => setSortNewestFirst(!sortNewestFirst)}
            className="text-blue-500 hover:underline"
          >
            並び順: {sortNewestFirst ? "新しい順" : "古い順"}
          </button>
          <button
            onClick={handleDeleteCompleted}
            className="text-red-500 hover:underline"
          >
            完了済みを一括削除
          </button>
        </div>

        {/* タスクリスト表示 */}
        <ul className="space-y-3">
          {sortedTasks.map((t, i) => (
            <li
              key={i}
              className={`flex justify-between items-start px-4 py-3 border rounded-lg ${darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"} hover:shadow`}
            >
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={t.isDone}
                  onChange={() => toggleDone(i)}
                  className="mt-1 accent-blue-500"
                />
                <div>
                  <p className={`text-base font-medium ${t.isDone ? "line-through text-gray-400" : ""}`}>
                    {t.text}
                  </p>
                  {t.tag && <p className="text-xs text-indigo-500"># {t.tag}</p>}
                  {t.deadline && <p className="text-xs text-red-500">期限: {t.deadline}</p>}
                  <p className="text-xs text-gray-400">
                    登録日時: {new Date(t.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <button
                  onClick={() => togglePin(i)}
                  className="text-yellow-400 hover:text-yellow-300"
                  title="ピン留め"
                >
                  {t.isPinned ? <Star size={18} /> : <StarOff size={18} />}
                </button>
                <button
                  onClick={() => handleDelete(i)}
                  className="text-sm text-red-500 hover:text-red-700 transition"
                >
                  削除
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
