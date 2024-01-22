import { useEffect, useState } from "react";
import Weather from "./Weather";
import Loading from "./Loading";
import Error from "./Error";
import { convertToFlag } from "../utils/converToFlag";

function App() {
  const [location, setLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [displayLocation, setDisplayLocation] = useState("");
  const [weather, setWeather] = useState({});

  useEffect(
    function () {
      async function fetchWeather() {
        if (location.length < 3) return;
        try {
          setIsLoading(true);
          setError("");
          // 1) Getting location (geocoding)
          const geoRes = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${location}`
          );
          const geoData = await geoRes.json();
          console.log(geoData);

          if (!geoData.results) throw new Error("Location not found");

          console.log("results", geoData.results);
          const { latitude, longitude, timezone, name, country_code } =
            geoData.results.at(0);

          setDisplayLocation(`${name} ${convertToFlag(country_code)}`);

          // 2) Getting actual weather
          const weatherRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=${timezone}&daily=weathercode,temperature_2m_max,temperature_2m_min`
          );
          const weatherData = await weatherRes.json();
          console.log(weatherData);
          setWeather(weatherData.daily);
          setError("");
        } catch (err) {
          console.error(err);
          setError(err);
        } finally {
          setIsLoading(false);
        }
      }

      fetchWeather();
    },
    [location]
  );

  return (
    <div className="app">
      <h1>Classy Weather</h1>
      <div>
        <input
          type="text"
          placeholder="Search for location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      {isLoading && <Loading />}
      {error && <Error error={error} />}

      {!isLoading && !error && weather?.weathercode && (
        <Weather weather={weather} location={displayLocation} />
      )}
    </div>
  );
}

export default App;
