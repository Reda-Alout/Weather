import { Card, CardActionArea, CardContent, CardMedia, Typography, Button, TextField, IconButton, Paper, InputBase } from '@mui/material';
import React, { useEffect, useState } from 'react';
import './card.css';
import SearchIcon from '@mui/icons-material/Search';
import Divider from '@mui/material/Divider';
import DirectionsIcon from '@mui/icons-material/Directions';


const weatherIcons = {
    "01d": "https://cdn-icons-png.flaticon.com/512/869/869869.png",
    "01n": "https://cdn-icons-png.flaticon.com/512/869/869862.png",
    "02d": "https://cdn-icons-png.flaticon.com/512/1163/1163624.png",
    "02n": "https://cdn-icons-png.flaticon.com/512/1163/1163625.png",
    "03d": "https://cdn-icons-png.flaticon.com/512/414/414825.png",
    "03n": "https://cdn-icons-png.flaticon.com/512/414/414825.png",
    "04d": "https://cdn-icons-png.flaticon.com/512/414/414825.png",
    "04n": "https://cdn-icons-png.flaticon.com/512/414/414825.png",
    "09d": "https://cdn-icons-png.flaticon.com/512/3076/3076129.png",
    "09n": "https://cdn-icons-png.flaticon.com/512/3076/3076129.png",
    "10d": "https://cdn-icons-png.flaticon.com/512/1146/1146869.png",
    "10n": "https://cdn-icons-png.flaticon.com/512/1146/1146870.png",
    "11d": "https://cdn-icons-png.flaticon.com/512/1163/1163643.png",
    "11n": "https://cdn-icons-png.flaticon.com/512/1163/1163643.png",
    "13d": "https://cdn-icons-png.flaticon.com/512/412/412295.png",
    "13n": "https://cdn-icons-png.flaticon.com/512/412/412295.png",
    "50d": "https://cdn-icons-png.flaticon.com/512/4005/4005901.png",
    "50n": "https://cdn-icons-png.flaticon.com/512/4005/4005901.png"
};

function Temperature() {
    const [city, setCity] = useState(null);
    const [search, setSearch] = useState("");
    const [map, setMap] = useState("");
    const [weatherIcon, setWeatherIcon] = useState("");
    const [timezone, setTimezone] = useState(null);
    const [locationError, setLocationError] = useState("");

    const fetchLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    const url = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=4ebb9418ca605fa1931880e565ec065c`;
                    try {
                        const response = await fetch(url);
                        const resJson = await response.json();
                        setSearch(resJson.name);
                        setMap(resJson.name);
                        setCity(resJson.main);
                        setWeatherIcon(resJson.weather[0].icon);
                        setTimezone(resJson.timezone);
                    } catch (error) {
                        setLocationError("Failed to fetch weather data.");
                    }
                },
                () => {
                    setLocationError("Geolocation permission denied or unavailable.");
                }
            );
        } else {
            setLocationError("Geolocation is not supported by your browser.");
        }
    };

    const fetchCityWeather = async () => {

        setMap(search)
        if (!search) return;
        const url = `http://api.openweathermap.org/data/2.5/weather?q=${search}&units=metric&appid=4ebb9418ca605fa1931880e565ec065c`;
        try {
            const response = await fetch(url);
            const resJson = await response.json();
            setCity(resJson.main);
            setWeatherIcon(resJson.weather[0].icon);
            setTimezone(resJson.timezone);
        } catch (error) {
            console.error("Error fetching data:", error);
            setLocationError("City not found.");
        }
    };

    const getWeatherIconUrl = () => {

        return weatherIcons[weatherIcon];
    };

    const getLocalTime = () => {
        if (timezone === null) return "Loading...";
        const now = new Date();
        const utcOffsetMs = now.getTime() + now.getTimezoneOffset() * 60000;
        const localTime = new Date(utcOffsetMs + timezone * 1000);
        return localTime.toLocaleTimeString();
    };
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Empêche le rechargement de la page par défaut
            fetchCityWeather();
        }
    };
    

    return (
        <div>


            <div className='search'>

                <Paper
                    component="form"
                    sx={{
                        p: '2px 4px', display: 'flex', alignItems: 'center', width: 400,
                        position: 'absolute', left: '38%', top: '1%'
                    }}
                >

                    <InputBase
                        sx={{ ml: 1, flex: 1 }}
                        placeholder="Search City"
                        inputProps={{ 'aria-label': 'search google maps' }}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={handleKeyDown} 

                    />
                    <IconButton type="button" sx={{ p: '10px' }} aria-label="search" onClick={fetchCityWeather}>
                        
                        <SearchIcon />
                    </IconButton>

                </Paper>
            </div>

            <Card className="card" sx={{ maxWidth: 345 }}>
                <CardActionArea>
                    {map ?
                    (<CardMedia
                        component="img"
                        height="140"
                        image={getWeatherIconUrl()}
                        alt="weather icon"
                        sx={{ height: '100%' }}
                    />) :
(                        <Typography gutterBottom variant="h3" component="div">
                            Please choose your city
                        </Typography>)}

                    <CardContent>

                        <Typography gutterBottom variant="h5" component="div">
                            Weather in {map || "your location"}
                        </Typography>

                        {city ? (
                            <>
                                <Typography variant="body1">
                                    Temperature: {city.temp}°C
                                </Typography>

                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    Local Time: {getLocalTime()}
                                </Typography>
                            </>
                        ) : (
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                {locationError || "Loading temperature data..."}
                            </Typography>
                        )}
                        <Button variant="contained" color="primary" onClick={fetchLocation} sx={{ marginTop: 2 }}>
                            Use My Location
                        </Button>
                    </CardContent>
                </CardActionArea>
            </Card>
        </div>
    );
}

export default Temperature;
