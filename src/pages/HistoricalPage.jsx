import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  ComposedChart,
  AreaChart,
  Area,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import ZoomableChart, { CustomTooltip } from "../components/ZoomableChart";
import { SkeletonChart } from "../components/Skeleton";
import { toIST, getWindDirectionLabel, formatDate } from "../utils/api";
import { format, subDays, differenceInDays, parseISO } from "date-fns";

const AXIS_STYLE = {
  tick: { fill: "#64B5F6", fontSize: 10, fontFamily: "DM Mono" },
  axisLine: false,
  tickLine: false,
};
const GRID_STYLE = { stroke: "rgba(33,150,243,0.1)", strokeDasharray: "3 3" };

const MAX_DAYS = 730;

const HistoricalPage = ({
  histStart,
  setHistStart,
  histEnd,
  setHistEnd,
  histWeather,
  histAQ,
  loadingPage2,
  loadPage2,
}) => {
  const [error, setError] = useState("");

  const handleApply = () => {
    const diff = differenceInDays(parseISO(histEnd), parseISO(histStart));
    if (diff < 1) return setError("End date must be after start date.");
    if (diff > MAX_DAYS)
      return setError("Maximum range is 2 years (730 days).");
    if (histEnd > format(new Date(), "yyyy-MM-dd"))
      return setError("End date cannot be in the future.");
    setError("");
    loadPage2();
  };

  // ── Build chart data ───────────────────────────────────────────────────────
  const daily = histWeather?.daily;

  const tempData = daily
    ? daily.time.map((t, i) => ({
        date: format(parseISO(t), "MM/dd"),
        max: daily.temperature_2m_max[i],
        min: daily.temperature_2m_min[i],
        mean: daily.temperature_2m_mean[i],
      }))
    : [];

  const sunData = daily
    ? daily.time.map((t, i) => ({
        date: format(parseISO(t), "MM/dd"),
        sunrise: daily.sunrise[i]
          ? (() => {
              const d = new Date(daily.sunrise[i]);
              return d.getHours() + d.getMinutes() / 60;
            })()
          : null,
        sunset: daily.sunset[i]
          ? (() => {
              const d = new Date(daily.sunset[i]);
              return d.getHours() + d.getMinutes() / 60;
            })()
          : null,
        sunriseLabel: daily.sunrise[i] ? toIST(daily.sunrise[i]) : null,
        sunsetLabel: daily.sunset[i] ? toIST(daily.sunset[i]) : null,
      }))
    : [];

  const precipData = daily
    ? daily.time.map((t, i) => ({
        date: format(parseISO(t), "MM/dd"),
        precip: daily.precipitation_sum[i],
      }))
    : [];

  const windData = daily
    ? daily.time.map((t, i) => ({
        date: format(parseISO(t), "MM/dd"),
        windSpeed: daily.wind_speed_10m_max[i],
        windDir: daily.wind_direction_10m_dominant[i],
        dirLabel: getWindDirectionLabel(daily.wind_direction_10m_dominant[i]),
      }))
    : [];

  const aqData = histAQ || [];
  const aqChartData = aqData.map((d) => ({
    date: format(parseISO(d.date), "MM/dd"),
    pm10: d.pm10,
    pm2_5: d.pm2_5,
  }));

  const SunTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    const hr = (v) => {
      if (v == null) return "—";
      const h = Math.floor(v),
        m = Math.round((v - h) * 60);
      const ampm = h >= 12 ? "PM" : "AM";
      return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${ampm} IST`;
    };
    return (
      <div className="glass border border-sky-500/30 rounded-xl p-3 text-xs font-mono shadow-xl">
        <p className="text-sky-300 mb-1 font-semibold">{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color }}>
            {p.name}: <strong>{hr(p.value)}</strong>
          </p>
        ))}
      </div>
    );
  };

  console.log("His end Date-->", histEnd);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── Date Range Picker ───────────────────────────────────────────── */}
      <div className="glass rounded-2xl p-5 border border-sky-500/20">
        <h2 className="font-display font-bold text-sky-100 text-lg mb-4">
          Historical Analysis
        </h2>
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-sky-400 font-mono">Start Date</label>
            <input
              type="date"
              value={histStart}
              max={histEnd}
              min={format(subDays(new Date(), MAX_DAYS), "yyyy-MM-dd")}
              onChange={(e) => setHistStart(e.target.value)}
              className="bg-sky-950 border border-sky-600/40 rounded-xl px-3 py-2 text-sky-200
                         font-mono text-sm focus:outline-none focus:border-sky-400 cursor-pointer"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-sky-400 font-mono">End Date</label>
            <input
              type="date"
              value={histEnd}
              max={format(new Date(), "yyyy-MM-dd")}
              min={histStart}
              onChange={(e) => setHistEnd(e.target.value)}
              className="bg-sky-950 border border-sky-600/40 rounded-xl px-3 py-2 text-sky-200
                         font-mono text-sm focus:outline-none focus:border-sky-400 cursor-pointer"
            />
          </div>
          <button
            onClick={handleApply}
            disabled={loadingPage2}
            className="px-5 py-2 bg-sky-600 hover:bg-sky-500 disabled:opacity-50
                       rounded-xl text-white font-display font-semibold text-sm
                       transition-all glow-blue"
          >
            {loadingPage2 ? "Loading…" : "Apply Range"}
          </button>
        </div>
        {error && (
          <p className="text-amber-400 text-xs font-mono mt-2">⚠ {error}</p>
        )}
        {histWeather && (
          <p className="text-sky-500 text-xs font-mono mt-2">
            Showing {daily?.time?.length ?? 0} days · {histStart} → {histEnd}
          </p>
        )}
      </div>

      {/* ── Charts ──────────────────────────────────────────────────────── */}
      {loadingPage2 ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <SkeletonChart key={i} />
          ))}
        </div>
      ) : !histWeather ? (
        <div className="glass rounded-2xl p-10 border border-sky-500/20 text-center">
          <p className="text-5xl mb-3">📅</p>
          <p className="font-display text-sky-300 text-lg">
            Select a date range and press Apply
          </p>
          <p className="text-sky-500 font-mono text-sm mt-1">
            Max range: 2 years
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Temperature: Mean / Max / Min */}
          <ZoomableChart
            title="🌡️ Temperature Trends (°C)"
            data={tempData}
            minWidth={900}
          >
            <LineChart>
              <CartesianGrid {...GRID_STYLE} />
              <XAxis
                dataKey="date"
                {...AXIS_STYLE}
                interval={Math.ceil(tempData.length / 20)}
              />
              <YAxis {...AXIS_STYLE} unit="°" />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, color: "#64B5F6" }} />
              <Line
                type="monotone"
                dataKey="max"
                name="Max"
                stroke="#ef4444"
                strokeWidth={1.5}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="mean"
                name="Mean"
                stroke="#fbbf24"
                strokeWidth={1.5}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="min"
                name="Min"
                stroke="#00E5FF"
                strokeWidth={1.5}
                dot={false}
              />
            </LineChart>
          </ZoomableChart>

          {/* Sun Cycle */}
          <ZoomableChart
            title="🌅 Sunrise & Sunset (IST)"
            data={sunData}
            minWidth={900}
          >
            <AreaChart>
              <defs>
                <linearGradient id="sunGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FFB347" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#FFB347" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid {...GRID_STYLE} />
              <XAxis
                dataKey="date"
                {...AXIS_STYLE}
                interval={Math.ceil(sunData.length / 20)}
              />
              <YAxis
                {...AXIS_STYLE}
                domain={[4, 22]}
                tickFormatter={(v) => `${v}:00`}
              />
              <Tooltip content={<SunTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, color: "#64B5F6" }} />
              <Area
                type="monotone"
                dataKey="sunrise"
                name="Sunrise"
                stroke="#FFB347"
                fill="url(#sunGrad)"
                strokeWidth={1.5}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="sunset"
                name="Sunset"
                stroke="#FF4D6D"
                strokeWidth={1.5}
                dot={false}
              />
            </AreaChart>
          </ZoomableChart>

          {/* Precipitation */}
          <ZoomableChart
            title="🌧️ Precipitation Total (mm)"
            data={precipData}
            minWidth={900}
          >
            <BarChart>
              <CartesianGrid {...GRID_STYLE} />
              <XAxis
                dataKey="date"
                {...AXIS_STYLE}
                interval={Math.ceil(precipData.length / 20)}
              />
              <YAxis {...AXIS_STYLE} unit="mm" />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="precip"
                name="Precip"
                fill="#2196F3"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ZoomableChart>

          {/* Wind Speed + Direction */}
          <ZoomableChart
            title="💨 Max Wind Speed (km/h)"
            data={windData}
            minWidth={900}
          >
            <ComposedChart>
              <CartesianGrid {...GRID_STYLE} />
              <XAxis
                dataKey="date"
                {...AXIS_STYLE}
                interval={Math.ceil(windData.length / 20)}
              />
              <YAxis {...AXIS_STYLE} unit=" km/h" />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  const item = windData.find((d) => d.date === label);
                  return (
                    <div className="glass border border-sky-500/30 rounded-xl p-3 text-xs font-mono">
                      <p className="text-sky-300 mb-1">{label}</p>
                      <p style={{ color: "#B5FF4D" }}>
                        Wind: <strong>{payload[0]?.value} km/h</strong>
                      </p>
                      {item && (
                        <p className="text-sky-400">
                          Direction: {item.dirLabel} ({item.windDir}°)
                        </p>
                      )}
                    </div>
                  );
                }}
              />
              <Bar
                dataKey="windSpeed"
                name="Wind Speed"
                fill="#B5FF4D"
                opacity={0.8}
                radius={[2, 2, 0, 0]}
              />
            </ComposedChart>
          </ZoomableChart>

          {/* PM10 + PM2.5 */}
          {aqChartData.length > 0 && (
            <ZoomableChart
              title="🔴 PM10 & PM2.5 Daily Mean (μg/m³)"
              data={aqChartData}
              minWidth={900}
            >
              <LineChart>
                <CartesianGrid {...GRID_STYLE} />
                <XAxis
                  dataKey="date"
                  {...AXIS_STYLE}
                  interval={Math.ceil(aqChartData.length / 20)}
                />
                <YAxis {...AXIS_STYLE} unit=" μg" />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, color: "#64B5F6" }} />
                <Line
                  type="monotone"
                  dataKey="pm10"
                  name="PM10"
                  stroke="#f97316"
                  strokeWidth={1.5}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="pm2_5"
                  name="PM2.5"
                  stroke="#ec4899"
                  strokeWidth={1.5}
                  dot={false}
                />
              </LineChart>
            </ZoomableChart>
          )}
        </div>
      )}
    </div>
  );
};

export default HistoricalPage;
