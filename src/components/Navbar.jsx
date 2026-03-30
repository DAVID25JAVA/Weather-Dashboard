
import { Cloud, History, MapPin, AlertCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Navbar = ({ cityName, locError }) => {
  const location = useLocation();

  return (
    <nav className="glass border-b border-sky-500/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between flex-wrap gap-2">

        {/* Brand */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-sky-600 flex items-center justify-center">
            <Cloud size={16} className="text-white" />
          </div>
          <span className="font-bold text-sky-100 text-lg">
            Skyvault
          </span>
        </Link>

        {/* Location */}
        <div className="flex items-center gap-1.5 text-xs text-sky-400">
          {locError
            ? <><AlertCircle size={12} className="text-amber-400" /><span>{locError}</span></>
            : <><MapPin size={12} /><span>{cityName || "Detecting…"}</span></>
          }
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-sky-950/60 rounded-xl p-1 border border-sky-700/30">

          <Link
            to="/"
            className={`px-3 py-1.5 rounded-lg text-xs flex items-center gap-1
              ${location.pathname === "/"
                ? "bg-sky-600 text-white"
                : "text-sky-400 hover:bg-sky-800/50"}
            `}
          >
            <Cloud size={13} /> Today
          </Link>

          <Link
            to="/history"
            className={`px-3 py-1.5 rounded-lg text-xs flex items-center gap-1
              ${location.pathname === "/history"
                ? "bg-sky-600 text-white"
                : "text-sky-400 hover:bg-sky-800/50"}
            `}
          >
            <History size={13} /> History
          </Link>

        </div>
      </div>
    </nav>
  );
};

export default Navbar;