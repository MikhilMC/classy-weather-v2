import React from "react";
import { getWeatherIcon } from "../utils/getWeatherIcon";
import { formatDay } from "../utils/formatDay";

function Day({ date, max, min, code, isToday }) {
  return (
    <li className="day">
      <span>{getWeatherIcon(code)}</span>
      <p>{isToday ? "Today" : formatDay(date)}</p>
      <p>
        <strong>{Math.floor(min)}&deg;</strong> &mdash;{" "}
        <strong>{Math.ceil(max)}&deg;</strong>
      </p>
    </li>
  );
}

export default Day;
