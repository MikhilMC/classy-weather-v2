import { useState } from "react";
import Weather from "./Weather";
import Loading from "./Loading";
import Error from "./Error";
import { useWeatherUpdate } from "../hooks/useWeatherUpdate";

function App() {
  const [location, setLocation] = useState("");

  const { isLoading, error, displayLocation, weather } =
    useWeatherUpdate(location);

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
