import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactAnimatedWeather from "react-animated-weather";

const WeatherForecast = ({ weather }) => {
    const { data } = weather;
    const [forecastData, setForecastData] = useState([]);
    // const [isCelsius, setIsCelsius] = useState(true);
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

    //Add this useEffect to refresh the page every 1 hour
    useEffect(() => {
        const refreshInterval = setInterval(() => {
            window.location.reload();
        }, 21600000 ); // 1 hour in milliseconds

        return () => clearInterval(refreshInterval);
    }, []);

    const getCurrentDate = () => {
        const currentDate = new Date();
        const day = String(currentDate.getDate()).padStart(2, '0');
        const month = currentDate.toLocaleString("en-US", { month: "long" });
        const year = currentDate.getFullYear();
        return `${month}, ${day}  ${year}`;
    };
    const getCurrentTime = () => {
        const currentTime = new Date();
        const hours = String(currentTime.getHours()).padStart(2, '0');
        const minutes = String(currentTime.getMinutes()).padStart(2, '0');
        return `${hours} : ${minutes}`;
    }

    return (
        <>
            <div className="display">
                <div className="temp">
                    {data.condition.icon_url && (
                        <div className="icon-direc">
                            {/* <div
                                className="temp-icon"
                                style={{ backgroundImage: `url(${data.condition.icon_url})`,  backgroundRepeat:"no-repeat",}}
                                alt={data.condition.icon}
                            ></div> */}
                            
                            <p>{data.condition.description}</p>
                        </div>
                    )}
                    <sup className="temp-deg">
                        {Math.round(data.temperature.current)}{"°C"}
                    </sup>
                </div>
                <div className="secound-card">
                    <div className="time">
                        {getCurrentTime()}
                    </div>
                    <div className="date">
                        <p>{getCurrentDate()}</p>
                    </div>
                    <div className="city-name">
                        <p>{data.city}</p>
                    </div>
                </div>
            </div>
        </>
    )
}
export default WeatherForecast;
