const WEATHER_URL = "https://api.open-meteo.com/v1/forecast?latitude=43.548363&longitude=-79.661718&current=temperature_2m,apparent_temperature,precipitation,rain,showers,snowfall&timezone=America%2FNew_York&forecast_days=1";

// Messages for the recommendations
const msg_temps = ["it's cold outside", "it's mild outside.. i mean, it's aight", "it's warm outside!"];    // 0 = cold, 1 = mild, 2 = warm
const msg_precip = ["", "it's also raining outside.. get an umbrella and some rainboots", "it's also snowing outside.. bring on the pain!"];  // 0 = no precipitation, 1 = raining, 2 = snowing


// page elements
let outfitContainer = document.querySelector("#outfitcontainer");
let recommendBtn = document.getElementById("recommendbtn");
let recommendText = document.getElementById("recommendation");

// booleans for the different weather conditions
let isRaining = false;
let isSnowing = false;
let isCold = false;
let isMild = false;
let isWarm = false;

// fetch from the API
fetch(WEATHER_URL)
.then(response => response.json())
.then((data) => {
    let temperature = data.current.temperature_2m;
    let feelsLike = data.current.apparent_temperature;
    let rain = data.current.rain;
    let snow = data.current.snowfall;

    isRaining = rain > 0;
    isSnowing = snow > 0;
    isCold = feelsLike <= 5;
    isMild = feelsLike > 5 && feelsLike <= 18;
    isWarm = feelsLike >= 19;
    
    document.querySelector("#weather-slot-1").textContent = "Temperature: " + temperature + "°C";
    document.querySelector("#weather-slot-2").textContent = "Feels Like: " + feelsLike + "°C";
    document.querySelector("#weather-slot-3").textContent = "Rain: " + rain + "mm";
    document.querySelector("#weather-slot-4").textContent = "Snow: " + snow + "mm";
});

/*
 * Grab the weather from the API and return the string corresponding to the current temps
 */
function getTempString() {
    if (isCold) {
        return msg_temps[0];
    }
    else if (isMild) {
        return msg_temps[1];
    }
    else if (isWarm) {
        return msg_temps[2];
    }
}

/*
 * Grab the weather from the API and return the string corresponding to the current precipitation
 */
function getPrecipString() {
    if (isSnowing) {
        return msg_precip[2];
    }
    else if (isRaining) {
        return msg_precip[1];
    }
    else {
        return msg_precip[0];
    }
}


/*
    unhide the `outfitcontainer` and show the clothes you'll need for the given weather
*/
function recommendClothes() {
    recommendText.textContent = getTempString() + " " + getPrecipString();
    outfitContainer.hidden = false;
}

recommendBtn.addEventListener("click", recommendClothes);