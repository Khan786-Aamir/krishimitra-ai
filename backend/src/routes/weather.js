const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  const location = req.query.location || 'Ludhiana, India';

  // Check if API key is configured and not default placeholder
  const isKeyValid = apiKey && apiKey !== 'your_openweather_api_key' && apiKey.trim() !== '';

  if (isKeyValid) {
    try {
      // Fetch live weather data using native node fetch (available in Node 18+)
      const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(location)}&limit=1&appid=${apiKey}`;
      const geoResponse = await fetch(geoUrl);
      const geoData = await geoResponse.json();

      if (geoData && geoData.length > 0) {
        const { lat, lon } = geoData[0];
        // Fetch weather forecast (using 5 day / 3 hour forecast for free tier)
        const weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
        const weatherResponse = await fetch(weatherUrl);
        const weatherData = await weatherResponse.json();

        if (weatherData && weatherData.cod === '200') {
          // Format standard OpenWeather response to our premium dashboard structure
          const current = weatherData.list[0];
          
          // Helper to calculate rain probability (pop)
          const rainChance = current.pop ? Math.round(current.pop * 100) : 0;

          // Group by day for 7-day-like forecast
          const dailyForecast = [];
          const seenDays = new Set();
          
          for (const item of weatherData.list) {
            const date = new Date(item.dt * 1000);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
            
            if (!seenDays.has(dayName) && dailyForecast.length < 7) {
              seenDays.add(dayName);
              dailyForecast.push({
                day: dayName,
                temp: Math.round(item.main.temp),
                humidity: item.main.humidity,
                condition: item.weather[0].main.toLowerCase(),
                rainChance: item.pop ? Math.round(item.pop * 100) : 0,
                description: item.weather[0].description
              });
            }
          }

          return res.status(200).json({
            success: true,
            source: 'OpenWeatherMap API',
            data: {
              location: geoData[0].name + ', ' + (geoData[0].state || geoData[0].country),
              current: {
                temp: Math.round(current.main.temp),
                description: current.weather[0].description,
                humidity: current.main.humidity,
                windSpeed: Math.round(current.wind.speed * 3.6), // Convert m/s to km/h
                rainChance,
                uvIndex: 5, // Mocked as openweather free doesn't easily provide UV in 5-day forecast
                sunrise: new Date(weatherData.city.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                sunset: new Date(weatherData.city.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                icon: current.weather[0].main.toLowerCase()
              },
              forecast: dailyForecast
            }
          });
        }
      }
    } catch (error) {
      console.error('Weather Service API error, falling back to mock:', error.message);
    }
  }

  // Fallback Premium simulated JSON
  // Simulates seasonal Punjab weather (July hot & rainy monsoon season)
  const today = new Date();
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const mockForecast = Array.from({ length: 7 }).map((_, idx) => {
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + idx);
    const dayName = daysOfWeek[nextDate.getDay()];
    
    // Vary conditions slightly
    let condition = 'sunny';
    let temp = 33 + (idx % 3);
    let rainChance = 10;
    let desc = 'Clear sunny sky';

    if (idx === 1) {
      condition = 'cloudy';
      temp = 31;
      rainChance = 40;
      desc = 'Overcast clouds';
    } else if (idx === 2 || idx === 5) {
      condition = 'rainy';
      temp = 29;
      rainChance = 75;
      desc = 'Moderate rainfall';
    } else if (idx === 3) {
      condition = 'thunderstorm';
      temp = 28;
      rainChance = 90;
      desc = 'Severe thunderstorm alerts';
    }

    return {
      day: dayName,
      temp,
      humidity: 60 + (idx * 3) % 25,
      condition,
      rainChance,
      description: desc
    };
  });

  return res.status(200).json({
    success: true,
    source: 'Simulation Service (Offline Fallback)',
    data: {
      location: location,
      current: {
        temp: 32,
        description: 'scattered clouds',
        humidity: 68,
        windSpeed: 14,
        rainChance: 35,
        uvIndex: 8,
        sunrise: '05:38 AM',
        sunset: '07:22 PM',
        icon: 'cloudy'
      },
      forecast: mockForecast
    }
  });
});

module.exports = router;
