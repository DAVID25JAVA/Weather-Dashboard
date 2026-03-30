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
      <div
        className="fixed inset-0 pointer-events-none z-0"
        // style={{
        //   background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(21,101,192,0.25) 0%, transparent 70%)",
        //   backgroundImage: `
        //     radial-gradient(ellipse 80% 60% at 50% 0%, rgba(21,101,192,0.25) 0%, transparent 70%),
        //     linear-gradient(rgba(33,150,243,0.03) 1px, transparent 1px),
        //     linear-gradient(90deg, rgba(33,150,243,0.03) 1px, transparent 1px)
        //   `,
        //   backgroundSize: "100% 100%, 40px 40px, 40px 40px",
        // }}
      />

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
