import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import { useWeather } from "./hooks/useWeather";
import CurrentWeatherPage from "./pages/CurrentWeatherPage";
import HistoricalPage from "./pages/HistoricalPage";

const App = () => {
  const {
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
  } = useWeather();

  return (
    <div className="min-h-screen bg-sky-950 text-sky-100">
      {/* Background grid + gradient */}
      <div className="fixed inset-0 pointer-events-none z-0" />

      <div className="relative z-10">
        <Navbar cityName={cityName} locError={locError} />

        <main className="max-w-7xl mx-auto px-4 py-6">
          <Routes>
            <Route
              path="/"
              element={
                <CurrentWeatherPage
                  weather={weather}
                  airQuality={airQuality}
                  loading={loadingPage1}
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                />
              }
            />

            <Route
              path="/history"
              element={
                <HistoricalPage
                  histStart={histStart}
                  setHistStart={setHistStart}
                  histEnd={histEnd}
                  setHistEnd={setHistEnd}
                  histWeather={histWeather}
                  histAQ={histAQ}
                  loadingPage2={loadingPage2}
                  loadPage2={loadPage2}
                />
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;
