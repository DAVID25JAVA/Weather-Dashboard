import { useState, useEffect, useCallback } from "react";
import {
  getUserLocation,
  reverseGeocode,
  fetchCurrentWeather,
  fetchAirQuality,
  fetchHistoricalWeather,
  fetchHistoricalAirQuality,
  aggregateAQDaily,
} from "../utils/api";
import { format, subDays } from "date-fns";

const today = () => format(new Date(), "yyyy-MM-dd");

export const useWeather = () => {
  const [location, setLocation] = useState(null);
  const [cityName, setCityName] = useState("");
  const [locError, setLocError] = useState(null);

  // Page 1
  const [selectedDate, setSelectedDate] = useState(today());
  const [weather, setWeather] = useState(null);
  const [airQuality, setAirQuality] = useState(null);
  const [loadingPage1, setLoadingPage1] = useState(false);

  // Page 2
  const [histStart, setHistStart] = useState(
    format(subDays(new Date(), 30), "yyyy-MM-dd")
  );
  const [histEnd, setHistEnd] = useState(
    format(subDays(new Date(), 5), "yyyy-MM-dd")
  );
  const [histWeather, setHistWeather] = useState(null);
  const [histAQ, setHistAQ] = useState(null);
  const [loadingPage2, setLoadingPage2] = useState(false);

  // ── Grab GPS on mount ──────────────────────────────────────────────────────
  useEffect(() => {
    getUserLocation()
      .then(async (loc) => {
        setLocation(loc);
        const city = await reverseGeocode(loc.lat, loc.lon);
        setCityName(city);
      })
      .catch((err) => {
        setLocError(err.message || "Location access denied");
        // Fallback: New Delhi
        const fallback = { lat: 28.6139, lon: 77.209 };
        setLocation(fallback);
        setCityName("New Delhi (default)");
      });
  }, []);

  // ── Page 1 fetch ───────────────────────────────────────────────────────────
  const loadPage1 = useCallback(async () => {
    if (!location) return;
    setLoadingPage1(true);
    try {
      const [w, aq] = await Promise.all([
        fetchCurrentWeather(location.lat, location.lon, selectedDate),
        fetchAirQuality(location.lat, location.lon, selectedDate),
      ]);
      setWeather(w);
      setAirQuality(aq);
    } catch (e) {
      console.error("Page1 fetch error", e);
    } finally {
      setLoadingPage1(false);
    }
  }, [location, selectedDate]);

  useEffect(() => {
    loadPage1();
  }, [loadPage1]);

  // ── Page 2 fetch ───────────────────────────────────────────────────────────
  const loadPage2 = useCallback(async () => {
    if (!location || !histStart || !histEnd) return;
    setLoadingPage2(true);
    try {
      const [hw, haq] = await Promise.all([
        fetchHistoricalWeather(location.lat, location.lon, histStart, histEnd),
        fetchHistoricalAirQuality(
          location.lat,
          location.lon,
          histStart,
          histEnd
        ),
      ]);
      console.log("hw, haq--->", hw, haq);

      setHistWeather(hw);
      setHistAQ(aggregateAQDaily(haq));
    } catch (e) {
      console.error("Page2 fetch error", e);
      console.log(e);
    } finally {
      setLoadingPage2(false);
    }
  }, [location, histStart, histEnd]);

  return {
    location,
    cityName,
    locError,
    selectedDate,
    setSelectedDate,
    weather,
    airQuality,
    loadingPage1,
    histStart,
    setHistStart,
    histEnd,
    setHistEnd,
    histWeather,
    histAQ,
    loadingPage2,
    loadPage2,
  };
};
