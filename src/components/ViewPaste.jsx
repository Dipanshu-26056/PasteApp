import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

export default function ViewPaste() {
  const { id } = useParams();
  const navigate = useNavigate();
  const paste = useSelector((s) => s.paste.pastes.find((p) => p._id === id));

  if (!paste) {
    return (
      <div className="text-center py-24">
        <p className="text-white/30 text-sm mb-4">Paste not found.</p>
        <button onClick={() => navigate("/pastes")} className="text-[#5b6cf7] text-sm hover:underline">
          Back to pastes
        </button>
      </div>
    );
  }

  const lines = paste.content.split("\n");

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/pastes")}
          className="text-white/30 hover:text-white/70 transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
        </button>
        <h2 className="text-base font-medium text-white">{paste.title}</h2>
        <button
          onClick={() => navigate(`/?pasteId=${paste._id}`)}
          className="ml-auto text-xs text-[#5b6cf7] hover:text-[#7b8cf9] border border-[#5b6cf7]/30 hover:border-[#5b6cf7]/60 px-3 py-1.5 rounded-lg transition-colors"
        >
          Edit
        </button>
      </div>

      <div className="rounded-xl border border-white/10 overflow-hidden">
        <div className="bg-[#1e1e1e] px-4 py-2.5 flex items-center justify-between border-b border-white/10">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <span className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <button
            onClick={() => { navigator.clipboard.writeText(paste.content); toast.success("Copied!"); }}
            className="text-white/30 hover:text-white/70 transition-colors text-xs flex items-center gap-1.5"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            copy
          </button>
        </div>

        <div className="flex bg-[#141414]">
          <div className="select-none text-right font-mono text-xs text-white/20 py-3 px-3 leading-6 min-w-[44px] border-r border-white/5" aria-hidden="true">
            {lines.map((_, i) => <div key={i}>{i + 1}</div>)}
          </div>
          <pre className="flex-1 font-mono text-sm text-white/75 p-3 leading-6 overflow-x-auto whitespace-pre-wrap break-words">
            {paste.content}
          </pre>
        </div>

        <div className="bg-[#1a1a1a] px-4 py-1.5 flex justify-between border-t border-white/5">
          <span className="text-xs text-[#5b6cf7] font-mono">plaintext</span>
          <span className="text-xs text-white/25 font-mono">{paste.content.length} chars · {lines.length} lines</span>
        </div>
      </div>
    </div>
  );
}
