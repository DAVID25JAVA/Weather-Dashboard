import React, { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import StatCard from "../components/StateCard";
import ZoomableChart from "../components/ZoomableChart";
import { SkeletonChart, SkeletonGrid } from "../components/Skeleton";
import { CustomTooltip } from "../components/ZoomableChart";
import {
  WMO_CODES,
  celsiusToFahrenheit,
  formatHour,
  getAQILabel,
} from "../utils/api";
import { format, parseISO, isValid } from "date-fns";

// ── Shared axis / grid styles ─────────────────────────────────────────────────
const AXIS_STYLE = {
  tick: { fill: "#64B5F6", fontSize: 10, fontFamily: "DM Mono" },
  axisLine: false,
  tickLine: false,
};
const GRID_STYLE = { stroke: "rgba(33,150,243,0.1)", strokeDasharray: "3 3" };

const CurrentWeatherPage = ({
  weather,
  airQuality,
  loading,
  selectedDate,
  setSelectedDate,
}) => {
  const [tempUnit, setTempUnit] = useState("C"); // C | F
  const cvt = (v) =>
    tempUnit === "F" ? celsiusToFahrenheit(v) : Math.round(v);

  // ── Daily summary ──────────────────────────────────────────────────────────
  const daily = weather?.daily;
  const current = weather?.current;
  const hourly = weather?.hourly;
  const aqHourly = airQuality?.hourly;

  const wmoCode = current?.weather_code ?? daily?.weather_code?.[0];
  const wmo = WMO_CODES[wmoCode] || { label: "Unknown", icon: "🌡️" };
  const aqiVal = aqHourly?.european_aqi?.find((v) => v != null);
  const aqiInfo = getAQILabel(aqiVal);

  // ── Build hourly chart data ────────────────────────────────────────────────
  const hourlyData = hourly
    ? hourly.time.map((t, i) => ({
        time: formatHour(t),
        temp:
          hourly.temperature_2m[i] != null
            ? cvt(hourly.temperature_2m[i])
            : null,
        tempRaw: hourly.temperature_2m[i],
        humidity: hourly.relative_humidity_2m[i],
        precip: hourly.precipitation[i],
        visibility:
          hourly.visibility[i] != null
            ? +(hourly.visibility[i] / 1000).toFixed(1)
            : null,
        windSpeed: hourly.wind_speed_10m[i],
      }))
    : [];

  const aqHourlyData = aqHourly
    ? aqHourly.time.map((t, i) => ({
        time: formatHour(t),
        pm10: aqHourly.pm10[i],
        pm2_5: aqHourly.pm2_5[i],
      }))
    : [];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── Date Picker + Weather Header ─────────────────────────────────── */}
      <div className="glass rounded-2xl p-5 border border-sky-500/20">
        <div className="flex flex-wrap items-start justify-between gap-4">
          {/* Left: icon + summary */}
          <div className="flex items-center gap-4">
            <span className="text-6xl">{wmo.icon}</span>
            <div>
              <p className="font-display font-bold text-3xl text-sky-100">
                {current?.temperature_2m != null
                  ? `${cvt(current.temperature_2m)}°${tempUnit}`
                  : "—"}
              </p>
              <p className="text-sky-400 font-body text-sm">{wmo.label}</p>
              <p className="text-sky-500 font-mono text-xs mt-0.5">
                Feels like{" "}
                {current?.apparent_temperature != null
                  ? `${cvt(current.apparent_temperature)}°${tempUnit}`
                  : "—"}
              </p>
            </div>
          </div>

          {/* Right: date picker + unit toggle */}
          <div className="flex flex-col gap-2 items-end">
            <input
              type="date"
              value={selectedDate}
              max={format(new Date(), "yyyy-MM-dd")}
              min={format(
                new Date(new Date().setFullYear(new Date().getFullYear() - 2)),
                "yyyy-MM-dd"
              )}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-sky-950 border border-sky-600/40 rounded-xl px-3 py-2 text-sky-200
                         font-mono text-sm focus:outline-none focus:border-sky-400 cursor-pointer"
            />
            <div className="flex gap-1 bg-sky-950/60 rounded-xl p-1 border border-sky-700/30">
              {["C", "F"].map((u) => (
                <button
                  key={u}
                  onClick={() => setTempUnit(u)}
                  className={`px-3 py-1 rounded-lg cursor-pointer text-xs font-mono font-semibold transition-all
                    ${
                      tempUnit === u
                        ? "bg-sky-600 text-white"
                        : "text-sky-400 hover:text-sky-200"
                    }`}
                >
                  °{u}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Individual Stats Grid ─────────────────────────────────────────── */}
      {loading ? (
        <SkeletonGrid />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          <StatCard
            icon="🌡️"
            label="Temp Max"
            accent="rose"
            value={
              daily?.temperature_2m_max?.[0] != null
                ? `${cvt(daily.temperature_2m_max[0])}°`
                : "—"
            }
            unit={tempUnit === "F" ? "F" : "C"}
          />
          <StatCard
            icon="❄️"
            label="Temp Min"
            accent="cyan"
            value={
              daily?.temperature_2m_min?.[0] != null
                ? `${cvt(daily.temperature_2m_min[0])}°`
                : "—"
            }
            unit={tempUnit === "F" ? "F" : "C"}
          />
          <StatCard
            icon="🌧️"
            label="Precipitation"
            accent="blue"
            value={daily?.precipitation_sum?.[0]?.toFixed(1) ?? "0"}
            unit="mm"
          />
          <StatCard
            icon="💧"
            label="Humidity"
            accent="cyan"
            value={current?.relative_humidity_2m ?? "—"}
            unit="%"
          />
          <StatCard
            icon="☀️"
            label="UV Index"
            accent="amber"
            value={daily?.uv_index_max?.[0]?.toFixed(1) ?? "—"}
            glow
          />
          <StatCard
            icon="🌅"
            label="Sunrise"
            accent="amber"
            value={daily?.sunrise?.[0] ? formatHour(daily.sunrise[0]) : "—"}
          />
          <StatCard
            icon="🌇"
            label="Sunset"
            accent="orange"
            value={daily?.sunset?.[0] ? formatHour(daily.sunset[0]) : "—"}
          />
          <StatCard
            icon="💨"
            label="Max Wind"
            accent="lime"
            value={daily?.wind_speed_10m_max?.[0]?.toFixed(1) ?? "—"}
            unit="km/h"
          />
          <StatCard
            icon="🌂"
            label="Precip Prob"
            accent="violet"
            value={daily?.precipitation_probability_max?.[0] ?? "—"}
            unit="%"
          />
        </div>
      )}

      {/* ── Air Quality Stats ─────────────────────────────────────────────── */}
      <div>
        <h2 className="font-display font-semibold text-sky-300 text-sm mb-3 tracking-widest uppercase">
          Air Quality
        </h2>
        {loading ? (
          <SkeletonGrid />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            <StatCard
              icon="🌫️"
              label="AQI (EU)"
              accent="green"
              value={aqiVal ?? "—"}
              sub={aqiInfo.label}
            />
            <StatCard
              icon="🔴"
              label="PM10"
              accent="orange"
              value={aqHourly?.pm10?.find((v) => v != null)?.toFixed(1) ?? "—"}
              unit="μg/m³"
            />
            <StatCard
              icon="🔵"
              label="PM2.5"
              accent="rose"
              value={aqHourly?.pm2_5?.find((v) => v != null)?.toFixed(1) ?? "—"}
              unit="μg/m³"
            />
            <StatCard
              icon="💨"
              label="CO"
              accent="lime"
              value={
                aqHourly?.carbon_monoxide?.find((v) => v != null)?.toFixed(0) ??
                "—"
              }
              unit="μg/m³"
            />
            <StatCard
              icon="🏭"
              label="NO₂"
              accent="amber"
              value={
                aqHourly?.nitrogen_dioxide
                  ?.find((v) => v != null)
                  ?.toFixed(1) ?? "—"
              }
              unit="μg/m³"
            />
            <StatCard
              icon="⚗️"
              label="SO₂"
              accent="violet"
              value={
                aqHourly?.sulphur_dioxide?.find((v) => v != null)?.toFixed(1) ??
                "—"
              }
              unit="μg/m³"
            />
            <div
              className="glass rounded-2xl p-4 col-span-2 border flex items-center gap-3"
              style={{
                borderColor: aqiInfo.color + "50",
                background: aqiInfo.color + "15",
              }}
            >
              <span className="text-3xl">
                {aqiVal == null
                  ? "❔"
                  : aqiVal <= 50
                  ? "😊"
                  : aqiVal <= 100
                  ? "😐"
                  : aqiVal <= 150
                  ? "😷"
                  : "🚨"}
              </span>
              <div>
                <p
                  className="font-display font-bold"
                  style={{ color: aqiInfo.color }}
                >
                  {aqiInfo.label}
                </p>
                <p className="text-xs text-sky-400 font-mono">
                  AQI {aqiVal ?? "N/A"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Hourly Charts ─────────────────────────────────────────────────── */}
      <div>
        <h2 className="font-display font-semibold text-sky-300 text-sm mb-3 tracking-widest uppercase">
          Hourly Charts — {selectedDate}
        </h2>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <SkeletonChart key={i} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Temperature */}
            <ZoomableChart
              title={`🌡️ Temperature (°${tempUnit})`}
              data={hourlyData}
              note={`Toggle °C/°F above`}
            >
              <AreaChart>
                <defs>
                  <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid {...GRID_STYLE} />
                <XAxis dataKey="time" {...AXIS_STYLE} interval={2} />
                <YAxis {...AXIS_STYLE} unit={`°${tempUnit}`} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="temp"
                  name={`Temp °${tempUnit}`}
                  stroke="#ef4444"
                  fill="url(#tempGrad)"
                  strokeWidth={2}
                  dot={false}
                />
              </AreaChart>
            </ZoomableChart>

            {/* Humidity */}
            <ZoomableChart title="💧 Relative Humidity (%)" data={hourlyData}>
              <AreaChart>
                <defs>
                  <linearGradient id="humGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00E5FF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid {...GRID_STYLE} />
                <XAxis dataKey="time" {...AXIS_STYLE} interval={2} />
                <YAxis {...AXIS_STYLE} unit="%" domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="humidity"
                  name="Humidity"
                  stroke="#00E5FF"
                  fill="url(#humGrad)"
                  strokeWidth={2}
                  dot={false}
                />
              </AreaChart>
            </ZoomableChart>

            {/* Precipitation */}
            <ZoomableChart title="🌧️ Precipitation (mm)" data={hourlyData}>
              <BarChart>
                <CartesianGrid {...GRID_STYLE} />
                <XAxis dataKey="time" {...AXIS_STYLE} interval={2} />
                <YAxis {...AXIS_STYLE} unit="mm" />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="precip"
                  name="Precip"
                  fill="#2196F3"
                  radius={[3, 3, 0, 0]}
                />
              </BarChart>
            </ZoomableChart>

            {/* Visibility */}
            <ZoomableChart title="👁️ Visibility (km)" data={hourlyData}>
              <LineChart>
                <CartesianGrid {...GRID_STYLE} />
                <XAxis dataKey="time" {...AXIS_STYLE} interval={2} />
                <YAxis {...AXIS_STYLE} unit="km" />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="visibility"
                  name="Visibility"
                  stroke="#B5FF4D"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ZoomableChart>

            {/* Wind Speed */}
            <ZoomableChart title="💨 Wind Speed 10m (km/h)" data={hourlyData}>
              <AreaChart>
                <defs>
                  <linearGradient id="windGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#B5FF4D" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#B5FF4D" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid {...GRID_STYLE} />
                <XAxis dataKey="time" {...AXIS_STYLE} interval={2} />
                <YAxis {...AXIS_STYLE} unit=" km/h" />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="windSpeed"
                  name="Wind"
                  stroke="#B5FF4D"
                  fill="url(#windGrad)"
                  strokeWidth={2}
                  dot={false}
                />
              </AreaChart>
            </ZoomableChart>

            {/* PM10 + PM2.5 Combined */}
            <ZoomableChart
              title="🔴 PM10 & 🔵 PM2.5 (μg/m³)"
              data={aqHourlyData}
            >
              <LineChart>
                <CartesianGrid {...GRID_STYLE} />
                <XAxis dataKey="time" {...AXIS_STYLE} interval={2} />
                <YAxis {...AXIS_STYLE} unit=" μg" />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11, color: "#64B5F6" }} />
                <Line
                  type="monotone"
                  dataKey="pm10"
                  name="PM10"
                  stroke="#f97316"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="pm2_5"
                  name="PM2.5"
                  stroke="#ec4899"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ZoomableChart>
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrentWeatherPage;
