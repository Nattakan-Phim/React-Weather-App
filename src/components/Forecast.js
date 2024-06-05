import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactAnimatedWeather from "react-animated-weather";

const Forecast = ({ weather }) => {
  const { data } = weather;
  const [forecastData, setForecastData] = useState([]);
  const [isCelsius, setIsCelsius] = useState(true);
  const [showWeatherInfo, setShowWeatherInfo] = useState(true);
  const [showCityName, setShowCityName] = useState(true);

  useEffect(() => {
    const fetchForecastData = async () => {
      const apiKey = "b03a640e5ef6980o4da35b006t5f2942";
      const url = `https://api.shecodes.io/weather/v1/forecast?query=${data.city}&key=${apiKey}&units=metric`;

      try {
        const response = await axios.get(url);
        setForecastData(response.data.daily);
      } catch (error) {
        console.error("Error fetching forecast data:", error);
      }
    };

    fetchForecastData();
  }, [data.city]);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowWeatherInfo((prev) => !prev);
      setShowCityName((prev) => !prev);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const formatDay = (timestamp) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-GB", { weekday: "short" });
  };

  const getCurrentDate = () => {
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, '0');
    const month = currentDate.toLocaleString("en-US", { month: "long" });
    const year = currentDate.getFullYear();
    return `${day}\n${month}\n${year}`;
  };

  const toggleTemperatureUnit = () => setIsCelsius((prev) => !prev);

  const renderTemperature = (temperature) => isCelsius 
    ? Math.round(temperature) 
    : Math.round((temperature * 9) / 5 + 32);

  return (
    <div className="display">
      {showCityName ? (
        <div className="city-name">
          <p>{data.city}, <p>{data.country}</p></p>
        </div>
      ) : (
        <div className="date">
          <p>{getCurrentDate()}</p>
        </div>
      )}
      <div className="temp">
        {data.condition.icon_url && (
          <img
            src={data.condition.icon_url}
            alt={data.condition.description}
            className="temp-icon"
          />
        )}
        {renderTemperature(data.temperature.current)}
        <sup className="temp-deg" onClick={toggleTemperatureUnit}>
          {isCelsius ? "°C" : "°F"} | {isCelsius ? "°F" : "°C"}
        </sup>
      </div>
      {showWeatherInfo ? (
        <div className="weather-info">
          <div className="weather-display">
            <div className="col">
              <ReactAnimatedWeather icon="WIND" size={20} color="#eee" />
              <div>
                <p className="wind">{data.wind.speed} m/s</p>
                <p>Wind Speed</p>
              </div>
            </div>
            <div className="col">
              <ReactAnimatedWeather icon="RAIN" size={20} color="#eee" />
              <div>
                <p className="humidity">{data.temperature.humidity}%</p>
                <p>Humidity</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="weather-des">{data.condition.description}</p>
      )}
    </div>
  );
};

export default Forecast;
