import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactAnimatedWeather from "react-animated-weather";

function Forecast({ weather }) {
  const { data } = weather;
  const [forecastData, setForecastData] = useState([]);
  const [isCelsius, setIsCelsius] = useState(true); // Track temperature unit
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
        console.log("Error fetching forecast data:", error);
      }
    };

    fetchForecastData();
  }, [data.city]);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowWeatherInfo((prevShowWeatherInfo) => !prevShowWeatherInfo);
      setShowCityName((prevShowCityName) => !prevShowCityName);
    }, 10000); // 10000 milliseconds = 10 seconds

    return () => clearInterval(interval); // Clean up the interval on unmount
  }, []);

  const formatDay = (dateString) => {
    const options = { weekday: "short" };
    const date = new Date(dateString * 1000);
    return date.toLocaleDateString("en-GB", options); // en-GB ใช้รูปแบบ DD/MM/YYYY
  };
  
  const getCurrentDate = () => {
    const currentDate = new Date();
    const day = currentDate.getDate().toString().padStart(2, '0');
    const month = currentDate.toLocaleString("en-US", { month: "long" }); 
    const year = currentDate.getFullYear();// ใช้สองหลักสุดท้ายของปี
  
    return `${day}\n${month}\n${year}`;

  };

  const toggleTemperatureUnit = () => {
    setIsCelsius((prevState) => !prevState);
  };

  const convertToFahrenheit = (temperature) => {
    return Math.round((temperature * 9) / 5 + 32);
  };

  const renderTemperature = (temperature) => {
    if (isCelsius) {
      return Math.round(temperature);
    } else {
      return convertToFahrenheit(temperature);
    }
  };

  return (
    <div className="display">
      {showCityName ? (
        <div className="city-name">
          <p>
            {data.city}, <span>{data.country}</span>
          </p>
        </div>
      ) : (
        <div className="date">
          <span>{getCurrentDate()}</span>
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
          <div className="">
              <div className="col">
                <ReactAnimatedWeather icon="WIND" size="20" />
                <div>
                  <p className="wind">{data.wind.speed}m/s </p>
                  <p>WindSpeed</p>
                </div>
              </div>
              <div className="col">
                <ReactAnimatedWeather icon="RAIN" size="20" />
                <div>
                  <p className="humidity">{data.temperature.humidity}% </p> 
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
}

export default Forecast;
