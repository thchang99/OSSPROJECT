import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container } from 'react-bootstrap';
import './style.css';
import { Link } from 'react-router-dom';
import Goback from './Goback';

export default function List() {
  const [popularCity, setPopularCity] = useState([
    {
      id: "1",
      cityName: "Seoul",
      countryIconUrl: "https://flagsapi.com/KR/flat/64.png",
    },
    {
      id: "2",
      cityName: "Paris",
      countryIconUrl: "https://flagsapi.com/FR/flat/64.png",
    },
    {
      id: "3",
      cityName: "Rome",
      countryIconUrl: "https://flagsapi.com/IT/flat/64.png",
    },
    {
      id: "4",
      cityName: "Berlin",
      countryIconUrl: "https://flagsapi.com/DE/flat/64.png",
    },
    {
      id: "5",
      cityName: "Tokyo",
      countryIconUrl: "https://flagsapi.com/JP/flat/64.png",
    }
  ]);

  const [popularCityWeather, setPopularCityWeather] = useState({});
  const [friends, setFriends] = useState([]);
  const [friendWeather, setFriendWeather] = useState(null);
  const [error, setError] = useState(null);

  const WEATHER_API_BASE = "http://api.weatherstack.com/current";
  const WEATHER_API_KEY = "199759931fe3027f4ba48f8282a12478";

  // Fetch weather data for popular cities (cached)
  useEffect(() => {
    const fetchPopularCityWeather = async () => {
      const updatedWeather = { ...popularCityWeather };

      const citiesToFetch = popularCity.filter(
        (city) => !updatedWeather[city.cityName]
      );

      if (citiesToFetch.length > 0) {
        try {
          const responses = await Promise.all(
            citiesToFetch.map((city) =>
              axios.get(
                `${WEATHER_API_BASE}?access_key=${WEATHER_API_KEY}&query=${city.cityName}`
              )
            )
          );

          responses.forEach((response, index) => {
            const cityName = citiesToFetch[index].cityName;
            updatedWeather[cityName] = {
              time: response.data.location.localtime,
              temperature: response.data.current.temperature,
              iconUrl: response.data.current.weather_icons[0],
            };
          });

          setPopularCityWeather(updatedWeather);
        } catch (error) {
          console.error("Error fetching popular cities' weather:", error);
        }
      }
    };

    fetchPopularCityWeather();
  }, [popularCity, popularCityWeather]);

  // Fetch friends data
  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await axios.get(
          "https://674d0abe54e1fca9290e27b0.mockapi.io/favorites/favorites"
        );
        setFriends(response.data);
      } catch (err) {
        console.error("Failed to fetch friends data.", err);
        setError("Failed to fetch friends data.");
      }
    };

    fetchFriends();
  }, []);

  // Fetch weather for the specific friend's location (cached)
  useEffect(() => {
    const friend = friends.find((f) => f.id === "0");

    if (friend && !friendWeather) {
      const fetchFriendWeather = async () => {
        try {
          const response = await axios.get(
            `${WEATHER_API_BASE}?access_key=${WEATHER_API_KEY}&query=${friend.Location}`
          );
          setFriendWeather({
            location: response.data.location.name,
            time: response.data.location.localtime,
            temperature: response.data.current.temperature,
            iconUrl: response.data.current.weather_icons[0],
          });
        } catch (err) {
          console.error("Failed to fetch weather data for friend.", err);
          setError("Failed to fetch weather data.");
        }
      };

      fetchFriendWeather();
    }
  }, [friends, friendWeather]);

  return (
    <Container>
      <h1>Weather Around the World</h1>

      {/* Friend's Weather */}
      {friends.find((f) => f.id === "0") ? (
        <div className="favorite">
          <h3>My Friend's Weather > <Link to="/favorites" className="more">More</Link></h3>
          <div className="card">
            <div className="name">
              <span className="firstName">{`${friends[0]?.Firstname}`} </span><br/>
              <span className="lastName">{`${friends[0]?.Lastname}`} </span>
            </div>
            {friendWeather ? (
              <>
                <div className="cardCity">{friendWeather.location}</div>
                <div className="cardTime">{friendWeather.time}</div>
                <div className="cardTemperature">{friendWeather.temperature}°C</div>
                <img
                  src={friendWeather.iconUrl}
                  alt="Weather Icon"
                  className="cardIcon"
                />
              </>
            ) : (
              <p>Loading weather data...</p>
            )}
          </div>
        </div>
      ) : (
        <p>No friend found or query parameter missing.</p>
      )}

      {/* Popular Cities */}
      <div className="popular">
        <h3>Popular</h3>
        <div className="cities">
          {popularCity.map((city) => (
            <div key={city.id} className="card">
              <img
                src={city.countryIconUrl}
                alt={`${city.cityName} Flag`}
                className="cardCountry"
              />
              <div className="cardCity">{city.cityName}</div>
              <div className="cardTime">
                {popularCityWeather[city.cityName]?.time || "Loading..."}
              </div>
              <div className="cardTemperature">
                {popularCityWeather[city.cityName]?.temperature || "-"}°C
              </div>
              {popularCityWeather[city.cityName]?.iconUrl && (
                <img
                  src={popularCityWeather[city.cityName].iconUrl}
                  alt="Weather Icon"
                  className="cardIcon"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}
