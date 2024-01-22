import { useState, useEffect } from "react";
import { convertToFlag } from "../utils/converToFlag";

export function useWeatherUpdate(location) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [displayLocation, setDisplayLocation] = useState("");
  const [weather, setWeather] = useState({});

  useEffect(
    function () {
      const controller = new AbortController();
      async function fetchWeather() {
        if (location.length < 3) return;
        try {
          setIsLoading(true);
          setError("");
          // 1) Getting location (geocoding)
          const geoRes = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${location}`,
            { signal: controller.signal }
          );
          const geoData = await geoRes.json();
          //   console.log(geoData);

          if (!geoData.results) throw new Error("Location not found");

          //   console.log("results", geoData.results);
          const { latitude, longitude, timezone, name, country_code } =
            geoData.results.at(0);

          setDisplayLocation(`${name} ${convertToFlag(country_code)}`);

          // 2) Getting actual weather
          const weatherRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=${timezone}&daily=weathercode,temperature_2m_max,temperature_2m_min`,
            { signal: controller.signal }
          );
          const weatherData = await weatherRes.json();
          //   console.log(weatherData);
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

      return () => {
        controller.abort();
      };
    },
    [location]
  );

  return { isLoading, error, displayLocation, weather };
}
