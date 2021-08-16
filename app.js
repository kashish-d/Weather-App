let container;
window.addEventListener('load',()=>{
    resolutionCheck()
});
window.addEventListener('resize',resolutionCheck);
function resolutionCheck(){
    if(window.innerWidth > 999){
        container = '.master-container'
    }
    else{
        container = '.mobile-container'
    }
    console.log(container);
    main()
}

function main() {
    let units = "metric";
    let globalVarLatitude = "29.3868068";
    let globalVarLongitude = "76.95277229999999";
    let milesConversion = 1; 
    const apiKey = config.MY_KEY;

    let hours = document.querySelectorAll(`${container} .hours`);
    const mainBox = document.querySelector(`${container} .main-box`);
    const slidingSection = document.querySelector(`${container} .sliding-section`);
    const prevBtn = document.querySelector(`.previous`);
    const nextBtn = document.querySelector(`.next`);
    const today = document.querySelector(`${container} .today`);
    const week = document.querySelector(`${container} .week`);
    const weekSection = document.querySelector(`${container} .week-weather-section`);
    const daySection = document.querySelector(`${container} .tab-content`);
    const celsius = document.querySelector(`${container} .celsius`);
    const fahrenheit = document.querySelector(`${container} .fahrenheit`);

    const currentTempValue = document.querySelector(`${container} .temp-value`);
    const currentDay = document.querySelector(`${container} .date`);
    const currentTime = document.querySelector(`${container} .time`);
    const feelLike = document.querySelector(`${container} .feellike-value`);
    const currentWeatherType = document.querySelector(`${container} .weathertype-value`);
    const rainChance = document.querySelector(`${container} .rainchance-value`);
    const currentLocation = document.querySelector(`${container} .location-value`);
    const weekWeatherSection = document.querySelector(`${container} .week-weather-section`);
    const hourWeatherSection = document.querySelector(`${container} .sliding-section`);
    const weatherIconDiv = document.querySelector(`${container} .weather-icon`);
    const uvValue = document.querySelector(`${container} .uv-value`);
    const windValue = document.querySelector(`${container} #wind-value`);
    const sunriseValue = document.querySelector(`.sunrise-value`);
    const sunsetValue = document.querySelector(`.sunset-value`);
    const humidityValue = document.querySelector(`${container} #humidity-value`);
    const visibilityValue = document.querySelector(`${container} #visibility-value`);
    const airValue = document.querySelector(`${container} #air-value`);

    const windUnit = document.querySelector(`${container} #wind-unit`);
    const visibilityUnit = document.querySelector(`${container} #visibility-unit`);
    const currentTempUnit = document.querySelector(`.temp-unit`);
    const feelLikeUnit = document.querySelector(`${container} .feellike-unit`);

    const currentLocationSearch = document.querySelector(`${container} .current-location-search`);
    const searchInput = document.querySelector(`${container} .search`);

    const errorMessage  = document.querySelector(`${container} .message-box p`);
    // console.log(rainChance);
    currentLocationSearch.addEventListener("dblclick",()=>{return;});


    // For current Location. It updates the location by itself
    currentLocationSearch.addEventListener("click", () => {
        searchInput.value = "";
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                console.log(position);
                const { latitude, longitude } = position.coords;
                getData(latitude, longitude);
                globalVarLatitude = latitude;
                globalVarLongitude = longitude;
                setTimeout(() => {
                    const locationRequest = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
                    fetch(locationRequest)
                        .then((response) => response.json())
                        .then((locationResult) => {
                            // console.log(locationResult);
                            currentLocation.textContent = `${locationResult.name}, ${locationResult.sys.country}`;
                            console.log(currentLocation);
                        }, 0);
                });
            });
        } else {
            console.log('Hello');
            errorMessage.textContent = 'Location permission Denied!';
            errorMessage.style.visibility = 'visible';
            setTimeout(()=>{
                errorMessage.style.visibility = 'hidden';
            },10000)
        }
    });


    // For Searching a place, also sets the location 
    searchInput.addEventListener("keydown", (e) => {
        if (e.keyCode === 13) {
            let searchLocation = searchInput.value;
            const locationRequest = `https://api.openweathermap.org/data/2.5/weather?q=${searchLocation}&appid=${apiKey}&units=metric`;
            fetch(locationRequest).then((response) => response.json())
                .then((locationResult) => {
                    // console.log(locationResult);
                    if (locationResult.cod != 200) {
                        errorMessage.textContent = "Not Found. Follow the format 'city,state,country'";
                        errorMessage.style.visibility = 'visible';
                        setTimeout(()=>{
                            errorMessage.style.visibility = 'hidden';
                        },10000)
                    } else {
                        const { lat, lon } = locationResult.coord;
                        currentLocation.textContent = `${locationResult.name}, ${locationResult.sys.country}`;
                        getData(lat, lon);
                        globalVarLatitude = lat;
                        globalVarLongitude = lon;
                        setTimeout(() => {
                            searchInput.value = "";
                        }, 0);
                    }
                });
        }
    });


    // This gets the api data and calls the updating function
    function getData(latitude, longitude) {
        const oneCallApi = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts,minutely&appid=${apiKey}&units=${units}`;
        fetch(oneCallApi)
            .then((response) => response.json())
            .then((data) => {
                try {
                    updateData(data);
                    // console.log(data);
                } catch {
                    console.log(data);
                    alert("Some error occurred, Please report the developer");
                    errorMessage.textContent = 'Some error Occurred!'
                    errorMessage.style.visibility = 'visible';
                    setTimeout(()=>{
                        errorMessage.style.visibility = 'hidden';
                    },10000)
                    location.reload();
                }
            });
    }

    // Main function, refreshes and suplies all the data from api to certail DOM elements.
    // Many functions are being called here.
    function updateData(data) {
        errorMessage.textContent = '';
        errorMessage.style.visibility = 'hidden';
        const currentWeatherIcon = data.current.weather[0].icon;
        const uvIndex = Math.ceil(data.current.uvi);
        const windDirectionValue = data.current.wind_deg;
        const humidityValuesData = data.current.humidity;
        const visibilityValuesData = (data.current.visibility * 0.001).toFixed(1);
        const today = date(data.current.dt, data.timezone_offset);
        const sunriseDate = date(data.current.sunrise, data.timezone_offset);
        const sunsetDate = date(data.current.sunset, data.timezone_offset);
        let airValuesData;
            
        currentTempValue.textContent = `${Math.ceil(data.current.temp)}`;
        currentDay.textContent = `${today.day}`;
        currentTime.textContent = `${today.hours}:${today.minutes} ${today.session}`;
        feelLike.textContent = `${Math.ceil(data.current.feels_like)}°`;
        currentWeatherType.textContent = `${data.current.weather[0].description}`;
        rainChance.textContent = `${data.hourly[0].pop * 100}%`;
        weatherIconDiv.innerHTML ='<canvas id="weather-icon-canvas" width="140" height="140"></canvas>';
        iconSet(currentWeatherIcon,document.getElementById("weather-icon-canvas"));
        uvValue.textContent = uvIndex;
        windValue.textContent = `${(data.current.wind_speed * 3.6).toFixed(2)}`;
        sunriseValue.textContent = `${sunriseDate.hours}:${sunriseDate.minutes} ${sunriseDate.session}`;
        sunsetValue.textContent = `${sunsetDate.hours}:${sunsetDate.minutes} ${sunsetDate.session}`;
        visibilityValue.textContent = visibilityValuesData * milesConversion;
        humidityValue.textContent = humidityValuesData;
        
        weeklyUpdate(data);
        uvBarUpdate(uvIndex);
        windDirection(windDirectionValue);
        setTimeout(() => {
            hourlyUpdate(data);
            updateMeter(humidityValuesData, airValuesData);
            remarkUpdate(humidityValuesData,visibilityValuesData,airValuesData);
        }, 0);
    }
    

    // Gives object having day and time(24-hr format)
    function date(timestamp, timezone_offset) {
        const days = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
        ];

        // Not using anywhere so nested it here
        function formatting_date(i) {
            if (i < 10) {
                i = "0" + i;
            }
            return i;
        }

        //1000 to convert unix seconds timestamp to milliseconds for js
        let today = new Date((timestamp + timezone_offset) * 1000);
        let hours = today.getUTCHours();
        let minutes = today.getUTCMinutes();
        let session = "AM";
        if(hours == 12){
            session = "PM"
        }else if (hours == 0) {
            hours = 12;
        }
        if (hours > 12) {
            hours = hours - 12;
            session = "PM";
        }
        hours = formatting_date(hours);
        minutes = formatting_date(minutes);

        let date = {
            day: `${days[today.getUTCDay()]}`,
            hours: `${hours}`,
            minutes: `${minutes}`,
            session: `${session}`,
        };
        return date;
    }

    // sets the weather icon after taking the icon value from one call api
    function iconSet(icon, iconID) {
        const iconPack = {
            "01d": "CLEAR_DAY",
            "01n": "CLEAR_NIGHT",
            "02d": "PARTLY_CLOUDY_DAY",
            "02n": "PARTLY_CLOUDY_NIGHT",
            "03d": "CLOUDY",
            "03n": "CLOUDY",
            "04d": "CLOUDY",
            "04n": "CLOUDY",
            "09d": "SHOWERS_DAY",
            "09n": "SHOWERS_NIGHT",
            "10d": "THUNDER_SHOWERS_DAY",
            "10n": "THUNDER_SHOWERS_NIGHT",
            "11d": "THUNDER_RAIN",
            "11n": "THUNDER_RAIN",
            "13d": "SNOW",
            "13n": "SNOW",
            "50d": "FOG",
            "50n": "FOG",
        };

        var skycons = new Skycons({
            monochrome: "false",
            color: {
                main: "hsl(185deg 97% 73%)",
                cloud: "hsl(195deg 100% 60%)",
                light_cloud: "hsl(188deg 99% 59%)",
                dark_cloud: "hsl(227deg 100% 63%)",
                thunder: "hsl(45deg 100% 51%)",
                rain: "hsl(214deg 77% 65%)",
                sun: "hsl(43deg 100% 62%)",
                moon: "hsl(0deg 0% 82%)",
                snow: "hsl(182deg 100% 80%)",
                fog: "hsl(212deg 95% 92%)",
            },
        });
        // console.log(iconID);
        const customIcon = iconPack[icon];
        if(iconID.id == 'weather-icon-canvas'){
            skycons.play();
        }
        return skycons.set(iconID, Skycons[customIcon]);
    }

    // Reponsible for providing data to week tab
    function weeklyUpdate(data) {
        let weekHtml = "";
        let dailyIconObj = {};
        for (let i = 1; i < 8; i++) {
            let dailyDate = date(
                data.daily[i].dt,
                data.timezone_offset
            ).day.slice(0, 3);
            let dailyHigh = Math.ceil(data.daily[i].temp.max);
            let dailyLow = Math.ceil(data.daily[i].temp.min);
            let dailyIcon = data.daily[i].weather[0].icon;
            weekHtml += `<div id="day-${i}" class="days">
                        <p id="day${i}-name" class="day-name">${dailyDate}</p>
                        <div id="day${i}-icon" class="day-weather-icon">
                            <canvas id="day${i}-icon-canvas" width="110" height="110"></canvas>
                        </div>
                        <div id="day${i}-temperature" class="day-temperature">
                            <p id="day${i}-temp-high" class="day-temp-high">${dailyHigh}°</p>
                            <p id="day${i}-temp-low" class="day-temp-low">${dailyLow}°</p>
                        </div>
                    </div>`;
            dailyIconObj[`day${i}-icon-canvas`] = dailyIcon;
        }
        weekWeatherSection.innerHTML = weekHtml;
        for (let key in dailyIconObj) {
            let iconId = document.querySelector(`#${key}`);
            iconSet(dailyIconObj[key], iconId);
        }
    }

    // Reponsible for providing data to today tab
    function hourlyUpdate(data) {
        let hourHtml = "";
        let hourlyIconObj = {};
        for (let i = 1; i < 25; i++) {
            let hourlyDate = date(data.hourly[i].dt, data.timezone_offset);
            let hourlyTime = `${
                hourlyDate.hours
            } ${hourlyDate.session.toLowerCase()}`;
            let hourlyFeelsLike = Math.ceil(data.hourly[i].feels_like);
            let hourlyTemp = Math.ceil(data.hourly[i].temp);
            let hourlyIcon = data.hourly[i].weather[0].icon;
            hourHtml += `<div id="hour-${i}" class="hours">
                        <p id="hour${i}-name" class="day-name">${hourlyTime}</p>
                        <div id="hour${i}-icon" class="day-weather-icon">
                            <canvas id="hour${i}-icon-canvas" width="110" height="110"></canvas>
                        </div>
                        <div id="hour1-temperature" class="day-temperature">
                            <p id="hour${i}-temp" class="day-temp-high">${hourlyTemp}°</p>
                            <p id="hour${i}-temp-feelslike" class="day-temp-low">${hourlyFeelsLike}°</p>
                        </div>
                    </div>`;
            hourlyIconObj[`hour${i}-icon-canvas`] = hourlyIcon;
        }
        hourWeatherSection.innerHTML = hourHtml;
        for (let key in hourlyIconObj) {
            let iconId = document.querySelector(`#${key}`);
            iconSet(hourlyIconObj[key], iconId);
        }
        // hours is updating here otherwise the default ones already in html remain in this hours variable. Need this for the sliding
        hours = document.querySelectorAll(`${container} .hours`);
    }

    // Updating the uv radial bar
    function uvBarUpdate(uvIndex = 5) {
        let progressColor = "";
        const progressBar = document.querySelector(`${container} .outer-box .progress`);
        if (uvIndex > 11) {
            uvIndex = 11;
        }
        if (uvIndex <= 2) {
            progressColor = "green";
        } else if (uvIndex <= 5) {
            progressColor = "yellow";
        } else if (uvIndex <= 7) {
            progressColor = "orange";
        } else if (uvIndex <= 10) {
            progressColor = "red";
        } else {
            progressColor = "red";
        }
        document.documentElement.style.setProperty("--progress", progressColor);
        progressBar.style.transform = `rotate(${
            45 + 16.363636363636363 * uvIndex
        }deg)`;
        // (180/11) = 16.363636363636363, 180 is no of degree to rotate and 11 is highest value and 45deg to get the progress bar to proper position, remove overlay to understand
    }

    // rotating the wind direction icon according to the value
    // http://snowfence.umn.edu/Components/winddirectionanddegrees.htm
    function windDirection(windDirectionValue) {
        const windPointer = document.querySelector(`${container} #wind-direction`);
        windPointer.style.transform = `rotate(${windDirectionValue + 135}deg)`;
    }

    // setting humidity meter according to value
    function updateMeter(humidityValuesData, airValuesData = 4) {
        document.querySelector(`${container} #humidity-meter .indicator`).style.transform = `translateY(-${(humidityValuesData / 100) * 280}%)`;
        document.querySelector(`${container} #air-meter .indicator`).style.transform = `translateY(-${airValuesData * 56}%)`;
        // 280/5 =  56
    }

    // updating remarks
    function remarkUpdate(humidityValuesData,visibilityValuesData,airValuesData = 4) {
        let humidityRemarks;
        let visibilityRemarks;
        let airRemarks;
        const remarks = [
            "Low👎🏻",
            "Unhealthy👎🏻",
            "Average🙁",
            "Fair👍🏻",
            "Normal😀",
            "Good😄",
            "High🖐🏻",
            "Dangerous💀",
            "Very high👀",
        ];
        if (humidityValuesData < 8) {
            humidityRemarks = remarks[0];
        } else if (humidityValuesData < 15) {
            humidityRemarks = remarks[3];
        } else if (humidityValuesData < 35) {
            humidityRemarks = remarks[4];
        } else if (humidityValuesData < 60) {
            humidityRemarks = remarks[6];
        } else {
            humidityRemarks = remarks[8];
        }

        if (visibilityValuesData < 1) {
            visibilityRemarks = remarks[7];
        } else if (visibilityValuesData < 3) {
            visibilityRemarks = remarks[2];
        } else if (visibilityValuesData < 5) {
            visibilityRemarks = remarks[3];
        } else if (visibilityValuesData < 7) {
            visibilityRemarks = remarks[4];
        } else {
            visibilityRemarks = remarks[5];
        }

        if (airValuesData <= 1) {
            airRemarks = remarks[5];
        } else if (airValuesData == 2) {
            airRemarks = remarks[3];
        } else if (airValuesData == 3) {
            airRemarks = remarks[2];
        } else if (airValuesData == 4) {
            airRemarks = remarks[1];
        } else {
            airRemarks = remarks[7];
        }

        document.querySelector(`${container} #visibility-remarks`).textContent =
            visibilityRemarks;
        document.querySelector(`${container} #humidity-remarks`).textContent =
            humidityRemarks;
        document.querySelector(`${container} #air-remarks`).textContent = airRemarks;
    }

    // Celsius, calls the getData function with changed metrics
    celsius.addEventListener("click", () => {
        celsius.classList.add("unit-option-active");
        fahrenheit.classList.remove("unit-option-active");
        milesConversion = 1;
        units = "metric";
        getData(globalVarLatitude, globalVarLongitude);
        windUnit.textContent = "km/h";
        visibilityUnit.textContent = "km";
        feelLikeUnit.textContent = "C";
        currentTempUnit.textContent = "°C";
    });

    // Fahrenheit, calls the getData function with changed metrics
    fahrenheit.addEventListener("click", () => {
        milesConversion = 0.62; //Have to manually convert because the api isn't doing it.
        celsius.classList.remove("unit-option-active");
        fahrenheit.classList.add("unit-option-active");
        units = "imperial";
        getData(globalVarLatitude, globalVarLongitude);
        windUnit.textContent = "mph";
        visibilityUnit.textContent = "miles";
        feelLikeUnit.textContent = "F";
        currentTempUnit.textContent = "°F";
    });


    // CAROUSEL OF HOURLY WEATHER SECTION
    let counter = 0;
    const no_of_columns = 6;
    let columnSize = 0;
    let totalSize = 0;

    //For carosel
    prevBtn.addEventListener("click", () => {
        if (counter <= 0) return;
        counter--;
        prevBtn.classList.add("slide-active");
        nextBtn.classList.add("slide-active");
        slidingSection.style.transform = `translateX(-${
            totalSize * counter
        }px)`;
        if (counter === 0) {
            prevBtn.classList.remove("slide-active");
        }
    });

    // For carousel
    nextBtn.addEventListener("click", () => {
        if (counter >= hours.length / no_of_columns - 1) return;
        counter++;
        nextBtn.classList.add("slide-active");
        prevBtn.classList.add("slide-active");
        slidingSection.style.transform = `translateX(-${totalSize * counter}px)`;
        if (counter === hours.length / no_of_columns - 1) {
            nextBtn.classList.remove("slide-active");
        }
    });

    // tab switching
    today.addEventListener("click", () => {
        today.classList.add("tab-active");
        week.classList.remove("tab-active");
        daySection.style.display = "flex";
        weekSection.style.display = "none";
        columnSize = hours[0].getBoundingClientRect().width;
        totalSize = (6 + columnSize) * no_of_columns;
        console.log(totalSize);
    });
    week.addEventListener("click", () => {
        today.classList.remove("tab-active");
        week.classList.add("tab-active");
        daySection.style.display = "none";
        weekSection.style.display = "grid";
    });

    
    // Search input for mobile resolutions. 
    const mobileSearch = document.querySelector(`.mobile-container .search-icon`);
    const locationBox = document.querySelector(`.mobile-container .location`);
    mobileSearch.addEventListener('click',searchActive);
    locationBox.addEventListener('click',searchActive);
    function searchActive(){
        searchInput.style.display = 'block';
        locationBox.style.display = 'none';
        searchInput.focus();
    }
    mobileSearch.addEventListener('blur',searchActive);
    searchInput.addEventListener('blur',locationActive);
    function locationActive(){
        if(container == '.mobile-container'){
            searchInput.style.display = 'none';
            locationBox.style.display = 'flex';
        }
    }
}
