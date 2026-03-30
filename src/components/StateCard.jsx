import React from "react";

const StatCard = ({ icon, label, value, unit, sub, accent = "blue", glow = false }) => {
  const accentMap = {
    blue:   "text-sky-300  border-sky-500/30  bg-sky-500/10",
    amber:  "text-amber-300 border-amber-500/30 bg-amber-500/10",
    cyan:   "text-cyan-300  border-cyan-500/30  bg-cyan-500/10",
    rose:   "text-rose-300  border-rose-500/30  bg-rose-500/10",
    lime:   "text-lime-300  border-lime-500/30  bg-lime-500/10",
    violet: "text-violet-300 border-violet-500/30 bg-violet-500/10",
    green:  "text-green-300 border-green-500/30 bg-green-500/10",
    orange: "text-orange-300 border-orange-500/30 bg-orange-500/10",
  };
  const cls = accentMap[accent] || accentMap.blue;

  return (
    <div
      className={`
        glass rounded-2xl p-4 flex flex-col gap-2 
        border transition-all duration-300 hover:scale-[1.02] hover:border-sky-400/40
        animate-fade-in ${glow ? "glow-blue" : ""}
        ${cls}
      `}
    >
      <div className="flex items-center gap-2 opacity-70">
        <span className="text-xl">{icon}</span>
        <span className="text-xs font-body font-medium tracking-wide uppercase">{label}</span>
      </div>
      <div className="flex items-end gap-1 mt-auto">
        <span className="text-2xl font-display font-bold leading-none">{value ?? "—"}</span>
        {unit && <span className="text-sm opacity-60 mb-0.5">{unit}</span>}
      </div>
      {sub && <div className="text-xs opacity-50 font-mono">{sub}</div>}
    </div>
  );
};

export default StatCard;