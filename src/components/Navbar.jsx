import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="border-b border-white/10 bg-[#0f0f0f] sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-8">
        <span className="text-lg font-semibold tracking-tight">
          <span className="text-white">code</span>
          <span className="text-[#5b6cf7]">paste</span>
        </span>
        <NavLink
          to="/"
          className={({ isActive }) =>
            `text-sm transition-colors ${
              isActive ? "text-white font-medium" : "text-white/50 hover:text-white/80"
            }`
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/pastes"
          className={({ isActive }) =>
            `text-sm transition-colors ${
              isActive ? "text-white font-medium" : "text-white/50 hover:text-white/80"
            }`
          }
        >
          My Pastes
        </NavLink>
      </div>
    </nav>
  );
}
