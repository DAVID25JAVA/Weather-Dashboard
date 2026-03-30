import React, { useState, useRef } from "react";
import {
  ResponsiveContainer, CartesianGrid, XAxis, YAxis,
  Tooltip, Legend, ReferenceLine,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass border border-sky-500/30 rounded-xl p-3 text-xs font-mono shadow-xl">
      <p className="text-sky-300 mb-1 font-semibold">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}: <strong>{p.value}</strong> {p.unit || ""}
        </p>
      ))}
    </div>
  );
};

const ZoomableChart = ({
  title,
  data = [],
  children,
  minWidth = 700,
  height = 220,
  note,
}) => {
  const [zoom, setZoom] = useState(100);
  const scrollRef = useRef(null);

  const zoomIn  = () => setZoom((z) => Math.min(z + 20, 300));
  const zoomOut = () => setZoom((z) => Math.max(z - 20, 60));
  const reset   = () => setZoom(100);

  const chartWidth = Math.max(minWidth, (data.length * 40 * zoom) / 100);

  return (
    <div className="glass rounded-2xl p-4 border border-sky-500/20 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <h3 className="font-display font-semibold text-sky-200 text-sm tracking-wide">{title}</h3>
        <div className="flex items-center gap-1">
          {note && <span className="text-xs text-sky-400/60 mr-2">{note}</span>}
          <button
            onClick={zoomOut}
            className="w-7 h-7 rounded-lg bg-sky-900/60 border border-sky-700/50 text-sky-300
                       flex items-center justify-center text-sm hover:bg-sky-800 transition-colors"
          >−</button>
          <button
            onClick={reset}
            className="px-2 h-7 rounded-lg bg-sky-900/60 border border-sky-700/50 text-sky-300
                       text-xs hover:bg-sky-800 transition-colors font-mono"
          >{zoom}%</button>
          <button
            onClick={zoomIn}
            className="w-7 h-7 rounded-lg bg-sky-900/60 border border-sky-700/50 text-sky-300
                       flex items-center justify-center text-sm hover:bg-sky-800 transition-colors"
          >+</button>
        </div>
      </div>

      {/* Scrollable chart area */}
      <div ref={scrollRef} className="chart-scroll">
        <div style={{ width: chartWidth, height }}>
          <ResponsiveContainer width="100%" height="100%">
            {React.cloneElement(children, {
              data,
              margin: { top: 5, right: 20, left: 0, bottom: 5 },
            })}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export { CustomTooltip };
export default ZoomableChart;