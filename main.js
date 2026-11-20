let WEATHER_URL = "https://api.open-meteo.com/v1/forecast?latitude=43.548363&longitude=-79.661718&current=temperature_2m,apparent_temperature,precipitation,rain,showers,snowfall&timezone=America%2FNew_York&forecast_days=1";

fetch(WEATHER_URL)
.then(response => response.json())
.then((data) => {
    let temperature = data.current.temperature_2m;
    let feelsLike = data.current.apparent_temperature;
    let rain = data.current.rain;
    let snow = data.current.snowfall;
    
    document.querySelector("#slot-1").textContent = "Temperature: " + temperature + "C";
    document.querySelector("#slot-2").textContent = "Feels Like: " + feelsLike + "C";
    document.querySelector("#slot-3").textContent = "Rain: " + rain + "mm";
    document.querySelector("#slot-4").textContent = "Snow: " + snow + "mm";
});