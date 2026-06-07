import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { addPaste, updatePaste } from "../redux/pasteSlice";

export default function Home() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const pasteId = searchParams.get("pasteId");
  const pastes = useSelector((s) => s.paste.pastes);
  const dispatch = useDispatch();

  useEffect(() => {
    if (pasteId) {
      const paste = pastes.find((p) => p._id === pasteId);
      if (paste) {
        setTitle(paste.title);
        setContent(paste.content);
      }
    }
  }, [pasteId]);

  const lines = content.split("\n");

  function handleSubmit() {
    if (!title.trim() || !content.trim()) return;
    if (pasteId) {
      dispatch(updatePaste({ _id: pasteId, title, content, updatedAt: new Date().toISOString() }));
    } else {
      dispatch(addPaste({ _id: Date.now().toString(), title, content, createdAt: new Date().toISOString() }));
    }
    setTitle("");
    setContent("");
    setSearchParams({});
  }

  function handleReset() {
    setTitle("");
    setContent("");
    setSearchParams({});
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Title + buttons */}
      <div className="flex gap-3 items-center">
        <input
          type="text"
          placeholder="Enter title here"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-white/25 transition-colors"
        />
        <button
          onClick={handleSubmit}
          className="bg-[#5b6cf7] hover:bg-[#6b7cf9] text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors whitespace-nowrap"
        >
          {pasteId ? "Update Paste" : "Create Paste"}
        </button>
        {pasteId && (
          <button
            onClick={handleReset}
            className="bg-white/10 hover:bg-white/15 text-white/70 text-sm px-4 py-2.5 rounded-lg transition-colors"
          >
            Cancel
          </button>
        )}
      </div>

      {/* Editor */}
      <div className="rounded-xl border border-white/10 overflow-hidden">
        {/* Editor titlebar */}
        <div className="bg-[#1e1e1e] px-4 py-2.5 flex items-center justify-between border-b border-white/10">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <span className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <button
            onClick={() => navigator.clipboard.writeText(content)}
            className="text-white/30 hover:text-white/70 transition-colors text-xs flex items-center gap-1.5"
            title="Copy"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            copy
          </button>
        </div>

        {/* Line numbers + textarea */}
        <div className="flex bg-[#141414] min-h-[380px]">
          <div
            className="select-none text-right font-mono text-xs text-white/20 pt-3 pb-3 px-3 leading-6 min-w-[44px] border-r border-white/5"
            aria-hidden="true"
          >
            {lines.map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter content here..."
            className="flex-1 bg-transparent resize-none outline-none font-mono text-sm text-white/80 placeholder-white/15 p-3 leading-6"
            onKeyDown={(e) => {
              if (e.key === "Tab") {
                e.preventDefault();
                const s = e.target.selectionStart;
                const val = e.target.value;
                setContent(val.slice(0, s) + "  " + val.slice(e.target.selectionEnd));
                setTimeout(() => { e.target.selectionStart = e.target.selectionEnd = s + 2; }, 0);
              }
            }}
          />
        </div>

        {/* Status bar */}
        <div className="bg-[#1a1a1a] px-4 py-1.5 flex justify-between border-t border-white/5">
          <span className="text-xs text-[#5b6cf7] font-mono">plaintext</span>
          <span className="text-xs text-white/25 font-mono">{content.length} chars · {lines.length} lines</span>
        </div>
      </div>
    </div>
  );
}
