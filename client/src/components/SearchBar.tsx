import { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";

export const SearchBar = () => {
  const [query, setQuery] = useState("");

  useEffect(() => {
    // remove prev highlights
    const highlights = document.querySelectorAll(".highlight");
    highlights.forEach((el) => {
      const parent = el.parentNode;
      if (parent) {
        parent.replaceChild(document.createTextNode(el.textContent!), el);
      }
    });

    if (!query) return;

    // highlight all matches
    const bodyText = document.body;
    const regex = new RegExp(query, "gi");

    const walk = (node: Node) => {
      if (node.nodeType === 3) {
        const match = node.nodeValue?.match(regex);
        if (match) {
          const span = document.createElement("span");
          span.className = "highlight";
          span.style.backgroundColor = "#fff3cd";
          span.style.padding = "0 2px";
          span.textContent = node.nodeValue!;
          node.parentNode?.replaceChild(span, node);
        }
      } else {
        node.childNodes.forEach(walk);
      }
    };

    walk(bodyText);
  }, [query]);

  return (
    <div className="flex items-center bg-slate-100 rounded-full px-4 py-2 w-[300px]">
      <FiSearch className="text-slate-400 mr-2" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
        className="bg-transparent outline-none w-full text-slate-700"
      />
    </div>
  );
};
