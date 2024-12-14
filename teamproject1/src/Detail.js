import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Detail.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import EditList from "./EditList";
import Goback from "./Goback";

const Detail = () => {
  const [friends, setFriends] = useState([]);
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  // Fetch friends data from the API
  const fetchFriends = async () => {
    try {
      const response = await axios.get(
        "https://674d0abe54e1fca9290e27b0.mockapi.io/favorites/favorites"
      );
      setFriends(response.data);
    } catch (err) {
      setError("Failed to fetch friends data.");
    }
  };

  // Fetch weather data
  const fetchWeather = async (location) => {
    try {
      const response = await axios.get(
        `http://api.weatherstack.com/current?access_key=60f7f9cbf492049fc9043e1c21100925&query=${location}`
      );
      setWeather(response.data);
    } catch (err) {
      setError("Failed to fetch weather data.");
    }
  };

  // Run on component load
  useEffect(() => {
    fetchFriends();
  }, []);

  // Extract query parameter
  const queryParams = new URLSearchParams(window.location.search);
  const name = queryParams.get("name");
  const friend = friends.find((f) => f.Firstname?.toLowerCase() === name?.toLowerCase());

  // Fetch weather once the friend is found
  useEffect(() => {
    if (friend) {
      fetchWeather(friend.Location);
    }
  }, [friend]);

  if (!friend) {
    return <div className="app-container">Friend not found</div>;
  }

  return (
    <div className="app-container">
      <Goback />
      <h1 className = "title ">{`${friend.Firstname} ${friend.Lastname}'s Weather`}</h1> <EditList name = {name} friend = {friend} className="editList" />
      {error && <div className="error">{error}</div>}
      {weather && (
        <div className="weather-card">
         
          <p><strong>Gender:</strong> {friend.Gender}</p>
          <p><strong>Age:</strong> {friend.Age}</p>
          <p><strong>MBTI:</strong> {friend.MBTI}</p>
          <p><strong>Preferred Weather:</strong> {friend.PreferredWeather}</p>
          <div className="weather-details">
            <div className="weather-header">
              <div className = "weather-content">
                <h2>{weather.location.name}</h2>
                <p>{`${weather.current.temperature}°C`}</p>
                <img
                  src={weather.current.weather_icons[0]}
                  alt={weather.current.weather_descriptions[0]}
                  className="weather-icon"
                />
              </div>
            </div>
            <p><strong>Visibility:</strong> {weather.current.visibility} Km</p>
            <p><strong>Pressure:</strong> {weather.current.pressure} mbar</p>
            <p><strong>Humidity:</strong> {weather.current.humidity}%</p>
            <p><strong>Wind Direction:</strong> {weather.current.wind_dir}</p>
            <p><strong>Wind Speed:</strong> {weather.current.wind_speed} km/h</p>
            <p><strong>Chance of Rain:</strong> {weather.current.precip}%</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Detail;
