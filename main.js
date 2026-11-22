const WEATHER_URL = "https://api.open-meteo.com/v1/forecast?latitude=43.548363&longitude=-79.661718&current=temperature_2m,apparent_temperature,precipitation,rain,showers,snowfall&timezone=America%2FNew_York&forecast_days=1";

// This second API link is just for testing (Shows weather for Manila, Philippines). 
// TODO: Remove this link before submission.
const WEATHER_URL2 = "https://api.open-meteo.com/v1/forecast?latitude=14.6042&longitude=120.9822&current=temperature_2m,apparent_temperature,precipitation,rain,showers,snowfall&timezone=America%2FNew_York&forecast_days=1"

/* 
 * Temperature and precipitation states
 * - Temperature states: 0 = Cold, 1 = Mild, 2 = Warm.
 * - Precipitation states: 0 = None, 1 = raining, 2 = snowing, 3 = both!.
 */
let tempState = 0;
let precipState = 0;    // TODO: What if it is raining and snowing?
let hasGottenRec = false;

// Messages for the recommendations
const msgTemps = ["It's cold outside", "It's mild outside", "It's warm outside!"];
const msgPrecip = ["", "It's also raining...grab an umbrella.", "It's also snowing...dress for warmth!", "There's a chance of rain AND snow right now, expect slushy weather."];

// List of image files
const imgRootPath = "/images/";
const imgTemps = [["Cold_Gloves.png", "Cold_Hat.png", "Cold_Jacket.png"], ["Mild_Sweater.png"], ["Warm_Shorts.png", "Warm_Sunscreen.png"]];
const imgPrecip = [[], ["Rain_Rainboots.png", "Rain_Umbrella.png"], ["Snow_Boots.png"], ["Rain_Rainboots.png", "Rain_Umbrella.png", "Snow_Boots.png"]];

// List of descriptions
const descTemps = [["Wear gloves to avoid getting frostbite", "Wear a hat to protect your ears and trap heat", "You'll need a jacket for warmth"], ["Bring a sweater in case you get cold"], ["Wear shorts for the heat", "Don't forget to protect your skin and wear sunscreen!"]];
const descPrecip = [[], ["Wear rainboots to avoid getting your socks wet", "Bring an umbrella for the rain"], ["Wear snowboots for the snow!"], ["You can wear either rainboots or snowboots today, it's kind of slushy", "Bring an umbrella for the rain", "You can wear either rainboots or snowboots today, it's kind of slushy"]];

// page elements
const outfitContainer = document.querySelector("#outfitcontainer");
const recommendBtn = document.getElementById("recommendbtn");
const recommendText = document.getElementById("recommendation");
const recommendDesc = document.getElementById("clothingItemText");

// fetch from the API
fetch(WEATHER_URL)
.then(response => response.json())
.then((data) => {
    let temperature = data.current.temperature_2m;
    let feelsLike = data.current.apparent_temperature;
    let rain = data.current.rain;
    let snow = data.current.snowfall;

    // Set tempState and precipState according to the legend given above
    // If you don't know: You can add booleans in JS, where true == 1, false == 0.
    tempState = (temperature >= 8 && temperature < 20) + (2 * (temperature >= 20));
    precipState = (rain > 0) + (2*(snow > 0));
    
    document.querySelector("#weather-slot-1").textContent = temperature + "°C";
    document.querySelector("#weather-slot-2").textContent = feelsLike + "°C";
    document.querySelector("#weather-slot-3").textContent = rain + "mm";
    document.querySelector("#weather-slot-4").textContent = snow + "mm";

    //Weather images
    if (rain > 0) {
        document.querySelector("#weather_img").src = "images/Rain.svg"
    }
    else if (snow > 0) {
        document.querySelector("#weather_img").src = "images/Snowflake.svg"
    }

    else {
        document.querySelector("#weather_img").src = "images/Sun.svg"
    }
});

/*
 * This makes sure tempState and precipState stay within allowed values.
 * Assuming that msgTemps.length == imagesTemps.length, and msgPrecip.length == imagesPrecip.length.
 */
function keepStatesInBounds() {
    if (tempState < 0) {
        tempState = 0;
    }
    else if (tempState >= msgTemps.length - 1 || tempState >= imgTemps.length - 1) {
        tempState = msgTemps.length - 1;
    }

    if (precipState < 0) {
        precipState = 0;
    }
    else if (precipState >= msgPrecip.length - 1 || tempState >= imgPrecip.length - 1) {
        precipState = msgPrecip.length - 1;
    }
}

/*
 * unhide the `outfitcontainer` and show the clothes you'll need for the given weather
 */
function recommendClothes() {
    if (hasGottenRec) {
        return;
    }
    //Play bell sound
    let bell = document.getElementById('bell');
    bell.play();
    bell.volume = .3;
    bell.playbackRate = 1.5;


    keepStatesInBounds();
    recommendText.textContent = msgTemps[tempState] + " " + msgPrecip[precipState];
    for (let i = 0; i < imgTemps[tempState].length; i++) {
        let d = document.createElement("img");
        d.src = imgRootPath + imgTemps[tempState][i];
        d.style.height = "17.5vh";
        d.style.maxWidth = "17.5vh";
        d.style.margin = "2vh";
        d.addEventListener("mouseover", function() {
            recommendDesc.textContent = descTemps[tempState][i];
        })
        outfitContainer.appendChild(d);
    }
    for (let i = 0; i < imgPrecip[precipState].length; i++) {
        let d = document.createElement("img");
        d.src = imgRootPath + imgPrecip[precipState][i];
        d.style.height = "17.5vh";
        d.style.maxWidth = "17.5vh";
        d.style.margin = "2vh";
        d.addEventListener("mouseover", function() {
            recommendDesc.textContent = descPrecip[tempState][i];
        })
        outfitContainer.appendChild(d);
    }
    outfitContainer.hidden = false;
    hasGottenRec = true;
}

recommendBtn.addEventListener("click", recommendClothes);
outfitContainer.addEventListener("mouseout", function() {recommendDesc.textContent = "Hover over an item to get a description."});