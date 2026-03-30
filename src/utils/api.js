//Open-Meteo API Integration

const BASE_WEATHER = "https://api.open-meteo.com/v1";
const BASE_AIR = "https://air-quality-api.open-meteo.com/v1";
const BASE_ARCHIVE = "https://archive-api.open-meteo.com/v1";

// WMO Weather code → description + emoji
export const WMO_CODES = {
  0: { label: "Clear Sky", icon: "☀️" },
  1: { label: "Mainly Clear", icon: "🌤️" },
  2: { label: "Partly Cloudy", icon: "⛅" },
  3: { label: "Overcast", icon: "☁️" },
  45: { label: "Foggy", icon: "🌫️" },
  48: { label: "Icy Fog", icon: "🌫️" },
  51: { label: "Light Drizzle", icon: "🌦️" },
  53: { label: "Drizzle", icon: "🌦️" },
  55: { label: "Heavy Drizzle", icon: "🌧️" },
  61: { label: "Light Rain", icon: "🌧️" },
  63: { label: "Rain", icon: "🌧️" },
  65: { label: "Heavy Rain", icon: "🌧️" },
  71: { label: "Light Snow", icon: "🌨️" },
  73: { label: "Snow", icon: "❄️" },
  75: { label: "Heavy Snow", icon: "❄️" },
  80: { label: "Showers", icon: "🌦️" },
  81: { label: "Heavy Showers", icon: "🌧️" },
  95: { label: "Thunderstorm", icon: "⛈️" },
  99: { label: "Hail Storm", icon: "⛈️" },
};

// Geolocation
export const getUserLocation = () =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation)
      return reject(new Error("Geolocation not supported"));
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      (err) => reject(err),
      { timeout: 8000, enableHighAccuracy: true }
    );
  });

// Reverse geocode lat/lon → city name
export const reverseGeocode = async (lat, lon) => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
    );
    const data = await res.json();
    return (
      data.address?.city ||
      data.address?.town ||
      data.address?.village ||
      data.address?.county ||
      "Your Location"
    );
  } catch {
    return "Your Location";
  }
};

//  Current + Hourly Weather (Page 1)
export const fetchCurrentWeather = async (lat, lon, date) => {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    current: [
      "temperature_2m",
      "relative_humidity_2m",
      "apparent_temperature",
      "precipitation",
      "weather_code",
      "wind_speed_10m",
      "uv_index",
    ].join(","),
    hourly: [
      "temperature_2m",
      "relative_humidity_2m",
      "precipitation",
      "visibility",
      "wind_speed_10m",
      "uv_index",
      "weather_code",
      "precipitation_probability",
    ].join(","),
    daily: [
      "temperature_2m_max",
      "temperature_2m_min",
      "sunrise",
      "sunset",
      "uv_index_max",
      "precipitation_sum",
      "wind_speed_10m_max",
      "precipitation_probability_max",
      "weather_code",
    ].join(","),
    timezone: "auto",
    start_date: date,
    end_date: date,
  });

  const res = await fetch(`${BASE_WEATHER}/forecast?${params}`);
  if (!res.ok) throw new Error("Weather API failed");
  return res.json();
};

// Air Quality (Page 1)
export const fetchAirQuality = async (lat, lon, date) => {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    hourly: [
      "pm10",
      "pm2_5",
      "carbon_monoxide",
      "nitrogen_dioxide",
      "sulphur_dioxide",
      "european_aqi",
    ].join(","),
    timezone: "auto",
    start_date: date,
    end_date: date,
  });

  const res = await fetch(`${BASE_AIR}/air-quality?${params}`);
  if (!res.ok) throw new Error("Air Quality API failed");
  return res.json();
};

// Historical Weather (Page 2)
export const fetchHistoricalWeather = async (lat, lon, startDate, endDate) => {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    daily: [
      "temperature_2m_max",
      "temperature_2m_min",
      "temperature_2m_mean",
      "sunrise",
      "sunset",
      "precipitation_sum",
      "wind_speed_10m_max",
      "wind_direction_10m_dominant",
      "weather_code",
    ].join(","),
    timezone: "auto",
    start_date: startDate,
    end_date: endDate,
  });

  const res = await fetch(`${BASE_ARCHIVE}/archive?${params}`);
  console.log("History API--->", res);
  if (!res.ok) throw new Error("Historical weather API failed");
  return res.json();
};

// Historical Air Quality (Page 2)
export const fetchHistoricalAirQuality = async (
  lat,
  lon,
  startDate,
  endDate
) => {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    hourly: ["pm10", "pm2_5"].join(","),
    timezone: "auto",
    start_date: startDate,
    end_date: endDate,
  });

  const res = await fetch(`${BASE_AIR}/air-quality?${params}`);
  if (!res.ok) throw new Error("Historical AQ API failed");
  return res.json();
};

// Helpers
export const celsiusToFahrenheit = (c) => Math.round((c * 9) / 5 + 32);

export const formatHour = (isoStr) => {
  const d = new Date(isoStr);
  return d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export const formatDate = (isoStr) =>
  new Date(isoStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export const toIST = (timeStr) => {
  if (!timeStr) return "--";
  const d = new Date(timeStr);
  return d.toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export const getAQILabel = (aqi) => {
  if (aqi == null) return { label: "N/A", color: "#9ca3af" };
  if (aqi <= 50) return { label: "Good", color: "#4ade80" };
  if (aqi <= 100) return { label: "Fair", color: "#a3e635" };
  if (aqi <= 150) return { label: "Moderate", color: "#fbbf24" };
  if (aqi <= 200) return { label: "Poor", color: "#f97316" };
  if (aqi <= 300) return { label: "Very Poor", color: "#ef4444" };
  return { label: "Hazardous", color: "#7c3aed" };
};

export const getWindDirectionLabel = (deg) => {
  if (deg == null) return "N/A";
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(deg / 45) % 8];
};

// Aggregate hourly AQ data to daily means
export const aggregateAQDaily = (aqData) => {
  if (!aqData?.hourly) return [];
  const { time, pm10, pm2_5 } = aqData.hourly;
  const daily = {};
  time.forEach((t, i) => {
    const day = t.split("T")[0];
    if (!daily[day]) daily[day] = { pm10: [], pm2_5: [] };
    if (pm10[i] != null) daily[day].pm10.push(pm10[i]);
    if (pm2_5[i] != null) daily[day].pm2_5.push(pm2_5[i]);
  });
  return Object.entries(daily).map(([date, v]) => ({
    date,
    pm10: v.pm10.length
      ? +(v.pm10.reduce((a, b) => a + b, 0) / v.pm10.length).toFixed(1)
      : null,
    pm2_5: v.pm2_5.length
      ? +(v.pm2_5.reduce((a, b) => a + b, 0) / v.pm2_5.length).toFixed(1)
      : null,
  }));
};
