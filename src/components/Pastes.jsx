import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removePaste, resetAllPastes } from "../redux/pasteSlice";
import toast from "react-hot-toast";

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function Pastes() {
  const [search, setSearch] = useState("");
  const pastes = useSelector((s) => s.paste.pastes);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const filtered = pastes.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.content.toLowerCase().includes(search.toLowerCase())
  );

  function downloadPaste(paste) {
    const blob = new Blob([paste.content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = paste.title.replace(/\s+/g, "_") + ".txt";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded!");
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Search + clear */}
      <div className="flex gap-3 items-center">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input
            type="text"
            placeholder="Search pastes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-white/25 transition-colors"
          />
        </div>
        {pastes.length > 0 && (
          <button
            onClick={() => dispatch(resetAllPastes())}
            className="text-sm text-red-400/70 hover:text-red-400 border border-red-500/20 hover:border-red-500/40 px-4 py-2.5 rounded-lg transition-colors whitespace-nowrap"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Count */}
      {filtered.length > 0 && (
        <p className="text-xs text-white/30">{filtered.length} paste{filtered.length !== 1 ? "s" : ""}</p>
      )}

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="text-center py-24 text-white/25 text-sm">
          {search ? "No pastes match your search." : "No pastes yet. Create one from Home."}
        </div>
      )}

      {/* Paste cards */}
      <div className="flex flex-col gap-3">
        {filtered.map((paste) => (
          <div
            key={paste._id}
            className="bg-[#141414] border border-white/8 rounded-xl overflow-hidden hover:border-white/15 transition-colors"
          >
            {/* Card header */}
            <div className="px-5 py-3 flex items-center justify-between border-b border-white/5">
              <div>
                <h3 className="text-sm font-medium text-white truncate max-w-xs">{paste.title}</h3>
                <p className="text-xs text-white/30 mt-0.5">{formatDate(paste.createdAt)}</p>
              </div>
              {/* Actions */}
              <div className="flex items-center gap-1">
                <ActionBtn
                  title="Edit"
                  onClick={() => navigate(`/?pasteId=${paste._id}`)}
                  icon={<EditIcon />}
                />
                <ActionBtn
                  title="View"
                  onClick={() => navigate(`/pastes/${paste._id}`)}
                  icon={<EyeIcon />}
                />
                <ActionBtn
                  title="Copy"
                  onClick={() => {
                    navigator.clipboard.writeText(paste.content);
                    toast.success("Copied!");
                  }}
                  icon={<CopyIcon />}
                />
                <ActionBtn
                  title="Download"
                  onClick={() => downloadPaste(paste)}
                  icon={<DownloadIcon />}
                />
                <ActionBtn
                  title="Share"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.origin + `/pastes/${paste._id}`);
                    toast.success("Link copied!");
                  }}
                  icon={<ShareIcon />}
                />
                <ActionBtn
                  title="Delete"
                  onClick={() => dispatch(removePaste(paste._id))}
                  icon={<TrashIcon />}
                  danger
                />
              </div>
            </div>
            {/* Preview */}
            <div className="px-5 py-3">
              <pre className="text-xs text-white/40 font-mono leading-5 line-clamp-3 whitespace-pre-wrap break-all">
                {paste.content}
              </pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActionBtn({ title, onClick, icon, danger }) {
  return (
    <button
      title={title}
      onClick={onClick}
      className={`p-1.5 rounded-lg transition-colors ${
        danger
          ? "text-white/25 hover:text-red-400 hover:bg-red-500/10"
          : "text-white/30 hover:text-white/80 hover:bg-white/8"
      }`}
    >
      {icon}
    </button>
  );
}

const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
);
const EyeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
);
const CopyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
);
const DownloadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
);
const ShareIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
);
const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
);
