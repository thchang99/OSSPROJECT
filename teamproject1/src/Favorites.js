import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import './style.css';
import CreateList from './CreateList';
import Goback from "./Goback";

export default function Favorites() {
  const [friends, setFriends] = useState([]);
  const [friendsWeather, setFriendsWeather] = useState([]);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState("name-asc");
  const [filterText, setFilterText] = useState("");
  const navigate = useNavigate();

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

  // Fetch weather data for friends
  useEffect(() => {
    const fetchFriendsWeather = async () => {
      if (friends.length === 0) return;

      const updatedFriendsWeather = await Promise.all(
        friends.map(async (friend) => {
          try {
            const response = await axios.get(
              `http://api.weatherstack.com/current?access_key=13af3a2071d9cca0f706ad408c7f19ad&query=${friend.Location}`
            );
            return {
              ...friend,
              weather: {
                location: response.data.location.name,
                time: response.data.location.localtime,
                temperature: response.data.current.temperature,
                iconUrl: response.data.current.weather_icons[0],
              },
            };
          } catch (error) {
            console.error(`Error fetching weather for ${friend.Firstname}:`, error);
            return { ...friend, weather: null };
          }
        })
      );

      setFriendsWeather(updatedFriendsWeather);
    };

    fetchFriendsWeather();
  }, [friends]);

  const handleCardClick = (firstName) => {
    navigate(`/detail?name=${firstName}`);
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
    let sortedFriends = [...friendsWeather];

    switch (event.target.value) {
      case "name-asc":
        sortedFriends.sort((a, b) => a.Firstname.localeCompare(b.Firstname));
        break;
      case "name-desc":
        sortedFriends.sort((a, b) => b.Firstname.localeCompare(a.Firstname));
        break;
      case "location-asc":
        sortedFriends.sort((a, b) => 
          (a.weather?.location || "").localeCompare(b.weather?.location || "")
        );
        break;
      case "location-desc":
        sortedFriends.sort((a, b) => 
          (b.weather?.location || "").localeCompare(a.weather?.location || "")
        );
        break;
      default:
        break;
    }

    setFriendsWeather(sortedFriends);
  };

  const filteredFriendsWeather = friendsWeather.filter((friend) => {
    if (sortOption.includes("name")) {
      return friend.Firstname.toLowerCase().includes(filterText.toLowerCase());
    } else if (sortOption.includes("location")) {
      return friend.weather?.location?.toLowerCase().includes(filterText.toLowerCase());
    }
    return true;
  });

  return (
    <>
    <Goback/>
    <Container>
      <h1 className="favoriteTitle">Weather Around the World</h1>
      <div className="createList"><CreateList /></div>
      

      {error && <p className="error">{error}</p>}

      {/* Sorting and Filtering */}
      <div>
        <h3 className="friendsTitle">Friends</h3>
        <div className="sort-options">
          <label htmlFor="sort">Sort by: </label>
          <select id="sort" value={sortOption} onChange={handleSortChange}>
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
            <option value="location-asc">Location A-Z</option>
            <option value="location-desc">Location Z-A</option>
          </select><span>  </span>

          <label htmlFor="filter">Filter:</label>
          <input
            id="filter"
            type="text"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            placeholder={sortOption.includes("name") ? "Filter by name" : "Filter by location"}
          />
        </div>
      </div>
      
      

      {/* Friends' Weather */}
      <div className="friends">
        
        <div className="cities">
          {filteredFriendsWeather.map((friend) => (
            <div 
              key={friend.id} 
              className="card" 
              style={{ cursor: 'pointer' }}
              onClick={() => handleCardClick(friend.Firstname)}
            >
              <div className="name">
                <span className="firstName">{`${friend.Firstname}`} </span><br/>
                <span className="lastName">{`${friend.Lastname}`} </span>
              </div>
              
              {friend.weather ? (
                <>
                  <div className="cardCity">{friend.weather.location}</div>
                  <div className="cardTime">{friend.weather.time}</div>
                  <div className="cardTemperature">{friend.weather.temperature}°C</div>
                  <img
                    src={friend.weather.iconUrl}
                    alt="Weather Icon"
                    className="cardIcon"
                  />
                </>
              ) : (
                <p>Weather data unavailable</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </Container>
    </>
    
  );
}