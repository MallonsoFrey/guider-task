"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import data from "../data/data.json";
export default function BookList() {
  const [sortOption, setSortOption] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [tagsOpen, setTagsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("selectedTags");
    if (saved) {
      setSelectedTags(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("selectedTags", JSON.stringify(selectedTags));
  }, [selectedTags]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setTagsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const allTags = useMemo(() => {
    const tags = new Set();
    data.forEach((book) => book.tags.forEach((t) => tags.add(t)));
    return Array.from(tags);
  }, [data]);

  const filtered = useMemo(() => {
    if (selectedTags.length === 0) return data;
    return data.filter((book) =>
      selectedTags.every((tag) => book.tags.includes(tag))
    );
  }, [data, selectedTags]);

  const getLastName = (fullName = "") => {
    const parts = fullName.trim().split(" ");
    return parts[parts.length - 1];
  };

  const sorted = useMemo(() => {
    return filtered.slice().sort((a, b) => {
      if (sortOption === "priceAsc" || sortOption === "priceDesc") {
        if (a.price === b.price) {
          const lastA = getLastName(a.author);
          const lastB = getLastName(b.author);
          return lastA.localeCompare(lastB);
        }
        return sortOption === "priceAsc"
          ? a.price - b.price
          : b.price - a.price;
      }

      if (sortOption === "author") {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();

        if (dateA === dateB) {
          const lastA = getLastName(a.author);
          const lastB = getLastName(b.author);
          return lastA.localeCompare(lastB);
        }
        return dateA - dateB;
      }

      if (sortOption === "date") {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return dateA - dateB;
      }

      return 0;
    });
  }, [filtered, sortOption]);

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  return (
    <div className="flex flex-col gap-4 w-full md:w-125 text-xs">
      <div className="flex h-[75px] bg-[#758694] opacity-50 transition duration-300 ease-in-out hover:opacity-100 rounded-4xl justify-between px-12 py-5">
        <div className="flex items-center gap-4">
          <button
            onClick={() =>
              setSortOption((prev) =>
                prev === "priceAsc" ? "priceDesc" : "priceAsc"
              )
            }
            className="hover:text-white"
          >
            price{" "}
            <span
              className={`inline-block transition-transform duration-300 ${
                sortOption === "priceAsc" ? "rotate-180" : "rotate-0"
              }`}
            >
              ↓
            </span>
          </button>
          <button
            onClick={() => setSortOption("author")}
            className="hover:text-white"
          >
            author ↓
          </button>
          <button
            onClick={() => setSortOption("date")}
            className="hover:text-white"
          >
            date ↓
          </button>
        </div>
        <div ref={containerRef} className="relative flex items-center gap-4">
          <button
            className="hover:text-white"
            onClick={() => setTagsOpen(!tagsOpen)}
          >
            <b>
              Tags
              <span
                className={`inline-block transition-transform duration-300 ${
                  tagsOpen ? "rotate-180" : "rotate-0"
                }`}
              >
                ▲
              </span>
            </b>
          </button>
          <div
            className={`flex flex-col rounded-4xl top-[2rem] -right-3 absolute transition-all duration-300 overflow-hidden bg-[#405d72] ${
              tagsOpen ? "min-w-[250px] p-2" : "max-h-0"
            }`}
          >
            <div className="grid grid-cols-2 gap-2 px-2">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-full transition duration-300 ease-in-out hover:bg-[#405d72] hover:text-white ${
                    selectedTags.includes(tag)
                      ? "bg-[#405d72] text-white border-2"
                      : "bg-[#FFF8F3] text-black"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
          <button onClick={() => setSortOption(null)}>reset rules</button>
        </div>
      </div>
      <ol className="flex flex-col p-8 gap-4 rounded-4xl  bg-[#758694]">
        {sorted.map((item, index) => {
          if (!item.date) {
            console.error(
              `Ошибка: у книги "${item.title}" отсутствует поле "date"!`
            );
            return null;
          }

          return (
            <li
              key={index}
              className="bg-[#405d72] px-3 py-4 rounded-4xl flex flex-col"
            >
              <div className="flex flex-col p-3">
                <h2 className="text-base mb-3">
                  {index + 1} <b>{item.title}</b>
                </h2>
                <p>by {item.author}</p>
                <p>{item.date}</p>
                <p>{item.price}$</p>
              </div>
              <span className="block h-[1px] bg-[#8498A8] mt-4 mb-2"></span>
              <div className="flex gap-6">
                {item.tags.map((tag, tagIndex) => (
                  <button
                    key={tagIndex}
                    className="p-3 rounded-[50px] bg-[#FFF8F3] text-black transition duration-300 ease-in-out hover:bg-[#405d72] hover:text-white"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
